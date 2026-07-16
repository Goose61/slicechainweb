"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";

/**
 * Loads Google Analytics (gtag.js ~155 KiB) only after the first user
 * interaction or once the page has been idle for a while. This keeps the
 * large tag-manager script off the initial critical path so it no longer
 * counts as unused JavaScript during first paint.
 */
export function GoogleAnalytics() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;

    let idleId: number | undefined;
    const events: Array<keyof DocumentEventMap> = [
      "scroll",
      "pointerdown",
      "keydown",
      "touchstart",
      "mousemove",
    ];

    const trigger = () => {
      setShouldLoad(true);
    };

    events.forEach((evt) =>
      window.addEventListener(evt, trigger, { once: true, passive: true })
    );

    // Fallback: load during idle time so analytics still fires for users who
    // never interact (e.g. read-and-leave visits).
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(trigger, { timeout: 6000 });
    } else {
      idleId = window.setTimeout(trigger, 6000);
    }

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, trigger));
      if (idleId !== undefined) {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleId);
        } else {
          window.clearTimeout(idleId);
        }
      }
    };
  }, [shouldLoad]);

  if (!shouldLoad) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
