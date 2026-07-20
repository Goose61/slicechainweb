"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { foundingMerchant, foundingMerchantHeroImage } from "@/content/landing-content";
import { foundingMerchantApi } from "@/lib/api";
import {
  FOUNDING_SIGNUP_EVENT,
  buildFoundingSignupHref,
} from "@/lib/foundingSignup";
import { trackEvent } from "@/lib/gtag";
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
          <p className="mono">{foundingMerchant.calculator.eyebrow}</p>
          <h2 className="display fm-calc-title">{foundingMerchant.calculator.title}</h2>
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

  const openSignup = useCallback((source?: string) => {
    if (source === "hero" || source === "calculator") {
      trackEvent("hero_register_click", { location: source });
    }
    setSignupOpen(true);
  }, []);

  const openDemo = useCallback(() => {
    trackEvent("hero_demo_click", { location: "hero" });
    setDemoOpen(true);
  }, []);

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
    const onOpen = () => openSignup("header");
    window.addEventListener(FOUNDING_SIGNUP_EVENT, onOpen);
    return () => window.removeEventListener(FOUNDING_SIGNUP_EVENT, onOpen);
  }, [openSignup]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verified = params.get("founding-verified");
    const openSignupParam = params.get("founding-signup");

    if (openSignupParam === "1" || window.location.hash === "#founding-merchant") {
      if (openSignupParam === "1") {
        openSignup("deep_link");
      }
    }

    if (verified === "true") {
      setVerifiedBanner(true);
      refreshAvailability();
      window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    } else if (verified === "error") {
      setVerifyError(true);
      openSignup("verify_error");
      window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    } else if (openSignupParam === "1") {
      window.history.replaceState({}, "", buildFoundingSignupHref(params));
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
                  Email verified — continue creating your SlicePay account from the link in your confirmation email.
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
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => openSignup("hero")}
                >
                  {foundingMerchant.cta} <span className="arrow">→</span>
                </button>
                <button type="button" className="btn btn-ghost" onClick={openDemo}>
                  {foundingMerchant.demoCta}
                </button>
              </div>

              <ul className="fm-risk-reducers">
                {foundingMerchant.riskReducers.map((item) => (
                  <li key={item}>
                    <span className="fm-risk-check" aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <RoiCalculator
              onBecomeMerchant={() => openSignup("calculator")}
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
