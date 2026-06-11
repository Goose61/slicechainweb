import { businesses } from "@/content/landing-content";

export function LandingBusinesses() {
  return (
    <section className="section biz" id="businesses">
      <div className="wrap">
        <div className="section-num" data-reveal>
          06 · SlicePay for Businesses
        </div>
        <div className="biz-grid" data-reveal style={{ ["--d" as string]: "100ms" }}>
          <div className="biz-left">
            <h2 dangerouslySetInnerHTML={{ __html: businesses.titleHtml }} />
            <p className="lede">{businesses.lede}</p>
            <a href={businesses.cta.href} className="btn btn-gold" style={{ alignSelf: "start" }}>
              {businesses.cta.label} <span className="arrow">→</span>
            </a>
            <div className="biz-stats">
              <div className="biz-stat">
                <div className="v">
                  1.9%
                  <sup className="fee-asterisk">*</sup>
                </div>
                <div className="l">
                  Total Business
                  <br />
                  Fee
                </div>
                <div className="fee-disclaimer">Fees subject to change</div>
              </div>
              <div className="biz-stat">
                <div className="v">
                  0.3%
                  <sup className="fee-asterisk">*</sup>
                </div>
                <div className="l">
                  Employee
                  <br />
                  Commission
                </div>
                <div className="fee-disclaimer">Fees subject to change</div>
              </div>
              <div className="biz-stat">
                <div className="v">USDC</div>
                <div className="l">
                  + USDT
                  <br />
                  Payouts
                </div>
              </div>
            </div>
          </div>
          <div className="biz-right">
            <div className="corner-tl"></div>
            <div className="corner-tr"></div>
            <div className="corner-bl"></div>
            <div className="corner-br"></div>
            <h3>Why Your Business Joins SlicePay</h3>
            <div className="biz-list">
              {businesses.rows.map((row) => (
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
