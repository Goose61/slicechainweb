import Link from "next/link";
import { brandMark, logo, securityReportMarkdownPath, securityReportPdfPath } from "@/content/landing-content";
import { formatInline, parseSecurityMarkdown } from "@/lib/parseSecurityReport";

export function SecurityReportPage({ markdown }: { markdown: string }) {
  const report = parseSecurityMarkdown(markdown);

  return (
    <div className="case-studies-page security-report-page">
      <header className="cs-shell cs-header">
        <Link className="cs-brand" href="/" aria-label="Back to SlicePay home">
          <img src={logo} alt="" width={48} height={48} />
          <span className="cs-brand-lockup">
            <span className="cs-brand-name">{brandMark}</span>
            <span className="cs-brand-company">by SliceChain Holdings Inc.</span>
          </span>
        </Link>
        <span className="cs-header-label">Security report</span>
      </header>

      <main className="cs-shell sr-main">
        <p className="cs-section-label">Gateway recheck · 1 October 2026</p>
        <h1 className="sr-title">{report.title}</h1>
        <p className="sr-intro">
          A source review of SlicePay checkout and gateway invoice controls. This page is the full report.
          Download it as a PDF or as Markdown.
        </p>
        <div className="sr-actions">
          <a className="sr-btn sr-btn-primary" href={securityReportPdfPath} download>
            Download PDF
          </a>
          <a className="sr-btn" href={securityReportMarkdownPath} download>
            Download Markdown
          </a>
        </div>

        <article className="sr-article">
          {report.blocks.map((block, index) => {
            if (block.type === "h2") {
              return <h2 key={index}>{block.text}</h2>;
            }
            if (block.type === "p") {
              return <p key={index} dangerouslySetInnerHTML={{ __html: formatInline(block.text) }} />;
            }
            if (block.type === "ul") {
              return (
                <ul key={index}>
                  {block.items.map((item) => (
                    <li key={item} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
                  ))}
                </ul>
              );
            }
            if (block.type === "ol") {
              return (
                <ol key={index}>
                  {block.items.map((item) => (
                    <li key={item} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
                  ))}
                </ol>
              );
            }
            return (
              <div className="sr-table-wrap" key={index}>
                <table className="sr-table">
                  <thead>
                    <tr>
                      {block.headers.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.join("|")}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </article>
      </main>

      <footer className="cs-shell cs-footer">
        <span>SlicePay gateway security recheck</span>
        <span>
          <Link href="/">slicechain.io</Link>
          &nbsp;·&nbsp; © 2026 SliceChain Holdings Inc.
        </span>
      </footer>
    </div>
  );
}
