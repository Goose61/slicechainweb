import type { Metadata } from "next";
import { BeyondTheSwipePage } from "@/components/beyond/BeyondTheSwipePage";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.beyondTheSwipe;

export default function BeyondTheSwipeRoute() {
  return <BeyondTheSwipePage />;
}
