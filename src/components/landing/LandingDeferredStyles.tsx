type LandingDeferredStylesProps = {
  href: string;
};

/** Load landing CSS in HTML — not after hydration — so mobile layout is correct on first paint. */
export function LandingDeferredStyles({ href }: LandingDeferredStylesProps) {
  return (
    <>
      <link rel="preload" href={href} as="style" />
      <link rel="stylesheet" href={href} data-landing-bundle="true" />
    </>
  );
}
