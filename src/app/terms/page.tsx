import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { legalMeta, termsAndConditions } from "@/content/legal-content";

export const metadata: Metadata = {
  title: `Terms and Conditions · ${legalMeta.product}`,
  description: `Terms governing use of ${legalMeta.product}, operated by ${legalMeta.company}.`,
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      title={termsAndConditions.title}
      lastUpdated={termsAndConditions.lastUpdated}
      sections={termsAndConditions.sections}
    />
  );
}
