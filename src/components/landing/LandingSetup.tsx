"use client";

import { useEffect } from "react";

export function LandingSetup() {
  useEffect(() => {
    document.documentElement.dataset.type = "slicepay";
    document.body.classList.add("landing-active");

    return () => {
      document.body.classList.remove("landing-active");
    };
  }, []);

  return null;
}
