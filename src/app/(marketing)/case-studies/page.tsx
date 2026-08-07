import type { Metadata } from "next";
import { CaseStudiesPage } from "@/components/case-studies/CaseStudiesPage";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.caseStudies;

export default function CaseStudiesRoute() {
  return <CaseStudiesPage />;
}
