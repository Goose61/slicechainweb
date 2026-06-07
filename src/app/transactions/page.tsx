"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, formatCurrency, shortAddress, type Transaction, type TransactionStats } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Receipt, DollarSign, TrendingUp, ArrowLeft, Search, Download, Loader2 } from "lucide-react";

type UserRole = "admin" | "business" | "customer" | "none";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { completed: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", failed: "bg-red-100 text-red-700" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? "bg-gray-100 text-gray-700"}`}>{status.toUpperCase()}</span>;
}

export default function TransactionHistoryPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("none");
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 25;

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
    const businessToken = localStorage.getItem("businessToken") || sessionStorage.getItem("businessToken");
    const customerToken = localStorage.getItem("customerToken") || sessionStorage.getItem("customerToken");

    if (adminToken) { setRole("admin"); setToken(adminToken); }
    else if (businessToken) { setRole("business"); setToken(businessToken); }
    else if (customerToken) { setRole("customer"); setToken(customerToken); }
    else setRole("none");
  }, []);

  const loadData = useCallback(async (t: string, r: UserRole, p = 1, status = "all") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
      if (status !== "all") params.set("status", status);

      let statsPath = "";
      let listPath = "";
      if (r === "admin") { statsPath = "/admin/transactions/stats"; listPath = `/admin/transactions?${params}`; }
      else if (r === "business") { statsPath = "/business/analytics"; listPath = `/business/transactions?${params}`; }
      else { listPath = `/blockchain/transactions?${params}`; }

      const [statsRes, listRes] = await Promise.all([
        statsPath ? apiFetch<TransactionStats>(statsPath, { token: t }).catch(() => null) : Promise.resolve(null),
        apiFetch<{ transactions: Transaction[]; total: number }>(listPath, { token: t }).catch(() => ({ transactions: [], total: 0 })),
      ]);

      if (statsRes) setStats(statsRes);
      setTransactions(listRes.transactions || []);
      setTotal(listRes.total || listRes.transactions?.length || 0);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && role !== "none") loadData(token, role, page, statusFilter);
    else if (role === "none") setLoading(false);
  }, [token, role, page, statusFilter, loadData]);

  function exportCSV() {
    if (!transactions.length) { toast.info("No transactions to export."); return; }
    const headers = ["Date", "ID", "Amount", "Currency", "Status", "Wallet", "Platform Fee"];
    const rows = transactions.map((tx) => [
      new Date(tx.createdAt).toLocaleString(), tx._id, (tx.amount || 0).toFixed(2),
      tx.inputToken?.symbol || "USDC", tx.status, tx.walletAddress || "N/A", (tx.fees?.platformFee || 0).toFixed(2),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredTx = search
    ? transactions.filter((tx) => tx._id.includes(search) || (tx.walletAddress || "").includes(search))
    : transactions;

  // Simple chart from transactions
  const chartData = (() => {
    const days: Record<string, { date: string; amount: number; count: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      days[k] = { date: k, amount: 0, count: 0 };
    }
    transactions.forEach((tx) => {
      const k = new Date(tx.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      if (k in days) { days[k].amount += tx.amount || 0; days[k].count++; }
    });
    return Object.values(days);
  })();

  const roleLabel = role === "admin" ? "Platform Admin" : role === "business" ? "Business" : role === "customer" ? "Customer" : "";

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Button>
            <div>
              <p className="font-semibold text-sm leading-none">Transaction History</p>
              {roleLabel && <p className="text-xs text-muted-foreground leading-none mt-0.5">{roleLabel} view</p>}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {role === "none" && !loading && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-yellow-800 font-medium">Please sign in to view transactions.</p>
              <div className="flex gap-2 justify-center mt-3">
                <Button size="sm" onClick={() => router.push("/business/login")}>Business Login</Button>
                <Button size="sm" variant="outline" onClick={() => router.push("/admin/login")}>Admin Login</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total", value: String(stats.total || 0), icon: Receipt, color: "from-blue-500 to-cyan-500" },
              { label: "Volume", value: formatCurrency(stats.totalVolume || 0), icon: DollarSign, color: "from-green-500 to-emerald-600" },
              { label: "Completed", value: String(stats.completed || 0), icon: TrendingUp, color: "from-emerald-500 to-green-600" },
              { label: "Pending", value: String(stats.pending || 0), icon: Loader2, color: "from-yellow-500 to-amber-500" },
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1 rounded-md bg-gradient-to-br ${color} text-white`}><Icon className="w-3.5 h-3.5" /></div>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                  <div className="text-xl font-bold">{value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Chart */}
        {transactions.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Volume (7 days)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.split(",")[0]} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, "Volume"]} />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="url(#grad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Filters + Table */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by ID or wallet…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                  <TableHead>Wallet</TableHead>
                  <TableHead>Platform Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredTx.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <Receipt className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTx.map((tx) => (
                    <TableRow key={tx._id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString()}<br />{new Date(tx.createdAt).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{tx._id.slice(0, 10)}…</TableCell>
                      <TableCell className="font-semibold">${(tx.amount || 0).toFixed(2)}</TableCell>
                      <TableCell><StatusBadge status={tx.status} /></TableCell>
                      <TableCell className="font-mono text-xs">{tx.walletAddress ? shortAddress(tx.walletAddress) : "—"}</TableCell>
                      <TableCell className="text-xs">${(tx.fees?.platformFee || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {total > PAGE_SIZE && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
              <span className="px-3 py-1.5 text-sm text-muted-foreground">Page {page} of {Math.ceil(total / PAGE_SIZE)}</span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / PAGE_SIZE)}>Next</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
