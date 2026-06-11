import type { Metadata } from "next";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.businessSignup;

export default function BusinessSignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
