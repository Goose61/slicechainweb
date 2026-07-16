"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { employeeApi, formatCurrency, type Employee, type WeeklyCommission } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Pizza, Receipt, DollarSign, TrendingUp, QrCode, LogOut, RefreshCw, ExternalLink, Loader2, User } from "lucide-react";
import { ClientErrorLogger } from "@/components/client-error-logger";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [business, setBusiness] = useState<{ businessName: string; _id: string; walletAddress?: string; businessWallet?: { publicKey: string } } | null>(null);
  const [weekly, setWeekly] = useState<WeeklyCommission | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("employeeToken") || sessionStorage.getItem("employeeToken");
    if (!t) { router.replace("/employee/login"); return; }
    setToken(t);
  }, [router]);

  const loadData = useCallback(async (t: string) => {
    setLoading(true);
    try {
      const data = await employeeApi.getMe(t);
      setEmployee(data.employee);
      setBusiness(data.business as typeof business);
      setWeekly(data.weeklyCommission);
      // Cache for QR generator
      if (data.employee.employeeId) localStorage.setItem("employeeId", data.employee.employeeId);
      if (data.employee.fullName) localStorage.setItem("employeeFullName", data.employee.fullName);
      const biz = data.business as { _id?: string; businessName?: string; walletAddress?: string; businessWallet?: { publicKey: string } };
      if (biz._id) { localStorage.setItem("employeeBusinessId", biz._id); localStorage.setItem("currentBusinessId", biz._id); }
      if (biz.businessName) localStorage.setItem("currentBusinessName", biz.businessName);
      const wallet = biz.walletAddress || biz.businessWallet?.publicKey;
      if (wallet) localStorage.setItem("currentBusinessWallet", wallet);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadData(token);
  }, [token, loadData]);

  async function openQRGenerator() {
    if (!token) return;
    setQrLoading(true);
    try {
      const data = await employeeApi.getBusinessForQR(token);
      if (!data.success || !data.businessId) { toast.error("Could not load business data."); return; }
      if (!data.businessWallet || data.businessWallet === "Not linked") {
        toast.error("Business wallet not set. Ask your owner to add it in Settings.");
        return;
      }
      const employeeId = localStorage.getItem("employeeId") || "";
      const employeeName = localStorage.getItem("employeeFullName") || "";
      const qrBase = typeof window !== "undefined" && window.location.hostname.endsWith("slicechain.io")
        ? "https://qr.slicechain.io" : "http://localhost:3002";
      let url = `${qrBase}?businessId=${encodeURIComponent(data.businessId)}&businessName=${encodeURIComponent(data.businessName)}&businessWallet=${encodeURIComponent(data.businessWallet)}&token=${encodeURIComponent(token)}`;
      if (employeeId) url += `&employeeId=${encodeURIComponent(employeeId)}`;
      if (employeeName) url += `&employeeName=${encodeURIComponent(employeeName)}`;
      if (employeeId) localStorage.setItem("qrEmployeeId", employeeId);
      window.open(url, "_blank", "width=900,height=1000");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not load business data.");
    } finally {
      setQrLoading(false);
    }
  }

  function logout() {
    ["employeeToken", "employeeId", "employeeFullName", "employeeBusinessId", "employeeRemember", "qrEmployeeId", "currentBusinessId", "currentBusinessName", "currentBusinessWallet"].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    router.replace("/employee/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
              <Pizza className="w-4 h-4 text-white" />
            </div>
            <div>
              {loading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <>
                  <p className="font-semibold text-sm leading-none">{employee?.fullName || "Employee"}</p>
                  <p className="text-xs text-muted-foreground leading-none mt-0.5">{business?.businessName || "Business"}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => token && loadData(token)} title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4 mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Profile card */}
        <Card className="bg-gradient-to-br from-orange-500 to-rose-500 text-white border-0 shadow-xl shadow-orange-500/20">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-white/30" />
                    <Skeleton className="h-4 w-24 bg-white/20" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{employee?.fullName}</h2>
                    <p className="text-orange-100 text-sm">{business?.businessName}</p>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs mt-1">
                      ID: {employee?.employeeId}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Transactions", value: weekly?.totalTransactions || 0, icon: Receipt, color: "from-blue-500 to-cyan-500" },
            { label: "Volume", value: formatCurrency(weekly?.totalVolume || 0), icon: TrendingUp, color: "from-violet-500 to-purple-600" },
            { label: "Commission", value: formatCurrency(weekly?.commissionAmount || 0), icon: DollarSign, color: "from-green-500 to-emerald-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardHeader className="pb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-6 w-16" /> : <div className="text-xl font-bold">{value}</div>}
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* QR Generator CTA */}
        <Card className="border-dashed border-2 hover:border-orange-300 transition-colors">
          <CardContent className="pt-6 pb-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Payment QR Generator</h3>
              <p className="text-sm text-muted-foreground">Open the QR code generator to accept Solana Pay payments</p>
            </div>
            <Button
              onClick={openQRGenerator}
              disabled={qrLoading}
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white border-0 shadow-lg shadow-orange-500/25"
            >
              {qrLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading…</>
              ) : (
                <><ExternalLink className="w-4 h-4 mr-2" />Open QR Generator</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4 pb-4 text-sm space-y-2 text-muted-foreground">
            <p className="font-medium text-foreground">How commissions work</p>
            <p>You earn <strong className="text-foreground">0.3% commission</strong> on every payment you facilitate.</p>
            <p>Commissions are paid weekly directly to your Solana wallet address.</p>
          </CardContent>
        </Card>
      </div>
      <ClientErrorLogger source="employee-dashboard" />
    </div>
  );
}
