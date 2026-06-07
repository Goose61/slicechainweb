import { roadmap } from "@/content/landing-content";

export function LandingRoadmap() {
  return (
    <section className="section plan" id="plan">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="section-num" data-reveal>
              08 · The Plan
            </div>
            <h2 className="title" data-reveal style={{ ["--d" as string]: "100ms" }}>
              The <span className="it">Platform</span>
              <br />
              <span className="stroked">Roadmap</span>
            </h2>
          </div>
          <div className="meta" data-reveal style={{ ["--d" as string]: "200ms" }}>
            <p className="serif" style={{ fontStyle: "italic" }}>
              Building a scalable payment and rewards ecosystem, one slice at a time.
            </p>
          </div>
        </div>
        <div className="plan-timeline" data-reveal style={{ ["--d" as string]: "300ms" }}>
          {roadmap.phases.map((phase) => (
            <div key={phase.chap} className="plan-phase">
              {phase.state && <div className={`state ${phase.state}`}>{phase.state === "live" ? "Live" : "Next"}</div>}
              <div className="chap">{phase.chap}</div>
              <div className="era">{phase.era}</div>
              <div className="name">{phase.name}</div>
              <ul>
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
