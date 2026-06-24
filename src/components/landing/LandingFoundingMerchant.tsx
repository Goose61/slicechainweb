"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { foundingMerchant, foundingMerchantHeroImage } from "@/content/landing-content";
import { foundingMerchantApi } from "@/lib/api";
import { FoundingMerchantSignupModal } from "./FoundingMerchantSignupModal";
import { DemoVideoModal } from "./DemoVideoModal";

const SLICEPAY_FEE = 0.019;
const VOLUME_MIN = 1000;
const VOLUME_MAX = 75000;
const VOLUME_STEP = 500;
const FEE_OPTIONS = [
  { id: "fee35", value: 0.035, label: "3.5%" },
  { id: "fee40", value: 0.04, label: "4%" },
  { id: "fee45", value: 0.045, label: "4.5%" },
] as const;

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function displayRate(rate: number) {
  return `${(rate * 100).toFixed(rate === 0.04 ? 0 : 1)}%`;
}

export function LandingFoundingMerchant() {
  const [volume, setVolume] = useState(10000);
  const [traditionalFee, setTraditionalFee] = useState(0.035);
  const [signupOpen, setSignupOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [remainingSpots, setRemainingSpots] = useState<number | null>(null);
  const [verifiedBanner, setVerifiedBanner] = useState(false);
  const [verifyError, setVerifyError] = useState(false);

  const openSignup = useCallback(() => setSignupOpen(true), []);
  const openDemo = useCallback(() => setDemoOpen(true), []);

  useEffect(() => {
    foundingMerchantApi.getAvailability().then((data) => {
      setRemainingSpots(data.remainingSpots);
    }).catch(() => {
      setRemainingSpots(null);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verified = params.get("founding-verified");
    if (verified === "true") {
      setVerifiedBanner(true);
      window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    } else if (verified === "error") {
      setVerifyError(true);
      openSignup();
      window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    }
  }, [openSignup]);

  const { traditionalCost, sliceCost, monthlySavings, yearlySavings } = useMemo(() => {
    const traditional = volume * traditionalFee;
    const slice = volume * SLICEPAY_FEE;
    const monthly = traditional - slice;
    return {
      traditionalCost: traditional,
      sliceCost: slice,
      monthlySavings: monthly,
      yearlySavings: monthly * 12,
    };
  }, [volume, traditionalFee]);

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
                  Email verified — your Founding Merchant application is confirmed. Our team will be in touch soon.
                </div>
              )}
              <div className="fm-eyebrow" data-reveal style={{ ["--d" as string]: "100ms" }}>
                {foundingMerchant.eyebrow}
              </div>
              <h1
                className="display fm-title"
                data-reveal
                style={{ ["--d" as string]: "200ms" }}
                dangerouslySetInnerHTML={{ __html: foundingMerchant.titleHtml }}
              />
              <p className="fm-subhead" data-reveal style={{ ["--d" as string]: "300ms" }}>
                {foundingMerchant.subhead}
              </p>
              <p className="fm-copy" data-reveal style={{ ["--d" as string]: "400ms" }}>
                {foundingMerchant.copy}
              </p>

              <div className="fm-actions" data-reveal style={{ ["--d" as string]: "500ms" }}>
                <button type="button" className="btn btn-gold" onClick={openSignup}>
                  {foundingMerchant.cta} <span className="arrow">→</span>
                </button>
                <button type="button" className="btn btn-ghost" onClick={openDemo}>
                  {foundingMerchant.demoCta}
                </button>
              </div>

              <div className="fm-trust" data-reveal style={{ ["--d" as string]: "600ms" }}>
                {foundingMerchant.trustCards.map((card) => (
                  <div key={card.value} className="fm-trust-card">
                    <strong>{card.value}</strong>
                    <span>{card.label}</span>
                  </div>
                ))}
              </div>

              {remainingSpots !== null && (
                <p className="fm-spots mono" data-reveal style={{ ["--d" as string]: "650ms" }}>
                  {remainingSpots} of {foundingMerchant.maxSpots} founding spots remaining
                </p>
              )}
            </div>

            <aside className="fm-calculator" id="calculator" aria-label="SlicePay ROI calculator">
              <div className="fm-calc-top">
                <p className="mono">SlicePay ROI Calculator</p>
                <h2 className="display">Payment fees, transparent at their purest form</h2>
              </div>

              <div className="fm-calc-body">
                <div className="fm-field-head">
                  <label htmlFor="fm-volume">You process</label>
                  <output id="fm-volume-output" htmlFor="fm-volume">
                    {dollars.format(volume)} / month
                  </output>
                </div>
                <input
                  id="fm-volume"
                  type="range"
                  min={VOLUME_MIN}
                  max={VOLUME_MAX}
                  step={VOLUME_STEP}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
                <div className="fm-range-meta" aria-hidden="true">
                  <span>$1k</span>
                  <span>$75k</span>
                </div>

                <p className="fm-option-title mono">Compare current fees</p>
                <div className="fm-fee-options" role="radiogroup" aria-label="Traditional fee rate">
                  {FEE_OPTIONS.map((opt) => (
                    <div key={opt.id}>
                      <input
                        id={opt.id}
                        name="traditionalFee"
                        type="radio"
                        value={opt.value}
                        checked={traditionalFee === opt.value}
                        onChange={() => setTraditionalFee(opt.value)}
                      />
                      <label htmlFor={opt.id}>{opt.label}</label>
                    </div>
                  ))}
                </div>

                <div className="fm-fee-table">
                  <div className="fm-fee-row">
                    <div>
                      <strong>Traditional fees</strong>
                      <span>{displayRate(traditionalFee)}</span>
                    </div>
                    <b>{dollars.format(traditionalCost)}</b>
                  </div>
                  <div className="fm-fee-row fm-fee-row-slice">
                    <div>
                      <strong>SlicePay</strong>
                      <span>1.9%</span>
                    </div>
                    <b>{dollars.format(sliceCost)}</b>
                  </div>
                </div>

                <div className="fm-roi">
                  <p className="fm-roi-title mono">Your savings estimate</p>
                  <div className="fm-roi-grid">
                    <div className="fm-roi-card">
                      <span className="mono">Monthly</span>
                      <strong>{dollars.format(monthlySavings)}</strong>
                    </div>
                    <div className="fm-roi-card">
                      <span className="mono">Yearly</span>
                      <strong>{dollars.format(yearlySavings)}</strong>
                    </div>
                  </div>
                  <button type="button" className="fm-calc-cta btn btn-gold" onClick={openSignup}>
                    {foundingMerchant.cta} <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>

          <div className="fm-benefits wrap-inner" data-reveal style={{ ["--d" as string]: "700ms" }}>
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
        initialError={verifyError ? "Verification link expired or invalid. Please submit your application again." : undefined}
      />
      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
