import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { BUILD_NONCE } from "@/lib/csp-nonce";

const PAGE_URL = "https://www.convertstatement.online/services/quickbooks-cleanup";

export const metadata: Metadata = {
  title: "QuickBooks Cleanup Service — Free Assessment, Fixed Quote | Convert Statement",
  description:
    "Months of duplicate transactions, unreconciled accounts, and messy imports? Our QuickBooks cleanup service imports your statements in order, categorizes consistently, and re-reconciles each month. Free assessment and a fixed quote before anything starts.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QuickBooks Cleanup Service",
    description:
      "A full QuickBooks cleanup: statements imported in order, duplicates removed, every month re-reconciled. Free assessment, fixed quote up front.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "What does a QuickBooks cleanup include?",
    a: "Bank and card statements imported in chronological order, duplicate transactions removed, transactions categorized consistently, and each month re-reconciled against the statement until the difference is zero. You get the cleaned books back in QuickBooks, plus a short report of what was wrong and what changed.",
  },
  {
    q: "How is this different from the free cleanup checker?",
    a: "The free QBO Duplicate Finder diagnoses one file: it finds duplicates and structural problems and can produce a cleaned QBO for that file. The cleanup service handles the whole mess across months and accounts — including the entries that are missing, not just the ones that are duplicated — and a person reviews the result before it goes back to you.",
  },
  {
    q: "How much does a cleanup cost?",
    a: "It depends on how many months and accounts need cleaning, so there is no flat price on this page. The assessment is free, and you get a fixed quote before any work starts — the quote does not change unless the scope you approved changes.",
  },
  {
    q: "How long does a cleanup take?",
    a: "It depends on the same scope: months, accounts, and how tangled the imports are. Your quote includes a timeline, and you will hear from us before anything is delivered if that timeline slips.",
  },
  {
    q: "Do you need access to my QuickBooks account?",
    a: "Only if the cleanup is delivered directly into QuickBooks. Many cleanups are delivered as cleaned QBO and CSV files you import yourself, which needs no access at all. If direct delivery is better for your case, we will agree the access method with you during the assessment — nothing is connected without your say-so.",
  },
  {
    q: "What do you need from me to start?",
    a: "Your bank and card statements for the months to clean (PDFs or CSVs), and a note on how many QuickBooks accounts are involved. Send those details through the contact form with the subject line “QuickBooks Cleanup” and we will come back with the free assessment.",
  },
];

export default function QuickBooksCleanupPage() {
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
                Service
              </span>
              <h1 className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.07] mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                QuickBooks Cleanup Service
              </h1>
              <p className="text-[0.95rem] text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Months of duplicates, unreconciled accounts, and imports that never quite
                matched the bank? We clean the whole thing up — and quote you a fixed price
                before any work starts.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"
                >
                  Get a free cleanup assessment
                </Link>
                <p className="mt-3 text-xs text-zinc-500">
                  On the contact form, use the subject line “QuickBooks Cleanup” and tell us how many months and accounts you have.
                </p>
              </div>
              </div>
              <figure className="m-0">
                <img src="/images/tools/cleanup-hero.webp" alt="Illustrative photo: a tidy desk with labelled folders and a laptop showing a clean spreadsheet" width={1200} height={800} loading="eager" className="w-full rounded-2xl shadow-lg" style={{ aspectRatio: "3 / 2", objectFit: "cover" }} />
                <figcaption className="mt-2 text-center text-xs text-zinc-500">Illustration</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="py-24 bg-brand-bg">
          <div className="max-w-6xl mx-auto px-6">
            <figure className="m-0 mb-10 mx-auto max-w-3xl">
              <img src="/images/tools/cleanup-section.webp" alt="Illustrative photo: filing trays with sorted receipts beside a laptop" width={1200} height={800} loading="lazy" className="w-full rounded-2xl shadow" style={{ aspectRatio: "3 / 2", objectFit: "cover" }} />
              <figcaption className="mt-2 text-center text-xs text-zinc-500">Illustration</figcaption>
            </figure>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-text mb-10">What is included</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Statements imported in order", body: "Your bank and card statements are converted and imported month by month, in chronological order, so each month's opening balance is the previous month's closing balance." },
                { title: "Duplicates removed", body: "Exact duplicates (repeated transaction IDs) and double-recorded entries are identified and removed, with a list of everything taken out." },
                { title: "Consistent categorization", body: "The same vendor is categorized the same way every month, so your profit and loss stops changing shape from one month to the next." },
                { title: "Every month re-reconciled", body: "Each month is reconciled against its statement until the difference is zero — or the remaining difference is listed with the exact entries behind it." },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-brand-border bg-brand-surface p-6">
                  <h3 className="font-bold text-zinc-900 dark:text-white">{c.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-brand-text mt-20 mb-10">How it works</h2>
            <ol className="space-y-4">
              {[
                { title: "Free assessment", body: "You send your statements and a note on months and accounts. We diagnose the mess and tell you what it will take to fix — free." },
                { title: "Fixed quote", body: "You get one fixed price and a timeline before anything starts. The price does not change unless the scope you approved changes." },
                { title: "Cleanup", body: "We convert, dedupe, categorize, and re-reconcile month by month, and review the result before delivery." },
                { title: "Delivery and report", body: "You get the cleaned books (as files you import, or delivered directly if you prefer) plus a short report of what was wrong and what changed." },
              ].map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-2xl border border-brand-border bg-brand-surface p-6">
                  <span className="text-2xl font-black text-zinc-200 dark:text-zinc-800">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">{s.title}</h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-16 rounded-3xl bg-zinc-900 p-8 text-white text-center">
              <h2 className="text-2xl font-bold">Start with the free assessment</h2>
              <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
                No commitment, no charge for the diagnosis. If the quote does not make sense
                for you, you keep the assessment and the free tools below.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-zinc-900 font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-200">
                  Contact us — subject “QuickBooks Cleanup”
                </Link>
                <Link href="/tools/free-qbo-cleanup-checker" className="inline-flex items-center gap-2 border border-zinc-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-800">
                  Try the free duplicate finder first
                </Link>
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
