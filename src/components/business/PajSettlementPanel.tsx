"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Copy, Check, Building2, ArrowDownToLine } from "lucide-react";

interface PajSettlementPanelProps {
  token: string;
  business: BusinessProfile | null;
  demoMode?: boolean;
  onProfileRefresh?: () => void;
}

export function PajSettlementPanel({
  token,
  business,
  demoMode,
  onProfileRefresh,
}: PajSettlementPanelProps) {
  const paj = business?.fiatSettlement?.paj;
  const hasSession = !!paj?.verifiedRecipient;
  const hasBank = !!paj?.accountName;

  const [sessionStep, setSessionStep] = useState<"idle" | "otp">("idle");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [recipient, setRecipient] = useState("");
  const [banks, setBanks] = useState<PajBank[]>([]);
  const [bankId, setBankId] = useState(paj?.bankId || "");
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedName, setResolvedName] = useState(paj?.accountName || "");
  const [amountUsd, setAmountUsd] = useState("");
  const [offrampResult, setOfframpResult] = useState<PajOfframpResult | null>(null);
  const [history, setHistory] = useState<PajOfframpOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!token || !hasSession) return;
    pajApi.getBanks(token).then((r) => setBanks(r.banks || [])).catch(() => {});
    pajApi.getOfframpHistory(token).then((r) => setHistory(r.orders || [])).catch(() => {});
  }, [token, hasSession]);

  async function handleInitiateSession() {
    if (!email) { toast.error("Enter your email"); return; }
    setLoading(true);
    try {
      const r = await pajApi.initiateBusinessSession(token, { email });
      setRecipient(r.recipient || email);
      setSessionStep("otp");
      toast.success("Verification code sent");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifySession() {
    setLoading(true);
    try {
      await pajApi.verifyBusinessSession(token, recipient, otp);
      toast.success("PAJ account connected");
      setSessionStep("idle");
      onProfileRefresh?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResolveBank() {
    if (!bankId || accountNumber.length < 10) return;
    setLoading(true);
    try {
      const r = await pajApi.resolveBank(token, bankId, accountNumber);
      setResolvedName(r.resolved.accountName);
      toast.success(`Account: ${r.resolved.accountName}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not verify account");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveBank() {
    setLoading(true);
    try {
      await pajApi.saveBank(token, bankId, accountNumber, resolvedName);
      await businessApi.updateFiatSettlement(token, "ngn");
      toast.success("Bank account saved");
      onProfileRefresh?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save bank");
    } finally {
      setLoading(false);
    }
  }

  async function handleOfframp() {
    const usd = parseFloat(amountUsd);
    if (!usd || usd < 1) { toast.error("Enter amount USD (min $1)"); return; }
    setLoading(true);
    try {
      const r = await pajApi.createOfframp(token, { amountUsd: usd });
      setOfframpResult(r);
      toast.success("Off-ramp created — send USDC to deposit address");
      const hist = await pajApi.getOfframpHistory(token);
      setHistory(hist.orders || []);
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

  if (demoMode) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          NGN settlement is unavailable in demo mode.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          NGN Settlement (PAJ)
        </h2>
        <p className="text-sm text-muted-foreground">
          Manually off-ramp USDC from your business wallet to your Nigerian bank account.
        </p>
      </div>

      {/* PAJ session */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">PAJ Account</CardTitle>
          <CardDescription>
            {hasSession
              ? `Connected as ${paj?.verifiedRecipient}`
              : "Verify with email OTP to connect PAJ"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!hasSession && sessionStep === "idle" && (
            <>
              <div className="space-y-2">
                <Label>Business owner email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@business.com" />
              </div>
              <Button onClick={handleInitiateSession} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Connect PAJ
              </Button>
            </>
          )}
          {sessionStep === "otp" && (
            <>
              <p className="text-sm text-muted-foreground">Code sent to {recipient}</p>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" />
              <Button onClick={handleVerifySession} disabled={loading || otp.length < 4}>Verify</Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Bank setup */}
      {hasSession && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nigerian Bank Account</CardTitle>
            <CardDescription>
              {hasBank ? `${paj?.accountName} · ${paj?.accountNumber}` : "Add your settlement bank account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Bank</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
              >
                <option value="">Select bank…</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Account number (10 digits)</Label>
              <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} maxLength={10} />
            </div>
            {resolvedName && (
              <p className="text-sm text-emerald-600 font-medium">Account name: {resolvedName}</p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleResolveBank} disabled={loading}>Verify account</Button>
              <Button onClick={handleSaveBank} disabled={loading || !resolvedName}>Save bank</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Off-ramp */}
      {hasSession && hasBank && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4" />
              Off-ramp to NGN
            </CardTitle>
            <CardDescription>Convert USDC to Naira in your bank account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input type="number" min="1" step="0.01" value={amountUsd} onChange={(e) => setAmountUsd(e.target.value)} placeholder="100.00" />
            </div>
            <Button onClick={handleOfframp} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Start off-ramp
            </Button>

            {offrampResult && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                <p className="font-semibold">Send exactly <strong>{offrampResult.usdcAmount} USDC</strong> to:</p>
                <div className="flex items-center gap-2 font-mono text-xs break-all">
                  {offrampResult.depositAddress}
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyText(offrampResult.depositAddress, "addr")}>
                    {copied === "addr" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <p>Expected NGN payout: ₦{Number(offrampResult.fiatAmount).toLocaleString()}</p>
                <p className="text-muted-foreground text-xs">{offrampResult.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Off-ramp History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>USD</TableHead>
                  <TableHead>NGN</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((o) => (
                  <TableRow key={o._id}>
                    <TableCell className="text-xs">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>${o.amountUsd?.toFixed(2) ?? "—"}</TableCell>
                    <TableCell>₦{o.fiatAmount ? Number(o.fiatAmount).toLocaleString() : "—"}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        o.status === "COMPLETED" ? "bg-green-100 text-green-700"
                          : o.status === "FAILED" ? "bg-red-100 text-red-700"
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
