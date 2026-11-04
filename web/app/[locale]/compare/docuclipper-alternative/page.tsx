import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Check, X } from "lucide-react";

const PAGE_URL = "https://www.convertstatement.online/compare/docuclipper-alternative";

export const metadata: Metadata = {
  title: "DocuClipper Alternative — Lower-Cost File-Based Conversion | Convert Statement",
  description:
    "Looking for a DocuClipper alternative? Convert Statement converts PDF statements to Excel, CSV, OFX and QBO from $5/month with 8 pages free, plus 25 free QuickBooks file tools. Honest comparison — including when DocuClipper is the better fit.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "DocuClipper Alternative — Lower-Cost File-Based Conversion",
    description:
      "Convert Statement vs DocuClipper, honestly: published pricing, free tiers, formats and QuickBooks support compared.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "Is Convert Statement a replacement for DocuClipper?",
    a: "For bank statement conversion, yes: both are file-based tools that turn a statement PDF into Excel, CSV and QBO. Convert Statement does not replace DocuClipper's broader document automation — invoices, receipts and its wider finance-team workflows are DocuClipper's product, not ours. If statements are the job, Convert Statement covers it at a lower published price; if you need the full document platform, stay with DocuClipper.",
  },
  {
    q: "What does Convert Statement do that DocuClipper does not?",
    a: "It offers a permanent free tier (8 pages, no credit card), lower published entry pricing, files processed in memory rather than stored, and a library of 25 QuickBooks file tools — including a bulk importer, exporter, deleter, QBO file editor and QBO merger — with the 6 bulk tools free and no signup required.",
  },
  {
    q: "What does DocuClipper do that Convert Statement does not?",
    a: "DocuClipper is a broader document-automation product: it also handles invoices and receipts, publishes per-bank guides for major US banks, and is built for finance teams who want one vendor for several document types. Convert Statement is focused on bank statements and QuickBooks files. Neither product in this comparison offers live sync into QuickBooks — both are file-based.",
  },
  {
    q: "How much does each cost?",
    a: "Convert Statement: free with 8 pages, Basic $5/month for 25 pages, Pro $20/month for 500 pages (adds QBO/OFX and Google Sheets), Business $75/month for 2,000 pages — full details are on our pricing page. DocuClipper's published pricing checked in November 2026 starts at $29/month for 60 pages on monthly billing. Pricing changes, so verify DocuClipper's current figure on DocuClipper's own site before you decide.",
  },
  {
    q: "Can I try Convert Statement before switching?",
    a: "Yes. The free tier gives you 8 pages with CSV and Excel exports and no credit card, and the QuickBooks file tools are free to use — the bulk tools need no signup at all. Run the same statement you would normally send to DocuClipper and compare the output file yourself.",
  },
];

const ROWS: { feature: string; us: string | boolean; them: string | boolean }[] = [
  { feature: "How it works", us: "File-based: upload a PDF, download Excel/CSV/OFX/QBO", them: "File-based: upload documents, download or send to accounting software" },
  { feature: "PDF bank statement conversion", us: true, them: true },
  { feature: "Free tier", us: "8 pages free, no credit card", them: "14-day free trial (up to 120 pages), then paid" },
  { feature: "Starting price (published)", us: "Basic $5/mo (25 pages); Pro $20/mo (500 pages)", them: "From $29/mo for 60 pages" },
  { feature: "QBO export for QuickBooks", us: true, them: true },
  { feature: "OFX export", us: true, them: true },
  { feature: "Google Sheets export", us: true, them: false },
  { feature: "Free QuickBooks file tools (bulk import/export/delete, QBO editor & merger)", us: true, them: false },
  { feature: "Invoice & receipt conversion", us: false, them: true },
  { feature: "Live sync into QuickBooks", us: false, them: false },
  { feature: "File handling", us: "Processed in memory, not stored", them: "Stored on their servers with retention controls" },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Check className="h-5 w-5 text-[#007A33] mx-auto" />;
  if (v === false) return <X className="h-5 w-5 text-zinc-300 mx-auto" />;
  return <span className="text-sm">{v}</span>;
}

export default function DocuClipperAlternativePage() {
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
                A DocuClipper alternative, <span className="agri-serif">honestly compared</span>
              </h1>
              <p className="text-[0.95rem] text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                DocuClipper is a US-focused document-automation platform for finance teams —
                bank statements, invoices and receipts into QuickBooks, Xero or Excel.
                Convert Statement does the statement part, file-based, at a lower published
                price, with a permanent free tier. Here is the honest version, including
                when DocuClipper is the better fit.
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
                    <th className="px-5 py-3 text-center font-bold text-zinc-900">DocuClipper</th>
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
              DocuClipper pricing and plan details are from published vendor pages checked
              November 2026 and can change — check DocuClipper&apos;s own site for current
              prices. Convert Statement&apos;s pricing is on{" "}
              <Link href="/pricing" className="text-[#007A33] font-semibold hover:underline">its pricing page</Link>.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-14">
              <div className="rounded-[24px] border border-[#CBE3C4] bg-[#F2F4EC] p-6">
                <h2 className="font-bold text-zinc-900 text-lg">When DocuClipper is the better choice</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 leading-relaxed list-disc list-inside">
                  <li>You need invoices and receipts converted too, not just bank statements.</li>
                  <li>You want one broader document-automation platform for a finance team.</li>
                  <li>Its per-bank US guides and US-focused support match how your firm works.</li>
                  <li>You are happy to store documents on the vendor&apos;s servers with retention controls.</li>
                </ul>
                <p className="mt-4 text-sm text-zinc-500">
                  That breadth is real. Convert Statement is deliberately narrower: statements
                  and QuickBooks files, done cheaply.
                </p>
              </div>
              <div className="rounded-[24px] border border-[#CBE3C4] bg-[#F2F4EC] p-6">
                <h2 className="font-bold text-zinc-900 text-lg">When Convert Statement is the better choice</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 leading-relaxed list-disc list-inside">
                  <li>Bank statements are the job — you do not need a full document platform.</li>
                  <li>You want a permanent free tier (8 pages) instead of a trial that expires.</li>
                  <li>Published price per page matters: Pro is $20/month for 500 pages.</li>
                  <li>You also need free QuickBooks file tools — bulk import, export, delete, QBO editing and merging.</li>
                  <li>You prefer files processed in memory, not stored on a server.</li>
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
