import Link from "next/link";
import type { GuideSection } from "@/content/pay-widget-content";

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-emerald-100/90">
      <code className={`language-${lang || "text"}`}>{code}</code>
    </pre>
  );
}

function renderParagraph(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-white font-medium">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export function IntegrationGuidePage({
  title,
  description,
  lastUpdated,
  author,
  sections,
}: {
  title: string;
  description: string;
  lastUpdated: string;
  author: string;
  sections: GuideSection[];
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-slate-100">
      <header className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to SlicePay
          </Link>
          <Link href="/#pay-widget" className="text-sm text-violet-300 hover:text-violet-200 transition-colors">
            Website Pay Widget
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-violet-300/80">Developer guide</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold text-white">{title}</h1>
        <p className="mt-4 text-lg text-slate-300 leading-relaxed">{description}</p>
        <p className="mt-3 text-sm text-slate-500">
          By <span className="text-slate-400">{author}</span> · Updated{" "}
          <time dateTime={lastUpdated}>{lastUpdated}</time>
        </p>

        <nav aria-label="Guide sections" className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-medium text-white mb-3">On this page</p>
          <ol className="grid gap-2 sm:grid-cols-2 text-sm text-slate-300">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:text-violet-300 transition-colors">
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="mt-12 space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
              {section.body ? (
                <p className="mt-4 text-slate-300 leading-relaxed">{renderParagraph(section.body)}</p>
              ) : null}
              {section.bullets ? (
                <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-300">
                  {section.bullets.map((item) => (
                    <li key={item}>{renderParagraph(item)}</li>
                  ))}
                </ul>
              ) : null}
              {section.code ? <CodeBlock code={section.code} lang={section.codeLang} /> : null}
            </section>
          ))}
        </article>
      </main>
    </div>
  );
}
