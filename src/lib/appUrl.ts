/** Marketing site on GitHub Pages. */
export const MARKETING_SITE_ORIGIN = "https://slicechain.io";

/** Live demo app — portals, logins, dashboards (self-hosted via Cloudflare tunnel). */
export const DEMO_APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://app.slicechain.io";

const MARKETING_HOSTS = new Set(["slicechain.io", "www.slicechain.io"]);

function isMarketingHost(hostname: string): boolean {
  return MARKETING_HOSTS.has(hostname);
}

function isGithubPagesBuild(): boolean {
  // Client bundles only see NEXT_PUBLIC_* — also accept GITHUB_PAGES when inlined at build.
  return (
    process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" ||
    process.env.GITHUB_PAGES === "true"
  );
}

/**
 * Resolve URL for app routes (portal, login, dashboards, Try Demo).
 * Marketing / Pages builds must always deep-link to app.slicechain.io.
 * Trailing slashes are stripped — the app server does not use trailingSlash.
 */
export function appUrl(path: string): string {
  let normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  if (isGithubPagesBuild()) {
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

/**
 * Link to the public marketing site (slicechain.io on GitHub Pages).
 * Adds a trailing slash for path pages so crawlers avoid 301 redirects
 * from GitHub Pages `trailingSlash: true` exports.
 */
export function marketingUrl(path = ""): string {
  if (!path || path === "/") return `${MARKETING_SITE_ORIGIN}/`;
  let normalized = path.startsWith("/") ? path : `/${path}`;
  if (!normalized.includes("?") && !normalized.includes("#") && !normalized.endsWith("/")) {
    normalized = `${normalized}/`;
  }
  return `${MARKETING_SITE_ORIGIN}${normalized}`;
}
