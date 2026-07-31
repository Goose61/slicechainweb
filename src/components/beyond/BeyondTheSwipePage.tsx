"use client";

import Link from "next/link";
import { brandMark, logo } from "@/content/landing-content";
import { beyondContent } from "@/content/beyond-content";
import { FoundersBriefForm } from "./FoundersBriefForm";

export function BeyondTheSwipePage() {
  return (
    <div className="beyond-page">
      <header className="bts-shell bts-header">
        <Link className="bts-brand" href="/" aria-label="Back to SlicePay home">
          <img src={logo} alt="" width={48} height={48} />
          <span className="bts-brand-lockup">
            <span className="bts-brand-name">{brandMark}</span>
            <span className="bts-brand-company">by SliceChain Holdings Inc.</span>
          </span>
        </Link>
        <span className="bts-edition">{beyondContent.edition}</span>
      </header>

      <main>
        <section className="bts-shell bts-hero" aria-labelledby="bts-page-title">
          <div className="bts-hero-copy">
            <p className="bts-section-index">{beyondContent.sectionIndex}</p>
            <h1 className="bts-title" id="bts-page-title">
              {beyondContent.titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className="bts-subtitle">{beyondContent.subtitle}</p>
            <p className="bts-thesis">{beyondContent.thesis}</p>
            <p className="bts-description">{beyondContent.description}</p>

            <div className="bts-brief-inside">
              <h2>{beyondContent.briefInsideTitle}</h2>
              <ul className="bts-brief-list">
                {beyondContent.briefItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="bts-evidence-line">{beyondContent.evidenceLine}</p>
            </div>
          </div>

          <aside className="bts-conversion-panel" aria-label="Request the Founder's Brief">
            <div className="bts-panel">
              <div className="bts-report-preview" aria-hidden="true">
                <div className="bts-preview-brand">
                  <img src={logo} alt="" width={32} height={32} />
                  <span>{brandMark}</span>
                </div>
                <p className="bts-preview-edition">{beyondContent.previewEdition}</p>
                <p className="bts-preview-title">
                  Beyond
                  <br />
                  the Swipe
                </p>
                <p className="bts-preview-topic">{beyondContent.previewTopic}</p>
              </div>
              <FoundersBriefForm source="beyond_the_swipe_page" />
            </div>
          </aside>
        </section>

        <section className="bts-value-strip" aria-label="Brief themes">
          <div className="bts-shell bts-value-strip-inner">
            {beyondContent.valueStrip.map((item) => (
              <div className="bts-value-item" key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bts-shell bts-footer">
        <span>© 2026 SliceChain Holdings Inc. All rights reserved.</span>
        <span>
          <Link href="/">slicechain.io</Link>
          &nbsp;·&nbsp; Research and market analysis
        </span>
      </footer>
    </div>
  );
}
