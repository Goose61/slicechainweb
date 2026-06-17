import type { Metadata } from "next";
import { pageSeo } from "@/content/seo-metadata";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import "leaflet/dist/leaflet.css";
import "@/styles/landing-menos-gusto.css";
import "@/styles/landing-inline.css";

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
      <SeoStructuredData />
      {children}
    </div>
  );
}
