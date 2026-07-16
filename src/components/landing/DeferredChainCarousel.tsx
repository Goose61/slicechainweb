"use client";

import dynamic from "next/dynamic";
import { LazyInView } from "./LazyInView";

const ChainLogoCarousel = dynamic(
  () => import("./widgets/ChainLogoCarousel").then((mod) => mod.ChainLogoCarousel),
  { ssr: false, loading: () => null }
);

export function DeferredChainCarousel() {
  return (
    <LazyInView minHeight={120} rootMargin="320px 0px">
      <ChainLogoCarousel />
    </LazyInView>
  );
}
