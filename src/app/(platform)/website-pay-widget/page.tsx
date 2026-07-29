import type { Metadata } from "next";
import { IntegrationGuidePage } from "@/components/docs/IntegrationGuidePage";
import { payWidgetGuide } from "@/content/pay-widget-content";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.websitePayWidget;

export default function WebsitePayWidgetGuidePage() {
  return (
    <IntegrationGuidePage
      title={payWidgetGuide.title}
      description={payWidgetGuide.description}
      lastUpdated={payWidgetGuide.lastUpdated}
      author={payWidgetGuide.author}
      sections={payWidgetGuide.sections}
    />
  );
}
