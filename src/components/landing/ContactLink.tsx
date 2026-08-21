"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { social } from "@/content/landing-content";

type ContactLinkProps = {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
};

/**
 * Renders the contact email without ever placing the literal address in the
 * server-rendered HTML. Cloudflare Email Obfuscation only rewrites addresses it
 * finds in the HTML response, so deferring assembly to the client keeps
 * email-decode.min.js out of the landing page's critical request chain.
 */
export function ContactLink({ className, children, onClick }: ContactLinkProps) {
  const [href, setHref] = useState<string | undefined>(undefined);

  useEffect(() => {
    setHref(`mailto:${social.emailUser}@${social.emailDomain}`);
  }, []);

  const handleClick = () => {
    if (!href) {
      window.location.href = `mailto:${social.emailUser}@${social.emailDomain}`;
    }
    onClick?.();
  };

  // When no explicit label is provided, show the address in a CF-safe form
  // pre-hydration, then swap to the real address once the client takes over.
  const label = children ?? (href ? `${social.emailUser}@${social.emailDomain}` : `${social.emailUser} [at] ${social.emailDomain}`);

  return (
    <a className={className} href={href} onClick={handleClick}>
      {label}
    </a>
  );
}
