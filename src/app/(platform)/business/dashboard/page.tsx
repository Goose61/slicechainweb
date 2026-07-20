"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  businessApi,
  calcAnalytics,
  formatCurrency,
  shortAddress,
  type BusinessProfile,
  type Transaction,
  type EmployeeCommission,
} from "@/lib/api";
import { homeUrl } from "@/lib/siteUrl";
import { businessSignupPath } from "@/content/landing-content";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Pizza, LayoutDashboard, Receipt, Users, QrCode, Settings,
  LogOut, RefreshCw, Download, Eye, Wallet, DollarSign, Copy,
  Building2, ExternalLink, Loader2, AlertTriangle,
} from "lucide-react";
import { ClientErrorLogger } from "@/components/client-error-logger";

function getCustomerWallet(tx: Transaction) {
  return tx.customerWallet || (tx.walletAddress && tx.walletAddress !== "external" ? tx.walletAddress : null);
}

function StatCard({
  title, value, icon: Icon, description, loading, gradient,
}: {
  title: string; value: string; icon: React.ElementType; description?: string; loading?: boolean; gradient: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full`} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-sm font-medium">{title}</CardDescription>
          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${gradient} text-white`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status.toUpperCase()}
    </span>
  );
}

export default function BusinessDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const demoMode = pathname?.startsWith("/business/demo") ?? false;
  const [token, setToken] = useState<string | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState({ totalTransactions: 0, totalRevenue: 0, totalVaultContribution: 0, totalPlatformFees: 0, totalAmount: 0 });
  const [employees, setEmployees] = useState<EmployeeCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [settingsForm, setSettingsForm] = useState({
    businessName: "", contactEmail: "", contactPhone: "", walletAddress: "", emailNotifications: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const t = demoMode
      ? sessionStorage.getItem("businessToken")
      : localStorage.getItem("businessToken") || sessionStorage.getItem("businessToken");
    if (!t) {
      router.replace(demoMode ? "/business/demo" : "/business/login");
      return;
    }
    setToken(t);
  }, [router, demoMode]);

  function clearBusinessSession() {
    ["businessToken", "businessEmail", "businessType", "businessId", "demoMode"].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
  }

  function isSessionExpiredError(err: unknown) {
    const code = err && typeof err === "object" && "code" in err ? String((err as { code?: string }).code || "") : "";
    const message = err instanceof Error ? err.message : "";
    return code === "TOKEN_EXPIRED" || /session expired/i.test(message);
  }

  const loadData = useCallback(async (t: string) => {
    try {
      setLoading(true);
      const [profileRes, txRes] = await Promise.all([
        businessApi.getProfile(t),
        businessApi.getTransactions(t),
      ]);
      setBusiness(profileRes.business);
      const txs = txRes.transactions;
      setTransactions(txs);
      setAnalytics(calcAnalytics(txs));
      setSettingsForm({
        businessName: profileRes.business.businessName,
        contactEmail: profileRes.business.contact?.email || "",
        contactPhone: profileRes.business.contact?.phone || "",
        walletAddress: profileRes.business.businessWallet?.publicKey || profileRes.business.walletAddress || "",
        emailNotifications: profileRes.business.settings?.emailNotifications !== false,
      });
    } catch (err: unknown) {
      if (isSessionExpiredError(err)) {
        toast.error("Session expired. Please sign in again.");
        clearBusinessSession();
        router.replace(demoMode ? "/business/demo" : "/business/login");
        return;
      }
      toast.error(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [demoMode, router]);

  useEffect(() => {
    if (token) loadData(token);
  }, [token, loadData]);

  const loadEmployees = useCallback(async () => {
    if (!token) return;
    setEmployeesLoading(true);
    try {
      const data = await businessApi.getEmployeeCommissions(token);
      setEmployees(data.employees || []);
    } catch (err: unknown) {
      if (isSessionExpiredError(err)) {
        toast.error("Session expired. Please sign in again.");
        clearBusinessSession();
        router.replace(demoMode ? "/business/demo" : "/business/login");
        return;
      }
      toast.error(err instanceof Error ? err.message : "Failed to load employees");
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  }, [token, demoMode, router]);

  useEffect(() => {
    if (token && activeTab === "employees") loadEmployees();
  }, [token, activeTab, loadEmployees]);

  async function saveSettings() {
    if (!token) return;
    if (demoMode) {
      toast.info("Demo mode - settings are not saved. Sign up for your own account to make changes.");
      return;
    }
    setSavingSettings(true);
    try {
      const res = await businessApi.updateSettings(token, {
        businessName: settingsForm.businessName,
        contactEmail: settingsForm.contactEmail,
        contactPhone: settingsForm.contactPhone,
        emailNotifications: settingsForm.emailNotifications,
      });
      setBusiness(res.business);
      toast.success("Settings saved successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  }

  function exportTransactions() {
    if (!transactions.length) { toast.info("No transactions to export."); return; }
    const headers = ["Date", "ID", "Amount", "Currency", "Status", "Customer Wallet", "Platform Fee", "Reward"];
    const rows = transactions.map((tx) => [
      new Date(tx.createdAt).toLocaleString(),
      tx._id,
      (tx.amount || 0).toFixed(2),
      tx.inputToken?.symbol || "USDC",
      tx.status,
      getCustomerWallet(tx) || "N/A",
      (tx.fees?.platformFee || 0).toFixed(2),
      (tx.rewards?.pizzarRewardsDistributed || tx.rewards?.pizzaTokensDistributed || 0).toFixed(2),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transactions exported!");
  }

  function openVendorQR() {
    if (!business) return;
    const wallet = business.businessWallet?.publicKey || business.walletAddress;
    if (!wallet) { toast.error("Set a wallet address first."); return; }
    const t = token || "";
    const qrBase = typeof window !== "undefined" && window.location.hostname.endsWith("slicechain.io")
      ? "https://qr.slicechain.io"
      : "http://localhost:3002";
    const url = `${qrBase}?businessId=${business._id}&businessName=${encodeURIComponent(business.businessName)}&businessWallet=${encodeURIComponent(wallet)}&token=${encodeURIComponent(t)}${demoMode ? "&demo=true" : ""}`;
    window.open(url, "_blank", "width=900,height=1000");
  }

  function logout() {
    clearBusinessSession();
    if (demoMode) {
      window.location.href = homeUrl();
      return;
    }
    router.replace("/business/login");
  }

  const chartData = (() => {
    const days: Record<string, { date: string; transactions: number; revenue: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      days[key] = { date: key, transactions: 0, revenue: 0 };
    }
    transactions.forEach((tx) => {
      const d = new Date(tx.createdAt);
      const key = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      if (key in days) {
        days[key].transactions++;
        days[key].revenue += tx.amount || 0;
      }
    });
    return Object.values(days);
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-2 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Pizza className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-none">{business?.businessName || "Business"}</p>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">
                {demoMode ? "Demo · CN Business" : "CN Business"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {demoMode && (
              <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                <a href={businessSignupPath}>Sign up</a>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => token && loadData(token)} title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4 mr-1.5" />
              {demoMode ? "Exit demo" : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      {demoMode && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="container mx-auto px-4 py-2.5 flex items-start gap-2 text-sm text-amber-900">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <p>
              <strong>Demo mode.</strong> You&apos;re exploring the platform as{" "}
              <strong>Aseem&apos;s Dough Palooza</strong>. Generate QR codes and browse the dashboard -
              any real payments made from demo QR codes will not be settled.{" "}
              <a href={businessSignupPath} className="underline font-medium hover:text-amber-950">
                Create your account
              </a>{" "}
              to accept live payments.
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {[
              { value: "overview", icon: LayoutDashboard, label: "Overview" },
              { value: "transactions", icon: Receipt, label: "Transactions" },
              { value: "employees", icon: Users, label: "Employees" },
              { value: "payment", icon: QrCode, label: "Payment QR" },
              { value: "settings", icon: Settings, label: "Settings" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1.5 text-xs px-3"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Revenue" value={formatCurrency(analytics.totalRevenue)} icon={DollarSign} description="After all fees" loading={false} gradient="from-green-500 to-emerald-600" />
              <StatCard title="Transactions" value={analytics.totalTransactions.toString()} icon={Receipt} description="All time" loading={false} gradient="from-blue-500 to-cyan-500" />
              <StatCard title="Platform Fees Paid" value={formatCurrency(analytics.totalPlatformFees)} icon={Wallet} description="1.6% of volume" loading={false} gradient="from-violet-500 to-purple-600" />
              <StatCard title="Fee Structure" value="1.6%" icon={Building2} description="Platform fee per transaction" loading={false} gradient="from-orange-500 to-amber-500" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Daily Transactions (7 days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.split(",")[0]} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="transactions" stroke="#3b82f6" fill="url(#txGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Revenue by Day (7 days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.split(",")[0]} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, "Revenue"]} />
                      <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick QR button */}
            <Card className="border-dashed">
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Quick Payment QR</p>
                    <p className="text-xs text-muted-foreground">Open vendor QR generator</p>
                  </div>
                </div>
                <Button onClick={openVendorQR} className="bg-gradient-to-r from-blue-500 to-violet-600 text-white border-0">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open QR Generator
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Transactions</h2>
                <p className="text-sm text-muted-foreground">{transactions.length} total records</p>
              </div>
              <Button variant="outline" size="sm" onClick={exportTransactions}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <Receipt className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        No transactions yet. Generate a QR code to accept your first payment.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx._id}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleDateString()}<br />
                          {new Date(tx.createdAt).toLocaleTimeString()}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{tx._id.slice(0, 8)}…</TableCell>
                        <TableCell className="font-semibold">${(tx.amount || 0).toFixed(2)}</TableCell>
                        <TableCell><StatusBadge status={tx.status} /></TableCell>
                        <TableCell className="font-mono text-xs">{getCustomerWallet(tx) ? shortAddress(getCustomerWallet(tx)!) : "-"}</TableCell>
                        <TableCell className="text-xs">${(tx.fees?.platformFee || 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedTx(tx)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Employees */}
          <TabsContent value="employees" className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Employee Commissions</h2>
              <p className="text-sm text-muted-foreground">Employees earn 0.3% commission per facilitated transaction</p>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-blue-800">Business ID (share with employees for signup)</p>
                    <p className="font-mono text-sm text-blue-700 bg-blue-100 px-3 py-1.5 rounded border border-blue-200">{business?._id}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { navigator.clipboard.writeText(business?._id || ""); toast.success("Copied!"); }}
                    className="border-blue-300 text-blue-700"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Total Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeesLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        Loading employees…
                      </TableCell>
                    </TableRow>
                  ) : employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        No employees yet. Share your Business ID for employees to register.
                      </TableCell>
                    </TableRow>
                  ) : (
                    employees.map((emp) => (
                      <TableRow key={emp.employeeId}>
                        <TableCell className="font-mono text-xs">{emp.employeeId}</TableCell>
                        <TableCell>{emp.fullName}</TableCell>
                        <TableCell className="font-mono text-xs">{emp.wallet?.usdcAddress ? shortAddress(emp.wallet.usdcAddress) : "-"}</TableCell>
                        <TableCell>{emp.stats?.totalTransactionsFacilitated || 0}</TableCell>
                        <TableCell className="font-medium text-green-600">{formatCurrency(emp.commission?.totalEarned || 0)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Payment QR */}
          <TabsContent value="payment" className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Payment QR</h2>
              <p className="text-sm text-muted-foreground">Open the QR app to accept Solana and multichain payments</p>
            </div>
            <Card className="border-dashed">
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">QR Payment Generator</p>
                    <p className="text-sm text-muted-foreground">
                      Business wallet:{" "}
                      <span className="font-mono text-xs">
                        {shortAddress(business?.businessWallet?.publicKey || business?.walletAddress || "") || "Not set"}
                      </span>
                    </p>
                  </div>
                </div>
                <Button onClick={openVendorQR} className="bg-gradient-to-r from-blue-500 to-violet-600 text-white border-0">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open QR Generator
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Business Settings</h2>
              <p className="text-sm text-muted-foreground">
                {demoMode
                  ? "Preview settings - changes are not saved in demo mode"
                  : "Update your business information and preferences"}
              </p>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input
                      value={settingsForm.businessName}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, businessName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={settingsForm.contactEmail}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, contactEmail: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input
                      type="tel"
                      value={settingsForm.contactPhone}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, contactPhone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Solana Wallet Address</Label>
                    <Input
                      readOnly
                      value={settingsForm.walletAddress}
                      placeholder="Not configured"
                      className="font-mono text-sm bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">Contact support to update your wallet address.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsForm.emailNotifications}
                    onCheckedChange={(v) => setSettingsForm((p) => ({ ...p, emailNotifications: v }))}
                  />
                  <Label>Email notifications for new transactions</Label>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={saveSettings} disabled={savingSettings || demoMode} className="flex-1">
                    {savingSettings ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : demoMode ? "Demo - not saved" : "Save Settings"}
                  </Button>
                  <Button variant="outline" onClick={() => token && loadData(token)}>Reset</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Full information for transaction {selectedTx?._id.slice(0, 12)}…</DialogDescription>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-3 text-sm">
              {[
                ["Transaction ID", <span key="id" className="font-mono text-xs">{selectedTx._id}</span>],
                ["Amount", `${(selectedTx.amount || 0).toFixed(2)} ${selectedTx.inputToken?.symbol || "USDC"}`],
                ["Status", <StatusBadge key="status" status={selectedTx.status} />],
                ["Date", new Date(selectedTx.createdAt).toLocaleString()],
                ["Customer Wallet", getCustomerWallet(selectedTx) ? shortAddress(getCustomerWallet(selectedTx)!) : "-"],
                ["Platform Fee", formatCurrency(selectedTx.fees?.platformFee || 0)],
                ["Reward", selectedTx.rewards?.pizzarRewardsDistributed
                  ? `${selectedTx.rewards.pizzarRewardsDistributed.toFixed(2)} SLICE`
                  : `${(selectedTx.rewards?.pizzaTokensDistributed || 0).toFixed(1)} $PIZZA`],
              ].map(([label, value], i) => (
                <div key={i} className="flex justify-between border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ClientErrorLogger source={demoMode ? "business-demo-dashboard" : "business-dashboard"} />
    </div>
  );
}
