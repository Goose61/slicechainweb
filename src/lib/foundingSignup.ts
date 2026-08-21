/** Shared founding-merchant signup deep link helpers. */

export const FOUNDING_SIGNUP_EVENT = "slicepay:founding-signup";
export const FOUNDING_SIGNUP_PARAM = "founding-signup";
export const FOUNDING_SIGNUP_HASH = "#founding-merchant";

/** Campaign / attribution query keys to preserve through signup. */
const CAMPAIGN_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
  "ref",
  "source",
] as const;

export function getPreservedCampaignParams(
  search?: string | URLSearchParams
): URLSearchParams {
  const incoming =
    typeof search === "string"
      ? new URLSearchParams(search.startsWith("?") ? search : `?${search}`)
      : search
        ? new URLSearchParams(search)
        : typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : new URLSearchParams();

  const preserved = new URLSearchParams();
  for (const key of CAMPAIGN_PARAM_KEYS) {
    const value = incoming.get(key);
    if (value) preserved.set(key, value);
  }
  return preserved;
}

/**
 * Canonical registration destination used by every founding CTA.
 * Preserves campaign query params through the signup flow.
 */
export function buildFoundingSignupHref(search?: string | URLSearchParams): string {
  const params = getPreservedCampaignParams(search);
  params.set(FOUNDING_SIGNUP_PARAM, "1");
  const qs = params.toString();
  return `/?${qs}${FOUNDING_SIGNUP_HASH}`;
}

/** Open the founding signup modal on the landing page (progressive enhancement). */
export function requestFoundingSignupOpen() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FOUNDING_SIGNUP_EVENT));
}
