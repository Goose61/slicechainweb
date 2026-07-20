import { team } from "@/content/landing-content";

export function LandingTeam() {
  return (
    <section className="section team" id="team">
      <div className="wrap">
        <div className="section-num" data-reveal>
          04 · {team.subtitle}
        </div>
        <div className="team-head" data-reveal style={{ ["--d" as string]: "100ms" }}>
          <h2 className="title">
            Driven by <span className="it">People</span>.
            <br />
            Built for <span className="it">Progress</span>.
          </h2>
        </div>

        <div className="team-grid" data-reveal style={{ ["--d" as string]: "200ms" }}>
          {team.members.map((member) => (
            <article key={member.name} className="team-card">
              <div className="team-photo">
                <img
                  src={member.photo}
                  alt={`${member.name}, ${member.role} at SlicePay crypto payment gateway`}
                  loading="lazy"
                  style={{ objectPosition: member.photoPosition || "center center" }}
                />
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="team-linkedin"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
