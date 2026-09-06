"use client";

import { useCallback, useEffect, useState } from "react";
import { businessApi, shortAddress, type StaticStablecoinQr } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Download, Loader2, Printer, QrCode } from "lucide-react";
import { toast } from "sonner";

interface Props {
  token: string;
  businessId?: string;
  businessWallet?: string;
}

function downloadQrImage(qr: StaticStablecoinQr) {
  const link = document.createElement("a");
  link.href = qr.qrDataUrl;
  link.download = `slicepay-static-${qr.chainKey}-${qr.symbol}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function StaticStablecoinQrList({ token, businessWallet }: Props) {
  const [qrs, setQrs] = useState<StaticStablecoinQr[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQrs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await businessApi.getStaticStablecoinQrs(token);
      setQrs(res.qrs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load static QR codes");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadQrs();
  }, [loadQrs]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading static QR codes…
        </CardContent>
      </Card>
    );
  }

  if (!businessWallet) {
    return (
      <Card className="border-amber-200/60 bg-amber-50/30 dark:bg-amber-950/20">
        <CardContent className="flex items-start gap-3 pt-6">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Wallet required for static QR codes</p>
            <p className="text-sm text-muted-foreground mt-1">
              Link your settlement wallet in Settings to generate printable stablecoin backup QRs.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">Static Stablecoin QR Codes</CardTitle>
              <CardDescription>
                Offline backup — print and keep at the counter. Merchant can be offline; customer pays online via SlicePay checkout.
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0">Offline backup</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Merchant wallet:{" "}
          <span className="font-mono">{shortAddress(businessWallet)}</span>
          {" · "}
          Each QR opens SlicePay checkout on the customer&apos;s phone — scan with the <strong>camera app</strong>, not the wallet QR scanner.
        </p>

        {error && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </p>
        )}

        {qrs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <QrCode className="w-10 h-10 mx-auto mb-2 opacity-30" />
            No stablecoin rails available right now.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {qrs.map((qr) => (
              <div
                key={qr.id}
                className="rounded-xl border bg-card p-4 flex flex-col items-center gap-3"
              >
                <div className="text-center space-y-1 w-full">
                  <p className="font-semibold text-sm">{qr.symbol}</p>
                  <p className="text-xs text-muted-foreground">{qr.chainName}</p>
                </div>
                <img
                  src={qr.qrDataUrl}
                  alt={`Static ${qr.symbol} QR on ${qr.chainName}`}
                  width={180}
                  height={180}
                  className="rounded-lg border bg-white p-2"
                />
                <p className="text-[10px] text-muted-foreground text-center line-clamp-2 break-all px-1">
                  {qr.checkoutUrl}
                </p>
                {qr.scanHint && (
                  <p className="text-[10px] text-muted-foreground text-center leading-snug px-1">
                    {qr.scanHint}
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    downloadQrImage(qr);
                    toast.success(`Downloaded ${qr.symbol} (${qr.chainName}) QR`);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
