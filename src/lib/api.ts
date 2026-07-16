/**
 * API client — resolves backend URL from hostname.
 * Static hosts (slicechain.io on GitHub Pages) and app.slicechain.io must call
 * api.slicechain.io directly — the Pages/static Next build has no /api rewrite.
 */

const PRODUCTION_API = "https://api.slicechain.io";

export function getApiBase(): string {
  if (typeof window === "undefined") {
    return "/api";
  }

  const hostname = window.location.hostname;

  // Local Next.js with /api rewrites → backend :7000
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:7000/api";
  }

  // All public SliceChain hosts: call API origin directly (CORS-enabled).
  // Do NOT use same-origin /api on app.slicechain.io when it is serving a
  // static export — that path returns Next.js HTML 404.
  if (
    hostname === "slicechain.io" ||
    hostname === "www.slicechain.io" ||
    hostname === "app.slicechain.io" ||
    hostname === "qr.slicechain.io" ||
    hostname.endsWith(".slicechain.io")
  ) {
    return `${PRODUCTION_API}/api`;
  }

  return "/api";
}

/** @deprecated Use getApiBase() — kept for any legacy imports */
export const API_BASE = "/api";

type TokenKey = "businessToken" | "employeeToken" | "adminToken" | "customerToken";

function getToken(keys: TokenKey[]): string | null {
  if (typeof window === "undefined") return null;
  for (const key of keys) {
    const t = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (t) return t;
  }
  return null;
}

export function getBusinessToken() {
  return getToken(["businessToken"]);
}
export function getEmployeeToken() {
  return getToken(["employeeToken"]);
}
export function getAdminToken() {
  return getToken(["adminToken"]);
}
export function getCustomerToken() {
  return getToken(["customerToken"]);
}

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${getApiBase()}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const detailMsgs = Array.isArray(err.details)
      ? err.details.map((d: { msg?: string }) => d.msg).filter(Boolean).join("; ")
      : "";
    throw new Error(detailMsgs || err.message || err.error || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// --- Typed API calls ---

export const configApi = {
  getTurnstileKey: () =>
    apiFetch<{ siteKey: string }>("/config/turnstile"),
};

// Business
export const businessApi = {
  login: (email: string, password: string, turnstileToken?: string) =>
    apiFetch<{ token: string; business: BusinessProfile }>("/business/login", {
      method: "POST",
      body: JSON.stringify({ email, password, turnstileToken }),
    }),

  demoLogin: () =>
    apiFetch<{
      token: string;
      businessId: string;
      businessType: string;
      businessName: string;
      demoMode: boolean;
    }>("/business/demo-login", { method: "POST" }),

  signupRequest: (data: Record<string, unknown>, turnstileToken?: string) =>
    apiFetch("/business/signup-request", {
      method: "POST",
      body: JSON.stringify({ ...data, turnstileToken }),
    }),

  getProfile: (token: string) =>
    apiFetch<{ business: BusinessProfile }>("/business/profile", { token }),

  getTransactions: (token: string) =>
    apiFetch<{ transactions: Transaction[] }>("/business/transactions", { token }),

  getVaultStats: (token: string) =>
    apiFetch<{ vaultStats: VaultStats }>("/business/vault-stats", { token }),

  getVaultTotal: (token: string) =>
    apiFetch<VaultTotal>("/business/vault-total", { token }),

  mintGiftCards: (token: string, data: { quantity: number; customMessage: string; mintCost: number }) =>
    apiFetch("/business/gift-cards/mint-batch", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  requestSettlement: (token: string, data: { settlementType: string; amount: number }) =>
    apiFetch("/business/request-settlement", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  updateSettings: (token: string, data: Record<string, unknown>) =>
    apiFetch<{ business: BusinessProfile }>("/business/update-settings", {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    }),

  updateFiatSettlement: (token: string, preference: "usdc" | "zar" | "ngn") =>
    apiFetch<{ fiatSettlement: FiatSettlementConfig }>("/business/fiat-settlement", {
      method: "PUT",
      token,
      body: JSON.stringify({ preference }),
    }),

  updateWallet: (token: string, walletAddress: string | null) =>
    apiFetch("/business/update-wallet", {
      method: "POST",
      token,
      body: JSON.stringify({ walletAddress }),
    }),

  getLoyaltyProgram: (token: string) =>
    apiFetch<LoyaltyData>("/business/loyalty-program", { token }),

  saveLoyaltyProgram: (token: string, data: Record<string, unknown>) =>
    apiFetch("/business/loyalty-program", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  getEmployeeCommissions: (token: string) =>
    apiFetch<{ employees: EmployeeCommission[] }>("/employee/business-commissions", { token }),
};

// Employee
export const employeeApi = {
  login: (employeeId: string, password: string) =>
    apiFetch<{ token: string; employee: Employee; business?: { businessName: string } }>("/employee/login", {
      method: "POST",
      body: JSON.stringify({ employeeId, password }),
    }),

  register: (data: Record<string, unknown>) =>
    apiFetch("/employee/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: (token: string) =>
    apiFetch<{ employee: Employee; business: BusinessProfile; weeklyCommission: WeeklyCommission }>("/employee/me", { token }),

  getBusinessForQR: (token: string) =>
    apiFetch<{ success: boolean; businessId: string; businessName: string; businessWallet: string }>("/employee/business-for-qr", { token }),
};

// Admin
export const adminApi = {
  login: (username: string, password: string, turnstileToken?: string) =>
    apiFetch<{ token: string }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password, turnstileToken }),
    }),

  getTransactionStats: (token: string) =>
    apiFetch<TransactionStats>("/admin/transactions/stats", { token }),

  getTransactions: (token: string, params?: Record<string, string>) =>
    apiFetch<{ transactions: Transaction[]; total: number }>(`/admin/transactions?${new URLSearchParams(params)}`, { token }),

  getUnreconciledDeposits: (token: string, params?: Record<string, string>) =>
    apiFetch<{
      deposits: UnreconciledDeposit[];
      summary: { total: number; byStatus: Array<{ _id: string; count: number }> };
      pagination: { currentPage: number; totalPages: number; totalCount: number };
    }>(`/admin/deposits/unreconciled?${new URLSearchParams(params || {})}`, { token }),

  getDepositDiagnostics: (token: string, depositId: string) =>
    apiFetch<{ deposit: UnreconciledDeposit }>(`/admin/deposits/${depositId}`, { token }),

  markDepositFailed: (token: string, depositId: string, data: { confirmationTxId: string; reason?: string }) =>
    apiFetch<{ deposit: UnreconciledDeposit; message: string }>(`/admin/deposits/${depositId}/mark-failed`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  cancelDeposit: (token: string, depositId: string, data: { confirmationTxId: string; reason?: string }) =>
    apiFetch<{ deposit: UnreconciledDeposit; message: string }>(`/admin/deposits/${depositId}/cancel`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  batchCancelDeposits: (token: string, data: { depositIds: string[]; confirmationPayload: string; reason?: string }) =>
    apiFetch<{
      message: string;
      succeeded: string[];
      failed: Array<{ id: string; error: string }>;
      total: number;
    }>("/admin/deposits/batch-cancel", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  getAuditLog: (token: string, params?: Record<string, string>) =>
    apiFetch<{
      logs: AdminAuditLogEntry[];
      pagination: { currentPage: number; totalPages: number; totalCount: number };
    }>(`/admin/audit-log?${new URLSearchParams(params || {})}`, { token }),

  getNewsletterSubscriberStats: (token: string) =>
    apiFetch<NewsletterSubscriberStats>("/admin/newsletter/subscriber-stats", { token }),

  listNewsletterIssues: (token: string, params?: Record<string, string>) =>
    apiFetch<{
      issues: NewsletterIssue[];
      pagination: { currentPage: number; totalPages: number; totalCount: number };
    }>(`/admin/newsletter/issues?${new URLSearchParams(params || {})}`, { token }),

  createNewsletterIssue: (token: string, data: NewsletterIssueInput) =>
    apiFetch<{ issue: NewsletterIssue }>("/admin/newsletter/issues", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  updateNewsletterIssue: (token: string, issueId: string, data: Partial<NewsletterIssueInput>) =>
    apiFetch<{ issue: NewsletterIssue }>(`/admin/newsletter/issues/${issueId}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    }),

  publishNewsletterIssue: (token: string, issueId: string, actionPassword: string) =>
    apiFetch<{ issue: NewsletterIssue; message: string }>(`/admin/newsletter/issues/${issueId}/publish`, {
      method: "POST",
      token,
      body: JSON.stringify({ actionPassword }),
    }),

  deleteNewsletterIssue: (token: string, issueId: string) =>
    apiFetch<{ removed: boolean; message: string }>(`/admin/newsletter/issues/${issueId}`, {
      method: "DELETE",
      token,
    }),

  getFoundingMerchantStats: (token: string) =>
    apiFetch<FoundingMerchantStats>("/admin/founding-merchants/stats", { token }),

  listFoundingMerchants: (token: string, params?: Record<string, string>) =>
    apiFetch<{
      leads: FoundingMerchantLead[];
      pagination: { currentPage: number; totalPages: number; totalCount: number };
    }>(`/admin/founding-merchants?${new URLSearchParams(params || {})}`, { token }),

  updateFoundingMerchantStatus: (token: string, leadId: string, status: string, actionPassword: string) =>
    apiFetch<{ lead: FoundingMerchantLead; message: string }>(`/admin/founding-merchants/${leadId}/status`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status, actionPassword }),
    }),

  removeFoundingMerchant: (token: string, leadId: string, actionPassword: string) =>
    apiFetch<{ removed: boolean; message: string }>(`/admin/founding-merchants/${leadId}`, {
      method: "DELETE",
      token,
      body: JSON.stringify({ actionPassword }),
    }),
};

// Customer
export const customerApi = {
  login: (email: string, password: string, turnstileToken?: string) =>
    apiFetch<{ token: string; user: Customer }>("/customer/login", {
      method: "POST",
      body: JSON.stringify({ email, password, turnstileToken }),
    }),

  forgotPassword: (email: string) =>
    apiFetch("/customer/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  register: (data: Record<string, unknown>, turnstileToken?: string) =>
    apiFetch("/customer/register", {
      method: "POST",
      body: JSON.stringify({ ...data, turnstileToken }),
    }),

  getTurnstileKey: () => configApi.getTurnstileKey(),
};

// Blockchain / Payments
export const blockchainApi = {
  getPaymentQuote: (token: string, amountUsd: number, currency: string) =>
    apiFetch<PaymentQuote>("/blockchain/get-payment-quote", {
      method: "POST",
      token,
      body: JSON.stringify({ amountUsd, currency }),
    }),

  generateQRWithCurrency: (token: string, data: Record<string, unknown>) =>
    apiFetch<QRResult>("/blockchain/generate-qr-with-currency", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  checkPizzarBalance: (walletAddress: string) =>
    apiFetch<PizzarBalance>(`/blockchain/check-pizzar-balance/${walletAddress}`),
};

// Solana Pay Transaction QR
export const solanaPayApi = {
  generateQR: (data: { reference: string; amount: number; businessId: string; baseUrl: string }) =>
    fetch("/api/solana-pay-transaction/generate-qr", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};

// Ads
export const adsApi = {
  getPlaylist: () => apiFetch("/ads/playlist"),
};

export const pajApi = {
  initiateBusinessSession: (token: string, data: { email?: string; phone?: string }) =>
    apiFetch<{ recipient: string }>("/paj/business/session/initiate", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  verifyBusinessSession: (token: string, recipient: string, otp: string) =>
    apiFetch<{ recipient: string; expiresAt: string }>("/paj/business/session/verify", {
      method: "POST",
      token,
      body: JSON.stringify({ recipient, otp }),
    }),

  getBanks: (token: string) =>
    apiFetch<{ banks: PajBank[] }>("/paj/business/banks", { token }),

  resolveBank: (token: string, bankId: string, accountNumber: string) =>
    apiFetch<{ resolved: { accountName: string; accountNumber: string } }>("/paj/business/bank/resolve", {
      method: "POST",
      token,
      body: JSON.stringify({ bankId, accountNumber }),
    }),

  saveBank: (token: string, bankId: string, accountNumber: string, accountName?: string) =>
    apiFetch<{ saved: { id: string; accountName: string; accountNumber: string } }>("/paj/business/bank/save", {
      method: "POST",
      token,
      body: JSON.stringify({ bankId, accountNumber, accountName }),
    }),

  createOfframp: (token: string, data: { amountUsd?: number; fiatAmountNgn?: number }) =>
    apiFetch<PajOfframpResult>("/paj/business/offramp", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  getOfframpStatus: (token: string, orderId: string) =>
    apiFetch<{ order: PajOfframpOrder }>(`/paj/business/offramp/${orderId}`, { token }),

  getOfframpHistory: (token: string) =>
    apiFetch<{ orders: PajOfframpOrder[] }>("/paj/business/offramp/history", { token }),
};

// --- Types ---
export interface BusinessProfile {
  _id: string;
  businessName: string;
  businessType: "CN" | "NCN";
  walletAddress?: string;
  businessWallet?: { publicKey: string };
  contact?: { email?: string; phone?: string };
  settings?: { emailNotifications?: boolean };
  fiatSettlement?: FiatSettlementConfig;
}

export interface FiatSettlementConfig {
  preference?: "usdc" | "zar" | "ngn";
  paj?: {
    verifiedRecipient?: string;
    sessionExpiresAt?: string;
    savedBankAccountId?: string;
    bankId?: string;
    accountNumber?: string;
    accountName?: string;
    updatedAt?: string;
  };
}

export interface PajBank {
  id: string;
  code: string;
  name: string;
  logo?: string;
  country?: string;
}

export interface PajOfframpResult {
  orderId: string;
  pajOrderId: string;
  depositAddress: string;
  usdcAmount: number;
  fiatAmount: number;
  rate: number;
  fee?: number;
  message: string;
}

export interface PajOfframpOrder {
  _id: string;
  pajOrderId?: string;
  status: "INIT" | "PAID" | "COMPLETED" | "FAILED";
  amountUsd?: number;
  fiatAmount?: number;
  usdcAmount?: number;
  depositAddress?: string;
  rate?: number;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  amount: number;
  status: "completed" | "confirmed" | "pending" | "processing" | "failed";
  createdAt: string;
  walletAddress?: string;
  customerWallet?: string | null;
  inputToken?: { symbol: string };
  fees?: { platformFee: number; vaultContribution: number };
  rewards?: { pizzaTokensDistributed?: number; pizzarRewardsDistributed?: number };
}

export interface VaultStats {
  totalContributedUsd: number;
  transactionCount: number;
  firstContributionAt?: string;
  lastContributionAt?: string;
}

export interface VaultTotal {
  totalBalanceUsd: number;
  estimatedYieldApy: number;
  participatingBusinesses: number;
}

export interface Employee {
  _id: string;
  employeeId: string;
  fullName: string;
  email: string;
  wallet?: { usdcAddress?: string; solanaAddress?: string };
}

export interface EmployeeCommission {
  employeeId: string;
  fullName: string;
  wallet?: { usdcAddress?: string; solanaAddress?: string };
  stats?: { totalTransactionsFacilitated?: number };
  commission?: { totalEarned?: number; pending?: number; lastPayoutAt?: string };
}

export interface WeeklyCommission {
  totalTransactions: number;
  totalVolume: number;
  commissionAmount: number;
}

export interface Customer {
  _id: string;
  email: string;
  fullName?: string;
}

export interface TransactionStats {
  total: number;
  totalVolume: number;
  completed: number;
  pending: number;
  failed: number;
}

export interface UnreconciledDeposit {
  id: string;
  businessId: string;
  businessName: string;
  businessWallet?: string | null;
  chain: string;
  chainLabel: string;
  status: string;
  expectedAmountUSD: number;
  confirmedAmountUSD?: number;
  swapMethod?: string | null;
  depositAddress: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  lastError?: string | null;
  retryCount?: number;
  transactionId?: string | null;
  staleHours?: number | null;
  issues: string[];
  hints: string[];
  txHashes: {
    inbound?: string | null;
    sweep?: string | null;
    cctpBurn?: string | null;
    cctpRedeem?: string | null;
    swapOrder?: string | null;
    swapDst?: string | null;
    solanaSplit?: string | null;
  };
  bridgeRequirements: Array<{
    type: string;
    label: string;
    amount?: string | null;
    have?: string | null;
    need?: string | null;
    raw?: string | null;
    note?: string | null;
    treasuryAddress?: string | null;
  }>;
  pipeline?: Array<{ id: string; label: string; description: string; state: string }>;
  treasuryGas?: Record<string, unknown> | null;
}

export interface AdminAuditLogEntry {
  _id: string;
  adminUsername: string;
  adminEmail?: string | null;
  action: string;
  resourceType?: string | null;
  resourceId?: string | null;
  confirmationTxId?: string | null;
  success: boolean;
  errorMessage?: string | null;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface NewsletterSubscriberStats {
  totalSubscribers: number;
  activeSubscribers: number;
}

export interface NewsletterIssueInput {
  title?: string;
  subject: string;
  preheader?: string;
  htmlBody: string;
  textBody?: string;
}

export interface NewsletterIssue {
  _id: string;
  title: string;
  subject: string;
  preheader?: string;
  htmlBody: string;
  textBody?: string;
  status: "draft" | "published";
  publishedAt?: string;
  publishedByUsername?: string;
  recipientCount?: number;
  sendStats?: { sent: number; failed: number };
  lastEditedByUsername?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoundingMerchantStats {
  total: number;
  activeCount: number;
  remainingSpots: number;
  maxSpots: number;
  byStatus: Record<string, number>;
}

export interface FoundingMerchantLead {
  _id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  businessType?: string;
  city?: string;
  state?: string;
  country?: string;
  monthlyVolume?: number;
  traditionalFeeRate?: number;
  isEmailVerified: boolean;
  status: "pending_verification" | "email_verified" | "verified" | "contacted" | "onboarded" | "declined";
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyData {
  enabled: boolean;
  members: number;
  totalPizzaHeld: number;
  avgDiscount: number;
  monthlySavings: number;
  discountRules?: Array<{ tokens: number; discount: number; description: string }>;
  creditConversion?: { tokens: number; value: number };
  nftRequirement?: { tokens: number; description: string };
}

export interface PaymentQuote {
  success: boolean;
  inputAmountDisplay: string;
  inputAmountUsd: string;
  outputAmountDisplay: string;
  priceImpact: number;
  totalAmountUsd?: number;
}

export interface QRResult {
  success: boolean;
  qrImage: string;
  qrUrl: string;
  reference: string;
  amountDisplay?: string;
  currency?: string;
  inputAmountDisplay?: string;
  outputAmountDisplay?: string;
  inputCurrency?: string;
  type?: "swap" | "direct";
  expiresAt: number;
  businessWallet?: string;
}

export interface PizzarBalance {
  success: boolean;
  pizzarBalance: number;
  redemptionValue: number;
  canRedeem: boolean;
}

// ── Treasury types ────────────────────────────────────────────────────────────

export interface TreasuryTokenInfo {
  symbol: string;
  address: string;
  decimals: number;
  stablecoin: boolean;
  balance: string | null;
  reserved: string | null;
  sweepable: string | null;
  sweepEligible: boolean;
  manualSweepAvailable: boolean;
}

export interface TreasuryEvmChain {
  chainKey: string;
  name: string;
  symbol: string;
  chainId?: number;
  cctpUsdc?: boolean;
  treasuryAddress?: string | null;
  balanceNative?: string | null;
  minReserveNative?: string | null;
  floorNative?: string;
  deficitNative?: string;
  sufficient?: boolean | null;
  needsBootstrap?: boolean;
  autoTopUpEnabled?: boolean;
  postBridgeSweepEnabled?: boolean;
  gasPriceGwei?: number | null;
  tokens?: TreasuryTokenInfo[];
  fundingInstruction?: string | null;
  error?: string;
}

export interface TreasuryTronInfo {
  configured: boolean;
  address: string | null;
  balanceTrx?: string;
  energyAvailable?: number;
  energyLimit?: number;
  energyFloor?: number;
  sufficient?: boolean;
  liquidReserveTrx?: number;
  autoStakeEnabled?: boolean;
  note?: string;
  error?: string;
}

export interface TreasurySolanaInfo {
  configured: boolean;
  address?: string;
  balanceSol?: string;
  note?: string;
  error?: string;
}

export interface TreasuryConfig {
  autoTopUpEnabled: boolean;
  postBridgeSweepEnabled: boolean;
  volatileSweepEnabled: boolean;
  minDustNative: string;
  minTopUpUsd: string;
  postBridgeMinSwapUsd: string;
  postBridgeMaxSwapUsd: string;
  tokenTopUpOrder: string;
  sharedTreasuryAddress: string | null;
}

export interface TreasuryOverview {
  success: boolean;
  summary: {
    evmChainCount: number;
    evmChainsFunded: number;
    evmChainsNeedFunds: number;
    evmChainsNeedBootstrap: number;
    sharedTreasuryAddress: string | null;
    tronSufficient: boolean | null;
  };
  evmChains: TreasuryEvmChain[];
  tron: TreasuryTronInfo;
  solana: TreasurySolanaInfo;
  recentEvents: Record<string, unknown>[];
  config: TreasuryConfig;
}

export interface TreasuryActionResult {
  success: boolean;
  alreadyFunded?: boolean;
  message?: string;
  chainKey?: string;
  tokenSymbol?: string;
  swapUsd?: number;
  txHash?: string;
  txId?: string;
  nativeBalanceBefore?: string;
  nativeBalanceAfter?: string;
  stakedTrx?: string;
}

// ── Treasury API calls ────────────────────────────────────────────────────────

export async function fetchTreasuryOverview(token: string): Promise<TreasuryOverview> {
  const res = await fetch(`${API_BASE}/admin/treasury/overview`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load treasury overview");
  return data;
}

export async function treasuryTopUpGas(
  token: string,
  chainKey: string,
  confirmationPayload: string,
  reason?: string
): Promise<TreasuryActionResult> {
  const res = await fetch(`${API_BASE}/admin/treasury/top-up-gas`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ chainKey, confirmationPayload, reason })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Top-up failed");
  return data;
}

export async function treasurySweepToken(
  token: string,
  chainKey: string,
  tokenSymbol: string,
  confirmationPayload: string,
  opts?: { amountUsd?: number; reason?: string }
): Promise<TreasuryActionResult> {
  const res = await fetch(`${API_BASE}/admin/treasury/sweep-token`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ chainKey, tokenSymbol, confirmationPayload, ...opts })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Sweep failed");
  return data;
}

export async function treasurySweepChain(
  token: string,
  chainKey: string,
  confirmationPayload: string,
  reason?: string
): Promise<TreasuryActionResult> {
  const res = await fetch(`${API_BASE}/admin/treasury/sweep-chain`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ chainKey, confirmationPayload, reason })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Sweep failed");
  return data;
}

export async function treasuryStakeTron(
  token: string,
  confirmationPayload: string,
  opts?: { amountTrx?: number; reason?: string }
): Promise<TreasuryActionResult> {
  const res = await fetch(`${API_BASE}/admin/treasury/tron/stake`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ confirmationPayload, ...opts })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Stake failed");
  return data;
}

// Analytics calculated from transactions
export function calcAnalytics(transactions: Transaction[]) {
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((s, t) => s + (t.amount || 0), 0);
  const totalPlatformFees = transactions.reduce((s, t) => s + (t.fees?.platformFee || 0), 0);
  const totalVaultContribution = transactions.reduce((s, t) => s + (t.fees?.vaultContribution || 0), 0);
  const totalRevenue = totalAmount - totalPlatformFees - totalVaultContribution;
  return { totalTransactions, totalAmount, totalRevenue, totalPlatformFees, totalVaultContribution };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export interface FoundingMerchantSignupData {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  businessType: string;
  country: string;
  city?: string;
  state?: string;
  monthlyVolume?: number;
  traditionalFeeRate?: number;
}

export const foundingMerchantApi = {
  getAvailability: () =>
    apiFetch<{
      maxSpots: number;
      claimedSpots: number;
      remainingSpots: number;
      isOpen: boolean;
    }>("/founding-merchant/availability"),

  signup: (data: FoundingMerchantSignupData) =>
    apiFetch<{ success: boolean; message: string; email: string }>("/founding-merchant/signup", {
      method: "POST",
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(20000),
    }),
};

export function shortAddress(addr: string) {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
}
