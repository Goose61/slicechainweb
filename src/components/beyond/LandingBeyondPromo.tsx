"use client";

import { useState } from "react";
import Link from "next/link";
import { beyondTheSwipePath, landingBeyondPromo } from "@/content/beyond-content";
import { FoundersBriefModal } from "./FoundersBriefModal";

export function LandingBeyondPromo() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <aside className="fm-beyond-promo" aria-label="Beyond the Swipe founder's brief">
        <div className="fm-beyond-promo-inner">
          <div className="fm-beyond-promo-copy">
            <span className="eyebrow">{landingBeyondPromo.eyebrow}</span>
            <h3>{landingBeyondPromo.title}</h3>
            <p>{landingBeyondPromo.body}</p>
          </div>
          <div className="fm-beyond-promo-actions">
            <Link href={beyondTheSwipePath} className="btn btn-ghost">
              {landingBeyondPromo.ctaPage} <span className="arrow">→</span>
            </Link>
            <button
              type="button"
              className="btn btn-gold"
              onClick={() => setModalOpen(true)}
            >
              {landingBeyondPromo.ctaForm} <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </aside>

      <FoundersBriefModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="landing_promo"
      />
    </>
  );
}
