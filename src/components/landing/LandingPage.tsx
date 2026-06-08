"use client";

import dynamic from "next/dynamic";
import { useLandingEffects } from "@/hooks/useLandingEffects";
import { useLandingStats } from "@/hooks/useLandingStats";
import { LandingSetup } from "./LandingSetup";
import { LandingNav } from "./LandingNav";
import { LandingHero } from "./LandingHero";
import { LandingMarquee } from "./sections/LandingMarquee";
import { LandingManifesto } from "./sections/LandingManifesto";
import { LandingTeam } from "./sections/LandingTeam";
import { LandingHow } from "./sections/LandingHow";
import { LandingMultiChain } from "./sections/LandingMultiChain";
import { LandingBusinesses } from "./sections/LandingBusinesses";
import { LandingRoadmap } from "./sections/LandingRoadmap";
import { LandingCommunity } from "./sections/LandingCommunity";
import { LandingFooter } from "./sections/LandingFooter";

const CampaignGallery = dynamic(() => import("./widgets/CampaignGallery").then((m) => m.CampaignGallery), { ssr: false });

export function LandingPage() {
  useLandingEffects();
  useLandingStats();

  return (
    <>
      <LandingSetup />
      <LandingNav />
      <LandingHero />
      <LandingMarquee />
      <LandingManifesto />
      <LandingTeam />
      <LandingHow />
      <LandingMultiChain />
      <LandingBusinesses />
      <CampaignGallery />
      <LandingRoadmap />
      <LandingCommunity />
      <LandingFooter />
    </>
  );
}
