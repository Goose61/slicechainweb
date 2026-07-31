export const beyondTheSwipePath = "/beyond-the-swipe/";

export const beyondOgImage = "/beyond-the-swipe/og.png";

export const beyondAudiences = [
  "Investor",
  "Merchant",
  "Partner",
  "Developer",
  "Media",
] as const;

export type BeyondAudience = (typeof beyondAudiences)[number];

export const beyondContent = {
  edition: "Special Founder's Edition",
  sectionIndex: "01 · Founder's Brief",
  titleLines: ["Beyond", "the Swipe"],
  subtitle: "The Merchant Infrastructure Race for Programmable Commerce",
  thesis:
    "Stablecoins solved digital value transfer. The merchant operating layer remains fragmented.",
  description:
    "Discover why the next payment-infrastructure opportunity may not be another wallet, token or gateway—but the operating layer connecting checkout, stablecoin settlement, e-commerce, rewards and merchant intelligence.",
  briefInsideTitle: "Inside the Founder's Brief",
  briefItems: [
    "The global digital-commerce and stablecoin market architecture",
    "Where SlicePay® fits within the emerging payment stack",
    "How SlicePay differs from payment gateways and stablecoin APIs",
    "Why Africa represents a compelling proving ground",
    "Network effects, merchant economics and the institutional proof agenda",
    "Analysis supported by 12 original sources",
  ],
  evidenceLine: "Global perspective. Evidence before hype.",
  formTitle: "Get the full brief",
  formBadge: "Complimentary",
  submitLabel: "Send me the Founder's Brief",
  privacyNote:
    "By requesting the report, you agree to receive the report by email.",
  updatesOptIn:
    "Also send me occasional SliceChain research and product updates.",
  successMessage:
    "Thank you. Check your inbox — we sent you a link to download the Founder's Brief.",
  valueStrip: [
    { label: "Global architecture", detail: "Commerce + settlement" },
    { label: "SlicePay thesis", detail: "Merchant operating layer" },
    { label: "Africa", detail: "Compelling proving ground" },
    { label: "12 sources", detail: "Evidence-led analysis" },
  ],
  previewEdition: "Special Founder's Edition",
  previewTopic:
    "The Merchant Infrastructure Race for Programmable Commerce",
};

export const landingBeyondPromo = {
  eyebrow: "Founder's Brief",
  title: "Beyond the Swipe",
  body:
    "Read the Special Founder's Edition research brief on merchant infrastructure for programmable commerce — stablecoin settlement, the operating layer, and where SlicePay fits in the stack.",
  ctaPage: "Explore the brief",
  ctaForm: "Email me the PDF",
};
