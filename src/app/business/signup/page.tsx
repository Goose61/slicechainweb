"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { businessApi } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Briefcase, MapPin, User, Receipt, Wallet, ListChecks,
  ShieldCheck, CheckCircle, Loader2, Building2, Pizza,
} from "lucide-react";

function UserTieIcon(props: React.ComponentProps<typeof User>) {
  return <User {...props} />;
}

interface FormData {
  // Section 1 — Business Information
  legalBusinessName: string;
  tradingName: string;
  businessStructure: string;
  registrationNumber: string;
  taxId: string;
  dateEstablished: string;
  industryActivity: string;
  companyWebsite: string;
  // Section 2 — Registered Address
  registeredStreet: string;
  registeredCity: string;
  registeredState: string;
  registeredPostalCode: string;
  registeredCountry: string;
  // Section 3 — Primary Contact
  primaryContactName: string;
  primaryContactTitle: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  // Section 4 — Billing
  billingContactName: string;
  billingEmail: string;
  billingPhone: string;
  billingAddress: string;
  preferredPaymentMethod: string;
  // Section 5 — Wallet
  solanaWalletAddress: string;
  // Section 6 — Services
  servicesConsulting: boolean;
  servicesFinancial: boolean;
  servicesSoftware: boolean;
  servicesVendor: boolean;
  servicesPartnership: boolean;
  servicesOtherDetails: string;
  // Section 7 — Declaration
  authorizedRepName: string;
  authorizedRepTitle: string;
  signature: string;
  declarationDate: string;
  acceptTerms: boolean;
  // Account credentials
  password: string;
  confirmPassword: string;
}

const EMPTY: FormData = {
  legalBusinessName: "", tradingName: "", businessStructure: "", registrationNumber: "",
  taxId: "", dateEstablished: "", industryActivity: "", companyWebsite: "",
  registeredStreet: "", registeredCity: "", registeredState: "", registeredPostalCode: "", registeredCountry: "",
  primaryContactName: "", primaryContactTitle: "", primaryContactEmail: "", primaryContactPhone: "",
  billingContactName: "", billingEmail: "", billingPhone: "", billingAddress: "", preferredPaymentMethod: "",
  solanaWalletAddress: "",
  servicesConsulting: false, servicesFinancial: false, servicesSoftware: false,
  servicesVendor: false, servicesPartnership: false, servicesOtherDetails: "",
  authorizedRepName: "", authorizedRepTitle: "", signature: "", declarationDate: "",
  acceptTerms: false,
  password: "", confirmPassword: "",
};

function SectionCard({ icon: Icon, number, title, children }: {
  icon: React.ElementType; number: number; title: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
      <h3 className="flex items-center gap-3 mb-4 text-white font-semibold text-base">
        <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-rose-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
          <Icon className="w-4 h-4" />
        </span>
        <span>{number}) {title}</span>
      </h3>
      {children}
    </div>
  );
}

function Field({ label, required, children, hint }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-sm">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

const inputCls = "bg-white/8 border-white/15 text-white placeholder:text-slate-500 focus:border-orange-400/70 focus:ring-orange-400/20";
const selectCls = `${inputCls} [&>option]:bg-slate-900 [&>option]:text-white`;
const checkboxCls = "w-4 h-4 rounded accent-orange-500 cursor-pointer";

export default function BusinessSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(field: keyof FormData, value: string | boolean) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function inp(field: keyof FormData) {
    return {
      value: form[field] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        set(field, e.target.value),
      className: inputCls,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.acceptTerms) {
      toast.error("You must agree to the Terms and Privacy Policy.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await businessApi.signupRequest({
        businessName: form.legalBusinessName,
        tradingName: form.tradingName,
        businessStructure: form.businessStructure,
        registrationNumber: form.registrationNumber,
        taxId: form.taxId,
        dateEstablished: form.dateEstablished,
        industryActivity: form.industryActivity,
        companyWebsite: form.companyWebsite,
        address: {
          street: form.registeredStreet,
          city: form.registeredCity,
          state: form.registeredState,
          postalCode: form.registeredPostalCode,
          country: form.registeredCountry,
        },
        contact: {
          name: form.primaryContactName,
          title: form.primaryContactTitle,
          email: form.primaryContactEmail,
          phone: form.primaryContactPhone,
        },
        billing: {
          contactName: form.billingContactName,
          email: form.billingEmail,
          phone: form.billingPhone,
          address: form.billingAddress,
          paymentMethod: form.preferredPaymentMethod,
        },
        walletAddress: form.solanaWalletAddress || undefined,
        services: {
          consulting: form.servicesConsulting,
          financialServices: form.servicesFinancial,
          softwareAccess: form.servicesSoftware,
          vendorRegistration: form.servicesVendor,
          partnership: form.servicesPartnership,
          otherDetails: form.servicesOtherDetails,
        },
        declaration: {
          authorizedRepName: form.authorizedRepName,
          authorizedRepTitle: form.authorizedRepTitle,
          signature: form.signature,
          date: form.declarationDate,
        },
        email: form.primaryContactEmail,
        phone: form.primaryContactPhone,
        password: form.password,
        businessType: "CN",
      });
      setSubmitted(true);
      toast.success("Registration submitted! Our team will review your application.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/10 border border-white/10 rounded-2xl p-8 text-center space-y-5 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Application Submitted</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Your CN business registration has been submitted. Our team will review it and contact you at{" "}
            <strong className="text-white">{form.primaryContactEmail}</strong>.
          </p>
          <Button
            onClick={() => router.push("/business/login")}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
          >
            Go to Login
          </Button>
          <p className="text-slate-500 text-xs">
            Already approved?{" "}
            <Link href="/business/login" className="text-blue-400 hover:text-blue-300">Sign in here</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-xl shadow-orange-500/20">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Business Registration</h1>
              <p className="text-slate-400 text-sm">Provide your business details to join the Pizza Platform.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-full px-3 py-1 mb-1">
              <span className="mr-1">*</span> Required fields
            </span>
            <p className="text-slate-500 text-xs">All applications are reviewed by our team.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1 — Business Information */}
          <SectionCard icon={Briefcase} number={1} title="Business Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Legal Business Name" required>
                <Input {...inp("legalBusinessName")} placeholder="Acme Corp Ltd." required />
              </Field>
              <Field label="Trading Name (DBA)">
                <Input {...inp("tradingName")} placeholder="Acme" />
              </Field>
              <Field label="Business Structure" required>
                <select
                  value={form.businessStructure}
                  onChange={(e) => set("businessStructure", e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 text-sm ${selectCls}`}
                  required
                >
                  <option value="">Select structure</option>
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="non_profit">Non-profit</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="Registration Number" required>
                <Input {...inp("registrationNumber")} placeholder="12345678" required />
              </Field>
              <Field label="Tax ID / EIN / VAT" required>
                <Input {...inp("taxId")} placeholder="XX-XXXXXXX" required />
              </Field>
              <Field label="Date Established" required>
                <Input {...inp("dateEstablished")} type="date" required />
              </Field>
              <Field label="Industry / Activity" required>
                <Input {...inp("industryActivity")} placeholder="Food & Beverage" required />
              </Field>
              <Field label="Company Website">
                <Input {...inp("companyWebsite")} type="url" placeholder="https://example.com" />
              </Field>
            </div>
          </SectionCard>

          {/* Section 2 — Registered Address */}
          <SectionCard icon={MapPin} number={2} title="Registered Business Address">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Field label="Street Address" required>
                  <Input {...inp("registeredStreet")} placeholder="123 Main Street" required />
                </Field>
              </div>
              <Field label="City" required>
                <Input {...inp("registeredCity")} placeholder="New York" required />
              </Field>
              <Field label="State / Province" required>
                <Input {...inp("registeredState")} placeholder="NY" required />
              </Field>
              <Field label="Postal / ZIP Code" required>
                <Input {...inp("registeredPostalCode")} placeholder="10001" required />
              </Field>
              <Field label="Country" required>
                <Input {...inp("registeredCountry")} placeholder="United States" required />
              </Field>
            </div>
          </SectionCard>

          {/* Section 3 — Primary Contact */}
          <SectionCard icon={UserTieIcon} number={3} title="Primary Contact Person">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name" required>
                <Input {...inp("primaryContactName")} placeholder="Jane Doe" required />
              </Field>
              <Field label="Job Title" required>
                <Input {...inp("primaryContactTitle")} placeholder="CEO / Owner" required />
              </Field>
              <Field label="Email" required>
                <Input {...inp("primaryContactEmail")} type="email" placeholder="jane@example.com" required />
              </Field>
              <Field label="Phone" required hint="Include country code if outside US.">
                <Input {...inp("primaryContactPhone")} type="tel" placeholder="+1 555 000 0000" required />
              </Field>
            </div>
          </SectionCard>

          {/* Section 4 — Billing */}
          <SectionCard icon={Receipt} number={4} title="Billing Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Billing Contact Name" required>
                <Input {...inp("billingContactName")} placeholder="Jane Doe" required />
              </Field>
              <Field label="Billing Email" required>
                <Input {...inp("billingEmail")} type="email" placeholder="billing@example.com" required />
              </Field>
              <Field label="Billing Phone" required>
                <Input {...inp("billingPhone")} type="tel" placeholder="+1 555 000 0000" required />
              </Field>
              <Field label="Preferred Payment Method" required>
                <select
                  value={form.preferredPaymentMethod}
                  onChange={(e) => set("preferredPaymentMethod", e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 text-sm ${selectCls}`}
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="crypto_usdc">Crypto (USDC)</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Billing Address" required>
                  <textarea
                    value={form.billingAddress}
                    onChange={(e) => set("billingAddress", e.target.value)}
                    placeholder="Full billing address"
                    rows={2}
                    required
                    className={`w-full rounded-md border px-3 py-2 text-sm resize-none ${inputCls}`}
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Section 5 — Wallet */}
          <SectionCard icon={Wallet} number={5} title="Solana Wallet Configuration">
            <div className="grid grid-cols-1 gap-4">
              <Field
                label="Business Solana Wallet Address"
                required
                hint="This wallet will receive customer payments via Solana Pay."
              >
                <Input
                  {...inp("solanaWalletAddress")}
                  placeholder="Your primary Solana wallet address"
                  className={`${inputCls} font-mono text-sm`}
                  required
                />
              </Field>
            </div>
          </SectionCard>

          {/* Section 6 — Services */}
          <SectionCard icon={ListChecks} number={6} title="Services Requested">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4">
              {[
                { key: "servicesConsulting" as const, label: "Consulting" },
                { key: "servicesFinancial" as const, label: "Financial Services" },
                { key: "servicesSoftware" as const, label: "Software Access" },
                { key: "servicesVendor" as const, label: "Vendor Registration" },
                { key: "servicesPartnership" as const, label: "Partnership" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer text-slate-300 text-sm">
                  <input
                    type="checkbox"
                    checked={form[key] as boolean}
                    onChange={(e) => set(key, e.target.checked)}
                    className={checkboxCls}
                  />
                  {label}
                </label>
              ))}
            </div>
            <Field label="Other details">
              <textarea
                {...inp("servicesOtherDetails")}
                placeholder="Describe any additional services or requirements..."
                rows={2}
                className={`w-full rounded-md border px-3 py-2 text-sm resize-none ${inputCls}`}
              />
            </Field>
          </SectionCard>

          {/* Section 7 — Declaration */}
          <SectionCard icon={ShieldCheck} number={7} title="Declaration & Consent">
            <p className="text-slate-400 text-xs mb-4">
              By submitting this form, I confirm that the information provided is accurate and I agree to the
              Terms and Privacy Policy of the Pizza Platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Field label="Authorized Representative Name" required>
                <Input {...inp("authorizedRepName")} placeholder="Full name" required />
              </Field>
              <Field label="Position / Title" required>
                <Input {...inp("authorizedRepTitle")} placeholder="CEO / Director" required />
              </Field>
              <Field label="Signature" required hint="Type your full name as your digital signature.">
                <Input {...inp("signature")} placeholder="Type full name as signature" required />
              </Field>
              <Field label="Date" required>
                <Input {...inp("declarationDate")} type="date" required />
              </Field>
            </div>

            {/* Account credentials inside declaration */}
            <div className="border-t border-white/10 pt-4 mt-2 mb-4">
              <p className="text-sm font-semibold text-white mb-3">Account Credentials</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Password" required hint="Minimum 8 characters.">
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="••••••••"
                    className={inputCls}
                    required
                    minLength={8}
                  />
                </Field>
                <Field label="Confirm Password" required>
                  <Input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    className={inputCls}
                    required
                    minLength={8}
                  />
                </Field>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.acceptTerms}
                onChange={(e) => set("acceptTerms", e.target.checked)}
                className={`${checkboxCls} mt-0.5`}
                required
              />
              <span className="text-slate-300 text-sm">
                I agree to the Terms and Privacy Policy.{" "}
                <span className="text-rose-400">*</span>
              </span>
            </label>
          </SectionCard>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 flex-wrap mt-2">
            <Link
              href="/business/login"
              className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1.5"
            >
              <Pizza className="w-4 h-4" />
              Back to Business Login
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90 text-white border-0 px-8"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                : <><CheckCircle className="w-4 h-4 mr-2" />Submit Registration</>
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
