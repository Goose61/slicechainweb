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

/** Non-blocking Google Fonts loader — keeps fonts off the critical render path. */
const FONT_LOADER = `
(function(){
  var href=${JSON.stringify(
    "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
  )};
  var l=document.createElement("link");
  l.rel="stylesheet";
  l.href=href;
  l.media="print";
  l.onload=function(){this.media="all"};
  document.head.appendChild(l);
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${fontClassNames}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: FONT_LOADER }} />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          />
        </noscript>
      </head>
      <body className="antialiased font-sans">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
