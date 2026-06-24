"use client";

import { useEffect } from "react";
import { foundingMerchant } from "@/content/landing-content";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DemoVideoModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fm-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="fm-modal fm-demo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fm-demo-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="fm-modal-close" onClick={onClose} aria-label="Close">
          <span className="fm-modal-close-icon" aria-hidden="true">×</span>
        </button>

        <div className="fm-demo-head">
          <span className="eyebrow">Coming soon</span>
          <h2 id="fm-demo-title" className="display">{foundingMerchant.demoCta}</h2>
        </div>

        <div className="fm-demo-placeholder" aria-label="Demo video placeholder">
          <div className="fm-demo-play" aria-hidden="true">▶</div>
          <p>Our 60-second product demo is on the way.</p>
          <span className="mono">Video / GIF placeholder</span>
        </div>

        <p className="fm-demo-copy">
          See how customers scan, pay, and settle in USDC — and how merchants keep more revenue
          with SlicePay&apos;s 1.9% rate.
        </p>

        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
