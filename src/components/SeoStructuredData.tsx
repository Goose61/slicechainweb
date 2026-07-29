const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://slicechain.io/#organization",
      name: "SliceChain Holdings Inc.",
      alternateName: ["SliceChain", "Slice Chain", "SlicePay", "Slice Pay"],
      description:
        "Slice Chain builds SlicePay, a crypto payment gateway for crypto payments, multi chain payments, and crypto payments for businesses.",
      url: "https://slicechain.io",
      logo: "https://slicechain.io/landing-assets/images/pizza/pizzaimages/main_logo.png",
      email: "slicepay@slicechain.io",
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "slicepay@slicechain.io",
          url: "https://slicechain.io/contact/",
          availableLanguage: ["English"],
        },
      ],
      sameAs: [
        "https://x.com/slice__pay",
        "https://t.me/+PrL-wbxrW39kODBk",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://slicechain.io/#website",
      name: "Slice Chain & SlicePay",
      alternateName: ["SliceChain", "Slice Chain", "SlicePay", "Slice Pay"],
      description:
        "Accept crypto payments for businesses with QR checkout, website pay widget, stablecoin payments, and multi chain payments across supported blockchains.",
      url: "https://slicechain.io",
      publisher: { "@id": "https://slicechain.io/#organization" },
      dateModified: "2026-07-29",
    },
    {
      "@type": "TechArticle",
      "@id": "https://slicechain.io/website-pay-widget/#article",
      headline: "Website Pay Widget — Integration Guide",
      description:
        "Embed SlicePay crypto checkout on any e-commerce website with embed.js, hosted checkout URLs, or server-side gateway invoices.",
      url: "https://slicechain.io/website-pay-widget/",
      datePublished: "2026-07-29",
      dateModified: "2026-07-29",
      author: {
        "@type": "Organization",
        name: "SlicePay Developer Relations",
        parentOrganization: { "@id": "https://slicechain.io/#organization" },
      },
      publisher: { "@id": "https://slicechain.io/#organization" },
      about: {
        "@type": "SoftwareApplication",
        name: "SlicePay Website Pay Widget",
        applicationCategory: "PaymentGateway",
        operatingSystem: "Web",
      },
    },
  ],
};

export function SeoStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
