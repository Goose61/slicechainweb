import type { Metadata } from "next";
import { landingMeta } from "@/content/landing-content";
import "leaflet/dist/leaflet.css";
import "@/styles/landing-menos-gusto.css";
import "@/styles/landing-inline.css";

export const metadata: Metadata = {
  title: landingMeta.title,
  description: landingMeta.description,
  icons: {
    icon: "/landing-assets/images/pizza/pizzaimages/main_logo.png",
    apple: "/landing-assets/images/pizza/pizzaimages/main_logo.png",
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing-page" data-landing-root>
      {children}
    </div>
  );
}
