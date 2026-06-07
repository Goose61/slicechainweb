import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SlicePay Portal",
  description: "Employee and business portals for SlicePay — Solana USDC payments and commissions.",
  icons: {
    icon: "/landing-assets/images/pizza/pizzaimages/main_logo.png",
    apple: "/landing-assets/images/pizza/pizzaimages/main_logo.png",
  },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
