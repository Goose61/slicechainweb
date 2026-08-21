"use client";

import { useMemo } from "react";
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
  const { traditionalCost, sliceCost, monthlySavings } = useMemo(() => {
    const traditional = volume * traditionalFee;
    const slice = volume * SLICEPAY_FEE;
    const monthly = traditional - slice;
    return {
      traditionalCost: traditional,
      sliceCost: slice,
      monthlySavings: monthly,
    };
  }, [volume, traditionalFee]);

  const calc = foundingMerchant.calculator;

  return (
    <aside className="fm-calculator" id="calculator" aria-label="SlicePay savings estimate">
      <div className="fm-calc-top">
        <p className="mono">{calc.eyebrow}</p>
        <h2 className="display fm-calc-title">{calc.title}</h2>
      </div>

      <div className="fm-calc-body">
        <div className="fm-volume-field">
          <div className="fm-field-head">
            <label htmlFor="fm-volume">{calc.volumeLabel}</label>
            <output id="fm-volume-output" htmlFor="fm-volume" className="fm-volume-value">
              {dollars.format(volume)}
            </output>
          </div>
          <div className="fm-range-wrap">
            <input
              id="fm-volume"
              className="fm-volume-slider"
              type="range"
              min={VOLUME_MIN}
              max={VOLUME_MAX}
              step={VOLUME_STEP}
              value={volume}
              aria-valuemin={VOLUME_MIN}
              aria-valuemax={VOLUME_MAX}
              aria-valuenow={volume}
              aria-valuetext={`${dollars.format(volume)} per month`}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
            />
            <div className="fm-range-meta" aria-hidden="true">
              <span>$1k</span>
              <span>$75k</span>
            </div>
          </div>
        </div>

        <fieldset className="fm-fee-fieldset">
          <legend className="fm-option-title mono">Compare current fees</legend>
          <div className="fm-fee-options" role="radiogroup" aria-label="Traditional fee rate">
            {FEE_OPTIONS.map((opt) => (
              <div key={opt.id} className="fm-fee-option">
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
        </fieldset>

        <div className="fm-fee-table">
          <div className="fm-fee-row">
            <div className="fm-fee-row-copy">
              <strong>{calc.traditionalLabel}</strong>
              <span>{displayRate(traditionalFee)}</span>
            </div>
            <b className="fm-fee-amount">{dollars.format(traditionalCost)}</b>
          </div>
          <div className="fm-fee-row fm-fee-row-slice">
            <div className="fm-fee-row-copy">
              <strong>{calc.sliceLabel}</strong>
              <span>1.9%</span>
            </div>
            <b className="fm-fee-amount">{dollars.format(sliceCost)}</b>
          </div>
        </div>

        <div className="fm-roi" aria-live="polite" aria-atomic="true">
          <p className="fm-roi-title">
            {calc.savingsLabel}{" "}
            <strong className="fm-roi-highlight">{dollars.format(monthlySavings)}</strong>
          </p>
          <button type="button" className="fm-calc-cta btn btn-gold" onClick={onBecomeMerchant}>
            {foundingMerchant.cta} <span className="arrow">→</span>
          </button>
          <p className="fm-calc-disclaimer">{calc.disclaimer}</p>
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
