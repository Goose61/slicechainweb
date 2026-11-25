"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getApiBase } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SessionPayload = {
  sessionId: string;
  complianceComplete: boolean;
  amountUsd?: number;
  paymentReference?: string;
  countryCode: string;
  captureMode?: string;
  multichainDepositId?: string | null;
  business: { id: string; name: string };
  requirements: { travelRuleRequired: boolean; consentPolicyVersion?: string };
};

type MultichainPayDetails = {
  chainName?: string;
  payAsset?: string;
  depositAddress?: string;
  qrUri?: string;
  stellarMemo?: string;
  scanHint?: string;
  expectedAmountUSD?: number;
};

type ReqPayload = {
  requireFullVerification: boolean;
};

export default function TravelRuleCheckoutPage() {
  const params = useParams();
  const sessionId = String(params?.sessionId || "");
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [req, setReq] = useState<ReqPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"verify" | "pay">("verify");

  const [fullName, setFullName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [countryOfBirth, setCountryOfBirth] = useState("");
  const [consent, setConsent] = useState(false);
  const [multichainPay, setMultichainPay] = useState<MultichainPayDetails | null>(null);

  const load = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const base = getApiBase();
      const sessRes = await fetch(`${base}/travel-rule/checkout-session/${sessionId}`);
      const sessJson = await sessRes.json();
      if (!sessRes.ok) throw new Error(sessJson.error || "Session not found");

      setSession(sessJson);
      if (sessJson.complianceComplete) {
        setStep("pay");
        if (sessJson.multichainDepositId) {
          const payRes = await fetch(`${base}/travel-rule/checkout-session/${sessionId}/pay-details`);
          const payJson = await payRes.json();
          if (payRes.ok && payJson.multichain && payJson.payDetails) {
            setMultichainPay(payJson.payDetails);
          }
        }
      }

      if (sessJson.business?.id) {
        const q = new URLSearchParams({
          businessId: sessJson.business.id,
          ...(sessJson.amountUsd != null ? { amountUsd: String(sessJson.amountUsd) } : {}),
        });
        const reqRes = await fetch(`${base}/travel-rule/requirements?${q}`);
        const reqJson = await reqRes.json();
        if (reqRes.ok) setReq(reqJson);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load checkout");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sol = (window as unknown as { solana?: { publicKey?: { toString(): string } } }).solana;
    if (sol?.publicKey) {
      setWalletAddress(sol.publicKey.toString());
    }
  }, []);

  async function connectSolana() {
    const sol = (window as unknown as { solana?: { connect: () => Promise<{ publicKey: { toString(): string } }> } }).solana;
    if (!sol) {
      setError("No Solana wallet detected. Enter your wallet address manually.");
      return;
    }
    const { publicKey } = await sol.connect();
    setWalletAddress(publicKey.toString());
  }

  async function submitVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSubmitting(true);
    setError(null);
    try {
      const base = getApiBase();
      const res = await fetch(`${base}/travel-rule/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          businessId: session.business.id,
          chain: "solana",
          walletAddress,
          fullName,
          idNumber: idNumber || undefined,
          passportNumber: passportNumber || undefined,
          dateOfBirth: dateOfBirth || undefined,
          residentialAddress: residentialAddress || undefined,
          countryOfBirth: countryOfBirth || undefined,
          consentAccepted: consent,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Verification failed");
      setStep("pay");
      const payRes = await fetch(`${base}/travel-rule/checkout-session/${sessionId}/pay-details`);
      const payJson = await payRes.json();
      if (payRes.ok && payJson.multichain && payJson.payDetails) {
        setMultichainPay(payJson.payDetails);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        Loading checkout…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 text-slate-200 p-6">
        <p>{error || "Session expired"}</p>
        <Link href="/" className="text-violet-400 hover:underline">
          Return home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6">
      <motionSafe className="mx-auto max-w-lg">
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle>Pay {session.business.name}</CardTitle>
            <CardDescription>
              {session.countryCode === "ZA"
                ? "South Africa Travel Rule — verify once, then pay in your wallet."
                : "Complete verification before payment."}
              {session.amountUsd != null && ` · $${session.amountUsd.toFixed(2)} USD`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            {step === "verify" && (
              <form onSubmit={submitVerify} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full legal name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="wallet">Wallet address</Label>
                  <motionSafe className="flex gap-2 mt-1">
                    <Input id="wallet" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} required className="flex-1" />
                    <Button type="button" variant="secondary" onClick={connectSolana}>
                      Connect
                    </Button>
                  </motionSafe>
                </div>
                {req?.requireFullVerification && (
                  <>
                    <div>
                      <Label htmlFor="idNumber">SA ID number (or passport below)</Label>
                      <Input id="idNumber" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="passport">Passport number</Label>
                      <Input id="passport" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of birth</Label>
                      <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="address">Residential address</Label>
                      <Input id="address" value={residentialAddress} onChange={(e) => setResidentialAddress(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cob">Country of birth (if no address)</Label>
                      <Input id="cob" value={countryOfBirth} onChange={(e) => setCountryOfBirth(e.target.value)} className="mt-1" />
                    </div>
                  </>
                )}
                <div className="flex items-start gap-2">
                  <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                  <Label htmlFor="consent" className="text-xs leading-snug text-slate-400 font-normal">
                    I consent to processing of my personal information for FIC Travel Rule and POPIA purposes.{" "}
                    <Link href="/privacy" className="text-violet-400 underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={submitting || !consent}>
                  {submitting ? "Saving…" : "Continue to payment"}
                </Button>
              </form>
            )}

            {step === "pay" && (
              <motionSafe className="space-y-4 text-sm text-slate-300">
                <p className="text-green-400 font-medium">Verification complete.</p>
                {multichainPay ? (
                  <>
                    <p>
                      Pay <strong>{multichainPay.expectedAmountUSD?.toFixed(2)} USD</strong> on{" "}
                      <strong>{multichainPay.chainName}</strong> ({multichainPay.payAsset}).
                    </p>
                    {multichainPay.depositAddress && (
                      <p className="text-xs break-all font-mono bg-slate-800/80 rounded p-2">
                        {multichainPay.depositAddress}
                      </p>
                    )}
                    {multichainPay.stellarMemo && (
                      <p>
                        Memo: <strong>{multichainPay.stellarMemo}</strong>
                      </p>
                    )}
                    {multichainPay.scanHint && <p className="text-xs text-slate-400">{multichainPay.scanHint}</p>}
                    <p className="text-xs text-slate-400">
                      The merchant screen will also switch to the payment QR — you can pay from either device.
                    </p>
                  </>
                ) : (
                  <p>
                    Return to the merchant screen and scan the <strong>payment QR</strong> with your wallet, or retry
                    the payment request in your wallet app.
                  </p>
                )}
                {session.paymentReference && (
                  <p className="text-xs text-slate-500 break-all">Reference: {session.paymentReference}</p>
                )}
              </motionSafe>
            )}
          </CardContent>
        </Card>
      </motionSafe>
    </div>
  );
}

function motionSafe({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}