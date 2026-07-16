"use client";

import { useEffect } from "react";

export type PizzaTokenStats = {
  priceUsd: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  holders: number | null;
  updatedAt: string;
};

const REFRESH_MS = 60 * 60 * 1000;

function formatNum(n: number): string {
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + n.toFixed(0);
}

function applyStatsToDom(stats: PizzaTokenStats) {
  const priceStr =
    stats.priceUsd >= 0.01
      ? "$" + stats.priceUsd.toFixed(4)
      : "$" + stats.priceUsd.toFixed(8);
  const changeStr =
    (stats.priceChange24h > 0 ? "+" : "") + stats.priceChange24h.toFixed(2) + "%";
  const isUp = stats.priceChange24h > 0;
  const holdersStr =
    stats.holders != null ? stats.holders.toLocaleString() : "N/A";

  const set = (id: string, text: string, cls?: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    if (cls) el.className = cls;
  };

  set("t-price", priceStr);
  set("t-change", changeStr, isUp ? "up" : "dn");
  set("t-mcap", formatNum(stats.marketCap));
  set("t-vol", formatNum(stats.volume24h));
  set("t-holders", holdersStr);
  set("nav-price", `$PIZZA ${priceStr}`);
  set("h-mcap", formatNum(stats.marketCap));
  set("h-holders", holdersStr);

  const cc = document.getElementById("crew-count");
  if (cc) cc.textContent = holdersStr;

  const sh = document.getElementById("crew-stat-holders");
  const sm = document.getElementById("crew-stat-mcap");
  if (sh) sh.innerHTML = "<em>" + holdersStr + "</em>";
  if (sm) sm.innerHTML = "<em>" + formatNum(stats.marketCap) + "</em>";

  const tt = document.getElementById("token-ticker");
  if (tt) tt.classList.add("is-loaded");
}

export function usePizzaTokenStats() {
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/pizza-token");
        if (!res.ok) return;
        const stats: PizzaTokenStats = await res.json();
        if (!cancelled) applyStatsToDom(stats);
      } catch (err) {
        console.warn("Token stats fetch failed:", err);
      }
    }

    load();
    const interval = setInterval(load, REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
}
