"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  pajApi,
  businessApi,
  type BusinessProfile,
  type PajBank,
  type PajOfframpOrder,
  type PajOfframpResult,
} from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Loader2, Copy, Check, Building2, ArrowDownToLine,
  ChevronRight, Search, RefreshCw, AlertCircle,
} from "lucide-react";

/** Mirrors PAJ offramp example: session → bank → offramp order */
type FlowStep = "connect" | "bank" | "offramp";

interface PajSettlementPanelProps {
  token: string;
  business: BusinessProfile | null;
  demoMode?: boolean;
  onProfileRefresh?: () => void;
  onFlowStepChange?: (step: FlowStep) => void;
}

const STEPS: { id: FlowStep; label: string }[] = [
  { id: "connect", label: "Connect PAJ" },
  { id: "bank", label: "Bank account" },
  { id: "offramp", label: "Off-ramp" },
];

function stepIndex(step: FlowStep) {
  return STEPS.findIndex((s) => s.id === step);
}

// ─── Searchable bank combobox ─────────────────────────────────────────────────

interface BankComboboxProps {
  banks: PajBank[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

function getBankLabel(bank: PajBank) {
  return bank.name?.trim() || (bank.code ? `Bank (${bank.code})` : "Unknown bank");
}

function BankCombobox({ banks, value, onChange, disabled }: BankComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const usableBanks = banks.filter((b) => b.id && getBankLabel(b) !== "Unknown bank");
  const selected = usableBanks.find((b) => b.id === value);
  const query = search.trim().toLowerCase();
  const filtered = query
    ? usableBanks.filter((b) => {
        const label = getBankLabel(b).toLowerCase();
        const code = (b.code || "").toLowerCase();
        return label.includes(query) || code.includes(query);
      })
    : usableBanks;

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function selectBank(bank: PajBank) {
    onChange(bank.id);
    setOpen(false);
    setSearch("");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setOpen((o) => !o);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 h-10 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? getBankLabel(selected) : "Select bank…"}
        </span>
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="p-2 border-b">
            <Input
              ref={inputRef}
              placeholder="Search banks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">No banks found</li>
            ) : (
              filtered.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => selectBank(b)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${
                      b.id === value ? "bg-accent/50 font-medium" : ""
                    }`}
                  >
                    <span className="flex-1 text-left">
                      {getBankLabel(b)}
                      {b.code ? (
                        <span className="ml-1.5 text-xs text-muted-foreground">({b.code})</span>
                      ) : null}
                    </span>
                    {b.id === value && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                </li>
              ))
            )}
          </ul>
          {filtered.length > 0 && (
            <p className="px-3 py-1.5 text-xs text-muted-foreground border-t">
              {filtered.length} of {usableBanks.length} banks
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function PajSettlementPanel({
  token,
  business,
  demoMode,
  onProfileRefresh,
  onFlowStepChange,
}: PajSettlementPanelProps) {
  const paj = business?.fiatSettlement?.paj;
  const hasSession = !!paj?.verifiedRecipient;
  const hasBank = !!paj?.accountName && !!paj?.bankId;

  const [flowStep, setFlowStep] = useState<FlowStep>("connect");
  const [sessionStep, setSessionStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [recipient, setRecipient] = useState("");

  const [banks, setBanks] = useState<PajBank[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [banksError, setBanksError] = useState(false);
  const [bankId, setBankId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedName, setResolvedName] = useState("");

  const [amountUsd, setAmountUsd] = useState("");
  const [offrampResult, setOfframpResult] = useState<PajOfframpResult | null>(null);
  const [history, setHistory] = useState<PajOfframpOrder[]>([]);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  // Optimistic flag: session just verified but profile hasn't refreshed yet
  const [pendingSession, setPendingSession] = useState(false);

  const effectiveSession = hasSession || pendingSession;

  const goToStep = useCallback((step: FlowStep) => {
    setFlowStep(step);
    onFlowStepChange?.(step);
  }, [onFlowStepChange]);

  // ── Sync wizard step from saved business profile ───────────────────────────
  useEffect(() => {
    if (hasSession) setPendingSession(false);
    if (!effectiveSession) { goToStep("connect"); return; }
    if (!hasBank && flowStep !== "offramp") { goToStep("bank"); return; }
    if (hasBank) goToStep("offramp");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSession, hasSession, hasBank]);

  // Populate bank/account from saved profile when available
  useEffect(() => {
    if (paj?.bankId) setBankId(paj.bankId);
    if (paj?.accountName) setResolvedName(paj.accountName);
  }, [paj?.bankId, paj?.accountName]);

  // ── Load banks + offramp history ──────────────────────────────────────────
  const loadBanksAndHistory = useCallback(async (opts?: { banksOnly?: boolean }) => {
    if (!token || !effectiveSession) return;
    setBanksLoading(true);
    setBanksError(false);
    try {
      if (opts?.banksOnly) {
        const banksRes = await pajApi.getBanks(token);
        setBanks(banksRes.banks || []);
      } else {
        const [banksRes, histRes] = await Promise.allSettled([
          pajApi.getBanks(token),
          pajApi.getOfframpHistory(token),
        ]);
        if (banksRes.status === "fulfilled") {
          setBanks(banksRes.value.banks || []);
        } else {
          setBanksError(true);
          console.error("Failed to load banks:", banksRes.reason);
        }
        if (histRes.status === "fulfilled") {
          setHistory(histRes.value.orders || []);
        }
      }
    } catch (err) {
      setBanksError(true);
      console.error("loadBanksAndHistory error:", err);
    } finally {
      setBanksLoading(false);
    }
  }, [token, effectiveSession]);

  useEffect(() => {
    if (token && effectiveSession && (flowStep === "bank" || flowStep === "offramp")) {
      loadBanksAndHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, effectiveSession, flowStep]);

  // ── Session: initiate ────────────────────────────────────────────────────
  async function handleInitiateSession() {
    if (!email) { toast.error("Enter your email"); return; }
    setLoading(true);
    try {
      const r = await pajApi.initiateBusinessSession(token, { email });
      setRecipient(r.recipient || email);
      setSessionStep("otp");
      toast.success("Verification code sent to " + (r.recipient || email));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  // ── Session: verify (step 3 of PAJ example) ──────────────────────────────
  async function handleVerifySession() {
    setLoading(true);
    try {
      await pajApi.verifyBusinessSession(token, recipient, otp);
      setSessionStep("email");
      setOtp("");
      setPendingSession(true);   // optimistic: keep on bank step while profile refreshes
      goToStep("bank");
      toast.success("PAJ account connected — now set up your bank account");
      onProfileRefresh?.();      // triggers parent to reload profile (will set hasSession)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  // ── Bank: resolve account name (resolveBankAccount in SDK) ───────────────
  async function handleResolveBank() {
    if (!bankId || accountNumber.length < 10) return;
    setLoading(true);
    try {
      const r = await pajApi.resolveBank(token, bankId, accountNumber);
      setResolvedName(r.resolved.accountName);
      toast.success(`Account verified: ${r.resolved.accountName}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not verify account");
    } finally {
      setLoading(false);
    }
  }

  // ── Bank: save to PAJ profile (addBankAccount in SDK) + update business ──
  async function handleSaveBank() {
    if (!resolvedName) { toast.error("Verify the account first"); return; }
    setLoading(true);
    try {
      await pajApi.saveBank(token, bankId, accountNumber, resolvedName);
      // updateFiatSettlement sets preference='ngn' (backend bank/save also does this, belt-and-suspenders)
      await businessApi.updateFiatSettlement(token, "ngn");
      toast.success("Bank saved — you can now create off-ramp orders");
      onProfileRefresh?.();
      goToStep("offramp");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save bank");
    } finally {
      setLoading(false);
    }
  }

  // ── Offramp: createOfframpOrder → get deposit address ───────────────────
  async function handleOfframp() {
    const usd = parseFloat(amountUsd);
    if (!usd || usd < 1) { toast.error("Enter amount (min $1 USD)"); return; }
    setLoading(true);
    try {
      const r = await pajApi.createOfframp(token, { amountUsd: usd });
      setOfframpResult(r);
      toast.success("Off-ramp order created — send USDC to the deposit address");
      // Refresh history after creating order
      try {
        const hist = await pajApi.getOfframpHistory(token);
        setHistory(hist.orders || []);
      } catch { /* non-critical */ }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Off-ramp failed");
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  }

  // ── Demo guard ───────────────────────────────────────────────────────────
  if (demoMode) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          NGN settlement is unavailable in demo mode.
        </CardContent>
      </Card>
    );
  }

  const currentIdx = stepIndex(flowStep);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          NGN Settlement (PAJ)
        </h2>
        <p className="text-sm text-muted-foreground">
          Off-ramp USDC to your Nigerian bank account via PAJ.cash
        </p>
      </div>

      {/* Step indicator */}
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <li key={step.id} className="flex items-center gap-2">
              {idx > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : done
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {idx + 1}. {step.label}
              </span>
            </li>
          );
        })}
      </ol>

      {/* ── Step 1: PAJ session (initiate → verify) ─────────────────────── */}
      {flowStep === "connect" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Connect PAJ account</CardTitle>
            <CardDescription>
              {hasSession
                ? `Connected as ${paj?.verifiedRecipient}`
                : "Enter your PAJ email — we'll send a verification code"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {hasSession ? (
              <Button onClick={() => goToStep("bank")}>Continue to bank setup</Button>
            ) : sessionStep === "email" ? (
              <>
                <div className="space-y-2">
                  <Label>PAJ account email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleInitiateSession()}
                    placeholder="owner@business.com"
                  />
                </div>
                <Button onClick={handleInitiateSession} disabled={loading || !email}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send verification code
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Code sent to <strong>{recipient}</strong>
                </p>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && otp.length >= 4 && handleVerifySession()}
                  placeholder="Enter OTP"
                  maxLength={8}
                />
                <div className="flex gap-2">
                  <Button onClick={handleVerifySession} disabled={loading || otp.length < 4}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Verify &amp; continue
                  </Button>
                  <Button variant="outline" onClick={() => setSessionStep("email")}>Back</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 2: Bank setup (getBanks → resolveBankAccount → addBankAccount) */}
      {flowStep === "bank" && effectiveSession && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Nigerian bank account</CardTitle>
            <CardDescription>
              {hasBank
                ? `${paj?.accountName} · ****${paj?.accountNumber?.slice(-4)}`
                : "Select your bank, verify the account number, then save"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bank selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Bank</Label>
                {banksError && (
                  <button
                    type="button"
                    onClick={() => loadBanksAndHistory({ banksOnly: true })}
                    className="flex items-center gap-1 text-xs text-destructive hover:underline"
                  >
                    <RefreshCw className="h-3 w-3" /> Retry
                  </button>
                )}
              </div>

              {banksLoading ? (
                <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading banks…
                </div>
              ) : banksError ? (
                <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-destructive/50 bg-destructive/5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Failed to load banks
                </div>
              ) : (
                <BankCombobox
                  banks={banks}
                  value={bankId}
                  onChange={setBankId}
                  disabled={loading}
                />
              )}
            </div>

            {/* Account number */}
            <div className="space-y-2">
              <Label>Account number (10 digits)</Label>
              <Input
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setResolvedName(""); // reset when number changes
                }}
                placeholder="0123456789"
                maxLength={10}
                inputMode="numeric"
              />
            </div>

            {/* Resolved account name */}
            {resolvedName && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-800 font-medium">{resolvedName}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleResolveBank}
                disabled={loading || !bankId || accountNumber.length < 10}
              >
                {loading && !resolvedName && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Verify account name
              </Button>
              <Button
                onClick={handleSaveBank}
                disabled={loading || !resolvedName}
              >
                {loading && !!resolvedName && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save &amp; continue
              </Button>
            </div>

            {hasBank && (
              <Button variant="ghost" size="sm" onClick={() => goToStep("offramp")}>
                Skip — use saved bank
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Step 3: Offramp (createOfframpOrder → deposit address) ─────────── */}
      {flowStep === "offramp" && effectiveSession && hasBank && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4" />
              3. Off-ramp to NGN
            </CardTitle>
            <CardDescription>
              Settling to <strong>{paj?.accountName}</strong> · ****{paj?.accountNumber?.slice(-4)}
              {" "}
              <button
                type="button"
                onClick={() => goToStep("bank")}
                className="text-primary hover:underline text-xs"
              >
                Change bank
              </button>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Amount to off-ramp (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  placeholder="100.00"
                  className="pl-6"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                PAJ will provide the exact USDC amount and NGN payout after the order is created.
              </p>
            </div>

            <Button onClick={handleOfframp} disabled={loading || !amountUsd || parseFloat(amountUsd) < 1}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create off-ramp order
            </Button>

            {offrampResult && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3 text-sm">
                <p className="font-semibold text-base">
                  Send exactly{" "}
                  <strong className="text-primary">{offrampResult.usdcAmount} USDC</strong>{" "}
                  to:
                </p>
                <div className="flex items-start gap-2">
                  <code className="font-mono text-xs break-all bg-background rounded px-2 py-1.5 border flex-1">
                    {offrampResult.depositAddress}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => copyText(offrampResult.depositAddress, "addr")}
                  >
                    {copied === "addr" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm border-t pt-3">
                  <div>
                    <p className="text-muted-foreground text-xs">You send</p>
                    <p className="font-medium">{offrampResult.usdcAmount} USDC</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">You receive</p>
                    <p className="font-medium text-emerald-700">
                      ₦{Number(offrampResult.fiatAmount).toLocaleString()} NGN
                    </p>
                  </div>
                  {offrampResult.rate && (
                    <div>
                      <p className="text-muted-foreground text-xs">Rate</p>
                      <p className="font-medium">₦{Number(offrampResult.rate).toLocaleString()}/USDC</p>
                    </div>
                  )}
                  {offrampResult.fee != null && (
                    <div>
                      <p className="text-muted-foreground text-xs">Fee</p>
                      <p className="font-medium">{offrampResult.fee} USDC</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{offrampResult.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Off-ramp history ──────────────────────────────────────────────── */}
      {(flowStep === "offramp" || flowStep === "bank") && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Off-ramp history</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>USD</TableHead>
                  <TableHead>NGN payout</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((o) => (
                  <TableRow key={o._id}>
                    <TableCell className="text-xs">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${o.amountUsd?.toFixed(2) ?? "—"}</TableCell>
                    <TableCell>
                      {o.fiatAmount ? `₦${Number(o.fiatAmount).toLocaleString()}` : "—"}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        o.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : o.status === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {o.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
