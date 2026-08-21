import type { Metadata } from "next";
import { GreenInitiativePage } from "@/components/greener/GreenInitiativePage";
import { GreenerStructuredData } from "@/components/greener/GreenerStructuredData";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.greenerCaseStudy;

export default function GreenerCaseStudyRoute() {
  return (
    <>
      <GreenerStructuredData />
      <GreenInitiativePage />
    </>
  );
}
