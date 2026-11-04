import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Check, X } from "lucide-react";

const PAGE_URL = "https://www.convertstatement.online/best-bank-statement-converter";

export const metadata: Metadata = {
  title: "Best Bank Statement Converter — Honest Comparison (Nov 2026) | Convert Statement",
  description:
    "Compare Convert Statement, DocuClipper, BankStatementConverter, Nanonets, MoneyThumb and SaasAnt on published pricing, free tiers, formats and QuickBooks support. Based on vendor pricing and feature lists checked November 2026 — verify current prices on vendor sites.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Best Bank Statement Converter — Honest Comparison",
    description:
      "Published pricing, free tiers, formats and QuickBooks support compared — including where each competitor is genuinely the better fit.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "Which bank statement converter is cheapest?",
    a: "On published pricing checked in November 2026, Convert Statement has the lowest entry point in this comparison: a free tier with 8 pages, then Basic at $5/month for 25 pages and Pro at $20/month for 500 pages. DocuClipper starts at $29/month for 60 pages, MoneyThumb online starts from $24.95/month, and BankStatementConverter's plans were reported in the $30–$99/month range. Nanonets and SaasAnt do not publish a comparable self-serve converter price on the pages checked — see the vendor's site for current pricing. Always verify current prices on each vendor's site before you decide.",
  },
  {
    q: "Which converter is best for QuickBooks?",
    a: "It depends on how you work. If you want a QBO or OFX file you can review and then import yourself, Convert Statement (Pro and Business) and DocuClipper both export QBO, and MoneyThumb is built around QBO/QFX for QuickBooks Desktop and Quicken. If you want software that works live inside QuickBooks Online — importing, exporting and deleting transactions through a connection — that is SaasAnt's product, not a file converter. Convert Statement does not do live sync into QuickBooks; it is file-based.",
  },
  {
    q: "Is there a free bank statement converter?",
    a: "Convert Statement offers 8 pages free with CSV and Excel exports and no credit card required, plus 25 QuickBooks file tools that are free — the 6 bulk tools are free with no signup. BankStatementConverter allows a very limited free allowance (1 page per 24 hours anonymously, per its listing in our comparison data). DocuClipper and MoneyThumb offer free trials rather than a permanent free tier. Nanonets offers a free converter tool page that feeds its enterprise platform. Trial terms and free allowances change — check each vendor's site.",
  },
  {
    q: "What is the difference between file-based, live-connected and API converters?",
    a: "File-based converters (Convert Statement, DocuClipper, BankStatementConverter, MoneyThumb) take a PDF or CSV file you upload and return a spreadsheet or accounting file you import yourself — you stay in control of what enters your books. Live-connected tools (SaasAnt) connect directly to QuickBooks Online and move transactions through that connection. API and enterprise document platforms (Nanonets) are built for developers and larger teams embedding extraction into their own workflows, usually with custom pricing.",
  },
  {
    q: "Did you hands-on test every tool in this roundup?",
    a: "No, and this page does not claim that. This comparison is based on published vendor pricing and feature lists checked in November 2026, with sources noted in the methodology box at the top of this page. We did not buy paid accounts on competing products for this comparison. For a final decision, run your own real statement through each tool's free tier or trial.",
  },
  {
    q: "Why is Convert Statement included in its own roundup?",
    a: "Because this is Convert Statement's website, and readers would notice the omission. We have tried to make the bias easy to correct for: every competitor price below is tied to a published source checked in November 2026, the methodology is stated up front, each tool gets an honest 'best for' verdict — including the cases where a competitor is the better choice — and we tell you to verify current pricing on each vendor's own site.",
  },
];

const TOOLS: {
  name: string;
  href?: string;
  freeTier: string;
  startingPrice: string;
  formats: string;
  quickbooks: string;
  approach: string;
  verdict: string;
  body: string;
}[] = [
  {
    name: "Convert Statement",
    href: "/pricing",
    freeTier: "8 pages free",
    startingPrice: "Basic $5/mo (25 pages); Pro $20/mo (500 pages); Business $75/mo (2,000 pages)",
    formats: "Excel, CSV, OFX, QBO, Google Sheets",
    quickbooks: "QBO/OFX file export (Pro+); 25 free QuickBooks file tools",
    approach: "File-based",
    verdict: "Best for bookkeepers and small firms who want low-cost, file-based conversion plus free QuickBooks file tools.",
    body: "Convert Statement converts a PDF bank statement into Excel, CSV, OFX, QBO or Google Sheets. Files are processed in memory and are not stored. Alongside the converter it offers 25 QuickBooks tools — including a bulk importer, exporter, deleter, QBO file editor, QBO merger and IIF-to-Excel converter — and the 6 bulk tools are free with no signup. Its honest limit: it does not sync live into QuickBooks. If you need a live connection, see SaasAnt below.",
  },
  {
    name: "DocuClipper",
    freeTier: "Free trial (no permanent free tier)",
    startingPrice: "From $29/mo for 60 pages",
    formats: "Excel, CSV, QBO, IIF, OFX, QFX, QIF",
    quickbooks: "QBO export; built for QuickBooks and Xero workflows",
    approach: "File-based",
    verdict: "Best for US-focused finance teams who want a broader document-automation product, not just statements.",
    body: "DocuClipper is the most US-focused serious competitor in this set and covers bank statements alongside invoices and receipts, with per-bank guides for major US banks. Its published entry price is $29/month for 60 pages, so heavier statement volume costs more than Convert Statement's Pro tier. Documents are uploaded and stored on its servers with user-controlled retention, rather than processed in memory. If US bank coverage and a wider document product matter more to you than price per page, DocuClipper genuinely wins that comparison.",
  },
  {
    name: "BankStatementConverter",
    freeTier: "1 page per 24 hours (anonymous)",
    startingPrice: "$30–$99/mo range (see vendor's site for current pricing)",
    formats: "Excel, CSV",
    quickbooks: "No QBO/OFX export listed",
    approach: "File-based",
    verdict: "Best for simple PDF-to-Excel/CSV conversion if you do not need QuickBooks file formats.",
    body: "BankStatementConverter (bankstatementconverter.com) is a long-running, one-person converter focused on turning statement PDFs into Excel and CSV. Its plans were reported in the $30–$99/month range — verify the current figure on the vendor's site, as pricing is shown behind its own pages. The trade-off in this comparison is formats: with Excel and CSV only, there is no QBO or OFX export for direct QuickBooks import, and its anonymous free allowance is 1 page per 24 hours.",
  },
  {
    name: "Nanonets",
    freeTier: "Free converter tool page; platform pricing is custom",
    startingPrice: "See the vendor's site for current pricing",
    formats: "Excel (converter page); broader platform is API-driven",
    quickbooks: "No QBO/OFX export listed for the converter",
    approach: "API / enterprise platform",
    verdict: "Best for developers and larger teams embedding document extraction into their own systems via API.",
    body: "Nanonets is an AI document-processing platform; bank statement conversion is one feature of a much larger enterprise product, and its free converter tool page feeds that platform. It does not publish transparent self-serve pricing for the converter — pricing is custom and enterprise-oriented, so see the vendor's site for current pricing. For an individual bookkeeper who just needs a QBO file today, that enterprise focus is usually more product than the job needs. For a team building extraction into its own software, the API-first approach is the point, and Nanonets wins there.",
  },
  {
    name: "MoneyThumb",
    freeTier: "Free trial available",
    startingPrice: "From $24.95/mo online; desktop from $599.95+ (see vendor's site for current pricing)",
    formats: "QBO, OFX, QFX, CSV, IIF",
    quickbooks: "QBO/QFX for QuickBooks Desktop and Quicken",
    approach: "File-based (desktop + online)",
    verdict: "Best for QuickBooks Desktop and Quicken users who prefer desktop software and per-tool converters.",
    body: "MoneyThumb is a mature, US-focused maker of PDF-to-accounting converters (such as pdf2qbo and pdf2csv) offered as online tools and desktop software. Published pricing starts from $24.95/month online, with desktop licences from $599.95+ in the comparison source checked — verify current pricing on the vendor's site. Its product line is split across single-purpose tools rather than one converter, and it has no permanent free tier in this comparison. If your books live in QuickBooks Desktop or Quicken and you like owning desktop software, MoneyThumb is a strong, established fit.",
  },
  {
    name: "SaasAnt",
    freeTier: "See the vendor's site for current trial terms",
    startingPrice: "See the vendor's site for current pricing",
    formats: "Works inside QuickBooks Online (not a standalone statement-file converter)",
    quickbooks: "Live connection: import, export, edit and delete transactions in QuickBooks Online",
    approach: "Live-connected",
    verdict: "Best for QuickBooks Online users who need live bulk import, export and delete inside their company file.",
    body: "SaasAnt is adjacent to this category rather than a direct PDF statement converter: it connects to QuickBooks Online and bulk-imports, exports, edits and deletes transactions and lists through that live connection. That is a genuinely different capability from file conversion — and for cleanup work inside a live QuickBooks company, SaasAnt is the better choice. Convert Statement's comparable bulk tools work on files instead (free, no signup, no live connection), which suits one-off and pre-import work. SaasAnt's current pricing and trial terms are on the vendor's site.",
  },
];

function Mark({ v }: { v: boolean }) {
  return v ? (
    <Check className="h-5 w-5 text-[#007A33] mx-auto" />
  ) : (
    <X className="h-5 w-5 text-zinc-300 mx-auto" />
  );
}

export default function BestBankStatementConverterPage() {
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
                Roundup
              </span>
              <h1 className="font-extrabold text-white tracking-tight leading-[1.07] mb-4" style={{ fontSize: "clamp(1.28rem, 2.4vw, 1.92rem)" }}>
                Best bank statement converter, <span className="agri-serif">compared on published facts</span>
              </h1>
              <p className="text-[0.95rem] text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                Six tools, compared on the pricing and feature lists their vendors publish:
                Convert Statement, DocuClipper, BankStatementConverter, Nanonets, MoneyThumb
                and SaasAnt — including where a competitor is genuinely the better fit.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="rounded-[24px] border border-[#CBE3C4] bg-[#F2F4EC] p-6 mb-10">
              <h2 className="font-bold text-zinc-900 text-lg">How this comparison was made — please read first</h2>
              <div className="mt-3 space-y-2 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong className="text-zinc-800">This is Convert Statement&apos;s own website.</strong> Convert
                  Statement is one of the tools compared below, so treat this page as a
                  vendor comparison, not an independent review.
                </p>
                <p>
                  Every competitor price and feature on this page comes from{" "}
                  <strong className="text-zinc-800">published vendor pricing and feature lists checked in November 2026</strong>,
                  cross-checked against our research notes and the data behind our{" "}
                  <Link href="/compare/docuclipper" className="text-[#007A33] font-semibold hover:underline">side-by-side comparison pages</Link>.
                  Where a vendor does not publish a comparable figure, the table says
                  &ldquo;see the vendor&apos;s site for current pricing&rdquo; instead of guessing.
                </p>
                <p>
                  <strong className="text-zinc-800">No hands-on test claims:</strong> we did not buy paid accounts
                  on competing products for this page, and nothing here is presented as a
                  test result, a rating or a review score. Prices and free tiers change —
                  verify the current figure on each vendor&apos;s own site before you buy,
                  and run your own statement through each free tier or trial.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 mb-4">At a glance</h2>
            <div className="overflow-x-auto rounded-[24px] border border-[#CBE3C4] bg-white">
              <table className="w-full text-sm min-w-[860px]">
                <thead>
                  <tr className="border-b border-[#CBE3C4]">
                    <th className="px-5 py-3 text-left font-semibold text-zinc-500">Tool</th>
                    <th className="px-5 py-3 text-left font-semibold text-zinc-500">Free tier</th>
                    <th className="px-5 py-3 text-left font-semibold text-zinc-500">Starting price (published)</th>
                    <th className="px-5 py-3 text-left font-semibold text-zinc-500">Formats</th>
                    <th className="px-5 py-3 text-left font-semibold text-zinc-500">QuickBooks support</th>
                    <th className="px-5 py-3 text-left font-semibold text-zinc-500">Approach</th>
                  </tr>
                </thead>
                <tbody>
                  {TOOLS.map((t) => (
                    <tr key={t.name} className="border-b border-[#CBE3C4]">
                      <td className="px-5 py-3 font-bold text-zinc-900">{t.name}</td>
                      <td className="px-5 py-3 text-zinc-600">{t.freeTier}</td>
                      <td className="px-5 py-3 text-zinc-600">{t.startingPrice}</td>
                      <td className="px-5 py-3 text-zinc-600">{t.formats}</td>
                      <td className="px-5 py-3 text-zinc-600">{t.quickbooks}</td>
                      <td className="px-5 py-3 text-zinc-600">{t.approach}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              Pricing checked November 2026 from published vendor pages and comparison
              sources. Convert Statement pricing is on{" "}
              <Link href="/pricing" className="text-[#007A33] font-semibold hover:underline">its pricing page</Link>.
              For every other tool, confirm the current price on the vendor&apos;s own site.
            </p>

            <div className="mt-6 rounded-[24px] border border-[#CBE3C4] bg-white p-6">
              <h3 className="font-bold text-zinc-900">Quick answers</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600 leading-relaxed">
                <li className="flex gap-2"><span className="shrink-0">Lowest published entry price:</span><span><strong className="text-zinc-800">Convert Statement</strong> — free 8 pages, then $5/month.</span></li>
                <li className="flex gap-2"><span className="shrink-0">Live sync into QuickBooks:</span><span><strong className="text-zinc-800">SaasAnt</strong> — Convert Statement is file-based and does not live-sync <X className="inline h-4 w-4 text-zinc-300 align-text-bottom" />.</span></li>
                <li className="flex gap-2"><span className="shrink-0">Broadest US document-automation product:</span><span><strong className="text-zinc-800">DocuClipper</strong>.</span></li>
                <li className="flex gap-2"><span className="shrink-0">QuickBooks Desktop / Quicken desktop software:</span><span><strong className="text-zinc-800">MoneyThumb</strong>.</span></li>
                <li className="flex gap-2"><span className="shrink-0">API / enterprise embedding:</span><span><strong className="text-zinc-800">Nanonets</strong>.</span></li>
              </ul>
              <p className="mt-3 text-xs text-zinc-500">Check marks elsewhere on this site mean a published feature exists; the row above uses <Mark v={false} /> only to show Convert Statement has no live sync.</p>
            </div>

            <div className="mt-14 space-y-6">
              {TOOLS.map((t) => (
                <article key={t.name} className="rounded-[24px] border border-[#CBE3C4] bg-[#F2F4EC] p-6">
                  <h2 className="font-bold text-zinc-900 text-lg">{t.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-[#007A33]">Best for: {t.verdict}</p>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{t.body}</p>
                  <dl className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex gap-2"><dt className="font-medium text-zinc-700 shrink-0">Free tier:</dt><dd className="text-zinc-600">{t.freeTier}</dd></div>
                    <div className="flex gap-2"><dt className="font-medium text-zinc-700 shrink-0">Starting price:</dt><dd className="text-zinc-600">{t.startingPrice}</dd></div>
                    <div className="flex gap-2"><dt className="font-medium text-zinc-700 shrink-0">Formats:</dt><dd className="text-zinc-600">{t.formats}</dd></div>
                    <div className="flex gap-2"><dt className="font-medium text-zinc-700 shrink-0">Approach:</dt><dd className="text-zinc-600">{t.approach}</dd></div>
                  </dl>
                  {t.href ? (
                    <Link href={t.href} className="mt-4 inline-flex items-center gap-2 bg-[#0B1F16] text-white font-semibold px-5 py-2.5 rounded-full text-sm">
                      See Convert Statement pricing
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>

            <div className="mt-14 rounded-[24px] bg-[#0B1F16] p-8 text-center">
              <h2 className="font-bold text-white text-xl">Try the file-based option free first</h2>
              <p className="mt-2 text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
                Convert Statement gives you 8 pages free — no credit card — and 25 QuickBooks
                file tools, with the 6 bulk tools free and no signup. If you need live sync,
                an enterprise API or desktop software instead, the verdicts above point you
                to the right competitor honestly.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/" className="inline-flex items-center gap-2 bg-[#2CA01C] text-white font-semibold px-5 py-2.5 rounded-full text-sm">
                  Convert a statement free
                </Link>
                <Link href="/tools" className="inline-flex items-center gap-2 border border-[#CBE3C4] text-white font-semibold px-5 py-2.5 rounded-full text-sm">
                  Browse the free QuickBooks tools
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
