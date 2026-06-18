import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { pageSeo } from "@/content/seo-metadata";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { LandingDeferredStyles } from "@/components/landing/LandingDeferredStyles";

const criticalCss = readFileSync(join(process.cwd(), "src/styles/landing-critical.css"), "utf8");

export const metadata: Metadata = {
  ...pageSeo.home,
  icons: {
    icon: "/landing-assets/images/pizza/pizzaimages/main_logo.png",
    apple: "/landing-assets/images/pizza/pizzaimages/main_logo.png",
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing-page" data-landing-root>
      <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      <LandingDeferredStyles href="/landing-assets/css/landing.bundle.css" />
      <SeoStructuredData />
      {children}
    </div>
  );
}
