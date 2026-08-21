export const greenerCaseStudyPath = "/greener/";

export const greenerPdfPath = "/greener/SliceChain_Green_Initiative_Case_Study.pdf";

export const greenerAudiences = [
  "Investor",
  "Merchant",
  "Partner",
  "Developer",
  "Media",
  "Sustainability",
] as const;

export type GreenerAudience = (typeof greenerAudiences)[number];

export const greenerContent = {
  pageTitle: "THE GREENER CHECKOUT - Green Initiative Case Study",
  edition: "Founder's Edition",
  sectionIndex: "02 · Green Checkout Case Study",
  titleLines: ["The Hidden", "Receipt"],
  subtitle: "Every payment leaves a financial receipt — and an environmental one.",
  thesis:
    "We only see the first. The second is spread across plastic, paper, terminals, data centers and settlement layers.",
  description:
    "SlicePay turns QR, POS and web checkout into stablecoin settlement, loyalty and staff rewards — while making the environmental footprint of commerce visible, measurable and improvable.",
  briefInsideTitle: "Inside the case study",
  briefItems: [
    "End-to-end design target vs. Visa operational energy allocation per transaction",
    "TradFi lifecycle carbon vs. optimized digital payment architecture",
    "Why programmable rails create the raw material for per-payment accountability",
    "SlicePay's 1.9% unified fee with stablecoin settlement and merchant outcomes",
    "Directional evidence on Solana network energy and SlicePay design budget",
    "Roadmap from telemetry today to verified CO₂e receipts tomorrow",
  ],
  evidenceLine: "Directional research brief. Product-level lifecycle assessment proposed.",
  formTitle: "Get the full case study",
  formBadge: "Complimentary",
  submitLabel: "Send me the case study",
  privacyNote:
    "By requesting the report, you agree to receive the case study by email.",
  updatesOptIn:
    "Also send me occasional SliceChain research and product updates.",
  successMessage:
    "Thank you. Check your inbox — we sent you a link to download the Green Initiative case study.",
  valueStrip: [
    { label: "Solana rail", detail: "0.00412 Wh / tx" },
    { label: "vs Visa ops", detail: "~241× lower allocation" },
    { label: "SlicePay fee", detail: "1.9% total" },
    { label: "Digital vs card", detail: "0.74 g vs 2.45 g lifecycle" },
  ],
  previewEdition: "Green Initiative Case Study",
  previewTopic: "The Greener Checkout — payment footprint made visible",
};

export const landingGreenerPromo = {
  eyebrow: "Green Initiative",
  title: "The Greener Checkout",
  body:
    "Read how SlicePay connects efficient stablecoin settlement with a new layer of payment accountability — the hidden environmental receipt behind every transaction.",
  ctaPage: "Explore the case study",
  ctaForm: "Email me the PDF",
};
