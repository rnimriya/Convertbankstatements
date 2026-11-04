import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Check, X } from "lucide-react";

const PAGE_URL = "https://www.convertstatement.online/compare/nanonets-alternative";

export const metadata: Metadata = {
  title: "Nanonets Alternative — Self-Serve Statement Conversion With Pricing Up Front | Convert Statement",
  description:
    "Looking for a Nanonets alternative for bank statements? Convert Statement is a self-serve converter with published pricing (free 8 pages, Pro $20/month), QBO/OFX export and 25 free QuickBooks tools — no sales call. Honest comparison, including when Nanonets is the better fit.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Nanonets Alternative — Self-Serve Statement Conversion",
    description:
      "Convert Statement vs Nanonets, honestly: self-serve file conversion with published pricing vs an enterprise API platform.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "Is Convert Statement a replacement for Nanonets?",
    a: "For converting a bank statement PDF into a spreadsheet or QuickBooks file, yes. For Nanonets' core product — an enterprise AI document-processing platform with APIs and custom workflows that engineering teams embed in their own systems — no. Convert Statement is a self-serve tool you use in the browser; it is not an enterprise IDP platform, and it does not pretend to be.",
  },
  {
    q: "What does Convert Statement do that Nanonets does not?",
    a: "It publishes its pricing (free, $5, $20 and $75 tiers), exports QBO and OFX files for QuickBooks — formats the Nanonets converter page does not list — exports to Google Sheets on Pro, and offers 25 QuickBooks file tools, with the 6 bulk tools free and no signup. You can start in minutes without talking to a sales team.",
  },
  {
    q: "What does Nanonets do that Convert Statement does not?",
    a: "Nanonets is a broad, API-first document platform: many document types, custom extraction models and workflows, and enterprise onboarding. Its free bank statement converter page is one entry point into that platform. If you are building document extraction into your own product at scale, that is Nanonets' home ground. Neither product offers live sync into QuickBooks — Convert Statement is file-based, and Nanonets' converter is an extraction tool, not a QuickBooks connection.",
  },
  {
    q: "How much does each cost?",
    a: "Convert Statement: free with 8 pages, Basic $5/month for 25 pages, Pro $20/month for 500 pages, Business $75/month for 2,000 pages — see our pricing page. Nanonets does not publish a comparable self-serve price for its converter in the sources checked in November 2026; its pricing is custom and enterprise-oriented. See the vendor's site for current pricing rather than trusting any figure on a comparison page.",
  },
  {
    q: "Can I use both?",
    a: "Yes, and larger teams sometimes do: Nanonets as embedded infrastructure for high-volume document pipelines, and Convert Statement for the ad-hoc jobs — one client's historical statements, a QBO file that needs building or fixing — where opening a platform account would be overkill. Convert Statement's free tier and free tools cost nothing to keep on hand.",
  },
];

const ROWS: { feature: string; us: string | boolean; them: string | boolean }[] = [
  { feature: "How it works", us: "File-based: upload a PDF, download Excel/CSV/OFX/QBO", them: "Enterprise AI document platform; converter is one feature" },
  { feature: "PDF bank statement conversion", us: true, them: true },
  { feature: "Free tier", us: "8 pages free, no credit card", them: "Free converter tool page; platform pricing is custom" },
  { feature: "Starting price (published)", us: "Basic $5/mo (25 pages); Pro $20/mo (500 pages)", them: "See the vendor's site for current pricing" },
  { feature: "Transparent self-serve pricing", us: true, them: false },
  { feature: "QBO export for QuickBooks", us: true, them: false },
  { feature: "OFX export", us: true, them: false },
  { feature: "Google Sheets export", us: true, them: false },
  { feature: "Free QuickBooks file tools (bulk import/export/delete, QBO editor & merger)", us: true, them: false },
  { feature: "API access", us: true, them: true },
  { feature: "Enterprise IDP platform & custom workflows", us: false, them: true },
  { feature: "Live sync into QuickBooks", us: false, them: false },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Check className="h-5 w-5 text-[#007A33] mx-auto" />;
  if (v === false) return <X className="h-5 w-5 text-zinc-300 mx-auto" />;
  return <span className="text-sm">{v}</span>;
}

export default function NanonetsAlternativePage() {
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
                A Nanonets alternative, <span className="agri-serif">honestly compared</span>
              </h1>
              <p className="text-[0.95rem] text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                Nanonets is an AI-powered document-processing platform; bank statement
                conversion is one feature of an enterprise product sold with custom
                pricing. Convert Statement is a self-serve statement converter with its
                prices on a public page and a free tier. Here is the honest version,
                including when Nanonets is the better fit.
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
                    <th className="px-5 py-3 text-center font-bold text-zinc-900">Nanonets</th>
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
              Nanonets does not publish a comparable converter price on the pages checked
              November 2026 — see the vendor&apos;s site for current pricing. Convert
              Statement&apos;s pricing is on{" "}
              <Link href="/pricing" className="text-[#007A33] font-semibold hover:underline">its pricing page</Link>.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-14">
              <div className="rounded-[24px] border border-[#CBE3C4] bg-[#F2F4EC] p-6">
                <h2 className="font-bold text-zinc-900 text-lg">When Nanonets is the better choice</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 leading-relaxed list-disc list-inside">
                  <li>You are embedding document extraction into your own software via API.</li>
                  <li>You process many document types, not just bank statements, at enterprise volume.</li>
                  <li>You need custom extraction models, workflows and enterprise onboarding.</li>
                  <li>A sales-led, custom-priced contract is normal for your organisation.</li>
                </ul>
                <p className="mt-4 text-sm text-zinc-500">
                  That platform depth is the product. A browser converter is not a substitute
                  for it, and this page does not claim otherwise.
                </p>
              </div>
              <div className="rounded-[24px] border border-[#CBE3C4] bg-[#F2F4EC] p-6">
                <h2 className="font-bold text-zinc-900 text-lg">When Convert Statement is the better choice</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 leading-relaxed list-disc list-inside">
                  <li>You are a bookkeeper, CPA or small firm with a statement in hand, not a platform to build.</li>
                  <li>You want the price before you start: free, $5, $20 or $75 — published.</li>
                  <li>You need a QBO or OFX file for QuickBooks, not just a spreadsheet.</li>
                  <li>You also need free QuickBooks file tools — bulk import, export, delete, QBO editing and merging.</li>
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
