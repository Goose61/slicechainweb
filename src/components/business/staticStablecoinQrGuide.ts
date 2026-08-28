import type { StaticStablecoinQr } from "@/lib/api";

export const STATIC_QR_GUIDE_STEPS = [
  {
    title: "Print and display",
    body: "Place this QR at your counter. You can stay offline — only the customer needs internet.",
  },
  {
    title: "Customer scans with phone camera",
    body: "They should use the built-in phone camera, not a wallet app's QR scanner.",
  },
  {
    title: "Customer enters amount",
    body: "SlicePay checkout opens in the browser. The customer types how much to pay.",
  },
  {
    title: "Customer pays in wallet",
    body: "They confirm the payment in their crypto wallet. SlicePay applies fees and SLICE rewards.",
  },
] as const;

export function getStaticQrGuideSteps(qr: StaticStablecoinQr) {
  const payStep = `Pay ${qr.symbol} on ${qr.chainName} when prompted.`;
  return [
    ...STATIC_QR_GUIDE_STEPS.slice(0, 3),
    { title: STATIC_QR_GUIDE_STEPS[3].title, body: payStep },
  ];
}

export function getStaticQrScanNote(qr: StaticStablecoinQr): string | null {
  if (qr.scanHint) return qr.scanHint;
  if (qr.chainKey === "solana" && qr.symbol === "USDC") {
    return "Solana USDC: scan with the phone camera only — do not use Phantom or Solflare's QR scanner on this code.";
  }
  return null;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(/\s+/);
  let line = "";
  let cursorY = y;

  for (let i = 0; i < words.length; i += 1) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = words[i];
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }
  return cursorY;
}

/** Build a print-ready PNG: QR + numbered instructions. */
export async function buildPrintableStaticQrSheet(
  qr: StaticStablecoinQr,
  options?: { merchantName?: string }
): Promise<string> {
  const img = new Image();
  img.src = qr.qrDataUrl;
  await img.decode();

  const width = 720;
  const padding = 36;
  const qrSize = 280;
  const steps = getStaticQrGuideSteps(qr);
  const scanNote = getStaticQrScanNote(qr);
  const lineBlocks = steps.length + (scanNote ? 2 : 0) + 2;
  const height = padding * 2 + qrSize + 80 + lineBlocks * 44;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create printable sheet");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 22px system-ui, sans-serif";
  const title = options?.merchantName
    ? `${options.merchantName} — ${qr.symbol} (${qr.chainName})`
    : `${qr.symbol} on ${qr.chainName}`;
  ctx.fillText(title, padding, padding + 8);

  ctx.font = "13px system-ui, sans-serif";
  ctx.fillStyle = "#64748b";
  ctx.fillText("SlicePay static backup QR · Merchant can be offline", padding, padding + 32);

  const qrX = (width - qrSize) / 2;
  const qrY = padding + 48;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.fillRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
  ctx.strokeRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
  ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

  let textY = qrY + qrSize + 36;
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 15px system-ui, sans-serif";
  ctx.fillText("How customers pay", padding, textY);
  textY += 26;

  steps.forEach((step, index) => {
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.fillStyle = "#059669";
    ctx.fillText(`${index + 1}. ${step.title}`, padding, textY);
    textY += 18;
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillStyle = "#334155";
    textY = wrapText(ctx, step.body, padding + 12, textY, width - padding * 2 - 12, 18);
    textY += 10;
  });

  if (scanNote) {
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.fillStyle = "#b45309";
    textY = wrapText(ctx, `Note: ${scanNote}`, padding, textY + 4, width - padding * 2, 18);
    textY += 8;
  }

  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = "#94a3b8";
  wrapText(
    ctx,
    "Payments route through SlicePay checkout (fees, settlement, SLICE rewards).",
    padding,
    textY + 12,
    width - padding * 2,
    16
  );

  return canvas.toDataURL("image/png");
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
