"use client";

import dynamic from "next/dynamic";

const CampaignGallery = dynamic(
  () => import("./widgets/CampaignGallery").then((mod) => mod.CampaignGallery),
  { ssr: false, loading: () => null }
);

export function LandingGallery() {
  return <CampaignGallery />;
}
