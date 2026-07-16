import { Suspense } from "react";
import "@/app/globals.css";
import { GoogleAnalyticsPageView } from "@/components/GoogleAnalyticsPageView";
import { PlatformProviders } from "@/components/PlatformProviders";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformProviders>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageView />
      </Suspense>
      {children}
    </PlatformProviders>
  );
}
