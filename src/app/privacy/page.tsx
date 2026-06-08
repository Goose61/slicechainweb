import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { legalMeta, privacyPolicy } from "@/content/legal-content";

export const metadata: Metadata = {
  title: `Privacy Policy · ${legalMeta.product}`,
  description: `How ${legalMeta.company} collects, uses, and protects personal information on ${legalMeta.product}.`,
};

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      title={privacyPolicy.title}
      lastUpdated={privacyPolicy.lastUpdated}
      sections={privacyPolicy.sections}
    />
  );
}
