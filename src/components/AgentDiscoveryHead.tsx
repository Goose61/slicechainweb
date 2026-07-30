/**
 * RFC 8288 Link tags for agent discovery (HTML fallback when response headers
 * are not set by the origin - e.g. GitHub Pages). Cloudflare Transform Rules
 * or the slicechain-agent-discovery worker should also set Link headers.
 */
export function AgentDiscoveryHead() {
  const links = [
    { rel: "api-catalog", href: "/.well-known/api-catalog" },
    { rel: "describedby", href: "/.well-known/agent-skills/index.json" },
    { rel: "service-doc", href: "/llms.txt" },
    { rel: "service-doc", href: "/website-pay-widget/" },
    { rel: "help", href: "/auth.md" },
  ];

  return (
    <>
      {links.map((link) => (
        <link key={`${link.rel}-${link.href}`} rel={link.rel} href={link.href} />
      ))}
    </>
  );
}
