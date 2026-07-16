"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  adminApi,
  formatCurrency,
  shortAddress,
  fetchTreasuryOverview,
  treasuryTopUpGas,
  treasurySweepToken,
  treasurySweepChain,
  treasuryStakeTron,
  type Transaction,
  type TransactionStats,
  type UnreconciledDeposit,
  type AdminAuditLogEntry,
  type TreasuryOverview,
  type TreasuryEvmChain,
  type TreasuryTokenInfo,
} from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Shield, LogOut, RefreshCw, TrendingUp, DollarSign, Receipt, AlertCircle,
  CheckCircle, Clock, Loader2, Search, AlertTriangle, FileText, XCircle, Eye,
  Coins, Zap, ChevronDown, ChevronRight, Info, TriangleAlert, Mail, Store,
} from "lucide-react";
import { ClientErrorLogger } from "@/components/client-error-logger";
import { NewsletterTab } from "@/components/admin/NewsletterTab";
import { FoundingMerchantTab } from "@/components/admin/FoundingMerchantTab";

function normalizeStatus(status: string) {
  if (status === "confirmed" || status === "completed") return "completed";
  if (status === "processing") return "pending";
  return status;
}

function StatusBadge({ status }: { status: string }) {
  const normalized = normalizeStatus(status);
  const map: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[normalized] ?? "bg-gray-100 text-gray-700"}`}>
      {status.toUpperCase()}
    </span>
  );
}

function DepositStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    watching: "bg-blue-100 text-blue-700",
    confirmed: "bg-yellow-100 text-yellow-800",
    swept: "bg-amber-100 text-amber-800",
    bridged: "bg-orange-100 text-orange-800",
    split: "bg-purple-100 text-purple-700",
    failed: "bg-red-100 text-red-700",
    // expired-with-payment (rare recovery case) shown as warning
    expired: "bg-orange-100 text-orange-700",
    complete: "bg-green-100 text-green-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status.replace(/_/g, " ").toUpperCase()}
    </span>
  );
}

type DepositAction = "mark-failed" | "cancel";

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

  const [deposits, setDeposits] = useState<UnreconciledDeposit[]>([]);
  const [depositSummary, setDepositSummary] = useState<{ total: number; byStatus: Array<{ _id: string; count: number }> } | null>(null);
  const [depositsLoading, setDepositsLoading] = useState(false);
  const [depositPage, setDepositPage] = useState(1);
  const [depositTotal, setDepositTotal] = useState(0);
  const [depositStatusFilter, setDepositStatusFilter] = useState("all");
  const [selectedDeposit, setSelectedDeposit] = useState<UnreconciledDeposit | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [actionOpen, setActionOpen] = useState(false);
  const [actionType, setActionType] = useState<DepositAction>("mark-failed");
  const [actionDeposit, setActionDeposit] = useState<UnreconciledDeposit | null>(null);
  const [confirmationTxId, setConfirmationTxId] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const [selectedDepositIds, setSelectedDepositIds] = useState<Set<string>>(new Set());
  const [batchCancelOpen, setBatchCancelOpen] = useState(false);
  const [batchConfirmation, setBatchConfirmation] = useState("");
  const [batchReason, setBatchReason] = useState("");
  const [batchSubmitting, setBatchSubmitting] = useState(false);

  const [auditLogs, setAuditLogs] = useState<AdminAuditLogEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotal, setAuditTotal] = useState(0);

  // Treasury
  const [treasury, setTreasury] = useState<TreasuryOverview | null>(null);
  const [treasuryLoading, setTreasuryLoading] = useState(false);
  const [expandedChains, setExpandedChains] = useState<Set<string>>(new Set());
  const [treasuryActionOpen, setTreasuryActionOpen] = useState(false);
  const [treasuryActionType, setTreasuryActionType] = useState<"topup" | "sweep-token" | "sweep-chain" | "tron-stake">("topup");
  const [treasuryActionChain, setTreasuryActionChain] = useState<TreasuryEvmChain | null>(null);
  const [treasuryActionToken, setTreasuryActionToken] = useState<TreasuryTokenInfo | null>(null);
  const [treasuryConfirmInput, setTreasuryConfirmInput] = useState("");
  const [treasuryReasonInput, setTreasuryReasonInput] = useState("");
  const [treasurySubmitting, setTreasurySubmitting] = useState(false);

  const PAGE_SIZE = 20;
  const DEPOSIT_PAGE_SIZE = 15;
  const AUDIT_PAGE_SIZE = 25;

  useEffect(() => {
    const t = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
    if (!t) { router.replace("/admin/login"); return; }
    setToken(t);
  }, [router]);

  function logout() {
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminToken");
    router.replace("/admin/login");
  }

  const handleApiError = useCallback((err: unknown, label: string) => {
    const message = err instanceof Error ? err.message : `Failed to load ${label}`;
    if (/admin access required|invalid admin token|admin token required|token expired/i.test(message)) {
      toast.error("Admin session expired — please log in again.");
      logout();
      return;
    }
    toast.error(message);
  }, [router]);

  const loadStats = useCallback(async (t: string) => {
    try {
      const data = await adminApi.getTransactionStats(t);
      setStats(data);
    } catch (err) {
      handleApiError(err, "transaction stats");
    }
    setLoading(false);
  }, [handleApiError]);

  const loadTransactions = useCallback(async (t: string, p = 1, status = "all") => {
    setTxLoading(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: String(PAGE_SIZE) };
      if (status !== "all") params.status = status;
      const data = await adminApi.getTransactions(t, params);
      setTransactions(data.transactions);
      setTotal(data.total ?? 0);
    } catch (err) {
      setTransactions([]);
      handleApiError(err, "transactions");
    } finally {
      setTxLoading(false);
    }
  }, [handleApiError]);

  const loadDeposits = useCallback(async (t: string, p = 1, status = "all") => {
    setDepositsLoading(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: String(DEPOSIT_PAGE_SIZE) };
      if (status !== "all") params.status = status;
      const data = await adminApi.getUnreconciledDeposits(t, params);
      setDeposits(data.deposits);
      setDepositSummary(data.summary);
      setDepositTotal(data.pagination.totalCount);
      setSelectedDepositIds(new Set());
    } catch (err) {
      setDeposits([]);
      handleApiError(err, "unreconciled deposits");
    } finally {
      setDepositsLoading(false);
    }
  }, [handleApiError]);

  const loadTreasury = useCallback(async (t: string) => {
    setTreasuryLoading(true);
    try {
      const data = await fetchTreasuryOverview(t);
      setTreasury(data);
    } catch (err) {
      handleApiError(err, "treasury overview");
    } finally {
      setTreasuryLoading(false);
    }
  }, [handleApiError]);

  const loadAuditLog = useCallback(async (t: string, p = 1) => {
    setAuditLoading(true);
    try {
      const data = await adminApi.getAuditLog(t, { page: String(p), limit: String(AUDIT_PAGE_SIZE) });
      setAuditLogs(data.logs);
      setAuditTotal(data.pagination.totalCount);
    } catch (err) {
      setAuditLogs([]);
      handleApiError(err, "audit log");
    } finally {
      setAuditLoading(false);
    }
  }, [handleApiError]);

  const refreshAll = useCallback(() => {
    if (!token) return;
    loadStats(token);
    loadTransactions(token, page, statusFilter);
    loadDeposits(token, depositPage, depositStatusFilter);
    loadAuditLog(token, auditPage);
  }, [token, page, statusFilter, depositPage, depositStatusFilter, auditPage, loadStats, loadTransactions, loadDeposits, loadAuditLog]);

  useEffect(() => {
    if (token) {
      loadStats(token);
      loadTransactions(token, 1, statusFilter);
      loadDeposits(token, 1, depositStatusFilter);
      loadAuditLog(token, 1);
    }
  }, [token, loadStats, loadTransactions, loadDeposits, loadAuditLog, statusFilter, depositStatusFilter]);

  async function openDepositDetail(deposit: UnreconciledDeposit) {
    if (!token) return;
    try {
      const data = await adminApi.getDepositDiagnostics(token, deposit.id);
      setSelectedDeposit(data.deposit);
      setDetailOpen(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load deposit details");
    }
  }

  function openActionDialog(deposit: UnreconciledDeposit, type: DepositAction) {
    setActionDeposit(deposit);
    setActionType(type);
    setConfirmationTxId(type === "cancel" && !deposit.txHashes.inbound ? deposit.id : "");
    setActionReason("");
    setActionOpen(true);
  }

  async function submitDepositAction() {
    if (!token || !actionDeposit) return;
    if (!confirmationTxId.trim()) {
      toast.error("Paste the transaction ID to confirm this action");
      return;
    }

    setActionSubmitting(true);
    try {
      const payload = { confirmationTxId: confirmationTxId.trim(), reason: actionReason.trim() || undefined };
      const result = actionType === "mark-failed"
        ? await adminApi.markDepositFailed(token, actionDeposit.id, payload)
        : await adminApi.cancelDeposit(token, actionDeposit.id, payload);

      toast.success(result.message);
      setActionOpen(false);
      setDetailOpen(false);
      loadDeposits(token, depositPage, depositStatusFilter);
      loadAuditLog(token, 1);
      setAuditPage(1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionSubmitting(false);
    }
  }

  const pieData = stats ? [
    { name: "Completed", value: stats.completed, color: "#22c55e" },
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Failed", value: stats.failed, color: "#ef4444" },
  ] : [];

  const filtered = search
    ? transactions.filter((tx) => tx._id.includes(search) || (tx.walletAddress || "").includes(search))
    : transactions;

  const canMarkFailed = (d: UnreconciledDeposit) => Boolean(d.txHashes.inbound) && d.status !== "complete";
  const canCancel = (d: UnreconciledDeposit) => !d.txHashes.inbound && d.status !== "complete";

  const cancellableDeposits = deposits.filter(canCancel);
  const selectedCancellableIds = [...selectedDepositIds].filter((id) =>
    cancellableDeposits.some((d) => d.id === id)
  );
  const allCancellableSelected = cancellableDeposits.length > 0
    && cancellableDeposits.every((d) => selectedDepositIds.has(d.id));

  function toggleDepositSelection(id: string, checked: boolean) {
    setSelectedDepositIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleSelectAllCancellable(checked: boolean) {
    if (!checked) {
      setSelectedDepositIds((prev) => {
        const next = new Set(prev);
        cancellableDeposits.forEach((d) => next.delete(d.id));
        return next;
      });
      return;
    }
    setSelectedDepositIds((prev) => {
      const next = new Set(prev);
      cancellableDeposits.forEach((d) => next.add(d.id));
      return next;
    });
  }

  function openBatchCancelDialog() {
    setBatchConfirmation(selectedCancellableIds.join("\n"));
    setBatchReason("");
    setBatchCancelOpen(true);
  }

  async function submitBatchCancel() {
    if (!token || selectedCancellableIds.length === 0) return;

    const confirmed = parseConfirmationIds(batchConfirmation);
    const expected = new Set(selectedCancellableIds.map((id) => id.toLowerCase()));
    const got = new Set(confirmed.map((id) => id.toLowerCase()));

    if (got.size !== expected.size || ![...expected].every((id) => got.has(id))) {
      toast.error("Paste every selected deposit ID to confirm batch cancel");
      return;
    }

    setBatchSubmitting(true);
    try {
      const result = await adminApi.batchCancelDeposits(token, {
        depositIds: selectedCancellableIds,
        confirmationPayload: batchConfirmation.trim(),
        reason: batchReason.trim() || undefined,
      });

      if (result.failed.length > 0) {
        toast.warning(`${result.message}. ${result.failed.length} failed.`);
      } else {
        toast.success(result.message);
      }

      setBatchCancelOpen(false);
      setSelectedDepositIds(new Set());
      loadDeposits(token, depositPage, depositStatusFilter);
      loadAuditLog(token, 1);
      setAuditPage(1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Batch cancel failed");
    } finally {
      setBatchSubmitting(false);
    }
  }

  function parseConfirmationIds(payload: string) {
    return payload.split(/[\n,\s]+/).map((s) => s.trim()).filter(Boolean);
  }

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
              <p className="text-xs text-muted-foreground leading-none mt-0.5">Payment reconciliation &amp; audit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={refreshAll}>
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
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: "Transactions", value: stats?.total || 0, icon: Receipt, color: "from-blue-500 to-cyan-500" },
            { label: "Volume", value: formatCurrency(stats?.totalVolume || 0), icon: DollarSign, color: "from-green-500 to-emerald-600" },
            { label: "Completed", value: stats?.completed || 0, icon: CheckCircle, color: "from-emerald-500 to-green-600" },
            { label: "Pending", value: stats?.pending || 0, icon: Clock, color: "from-yellow-500 to-amber-500" },
            { label: "Failed", value: stats?.failed || 0, icon: AlertCircle, color: "from-red-500 to-rose-500" },
            { label: "Unreconciled", value: depositSummary?.total ?? "—", icon: AlertTriangle, color: "from-orange-500 to-red-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs">{label}</CardDescription>
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${color} text-white`}><Icon className="w-3.5 h-3.5" /></div>
                </div>
              </CardHeader>
              <CardContent>
                {loading && label !== "Unreconciled" ? (
                  <div className="h-7 w-16 bg-muted rounded animate-pulse" />
                ) : (
                  <div className="text-xl font-bold">{value}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="unreconciled">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="unreconciled" className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Unreconciled
              {depositSummary?.total ? <Badge variant="destructive" className="ml-1 h-5 px-1.5">{depositSummary.total}</Badge> : null}
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5" />Transactions</TabsTrigger>
            <TabsTrigger value="treasury" className="flex items-center gap-1.5" onClick={() => { if (token && !treasury) loadTreasury(token); }}>
              <Coins className="w-3.5 h-3.5" />Treasury
              {treasury && treasury.summary.evmChainsNeedFunds > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5">{treasury.summary.evmChainsNeedFunds}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />Audit Log</TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" />Analytics</TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Newsletter</TabsTrigger>
            <TabsTrigger value="founding-merchants" className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5" />Founding Merchants</TabsTrigger>
          </TabsList>

          {/* Unreconciled deposits */}
          <TabsContent value="unreconciled" className="space-y-4 mt-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <p className="text-sm text-muted-foreground max-w-2xl">
                Payments stuck in the bridge pipeline. Review diagnostics, fund treasury gas if needed, or manually close with tx confirmation.
              </p>
              <Select value={depositStatusFilter} onValueChange={(v) => { setDepositStatusFilter(v); setDepositPage(1); if (token) loadDeposits(token, 1, v); }}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="watching">Watching</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="swept">Swept</SelectItem>
                  <SelectItem value="bridged">Bridged</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {depositSummary?.byStatus?.length ? (
              <div className="flex flex-wrap gap-2">
                {depositSummary.byStatus.map((row) => (
                  <Badge key={row._id} variant="outline" className="text-xs">
                    {row._id}: {row.count}
                  </Badge>
                ))}
              </div>
            ) : null}

            {selectedCancellableIds.length > 0 ? (
              <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-background px-4 py-3">
                <span className="text-sm font-medium">{selectedCancellableIds.length} selected</span>
                <Button size="sm" variant="destructive" onClick={openBatchCancelDialog}>
                  Batch cancel
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedDepositIds(new Set())}>
                  Clear selection
                </Button>
              </div>
            ) : null}

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allCancellableSelected}
                        onCheckedChange={(checked) => toggleSelectAllCancellable(checked === true)}
                        disabled={cancellableDeposits.length === 0}
                        aria-label="Select all cancellable on this page"
                      />
                    </TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Chain</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Inbound TX</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depositsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 9 }).map((_, j) => (
                          <TableCell key={j}><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : deposits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                        <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-30 text-green-600" />
                        No unreconciled deposits found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    deposits.map((d) => (
                      <TableRow key={d.id} data-state={selectedDepositIds.has(d.id) ? "selected" : undefined}>
                        <TableCell>
                          {canCancel(d) ? (
                            <Checkbox
                              checked={selectedDepositIds.has(d.id)}
                              onCheckedChange={(checked) => toggleDepositSelection(d.id, checked === true)}
                              aria-label={`Select ${d.id}`}
                            />
                          ) : null}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(d.updatedAt).toLocaleDateString()}
                          {d.staleHours != null && d.staleHours > 1 ? (
                            <div className="text-amber-600">{d.staleHours}h stale</div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-sm">{d.businessName}</div>
                          <div className="font-mono text-[10px] text-muted-foreground">{d.id.slice(0, 10)}…</div>
                        </TableCell>
                        <TableCell className="text-xs">{d.chainLabel}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(d.confirmedAmountUSD ?? d.expectedAmountUSD)}
                        </TableCell>
                        <TableCell><DepositStatusBadge status={d.status} /></TableCell>
                        <TableCell className="font-mono text-[10px] max-w-[100px] truncate">
                          {d.txHashes.inbound ? shortAddress(d.txHashes.inbound) : "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate" title={d.issues[0]}>
                          {d.issues[0] || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="outline" size="sm" onClick={() => openDepositDetail(d)}>
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            {canMarkFailed(d) ? (
                              <Button variant="outline" size="sm" className="text-red-600" onClick={() => openActionDialog(d, "mark-failed")}>
                                Fail
                              </Button>
                            ) : null}
                            {canCancel(d) ? (
                              <Button variant="outline" size="sm" onClick={() => openActionDialog(d, "cancel")}>
                                Cancel
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {depositTotal > DEPOSIT_PAGE_SIZE && (
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" disabled={depositPage === 1} onClick={() => { const p = depositPage - 1; setDepositPage(p); if (token) loadDeposits(token, p, depositStatusFilter); }}>Previous</Button>
                <span className="px-3 py-1.5 text-sm text-muted-foreground">Page {depositPage} of {Math.ceil(depositTotal / DEPOSIT_PAGE_SIZE)}</span>
                <Button variant="outline" size="sm" disabled={depositPage >= Math.ceil(depositTotal / DEPOSIT_PAGE_SIZE)} onClick={() => { const p = depositPage + 1; setDepositPage(p); if (token) loadDeposits(token, p, depositStatusFilter); }}>Next</Button>
              </div>
            )}
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-4 mt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by ID or wallet…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); if (token) loadTransactions(token, 1, v); }}>
                <SelectTrigger className="w-40"><SelectValue placeholder="All statuses" /></SelectTrigger>
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
                      <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => (<TableCell key={j}><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>))}</TableRow>
                    ))
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No transactions found.</TableCell>
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
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => { const p = page - 1; setPage(p); if (token) loadTransactions(token, p, statusFilter); }}>Previous</Button>
                <span className="px-3 py-1.5 text-sm text-muted-foreground">Page {page} of {Math.ceil(total / PAGE_SIZE)}</span>
                <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / PAGE_SIZE)} onClick={() => { const p = page + 1; setPage(p); if (token) loadTransactions(token, p, statusFilter); }}>Next</Button>
              </div>
            )}
          </TabsContent>

          {/* Audit log */}
          <TabsContent value="audit" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Persistent record of admin actions including deposit closures, business verification, and maintenance tasks.
            </p>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>TX Ref</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => (<TableCell key={j}><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>))}</TableRow>
                    ))
                  ) : auditLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No audit entries yet.</TableCell>
                    </TableRow>
                  ) : (
                    auditLogs.map((log) => (
                      <TableRow key={log._id}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">{log.adminUsername}</TableCell>
                        <TableCell><Badge variant="outline" className="font-mono text-[10px]">{log.action}</Badge></TableCell>
                        <TableCell className="text-xs">
                          {log.resourceType ? `${log.resourceType}` : "—"}
                          {log.resourceId ? <div className="font-mono text-[10px] text-muted-foreground">{log.resourceId.slice(0, 12)}…</div> : null}
                        </TableCell>
                        <TableCell className="font-mono text-[10px] max-w-[120px] truncate">
                          {log.confirmationTxId ? shortAddress(log.confirmationTxId) : "—"}
                        </TableCell>
                        <TableCell>
                          {log.success ? (
                            <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> OK</span>
                          ) : (
                            <span className="text-xs text-red-600 flex items-center gap-1" title={log.errorMessage || ""}><XCircle className="w-3 h-3" /> Failed</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {auditTotal > AUDIT_PAGE_SIZE && (
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" disabled={auditPage === 1} onClick={() => { const p = auditPage - 1; setAuditPage(p); if (token) loadAuditLog(token, p); }}>Previous</Button>
                <span className="px-3 py-1.5 text-sm text-muted-foreground">Page {auditPage} of {Math.ceil(auditTotal / AUDIT_PAGE_SIZE)}</span>
                <Button variant="outline" size="sm" disabled={auditPage >= Math.ceil(auditTotal / AUDIT_PAGE_SIZE)} onClick={() => { const p = auditPage + 1; setAuditPage(p); if (token) loadAuditLog(token, p); }}>Next</Button>
              </div>
            )}
          </TabsContent>

          {/* Analytics */}
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
                    ["Unreconciled Deposits", String(depositSummary?.total ?? 0)],
                    ["Platform Fee (1.6%)", formatCurrency((stats?.totalVolume || 0) * 0.016)],
                    ["Employee Commission (0.3%)", formatCurrency((stats?.totalVolume || 0) * 0.003)],
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

          {/* ── Treasury tab ─────────────────────────────────────────────── */}
          <TabsContent value="treasury" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground max-w-2xl">
                Fleet-wide treasury native gas and token balances. Auto-management converts leftover
                payment tokens → native gas after each bridge. Manual actions require a confirmation.
              </p>
              <Button variant="outline" size="sm" onClick={() => token && loadTreasury(token)} disabled={treasuryLoading}>
                <RefreshCw className={`w-3.5 h-3.5 mr-1 ${treasuryLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {treasuryLoading && !treasury && (
              <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />Loading treasury status…
              </div>
            )}

            {treasury && (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Chains funded", value: treasury.summary.evmChainsFunded, color: "text-green-500" },
                    { label: "Need native", value: treasury.summary.evmChainsNeedFunds, color: treasury.summary.evmChainsNeedFunds > 0 ? "text-red-500" : "text-muted-foreground" },
                    { label: "Need bootstrap", value: treasury.summary.evmChainsNeedBootstrap, color: treasury.summary.evmChainsNeedBootstrap > 0 ? "text-orange-500" : "text-muted-foreground" },
                    { label: "TRON energy OK", value: treasury.tron.sufficient ? "Yes" : (treasury.tron.configured ? "No" : "N/A"), color: treasury.tron.sufficient ? "text-green-500" : "text-orange-400" },
                  ].map(({ label, value, color }) => (
                    <Card key={label} className="bg-card/50">
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Config flags */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant={treasury.config.autoTopUpEnabled ? "default" : "secondary"}>
                    Auto top-up: {treasury.config.autoTopUpEnabled ? "ON" : "OFF"}
                  </Badge>
                  <Badge variant={treasury.config.postBridgeSweepEnabled ? "default" : "secondary"}>
                    Post-bridge sweep: {treasury.config.postBridgeSweepEnabled ? "ON" : "OFF"}
                  </Badge>
                  <Badge variant={treasury.config.volatileSweepEnabled ? "outline" : "secondary"}>
                    Volatile sweep: {treasury.config.volatileSweepEnabled ? "ON" : "OFF"}
                  </Badge>
                  <span className="text-muted-foreground">Token order: {treasury.config.tokenTopUpOrder}</span>
                </div>

                {/* EVM chains table */}
                <div className="space-y-2">
                  {treasury.evmChains.map((chain) => (
                    <Card key={chain.chainKey} className={`border ${chain.needsBootstrap ? "border-orange-500/40 bg-orange-500/5" : !chain.sufficient ? "border-red-500/30 bg-red-500/5" : ""}`}>
                      <CardContent className="p-3">
                        {/* Chain header row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            className="flex items-center gap-1.5 flex-1 text-left"
                            onClick={() => setExpandedChains((prev) => {
                              const next = new Set(prev);
                              next.has(chain.chainKey) ? next.delete(chain.chainKey) : next.add(chain.chainKey);
                              return next;
                            })}
                          >
                            {expandedChains.has(chain.chainKey)
                              ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                            <span className="font-semibold text-sm">{chain.name}</span>
                            <Badge variant={chain.sufficient ? "default" : "destructive"} className="text-xs">
                              {chain.balanceNative ?? "—"} {chain.symbol}
                            </Badge>
                            {chain.needsBootstrap && (
                              <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs">
                                <TriangleAlert className="w-3 h-3 mr-1" />Bootstrap needed
                              </Badge>
                            )}
                            {!chain.sufficient && !chain.needsBootstrap && (
                              <span className="text-xs text-red-400">Deficit: {chain.deficitNative} {chain.symbol}</span>
                            )}
                            {chain.postBridgeSweepEnabled
                              ? <Badge variant="outline" className="text-xs text-green-400 border-green-400/40">Auto-sweep ON</Badge>
                              : <Badge variant="outline" className="text-xs text-muted-foreground">Auto-sweep OFF</Badge>}
                          </button>

                          {/* Chain-level action buttons */}
                          <div className="flex gap-2 flex-shrink-0">
                            {chain.needsBootstrap ? (
                              <span className="text-xs text-orange-400 flex items-center gap-1">
                                <Info className="w-3 h-3" />Send dust {chain.symbol} first
                              </span>
                            ) : (
                              <>
                                {!chain.sufficient && (
                                  <Button size="sm" variant="outline" className="h-7 text-xs"
                                    onClick={() => {
                                      setTreasuryActionType("topup");
                                      setTreasuryActionChain(chain);
                                      setTreasuryActionToken(null);
                                      setTreasuryConfirmInput("");
                                      setTreasuryReasonInput("");
                                      setTreasuryActionOpen(true);
                                    }}>
                                    <Zap className="w-3 h-3 mr-1" />Top up gas
                                  </Button>
                                )}
                                {chain.tokens?.some((t) => t.manualSweepAvailable) && (
                                  <Button size="sm" variant="outline" className="h-7 text-xs"
                                    onClick={() => {
                                      setTreasuryActionType("sweep-chain");
                                      setTreasuryActionChain(chain);
                                      setTreasuryActionToken(null);
                                      setTreasuryConfirmInput("");
                                      setTreasuryReasonInput("");
                                      setTreasuryActionOpen(true);
                                    }}>
                                    <RefreshCw className="w-3 h-3 mr-1" />Sweep all tokens
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Token rows (expanded) */}
                        {expandedChains.has(chain.chainKey) && (chain.tokens?.length ?? 0) > 0 && (
                          <div className="mt-3 border-t pt-3 space-y-1.5">
                            {chain.tokens!.map((token) => (
                              <div key={token.address} className="flex items-center gap-2 text-xs flex-wrap">
                                <span className="w-14 font-mono font-semibold">{token.symbol}</span>
                                <span className="text-muted-foreground w-24">{token.balance ?? "—"}</span>
                                <span className="text-muted-foreground">reserved: {token.reserved ?? "—"}</span>
                                <span className={parseFloat(token.sweepable || "0") > 0 ? "text-green-400" : "text-muted-foreground"}>
                                  sweepable: {token.sweepable ?? "—"}
                                </span>
                                {!token.sweepEligible && (
                                  <Badge variant="secondary" className="text-xs">deBridge unsupported</Badge>
                                )}
                                {token.manualSweepAvailable && !chain.needsBootstrap && (
                                  <Button size="sm" variant="ghost" className="h-6 text-xs px-2 ml-auto"
                                    onClick={() => {
                                      setTreasuryActionType("sweep-token");
                                      setTreasuryActionChain(chain);
                                      setTreasuryActionToken(token);
                                      setTreasuryConfirmInput("");
                                      setTreasuryReasonInput("");
                                      setTreasuryActionOpen(true);
                                    }}>
                                    Sweep → {chain.symbol}
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {chain.fundingInstruction && (
                          <p className="mt-2 text-xs text-orange-300 bg-orange-500/10 rounded px-2 py-1">
                            {chain.fundingInstruction}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* TRON row */}
                {treasury.tron.configured && (
                  <Card className={`border ${!treasury.tron.sufficient ? "border-orange-500/40" : ""}`}>
                    <CardContent className="p-3 flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-sm">TRON</span>
                      <Badge variant={treasury.tron.sufficient ? "default" : "destructive"}>
                        Energy: {treasury.tron.energyAvailable?.toLocaleString() ?? "—"} / {treasury.tron.energyFloor?.toLocaleString()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Balance: {treasury.tron.balanceTrx ?? "—"} TRX
                      </span>
                      {!treasury.tron.sufficient && (
                        <Button size="sm" variant="outline" className="h-7 text-xs ml-auto"
                          onClick={() => {
                            setTreasuryActionType("tron-stake");
                            setTreasuryActionChain(null);
                            setTreasuryActionToken(null);
                            setTreasuryConfirmInput("");
                            setTreasuryReasonInput("");
                            setTreasuryActionOpen(true);
                          }}>
                          <Zap className="w-3 h-3 mr-1" />Stake TRX
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Recent events */}
                {treasury.recentEvents.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Recent Auto-Sweep Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {treasury.recentEvents.slice(0, 10).map((ev, i) => (
                          <div key={i} className="text-xs text-muted-foreground font-mono flex gap-2">
                            <span className="text-slate-500">{String(ev.timestamp || "").slice(0, 19)}</span>
                            <span>{String(ev.message || ev.level || "")}</span>
                            {ev.chainKey ? <span className="text-blue-400">[{String(ev.chainKey)}]</span> : null}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
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

      {/* Treasury action dialog */}
      <Dialog open={treasuryActionOpen} onOpenChange={(open) => { if (!treasurySubmitting) setTreasuryActionOpen(open); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {treasuryActionType === "topup" && `Top up gas — ${treasuryActionChain?.name}`}
              {treasuryActionType === "sweep-token" && `Sweep ${treasuryActionToken?.symbol} → ${treasuryActionChain?.symbol}`}
              {treasuryActionType === "sweep-chain" && `Sweep all tokens — ${treasuryActionChain?.name}`}
              {treasuryActionType === "tron-stake" && "Stake TRX for energy"}
            </DialogTitle>
            <DialogDescription>
              {treasuryActionType === "topup" && (
                <>Convert treasury stablecoins to {treasuryActionChain?.symbol} gas. Requires dust {treasuryActionChain?.symbol} already on-chain to pay swap tx fee.<br />
                Type <code className="bg-muted px-1 rounded">{treasuryActionChain?.chainKey}</code> to confirm.</>
              )}
              {treasuryActionType === "sweep-token" && (
                <>Swap {treasuryActionToken?.symbol} (sweepable: {treasuryActionToken?.sweepable}) → {treasuryActionChain?.symbol}.<br />
                Type <code className="bg-muted px-1 rounded">{treasuryActionChain?.chainKey}:{treasuryActionToken?.symbol.toLowerCase()}</code> to confirm.</>
              )}
              {treasuryActionType === "sweep-chain" && (
                <>Sweep all eligible tokens on {treasuryActionChain?.name} → {treasuryActionChain?.symbol}.<br />
                Type <code className="bg-muted px-1 rounded">{treasuryActionChain?.chainKey}</code> to confirm.</>
              )}
              {treasuryActionType === "tron-stake" && (
                <>Freeze liquid TRX for energy on TRON treasury. Type <code className="bg-muted px-1 rounded">tron</code> to confirm.</>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label className="text-xs">Confirmation</Label>
              <Input
                value={treasuryConfirmInput}
                onChange={(e) => setTreasuryConfirmInput(e.target.value)}
                placeholder={
                  treasuryActionType === "sweep-token"
                    ? `${treasuryActionChain?.chainKey}:${treasuryActionToken?.symbol.toLowerCase()}`
                    : treasuryActionType === "tron-stake" ? "tron" : treasuryActionChain?.chainKey || ""
                }
                disabled={treasurySubmitting}
              />
            </div>
            <div>
              <Label className="text-xs">Reason (optional)</Label>
              <Textarea
                value={treasuryReasonInput}
                onChange={(e) => setTreasuryReasonInput(e.target.value)}
                placeholder="Why are you performing this action?"
                rows={2}
                disabled={treasurySubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTreasuryActionOpen(false)} disabled={treasurySubmitting}>Cancel</Button>
            <Button
              disabled={!treasuryConfirmInput.trim() || treasurySubmitting}
              onClick={async () => {
                if (!token) return;
                setTreasurySubmitting(true);
                try {
                  let result;
                  const reason = treasuryReasonInput.trim() || undefined;
                  if (treasuryActionType === "topup") {
                    result = await treasuryTopUpGas(token, treasuryActionChain!.chainKey, treasuryConfirmInput, reason);
                    if (result.alreadyFunded) {
                      toast.success(result.message || `${treasuryActionChain!.name} already has sufficient native balance — no swap needed.`);
                    } else {
                      toast.success(`Gas topped up on ${treasuryActionChain!.name}. New balance: ${result.nativeBalanceAfter} ${treasuryActionChain!.symbol}`);
                    }
                  } else if (treasuryActionType === "sweep-token") {
                    result = await treasurySweepToken(token, treasuryActionChain!.chainKey, treasuryActionToken!.symbol, treasuryConfirmInput, { reason });
                    toast.success(`Swept ${result.swapUsd?.toFixed(2)} USD of ${result.tokenSymbol} on ${treasuryActionChain!.name}`
                      + (result.txHash ? ` · tx: ${result.txHash.slice(0, 10)}…` : ""));
                  } else if (treasuryActionType === "sweep-chain") {
                    result = await treasurySweepChain(token, treasuryActionChain!.chainKey, treasuryConfirmInput, reason);
                    toast.success(`Swept tokens on ${treasuryActionChain!.name}. Native after: ${result.nativeBalanceAfter} ${treasuryActionChain!.symbol}`);
                  } else if (treasuryActionType === "tron-stake") {
                    result = await treasuryStakeTron(token, treasuryConfirmInput, { reason });
                    toast.success(`Staked ${result.stakedTrx} TRX for energy`);
                  }
                  setTreasuryActionOpen(false);
                  loadTreasury(token);
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Action failed");
                } finally {
                  setTreasurySubmitting(false);
                }
              }}
            >
              {treasurySubmitting ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Executing…</> : "Confirm action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Unreconciled Payment Details</DialogTitle>
            <DialogDescription>
              {selectedDeposit?.businessName} · {selectedDeposit?.chainLabel} · {selectedDeposit?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedDeposit ? (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2 items-center">
                <DepositStatusBadge status={selectedDeposit.status} />
                <span className="font-semibold">{formatCurrency(selectedDeposit.confirmedAmountUSD ?? selectedDeposit.expectedAmountUSD)}</span>
                {selectedDeposit.swapMethod ? <Badge variant="outline">{selectedDeposit.swapMethod}</Badge> : null}
              </div>

              {selectedDeposit.issues.length ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1">
                  <p className="font-medium text-amber-800 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Issues</p>
                  {selectedDeposit.issues.map((issue) => <p key={issue} className="text-amber-900">{issue}</p>)}
                </div>
              ) : null}

              <div>
                <p className="font-medium mb-2">Bridge requirements</p>
                <div className="space-y-2">
                  {selectedDeposit.bridgeRequirements.map((req) => (
                    <div key={`${req.type}-${req.label}`} className="rounded border p-2">
                      <div className="flex justify-between gap-2">
                        <span>{req.label}</span>
                        <span className={`font-medium ${req.amount === "Sufficient" ? "text-green-600" : "text-amber-700"}`}>{req.amount || "—"}</span>
                      </div>
                      {req.have != null && req.need != null ? (
                        <p className="text-xs text-muted-foreground mt-1">Have {req.have} · Need {req.need}</p>
                      ) : null}
                      {req.note ? <p className="text-xs text-muted-foreground mt-1">{req.note}</p> : null}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Transaction hashes</p>
                <div className="grid grid-cols-1 gap-1 font-mono text-[11px]">
                  {Object.entries(selectedDeposit.txHashes).map(([key, hash]) => (
                    hash ? <div key={key}><span className="text-muted-foreground">{key}:</span> {hash}</div> : null
                  ))}
                </div>
              </div>

              {selectedDeposit.hints.length ? (
                <div>
                  <p className="font-medium mb-1">Recovery hints</p>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {selectedDeposit.hints.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                </div>
              ) : null}

              {selectedDeposit.lastError ? (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded p-2">{selectedDeposit.lastError}</p>
              ) : null}

              <div className="flex gap-2 pt-2">
                {canMarkFailed(selectedDeposit) ? (
                  <Button variant="destructive" size="sm" onClick={() => openActionDialog(selectedDeposit, "mark-failed")}>Mark Failed</Button>
                ) : null}
                {canCancel(selectedDeposit) ? (
                  <Button variant="outline" size="sm" onClick={() => openActionDialog(selectedDeposit, "cancel")}>Cancel Invoice</Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Batch cancel dialog */}
      <Dialog open={batchCancelOpen} onOpenChange={setBatchCancelOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Batch Cancel {selectedCancellableIds.length} Invoice(s)</DialogTitle>
            <DialogDescription>
              Closes unpaid invoices and excludes them from the pipeline. Confirm by pasting every deposit ID below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded border bg-muted/40 p-3 max-h-32 overflow-y-auto">
              <p className="text-xs text-muted-foreground mb-2">Selected deposits</p>
              {selectedCancellableIds.map((id) => {
                const deposit = deposits.find((d) => d.id === id);
                return (
                  <div key={id} className="text-xs font-mono py-0.5">
                    {deposit?.businessName || "—"} · {id}
                  </div>
                );
              })}
            </div>
            <div>
              <Label htmlFor="batchConfirmation">Confirm deposit IDs (one per line)</Label>
              <Textarea
                id="batchConfirmation"
                value={batchConfirmation}
                onChange={(e) => setBatchConfirmation(e.target.value)}
                rows={5}
                className="font-mono text-xs mt-1"
              />
            </div>
            <div>
              <Label htmlFor="batchReason">Reason (optional)</Label>
              <Textarea id="batchReason" value={batchReason} onChange={(e) => setBatchReason(e.target.value)} rows={2} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchCancelOpen(false)} disabled={batchSubmitting}>Back</Button>
            <Button variant="destructive" onClick={submitBatchCancel} disabled={batchSubmitting}>
              {batchSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : `Cancel ${selectedCancellableIds.length} invoice(s)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm action dialog */}
      <Dialog open={actionOpen} onOpenChange={setActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === "mark-failed" ? "Mark Payment as Failed" : "Cancel Invoice"}</DialogTitle>
            <DialogDescription>
              {actionType === "mark-failed"
                ? "This permanently excludes the deposit from auto-reconcile. Paste the inbound transaction hash to confirm."
                : "This closes an unpaid invoice. Paste the deposit ID to confirm."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="confirmationTxId">Confirmation TX / ID</Label>
              <Input
                id="confirmationTxId"
                placeholder={actionType === "mark-failed" ? actionDeposit?.txHashes.inbound || "0x…" : actionDeposit?.id}
                value={confirmationTxId}
                onChange={(e) => setConfirmationTxId(e.target.value)}
                className="font-mono text-xs mt-1"
              />
            </div>
            <div>
              <Label htmlFor="actionReason">Reason (optional)</Label>
              <Textarea id="actionReason" value={actionReason} onChange={(e) => setActionReason(e.target.value)} rows={2} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionOpen(false)} disabled={actionSubmitting}>Back</Button>
            <Button variant={actionType === "mark-failed" ? "destructive" : "default"} onClick={submitDepositAction} disabled={actionSubmitting}>
              {actionSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ClientErrorLogger source="admin-dashboard" />
    </div>
  );
}
