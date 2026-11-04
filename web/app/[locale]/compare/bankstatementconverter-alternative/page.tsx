import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Check, X } from "lucide-react";

const PAGE_URL = "https://www.convertstatement.online/compare/bankstatementconverter-alternative";

export const metadata: Metadata = {
  title: "BankStatementConverter Alternative — With QBO Export & Free Pages | Convert Statement",
  description:
    "Looking for a BankStatementConverter (bankstatementconverter.com) alternative? Convert Statement adds QBO/OFX and Google Sheets export, 8 pages free and 25 free QuickBooks tools, from $5/month. Honest comparison — including when the original is the better fit.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "BankStatementConverter Alternative — With QBO Export & Free Pages",
    description:
      "Convert Statement vs BankStatementConverter, honestly: formats, free tiers and published pricing compared.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "Is Convert Statement a replacement for BankStatementConverter?",
    a: "For PDF-to-spreadsheet work, yes — and it goes further on formats. BankStatementConverter exports Excel and CSV. Convert Statement exports Excel and CSV on its free tier, and adds OFX, QBO and Google Sheets on Pro, which is what you need for a direct QuickBooks import. If Excel or CSV is all you ever need, the simpler tool may be enough.",
  },
  {
    q: "What does Convert Statement do that BankStatementConverter does not?",
    a: "QBO and OFX export for QuickBooks, Google Sheets export, a larger free allowance (8 pages versus 1 page per 24 hours anonymously), and 25 QuickBooks file tools — bulk importer, exporter, deleter, QBO editor and merger among them — with the 6 bulk tools free and no signup required.",
  },
  {
    q: "What does BankStatementConverter do that Convert Statement does not?",
    a: "It has a longer track record as a single-purpose PDF-to-Excel converter and an API offering aimed at that one job. It is also a deliberately minimal product: if you only ever convert a statement to Excel and value a tool that does nothing else, that simplicity is a genuine point in its favour. Neither product offers live sync into QuickBooks — both are file-based.",
  },
  {
    q: "How much does each cost?",
    a: "Convert Statement: free with 8 pages, Basic $5/month for 25 pages, Pro $20/month for 500 pages, Business $75/month for 2,000 pages — see our pricing page. BankStatementConverter's plans were reported in the $30–$99/month range in published sources checked in November 2026, with current pricing shown on the vendor's own pages. Verify the current figure on bankstatementconverter.com before you decide — do not rely on any comparison page, including this one.",
  },
  {
    q: "Can I use both?",
    a: "Yes. Some people keep a familiar converter for simple Excel jobs and use Convert Statement when a statement needs to become a QBO file for QuickBooks, or when a QuickBooks file needs fixing with the free bulk tools. The free tier and free tools mean there is no cost to keeping that option open.",
  },
];

const ROWS: { feature: string; us: string | boolean; them: string | boolean }[] = [
  { feature: "How it works", us: "File-based: upload a PDF, download Excel/CSV/OFX/QBO", them: "File-based: upload a PDF, download Excel/CSV" },
  { feature: "PDF bank statement conversion", us: true, them: true },
  { feature: "Free tier", us: "8 pages free, no credit card", them: "1 page per 24 hours (anonymous)" },
  { feature: "Starting price (published)", us: "Basic $5/mo (25 pages); Pro $20/mo (500 pages)", them: "$30–$99/mo range — see the vendor's site for current pricing" },
  { feature: "Excel / CSV export", us: true, them: true },
  { feature: "QBO export for QuickBooks", us: true, them: false },
  { feature: "OFX export", us: true, them: false },
  { feature: "Google Sheets export", us: true, them: false },
  { feature: "Free QuickBooks file tools (bulk import/export/delete, QBO editor & merger)", us: true, them: false },
  { feature: "Bulk / batch processing", us: true, them: false },
  { feature: "API access", us: true, them: true },
  { feature: "Live sync into QuickBooks", us: false, them: false },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Check className="h-5 w-5 text-[#007A33] mx-auto" />;
  if (v === false) return <X className="h-5 w-5 text-zinc-300 mx-auto" />;
  return <span className="text-sm">{v}</span>;
}

export default function BankStatementConverterAlternativePage() {
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
                A BankStatementConverter alternative, <span className="agri-serif">honestly compared</span>
              </h1>
              <p className="text-[0.95rem] text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                BankStatementConverter (bankstatementconverter.com) is a long-running,
                single-purpose tool that turns statement PDFs into Excel and CSV for a
                global audience. Convert Statement covers that job and adds the formats
                QuickBooks actually imports — QBO and OFX — plus free QuickBooks file
                tools. Here is the honest version, including when the original is enough.
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
                    <th className="px-5 py-3 text-center font-bold text-zinc-900">BankStatementConverter</th>
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
              BankStatementConverter&apos;s current pricing is shown on the vendor&apos;s own
              pages and can change — check bankstatementconverter.com for current prices.
              Convert Statement&apos;s pricing is on{" "}
              <Link href="/pricing" className="text-[#007A33] font-semibold hover:underline">its pricing page</Link>.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-14">
              <div className="rounded-[24px] border border-[#CBE3C4] bg-[#F2F4EC] p-6">
                <h2 className="font-bold text-zinc-900 text-lg">When BankStatementConverter is the better choice</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 leading-relaxed list-disc list-inside">
                  <li>You only ever need Excel or CSV — never a QuickBooks file.</li>
                  <li>You prefer a minimal, single-purpose tool with a long track record.</li>
                  <li>Your workflow is already built around its output and API.</li>
                </ul>
                <p className="mt-4 text-sm text-zinc-500">
                  If a statement only has to become a spreadsheet, a dedicated converter is a
                  reasonable choice — the difference only appears when QuickBooks enters the picture.
                </p>
              </div>
              <div className="rounded-[24px] border border-[#CBE3C4] bg-[#F2F4EC] p-6">
                <h2 className="font-bold text-zinc-900 text-lg">When Convert Statement is the better choice</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 leading-relaxed list-disc list-inside">
                  <li>You need QBO or OFX files that QuickBooks can import directly.</li>
                  <li>You want more than 1 free page a day — the free tier here is 8 pages.</li>
                  <li>You want Google Sheets export (Pro) alongside Excel and CSV.</li>
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
