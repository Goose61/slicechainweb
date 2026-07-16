"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { blockchainApi, formatCurrency } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pizza, QrCode, Loader2, RefreshCw, Copy, ArrowLeft, Zap, Coins } from "lucide-react";
import { ClientErrorLogger } from "@/components/client-error-logger";

type Currency = "USDC" | "SOL";

interface QRState {
  image: string;
  url: string;
  reference: string;
  amount: string;
  currency: string;
  expiresAt: number;
  type?: string;
  inputDisplay?: string;
  outputDisplay?: string;
}

interface Quote {
  inputAmountDisplay: string;
  inputAmountUsd: string;
  outputAmountDisplay: string;
  priceImpact: number;
}

export default function VendorPaymentPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("Pizza Business");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USDC");
  const [amount, setAmount] = useState("15.00");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [qrState, setQrState] = useState<QRState | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("businessToken") || localStorage.getItem("token") || sessionStorage.getItem("businessToken");
    if (!t) {
      toast.error("Not authenticated. Redirecting to login…");
      setTimeout(() => router.push("/business/login"), 1500);
      return;
    }
    setToken(t);
    const name = localStorage.getItem("currentBusinessName");
    if (name) setBusinessName(name);
  }, [router]);

  async function fetchQuote(amt: number) {
    if (!token || amt <= 0 || selectedCurrency !== "SOL") return;
    setQuoteLoading(true);
    try {
      const q = await blockchainApi.getPaymentQuote(token, amt, "SOL");
      setQuote(q);
    } catch { setQuote(null); }
    finally { setQuoteLoading(false); }
  }

  function onAmountChange(v: string) {
    setAmount(v);
    if (selectedCurrency === "SOL") {
      clearTimeout((window as unknown as { _qTimer?: ReturnType<typeof setTimeout> })._qTimer);
      (window as unknown as { _qTimer?: ReturnType<typeof setTimeout> })._qTimer = setTimeout(() => fetchQuote(parseFloat(v) || 0), 500);
    }
  }

  function selectCurrency(c: Currency) {
    setSelectedCurrency(c);
    setQuote(null);
    if (c === "SOL") fetchQuote(parseFloat(amount) || 0);
  }

  async function generateQR() {
    if (!token) return;
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error("Please enter a valid amount."); return; }
    setGenerating(true);
    setQrState(null);
    try {
      const result = await blockchainApi.generateQRWithCurrency(token, {
        amountUsd: amt,
        currency: selectedCurrency,
        memo: `Payment - ${amt.toFixed(2)}`,
        pizzarRedemption: 0,
      });
      if (!result.success) throw new Error("QR generation failed");
      setQrState({
        image: result.qrImage,
        url: result.qrUrl,
        reference: result.reference,
        amount: result.amountDisplay || `${amt.toFixed(2)} USDC`,
        currency: result.currency || selectedCurrency,
        expiresAt: result.expiresAt,
        type: result.type,
        inputDisplay: result.inputAmountDisplay,
        outputDisplay: result.outputAmountDisplay,
      });
      toast.success("QR code generated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to generate QR code");
    } finally {
      setGenerating(false);
    }
  }

  const expiryMinutes = qrState ? Math.max(0, Math.floor((qrState.expiresAt - Date.now()) / 60000)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Button>
            <div className="w-px h-5 bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
                <Pizza className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">{businessName}</p>
                <p className="text-white/50 text-xs leading-none mt-0.5">CN Business · Payment QR</p>
              </div>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-white">Payment QR Generator</h1>
          <p className="text-slate-400">Generate a Solana Pay QR code for your customers</p>
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(["USDC", "SOL"] as const).map((c) => (
            <button
              key={c}
              onClick={() => selectCurrency(c)}
              className={`p-4 rounded-xl border transition-all ${
                selectedCurrency === c
                  ? "bg-white/20 border-white/40 text-white"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${c === "USDC" ? "bg-blue-500/20" : "bg-purple-500/20"}`}>
                  {c === "USDC" ? "💵" : "◎"}
                </div>
                <div className="text-left">
                  <p className="font-semibold">{c}</p>
                  <p className="text-xs opacity-70">{c === "USDC" ? "Direct payment" : "Via Jupiter swap"}</p>
                </div>
                {selectedCurrency === c && <Zap className="w-4 h-4 ml-auto text-yellow-400" />}
              </div>
            </button>
          ))}
        </div>

        {/* Amount Input */}
        <Card className="bg-white/10 border-white/10 mb-4">
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-2">
              <Label className="text-white">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="15.00"
                  value={amount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 pl-7 text-lg font-semibold h-12"
                />
              </div>
            </div>

            {/* SOL Quote */}
            {selectedCurrency === "SOL" && (
              <div className="bg-white/5 rounded-lg p-3 space-y-2 text-sm">
                {quoteLoading ? (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Fetching Jupiter quote…</span>
                  </div>
                ) : quote ? (
                  <>
                    <div className="flex justify-between text-slate-300">
                      <span>Input (SOL)</span>
                      <span className="font-medium text-white">{quote.inputAmountDisplay}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Output (USDC)</span>
                      <span className="font-medium text-white">{quote.outputAmountDisplay}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Price Impact</span>
                      <span>~{quote.priceImpact.toFixed(2)}%</span>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 text-xs">Enter an amount to see the SOL quote</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Button */}
        <Button
          onClick={generateQR}
          disabled={generating || !token}
          className="w-full h-14 bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 text-white border-0 text-lg font-semibold shadow-xl shadow-orange-500/25 mb-6"
        >
          {generating ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating…</>
          ) : (
            <><QrCode className="w-5 h-5 mr-2" />Generate QR Code</>
          )}
        </Button>

        {/* QR Display */}
        {qrState && (
          <Card className="bg-white/10 border-white/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-sm font-semibold">Payment QR Code</CardTitle>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  Expires in {expiryMinutes}m
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* QR Image */}
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-2xl shadow-xl">
                  <img src={qrState.image} alt="Payment QR" className="w-56 h-56 object-contain" />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount</span>
                  <span className="text-white font-semibold">
                    {qrState.type === "swap"
                      ? `${qrState.inputDisplay} → ${qrState.outputDisplay}`
                      : qrState.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Currency</span>
                  <span className="text-white">{qrState.type === "swap" ? `${qrState.currency} (via Jupiter)` : qrState.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reference</span>
                  <span className="text-white font-mono text-xs">{qrState.reference.slice(0, 16)}…</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { navigator.clipboard.writeText(qrState.url); toast.success("URL copied!"); }}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Copy className="w-3.5 h-3.5 mr-2" />
                  Copy URL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQrState(null)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-2" />
                  New QR
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <ClientErrorLogger source="qr-app" />
    </div>
  );
}
