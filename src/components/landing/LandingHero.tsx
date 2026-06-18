import { brandMark, heroLead, heroSlides, heroStats, portalPath, social } from "@/content/landing-content";

export function LandingHero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg"></div>
      <div className="ambient-line al-h" style={{ top: "22%", opacity: 0.4 }}></div>
      <div className="ambient-line al-v" style={{ left: "8%", opacity: 0.3 }}></div>
      <div className="ambient-line al-v" style={{ right: "8%", opacity: 0.3 }}></div>

      <div className="hero-top wrap" style={{ width: "100%", maxWidth: "none", padding: 0 }}>
        <div className="mono" data-reveal style={{ ["--d" as string]: "100ms" }}>
          {brandMark}
        </div>
        <div className="mid" data-reveal style={{ ["--d" as string]: "200ms" }}>
          <span className="eyebrow">QR payments · Cross-chain compliant</span>
        </div>
        <div className="right" data-reveal style={{ ["--d" as string]: "300ms" }}>
          <div className="mono">24/7 · Always on</div>
        </div>
      </div>

      <div className="hero-headline" data-reveal style={{ ["--d" as string]: "400ms" }}>
        <div className="slot" id="headline-slot">
          {heroSlides.map((slide, i) => {
            const Tag = i === 0 ? "h1" : "h2";
            return (
              <Tag
                key={i}
                className={`headline-slide${i === 0 ? " active" : ""}`}
                dangerouslySetInnerHTML={{ __html: slide.titleHtml }}
              />
            );
          })}
        </div>
        <p className="sub serif">
          {heroLead}
        </p>
        <div className="headline-dots" id="h-dots">
          {heroSlides.map((_, i) => (
            <button key={i} className={i === 0 ? "active" : undefined} data-h={i} type="button" aria-label={`Slide ${i + 1}`}></button>
          ))}
        </div>
      </div>

      <div className="hero-bottom" style={{ width: "100%" }}>
        <div className="hero-stats">
          <div className="hero-stat" data-reveal style={{ ["--d" as string]: "700ms" }}>
            <span className="mono">{heroStats.left.label}</span>
            <b className="stat-glow">
              {heroStats.left.value}
              <sup className="fee-asterisk">*</sup>
            </b>
            <span className="fee-disclaimer">Fees subject to change</span>
          </div>
          <div className="hero-stat right" data-reveal style={{ ["--d" as string]: "720ms" }}>
            <span className="mono">{heroStats.right.label}</span>
            <b className="stat-glow">
              {heroStats.right.value}
              <sup className="fee-asterisk">*</sup>
            </b>
            <span className="fee-disclaimer">Fees subject to change</span>
          </div>
        </div>
        <div className="hero-cta" data-reveal style={{ ["--d" as string]: "800ms" }}>
          <a href={portalPath} className="btn btn-gold">
            Open Portal <span className="arrow">→</span>
          </a>
          <a href="#marketing" className="btn btn-ghost">
            How it works
          </a>
          <a href={social.email} className="btn btn-blood">
            Contact us
          </a>
        </div>
      </div>

    </section>
  );
}
