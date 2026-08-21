const greenerStructuredData = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": "https://slicechain.io/greener/#article",
  headline: "The Greener Checkout — Green Initiative Case Study",
  alternativeHeadline: "The Hidden Receipt",
  description:
    "Every payment leaves a financial receipt and an environmental one. This case study examines stablecoin settlement efficiency and payment environmental footprint accountability.",
  url: "https://slicechain.io/greener/",
  datePublished: "2026-08-07",
  dateModified: "2026-08-07",
  author: {
    "@type": "Organization",
    name: "SliceChain Holdings Inc.",
    url: "https://slicechain.io",
  },
  publisher: {
    "@type": "Organization",
    name: "SliceChain Holdings Inc.",
    logo: {
      "@type": "ImageObject",
      url: "https://slicechain.io/landing-assets/images/pizza/pizzaimages/main_logo.png",
    },
  },
  about: [
    { "@type": "Thing", name: "Sustainable payments" },
    { "@type": "Thing", name: "Stablecoin checkout" },
    { "@type": "Thing", name: "Payment carbon footprint" },
  ],
  isAccessibleForFree: true,
  keywords: "green payments, sustainable checkout, Solana energy, payment environmental footprint",
};

export function GreenerStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(greenerStructuredData) }}
    />
  );
}
