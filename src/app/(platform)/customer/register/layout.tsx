import type { Metadata } from "next";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.customerRegister;

export default function CustomerRegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
