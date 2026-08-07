"use client";

import Link from "next/link";
import { brandMark, logo } from "@/content/landing-content";
import { greenerAudiences, greenerContent } from "@/content/greener-content";
import { CaseStudyLeadForm } from "./CaseStudyLeadForm";

export function GreenInitiativePage() {
  return (
    <div className="beyond-page greener-page">
      <header className="bts-shell bts-header">
        <Link className="bts-brand" href="/" aria-label="Back to SlicePay home">
          <img src={logo} alt="" width={48} height={48} />
          <span className="bts-brand-lockup">
            <span className="bts-brand-name">{brandMark}</span>
            <span className="bts-brand-company">by SliceChain Holdings Inc.</span>
          </span>
        </Link>
        <span className="bts-edition">{greenerContent.pageTitle}</span>
      </header>

      <main>
        <section className="bts-shell bts-hero" aria-labelledby="greener-page-title">
          <div className="bts-hero-copy">
            <p className="bts-section-index">{greenerContent.sectionIndex}</p>
            <h1 className="bts-title" id="greener-page-title">
              {greenerContent.titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className="bts-subtitle">{greenerContent.subtitle}</p>
            <p className="bts-thesis">{greenerContent.thesis}</p>
            <p className="bts-description">{greenerContent.description}</p>

            <div className="bts-brief-inside">
              <h2>{greenerContent.briefInsideTitle}</h2>
              <ul className="bts-brief-list">
                {greenerContent.briefItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="bts-evidence-line">{greenerContent.evidenceLine}</p>
            </div>
          </div>

          <aside className="bts-conversion-panel" aria-label="Request the Green Initiative case study">
            <div className="bts-panel">
              <div className="bts-report-preview" aria-hidden="true">
                <div className="bts-preview-brand">
                  <img src={logo} alt="" width={32} height={32} />
                  <span>{brandMark}</span>
                </div>
                <p className="bts-preview-edition">{greenerContent.previewEdition}</p>
                <p className="bts-preview-title">
                  The Hidden
                  <br />
                  Receipt
                </p>
                <p className="bts-preview-topic">{greenerContent.previewTopic}</p>
              </div>
              <CaseStudyLeadForm
                audiences={greenerAudiences}
                content={greenerContent}
                briefType="green_initiative"
                source="greener_case_study_page"
              />
            </div>
          </aside>
        </section>

        <section className="bts-value-strip" aria-label="Case study highlights">
          <div className="bts-shell bts-value-strip-inner">
            {greenerContent.valueStrip.map((item) => (
              <div className="bts-value-item" key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bts-shell bts-footer">
        <span>{greenerContent.pageTitle}</span>
        <span>
          <Link href="/">slicechain.io</Link>
          &nbsp;·&nbsp; © 2026 SliceChain Holdings Inc.
        </span>
      </footer>
    </div>
  );
}
