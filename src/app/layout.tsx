import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { GoogleAnalyticsPageView } from "@/components/GoogleAnalyticsPageView";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteSeoBase } from "@/content/seo-metadata";
import { fontClassNames } from "@/lib/fonts";

export const metadata: Metadata = {
  ...siteSeoBase,
  icons: {
    icon: "/landing-assets/images/pizza/pizzaimages/main_logo.png",
    apple: "/landing-assets/images/pizza/pizzaimages/main_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${fontClassNames}`} suppressHydrationWarning>
      <body className="antialiased font-sans">
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <GoogleAnalyticsPageView />
        </Suspense>
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
