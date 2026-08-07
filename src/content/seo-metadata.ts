import type { Metadata } from "next";

export const SITE_ORIGIN = "https://slicechain.io";

export const SITE_TITLE_DEFAULT =
  "SlicePay | Global Crypto Payments Provider & Processor";

export const SITE_TITLE_TEMPLATE = "%s | SlicePay";

export const SITE_DESCRIPTION =
  "SlicePay is a global crypto payments provider and processor. In-store QR checkout, physical POS facilitation, and website pay widget with transparent pricing.";

export const SITE_KEYWORDS = [
  "Slice Chain",
  "SliceChain",
  "SlicePay",
  "Slice Pay",
  "crypto payments",
  "crypto payments for businesses",
  "cryptocurrency payments",
  "accept crypto payments",
  "accept cryptocurrency payments",
  "pay with crypto",
  "multi chain payments",
  "multi-chain payments",
  "multi-chain crypto payments",
  "cross-chain payments",
  "crypto payment gateway",
  "blockchain payment processor",
  "business crypto payments",
  "merchant crypto payments",
  "restaurant crypto payments",
  "small business crypto payments",
  "crypto checkout",
  "QR code payments",
  "QR code crypto payments",
  "stablecoin payments",
  "USDC payments",
  "USDC payments for business",
  "wallet crypto payments",
  "website pay widget",
  "e-commerce crypto checkout",
  "payment gateway embed",
];

export const siteSeoBase: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SITE_TITLE_DEFAULT,
    template: SITE_TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  openGraph: {
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    url: SITE_ORIGIN,
    siteName: "Slice Chain · SlicePay",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
};

function buildPageSeo(pageTitle: string, description: string): Metadata {
  const fullTitle = `${pageTitle} | Slice Chain · SlicePay`;
  return {
    title: pageTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: SITE_ORIGIN,
      siteName: "Slice Chain · SlicePay",
      type: "website",
    },
  };
}

export const pageSeo = {
  home: {
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    openGraph: {
      title: SITE_TITLE_DEFAULT,
      description: SITE_DESCRIPTION,
      url: SITE_ORIGIN,
      siteName: "SlicePay",
      type: "website",
    },
    alternates: {
      canonical: "/",
    },
  } satisfies Metadata,
  privacy: buildPageSeo(
    "Privacy Policy",
    "How Slice Chain and SlicePay collect and protect data when you use our crypto payment gateway, blockchain payment processor, and USDC payments for business.",
  ),
  terms: buildPageSeo(
    "Terms of Service",
    "Terms for using SlicePay by Slice Chain to accept cryptocurrency payments, QR code crypto checkout, and multi-chain USDC settlement for your business.",
  ),
  portal: buildPageSeo(
    "Portal",
    "Access the SlicePay portal for crypto payments and multi chain payments. Accept crypto payments for businesses, generate QR checkout, and manage USDC payouts.",
  ),
  businessLogin: buildPageSeo(
    "Business Login",
    "Sign in to your SlicePay dashboard for crypto payments for businesses - track USDC settlements, accept crypto payments, and manage QR code checkout.",
  ),
  businessSignup: buildPageSeo(
    "Business Sign Up",
    "Register your business to accept crypto payments for businesses on SlicePay. Enable multi chain payments, QR checkout, and USDC stablecoin payouts.",
  ),
  customerLogin: buildPageSeo(
    "Customer Login",
    "Sign in to your SlicePay customer account to track SLICE rewards, view crypto payment history, and manage your wallet-linked profile.",
  ),
  customerRegister: buildPageSeo(
    "Create Account",
    "Join Slice Pay rewards on SlicePay to earn SLICE when you pay with crypto at partner merchants using our blockchain payment processor checkout.",
  ),
  employeeLogin: buildPageSeo(
    "Employee Login",
    "Employee portal login to generate QR code crypto payments, facilitate USDC checkout, and earn commission on every SlicePay sale.",
  ),
  employeeSignup: buildPageSeo(
    "Employee Sign Up",
    "Register as a SlicePay employee to generate QR code crypto payments and earn USDC commission when customers pay with crypto.",
  ),
  vendorPayment: buildPageSeo(
    "QR Payment Generator",
    "Generate QR code payments for crypto checkout. Accept crypto payments and stablecoin payments from any supported wallet at your business.",
  ),
  websitePayWidget: {
    ...buildPageSeo(
      "Website Pay Widget Integration Guide",
      "Embed SlicePay on any website: script tag, hosted checkout, server-side invoices, postMessage confirmation, and multi-chain USDC settlement.",
    ),
    alternates: {
      canonical: "/website-pay-widget/",
    },
    openGraph: {
      title: "Website Pay Widget Integration Guide | Slice Chain · SlicePay",
      description:
        "Embed SlicePay on any website: script tag, hosted checkout, server-side invoices, postMessage confirmation, and multi-chain USDC settlement.",
      url: `${SITE_ORIGIN}/website-pay-widget/`,
      siteName: "Slice Chain · SlicePay",
      type: "article",
      publishedTime: "2026-07-29",
      modifiedTime: "2026-07-29",
      authors: ["SlicePay Developer Relations"],
    },
  } satisfies Metadata,
  contact: buildPageSeo(
    "Contact",
    "Contact SlicePay and Slice Chain for merchant support, website pay widget integration help, and crypto payment gateway questions.",
  ),
  beyondTheSwipe: {
    ...buildPageSeo(
      "Beyond the Swipe",
      "Request Beyond the Swipe, the Special Founder's Edition brief on merchant infrastructure for programmable commerce.",
    ),
    alternates: {
      canonical: "/beyond-the-swipe/",
    },
    openGraph: {
      title: "Beyond the Swipe | SlicePay®",
      description:
        "The Merchant Infrastructure Race for Programmable Commerce.",
      url: `${SITE_ORIGIN}/beyond-the-swipe/`,
      siteName: "Slice Chain · SlicePay",
      type: "website",
      images: [{ url: "/beyond-the-swipe/og.png", width: 1200, height: 630, alt: "Beyond the Swipe" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Beyond the Swipe | SlicePay®",
      description:
        "The Merchant Infrastructure Race for Programmable Commerce.",
      images: ["/beyond-the-swipe/og.png"],
    },
  } satisfies Metadata,
  greenerCaseStudy: {
    ...buildPageSeo(
      "The Greener Checkout",
      "Request the Green Initiative case study on payment environmental footprint, stablecoin settlement efficiency, and SlicePay's greener checkout vision.",
    ),
    keywords: [
      ...SITE_KEYWORDS,
      "green payments",
      "sustainable payments",
      "payment carbon footprint",
      "Solana energy efficiency",
      "stablecoin checkout",
      "environmental receipt",
    ],
    alternates: {
      canonical: "/greener/",
    },
    openGraph: {
      title: "The Greener Checkout | SlicePay® Green Initiative",
      description:
        "Every payment leaves a financial receipt — and an environmental one. Read the Green Initiative case study.",
      url: `${SITE_ORIGIN}/greener/`,
      siteName: "Slice Chain · SlicePay",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: "The Greener Checkout | SlicePay®",
      description:
        "The Hidden Receipt — making the environmental footprint of commerce visible, measurable and improvable.",
    },
  } satisfies Metadata,
  caseStudies: {
    ...buildPageSeo(
      "Case Studies",
      "Browse SlicePay research briefs and initiative reports — Beyond the Swipe on merchant infrastructure and The Greener Checkout on payment environmental footprint.",
    ),
    alternates: {
      canonical: "/case-studies/",
    },
    openGraph: {
      title: "Case Studies | SlicePay® Research",
      description:
        "Evidence-led briefs on programmable commerce, stablecoin settlement, and greener checkout.",
      url: `${SITE_ORIGIN}/case-studies/`,
      siteName: "Slice Chain · SlicePay",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Case Studies | SlicePay®",
      description:
        "Explore Beyond the Swipe and The Greener Checkout — complimentary SliceChain research PDFs.",
    },
  } satisfies Metadata,
};
