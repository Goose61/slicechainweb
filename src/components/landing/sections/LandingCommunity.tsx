import { employeeLoginPath, portalPath, social } from "@/content/landing-content";

export function LandingCommunity() {
  return (
    <>
      <section className="crew" id="community">
        <div className="wrap">
          <div className="section-num" data-reveal>
            09 · Get Started
          </div>
          <div className="crew-wrap">
            <div data-reveal>
              <h2>
                Start with <span className="it">SlicePay</span>
              </h2>
              <p className="kicker">
                Register your business, onboard staff, or open the portal to run payments and track commissions.
              </p>
              <div className="crew-cta">
                <a href={portalPath} className="btn btn-gold">
                  Business signup <span className="arrow">→</span>
                </a>
                <a href={employeeLoginPath} className="btn">
                  Employee login <span className="arrow">→</span>
                </a>
                <a href={social.email} className="btn">
                  Contact sales <span className="arrow">→</span>
                </a>
              </div>
            </div>
            <div className="crew-nums" data-reveal style={{ ["--d" as string]: "200ms" }}>
              <div className="crew-num">
                <div className="lbl">Transactions</div>
                <div className="val" id="crew-stat-transactions">
                  <em>...</em>
                </div>
                <div className="sub">Confirmed</div>
              </div>
              <div className="crew-num">
                <div className="lbl">Active partners</div>
                <div className="val" id="crew-stat-partners">
                  <em>11</em>
                </div>
                <div className="sub">Merchants</div>
              </div>
              <div className="crew-num">
                <div className="lbl">Business fee</div>
                <div className="val">
                  <em>
                    1.9%
                    <sup className="fee-asterisk">*</sup>
                  </em>
                </div>
                <div className="sub">Fees subject to change</div>
              </div>
              <div className="crew-num">
                <div className="lbl">Stablecoins</div>
                <div className="val">
                  <em>USDC</em>
                </div>
                <div className="sub">USDC & USDT</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
