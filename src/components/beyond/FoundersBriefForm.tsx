"use client";

import { FormEvent, useState } from "react";
import {
  beyondAudiences,
  beyondContent,
  type BeyondAudience,
} from "@/content/beyond-content";
import { foundersBriefApi } from "@/lib/api";

interface Props {
  source?: string;
  showHeading?: boolean;
  onSuccess?: () => void;
}

export function FoundersBriefForm({
  source = "beyond_the_swipe",
  showHeading = true,
  onSuccess,
}: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [audience, setAudience] = useState<BeyondAudience | "">("");
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
          {beyondContent.successMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="bts-form-wrap">
      {showHeading && (
        <div className="bts-form-heading">
          <h2>{beyondContent.formTitle}</h2>
          <span className="bts-free-badge">{beyondContent.formBadge}</span>
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
              onChange={(e) => setAudience(e.target.value as BeyondAudience)}
              required
            >
              <option value="" disabled>
                Select one
              </option>
              {beyondAudiences.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button className="bts-submit" type="submit" disabled={loading}>
            {loading ? "Sending…" : `${beyondContent.submitLabel} →`}
          </button>
        </div>

        <p className="bts-privacy">{beyondContent.privacyNote}</p>

        <label className="bts-opt-in">
          <input
            type="checkbox"
            name="updates"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
          />
          <span>{beyondContent.updatesOptIn}</span>
        </label>

        {error && <p className="bts-form-error" role="alert">{error}</p>}
      </form>
    </div>
  );
}
