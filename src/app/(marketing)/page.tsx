import { LandingPage } from "@/components/landing/LandingPage";

/**
 * Marketing home — must stay static-exportable for GitHub Pages.
 * app.slicechain.io `/` → marketing redirect lives in next.config.mjs.
 */
export default function HomePage() {
  return <LandingPage />;
}
