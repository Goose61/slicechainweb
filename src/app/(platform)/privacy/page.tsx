import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { privacyPolicy } from "@/content/legal-content";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.privacy;

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      title={privacyPolicy.title}
      lastUpdated={privacyPolicy.lastUpdated}
      sections={privacyPolicy.sections}
    />
  );
}
