"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";
import { loadTurnstile } from "@/lib/turnstile-loader";

interface TurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: "light" | "dark" | "auto";
  className?: string;
}

export interface TurnstileWidgetHandle {
  getToken: () => string | null;
  reset: () => void;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  function TurnstileWidget(
    {
      siteKey,
      onVerify,
      onExpire,
      onError,
      theme = "dark",
      className,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const reactId = useId();
    const containerId = `turnstile-${reactId.replace(/:/g, "")}`;

    const onVerifyRef = useRef(onVerify);
    const onExpireRef = useRef(onExpire);
    const onErrorRef = useRef(onError);
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;

    useImperativeHandle(ref, () => ({
      getToken: () => {
        if (!widgetIdRef.current || !window.turnstile?.getResponse) return null;
        const response = window.turnstile.getResponse(widgetIdRef.current);
        return response || null;
      },
      reset: () => {
        if (widgetIdRef.current && window.turnstile?.reset) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }), []);

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
            callback: (token: string) => onVerifyRef.current(token),
            "expired-callback": () => onExpireRef.current?.(),
            "error-callback": () => onErrorRef.current?.(),
            theme,
          });
        })
        .catch((err) => {
          console.error("Turnstile load error:", err);
          onErrorRef.current?.();
        });

      return () => {
        cancelled = true;
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }, [siteKey, theme]);

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
);
