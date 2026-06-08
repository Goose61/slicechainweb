"use client";

import { useEffect, useRef, useId, useCallback } from "react";
import { loadTurnstile } from "@/lib/turnstile-loader";

interface TurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: "light" | "dark" | "auto";
  className?: string;
}

export function TurnstileWidget({
  siteKey,
  onVerify,
  onExpire,
  onError,
  theme = "dark",
  className,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const reactId = useId();
  const containerId = `turnstile-${reactId.replace(/:/g, "")}`;

  const handleVerify = useCallback(
    (token: string) => onVerify(token),
    [onVerify]
  );

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    let cancelled = false;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;
        if (widgetIdRef.current) {
          turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: handleVerify,
          "expired-callback": onExpire,
          "error-callback": onError,
          theme,
        });
      })
      .catch((err) => {
        console.error("Turnstile load error:", err);
        onError?.();
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, handleVerify, onExpire, onError, theme]);

  if (!siteKey) return null;

  return (
    <div
      id={containerId}
      ref={containerRef}
      className={className}
      aria-label="Security verification"
    />
  );
}
