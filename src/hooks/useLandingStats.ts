"use client";

import { useEffect } from "react";
import { ACTIVE_PARTNER_COUNT, updateLandingStatsOnPage } from "@/lib/pizza-map-data";

type LandingStats = {
  totalTransactions: number;
  activePartners: number;
};

export function useLandingStats() {
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/public/landing-stats");
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
          updateLandingStatsOnPage({
            totalTransactions: 0,
            activePartners: ACTIVE_PARTNER_COUNT,
          });
        }
      }
    }

    load();
    const interval = setInterval(load, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
}
