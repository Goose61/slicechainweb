"use client";

import { useEffect, useState } from "react";
import { foundingMerchant } from "@/content/landing-content";
import { foundingMerchantApi } from "@/lib/api";
import { TermsConsentCheckbox } from "@/components/legal/TermsConsentCheckbox";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultVolume?: number;
  defaultTraditionalFee?: number;
  initialError?: string;
}

const BUSINESS_TYPES = [
  "Restaurant",
  "Retail",
  "Food Truck",
  "Service Business",
  "Other",
];

export function FoundingMerchantSignupModal({
  open,
  onClose,
  defaultVolume = 10000,
  defaultTraditionalFee = 0.035,
  initialError,
}: Props) {
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setError(initialError || "");
    }
  }, [open, initialError]);

  if (!open) return null;

  function validateForm(): string | null {
    if (!businessName.trim()) return "Business name is required.";
    if (!contactName.trim()) return "Contact name is required.";
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
    if (!businessType) return "Please select a business type.";
    if (!country.trim()) return "Country is required.";
    if (!acceptTerms) return "Please accept the Terms and Privacy Policy to continue.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await foundingMerchantApi.signup({
        businessName: businessName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        businessType,
        country: country.trim(),
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        monthlyVolume: defaultVolume,
        traditionalFeeRate: defaultTraditionalFee,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fm-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="fm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fm-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="fm-modal-close" onClick={onClose} aria-label="Close">
          <span className="fm-modal-close-icon" aria-hidden="true">×</span>
        </button>

        {submitted ? (
          <div className="fm-modal-success">
            <h2 id="fm-modal-title" className="display">Application received</h2>
            <p>
              We sent a confirmation email to <strong>{email}</strong>. Open it to confirm your address
              and secure your founding merchant spot. Our team at SlicePay will follow up soon.
            </p>
            <p className="fm-modal-hint mono">
              {foundingMerchant.availabilityNote}
            </p>
            <button type="button" className="btn btn-gold" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="fm-modal-head">
              <span className="eyebrow">Founding Merchant Program</span>
              <h2 id="fm-modal-title" className="display">{foundingMerchant.cta}</h2>
              <p>Join the first {foundingMerchant.maxSpots} businesses on SlicePay.</p>
            </div>

            <ul className="fm-modal-benefits">
              {foundingMerchant.benefits.slice(0, 6).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <form className="fm-modal-form" onSubmit={handleSubmit}>
              <div className="fm-form-grid">
                <label>
                  <span>Business name *</span>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    placeholder="Your business name"
                  />
                </label>
                <label>
                  <span>Contact name *</span>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    placeholder="Full name"
                  />
                </label>
                <label>
                  <span>Email *</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@business.com"
                  />
                </label>
                <label>
                  <span>Phone</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 000 0000"
                  />
                </label>
                <label>
                  <span>Business type *</span>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    required
                    className="fm-select"
                  >
                    <option value="">Select type</option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Country *</span>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    placeholder="United States"
                  />
                </label>
                <label>
                  <span>City</span>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                  />
                </label>
                <label>
                  <span>State / Province</span>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                  />
                </label>
              </div>

              <TermsConsentCheckbox
                checked={acceptTerms}
                onChange={setAcceptTerms}
                className="fm-terms"
                labelClassName="fm-terms-label"
              />

              {error && <p className="fm-form-error" role="alert">{error}</p>}

              <button type="submit" className="btn btn-gold fm-form-submit" disabled={loading}>
                {loading ? "Submitting…" : `${foundingMerchant.cta} →`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
