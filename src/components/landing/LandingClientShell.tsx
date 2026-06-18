"use client";

import dynamic from "next/dynamic";

const LandingClientEffects = dynamic(
  () => import("./LandingClientEffects").then((mod) => mod.LandingClientEffects),
  { ssr: false, loading: () => null }
);

export function LandingClientShell() {
  return <LandingClientEffects />;
}
