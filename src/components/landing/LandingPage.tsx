import { LandingSetup } from "./LandingSetup";
import { LandingClientShell } from "./LandingClientShell";
import { LandingGallery } from "./LandingGallery";
import { LandingNav } from "./LandingNav";
import { LandingFoundingMerchant } from "./LandingFoundingMerchant";
import { LandingF6SBadge } from "./LandingF6SBadge";
import { LandingMarquee } from "./sections/LandingMarquee";
import { LandingManifesto } from "./sections/LandingManifesto";
import { LandingTeam } from "./sections/LandingTeam";
import { LandingHow } from "./sections/LandingHow";
import { LandingMultiChain } from "./sections/LandingMultiChain";
import { LandingBusinesses } from "./sections/LandingBusinesses";
import { LandingPayWidget } from "./sections/LandingPayWidget";
import { LandingSecurity } from "./sections/LandingSecurity";
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
      <LandingF6SBadge />
      <LandingMarquee />
      <LandingManifesto />
      <LandingTeam />
      <LandingHow />
      <LandingMultiChain />
      <LandingBusinesses />
      <LandingPayWidget />
      <LandingSecurity />
      <LandingGallery />
      <LandingRoadmap />
      <LandingCommunity />
      <LandingFooter />
    </>
  );
}
