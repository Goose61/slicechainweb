import { getApiBase } from "./api";

export type ClientErrorSource =
  | "business-dashboard"
  | "business-demo-dashboard"
  | "employee-dashboard"
  | "qr-app"
  | "admin-dashboard";

export interface ClientErrorPayload {
  source: ClientErrorSource;
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  context?: Record<string, unknown>;
}

const sentKeys = new Set<string>();

function dedupeKey(payload: ClientErrorPayload) {
  return `${payload.source}|${payload.message}|${payload.url || ""}`;
}

export async function reportClientError(payload: ClientErrorPayload): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const key = dedupeKey(payload);
  if (sentKeys.has(key)) return false;
  sentKeys.add(key);

  try {
    const res = await fetch(`${getApiBase()}/public/client-error-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        url: payload.url || window.location.href,
        userAgent: payload.userAgent || navigator.userAgent,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function normalizeClientError(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { message: error.message || "Unknown error", stack: error.stack };
  }
  return { message: String(error) };
}
