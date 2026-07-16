"use client";

import { useEffect } from "react";

type LandingStats = {
  totalTransactions: number;
  activePartners: number;
};

export function useLandingStats() {
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { getApiBase } = await import("@/lib/api");
        const { ACTIVE_PARTNER_COUNT, updateLandingStatsOnPage } = await import("@/lib/pizza-map-data");
        const res = await fetch(`${getApiBase()}/public/landing-stats`);
        if (!res.ok) throw new Error("Stats unavailable");
        const data: LandingStats = await res.json();
        if (!cancelled) {
          updateLandingStatsOnPage({
            totalTransactions: data.totalTransactions,
            activePartners: data.activePartners ?? ACTIVE_PARTNER_COUNT,
          });
        }
      } catch (err) {
        console.warn("Landing stats fetch failed:", err);
        if (!cancelled) {
          const { ACTIVE_PARTNER_COUNT, updateLandingStatsOnPage } = await import("@/lib/pizza-map-data");
          updateLandingStatsOnPage({
            totalTransactions: 0,
            activePartners: ACTIVE_PARTNER_COUNT,
          });
        }
      }
    }

    const startPolling = () => {
      load();
      return setInterval(load, 5 * 60 * 1000);
    };

    let interval: ReturnType<typeof setInterval> | undefined;
    const idleId =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(() => {
            interval = startPolling();
          })
        : window.setTimeout(() => {
            interval = startPolling();
          }, 1500);

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function" && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
      if (interval) clearInterval(interval);
    };
  }, []);
}
