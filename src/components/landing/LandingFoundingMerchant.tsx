"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { foundingMerchant, foundingMerchantHeroImage } from "@/content/landing-content";
import { foundingMerchantApi } from "@/lib/api";
import { FoundingMerchantSignupModal } from "./FoundingMerchantSignupModal";
import { DemoVideoModal } from "./DemoVideoModal";
import { FoundingSpotsBanner } from "./FoundingSpotsBanner";
import { getDefaultRoiVolume, getDefaultTraditionalFee } from "./RoiCalculator";

const RoiCalculator = dynamic(
  () => import("./RoiCalculator").then((m) => m.RoiCalculator),
  {
    ssr: false,
    loading: () => (
      <aside className="fm-calculator fm-calculator-skeleton" aria-label="Loading ROI calculator">
        <div className="fm-calc-top">
          <p className="mono">SlicePay ROI Calculator</p>
          <h2 className="display fm-calc-title">Payment fees, transparent at their purest form</h2>
        </div>
        <div className="fm-calc-body fm-calc-body-skeleton" />
      </aside>
    ),
  }
);

export function LandingFoundingMerchant() {
  const [volume, setVolume] = useState(getDefaultRoiVolume);
  const [traditionalFee, setTraditionalFee] = useState(getDefaultTraditionalFee);
  const [signupOpen, setSignupOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [remainingSpots, setRemainingSpots] = useState<number | null>(null);
  const [claimedSpots, setClaimedSpots] = useState<number>(0);
  const [verifiedBanner, setVerifiedBanner] = useState(false);
  const [verifyError, setVerifyError] = useState(false);

  const openSignup = useCallback(() => setSignupOpen(true), []);
  const openDemo = useCallback(() => setDemoOpen(true), []);

  const refreshAvailability = useCallback(() => {
    foundingMerchantApi.getAvailability().then((data) => {
      setRemainingSpots(data.remainingSpots);
      setClaimedSpots(data.claimedSpots);
    }).catch(() => {
      setRemainingSpots(null);
    });
  }, []);

  useEffect(() => {
    refreshAvailability();
  }, [refreshAvailability]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verified = params.get("founding-verified");
    if (verified === "true") {
      setVerifiedBanner(true);
      refreshAvailability();
      window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    } else if (verified === "error") {
      setVerifyError(true);
      openSignup();
      window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    }
  }, [openSignup, refreshAvailability]);

  return (
    <>
      <section className="fm-hero" id="home">
        <div
          className="fm-hero-bg"
          style={{ backgroundImage: `url(${foundingMerchantHeroImage})` }}
          aria-hidden="true"
        />
        <div className="fm-hero-inner wrap">
          <div className="fm-hero-grid">
            <div className="fm-hero-copy" id="founding-merchant">
              {verifiedBanner && (
                <div className="fm-verified-banner" role="status">
                  Email verified — your application is confirmed. Our team will review it and email you once approved.
                </div>
              )}
              <div className="fm-eyebrow">
                {foundingMerchant.eyebrow}
              </div>
              <h1
                className="display fm-title"
                dangerouslySetInnerHTML={{ __html: foundingMerchant.titleHtml }}
              />
              <p className="fm-subhead">
                {foundingMerchant.subhead}
              </p>
              <p className="fm-copy">
                {foundingMerchant.copy}
              </p>

              <div className="fm-actions">
                <button type="button" className="btn btn-gold" onClick={openSignup}>
                  {foundingMerchant.cta} <span className="arrow">→</span>
                </button>
                <button type="button" className="btn btn-ghost" onClick={openDemo}>
                  {foundingMerchant.demoCta}
                </button>
              </div>

              <div className="fm-trust">
                {foundingMerchant.trustCards.map((card) => (
                  <div key={card.value} className="fm-trust-card">
                    <strong>{card.value}</strong>
                    <span>{card.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <RoiCalculator
              onBecomeMerchant={openSignup}
              volume={volume}
              traditionalFee={traditionalFee}
              onVolumeChange={setVolume}
              onTraditionalFeeChange={setTraditionalFee}
            />
          </div>

          {remainingSpots !== null && (
            <FoundingSpotsBanner
              remainingSpots={remainingSpots}
              maxSpots={foundingMerchant.maxSpots}
              claimedSpots={claimedSpots}
            />
          )}

          <div className="fm-benefits wrap-inner">
            <div className="fm-benefits-head">
              <span className="eyebrow">Founding Merchant Program</span>
              <h2 className="display">Exclusive benefits for early partners</h2>
              <p className="fm-benefits-note">{foundingMerchant.availabilityNote}</p>
            </div>
            <ul className="fm-benefits-list">
              {foundingMerchant.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FoundingMerchantSignupModal
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        defaultVolume={volume}
        defaultTraditionalFee={traditionalFee}
        initialError={verifyError ? "We could not confirm your email. Please open the link from your email and click Confirm, or submit your application again." : undefined}
      />
      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
