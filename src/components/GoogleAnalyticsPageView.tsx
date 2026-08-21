"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@/lib/gtag";

export function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    // Initial page_view is sent by gtag('config') on load.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
