import type { Metadata } from "next";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.customerLogin;

export default function CustomerLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
