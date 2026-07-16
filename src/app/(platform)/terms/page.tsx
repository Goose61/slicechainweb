import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { termsAndConditions } from "@/content/legal-content";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.terms;

export default function TermsPage() {
  return (
    <LegalDocumentPage
      title={termsAndConditions.title}
      lastUpdated={termsAndConditions.lastUpdated}
      sections={termsAndConditions.sections}
    />
  );
}
