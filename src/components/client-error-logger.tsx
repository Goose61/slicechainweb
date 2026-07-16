"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import {
  type ClientErrorSource,
  normalizeClientError,
  reportClientError,
} from "@/lib/clientErrorReport";

type LogEntry = {
  id: string;
  message: string;
  stack?: string;
  reported: boolean;
  at: string;
};

export function ClientErrorLogger({ source }: { source: ClientErrorSource }) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [expanded, setExpanded] = useState(false);

  const logError = useCallback(
    async (message: string, stack?: string, context?: Record<string, unknown>) => {
      const trimmed = message.trim() || "Unknown error";
      const id = `${Date.now()}-${trimmed.slice(0, 40)}`;
      setEntries((prev) => [
        { id, message: trimmed, stack, reported: false, at: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4),
      ]);
      setExpanded(true);

      const ok = await reportClientError({
        source,
        message: trimmed,
        stack,
        context,
      });

      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, reported: ok } : e))
      );
    },
    [source]
  );

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      logError(event.message || "Script error", event.error?.stack, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const { message, stack } = normalizeClientError(event.reason);
      logError(message, stack, { type: "unhandledrejection" });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [logError]);

  if (entries.length === 0) return null;

  const latest = entries[0];

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-red-500/40 bg-red-950/95 text-red-50 shadow-lg backdrop-blur-sm">
      <button
        type="button"
        className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm"
        onClick={() => setExpanded((v) => !v)}
      >
        <AlertTriangle className="w-4 h-4 shrink-0 text-red-300" />
        <span className="flex-1 truncate">
          {latest.message}
          {latest.reported ? " - reported to SlicePay support" : " - reporting…"}
        </span>
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="max-h-40 overflow-y-auto border-t border-red-500/30 px-4 py-2 space-y-2 text-xs font-mono">
          {entries.map((entry) => (
            <div key={entry.id} className="border-b border-red-500/20 pb-2 last:border-0">
              <div className="text-red-200/80">{entry.at}</div>
              <div>{entry.message}</div>
              {entry.stack && (
                <pre className="mt-1 whitespace-pre-wrap text-red-200/70 text-[10px]">{entry.stack}</pre>
              )}
              <div className="mt-1 text-red-300/90">
                {entry.reported
                  ? "Sent to slicepay@slicechain.io"
                  : "Could not reach support endpoint"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
