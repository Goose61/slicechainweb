"use client";

import { useMemo, useState } from "react";
import { foundingMerchant } from "@/content/landing-content";

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

interface RoiCalculatorProps {
  onBecomeMerchant: () => void;
  volume: number;
  traditionalFee: number;
  onVolumeChange: (volume: number) => void;
  onTraditionalFeeChange: (fee: number) => void;
}

export function RoiCalculator({
  onBecomeMerchant,
  volume,
  traditionalFee,
  onVolumeChange,
  onTraditionalFeeChange,
}: RoiCalculatorProps) {
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
          onChange={(e) => onVolumeChange(Number(e.target.value))}
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
                onChange={() => onTraditionalFeeChange(opt.value)}
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
          <button type="button" className="fm-calc-cta btn btn-gold" onClick={onBecomeMerchant}>
            {foundingMerchant.cta} <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export function getDefaultRoiVolume() {
  return 10_000;
}

export function getDefaultTraditionalFee() {
  return 0.035;
}
