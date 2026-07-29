import type { Metadata } from "next";
import Link from "next/link";
import { social } from "@/content/landing-content";
import { pageSeo } from "@/content/seo-metadata";

export const metadata: Metadata = pageSeo.contact;

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-slate-100">
      <header className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to SlicePay
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-white">Contact SlicePay</h1>
        <p className="mt-4 text-slate-300 leading-relaxed">
          Merchant support, website pay widget integration help, and partnership inquiries.
        </p>
        <dl className="mt-10 space-y-6 text-sm">
          <div>
            <dt className="text-slate-500 uppercase tracking-wide text-xs">Email</dt>
            <dd className="mt-1">
              <a href={social.email} className="text-violet-300 hover:text-violet-200">
                {social.emailDisplay}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 uppercase tracking-wide text-xs">Integration guide</dt>
            <dd className="mt-1">
              <Link href="/website-pay-widget/" className="text-violet-300 hover:text-violet-200">
                Website Pay Widget documentation
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 uppercase tracking-wide text-xs">Social</dt>
            <dd className="mt-1 flex gap-4">
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-violet-300 hover:text-violet-200">
                X / Twitter
              </a>
              <a href={social.telegram} target="_blank" rel="noopener noreferrer" className="text-violet-300 hover:text-violet-200">
                Telegram
              </a>
            </dd>
          </div>
        </dl>
        <p className="mt-10 text-xs text-slate-500">
          SliceChain Holdings Inc. · Published <time dateTime="2026-07-29">July 29, 2026</time>
        </p>
      </main>
    </div>
  );
}
