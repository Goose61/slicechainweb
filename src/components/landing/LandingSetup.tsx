"use client";

import { useEffect } from "react";

export function LandingSetup() {
  useEffect(() => {
    document.documentElement.dataset.type = "slicepay";
    document.body.classList.add("landing-active");

    const href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap";

    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }

    return () => {
      document.body.classList.remove("landing-active");
    };
  }, []);

  return null;
}
