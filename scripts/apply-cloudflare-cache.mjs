/**
 * Applies long-lived browser cache rules for static assets on slicechain.io.
 * GitHub Pages only sends max-age=14400; this overrides browser TTL at Cloudflare edge.
 *
 * Requires: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID
 * Run from CI after deploy or manually: node scripts/apply-cloudflare-cache.mjs
 */

const token = process.env.CLOUDFLARE_API_TOKEN;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;

if (!token || !zoneId) {
  console.log("apply-cloudflare-cache: skipped (CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID unset)");
  process.exit(0);
}

const phase = "http_request_cache_settings";
const base = `https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets`;

const rules = [
  {
    description: "Slice Chain — immutable Next.js build assets",
    expression: '(starts_with(http.request.uri.path, "/_next/static/"))',
    action: "set_cache_settings",
    action_parameters: {
      cache: true,
      edge_ttl: { mode: "override_origin", default: 31536000 },
      browser_ttl: { mode: "override_origin", default: 31536000 },
    },
  },
  {
    description: "Slice Chain — landing images and bundled CSS",
    expression: '(starts_with(http.request.uri.path, "/landing-assets/"))',
    action: "set_cache_settings",
    action_parameters: {
      cache: true,
      edge_ttl: { mode: "override_origin", default: 604800 },
      browser_ttl: { mode: "override_origin", default: 604800 },
    },
  },
];

async function api(path, init = {}) {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await res.json();
  if (!body.success) {
    throw new Error(JSON.stringify(body.errors || body));
  }
  return body;
}

async function main() {
  const entry = await api(`/phases/${phase}/entrypoint`);
  const rulesetId = entry.result?.id;

  const payload = {
    rules,
  };

  if (rulesetId) {
    await api(`/${rulesetId}`, { method: "PUT", body: JSON.stringify(payload) });
    console.log("apply-cloudflare-cache: updated existing cache ruleset");
  } else {
    await api(`/phases/${phase}/entrypoint`, {
      method: "PUT",
      body: JSON.stringify({ rules }),
    });
    console.log("apply-cloudflare-cache: created cache ruleset");
  }
}

main().catch((err) => {
  console.error("apply-cloudflare-cache: failed", err);
  process.exit(1);
});
