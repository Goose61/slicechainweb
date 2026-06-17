import type { Metadata } from "next";

export const SITE_ORIGIN = "https://slicechain.io";

export const SITE_TITLE_DEFAULT =
  "Slice Chain & SlicePay | Crypto Payment Gateway for Small Business";

export const SITE_TITLE_TEMPLATE = "%s | Slice Chain · SlicePay";

export const SITE_DESCRIPTION =
  "Slice Chain powers SlicePay (Slice Pay), a crypto payment gateway for restaurants and retailers. Accept cryptocurrency payments via QR codes, USDC settlement, and multi-chain checkout.";

export const SITE_KEYWORDS = [
  "Slice Chain",
  "SliceChain",
  "SlicePay",
  "Slice Pay",
  "crypto payment gateway",
  "accept cryptocurrency payments",
  "QR code crypto payments",
  "USDC payments for business",
  "blockchain payment processor",
  "multi-chain crypto payments",
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
    description: SITE_DESCRIPTION,
    openGraph: {
      title: SITE_TITLE_DEFAULT,
      description: SITE_DESCRIPTION,
      url: SITE_ORIGIN,
      siteName: "Slice Chain · SlicePay",
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
    "Access the SlicePay portal by Slice Chain to accept cryptocurrency payments, generate QR code crypto payments, and manage USDC payouts for your business.",
  ),
  businessLogin: buildPageSeo(
    "Business Login",
    "Sign in to your SlicePay business dashboard to accept cryptocurrency payments, track USDC settlements, and manage QR code crypto checkout.",
  ),
  businessSignup: buildPageSeo(
    "Business Sign Up",
    "Register your business on SlicePay by Slice Chain to accept cryptocurrency payments, enable QR code crypto payments, and receive USDC payments for business.",
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
    "Generate SlicePay QR code crypto payments for customers. Accept cryptocurrency payments and USDC checkout from any supported wallet.",
  ),
};
