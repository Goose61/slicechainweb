import type { Metadata } from "next";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.businessLogin;

export default function BusinessLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
