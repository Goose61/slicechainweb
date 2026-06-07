import { partners } from "@/content/landing-content";

export function LogoCarousel() {
  const items = [...partners.items, ...partners.items];

  return (
    <section className="section" id="partners" style={{ background: "var(--bg)", borderTop: "1px solid var(--line)" }}>
      <div className="wrap">
        <div className="section-num" data-reveal>
          05 · {partners.subtitle}
        </div>
        <h2 className="title" data-reveal style={{ ["--d" as string]: "100ms", fontFamily: "var(--display)", fontSize: "clamp(44px,7vw,72px)" }}>
          {partners.title}
        </h2>
        <p className="serif" data-reveal style={{ ["--d" as string]: "200ms", fontStyle: "italic", color: "var(--bone-dim)" }}>
          {partners.text}
        </p>
        <div className="partners-carousel" data-reveal style={{ ["--d" as string]: "300ms" }}>
          <div className="partners-track">
            {items.map((item, i) => (
              <div key={`${item.href}-${i}`} className="partner-item">
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <img src={item.img} alt={item.alt} className="partner-logo" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
