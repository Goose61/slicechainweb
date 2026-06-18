"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LandingClientEffects = dynamic(
  () => import("./LandingClientEffects").then((mod) => mod.LandingClientEffects),
  { ssr: false, loading: () => null }
);

export function LandingClientShell() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = () => {
      if (!cancelled) setReady(true);
    };

    const idleId =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(start, { timeout: 2000 })
        : window.setTimeout(start, 1);

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function" && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  if (!ready) return null;
  return <LandingClientEffects />;
}
