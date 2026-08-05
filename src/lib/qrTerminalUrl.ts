/**
 * Build URL for the in-person QR payment terminal.
 *
 * Production host: https://qr.slicechain.io (Cloudflare tunnel → localhost:3002)
 * Override with NEXT_PUBLIC_QR_GENERATOR_URL if needed.
 */

export type QrTerminalParams = {
  businessId: string;
  businessName: string;
  businessWallet: string;
  token?: string;
  employeeId?: string;
  employeeName?: string;
  demo?: boolean;
};

const DEFAULT_QR_ORIGIN = "https://qr.slicechain.io";

export function getQrTerminalOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_QR_GENERATOR_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (typeof window === "undefined") {
    return DEFAULT_QR_ORIGIN;
  }

  const { hostname } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:3002";
  }

  return DEFAULT_QR_ORIGIN;
}

export function buildQrTerminalUrl(params: QrTerminalParams): string {
  const base = getQrTerminalOrigin();
  const q = new URLSearchParams();
  q.set("businessId", params.businessId);
  q.set("businessName", params.businessName);
  q.set("businessWallet", params.businessWallet);
  if (params.token) q.set("token", params.token);
  if (params.employeeId) q.set("employeeId", params.employeeId);
  if (params.employeeName) q.set("employeeName", params.employeeName);
  if (params.demo) q.set("demo", "true");
  return `${base}?${q.toString()}`;
}
