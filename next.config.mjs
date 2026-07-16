/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === "true";

// Public Turnstile site key — safe to embed at build time (secret stays server-side)
const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
  process.env.TURNSTILE_SITE_KEY ||
  "";

// Turnstile uses regional challenge hosts (e.g. brunhild.challenges.cloudflare.com).
const turnstileOrigins = "https://challenges.cloudflare.com https://*.challenges.cloudflare.com";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-site",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${turnstileOrigins} https://static.cloudflareinsights.com https://www.googletagmanager.com`,
      `script-src-elem 'self' 'unsafe-inline' ${turnstileOrigins} https://static.cloudflareinsights.com https://www.googletagmanager.com`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com ${turnstileOrigins}`,
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https:",
      `connect-src 'self' http://localhost:7000 https://api.slicechain.io ${turnstileOrigins} https://cloudflareinsights.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://www.googletagmanager.com`,
      `frame-src 'self' ${turnstileOrigins}`,
      `child-src ${turnstileOrigins}`,
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

// Base configuration shared across BOTH development and production environments
const baseConfig = {
  env: {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: turnstileSiteKey,
    NEXT_PUBLIC_MARKETING_SITE_URL: process.env.NEXT_PUBLIC_MARKETING_SITE_URL || "https://slicechain.io",
  },
  images: {
    unoptimized: true, // Always safe, essential for GitHub Pages static images
  },
};

const nextConfig = isGhPages
  ? {
      ...baseConfig,
      output: "export",      // Required for static HTML export
      trailingSlash: true,   // Essential for clean URL routing on GitHub Pages
    }
  : {
      ...baseConfig,
      async redirects() {
        const marketing = process.env.NEXT_PUBLIC_MARKETING_SITE_URL || "https://slicechain.io";
        const hostMatch = [{ type: "host", value: "app.slicechain.io" }];
        return [
          { source: "/landing", destination: `${marketing}/`, permanent: false, has: hostMatch },
          { source: "/terms", destination: `${marketing}/terms/`, permanent: false, has: hostMatch },
          { source: "/privacy", destination: `${marketing}/privacy/`, permanent: false, has: hostMatch },
        ];
      },
      async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";
        return [
          {
            source: "/api/:path*",
            destination: `${apiUrl}/api/:path*`,
          },
        ];
      },
      async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
      },
    };

export default nextConfig;

