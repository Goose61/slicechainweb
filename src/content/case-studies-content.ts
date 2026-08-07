import { beyondTheSwipePath } from "@/content/beyond-content";
import { greenerCaseStudyPath } from "@/content/greener-content";

export const caseStudiesPath = "/case-studies/";

export type CaseStudyTheme = "blue" | "green";

export interface CaseStudyEntry {
  slug: string;
  path: string;
  index: string;
  edition: string;
  title: string;
  subtitle: string;
  excerpt: string;
  theme: CaseStudyTheme;
  highlights: string[];
  cta: string;
}

export const caseStudiesIndex = {
  pageTitle: "SlicePay Case Studies",
  sectionLabel: "Research & briefs",
  titleLines: ["Case", "Studies"],
  subtitle: "Evidence-led research on programmable commerce and greener checkout.",
  intro:
    "Explore SliceChain's founder briefs and initiative reports — complimentary PDFs on merchant infrastructure, stablecoin settlement, and the environmental footprint of payments.",
};

export const caseStudies: CaseStudyEntry[] = [
  {
    slug: "beyond-the-swipe",
    path: beyondTheSwipePath,
    index: "01",
    edition: "Founder's Edition",
    title: "Beyond the Swipe",
    subtitle: "The Merchant Infrastructure Race for Programmable Commerce",
    excerpt:
      "Why the next payment-infrastructure opportunity may be the operating layer connecting checkout, stablecoin settlement, e-commerce, rewards and merchant intelligence.",
    theme: "blue",
    highlights: [
      "Global digital-commerce architecture",
      "SlicePay merchant operating layer thesis",
      "Africa as a compelling proving ground",
    ],
    cta: "Read the brief",
  },
  {
    slug: "greener",
    path: greenerCaseStudyPath,
    index: "02",
    edition: "Green Initiative",
    title: "The Greener Checkout",
    subtitle: "The Hidden Receipt",
    excerpt:
      "Every payment leaves a financial receipt — and an environmental one. How programmable rails make the hidden footprint of commerce visible and improvable.",
    theme: "green",
    highlights: [
      "TradFi lifecycle carbon vs digital rails",
      "Solana energy vs Visa operational allocation",
      "Roadmap to verified CO₂e receipts",
    ],
    cta: "Read the case study",
  },
];
