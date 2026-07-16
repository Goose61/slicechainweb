/** Public marketing site (GitHub Pages). */
export const MARKETING_SITE_ORIGIN =
  process.env.NEXT_PUBLIC_MARKETING_SITE_URL || "https://slicechain.io";

export function marketingUrl(path = ""): string {
  const normalized = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `${MARKETING_SITE_ORIGIN}${normalized}`;
}

export function isDemoAppHost(hostname: string): boolean {
  return hostname === "app.slicechain.io";
}

/** Home link — marketing site on demo app, local landing on localhost. */
export function homeUrl(): string {
  if (typeof window !== "undefined" && isDemoAppHost(window.location.hostname)) {
    return marketingUrl("/");
  }
  return "/";
}
