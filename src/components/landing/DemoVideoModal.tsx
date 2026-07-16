"use client";

import { useEffect, useRef } from "react";
import { demoVideoPath, foundingMerchant } from "@/content/landing-content";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DemoVideoModal({ open, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      void video.play().catch(() => {
        /* Autoplay may be blocked; controls remain available. */
      });
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      video?.pause();
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
          <span className="eyebrow">Product demo</span>
          <h2 id="fm-demo-title" className="display">{foundingMerchant.demoCta}</h2>
        </div>

        <div className="fm-demo-player">
          <video
            ref={videoRef}
            className="fm-demo-video"
            src={demoVideoPath}
            controls
            playsInline
            preload="metadata"
            aria-label="SlicePay 60-second product demo"
          >
            Your browser does not support embedded video.
            <a href={demoVideoPath}>Download the demo</a>
          </video>
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
