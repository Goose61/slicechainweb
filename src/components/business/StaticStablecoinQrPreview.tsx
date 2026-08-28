"use client";

import { useRef, useState } from "react";
import type { StaticStablecoinQr } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Download, Loader2, Printer, Smartphone } from "lucide-react";
import { toast } from "sonner";
import {
  buildPrintableStaticQrSheet,
  downloadDataUrl,
  getStaticQrGuideSteps,
  getStaticQrScanNote,
} from "./staticStablecoinQrGuide";

interface Props {
  qr: StaticStablecoinQr | null;
  merchantName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaticStablecoinQrPreview({ qr, merchantName, open, onOpenChange }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const [sheetLoading, setSheetLoading] = useState(false);

  if (!qr) return null;

  const steps = getStaticQrGuideSteps(qr);
  const scanNote = getStaticQrScanNote(qr);
  const fileBase = `slicepay-static-${qr.chainKey}-${qr.symbol}`;

  function downloadQrOnly() {
    downloadDataUrl(qr!.qrDataUrl, `${fileBase}.png`);
    toast.success("QR image downloaded");
  }

  async function downloadPrintableSheet() {
    setSheetLoading(true);
    try {
      const sheet = await buildPrintableStaticQrSheet(qr!, { merchantName });
      downloadDataUrl(sheet, `${fileBase}-with-guide.png`);
      toast.success("Printable sheet downloaded (QR + instructions)");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not build printable sheet");
    } finally {
      setSheetLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto sm:max-w-xl print:max-w-none print:shadow-none print:border-0">
        <div ref={printRef} className="print-guide-root space-y-5">
          <DialogHeader className="print:text-left">
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle>
                {qr.symbol} on {qr.chainName}
              </DialogTitle>
              <Badge variant="secondary" className="print:hidden">
                Static backup
              </Badge>
            </div>
            <DialogDescription>
              {merchantName ? `${merchantName} · ` : ""}
              Printable offline backup — customers enter the amount when they scan.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-3 rounded-xl border bg-white p-4">
            <img
              src={qr.qrDataUrl}
              alt={`Static ${qr.symbol} QR on ${qr.chainName}`}
              width={240}
              height={240}
              className="rounded-lg"
            />
            <p className="text-[10px] text-muted-foreground text-center break-all line-clamp-2 px-2 print:text-slate-600">
              {qr.checkoutUrl}
            </p>
          </div>

          <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              How customers pay
            </p>
            <ol className="space-y-3 text-sm">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            {scanNote && (
              <p className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 rounded-lg p-3 flex gap-2 leading-relaxed">
                <Camera className="w-4 h-4 shrink-0 mt-0.5" />
                {scanNote}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              You do not need to be online when the customer pays. SlicePay handles checkout, fees,
              settlement, and SLICE rewards.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col print:hidden">
          <Button type="button" className="w-full" onClick={downloadPrintableSheet} disabled={sheetLoading}>
            {sheetLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Preparing sheet…
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download QR + guide (recommended)
              </>
            )}
          </Button>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button type="button" variant="outline" onClick={downloadQrOnly}>
              <Download className="w-4 h-4 mr-2" />
              QR only
            </Button>
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
