import type { Metadata } from "next";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.vendorPayment;

export default function VendorPaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
