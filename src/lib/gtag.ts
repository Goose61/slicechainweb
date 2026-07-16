export const GA_MEASUREMENT_ID = "G-9B6C109SRW";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Send a page_view on client-side route changes (per GA4 gtag config docs). */
export function pageview(url: string) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}
