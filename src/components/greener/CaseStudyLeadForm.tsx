"use client";

import { FormEvent, useState } from "react";
import { foundersBriefApi, type CaseStudyBriefType } from "@/lib/api";

export interface CaseStudyFormContent {
  formTitle: string;
  formBadge: string;
  submitLabel: string;
  privacyNote: string;
  updatesOptIn: string;
  successMessage: string;
}

interface Props {
  audiences: readonly string[];
  content: CaseStudyFormContent;
  briefType: CaseStudyBriefType;
  source?: string;
  showHeading?: boolean;
  onSuccess?: () => void;
}

export function CaseStudyLeadForm({
  audiences,
  content,
  briefType,
  source,
  showHeading = true,
  onSuccess,
}: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [audience, setAudience] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!audience) {
      setError("Please select how you're interested.");
      return;
    }

    setLoading(true);
    try {
      await foundersBriefApi.request({
        firstName: firstName.trim(),
        email: email.trim(),
        audience,
        marketingOptIn,
        briefType,
        source,
      });
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bts-form-wrap">
        <p className="bts-success" role="status">
          {content.successMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="bts-form-wrap">
      {showHeading && (
        <div className="bts-form-heading">
          <h2>{content.formTitle}</h2>
          <span className="bts-free-badge">{content.formBadge}</span>
        </div>
      )}

      <form className="bts-form" onSubmit={handleSubmit}>
        <div className="bts-form-grid">
          <label>
            First name
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              placeholder="Your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            I&apos;m interested as
            <select
              name="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              required
            >
              <option value="" disabled>
                Select one
              </option>
              {audiences.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button className="bts-submit" type="submit" disabled={loading}>
            {loading ? "Sending…" : `${content.submitLabel} →`}
          </button>
        </div>

        <p className="bts-privacy">{content.privacyNote}</p>

        <label className="bts-opt-in">
          <input
            type="checkbox"
            name="updates"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
          />
          <span>{content.updatesOptIn}</span>
        </label>

        {error && <p className="bts-form-error" role="alert">{error}</p>}
      </form>
    </div>
  );
}
