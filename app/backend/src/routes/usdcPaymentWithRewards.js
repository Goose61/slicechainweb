/**
 * USDC Payment with Employee Commission + Pre-calculated SLICE Rewards
 *
 * Uses the on-chain Payment Splitter Program (upgraded):
 * 1. Splits USDC to Business (98.1%), Platform (1.6%), Employee (0.3%), Vault (0%)
 * 2. Commission goes to the facilitating employee's USDC wallet
 * 3. SLICE rewards are pre-calculated at QR-scan time (customer wallet known
 *    via Phantom's `account` param) and stored in pendingPaymentStore.
 *    When the main tx confirms, blockchain.js fires distributeSlice() immediately
 *    with the pre-calculated amount — no extra DB round-trip, near-instant delivery.
 *    Note: inline minting (mintTo in the same tx) was attempted but causes Phantom
 *    to fail simulation because it re-signs the tx, stripping the backend partial sig.
 */

const express = require('express');
const { 
  PublicKey, 
  Transaction,
  TransactionInstruction,
  SystemProgram
} = require('@solana/web3.js');
const { 
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAccount,
  createBurnInstruction
} = require('@solana/spl-token');
const { Connection } = require('@solana/web3.js');
const BN = require('bn.js');
const Business = require('../models/Business');
const Employee = require('../models/Employee');
const { isBillingEnabled } = require('../config/subscriptionBillingConfig');
const subscriptionBillingService = require('../services/subscriptionBillingService');
const paymentReferenceContextService = require('../services/paymentReferenceContextService');
const subscriptionPaymentTxBuilder = require('../services/subscriptionPaymentTxBuilder');
const pendingPaymentStore = require('../services/pendingPaymentStore');
const weeklyRewardsService = require('../services/weeklyRewardsService');
const { loyaltyRewardForAmount } = require('../services/weeklyRewardsService');
const {
  SLICE_MINT,
  MINT_AUTHORITY_PDA,
  PROCESS_PAYMENT_DISCRIMINATOR
} = require('../services/paymentSplitterInstructionService');
const { attachSolanaPayReference } = require('../utils/solanaPayReference');

const router = express.Router();

const RPC_ENDPOINT = process.env.SOLANA_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_ENDPOINT, 'confirmed');

console.log('🔗 USDC+Commission endpoint using RPC:', RPC_ENDPOINT);

const PAYMENT_SPLITTER_PROGRAM_ID = new PublicKey(
  process.env.PAYMENT_SPLITTER_PROGRAM_ID || 'A9hMU7iAupydd2e2GbjL28iEgZzgfwS5KiQefGYPjkse'
);

const USDC_MINT = new PublicKey(
  process.env.USDC_MINT || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
);

const PLATFORM_FEE_WALLET = new PublicKey(
  process.env.PLATFORM_FEE_WALLET || '6igXXPTNRpjxsJEaBxsKWknNWWBDMfd2FgqcwkZSzDxM'
);
const VAULT_WALLET = new PublicKey(
  process.env.VAULT_WALLET || 'FP8AFP8sxF9f2YDj8kexvhta6Jpr4YJXB456Pi1pxAsx'
);
const TREASURY_WALLET = new PublicKey(
  process.env.TREASURY_WALLET || '9fHWVYfjTvLq5UsPLMpJ73MgebbARd1z7Z9cfYzDRM94'
);

router.get('/', async (req, res) => {
  // Solana Pay spec: wallets must be able to fetch label/icon cross-origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  // Strip headers that confuse some wallet HTTP clients
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');
  try {
    const { businessId } = req.query;

    if (businessId) {
      try {
        const business = await Business.findById(businessId);
        if (business) {
          return res.status(200).json({
            label: business.businessName || 'SlicePay',
            icon: 'https://raw.githubusercontent.com/Goose61/pizzawebnew/refs/heads/main/assets/images/pizza/pizzaimages/main_logo.png'
          });
        }
      } catch (e) { /* Business not found */ }
    }

    res.status(200).json({
      label: 'SlicePay',
      icon: 'https://raw.githubusercontent.com/Goose61/pizzawebnew/refs/heads/main/assets/images/pizza/pizzaimages/main_logo.png'
    });

  } catch (error) {
    console.error('GET USDC+Commission error:', error);
    res.status(500).json({ error: 'Failed to get merchant info' });
  }
});

router.post('/', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');

  try {
    const { account } = req.body || {};
    const { amountUsdc, businessWallet, businessId, reference, sliceToRedeem, employeeId } = req.query;

    console.log('📥 USDC+Commission Payment Request:', { 
      account: account ? `${account.substring(0, 8)}...` : 'MISSING', 
      amountUsdc, 
      businessWallet: businessWallet ? `${businessWallet.substring(0, 8)}...` : 'MISSING',
      employeeId: employeeId || 'none',
      reference: reference || 'none'
    });

    if (!account || typeof account !== 'string') {
      return res.status(400).json({ error: 'Missing account' });
    }
    if (!amountUsdc) {
      return res.status(400).json({ error: 'Missing amountUsdc' });
    }
    if (!businessWallet) {
      return res.status(400).json({ error: 'Missing businessWallet' });
    }

    const originalAmountUsdc = parseFloat(amountUsdc);
    if (Number.isNaN(originalAmountUsdc) || originalAmountUsdc <= 0) {
      return res.status(400).json({ error: 'Invalid amountUsdc' });
    }

    // Load business from DB (needed for subscription billing)
    let business = null;
    if (businessId) {
      try {
        business = await Business.findById(businessId);
      } catch (bizErr) {
        console.warn('Business lookup failed (non-fatal):', bizErr.message);
      }
    }

    // SLICE discount: 1 SLICE = $0.10 discount
    const sliceAmount = sliceToRedeem ? parseFloat(sliceToRedeem) : 0;
    const discountUsd = !Number.isNaN(sliceAmount) && sliceAmount > 0 ? sliceAmount * 0.1 : 0;
    const finalAmountUsdc = Math.max(0, originalAmountUsdc - discountUsd);

    // Subscription billing deduction (per-payment skim)
    let subscriptionDeductionUsd = 0;
    let subscriptionReference = null;
    if (isBillingEnabled()) {
      try {
        if (business) {
          const deduction = subscriptionBillingService.calculateDeductionForPayment(business, originalAmountUsdc);
          subscriptionDeductionUsd = deduction.deductionAmount || 0;
          if (subscriptionDeductionUsd > 0 && reference) {
            await paymentReferenceContextService.save(reference.toString(), {
              setupFeeUsd: deduction.setupFeeUsd || 0,
              subscriptionFeeUsd: deduction.subscriptionFeeUsd || 0,
              businessId: business._id.toString(),
            });
            subscriptionReference = reference;
          }
        }
      } catch (subErr) {
        console.warn('Subscription billing check failed (non-fatal):', subErr.message);
      }
    }

    let customerWallet;
    let businessWalletPubkey;
    try {
      customerWallet = new PublicKey(account);
      businessWalletPubkey = new PublicKey(businessWallet);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid account or businessWallet', details: e.message });
    }

    // Resolve employee commission wallet
    let commissionWalletPubkey = PLATFORM_FEE_WALLET; // Fallback to platform if no employee
    const isGateway = req.query.channel === 'gateway' || req.query.gateway === '1';
    // Gateway checkout: do not pass the merchant USDC ATA twice (business + commission).
    // Duplicate writable accounts break Phantom simulation even when RPC simulate succeeds.
    if (isGateway) {
      // Third distinct USDC ATA (platform + business already used). Merchant commission
      // rebate needs a program upgrade; treasury slot keeps Phantom simulation working.
      commissionWalletPubkey = TREASURY_WALLET;
      console.log('🏪 Gateway mode: commission via treasury USDC ATA (3 unique recipients)');
    } else if (employeeId) {
      try {
        const employee = await Employee.findOne({ employeeId, status: 'active' });
        // Employee model uses wallet.usdcAddress for the USDC token account owner
        const empUsdcWallet = employee?.wallet?.usdcAddress || employee?.wallet?.solanaAddress;
        if (employee && empUsdcWallet) {
          commissionWalletPubkey = new PublicKey(empUsdcWallet);
          console.log(`✅ Employee commission wallet: ${empUsdcWallet.slice(0, 8)}... (${employeeId})`);
        } else {
          console.warn(`⚠️ Employee ${employeeId} not found or no wallet — commission goes to platform`);
        }
      } catch (empErr) {
        console.error('Employee lookup failed:', empErr.message);
      }
    } else {
      console.log('ℹ️  No employeeId — commission goes to platform wallet');
    }

    // ── Pre-calculate SLICE reward ───────────────────────────────────────────
    // The customer wallet is known NOW (Phantom sends it as `account`).
    // Calculate whether they'll earn SLICE so the Anchor program mints it
    // atomically — customer pays, no separate backend transaction needed.
    let sliceRewardToMint = loyaltyRewardForAmount(finalAmountUsdc);
    try {
      const { reward } = await weeklyRewardsService.calculateReward(account, finalAmountUsdc);
      if (reward > 0) sliceRewardToMint = reward;
      console.log(`🍕 SLICE reward: ${sliceRewardToMint} SLICE for ${account.slice(0, 8)}... (minted in tx)`);
    } catch (calcErr) {
      console.warn('⚠️  Could not calculate SLICE reward, using rate fallback:', calcErr.message);
    }

    // Convert to base units (2 decimals) for the on-chain instruction
    const rewardAmountBaseUnits = Math.floor(sliceRewardToMint * 100);

    // Store reference → context so the auto-save path knows the employee, customer,
    // and minted SLICE amount to record in the DB once the tx confirms.
    if (reference) {
      pendingPaymentStore.set(reference, {
        employeeId: employeeId || null,
        customerWallet: account,
        sliceRewardPending: sliceRewardToMint,  // minted on-chain, just needs DB record
        subscriptionReference: subscriptionReference || null,
      });
    }

    // NOTE: Once the transaction confirms (signature available), call:
    //   const { isBillingEnabled, applyCollectionFromReference } = require('../services/subscriptionBillingService');
    //   if (process.env.SUBSCRIPTION_BILLING_ENABLED === 'true' && isBillingEnabled() && subscriptionReference) {
    //     await applyCollectionFromReference(subscriptionReference.toString(), txSignature);
    //   }
    // This is handled by the blockchain confirmation handler (blockchain.js) using the
    // subscriptionReference stored in pendingPaymentStore above.

    const isVaultEnabled = false;

    const amountBaseUnits = Math.floor(finalAmountUsdc * 1_000_000);

    console.log('💰 Payment Details:');
    console.log(`   Original: $${originalAmountUsdc.toFixed(2)} | SLICE discount: $${discountUsd.toFixed(2)} | Final: $${finalAmountUsdc.toFixed(2)}`);
    console.log(`   Vault: ${isVaultEnabled} | Reward: ${rewardAmountBaseUnits} SLICE base units`);
    console.log(`   Commission to: ${commissionWalletPubkey.toBase58().slice(0, 8)}...`);

    // Derive token accounts.
    // Merchant / commission wallets may be PDAs (off-curve) — e.g. settlement vault
    // addresses. allowOwnerOffCurve is required or getAssociatedTokenAddress throws
    // TokenOwnerOffCurveError and Phantom shows "Invalid data from the payment provider".
    const customerUsdcAccount = await getAssociatedTokenAddress(USDC_MINT, customerWallet);
    const businessUsdcAccount = await getAssociatedTokenAddress(USDC_MINT, businessWalletPubkey, true);
    const platformUsdcAccount = await getAssociatedTokenAddress(USDC_MINT, PLATFORM_FEE_WALLET, true);
    const commissionUsdcAccount = await getAssociatedTokenAddress(USDC_MINT, commissionWalletPubkey, true);
    
    // Customer SLICE ATA (still required by program struct even though skip_rewards=true)
    const customerRewardAccount = await getAssociatedTokenAddress(
      SLICE_MINT, customerWallet, false, TOKEN_2022_PROGRAM_ID
    );

    const [businessVaultStatsPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault_stats'), businessWalletPubkey.toBuffer()],
      PAYMENT_SPLITTER_PROGRAM_ID
    );

    const { blockhash } = await connection.getLatestBlockhash('finalized');

    const transaction = new Transaction();
    transaction.feePayer = customerWallet;
    transaction.recentBlockhash = blockhash;

    // Customer SLICE ATA — required by program. Create only when we will mint
    // rewards into it. If redeeming SLICE, the ATA must already exist with balance.
    const atasToCreate = [
      { account: customerUsdcAccount, owner: customerWallet, mint: USDC_MINT, name: 'Customer USDC' },
      { account: businessUsdcAccount, owner: businessWalletPubkey, mint: USDC_MINT, name: 'Business USDC' },
      { account: platformUsdcAccount, owner: PLATFORM_FEE_WALLET, mint: USDC_MINT, name: 'Platform USDC' },
      { account: commissionUsdcAccount, owner: commissionWalletPubkey, mint: USDC_MINT, name: 'Commission USDC' },
    ];

    // Log balances for diagnostics but do NOT return 400 — any non-200 response
    // causes some wallets (Solflare, etc.) to show "invalid QR code" instead of the
    // actual error message. Per Solana Pay spec, return the transaction and let the
    // wallet run simulation so it can display its own contextual error.
    try {
      const bal = await connection.getTokenAccountBalance(customerUsdcAccount);
      const customerUsdcBalance = Number(bal.value.uiAmount || 0);
      console.log(`💵 Customer USDC balance: $${customerUsdcBalance.toFixed(2)} (need $${finalAmountUsdc.toFixed(2)})`);
      if (customerUsdcBalance + 1e-9 < finalAmountUsdc) {
        console.warn(`⚠️  Insufficient USDC — wallet has $${customerUsdcBalance.toFixed(2)}, needs $${finalAmountUsdc.toFixed(2)}. Wallet will show simulation error.`);
      }
    } catch {
      console.warn('⚠️  Could not fetch customer USDC balance (account may not exist). Wallet will show simulation error if insufficient.');
    }

    try {
      const solBalance = await connection.getBalance(customerWallet);
      console.log(`⚡ Customer SOL balance: ${(solBalance / 1e9).toFixed(4)} SOL`);
      if (solBalance < 5_000_000) {
        console.warn(`⚠️  Low SOL balance (${(solBalance / 1e9).toFixed(4)} SOL) — wallet may show fee error.`);
      }
    } catch {
      console.warn('⚠️  Could not fetch customer SOL balance.');
    }
    // Ensure customer SLICE ATA exists whenever we mint loyalty (every paid tx)
    if (rewardAmountBaseUnits > 0 && sliceAmount <= 0) {
      atasToCreate.push({
        account: customerRewardAccount, owner: customerWallet, mint: SLICE_MINT,
        name: 'Customer SLICE', program: TOKEN_2022_PROGRAM_ID
      });
    }

    for (const ata of atasToCreate) {
      try {
        await getAccount(connection, ata.account, 'confirmed', ata.program || TOKEN_PROGRAM_ID);
      } catch {
        console.log(`📝 Creating ${ata.name} account...`);
        transaction.add(
          createAssociatedTokenAccountInstruction(
            customerWallet, ata.account, ata.owner, ata.mint, ata.program || TOKEN_PROGRAM_ID
          )
        );
      }
    }

    // Instruction data: [8 discriminator][8 amount u64 LE][1 vault_enabled][8 reward_amount u64 LE]
    const instructionData = Buffer.concat([
      PROCESS_PAYMENT_DISCRIMINATOR,
      new BN(amountBaseUnits).toArrayLike(Buffer, 'le', 8),
      Buffer.from([isVaultEnabled ? 1 : 0]),
      new BN(rewardAmountBaseUnits).toArrayLike(Buffer, 'le', 8)
    ]);

    // Account metas matching ProcessPayment struct in lib.rs
    const accountMetas = [
      { pubkey: customerWallet, isSigner: true, isWritable: true },
      { pubkey: customerUsdcAccount, isSigner: false, isWritable: true },
      { pubkey: customerRewardAccount, isSigner: false, isWritable: true },
      { pubkey: USDC_MINT, isSigner: false, isWritable: false },
      { pubkey: SLICE_MINT, isSigner: false, isWritable: true },
      { pubkey: MINT_AUTHORITY_PDA, isSigner: false, isWritable: false },
      { pubkey: businessVaultStatsPDA, isSigner: false, isWritable: true },
      { pubkey: businessWalletPubkey, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
    ];

    // Remaining accounts: [business, platform, commission] (vault disabled)
    accountMetas.push({ pubkey: businessUsdcAccount, isSigner: false, isWritable: true });
    accountMetas.push({ pubkey: platformUsdcAccount, isSigner: false, isWritable: true });
    accountMetas.push({ pubkey: commissionUsdcAccount, isSigner: false, isWritable: true });

    const processPaymentIx = new TransactionInstruction({
      programId: PAYMENT_SPLITTER_PROGRAM_ID,
      keys: accountMetas,
      data: instructionData
    });

    // Burn SLICE if being redeemed for discount
    if (sliceAmount > 0 && discountUsd > 0) {
      let sliceBal = 0;
      try {
        const acc = await getAccount(connection, customerRewardAccount, 'confirmed', TOKEN_2022_PROGRAM_ID);
        sliceBal = Number(acc.amount);
      } catch {
        return res.status(400).json({
          error: 'No SLICE token account',
          details: 'Connect a wallet that holds SLICE before applying a discount'
        });
      }
      const sliceBaseUnits = Math.floor(sliceAmount * 100);
      if (sliceBal < sliceBaseUnits) {
        return res.status(400).json({
          error: 'Insufficient SLICE',
          details: `Need ${sliceAmount} SLICE for this discount, wallet has ${sliceBal / 100}`
        });
      }
      transaction.add(createBurnInstruction(
        customerRewardAccount, SLICE_MINT, customerWallet, sliceBaseUnits, [], TOKEN_2022_PROGRAM_ID
      ));
      console.log(`🔥 SLICE burn: ${sliceAmount} tokens (${sliceBaseUnits} base units)`);
    }

    attachSolanaPayReference(transaction, customerWallet, reference);
    transaction.add(processPaymentIx);

    console.log(`📝 Transaction: ${transaction.instructions.length} instructions, ${accountMetas.length} accounts`);
    console.log(`   Data: ${instructionData.length} bytes | Amount: ${amountBaseUnits} (${(amountBaseUnits / 1_000_000).toFixed(2)} USDC)`);

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    });

    console.log(`✅ USDC Payment Transaction built (${serializedTransaction.length} bytes)`);
    if (rewardAmountBaseUnits > 0) {
      console.log(`   💎 ${sliceRewardToMint} SLICE (${rewardAmountBaseUnits} base units) will be minted atomically in this tx`);
    }

    const discountNote = sliceAmount > 0 ? ` (−${sliceAmount} SLICE)` : '';
    const rewardNote = sliceRewardToMint > 0 ? ` → Earn ${sliceRewardToMint} SLICE` : '';

    res.status(200).json({
      transaction: serializedTransaction.toString('base64'),
      message: `Pay $${finalAmountUsdc.toFixed(2)} USDC${discountNote}${rewardNote}`
    });

  } catch (error) {
    console.error('❌ USDC+Commission Payment error:', error.message);
    console.error(error.stack);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ 
      error: 'Failed to build transaction',
      details: error.message 
    });
  }
});

module.exports = router;
