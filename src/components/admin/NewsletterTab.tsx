"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, type NewsletterIssue, type NewsletterSubscriberStats } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminPasswordDialog } from "@/components/admin/AdminPasswordDialog";
import { Loader2, Mail, Plus, RefreshCw, Save, Send, Trash2 } from "lucide-react";

interface NewsletterTabProps {
  token: string;
}

const EMPTY_FORM = {
  title: "Weekly Newsletter",
  subject: "",
  preheader: "",
  htmlBody: "<p>Hello,</p>\n<p>Your weekly SliceChain update goes here.</p>\n<p>— The SliceChain Team</p>",
};

export function NewsletterTab({ token }: NewsletterTabProps) {
  const [stats, setStats] = useState<NewsletterSubscriberStats | null>(null);
  const [issues, setIssues] = useState<NewsletterIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const selectedIssue = issues.find((issue) => issue._id === selectedIssueId) || null;
  const isDraft = !selectedIssue || selectedIssue.status === "draft";

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, issuesData] = await Promise.all([
        adminApi.getNewsletterSubscriberStats(token),
        adminApi.listNewsletterIssues(token),
      ]);
      setStats(statsData);
      setIssues(issuesData.issues);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load newsletter data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function startNewDraft() {
    setSelectedIssueId(null);
    setForm(EMPTY_FORM);
  }

  function loadIssueIntoEditor(issue: NewsletterIssue) {
    setSelectedIssueId(issue._id);
    setForm({
      title: issue.title,
      subject: issue.subject,
      preheader: issue.preheader || "",
      htmlBody: issue.htmlBody,
    });
  }

  async function saveDraft() {
    if (!form.subject.trim() || !form.htmlBody.trim()) {
      toast.error("Subject and body are required");
      return;
    }

    setSaving(true);
    try {
      if (selectedIssueId && isDraft) {
        const data = await adminApi.updateNewsletterIssue(token, selectedIssueId, form);
        toast.success("Draft saved");
        setSelectedIssueId(data.issue._id);
      } else if (!selectedIssueId) {
        const data = await adminApi.createNewsletterIssue(token, form);
        toast.success("Draft created");
        setSelectedIssueId(data.issue._id);
      } else {
        toast.error("Published newsletters cannot be edited");
        return;
      }
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save draft");
    } finally {
      setSaving(false);
    }
  }

  async function publishNewsletter(actionPassword: string) {
    if (!selectedIssueId) {
      toast.error("Save the draft before publishing");
      return;
    }

    setPublishing(true);
    try {
      const data = await adminApi.publishNewsletterIssue(token, selectedIssueId, actionPassword);
      toast.success(data.message || "Newsletter published");
      setPublishOpen(false);
      await loadData();
      loadIssueIntoEditor(data.issue);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish newsletter");
    } finally {
      setPublishing(false);
    }
  }

  async function deleteDraft() {
    if (!selectedIssueId || !isDraft) return;

    setDeleting(true);
    try {
      await adminApi.deleteNewsletterIssue(token, selectedIssueId);
      toast.success("Draft deleted");
      setDeleteOpen(false);
      setSelectedIssueId(null);
      setForm(EMPTY_FORM);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete draft");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Newsletter Publishing
          </h2>
          <p className="text-sm text-muted-foreground">
            Write and review weekly newsletters, then send to subscribed contacts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void loadData()} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={startNewDraft}>
            <Plus className="w-4 h-4 mr-1" />
            New draft
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.activeSubscribers ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats ? `${stats.totalSubscribers} total in database` : "Loading…"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current draft</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium truncate">{selectedIssue?.subject || "None selected"}</p>
            <Badge variant={selectedIssue?.status === "published" ? "default" : "secondary"} className="mt-2">
              {selectedIssue?.status || "new"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Last published</CardTitle>
          </CardHeader>
          <CardContent>
            {issues.find((issue) => issue.status === "published") ? (
              <>
                <p className="text-sm font-medium truncate">
                  {issues.find((issue) => issue.status === "published")?.subject}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {issues.find((issue) => issue.status === "published")?.recipientCount ?? 0} recipients
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No published issues yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Issues</CardTitle>
            <CardDescription>Drafts and published newsletters</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-muted-foreground text-sm">
                        No newsletter issues yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    issues.map((issue) => (
                      <TableRow
                        key={issue._id}
                        className={`cursor-pointer ${selectedIssueId === issue._id ? "bg-muted/50" : ""}`}
                        onClick={() => loadIssueIntoEditor(issue)}
                      >
                        <TableCell className="text-sm">
                          <div className="font-medium truncate max-w-[180px]">{issue.subject}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(issue.updatedAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={issue.status === "published" ? "default" : "outline"}>
                            {issue.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Editor</CardTitle>
            <CardDescription>
              {isDraft ? "Edit your weekly newsletter content" : "Published issue (read-only)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newsletterTitle">Internal title</Label>
                <Input
                  id="newsletterTitle"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  disabled={!isDraft}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="newsletterSubject">Email subject</Label>
                <Input
                  id="newsletterSubject"
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  disabled={!isDraft}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="newsletterPreheader">Preheader (optional)</Label>
              <Input
                id="newsletterPreheader"
                value={form.preheader}
                onChange={(e) => setForm((prev) => ({ ...prev, preheader: e.target.value }))}
                disabled={!isDraft}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newsletterBody">HTML body</Label>
              <Textarea
                id="newsletterBody"
                value={form.htmlBody}
                onChange={(e) => setForm((prev) => ({ ...prev, htmlBody: e.target.value }))}
                disabled={!isDraft}
                rows={16}
                className="mt-1 font-mono text-xs"
              />
            </div>

            {selectedIssue?.status === "published" && selectedIssue.sendStats ? (
              <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                Sent to {selectedIssue.recipientCount} subscribers · Delivered {selectedIssue.sendStats.sent} · Failed {selectedIssue.sendStats.failed}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(true)} disabled={!form.htmlBody.trim()}>
                Preview
              </Button>
              {isDraft ? (
                <>
                  <Button onClick={() => void saveDraft()} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                    Save draft
                  </Button>
                  {selectedIssueId ? (
                    <Button
                      variant="outline"
                      onClick={() => setDeleteOpen(true)}
                      disabled={saving || deleting}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete draft
                    </Button>
                  ) : null}
                  <Button
                    variant="default"
                    onClick={() => setPublishOpen(true)}
                    disabled={!selectedIssueId || saving}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Publish &amp; send
                  </Button>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.subject || "Newsletter preview"}</DialogTitle>
            <DialogDescription>{form.preheader || "Preview of the email subscribers will receive"}</DialogDescription>
          </DialogHeader>
          <div
            className="rounded-lg border p-6 bg-white text-neutral-900 [&_*]:!text-neutral-900 [&_a]:!text-blue-700"
            dangerouslySetInnerHTML={{ __html: form.htmlBody }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={(open) => { if (!deleting) setDeleteOpen(open); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete draft?</DialogTitle>
            <DialogDescription>
              This permanently removes &ldquo;{selectedIssue?.subject || form.subject || "this draft"}&rdquo;. Published issues cannot be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => void deleteDraft()} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete draft"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminPasswordDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title="Publish newsletter"
        description={`This will email all ${stats?.activeSubscribers ?? "subscribed"} contacts in the newsletter database. Enter the admin action password to continue.`}
        confirmLabel="Publish & send"
        submitting={publishing}
        onConfirm={publishNewsletter}
      />
    </div>
  );
}
