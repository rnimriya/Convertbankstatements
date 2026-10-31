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
    <div className="agri-sans">
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar dark />
      <main>
        <section className="w-full relative overflow-hidden bg-[#0B1F16]">
          <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,0.38), rgba(19,84,28,0.28) 55%, transparent 75%)" }} />
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-10 pb-12">
            <div className="text-center mb-6 max-w-4xl mx-auto">
              <span className="agri-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#B9D6B2] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                Service
              </span>
              <h1 className="font-extrabold text-white tracking-tight leading-[1.07] mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                QuickBooks Cleanup <span className="agri-serif">Service</span>
              </h1>
              <p className="text-[0.95rem] text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                Months of duplicates, unreconciled accounts, and imports that never quite
                matched the bank? We clean the whole thing up — and quote you a fixed price
                before any work starts.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-bold bg-[#2CA01C] text-[#0B1F16]"
                >
                  Get a free cleanup assessment
                </Link>
                <p className="mt-3 text-xs text-zinc-400">
                  On the contact form, use the subject line “QuickBooks Cleanup” and tell us how many months and accounts you have.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-10">What is included</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Statements imported in order", body: "Your bank and card statements are converted and imported month by month, in chronological order, so each month's opening balance is the previous month's closing balance." },
                { title: "Duplicates removed", body: "Exact duplicates (repeated transaction IDs) and double-recorded entries are identified and removed, with a list of everything taken out." },
                { title: "Consistent categorization", body: "The same vendor is categorized the same way every month, so your profit and loss stops changing shape from one month to the next." },
                { title: "Every month re-reconciled", body: "Each month is reconciled against its statement until the difference is zero — or the remaining difference is listed with the exact entries behind it." },
              ].map((c) => (
                <div key={c.title} className="rounded-[24px] border border-[#CBE3C4] bg-white p-6">
                  <h3 className="font-bold text-zinc-900">{c.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mt-20 mb-10">How it works</h2>
            <ol className="space-y-4">
              {[
                { title: "Free assessment", body: "You send your statements and a note on months and accounts. We diagnose the mess and tell you what it will take to fix — free." },
                { title: "Fixed quote", body: "You get one fixed price and a timeline before anything starts. The price does not change unless the scope you approved changes." },
                { title: "Cleanup", body: "We convert, dedupe, categorize, and re-reconcile month by month, and review the result before delivery." },
                { title: "Delivery and report", body: "You get the cleaned books (as files you import, or delivered directly if you prefer) plus a short report of what was wrong and what changed." },
              ].map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-[24px] border border-[#CBE3C4] bg-white p-6">
                  <span className="agri-mono text-2xl font-medium text-[#007A33]">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-bold text-zinc-900">{s.title}</h3>
                    <p className="mt-1 text-sm text-zinc-600 leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-16 rounded-[24px] bg-[#0B1F16] p-8 text-white text-center">
              <h2 className="text-2xl font-bold">Start with the free assessment</h2>
              <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
                No commitment, no charge for the diagnosis. If the quote does not make sense
                for you, you keep the assessment and the free tools below.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-[#0B1F16] font-semibold px-5 py-2.5 rounded-full">
                  Contact us — subject “QuickBooks Cleanup”
                </Link>
                <Link href="/tools/free-qbo-cleanup-checker" className="inline-flex items-center gap-2 border border-white/25 text-white font-semibold px-5 py-2.5 rounded-full">
                  Try the free duplicate finder first
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
