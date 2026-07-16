/** Marketing site on GitHub Pages. */
export const MARKETING_SITE_ORIGIN = "https://slicechain.io";

/** Live demo app — portals, logins, dashboards (self-hosted via Cloudflare tunnel). */
export const DEMO_APP_ORIGIN = "https://app.slicechain.io";

const MARKETING_HOSTS = new Set(["slicechain.io", "www.slicechain.io"]);

function isMarketingHost(hostname: string): boolean {
  return MARKETING_HOSTS.has(hostname);
}

/**
 * Resolve URL for app routes (portal, login, dashboards).
 * - GitHub Pages build → always app.slicechain.io
 * - slicechain.io / www at runtime → app.slicechain.io
 * - app.slicechain.io / localhost → same-origin relative path
 */
export function appUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (process.env.GITHUB_PAGES === "true") {
    return `${DEMO_APP_ORIGIN}${normalized}`;
  }

  if (typeof window !== "undefined" && isMarketingHost(window.location.hostname)) {
    return `${DEMO_APP_ORIGIN}${normalized}`;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}${normalized}`;
  }

  return normalized;
}

export function shouldRedirectToDemoApp(): boolean {
  if (typeof window === "undefined") return false;
  return isMarketingHost(window.location.hostname);
}

/** Link to the public marketing site (slicechain.io on GitHub Pages). */
export function marketingUrl(path = ""): string {
  const normalized = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `${MARKETING_SITE_ORIGIN}${normalized}`;
}
