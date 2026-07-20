"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { foundingMerchantApi } from "@/lib/api";
import { businessSignupPath } from "@/content/landing-content";

const TOTAL_STEPS = 2;

const SOLANA_WALLET_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

type AddressFields = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type Prefill = {
  email: string;
  businessName: string;
  ownerName: string;
  businessEmail: string;
  phone: string;
  businessType: string;
  city: string;
  state: string;
  country: string;
  hasAccount: boolean;
};

function emptyAddress(country = "US"): AddressFields {
  return { street: "", city: "", state: "", zipCode: "", country };
}

export default function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // From founding merchant application — not re-asked in KYC
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [needsPhone, setNeedsPhone] = useState(false);

  const [taxId, setTaxId] = useState("");
  const [solanaWallet, setSolanaWallet] = useState("");
  const [staffCount, setStaffCount] = useState("");
  const [registeredAddress, setRegisteredAddress] = useState<AddressFields>(emptyAddress());
  const [billingAddress, setBillingAddress] = useState<AddressFields>(emptyAddress());

  const progressValue = useMemo(() => (step / TOTAL_STEPS) * 100, [step]);

  const applyPrefill = useCallback((data: Prefill) => {
    setEmail(data.email || "");
    setBusinessName(data.businessName || "");
    setOwnerName(data.ownerName || "");
    setBusinessEmail(data.businessEmail || data.email || "");
    setPhone(data.phone || "");
    setBusinessType(data.businessType || "");
    setNeedsPhone(!data.phone?.trim());
    setRegisteredAddress((prev) => ({
      ...prev,
      city: data.city || prev.city,
      state: data.state || prev.state,
      country: data.country || prev.country || "US",
    }));
    setBillingAddress((prev) => ({
      ...prev,
      city: data.city || prev.city,
      state: data.state || prev.state,
      country: data.country || prev.country || "US",
    }));
    const existingToken = localStorage.getItem("businessToken");
    if (data.hasAccount && existingToken) {
      setAuthToken(existingToken);
      setStep(2);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!token) {
        setError("Missing onboarding link. Please use the link from your confirmation email.");
        setLoading(false);
        return;
      }

      try {
        const data = await foundingMerchantApi.getOnboarding(token);
        if (cancelled) return;
        applyPrefill(data);
        setError("");
      } catch (err: unknown) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load onboarding session";
        if (message.toLowerCase().includes("already") || message.toLowerCase().includes("sign in")) {
          setError(message);
          setTimeout(() => router.replace("/business/login"), 1800);
        } else {
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token, applyPrefill, router]);

  function updateRegistered<K extends keyof AddressFields>(key: K, value: string) {
    setRegisteredAddress((prev) => ({ ...prev, [key]: value }));
  }

  function updateBilling<K extends keyof AddressFields>(key: K, value: string) {
    setBillingAddress((prev) => ({ ...prev, [key]: value }));
  }

  function autofillBillingFromBusiness() {
    setBillingAddress({ ...registeredAddress });
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await foundingMerchantApi.createOnboardingAccount(token, password);
      setAuthToken(result.token);
      localStorage.setItem("businessToken", result.token);
      localStorage.setItem("businessEmail", result.email);
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  }

  function validateKycLegal(): string | null {
    if (!phone.trim() || !/^\+?[\d\s\-()]{10,}$/.test(phone.trim())) {
      return needsPhone
        ? "Enter a valid phone number."
        : "A phone number is required. Please add one below.";
    }
    if (!taxId.trim()) return "Business tax or registration ID is required.";
    if (!SOLANA_WALLET_RE.test(solanaWallet.trim())) {
      return "Enter a valid Solana wallet address (32–44 base58 characters).";
    }
    const staff = Number(staffCount);
    if (!Number.isFinite(staff) || staff < 0 || !Number.isInteger(staff)) {
      return "Enter a valid number of staff.";
    }
    for (const [label, addr] of [
      ["Registration", registeredAddress],
      ["Billing", billingAddress],
    ] as const) {
      if (!addr.street.trim()) return `${label} street address is required.`;
      if (!addr.city.trim()) return `${label} city is required.`;
      if (!addr.state.trim()) return `${label} state is required.`;
      if (!addr.zipCode.trim()) return `${label} postal / ZIP code is required.`;
      if (!addr.country.trim()) return `${label} country is required.`;
    }
    return null;
  }

  async function handleCompleteKyc(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateKycLegal();
    if (validationError) {
      setError(validationError);
      return;
    }

    const jwt = authToken || localStorage.getItem("businessToken");
    if (!jwt) {
      setError("Session expired. Please create your password again.");
      setStep(1);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const result = await foundingMerchantApi.completeOnboardingKyc(jwt, {
        token,
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        businessEmail: (businessEmail.trim() || email).trim(),
        phone: phone.trim(),
        businessType: businessType || "Other",
        city: registeredAddress.city.trim(),
        state: registeredAddress.state.trim(),
        taxId: taxId.trim(),
        solanaWallet: solanaWallet.trim(),
        staffCount: Number(staffCount),
        registeredAddress: {
          street: registeredAddress.street.trim(),
          city: registeredAddress.city.trim(),
          state: registeredAddress.state.trim(),
          zipCode: registeredAddress.zipCode.trim(),
          country: registeredAddress.country.trim(),
        },
        billingAddress: {
          street: billingAddress.street.trim(),
          city: billingAddress.city.trim(),
          state: billingAddress.state.trim(),
          zipCode: billingAddress.zipCode.trim(),
          country: billingAddress.country.trim(),
        },
      });

      localStorage.setItem("businessToken", result.token);
      localStorage.setItem("businessId", result.businessId);
      localStorage.setItem("businessType", result.businessType);
      localStorage.setItem("businessEmail", businessEmail.trim() || email);
      router.replace("/business/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to complete setup");
    } finally {
      setSubmitting(false);
    }
  }

  const stepTitle = step === 1 ? "Create your password" : "Legal & payment details";
  const stepSub =
    step === 1
      ? "Your email is confirmed. Set a password to create your official SlicePay account."
      : "We already have your business details from your application. Add tax ID, wallet, staff count, and addresses to finish.";

  return (
    <div className="fm-onboarding-page">
      <div className="ob-shell">
        <div className="ob-brand">
          <Link href="/">
            Slice<span>Pay</span>
          </Link>
          <span className="ob-step-label">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>

        <div className="ob-progress" aria-label="Signup progress">
          <Progress
            value={progressValue}
            className="h-1.5 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-[#3b9eff] [&>div]:to-[#2563eb]"
          />
        </div>

        <div className="ob-card">
          {loading ? (
            <div className="ob-loading">
              <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-[var(--ob-gold)]" />
              Loading your signup…
            </div>
          ) : (
            <>
              <h1 className="ob-title">{stepTitle}</h1>
              <p className="ob-sub">{stepSub}</p>

              {step === 1 && (
                <form onSubmit={handleCreateAccount} className="ob-grid">
                  <div className="ob-field">
                    <label htmlFor="ob-email">Email</label>
                    <input id="ob-email" type="email" value={email} readOnly disabled />
                  </div>
                  <div className="ob-field">
                    <label htmlFor="ob-password">Password</label>
                    <input
                      id="ob-password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="ob-field">
                    <label htmlFor="ob-confirm">Confirm password</label>
                    <input
                      id="ob-confirm"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="ob-actions">
                    <button type="submit" className="ob-btn ob-btn-primary" disabled={submitting || !token}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Create account
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleCompleteKyc} className="ob-grid">
                  {(needsPhone || !/^\+?[\d\s\-()]{10,}$/.test(phone.trim())) ? (
                    <div className="ob-field">
                      <label htmlFor="ob-phone">Phone</label>
                      <input
                        id="ob-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 555 000 0000"
                        required
                      />
                    </div>
                  ) : null}

                  <div className="ob-field">
                    <label htmlFor="ob-tax">Business tax or registration ID</label>
                    <input
                      id="ob-tax"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="ob-field">
                    <label htmlFor="ob-wallet">Solana wallet</label>
                    <input
                      id="ob-wallet"
                      value={solanaWallet}
                      onChange={(e) => setSolanaWallet(e.target.value)}
                      placeholder="Base58 public key"
                      required
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </div>
                  <div className="ob-field">
                    <label htmlFor="ob-staff">Number of staff</label>
                    <input
                      id="ob-staff"
                      type="number"
                      min={0}
                      step={1}
                      value={staffCount}
                      onChange={(e) => setStaffCount(e.target.value)}
                      required
                    />
                  </div>

                  <p className="ob-section-title">Business registration address</p>
                  <div className="ob-field">
                    <label htmlFor="ob-reg-street">Street</label>
                    <input
                      id="ob-reg-street"
                      value={registeredAddress.street}
                      onChange={(e) => updateRegistered("street", e.target.value)}
                      required
                    />
                  </div>
                  <div className="ob-grid-2">
                    <div className="ob-field">
                      <label htmlFor="ob-reg-city">City</label>
                      <input
                        id="ob-reg-city"
                        value={registeredAddress.city}
                        onChange={(e) => updateRegistered("city", e.target.value)}
                        required
                      />
                    </div>
                    <div className="ob-field">
                      <label htmlFor="ob-reg-state">State</label>
                      <input
                        id="ob-reg-state"
                        value={registeredAddress.state}
                        onChange={(e) => updateRegistered("state", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="ob-grid-2">
                    <div className="ob-field">
                      <label htmlFor="ob-reg-zip">Postal / ZIP</label>
                      <input
                        id="ob-reg-zip"
                        value={registeredAddress.zipCode}
                        onChange={(e) => updateRegistered("zipCode", e.target.value)}
                        required
                      />
                    </div>
                    <div className="ob-field">
                      <label htmlFor="ob-reg-country">Country</label>
                      <input
                        id="ob-reg-country"
                        value={registeredAddress.country}
                        onChange={(e) => updateRegistered("country", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-2">
                    <p className="ob-section-title" style={{ margin: 0 }}>
                      Billing address
                    </p>
                    <button
                      type="button"
                      className="ob-btn-link"
                      onClick={autofillBillingFromBusiness}
                    >
                      Same as business address
                    </button>
                  </div>
                  <div className="ob-field">
                    <label htmlFor="ob-bill-street">Street</label>
                    <input
                      id="ob-bill-street"
                      value={billingAddress.street}
                      onChange={(e) => updateBilling("street", e.target.value)}
                      required
                    />
                  </div>
                  <div className="ob-grid-2">
                    <div className="ob-field">
                      <label htmlFor="ob-bill-city">City</label>
                      <input
                        id="ob-bill-city"
                        value={billingAddress.city}
                        onChange={(e) => updateBilling("city", e.target.value)}
                        required
                      />
                    </div>
                    <div className="ob-field">
                      <label htmlFor="ob-bill-state">State</label>
                      <input
                        id="ob-bill-state"
                        value={billingAddress.state}
                        onChange={(e) => updateBilling("state", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="ob-grid-2">
                    <div className="ob-field">
                      <label htmlFor="ob-bill-zip">Postal / ZIP</label>
                      <input
                        id="ob-bill-zip"
                        value={billingAddress.zipCode}
                        onChange={(e) => updateBilling("zipCode", e.target.value)}
                        required
                      />
                    </div>
                    <div className="ob-field">
                      <label htmlFor="ob-bill-country">Country</label>
                      <input
                        id="ob-bill-country"
                        value={billingAddress.country}
                        onChange={(e) => updateBilling("country", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="ob-actions">
                    <button
                      type="button"
                      className="ob-btn ob-btn-ghost"
                      onClick={() => setStep(1)}
                      disabled={submitting}
                    >
                      Back
                    </button>
                    <button type="submit" className="ob-btn ob-btn-primary" disabled={submitting}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Finish setup
                    </button>
                  </div>
                </form>
              )}

              {error ? <div className="ob-error">{error}</div> : null}

              {!token && !loading ? (
                <p className="ob-sub" style={{ marginTop: 20, marginBottom: 0 }}>
                  Need to apply again?{" "}
                  <Link href={businessSignupPath} className="ob-btn-link">
                    Start founding merchant signup
                  </Link>
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
