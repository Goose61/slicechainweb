"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getApiBase, getAdminToken } from "@/lib/api";

type CountryConfig = {
  countryCode: string;
  travelRuleEnabled: boolean;
  captureMode: string;
  thresholdAmount: number;
  currency: string;
};

type TransferRow = {
  _id: string;
  status: string;
  countryCode: string;
  amountUsd?: number;
  uniqueTransactionReference?: string;
  createdAt: string;
};

export function ComplianceTab() {
  const [loading, setLoading] = useState(true);
  const [za, setZa] = useState<CountryConfig | null>(null);
  const [transfers, setTransfers] = useState<TransferRow[]>([]);
  const [merchantCount, setMerchantCount] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const token = getAdminToken();

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const base = getApiBase();
      const [countriesRes, transfersRes, merchantsRes] = await Promise.all([
        fetch(`${base}/admin/compliance/countries`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${base}/admin/compliance/transfers?limit=25`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${base}/admin/compliance/merchants-by-country?country=ZA`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const countriesJson = await countriesRes.json();
      const transfersJson = await transfersRes.json();
      const merchantsJson = await merchantsRes.json();

      const zaConfig = (countriesJson.configs || []).find((c: CountryConfig) => c.countryCode === "ZA") || null;
      setZa(zaConfig);
      setTransfers(transfersJson.transfers || []);
      setMerchantCount(merchantsJson.count ?? null);
    } catch {
      toast.error("Failed to load compliance settings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveZa(updates: Partial<CountryConfig>) {
    if (!token || !za) return;
    setSaving(true);
    try {
      const base = getApiBase();
      const res = await fetch(`${base}/admin/compliance/countries/ZA`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setZa(json.config);
      toast.success("South Africa Travel Rule settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Travel Rule — South Africa (ZA)</CardTitle>
          <CardDescription>
            Enable FIC Directive 9 capture for merchants with country ZA. Disabled by default until legal sign-off.
            {merchantCount != null && ` · ${merchantCount} active ZA merchants (by address).`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!za ? (
            <p className="text-sm text-muted-foreground">
              No ZA config yet. Run <code className="text-xs">node scripts/seed-za-travel-rule-config.js</code> on the server.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="tr-enabled">Travel Rule enabled</Label>
                <Switch
                  id="tr-enabled"
                  checked={za.travelRuleEnabled}
                  onCheckedChange={(v) => saveZa({ travelRuleEnabled: v })}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label>Capture mode</Label>
                <Select
                  value={za.captureMode}
                  onValueChange={(v) => saveZa({ captureMode: v })}
                  disabled={saving}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unified_checkout">Unified checkout (recommended)</SelectItem>
                    <SelectItem value="wallet_gate">Wallet gate (Solana Pay first)</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                CDD full verification threshold: R{za.thresholdAmount?.toLocaleString()} ({za.currency}).
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Travel Rule transfers</CardTitle>
        </CardHeader>
        <CardContent>
          {transfers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transfer records yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Amount USD</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>{t.status}</TableCell>
                    <TableCell>{t.countryCode}</TableCell>
                    <TableCell>{t.amountUsd != null ? t.amountUsd.toFixed(2) : "—"}</TableCell>
                    <TableCell className="font-mono text-xs max-w-[120px] truncate">
                      {t.uniqueTransactionReference || "—"}
                    </TableCell>
                    <TableCell className="text-xs">{new Date(t.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}