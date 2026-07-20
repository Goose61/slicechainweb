import { howSteps, portalPath, slicePaySection } from "@/content/landing-content";
import { appUrl } from "@/lib/appUrl";

export function LandingHow() {
  const portalHref = appUrl(portalPath);

  return (
    <section className="section how" id="marketing">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num" data-reveal>
              05 · {slicePaySection.subtitle}
            </div>
            <h2 className="title" data-reveal style={{ ["--d" as string]: "100ms" }}>
              {slicePaySection.title}
            </h2>
          </div>
          <div className="meta" data-reveal style={{ ["--d" as string]: "200ms" }}>
            <p className="serif" style={{ fontStyle: "italic" }}>
              {slicePaySection.text}
            </p>
            <a href={portalHref} className="btn btn-gold" style={{ marginTop: 8 }}>
              {slicePaySection.cta.label} <span className="arrow">→</span>
            </a>
          </div>
        </div>

        <div className="how-steps" data-reveal style={{ ["--d" as string]: "300ms" }}>
          {howSteps.map((step) => (
            <div key={step.step} className="how-step">
              <div className="step-num">{step.step}</div>
              <h3 className="step-title">
                <em>{step.title}</em>
              </h3>
              <p className="step-body">{step.body}</p>
              <a href={step.cta.href} className="btn" style={{ marginTop: "auto" }}>
                {step.cta.label} <span className="arrow">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
