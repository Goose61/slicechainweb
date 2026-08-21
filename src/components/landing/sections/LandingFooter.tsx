import {
  brandMark,
  brandName,
  businessLoginPath,
  businessSignupPath,
  contactPath,
  employeeLoginPath,
  footer,
  logo,
  navLinks,
  payWidgetGuidePath,
  privacyPath,
  social,
  termsPath,
} from "@/content/landing-content";
import { appUrl } from "@/lib/appUrl";
import { ContactLink } from "../ContactLink";

export function LandingFooter() {
  const businessLoginHref = appUrl(businessLoginPath);
  const employeeLoginHref = appUrl(employeeLoginPath);

  return (
    <footer className="foot" id="footer">
      <div className="foot-big">{brandMark}</div>
      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        <div className="foot-grid">
          <div className="foot-col">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <img src={logo} alt={`${brandName} crypto payment gateway logo`} style={{ height: 36, filter: "drop-shadow(0 0 12px rgba(59,158,255,.35))" }} />
              <span style={{ fontFamily: "var(--display)", fontSize: 22, letterSpacing: ".1em", textTransform: "uppercase" }}>
                {brandMark}
              </span>
            </div>
            <p>{footer.address}</p>
            <p className="foot-seo-blurb">
              SlicePay is a global crypto payments provider and processor for restaurants, retailers,
              e-commerce, and service businesses. Accept wallet payments in-store or online, settle in USDC,
              and keep more of every sale with transparent 1.9% pricing.
            </p>
            <div className="foot-soc-links">
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" title="X / Twitter" className="foot-soc-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="foot-soc-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
            <p style={{ marginTop: 16, fontSize: 13, color: "var(--bone-dim)" }}>
              <ContactLink />
            </p>
          </div>
          <div className="foot-col">
            <p className="foot-col-title">Navigate</p>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="foot-col">
            <p className="foot-col-title">Portals</p>
            <a href={businessSignupPath}>Business signup</a>
            <a href={businessLoginHref}>Business login</a>
            <a href={employeeLoginHref}>Employee login</a>
            <ContactLink>Support</ContactLink>
          </div>
          <div className="foot-col">
            <p className="foot-col-title">Developers</p>
            <a href={payWidgetGuidePath}>Website Pay Widget guide</a>
            <a href="#pay-widget">Pay Widget overview</a>
            <a href="https://pay.slicechain.io/test-embed.html" target="_blank" rel="noopener noreferrer">
              Embed test page
            </a>
            <a href={contactPath}>Contact</a>
          </div>
          <div className="foot-col">
            <p className="foot-col-title">Platform</p>
            <a href="#mission">Mission & Vision</a>
            <a href="#about">About</a>
            <a href="#team">Team</a>
            <a href="#marketing">How it works</a>
            <a href="#gallery">Gallery</a>
          </div>
        </div>
        <div className="foot-bot">
          <span className="foot-bot-side">{footer.copyright}</span>
          <p className="foot-disclaimer">
            Payment platform · Not a bank or money transmitter
            <br />
            <a href={termsPath} style={{ color: "inherit", textDecoration: "underline" }}>
              Terms and Conditions
            </a>
            {" · "}
            <a href={privacyPath} style={{ color: "inherit", textDecoration: "underline" }}>
              Privacy Policy
            </a>
          </p>
          <span className="foot-bot-side foot-bot-end">{brandMark} · Built for merchants</span>
        </div>
      </div>
    </footer>
  );
}
