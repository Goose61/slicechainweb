"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminApi, formatCurrency, shortAddress, type Transaction, type TransactionStats } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Pizza, Shield, LogOut, RefreshCw, TrendingUp, DollarSign, Receipt, AlertCircle, CheckCircle, Clock, Loader2, Search, Mail, Store } from "lucide-react";
import { NewsletterTab } from "@/components/admin/NewsletterTab";
import { FoundingMerchantTab } from "@/components/admin/FoundingMerchantTab";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { completed: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", failed: "bg-red-100 text-red-700" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? "bg-gray-100 text-gray-700"}`}>{status.toUpperCase()}</span>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const PAGE_SIZE = 20;

  useEffect(() => {
    const t = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
    if (!t) { router.replace("/admin/login"); return; }
    setToken(t);
  }, [router]);

  const loadStats = useCallback(async (t: string) => {
    try {
      const data = await adminApi.getTransactionStats(t);
      setStats(data);
    } catch { /* stats may not exist */ }
    setLoading(false);
  }, []);

  const loadTransactions = useCallback(async (t: string, p = 1, status = "all") => {
    setTxLoading(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: String(PAGE_SIZE) };
      if (status !== "all") params.status = status;
      const data = await adminApi.getTransactions(t, params);
      setTransactions(data.transactions);
      setTotal(data.total);
    } catch {
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) { loadStats(token); loadTransactions(token, 1, statusFilter); }
  }, [token, loadStats, loadTransactions, statusFilter]);

  function logout() {
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminToken");
    router.replace("/admin/login");
  }

  const pieData = stats ? [
    { name: "Completed", value: stats.completed, color: "#22c55e" },
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Failed", value: stats.failed, color: "#ef4444" },
  ] : [];

  const filtered = search
    ? transactions.filter((tx) => tx._id.includes(search) || (tx.walletAddress || "").includes(search))
    : transactions;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-none">Platform Admin</p>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">Pizza Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { if (token) { loadStats(token); loadTransactions(token, page, statusFilter); } }}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4 mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Transactions", value: stats?.total || 0, icon: Receipt, color: "from-blue-500 to-cyan-500" },
            { label: "Total Volume", value: formatCurrency(stats?.totalVolume || 0), icon: DollarSign, color: "from-green-500 to-emerald-600" },
            { label: "Completed", value: stats?.completed || 0, icon: CheckCircle, color: "from-emerald-500 to-green-600" },
            { label: "Pending", value: stats?.pending || 0, icon: Clock, color: "from-yellow-500 to-amber-500" },
            { label: "Failed", value: stats?.failed || 0, icon: AlertCircle, color: "from-red-500 to-rose-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs">{label}</CardDescription>
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${color} text-white`}><Icon className="w-3.5 h-3.5" /></div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? <div className="h-7 w-16 bg-muted rounded animate-pulse" /> : <div className="text-xl font-bold">{value}</div>}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions" className="flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5" />Transactions</TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" />Analytics</TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Newsletter</TabsTrigger>
            <TabsTrigger value="founding-merchants" className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5" />Founding Merchants</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4 mt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or wallet…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Customer Wallet</TableHead>
                    <TableHead>Fees</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {txLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j}><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        <Receipt className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((tx) => (
                      <TableRow key={tx._id}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleDateString()}<br />{new Date(tx.createdAt).toLocaleTimeString()}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{tx._id.slice(0, 10)}…</TableCell>
                        <TableCell className="font-semibold">${(tx.amount || 0).toFixed(2)}</TableCell>
                        <TableCell><StatusBadge status={tx.status} /></TableCell>
                        <TableCell className="font-mono text-xs">{tx.walletAddress ? shortAddress(tx.walletAddress) : "-"}</TableCell>
                        <TableCell className="text-xs">${(tx.fees?.platformFee || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {total > PAGE_SIZE && (
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => { const p = Math.max(1, page - 1); setPage(p); if (token) loadTransactions(token, p, statusFilter); }} disabled={page === 1}>Previous</Button>
                <span className="px-3 py-1.5 text-sm text-muted-foreground">Page {page} of {Math.ceil(total / PAGE_SIZE)}</span>
                <Button variant="outline" size="sm" onClick={() => { const p = page + 1; setPage(p); if (token) loadTransactions(token, p, statusFilter); }} disabled={page >= Math.ceil(total / PAGE_SIZE)}>Next</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-sm font-semibold">Transaction Status Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm font-semibold">Platform Overview</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ["Total Volume", formatCurrency(stats?.totalVolume || 0)],
                    ["Success Rate", stats && stats.total > 0 ? `${((stats.completed / stats.total) * 100).toFixed(1)}%` : "0%"],
                    ["Avg Fee (1%)", formatCurrency((stats?.totalVolume || 0) * 0.01)],
                    ["Vault (1.3%)", formatCurrency((stats?.totalVolume || 0) * 0.013)],
                    ["Total Fees", formatCurrency((stats?.totalVolume || 0) * 0.023)],
                  ].map(([label, value]) => (
                    <div key={label as string} className="flex justify-between text-sm border-b pb-2 last:border-0">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {token ? (
            <>
              <TabsContent value="newsletter">
                <NewsletterTab token={token} />
              </TabsContent>
              <TabsContent value="founding-merchants">
                <FoundingMerchantTab token={token} />
              </TabsContent>
            </>
          ) : null}
        </Tabs>
      </div>
    </div>
  );
}
