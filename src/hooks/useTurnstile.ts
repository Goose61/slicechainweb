"use client";

import { useCallback, useEffect, useState } from "react";
import { configApi } from "@/lib/api";

const ENV_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null;

export function useTurnstile() {
  const [siteKey, setSiteKey] = useState<string | null>(ENV_SITE_KEY);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    configApi
      .getTurnstileKey()
      .then((data) => {
        if (!cancelled) {
          setSiteKey(data.siteKey || ENV_SITE_KEY);
          setLoadError(!data.siteKey && !ENV_SITE_KEY);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSiteKey(ENV_SITE_KEY);
          setLoadError(!ENV_SITE_KEY);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onVerify = useCallback((t: string) => setToken(t), []);
  const onExpire = useCallback(() => setToken(null), []);
  const onError = useCallback(() => setToken(null), []);
  const resetToken = useCallback(() => setToken(null), []);

  return {
    siteKey,
    token,
    loading,
    loadError,
    onVerify,
    onExpire,
    onError,
    resetToken,
    turnstileRequired: Boolean(siteKey),
  };
}
