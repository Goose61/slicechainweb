"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pizza, LogOut, Wallet, TrendingUp, Gift, User, RefreshCw } from "lucide-react";

export default function CustomerDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("customerToken") || sessionStorage.getItem("customerToken");
    if (!t) { router.replace("/customer/login"); return; }
    setToken(t);
    // Decode email from JWT payload (no library needed for basic decode)
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      setEmail(payload.email || payload.userId || "");
    } catch { /* ignore */ }
  }, [router]);

  function logout() {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerRemember");
    sessionStorage.removeItem("customerToken");
    router.replace("/customer/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
              <Pizza className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-none">My Account</p>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">{email || "Customer"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4 mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Profile Banner */}
        <Card className="bg-gradient-to-br from-orange-500 to-rose-500 text-white border-0 shadow-xl shadow-orange-500/20">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{email || "Customer"}</h2>
                <p className="text-orange-100 text-sm">Pizza Platform Member</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats placeholder */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Transactions", value: "0", icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
            { label: "SLICE Rewards", value: "0", icon: Gift, color: "from-violet-500 to-purple-600" },
            { label: "Wallet", value: "N/A", icon: Wallet, color: "from-green-500 to-emerald-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardHeader className="pb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6 pb-6 text-center space-y-2">
            <p className="font-medium text-sm">Transaction History</p>
            <p className="text-sm text-muted-foreground">Your payment history across all Pizza Platform businesses</p>
            <Button variant="outline" onClick={() => router.push("/transactions")} className="mt-2">
              View Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
