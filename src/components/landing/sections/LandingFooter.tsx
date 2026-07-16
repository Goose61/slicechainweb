import { brandMark, brandName, businessLoginPath, employeeLoginPath, footer, logo, navLinks, portalPath, social } from "@/content/landing-content";
import { ContactLink } from "../ContactLink";

export function LandingFooter() {
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
            <div className="foot-soc-links">
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" title="X / Twitter" className="foot-soc-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href={social.telegram} target="_blank" rel="noopener noreferrer" title="Telegram" className="foot-soc-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.783-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>
            <p style={{ marginTop: 16, fontSize: 13, color: "var(--bone-dim)" }}>
              <ContactLink />
            </p>
          </div>
          <div className="foot-col">
            <h5>Navigate</h5>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="foot-col">
            <h5>Portals</h5>
            <a href={portalPath}>Business signup</a>
            <a href={businessLoginPath}>Business login</a>
            <a href={employeeLoginPath}>Employee login</a>
            <ContactLink>Support</ContactLink>
          </div>
          <div className="foot-col">
            <h5>Platform</h5>
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
            <a href="/terms" style={{ color: "inherit", textDecoration: "underline" }}>
              Terms and Conditions
            </a>
            {" · "}
            <a href="/privacy" style={{ color: "inherit", textDecoration: "underline" }}>
              Privacy Policy
            </a>
          </p>
          <span className="foot-bot-side foot-bot-end">{brandMark} · Built for merchants</span>
        </div>
      </div>
    </footer>
  );
}
