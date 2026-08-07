import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/content/seo-metadata";

const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "PerplexityBot",
  "Applebot-Extended",
  "cohere-ai",
];

const PUBLIC_ALLOW = [
  "/",
  "/beyond-the-swipe/",
  "/greener/",
  "/case-studies/",
  "/website-pay-widget/",
  "/contact/",
  "/terms/",
  "/privacy/",
  "/llms.txt",
  "/auth.md",
  "/index.md",
  "/website-pay-widget.md",
  "/.well-known/",
];

export default function robots(): MetadataRoute.Robots {
  const disallowPrivate = [
    "/admin/",
    "/business/dashboard/",
    "/business/demo/",
    "/customer/dashboard/",
    "/employee/dashboard/",
    "/transactions/",
    "/vendor-payment/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: PUBLIC_ALLOW,
        disallow: disallowPrivate,
      },
      ...AI_AGENTS.map((agent) => ({
        userAgent: agent,
        allow: PUBLIC_ALLOW,
        disallow: disallowPrivate,
      })),
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
