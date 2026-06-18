"use client";

import { useCallback, useEffect, useState } from "react";
import { gallery, galleryImages } from "@/content/landing-content";

const SLIDE_MS = 5000;
const FADE_MS = 800;

export function CampaignGallery() {
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    setActive(((index % galleryImages.length) + galleryImages.length) % galleryImages.length);
  }, []);

  const step = useCallback((dir: 1 | -1) => goTo(active + dir), [active, goTo]);

  useEffect(() => {
    const timer = setInterval(() => step(1), SLIDE_MS);
    return () => clearInterval(timer);
  }, [active, step]);

  return (
    <section className="section memes gallery-section" id="gallery">
      <div className="wrap">
        <div className="section-num">07 · {gallery.subtitle}</div>
        <div className="memes-head">
          <h2>
            <span className="stroked">Campaign</span>
            <br />
            Gallery
          </h2>
          <div>
            <p className="mono" style={{ marginBottom: 14, color: "var(--bone-soft)" }}>
              {gallery.title}
            </p>
          </div>
        </div>

        <div className="campaign-slideshow">
          <button
            type="button"
            className="campaign-slideshow-nav prev"
            onClick={() => step(-1)}
            aria-label="Previous slide"
          >
            ←
          </button>

          <div className="campaign-slideshow-stage">
            <img
              key={galleryImages[active].src}
              src={galleryImages[active].src}
              alt={galleryImages[active].alt}
              className="is-active"
              style={{ transitionDuration: `${FADE_MS}ms` }}
              loading="lazy"
              decoding="async"
            />
            <p className="campaign-slideshow-caption">{galleryImages[active].alt}</p>
          </div>

          <button
            type="button"
            className="campaign-slideshow-nav next"
            onClick={() => step(1)}
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        <div className="campaign-slideshow-dots" role="tablist" aria-label="Gallery slides">
          {galleryImages.map((item, index) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Slide ${index + 1}`}
              className={index === active ? "active" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
