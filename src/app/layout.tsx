import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
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
      <head>
        <link rel="preconnect" href="https://api.slicechain.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.slicechain.io" />
      </head>
      <body className="antialiased font-sans">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
