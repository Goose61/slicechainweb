"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  businessApi,
  calcAnalytics,
  formatCurrency,
  shortAddress,
  type BusinessProfile,
  type Transaction,
  type EmployeeCommission,
} from "@/lib/api";
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
  Pizza, LayoutDashboard, Receipt, Users, Banknote, QrCode, Settings,
  LogOut, RefreshCw, Download, Eye, Wallet, DollarSign,
  Building2, Copy, ExternalLink, Loader2,
} from "lucide-react";

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
  const [token, setToken] = useState<string | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState({ totalTransactions: 0, totalRevenue: 0, totalVaultContribution: 0, totalPlatformFees: 0, totalAmount: 0 });
  const [employees, setEmployees] = useState<EmployeeCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [qrSvg, setQrSvg] = useState<string>("");
  const [qrPaymentUrl, setQrPaymentUrl] = useState("");
  const [qrRef, setQrRef] = useState("");
  const [qrAmount, setQrAmount] = useState("15");
  const [qrMemo, setQrMemo] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [showQrWallet, setShowQrWallet] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    businessName: "", contactEmail: "", contactPhone: "", walletAddress: "", emailNotifications: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("businessToken") || sessionStorage.getItem("businessToken");
    if (!t) { router.replace("/business/login"); return; }
    setToken(t);
  }, [router]);

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
      setQrMemo(`Pizza - ${profileRes.business.businessName}`.slice(0, 32));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadData(token);
  }, [token, loadData]);

  async function loadEmployees() {
    if (!token) return;
    try {
      const data = await businessApi.getEmployeeCommissions(token);
      setEmployees(data.employees);
    } catch { /* ignore */ }
  }

  async function generateQR() {
    if (!business || !token) return;
    const recipient = business.businessWallet?.publicKey || business.walletAddress;
    if (!recipient) { toast.error("Please add a wallet address in Settings first."); return; }
    if (!business._id) { toast.error("Business ID not found. Please refresh."); return; }

    setQrLoading(true);
    setShowQrWallet(false);
    setQrSvg("");
    try {
      const reference = `ref_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const data = await businessApi.getProfile(token);
      const businessId = data.business._id;
      const res = await fetch("/api/solana-pay-transaction/generate-qr", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          amount: parseFloat(qrAmount) || 15,
          businessId,
          baseUrl: window.location.origin,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to generate QR");
      setQrSvg(json.svgQRCode);
      setQrPaymentUrl(json.solanaPayUrl);
      setQrRef(reference);
      toast.success("QR code ready — select a wallet to display");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "QR generation failed");
    } finally {
      setQrLoading(false);
    }
  }

  async function saveSettings() {
    if (!token) return;
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
      tx.walletAddress || "N/A",
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
    const url = `${qrBase}?businessId=${business._id}&businessName=${encodeURIComponent(business.businessName)}&businessWallet=${encodeURIComponent(wallet)}&token=${encodeURIComponent(t)}`;
    window.open(url, "_blank", "width=900,height=1000");
  }

  function logout() {
    ["businessToken", "businessEmail", "businessType", "businessId"].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
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
              <p className="text-xs text-muted-foreground leading-none mt-0.5">CN Business</p>
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

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {[
              { value: "overview", icon: LayoutDashboard, label: "Overview" },
              { value: "transactions", icon: Receipt, label: "Transactions" },
              { value: "employees", icon: Users, label: "Employees" },
              { value: "payment", icon: QrCode, label: "Payment QR" },
              { value: "settlement", icon: Banknote, label: "Settlement" },
              { value: "settings", icon: Settings, label: "Settings" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1.5 text-xs px-3"
                onClick={() => {
                  if (value === "employees") loadEmployees();
                }}
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
                        <TableCell className="font-mono text-xs">{tx.walletAddress ? shortAddress(tx.walletAddress) : "—"}</TableCell>
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
                    <TableHead>Pending</TableHead>
                    <TableHead>Last Payout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        No employees yet. Share your Business ID for employees to register.
                      </TableCell>
                    </TableRow>
                  ) : (
                    employees.map((emp) => (
                      <TableRow key={emp.employeeId}>
                        <TableCell className="font-mono text-xs">{emp.employeeId}</TableCell>
                        <TableCell>{emp.fullName}</TableCell>
                        <TableCell className="font-mono text-xs">{emp.wallet?.usdcAddress ? shortAddress(emp.wallet.usdcAddress) : "—"}</TableCell>
                        <TableCell>{emp.stats?.totalTransactionsFacilitated || 0}</TableCell>
                        <TableCell className="font-medium text-green-600">{formatCurrency(emp.commission?.totalEarned || 0)}</TableCell>
                        <TableCell className="text-amber-600">{formatCurrency(emp.commission?.pending || 0)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{emp.commission?.lastPayoutAt ? new Date(emp.commission.lastPayoutAt).toLocaleDateString() : "—"}</TableCell>
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
              <h2 className="text-lg font-semibold">Solana Pay QR Generator</h2>
              <p className="text-sm text-muted-foreground">Generate a QR code for customers to scan and pay</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Amount (USD)</Label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={qrAmount}
                      onChange={(e) => setQrAmount(e.target.value)}
                      placeholder="15.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Memo (optional)</Label>
                    <Input
                      value={qrMemo}
                      onChange={(e) => setQrMemo(e.target.value.slice(0, 32))}
                      placeholder="Pizza payment"
                      maxLength={32}
                    />
                    <p className="text-xs text-muted-foreground">{qrMemo.length}/32 characters</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Business Wallet:</span>
                      <span className="font-mono text-xs">{shortAddress(business?.businessWallet?.publicKey || business?.walletAddress || "") || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee:</span>
                      <span>1.6%</span>
                    </div>
                  </div>
                  <Button
                    onClick={generateQR}
                    disabled={qrLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white border-0"
                  >
                    {qrLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><QrCode className="w-4 h-4 mr-2" />Generate QR Code</>}
                  </Button>
                  <Button variant="outline" onClick={openVendorQR} className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Full QR Generator
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">QR Code</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-64 space-y-4">
                  {!qrSvg && !qrLoading && (
                    <div className="text-center text-muted-foreground space-y-2">
                      <QrCode className="w-16 h-16 mx-auto opacity-20" />
                      <p className="text-sm">Configure payment details and click Generate</p>
                    </div>
                  )}
                  {qrLoading && <Loader2 className="w-10 h-10 animate-spin text-primary" />}
                  {qrSvg && !showQrWallet && (
                    <div className="space-y-3 text-center">
                      <p className="text-sm font-medium">Select wallet to display QR:</p>
                      <div className="flex gap-3">
                        <Button size="sm" onClick={() => setShowQrWallet(true)}>
                          Solflare Wallet
                        </Button>
                        <Button size="sm" variant="outline" disabled>
                          Phantom (soon)
                        </Button>
                      </div>
                    </div>
                  )}
                  {qrSvg && showQrWallet && (
                    <div className="space-y-3 w-full">
                      <div className="bg-white p-4 rounded-xl border flex justify-center" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-medium text-foreground">${parseFloat(qrAmount).toFixed(2)} USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reference:</span>
                          <span className="font-mono">{qrRef.slice(0, 12)}…</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => { navigator.clipboard.writeText(qrPaymentUrl); toast.success("URL copied!"); }}
                      >
                        <Copy className="w-3.5 h-3.5 mr-2" />
                        Copy Payment URL
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settlement */}
          <TabsContent value="settlement" className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Settlement</h2>
              <p className="text-sm text-muted-foreground">CN businesses retain USDC directly in their wallet</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Current Balance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(analytics.totalRevenue)}</div>
                  <p className="text-sm text-muted-foreground">Retained USDC after platform fees</p>
                  <Button className="w-full" onClick={() => { toast.info("USDC withdrawal via Ramp will be available soon!"); }}>
                    <Wallet className="w-4 h-4 mr-2" />
                    Request USDC Withdrawal
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Fee Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-medium">1.6%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Employee Commission</span>
                    <span className="font-medium">0.3%</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-3">
                    <span className="text-muted-foreground">Total Fees Paid</span>
                    <span className="font-semibold">{formatCurrency(analytics.totalPlatformFees)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Transactions</span>
                    <span className="font-medium">{analytics.totalTransactions}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Business Settings</h2>
              <p className="text-sm text-muted-foreground">Update your business information and preferences</p>
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
                  <Button onClick={saveSettings} disabled={savingSettings} className="flex-1">
                    {savingSettings ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : "Save Settings"}
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
                ["Customer Wallet", selectedTx.walletAddress ? shortAddress(selectedTx.walletAddress) : "—"],
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
    </div>
  );
}
