import { NextResponse } from "next/server";

const PIZZA_MINT = "4AkCN6KLeCmUDjWLg4XyQpuZuWtwBdPcbtBQjsA2pump";
const CACHE_MS = 60 * 60 * 1000; // 1 hour

type TokenStats = {
  priceUsd: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  holders: number | null;
  updatedAt: string;
};

let cache: { data: TokenStats; ts: number } | null = null;

function pickBestPair(pairs: Array<Record<string, unknown>>) {
  if (!pairs?.length) return null;
  return [...pairs].sort(
    (a, b) => ((b.liquidity as { usd?: number })?.usd ?? 0) - ((a.liquidity as { usd?: number })?.usd ?? 0)
  )[0];
}

async function fetchDexScreener(): Promise<Partial<TokenStats>> {
  const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${PIZZA_MINT}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("DexScreener unavailable");
  const json = await res.json();
  const pair = pickBestPair(json.pairs ?? []);
  if (!pair) throw new Error("No DexScreener pairs");

  return {
    priceUsd: parseFloat(String(pair.priceUsd ?? 0)),
    priceChange24h: parseFloat(
      String((pair.priceChange as { h24?: number })?.h24 ?? pair.priceChange24h ?? 0)
    ),
    marketCap: parseFloat(String(pair.marketCap ?? pair.fdv ?? 0)),
    volume24h: parseFloat(
      String((pair.volume as { h24?: number })?.h24 ?? 0)
    ),
  };
}

async function fetchRugcheckHolders(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.rugcheck.xyz/v1/tokens/${PIZZA_MINT}/report`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const count = json.totalHolders;
    return typeof count === "number" ? count : null;
  } catch {
    return null;
  }
}

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_MS) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=300" },
    });
  }

  let partial: Partial<TokenStats> = {};
  let holders: number | null = null;

  try {
    partial = await fetchDexScreener();
  } catch {
    return NextResponse.json({ error: "Token stats unavailable" }, { status: 503 });
  }

  holders = await fetchRugcheckHolders();

  const data: TokenStats = {
    priceUsd: partial.priceUsd ?? 0,
    priceChange24h: partial.priceChange24h ?? 0,
    marketCap: partial.marketCap ?? 0,
    volume24h: partial.volume24h ?? 0,
    holders,
    updatedAt: new Date().toISOString(),
  };

  cache = { data, ts: Date.now() };

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=300" },
  });
}
