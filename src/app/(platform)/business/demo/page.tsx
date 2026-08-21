"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { businessApi } from "@/lib/api";
import { homeUrl } from "@/lib/siteUrl";
import { Loader2, Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DEMO_STORAGE_KEYS = ["businessToken", "businessEmail", "businessType", "businessId", "demoMode"] as const;

function clearDemoSession() {
  DEMO_STORAGE_KEYS.forEach((key) => sessionStorage.removeItem(key));
}

export default function BusinessDemoPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function startDemo() {
      clearDemoSession();
      try {
        const data = await businessApi.demoLogin();
        if (cancelled) return;

        sessionStorage.setItem("businessToken", data.token);
        sessionStorage.setItem("businessId", data.businessId);
        sessionStorage.setItem("businessType", data.businessType);
        sessionStorage.setItem("businessEmail", "demo@doughpalooza.com");
        sessionStorage.setItem("demoMode", "true");

        router.replace("/business/demo/dashboard");
      } catch (err: unknown) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Could not start demo";
        setError(message);
        toast.error(message);
        setLoading(false);
      }
    }

    startDemo();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center mx-auto">
            <Pizza className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white">Demo unavailable</h1>
          <p className="text-slate-400 text-sm">{error}</p>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => {
              setError(null);
              setLoading(true);
              window.location.reload();
            }}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center mx-auto">
          <Pizza className="w-7 h-7 text-white" />
        </div>
        {loading && (
          <>
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-400" />
            <div>
              <p className="text-white font-medium">Loading demo dashboard…</p>
              <p className="text-slate-400 text-sm mt-1">Signing in as Aseem&apos;s Dough Palooza</p>
            </div>
          </>
        )}
        <a href={homeUrl()} className="text-xs text-slate-500 hover:text-slate-300">
          Back to home
        </a>
      </div>
    </div>
  );
}
