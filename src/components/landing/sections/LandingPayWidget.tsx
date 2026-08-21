import { brandMark } from "@/content/landing-content";
import { payWidgetSection } from "@/content/pay-widget-content";

export function LandingPayWidget() {
  return (
    <section className="section biz pay-widget-section" id="pay-widget">
      <div className="wrap">
        <div className="section-num" data-reveal>
          07 · {payWidgetSection.subtitle}
        </div>
        <div className="biz-grid" data-reveal style={{ ["--d" as string]: "100ms" }}>
          <div className="biz-left">
            <h2 dangerouslySetInnerHTML={{ __html: payWidgetSection.titleHtml }} />
            <p className="lede">{payWidgetSection.lede}</p>
            <a href={payWidgetSection.cta.href} className="btn btn-gold" style={{ alignSelf: "start" }}>
              {payWidgetSection.cta.label} <span className="arrow">→</span>
            </a>
            <div className="biz-stats">
              <div className="biz-stat">
                <div className="v">1 tag</div>
                <div className="l">
                  Script embed
                  <br />
                  or redirect
                </div>
              </div>
              <div className="biz-stat">
                <div className="v">1.6%</div>
                <div className="l">
                  Gateway fee
                  <br />
                  at checkout
                </div>
              </div>
              <div className="biz-stat">
                <div className="v">USDC</div>
                <div className="l">
                  Merchant
                  <br />
                  settlement
                </div>
              </div>
            </div>
          </div>
          <div className="biz-right">
            <div className="corner-tl"></div>
            <div className="corner-tr"></div>
            <div className="corner-bl"></div>
            <div className="corner-br"></div>
            <h3>E-commerce &amp; {brandMark} Gateway</h3>
            <div className="biz-list">
              {payWidgetSection.features.map((row) => (
                <div key={row.n} className="biz-row">
                  <div className="n">{row.n}</div>
                  <div>
                    <div className="t">{row.t}</div>
                    <div className="d">{row.d}</div>
                  </div>
                  <div className="tag">{row.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
