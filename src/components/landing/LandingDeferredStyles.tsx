"use client";

import { useEffect } from "react";

type LandingDeferredStylesProps = {
  href: string;
};

export function LandingDeferredStyles({ href }: LandingDeferredStylesProps) {
  useEffect(() => {
    const existing = document.querySelector<HTMLLinkElement>(`link[data-landing-bundle="true"]`);
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.media = "all";
    link.dataset.landingBundle = "true";
    document.head.appendChild(link);
  }, [href]);

  return (
    <>
      <link rel="preload" href={href} as="style" />
      <noscript>
        <link rel="stylesheet" href={href} />
      </noscript>
    </>
  );
}
