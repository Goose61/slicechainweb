"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getApiBase } from "@/lib/api";

/**
 * Fallback deep link for wallet_gate mode — creates or resumes a checkout session.
 */
export default function TravelRuleVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const businessId = searchParams.get("businessId");
    const ref = searchParams.get("ref");
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      router.replace(`/checkout/${sessionId}`);
      return;
    }

    if (!businessId) {
      setError("Missing business reference. Use the merchant checkout link.");
      return;
    }

    (async () => {
      try {
        const base = getApiBase();
        const res = await fetch(`${base}/travel-rule/checkout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessId,
            paymentReference: ref || undefined,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Could not start verification");
        if (!json.travelRuleRequired) {
          setError("Travel Rule is not required for this merchant.");
          return;
        }
        router.replace(`/checkout/${json.sessionId}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load verification");
      }
    })();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 text-slate-200 p-6">
        <p>{error}</p>
        <Link href="/privacy" className="text-violet-400 underline text-sm">
          Privacy Policy
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
      Starting verification…
    </div>
  );
}