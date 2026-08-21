import { brandMark, businessSignupPath, employeeLoginPath } from "@/content/landing-content";
import { appUrl } from "@/lib/appUrl";
import { ContactLink } from "../ContactLink";

export function LandingCommunity() {
  const employeeLoginHref = appUrl(employeeLoginPath);

  return (
    <>
      <section className="crew" id="community">
        <div className="wrap">
          <div className="section-num" data-reveal>
            10 · Get Started
          </div>
          <div className="crew-wrap crew-wrap-single">
            <div data-reveal>
              <h2>
                Start with <span className="it">{brandMark}</span>
              </h2>
              <p className="kicker">
                Register your business to accept cryptocurrency payments, onboard staff for QR code crypto payments, and open the portal to manage USDC payments for business.
              </p>
              <div className="crew-cta">
                <a href={businessSignupPath} className="btn btn-gold">
                  Business signup <span className="arrow">→</span>
                </a>
                <a href={employeeLoginHref} className="btn">
                  Employee login <span className="arrow">→</span>
                </a>
                <ContactLink className="btn">
                  Contact sales <span className="arrow">→</span>
                </ContactLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
