import { securitySection } from "@/content/landing-content";

export function LandingSecurity() {
  return (
    <section className="section security" id="security">
      <div className="wrap">
        <div className="section-num" data-reveal>
          08 · {securitySection.subtitle}
        </div>
        <div className="section-head">
          <div>
            <h2 className="title" data-reveal style={{ ["--d" as string]: "100ms" }}>
              {securitySection.titleLead} <span className="it">{securitySection.titleEm}</span>
            </h2>
          </div>
          <div className="meta" data-reveal style={{ ["--d" as string]: "200ms" }}>
            <p>{securitySection.lede}</p>
            <ul className="security-points">
              {securitySection.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="security-actions">
              <a href={securitySection.reportHref} className="btn btn-ghost">
                {securitySection.reportLabel} <span className="arrow">→</span>
              </a>
              <a href={securitySection.downloadHref} className="btn btn-ghost" download>
                {securitySection.downloadLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
