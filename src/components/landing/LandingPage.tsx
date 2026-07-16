import { LandingSetup } from "./LandingSetup";
import { LandingClientShell } from "./LandingClientShell";
import { LandingGallery } from "./LandingGallery";
import { LandingNav } from "./LandingNav";
import { LandingFoundingMerchant } from "./LandingFoundingMerchant";
import { LandingMarquee } from "./sections/LandingMarquee";
import { LandingManifesto } from "./sections/LandingManifesto";
import { LandingTeam } from "./sections/LandingTeam";
import { LandingHow } from "./sections/LandingHow";
import { LandingMultiChain } from "./sections/LandingMultiChain";
import { LandingBusinesses } from "./sections/LandingBusinesses";
import { LandingRoadmap } from "./sections/LandingRoadmap";
import { LandingCommunity } from "./sections/LandingCommunity";
import { LandingFooter } from "./sections/LandingFooter";

export function LandingPage() {
  return (
    <>
      <LandingSetup />
      <LandingClientShell />
      <LandingNav />
      <LandingFoundingMerchant />
      <LandingMarquee />
      <LandingManifesto />
      <LandingTeam />
      <LandingHow />
      <LandingMultiChain />
      <LandingBusinesses />
      <LandingGallery />
      <LandingRoadmap />
      <LandingCommunity />
      <LandingFooter />
    </>
  );
}
