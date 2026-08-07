import Link from "next/link";
import { brandMark, logo } from "@/content/landing-content";
import { caseStudies, caseStudiesIndex } from "@/content/case-studies-content";

export function CaseStudiesPage() {
  return (
    <div className="case-studies-page">
      <header className="cs-shell cs-header">
        <Link className="cs-brand" href="/" aria-label="Back to SlicePay home">
          <img src={logo} alt="" width={48} height={48} />
          <span className="cs-brand-lockup">
            <span className="cs-brand-name">{brandMark}</span>
            <span className="cs-brand-company">by SliceChain Holdings Inc.</span>
          </span>
        </Link>
        <span className="cs-header-label">{caseStudiesIndex.pageTitle}</span>
      </header>

      <main className="cs-shell">
        <section className="cs-hero" aria-labelledby="case-studies-title">
          <p className="cs-section-label">{caseStudiesIndex.sectionLabel}</p>
          <h1 className="cs-title" id="case-studies-title">
            {caseStudiesIndex.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="cs-subtitle">{caseStudiesIndex.subtitle}</p>
          <p className="cs-intro">{caseStudiesIndex.intro}</p>
        </section>

        <section className="cs-grid" aria-label="Available case studies">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={study.path}
              className={`cs-card cs-card--${study.theme}`}
            >
              <div className="cs-card-top">
                <span className="cs-card-index">{study.index}</span>
                <span className="cs-card-edition">{study.edition}</span>
              </div>
              <h2 className="cs-card-title">{study.title}</h2>
              <p className="cs-card-subtitle">{study.subtitle}</p>
              <p className="cs-card-excerpt">{study.excerpt}</p>
              <ul className="cs-card-highlights">
                {study.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <span className="cs-card-cta">
                {study.cta} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </section>
      </main>

      <footer className="cs-shell cs-footer">
        <span>{caseStudiesIndex.pageTitle}</span>
        <span>
          <Link href="/">slicechain.io</Link>
          &nbsp;·&nbsp; © 2026 SliceChain Holdings Inc.
        </span>
      </footer>
    </div>
  );
}
