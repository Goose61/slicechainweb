import { aboutSlicePay, brandMark, mission, platformPillars } from "@/content/landing-content";

export function LandingManifesto() {
  return (
    <>
      <section className="section manifesto" id="mission">
        <div className="wrap">
          <div className="section-num" data-reveal>
            02 · {mission.subtitle}
          </div>
          <div className="oath">
            <div className="stamp" data-reveal>
              {mission.subtitle}
            </div>
            <h2 data-reveal style={{ ["--d" as string]: "100ms" }}>
              {mission.title}
            </h2>

            <div data-reveal style={{ ["--d" as string]: "200ms", marginTop: 48 }}>
              {mission.blocks.map((block) => (
                <div key={block.title} style={{ marginBottom: 32, maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
                  <h3 style={{ fontFamily: "var(--display)", fontSize: 24, marginBottom: 12 }}>{block.title}</h3>
                  <p style={{ color: "var(--bone-dim)", lineHeight: 1.6 }}>{block.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section manifesto" id="about">
        <div className="wrap">
          <div className="section-num" data-reveal>
            03 · {aboutSlicePay.subtitle}
          </div>
          <div className="oath">
            <div className="stamp" data-reveal>
              {aboutSlicePay.subtitle}
            </div>
            <h2 data-reveal style={{ ["--d" as string]: "100ms" }}>
              {aboutSlicePay.title}
            </h2>
            <p
              className="serif"
              data-reveal
              style={{
                ["--d" as string]: "150ms",
                textAlign: "center",
                marginTop: 24,
                fontStyle: "italic",
                color: "var(--bone-dim)",
                maxWidth: 800,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {aboutSlicePay.text}
            </p>

            <div className="oath-rules" data-reveal style={{ ["--d" as string]: "200ms" }}>
              {platformPillars.map((rule) => (
                <div key={rule.n} className="oath-rule">
                  <div className="n">{rule.n}</div>
                  <h3>{rule.title}</h3>
                  <p>{rule.body}</p>
                </div>
              ))}
            </div>

            <div className="oath-sign" data-reveal style={{ ["--d" as string]: "350ms" }}>
              <span className="sig">{brandMark}</span>
              <span>USDC & USDT cross-chain payouts</span>
              <span>SLICE loyalty rewards</span>
            </div>

            <div data-reveal style={{ ["--d" as string]: "400ms", textAlign: "center", marginTop: 48 }}>
              <div className="about-banner">
                <img
                  src={aboutSlicePay.banner}
                  alt={aboutSlicePay.bannerAlt}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
