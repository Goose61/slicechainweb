"use client";

import { useEffect, useState } from "react";
import {
  adminApi,
  type FoundingMerchantBusiness,
  type FoundingMerchantLead,
  type FoundingMerchantUpdatePayload,
} from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { AdminPasswordDialog } from "@/components/admin/AdminPasswordDialog";

interface FoundingMerchantEditDialogProps {
  token: string;
  lead: FoundingMerchantLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void | Promise<void>;
}

const BUSINESS_CATEGORY_OPTIONS = [
  "Restaurant",
  "Retail",
  "Food Truck",
  "Service Business",
  "Other",
] as const;

function categorySlugToLabel(slug?: string | null): string {
  if (!slug) return "";
  const map: Record<string, string> = {
    restaurant: "Restaurant",
    retail: "Retail",
    service: "Service Business",
    other: "Other",
    "e-commerce": "Retail",
    healthcare: "Service Business",
    education: "Service Business",
    technology: "Service Business",
    manufacturing: "Retail",
  };
  return map[slug.toLowerCase()] || slug;
}

type FormState = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  businessType: string;
  city: string;
  state: string;
  country: string;
  monthlyVolume: string;
  traditionalFeeRate: string;
  walletAddress: string;
  taxId: string;
  businessCategory: string;
  street: string;
  zipCode: string;
  contactTitle: string;
};

const EMPTY_FORM: FormState = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  businessType: "",
  city: "",
  state: "",
  country: "",
  monthlyVolume: "",
  traditionalFeeRate: "",
  walletAddress: "",
  taxId: "",
  businessCategory: "",
  street: "",
  zipCode: "",
  contactTitle: "",
};

function buildForm(lead: FoundingMerchantLead, business: FoundingMerchantBusiness | null): FormState {
  const categoryLabel =
    lead.businessType?.trim() ||
    categorySlugToLabel(business?.businessCategory) ||
    "";

  return {
    businessName: lead.businessName || "",
    contactName: lead.contactName || "",
    email: lead.email || "",
    phone: lead.phone || business?.contact?.phone || "",
    website: lead.website || "",
    businessType: categoryLabel,
    city: lead.city || business?.address?.city || "",
    state: lead.state || business?.address?.state || "",
    country: lead.country || business?.address?.country || "",
    monthlyVolume: lead.monthlyVolume != null ? String(lead.monthlyVolume) : "",
    traditionalFeeRate:
      lead.traditionalFeeRate != null ? String((lead.traditionalFeeRate * 100).toFixed(2)) : "",
    walletAddress: business?.walletAddress || "",
    taxId: business?.taxId || "",
    businessCategory: business?.businessCategory || "",
    street: business?.address?.street || "",
    zipCode: business?.address?.zipCode || "",
    contactTitle: business?.contact?.title || "",
  };
}

function buildPayload(form: FormState): FoundingMerchantUpdatePayload {
  const monthlyVolume = form.monthlyVolume.trim() ? Number(form.monthlyVolume) : "";
  const traditionalFeeRate = form.traditionalFeeRate.trim()
    ? Number(form.traditionalFeeRate) / 100
    : "";

  return {
    businessName: form.businessName.trim(),
    contactName: form.contactName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    website: form.website.trim(),
    businessType: form.businessType.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    country: form.country.trim(),
    monthlyVolume,
    traditionalFeeRate,
    walletAddress: form.walletAddress.trim(),
    taxId: form.taxId.trim(),
    businessCategory: form.businessCategory.trim(),
    address: {
      street: form.street.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zipCode: form.zipCode.trim(),
      country: form.country.trim(),
    },
    contact: {
      name: form.contactName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      title: form.contactTitle.trim(),
    },
  };
}

export function FoundingMerchantEditDialog({
  token,
  lead,
  open,
  onOpenChange,
  onSaved,
}: FoundingMerchantEditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [business, setBusiness] = useState<FoundingMerchantBusiness | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (!open || !lead) return;

    let cancelled = false;
    setLoading(true);
    void adminApi
      .getFoundingMerchantDetail(token, lead._id)
      .then((detail) => {
        if (cancelled) return;
        setBusiness(detail.business);
        setForm(buildForm(detail.lead, detail.business));
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "Failed to load merchant details");
        onOpenChange(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, lead, token, onOpenChange]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveWithPassword(actionPassword: string) {
    if (!lead) return;
    setSaving(true);
    try {
      await adminApi.updateFoundingMerchant(token, lead._id, buildPayload(form), actionPassword);
      toast.success(`${form.businessName || lead.businessName} updated`);
      setPasswordOpen(false);
      onOpenChange(false);
      await onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update merchant");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit founding merchant</DialogTitle>
            <DialogDescription>
              Update application details{business ? " and linked business account" : ""}. Changes to wallet and address
              apply immediately when a business account exists.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold">Application</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="fm-businessName">Business name</Label>
                    <Input id="fm-businessName" value={form.businessName} onChange={(e) => updateField("businessName", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fm-contactName">Contact name</Label>
                    <Input id="fm-contactName" value={form.contactName} onChange={(e) => updateField("contactName", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fm-contactTitle">Contact title</Label>
                    <Input id="fm-contactTitle" value={form.contactTitle} onChange={(e) => updateField("contactTitle", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fm-email">Email</Label>
                    <Input id="fm-email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fm-phone">Phone</Label>
                    <Input id="fm-phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fm-website">Website</Label>
                    <Input id="fm-website" value={form.website} onChange={(e) => updateField("website", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fm-businessType">Business category</Label>
                    <select
                      id="fm-businessType"
                      value={form.businessType}
                      onChange={(e) => updateField("businessType", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select category</option>
                      {BUSINESS_CATEGORY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                      {form.businessType &&
                      !BUSINESS_CATEGORY_OPTIONS.includes(form.businessType as (typeof BUSINESS_CATEGORY_OPTIONS)[number]) ? (
                        <option value={form.businessType}>{form.businessType}</option>
                      ) : null}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Industry type from the founding merchant application (not the CN platform classification).
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fm-monthlyVolume">Monthly volume (USD)</Label>
                    <Input id="fm-monthlyVolume" inputMode="decimal" value={form.monthlyVolume} onChange={(e) => updateField("monthlyVolume", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fm-traditionalFeeRate">Compared fee (%)</Label>
                    <Input id="fm-traditionalFeeRate" inputMode="decimal" value={form.traditionalFeeRate} onChange={(e) => updateField("traditionalFeeRate", e.target.value)} />
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold">Location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {business ? (
                    <div className="space-y-1 sm:col-span-2">
                      <Label htmlFor="fm-street">Street address</Label>
                      <Input id="fm-street" value={form.street} onChange={(e) => updateField("street", e.target.value)} />
                    </div>
                  ) : null}
                  <div className="space-y-1">
                    <Label htmlFor="fm-city">City</Label>
                    <Input id="fm-city" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fm-state">State / region</Label>
                    <Input id="fm-state" value={form.state} onChange={(e) => updateField("state", e.target.value)} />
                  </div>
                  {business ? (
                    <div className="space-y-1">
                      <Label htmlFor="fm-zipCode">Postal code</Label>
                      <Input id="fm-zipCode" value={form.zipCode} onChange={(e) => updateField("zipCode", e.target.value)} />
                    </div>
                  ) : null}
                  <div className="space-y-1">
                    <Label htmlFor="fm-country">Country</Label>
                    <Input id="fm-country" value={form.country} onChange={(e) => updateField("country", e.target.value)} />
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold">
                  Business account{business ? "" : " (available after onboarding)"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="fm-walletAddress">Solana wallet address</Label>
                    <Input
                      id="fm-walletAddress"
                      value={form.walletAddress}
                      onChange={(e) => updateField("walletAddress", e.target.value)}
                      placeholder="Base58 Solana public key"
                      className="font-mono text-sm"
                      disabled={!business}
                    />
                    {!business ? (
                      <p className="text-xs text-muted-foreground">
                        Wallet editing unlocks once the merchant completes onboarding and a business record is linked.
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fm-taxId">Tax ID</Label>
                    <Input id="fm-taxId" value={form.taxId} onChange={(e) => updateField("taxId", e.target.value)} disabled={!business} />
                  </div>
                  {business ? (
                    <div className="space-y-1 sm:col-span-2">
                      <Label>Platform classification</Label>
                      <Input value={business.businessType || "CN"} disabled className="bg-muted" />
                      <p className="text-xs text-muted-foreground">Crypto Native (CN) - fixed for all SlicePay merchants.</p>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={() => setPasswordOpen(true)} disabled={loading || saving}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminPasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        title="Save merchant changes"
        description={`Enter the admin action password to update ${lead?.businessName || "this merchant"}.`}
        confirmLabel="Save"
        submitting={saving}
        onConfirm={saveWithPassword}
      />
    </>
  );
}
