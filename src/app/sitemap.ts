import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/content/seo-metadata";

const publicPaths = [
  "",
  "website-pay-widget/",
  "contact/",
  "terms/",
  "privacy/",
  "portal/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-29");

  return publicPaths.map((path) => ({
    url: `${SITE_ORIGIN}/${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "website-pay-widget/" ? 0.9 : 0.6,
  }));
}
