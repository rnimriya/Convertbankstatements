import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Check, X } from "lucide-react";

const PAGE_URL = "https://www.convertstatement.online/compare/moneythumb-alternative";

export const metadata: Metadata = {
  title: "MoneyThumb Alternative — One Web Converter, Free Tier Included | Convert Statement",
  description:
    "Looking for a MoneyThumb alternative? Convert Statement is one web converter for PDF statements to Excel, CSV, OFX and QBO — free 8 pages, Pro $20/month — plus 25 free QuickBooks tools. Honest comparison, including when MoneyThumb's desktop tools are the better fit.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "MoneyThumb Alternative — One Web Converter, Free Tier Included",
    description:
      "Convert Statement vs MoneyThumb, honestly: one browser converter with a free tier vs desktop and per-tool converters.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "Is Convert Statement a replacement for MoneyThumb?",
    a: "For converting statement PDFs into QBO, OFX, QFX-ready and spreadsheet files in a browser, yes. MoneyThumb's desktop licences are a different buying model — installed software you own per machine — and if that model is why you chose MoneyThumb, a web subscription is not a like-for-like replacement. Neither product offers live sync into QuickBooks; both are file-based.",
  },
  {
    q: "What does Convert Statement do that MoneyThumb does not?",
    a: "It works as one converter in the browser with nothing to install, offers a permanent free tier (8 pages) instead of a trial, publishes simple per-page pricing, exports to Google Sheets on Pro, and includes 25 QuickBooks file tools — bulk importer, exporter, deleter, QBO editor and merger — with the 6 bulk tools free and no signup.",
  },
  {
    q: "What does MoneyThumb do that Convert Statement does not?",
    a: "MoneyThumb offers mature desktop software (converters such as pdf2qbo and pdf2csv) that runs on your own computer, a long US track record with QuickBooks Desktop and Quicken formats, and a separate lender-focused fraud-detection product line. If your books live in QuickBooks Desktop and you prefer installed software, that is a genuine fit. Convert Statement has no desktop app.",
  },
  {
    q: "How much does each cost?",
    a: "Convert Statement: free with 8 pages, Basic $5/month for 25 pages, Pro $20/month for 500 pages, Business $75/month for 2,000 pages — see our pricing page. MoneyThumb's published pricing in sources checked in November 2026 starts from $24.95/month for its online converters, with desktop software from $599.95+. Verify MoneyThumb's current figure on MoneyThumb's own site before you decide, as its per-tool pricing varies by product.",
  },
  {
    q: "Can I try Convert Statement before switching?",
    a: "Yes. Convert a real statement on the free tier (8 pages, CSV and Excel, no credit card) and, if you need QuickBooks formats, compare a Pro QBO export against the MoneyThumb output you already know. The free QuickBooks file tools need no signup at all.",
  },
];

const ROWS: { feature: string; us: string | boolean; them: string | boolean }[] = [
  { feature: "How it works", us: "File-based, in the browser: upload a PDF, download Excel/CSV/OFX/QBO", them: "File-based: desktop apps plus online converters, sold per tool" },
  { feature: "PDF bank statement conversion", us: true, them: true },
  { feature: "Free tier", us: "8 pages free, no credit card", them: "Free trial only (no permanent free tier)" },
  { feature: "Starting price (published)", us: "Basic $5/mo (25 pages); Pro $20/mo (500 pages)", them: "From $24.95/mo online; desktop from $599.95+" },
  { feature: "QBO export for QuickBooks", us: true, them: true },
  { feature: "OFX / QFX export", us: true, them: true },
  { feature: "Google Sheets export", us: true, them: false },
  { feature: "One converter for all formats", us: true, them: "Separate tools per conversion (pdf2qbo, pdf2csv, …)" },
  { feature: "Free QuickBooks file tools (bulk import/export/delete, QBO editor & merger)", us: true, them: false },
  { feature: "Desktop software (installed, runs locally)", us: false, them: true },
  { feature: "Live sync into QuickBooks", us: false, them: false },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Check className="h-5 w-5 text-[#007A33] mx-auto" />;
  if (v === false) return <X className="h-5 w-5 text-zinc-300 mx-auto" />;
  return <span className="text-sm">{v}</span>;
}

export default function MoneyThumbAlternativePage() {
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
    <div className="agri-sans">
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar dark />
      <main>
        <section className="w-full relative overflow-hidden bg-[#0B1F16]">
          <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,0.38), rgba(19,84,28,0.28) 55%, transparent 75%)" }} />
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-[124px] pb-12">
            <div className="text-center mb-6 max-w-4xl mx-auto">
              <span className="agri-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#B9D6B2] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                Comparison
              </span>
              <h1 className="font-extrabold text-white tracking-tight leading-[1.07] mb-4" style={{ fontSize: "clamp(1.28rem, 2.4vw, 1.92rem)" }}>
                A MoneyThumb alternative, <span className="agri-serif">honestly compared</span>
              </h1>
              <p className="text-[0.95rem] text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                MoneyThumb is a mature, US-focused maker of PDF-to-accounting converters —
                desktop apps and online tools that produce QBO and QFX files for
                QuickBooks Desktop and Quicken. Convert Statement does the same conversion
                as one web tool with a free tier. Here is the honest version, including
                when MoneyThumb is the better fit.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="overflow-x-auto rounded-[24px] border border-[#CBE3C4] bg-white">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#CBE3C4]">
                    <th className="px-5 py-3 text-left font-semibold text-zinc-500">Feature</th>
                    <th className="px-5 py-3 text-center font-bold text-zinc-900">Convert Statement</th>
                    <th className="px-5 py-3 text-center font-bold text-zinc-900">MoneyThumb</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.feature} className="border-b border-[#CBE3C4]">
                      <td className="px-5 py-3 font-medium text-zinc-700">{r.feature}</td>
                      <td className="px-5 py-3 text-center"><Cell v={r.us} /></td>
                      <td className="px-5 py-3 text-center"><Cell v={r.them} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              MoneyThumb pricing is from published comparison sources checked November 2026
              and varies by tool — check MoneyThumb&apos;s own site for current prices.
              Convert Statement&apos;s pricing is on{" "}
              <Link href="/pricing" className="text-[#007A33] font-semibold hover:underline">its pricing page</Link>.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-14">
              <div className="rounded-[24px] border border-[#CBE3C4] bg-[#F2F4EC] p-6">
                <h2 className="font-bold text-zinc-900 text-lg">When MoneyThumb is the better choice</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 leading-relaxed list-disc list-inside">
                  <li>You want desktop software installed on your machine, not a web app.</li>
                  <li>Your workflow is centred on QuickBooks Desktop or Quicken.</li>
                  <li>You prefer owning single-purpose converters (pdf2qbo, pdf2csv) outright.</li>
                  <li>You value a long-established US vendor for this exact format work.</li>
                </ul>
                <p className="mt-4 text-sm text-zinc-500">
                  Desktop ownership is a real preference, not a gap a browser tool can argue
                  away — Convert Statement has no desktop app and is not building one for this comparison.
                </p>
              </div>
              <div className="rounded-[24px] border border-[#CBE3C4] bg-[#F2F4EC] p-6">
                <h2 className="font-bold text-zinc-900 text-lg">When Convert Statement is the better choice</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 leading-relaxed list-disc list-inside">
                  <li>You want one converter in the browser — nothing to install or licence per machine.</li>
                  <li>You want a permanent free tier (8 pages) instead of a trial.</li>
                  <li>You want simple published pricing: Pro is $20/month for 500 pages.</li>
                  <li>You also need free QuickBooks file tools: bulk import, export, delete, QBO editing and merging.</li>
                  <li>You prefer files processed in memory, not stored.</li>
                </ul>
                <Link href="/" className="mt-4 inline-flex items-center gap-2 bg-[#0B1F16] text-white font-semibold px-5 py-2.5 rounded-full">
                  Convert a statement free
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#F2F4EC] border-t border-[#CBE3C4]">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 text-center mb-12">Frequently asked questions</h2>
            <FAQAccordion items={FAQS} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
