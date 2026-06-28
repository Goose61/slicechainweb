"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminApi,
  type FoundingMerchantLead,
  type FoundingMerchantStats,
} from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminPasswordDialog } from "@/components/admin/AdminPasswordDialog";
import {
  CheckCircle,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Store,
  Trash2,
  XCircle,
} from "lucide-react";

interface FoundingMerchantTabProps {
  token: string;
}

type PendingAction =
  | { type: "approve"; lead: FoundingMerchantLead }
  | { type: "decline"; lead: FoundingMerchantLead }
  | { type: "contacted"; lead: FoundingMerchantLead }
  | { type: "onboarded"; lead: FoundingMerchantLead }
  | { type: "remove"; lead: FoundingMerchantLead };

const STATUS_LABELS: Record<string, string> = {
  pending_verification: "Pending verification",
  verified: "Verified",
  contacted: "Contacted",
  onboarded: "Onboarded",
  declined: "Declined",
};

function statusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "onboarded") return "default";
  if (status === "declined") return "destructive";
  if (status === "verified" || status === "contacted") return "secondary";
  return "outline";
}

export function FoundingMerchantTab({ token }: FoundingMerchantTabProps) {
  const [stats, setStats] = useState<FoundingMerchantStats | null>(null);
  const [leads, setLeads] = useState<FoundingMerchantLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<FoundingMerchantLead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const loadData = useCallback(async (p = page, status = statusFilter, q = search) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(p),
        limit: "20",
      };
      if (status !== "all") params.status = status;
      if (q.trim()) params.search = q.trim();

      const [statsData, leadsData] = await Promise.all([
        adminApi.getFoundingMerchantStats(token),
        adminApi.listFoundingMerchants(token, params),
      ]);
      setStats(statsData);
      setLeads(leadsData.leads);
      setTotalPages(leadsData.pagination.totalPages);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load founding merchant applications");
    } finally {
      setLoading(false);
    }
  }, [token, page, statusFilter, search]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function executeAction(actionPassword: string) {
    if (!pendingAction) return;

    setActionSubmitting(true);
    try {
      if (pendingAction.type === "remove") {
        await adminApi.removeFoundingMerchant(token, pendingAction.lead._id, actionPassword);
        toast.success(`${pendingAction.lead.businessName} removed`);
      } else {
        const statusMap = {
          approve: "verified",
          decline: "declined",
          contacted: "contacted",
          onboarded: "onboarded",
        } as const;
        const status = statusMap[pendingAction.type];
        await adminApi.updateFoundingMerchantStatus(token, pendingAction.lead._id, status, actionPassword);
        toast.success(`${pendingAction.lead.businessName} marked as ${STATUS_LABELS[status]}`);
      }
      setPendingAction(null);
      if (detailOpen) setDetailOpen(false);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionSubmitting(false);
    }
  }

  function openDetail(lead: FoundingMerchantLead) {
    setSelectedLead(lead);
    setDetailOpen(true);
  }

  const actionCopy = pendingAction
    ? {
        approve: {
          title: "Approve application",
          description: `Approve ${pendingAction.lead.businessName} as a verified founding merchant?`,
          confirmLabel: "Approve",
        },
        decline: {
          title: "Decline application",
          description: `Decline the application from ${pendingAction.lead.businessName}?`,
          confirmLabel: "Decline",
          destructive: true,
        },
        contacted: {
          title: "Mark as contacted",
          description: `Mark ${pendingAction.lead.businessName} as contacted?`,
          confirmLabel: "Mark contacted",
        },
        onboarded: {
          title: "Mark as onboarded",
          description: `Mark ${pendingAction.lead.businessName} as onboarded?`,
          confirmLabel: "Mark onboarded",
        },
        remove: {
          title: "Remove application",
          description: `Permanently remove ${pendingAction.lead.businessName} from the founding merchant database?`,
          confirmLabel: "Remove",
          destructive: true,
        },
      }[pendingAction.type]
    : null;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Store className="w-5 h-5" />
            Founding Merchant Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Review applications and approve, decline, or remove founding merchants.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void loadData()} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total applications</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats?.total ?? "—"}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Active merchants</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats?.activeCount ?? "—"}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Spots remaining</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats?.remainingSpots ?? "—"}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Pending verification</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats?.byStatus?.pending_verification ?? 0}</p></CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search business, contact, email, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                void loadData(1, statusFilter, e.currentTarget.value);
              }
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
            void loadData(1, value, search);
          }}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="secondary"
          onClick={() => {
            setPage(1);
            void loadData(1, statusFilter, search);
          }}
        >
          Search
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Applications</CardTitle>
          <CardDescription>Click a row to review details and take action</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground text-sm">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell>
                        <div className="font-medium">{lead.businessName}</div>
                        <div className="text-xs text-muted-foreground">{lead.businessType || "—"}</div>
                      </TableCell>
                      <TableCell>
                        <div>{lead.contactName}</div>
                        <div className="text-xs text-muted-foreground">{lead.email}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {[lead.city, lead.state, lead.country].filter(Boolean).join(", ") || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(lead.status)}>
                          {STATUS_LABELS[lead.status] || lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openDetail(lead)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {lead.status !== "verified" && lead.status !== "onboarded" && lead.status !== "declined" ? (
                            <Button variant="ghost" size="icon" onClick={() => setPendingAction({ type: "approve", lead })}>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                          ) : null}
                          {lead.status !== "declined" ? (
                            <Button variant="ghost" size="icon" onClick={() => setPendingAction({ type: "decline", lead })}>
                              <XCircle className="w-4 h-4 text-red-600" />
                            </Button>
                          ) : null}
                          <Button variant="ghost" size="icon" onClick={() => setPendingAction({ type: "remove", lead })}>
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 ? (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => { const next = page - 1; setPage(next); void loadData(next); }}>
            Previous
          </Button>
          <span className="text-sm self-center">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => { const next = page + 1; setPage(next); void loadData(next); }}>
            Next
          </Button>
        </div>
      ) : null}

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedLead?.businessName}</DialogTitle>
            <DialogDescription>{selectedLead?.email}</DialogDescription>
          </DialogHeader>
          {selectedLead ? (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant={statusBadgeVariant(selectedLead.status)}>
                  {STATUS_LABELS[selectedLead.status] || selectedLead.status}
                </Badge>
                {selectedLead.isEmailVerified ? (
                  <Badge variant="secondary">Email verified</Badge>
                ) : (
                  <Badge variant="outline">Email not verified</Badge>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Contact:</span> {selectedLead.contactName}</div>
                <div><span className="text-muted-foreground">Phone:</span> {selectedLead.phone || "—"}</div>
                <div><span className="text-muted-foreground">Type:</span> {selectedLead.businessType || "—"}</div>
                <div><span className="text-muted-foreground">Location:</span> {[selectedLead.city, selectedLead.state, selectedLead.country].filter(Boolean).join(", ") || "—"}</div>
                <div><span className="text-muted-foreground">Monthly volume:</span> {selectedLead.monthlyVolume ? `$${selectedLead.monthlyVolume.toLocaleString()}` : "—"}</div>
                <div><span className="text-muted-foreground">Compared fee:</span> {selectedLead.traditionalFeeRate != null ? `${(selectedLead.traditionalFeeRate * 100).toFixed(1)}%` : "—"}</div>
                <div><span className="text-muted-foreground">Applied:</span> {new Date(selectedLead.createdAt).toLocaleString()}</div>
                <div><span className="text-muted-foreground">Source:</span> {selectedLead.source || "—"}</div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedLead.status !== "verified" && selectedLead.status !== "onboarded" && selectedLead.status !== "declined" ? (
                  <Button size="sm" onClick={() => setPendingAction({ type: "approve", lead: selectedLead })}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </Button>
                ) : null}
                {selectedLead.status !== "contacted" && selectedLead.status !== "declined" ? (
                  <Button size="sm" variant="secondary" onClick={() => setPendingAction({ type: "contacted", lead: selectedLead })}>
                    Mark contacted
                  </Button>
                ) : null}
                {selectedLead.status !== "onboarded" && selectedLead.status !== "declined" ? (
                  <Button size="sm" variant="secondary" onClick={() => setPendingAction({ type: "onboarded", lead: selectedLead })}>
                    Mark onboarded
                  </Button>
                ) : null}
                {selectedLead.status !== "declined" ? (
                  <Button size="sm" variant="outline" onClick={() => setPendingAction({ type: "decline", lead: selectedLead })}>
                    <XCircle className="w-4 h-4 mr-1" /> Decline
                  </Button>
                ) : null}
                <Button size="sm" variant="destructive" onClick={() => setPendingAction({ type: "remove", lead: selectedLead })}>
                  <Trash2 className="w-4 h-4 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AdminPasswordDialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => { if (!open && !actionSubmitting) setPendingAction(null); }}
        title={actionCopy?.title || "Confirm action"}
        description={actionCopy?.description || "Enter the admin action password to continue."}
        confirmLabel={actionCopy?.confirmLabel || "Confirm"}
        destructive={actionCopy?.destructive}
        submitting={actionSubmitting}
        onConfirm={executeAction}
      />
    </div>
  );
}
