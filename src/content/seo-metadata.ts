import type { Metadata } from "next";

const siteUrl = "https://slicechain.io";

function buildPageSeo(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: "SlicePay",
      type: "website",
    },
  };
}

export const pageSeo = {
  home: buildPageSeo(
    "SlicePay | Crypto Payment Gateway for Small Business",
    "SlicePay is a crypto payment gateway for restaurants and retailers. Accept cryptocurrency payments via QR codes, USDC payments for business, and multi-chain settlement.",
  ),
  privacy: buildPageSeo(
    "Privacy Policy | SlicePay Crypto Payment Platform",
    "How SlicePay collects and protects data when you use our crypto payment gateway, blockchain payment processor, and USDC payments for business.",
  ),
  terms: buildPageSeo(
    "Terms of Service | SlicePay Crypto Payment Gateway",
    "Terms for using SlicePay to accept cryptocurrency payments, QR code crypto checkout, and multi-chain USDC settlement for your business.",
  ),
  portal: buildPageSeo(
    "SlicePay Portal | Business & Employee Crypto Login",
    "Access the SlicePay portal to accept cryptocurrency payments, generate QR code crypto payments, and manage USDC payouts for your business.",
  ),
  businessLogin: buildPageSeo(
    "Business Login | SlicePay Crypto Payment Gateway",
    "Sign in to your SlicePay business dashboard to accept cryptocurrency payments, track USDC settlements, and manage QR code crypto checkout.",
  ),
  businessSignup: buildPageSeo(
    "Business Sign Up | Accept Crypto Payments | SlicePay",
    "Register your business on SlicePay to accept cryptocurrency payments, enable QR code crypto payments, and receive USDC payments for business.",
  ),
  customerLogin: buildPageSeo(
    "Customer Login | SlicePay Crypto Payments & Rewards",
    "Sign in to your SlicePay customer account to track SLICE rewards, view crypto payment history, and manage your wallet-linked profile.",
  ),
  customerRegister: buildPageSeo(
    "Create Account | SlicePay Crypto Payment Rewards",
    "Join SlicePay to earn SLICE rewards when you pay with crypto at partner merchants using our blockchain payment processor checkout.",
  ),
  employeeLogin: buildPageSeo(
    "Employee Login | QR Code Crypto Payments | SlicePay",
    "Employee portal login to generate QR code crypto payments, facilitate USDC checkout, and earn commission on every SlicePay sale.",
  ),
  employeeSignup: buildPageSeo(
    "Employee Sign Up | SlicePay QR Payment Portal",
    "Register as a SlicePay employee to generate QR code crypto payments and earn USDC commission when customers pay with crypto.",
  ),
  vendorPayment: buildPageSeo(
    "QR Payment Generator | SlicePay Crypto Checkout",
    "Generate SlicePay QR code crypto payments for customers. Accept cryptocurrency payments and USDC checkout from any supported wallet.",
  ),
};
