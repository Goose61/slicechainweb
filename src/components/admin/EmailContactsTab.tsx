"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, type EmailContact, type EmailContactStats } from "@/lib/api";
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
import { Loader2, Mail, RefreshCw, Search, Users } from "lucide-react";

interface EmailContactsTabProps {
  token: string;
}

function marketingOptInLabel(value: boolean | null | undefined) {
  if (value === true) return "Subscribed to updates";
  if (value === false) return "Declined updates";
  return "Not specified";
}

function marketingOptInVariant(value: boolean | null | undefined): "default" | "secondary" | "destructive" | "outline" {
  if (value === true) return "default";
  if (value === false) return "destructive";
  return "outline";
}

function formatProfileTypes(types: string[] | undefined) {
  if (!types?.length) return "—";
  return types.map((type) => type.replace(/_/g, " ")).join(", ");
}

export function EmailContactsTab({ token }: EmailContactsTabProps) {
  const [stats, setStats] = useState<EmailContactStats | null>(null);
  const [contacts, setContacts] = useState<EmailContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [optInFilter, setOptInFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<EmailContact | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadData = useCallback(async (p = page, filter = optInFilter, q = search) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(p),
        limit: "25",
      };
      if (filter !== "all") params.marketingOptIn = filter;
      if (q.trim()) params.search = q.trim();

      const [statsData, contactsData] = await Promise.all([
        adminApi.getNewsletterSubscriberStats(token),
        adminApi.listEmailContacts(token, params),
      ]);
      setStats(statsData);
      setContacts(contactsData.subscribers);
      setTotalPages(contactsData.pagination.totalPages);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load email contacts");
    } finally {
      setLoading(false);
    }
  }, [token, page, optInFilter, search]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPage(1);
    void loadData(1, optInFilter, search);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total captured emails</CardDescription>
            <CardTitle className="text-2xl">{stats?.totalSubscribers ?? "—"}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Subscribed to updates</CardDescription>
            <CardTitle className="text-2xl text-emerald-600">{stats?.marketingOptInCount ?? "—"}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Declined updates</CardDescription>
            <CardTitle className="text-2xl text-destructive">{stats?.marketingOptOutCount ?? "—"}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Consent not specified</CardDescription>
            <CardTitle className="text-2xl">{stats?.marketingUnknownCount ?? "—"}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Email Contacts
              </CardTitle>
              <CardDescription>
                Every email captured across SlicePay forms, registrations, and lead flows.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <form className="flex gap-2" onSubmit={handleSearchSubmit}>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search email, name, source…"
                  className="w-full sm:w-64"
                />
                <Button type="submit" variant="secondary" size="icon" aria-label="Search">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
              <Select
                value={optInFilter}
                onValueChange={(value) => {
                  setOptInFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="All consent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All consent</SelectItem>
                  <SelectItem value="true">Subscribed</SelectItem>
                  <SelectItem value="false">Declined</SelectItem>
                  <SelectItem value="unknown">Not specified</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => void loadData()} aria-label="Refresh">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading contacts…
            </div>
          ) : contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No email contacts found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Profiles</TableHead>
                    <TableHead>Updates</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Captured</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact._id}>
                      <TableCell className="font-medium">{contact.email}</TableCell>
                      <TableCell>{contact.firstName || contact.profiles?.[0]?.displayName || "—"}</TableCell>
                      <TableCell className="max-w-[180px] truncate">{contact.source || "—"}</TableCell>
                      <TableCell>{formatProfileTypes(contact.profileTypes)}</TableCell>
                      <TableCell>
                        <Badge variant={marketingOptInVariant(contact.marketingOptIn)}>
                          {marketingOptInLabel(contact.marketingOptIn)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {contact.emailVerified ? (
                          <Badge variant="secondary">Verified</Badge>
                        ) : (
                          <Badge variant="outline">Unverified</Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedContact(contact);
                            setDetailOpen(true);
                          }}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {selectedContact?.email}
            </DialogTitle>
            <DialogDescription>Captured contact details and consent history.</DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p>{selectedContact.firstName || selectedContact.profiles?.[0]?.displayName || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Audience</p>
                  <p>{selectedContact.audience || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Source</p>
                  <p>{selectedContact.source || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Updates consent</p>
                  <Badge variant={marketingOptInVariant(selectedContact.marketingOptIn)}>
                    {marketingOptInLabel(selectedContact.marketingOptIn)}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Profile types</p>
                  <p>{formatProfileTypes(selectedContact.profileTypes)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email verified</p>
                  <p>{selectedContact.emailVerified ? "Yes" : "No"}</p>
                </div>
              </div>

              {selectedContact.profiles?.length ? (
                <div>
                  <p className="text-muted-foreground mb-2">Linked profiles</p>
                  <ul className="space-y-2">
                    {selectedContact.profiles.map((profile, index) => (
                      <li key={`${profile.profileType}-${index}`} className="rounded-md border p-2">
                        <p className="font-medium capitalize">{profile.profileType.replace(/_/g, " ")}</p>
                        <p>{profile.displayName || profile.businessName || "—"}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {selectedContact.captureEvents?.length ? (
                <div>
                  <p className="text-muted-foreground mb-2">Capture history</p>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {[...selectedContact.captureEvents].reverse().map((event, index) => (
                      <li key={`${event.source}-${index}`} className="rounded-md border p-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{event.source}</span>
                          <Badge variant={marketingOptInVariant(event.marketingOptIn)}>
                            {event.marketingOptIn ? "Opted in" : "Opted out"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs mt-1">
                          {new Date(event.capturedAt).toLocaleString()}
                          {event.audience ? ` · ${event.audience}` : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
