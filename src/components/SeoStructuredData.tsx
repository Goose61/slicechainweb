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
        "Accept crypto payments for businesses with QR checkout, stablecoin payments, and multi chain payments across supported blockchains.",
      url: "https://slicechain.io",
      publisher: { "@id": "https://slicechain.io/#organization" },
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
