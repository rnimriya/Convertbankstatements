import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Check, X } from "lucide-react";

const PAGE_URL = "https://www.convertstatement.online/compare/synder-alternative";

export const metadata: Metadata = {
  title: "Synder Alternative — Free File-Based Payout Conversion | Convert Statement",
  description:
    "Looking for a Synder alternative? Convert Statement is a file-based converter with a free lite tier: turn Stripe, PayPal, Amazon, and Shopify payout CSVs into QuickBooks-ready clearing-account entries. Compare honestly — including when live sync (Synder) is the better fit.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Synder Alternative — Free File-Based Payout Conversion",
    description:
      "Convert Statement vs Synder, honestly: file conversion with a free tier vs live sync. See which fits your business.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "Is Convert Statement a replacement for Synder?",
    a: "For file-based work, yes; for live sync, no. If you export a payout CSV once a month and want it converted into correct clearing-account entries, Convert Statement does that free for the summary tier. If you want every Stripe or PayPal transaction pushed into QuickBooks automatically as it happens, that is live sync — Synder's product — and a file converter cannot replace it.",
  },
  {
    q: "What does Convert Statement do that Synder does not?",
    a: "It converts files Synder does not touch: PDF bank statements into QBO/CSV, any bank CSV into QBO, and it diagnoses broken QBO files with a duplicate finder, a file checker, and a reconciliation difference finder. It also offers a free tier for scanning and CSV exports with no account required.",
  },
  {
    q: "What does Synder do that Convert Statement does not?",
    a: "Live, ongoing synchronization: Synder connects to your payment platforms and QuickBooks and keeps them in sync without file exports. Convert Statement is file-based today; direct push into QuickBooks is in development (sandbox today) and is marked “Coming Soon” on pricing until it is live.",
  },
  {
    q: "How much does each cost?",
    a: "Convert Statement's pricing is on its pricing page: a free tier (8 statement pages, CSV and Excel exports) and Pro at $20/month for QBO/QFX/OFX exports and bulk conversion. Synder's pricing changes over time and depends on the plan — check Synder's own site for its current prices rather than trusting a comparison page.",
  },
  {
    q: "Can I use both?",
    a: "Yes, and some businesses do: live sync for the platforms that need it, and Convert Statement for the one-off jobs — a historical cleanup, a bank statement PDF, a payout export from a platform Synder does not cover, or a file that will not import and needs diagnosing.",
  },
];

const ROWS: { feature: string; us: string | boolean; them: string | boolean }[] = [
  { feature: "How it works", us: "File-based: upload a CSV or PDF, download QBO/CSV", them: "Live sync: connects platforms to QuickBooks continuously" },
  { feature: "Stripe payout conversion", us: true, them: true },
  { feature: "PayPal payout conversion", us: true, them: true },
  { feature: "Amazon settlement conversion", us: true, them: true },
  { feature: "Shopify payout conversion", us: true, them: true },
  { feature: "PDF bank statement conversion", us: true, them: false },
  { feature: "Any bank CSV to QBO", us: true, them: false },
  { feature: "QBO duplicate finder & file checker", us: true, them: false },
  { feature: "Reconciliation difference finder", us: true, them: false },
  { feature: "Automatic ongoing sync", us: false, them: true },
  { feature: "Free tier for scanning & CSV exports", us: true, them: "Free trial only (no permanent free tier)" },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Check className="h-5 w-5 text-emerald-500 mx-auto" />;
  if (v === false) return <X className="h-5 w-5 text-zinc-300 dark:text-zinc-600 mx-auto" />;
  return <span className="text-sm">{v}</span>;
}

export default function SynderAlternativePage() {
  const nonce = BUILD_NONCE;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main>
        <section className="w-full relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-20 dark:opacity-15 bg-blue-500 dark:bg-blue-600 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-10 pb-12">
            <div className="grid md:grid-cols-2 gap-10 items-center mb-6">
              <div>
              <span className="inline-block px-3 py-1 rounded-full bg-brand-surface text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-widest mb-4">
                Comparison
              </span>
              <h1 className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.07] mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                A Synder alternative, honestly compared
              </h1>
              <p className="text-[0.95rem] text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Synder is a live sync product. Convert Statement is a file converter with a
                free lite tier. They overlap on payout conversion — and differ everywhere
                else. Here is the honest version, including when Synder is the better fit.
              </p>
              </div>
              <figure className="m-0">
                <img src="/images/tools/synder-hero.webp" alt="Illustrative photo: a person comparing two payout reports, one on a laptop and one printed" width={1200} height={800} loading="eager" className="w-full rounded-2xl shadow-lg" style={{ aspectRatio: "3 / 2", objectFit: "cover" }} />
                <figcaption className="mt-2 text-center text-xs text-zinc-500">Illustration</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="py-24 bg-brand-bg">
          <div className="max-w-6xl mx-auto px-6">
            <figure className="m-0 mb-10 mx-auto max-w-3xl">
              <img src="/images/tools/synder-section.webp" alt="Illustrative photo: a laptop with generic payout charts beside a notebook with a pros-and-cons list" width={1200} height={800} loading="lazy" className="w-full rounded-2xl shadow" style={{ aspectRatio: "3 / 2", objectFit: "cover" }} />
              <figcaption className="mt-2 text-center text-xs text-zinc-500">Illustration</figcaption>
            </figure>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-5 py-3 text-left font-semibold text-zinc-500">Feature</th>
                    <th className="px-5 py-3 text-center font-bold text-zinc-900 dark:text-white">Convert Statement</th>
                    <th className="px-5 py-3 text-center font-bold text-zinc-900 dark:text-white">Synder</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.feature} className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="px-5 py-3 font-medium text-zinc-700 dark:text-zinc-300">{r.feature}</td>
                      <td className="px-5 py-3 text-center"><Cell v={r.us} /></td>
                      <td className="px-5 py-3 text-center"><Cell v={r.them} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              Synder's pricing and plan details change over time — check Synder's own site
              for current prices. Convert Statement's pricing is on{" "}
              <Link href="/pricing" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">its pricing page</Link>.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-14">
              <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
                <h2 className="font-bold text-zinc-900 dark:text-white text-lg">Pick Convert Statement when…</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed list-disc list-inside">
                  <li>You convert payouts or statements occasionally, not every day.</li>
                  <li>You need a free way to check or convert a file before committing.</li>
                  <li>You are cleaning up historical books, not syncing live data.</li>
                  <li>You have a PDF statement, a bank CSV, or a file QuickBooks refuses.</li>
                </ul>
                <Link href="/tools/free-stripe-to-quickbooks" className="mt-4 inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold px-5 py-2.5 rounded-lg hover:opacity-90">
                  Try the free payout converter
                </Link>
              </div>
              <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
                <h2 className="font-bold text-zinc-900 dark:text-white text-lg">Pick Synder when…</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed list-disc list-inside">
                  <li>You want transactions in QuickBooks automatically, as they happen.</li>
                  <li>You run high daily volume across several payment platforms.</li>
                  <li>Nobody on your team wants to handle file exports at month-end.</li>
                  <li>Live sync is worth an ongoing subscription for your business.</li>
                </ul>
                <p className="mt-4 text-sm text-zinc-500">
                  That is a real product difference, not a missing feature we can paper over
                  with a file download — direct push into QuickBooks is in development here
                  and stays marked “Coming Soon” until it is live.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-brand-surface border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-text text-center mb-12">Frequently asked questions</h2>
            <FAQAccordion items={FAQS} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
