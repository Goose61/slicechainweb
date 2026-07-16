"use client";

import dynamic from "next/dynamic";
import { gallery } from "@/content/landing-content";
import { LazyInView } from "./LazyInView";

const CampaignGallery = dynamic(
  () => import("./widgets/CampaignGallery").then((mod) => mod.CampaignGallery),
  { ssr: false, loading: () => null }
);

function GalleryPlaceholder() {
  return (
    <section className="section memes gallery-section" id="gallery" aria-hidden="true">
      <div className="wrap">
        <div className="section-num">07 · {gallery.subtitle}</div>
        <div className="memes-head">
          <h2>
            <span className="stroked">Campaign</span>
            <br />
            Gallery
          </h2>
        </div>
        <div className="campaign-slideshow-stage" style={{ minHeight: "min(50vh, 380px)" }} />
      </div>
    </section>
  );
}

export function LandingGallery() {
  return (
    <LazyInView fallback={<GalleryPlaceholder />} minHeight={420} rootMargin="320px 0px">
      <CampaignGallery />
    </LazyInView>
  );
}
