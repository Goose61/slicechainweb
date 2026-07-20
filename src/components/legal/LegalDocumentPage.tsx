import Link from "next/link";
import { legalMeta } from "@/content/legal-content";

type Section = { heading: string; body: string };

function formatInline(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong class='text-white font-medium'>$1</strong>");
}

function renderBody(body: string) {
  const blocks = body.split("\n\n");

  return blocks.map((block, blockIndex) => {
    const lines = block.split("\n");
    const bulletLines = lines.filter((line) => line.startsWith("- "));

    if (bulletLines.length > 0) {
      const intro = lines.filter((line) => !line.startsWith("- ")).join(" ");
      return (
        <div key={blockIndex} className="space-y-3">
          {intro ? (
            <p
              className="text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatInline(intro) }}
            />
          ) : null}
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            {bulletLines.map((line) => (
              <li
                key={line}
                dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }}
              />
            ))}
          </ul>
        </div>
      );
    }

    return (
      <p
        key={blockIndex}
        className="text-slate-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatInline(block.replace(/\n/g, "<br />")) }}
      />
    );
  });
}

export function LegalDocumentPage({
  title,
  lastUpdated,
  sections,
}: {
  title: string;
  lastUpdated: string;
  sections: Section[];
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="mb-10">
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to {legalMeta.product}
          </Link>
          <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-white">{title}</h1>
          <p className="mt-3 text-slate-400 text-sm">
            {legalMeta.company} · Last updated {lastUpdated}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
              <div className="space-y-4">{renderBody(section.body)}</div>
            </section>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
          <Link href="/terms/" className="hover:text-white transition-colors">
            Terms and Conditions
          </Link>
          <Link href="/privacy/" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <a href={`mailto:${legalMeta.contactEmail}`} className="hover:text-white transition-colors">
            {legalMeta.contactEmail}
          </a>
        </div>
      </div>
    </div>
  );
}
