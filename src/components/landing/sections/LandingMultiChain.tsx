import { crossChain } from "@/content/landing-content";
import { ChainLogoCarousel } from "../widgets/ChainLogoCarousel";

export function LandingMultiChain() {
  return (
    <section className="section cross-chain" id="chains">
      <div className="wrap">
        <div className="section-num" data-reveal>
          Cross-chain · {crossChain.subtitle}
        </div>
        <div className="cross-chain-head" data-reveal style={{ ["--d" as string]: "100ms" }}>
          <h2 className="title">
            Now <span className="it">cross-chain</span> compliant
          </h2>
          <p className="tagline">{crossChain.tagline}</p>
          <p className="mono stablecoins">{crossChain.stablecoins}</p>
        </div>

        <div className="cross-chain-visual" data-reveal style={{ ["--d" as string]: "200ms" }}>
          <img src={crossChain.image} alt={crossChain.imageAlt} loading="lazy" />
        </div>

        <div data-reveal style={{ ["--d" as string]: "300ms" }}>
          <ChainLogoCarousel />
        </div>

        <p className="cross-chain-footer mono" data-reveal style={{ ["--d" as string]: "400ms" }}>
          {crossChain.footer}
        </p>
      </div>
    </section>
  );
}
