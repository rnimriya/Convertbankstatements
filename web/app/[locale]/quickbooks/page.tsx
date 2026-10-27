import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingCards } from "@/components/PricingCards";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import {
  ArrowRight, BookOpen, Building2, Check, X, CheckCircle2,
} from "lucide-react";

const PAGE_URL = "https://www.convertstatement.online/quickbooks";

export const metadata: Metadata = {
  title: "QuickBooks Reconciliation: Convert PDF Bank Statements to QBO | Convert Statement",
  description:
    "QuickBooks reconciliation without manual data entry: turn any PDF bank statement into a balance-checked QBO or CSV file and import it into QuickBooks Online or Desktop in minutes. Built for US bookkeepers and small businesses. First 8 pages free.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QuickBooks Reconciliation — PDF Bank Statements to QBO & CSV",
    description:
      "Upload a statement PDF, download a balance-verified QBO file, and finish your QuickBooks reconciliation without typing a single transaction. First 8 pages free.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "Can QuickBooks import a PDF bank statement directly?",
    a: "No. QuickBooks Online and Desktop cannot read statement PDFs. You first convert the PDF into a file QuickBooks accepts — QBO (Web Connect), QFX, OFX, or CSV — and then upload that file. That conversion is exactly what Convert Statement does.",
  },
  {
    q: "What is the balance check, and why does it matter?",
    a: "Before your download is ready, we walk the statement's own running balances and verify every step: previous balance + transaction = next balance. If the chain holds, your result shows a green 'Balance verified' confirmation with the opening and closing balances — proof the exported file agrees with the bank before it ever reaches QuickBooks. If a step doesn't add up, you get a warning instead, so a broken statement never becomes broken books.",
  },
  {
    q: "Which format should I use: QBO or CSV?",
    a: "QBO is the safer default. Dates, amounts, and transaction types are already structured the way QuickBooks expects, the file carries the statement's closing balance as its ledger balance, and there is no column mapping to get wrong. CSV also works in QuickBooks Online through manual upload, but you must map the columns during import and use one consistent style — a single Amount column, or separate Money In / Money Out columns.",
  },
  {
    q: "How do I import the file into QuickBooks Online?",
    a: "Go to Transactions → Bank transactions, open the drop-down next to Link account, and choose Upload a file. Select the QBO or CSV file, choose the bank or credit card account it belongs to, and confirm. Transactions appear in the For review tab — nothing is posted to your books until you categorize and add each one.",
  },
  {
    q: "Does it work with QuickBooks Desktop?",
    a: "Yes — use the QBO export and import it through File → Utilities → Import → Web Connect Files in supported Desktop versions. If your Desktop version or bank setup blocks Web Connect imports, the CSV export plus the import steps in our guide will get the same data in.",
  },
  {
    q: "Will importing create duplicate transactions?",
    a: "Two safeguards prevent that. First, every transaction in our QBO file gets a unique ID derived from its date, description, and amount — so next month's statement can never be mistaken for this month's, and re-importing the same file is safely recognized by QuickBooks. Second, imported transactions sit in the For review tab, so you can catch and exclude anything that overlaps your live bank feed before it reaches your books.",
  },
  {
    q: "Is QBO export included on the free plan?",
    a: "The free plan includes 8 pages with CSV and Excel export — and QuickBooks Online accepts CSV through manual upload, so you can test the full flow for free. QBO, QFX, and OFX export are included on the Pro plan ($20/month, 500 pages), which is what most bookkeepers use for client work.",
  },
  {
    q: "What if my QuickBooks reconciliation doesn't match the statement balance?",
    a: "A reconciliation difference almost always comes from three things: a transaction that's missing, one that's duplicated, or one with the wrong date or amount. Work through it in that order — compare the statement against QuickBooks line by line for the mismatch amount, run your file through a duplicate check, and confirm the beginning balance matches last month's ending balance. Converting the PDF statement with the balance check on this page flags exactly where a statement's running balance breaks, which usually points straight at the bad entry.",
  },
  {
    q: "Is my financial data stored on your servers?",
    a: "No. Statements are processed in memory to build your export file and are not retained afterwards. We never sell or share your financial data.",
  },
  {
    q: "How does this speed up QuickBooks reconciliation?",
    a: "Reconciliation is slow when transactions are typed by hand or imported with errors. This converter extracts every transaction from your PDF statement, verifies the running balances against the statement itself, and builds a QBO file with a unique ID for every transaction — so when you import it, QuickBooks matches entries against your bank feed cleanly and the reconciliation ties out to the statement balance.",
  },
  {
    q: "My books are months behind. Can a converter fix that?",
    a: "A converter fixes data entry, not a backlog. If several months are unreconciled or your chart of accounts is a mess, you need a cleanup: statements imported in order, transactions categorized consistently, and each month re-reconciled. We offer a free cleanup assessment with a fixed quote before any work starts — use the contact page and tell us how many months and accounts you have.",
  },
];

const STEPS = [
  {
    title: "Upload your statement PDF",
    body: "Drag in the official PDF from your bank — Chase, Bank of America, Wells Fargo, Citi, and hundreds more. Scanned statements and multi-page files are supported.",
  },
  {
    title: "Download the QBO file",
    body: "We extract every transaction with its date, description, and amount, check the running balances, and build a QBO file (or CSV, QFX, OFX, Excel) with USD defaults for US QuickBooks accounts.",
  },
  {
    title: "Import and reconcile",
    body: "Upload the file in QuickBooks, categorize the transactions in the For review tab, and reconcile against the statement's closing balance. No typing, no transposed digits.",
  },
];

const FORMATS = [
  { name: "QBO", use: "QuickBooks Online upload & Desktop Web Connect — recommended", plan: "Pro" },
  { name: "CSV", use: "QuickBooks Online manual upload with column mapping", plan: "Free & all plans" },
  { name: "QFX / OFX", use: "Quicken and other accounting software that reads OFX", plan: "Pro" },
  { name: "Excel (.xlsx)", use: "Review, categorize, and clean up before importing", plan: "Free & all plans" },
  { name: "Google Sheets", use: "Direct sync for review and sharing", plan: "Pro & Business" },
];

const QB_BLOGS = [
  { slug: "pnc-bank-convert-to-csv-quickbooks", label: "Import PNC Bank statements into QuickBooks" },
  { slug: "truist-convert-to-csv-quickbooks", label: "Import Truist statements into QuickBooks" },
  { slug: "capital-one-convert-to-csv-quickbooks", label: "Import Capital One statements into QuickBooks" },
  { slug: "td-bank-convert-to-csv-quickbooks", label: "Import TD Bank statements into QuickBooks" },
];

const QB_BANKS = [
  { slug: "jpmorgan-chase", label: "Chase statement converter" },
  { slug: "bank-of-america", label: "Bank of America statement converter" },
  { slug: "wells-fargo", label: "Wells Fargo statement converter" },
  { slug: "citibank", label: "Citibank statement converter" },
];

const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const h2 = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12 first:mt-0";
const para = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";

export default async function QuickBooksPage() {
  const nonce = BUILD_NONCE;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Convert Statement — QuickBooks Converter",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: PAGE_URL,
    description:
      "Convert PDF bank statements to QuickBooks-ready QBO and CSV files for QuickBooks Online and Desktop. Every export is balance-checked against the statement.",
    offers: [
      { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
      { "@type": "Offer", name: "Basic", price: "5", priceCurrency: "USD" },
      { "@type": "Offer", name: "Pro", price: "20", priceCurrency: "USD" },
      { "@type": "Offer", name: "Business", price: "75", priceCurrency: "USD" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to convert a PDF bank statement for QuickBooks",
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };

  return (
    <>
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        {/* ── Header (same pattern as guide pages) ──────────── */}
        <section className="bg-gradient-to-b from-teal-50/60 to-white dark:from-zinc-900 dark:to-zinc-950 border-b border-zinc-100 dark:border-zinc-800 px-6 py-16 text-center">
          <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3">
            QuickBooks Reconciliation
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight max-w-4xl mx-auto">
            Convert PDF Bank Statements for QuickBooks Reconciliation
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            Upload a statement PDF, download a balance-checked QBO or CSV file, and reconcile in
            QuickBooks Online or Desktop — without typing a single transaction by hand.
          </p>
        </section>

        {/* ── Body: content + sidebar (guide layout) ────────── */}
        <section className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <figure>
              <Image
                src="/quickbooks/hero-bookkeeper.jpg"
                alt="A bookkeeper reviewing clean financial charts after converting a bank statement for QuickBooks"
                width={1440}
                height={960}
                priority
                className="rounded-2xl shadow-lg ring-1 ring-slate-900/10 dark:ring-white/10 w-full h-auto"
              />
            </figure>

            <h2 className={h2}>Why statements get stuck outside QuickBooks</h2>
            <p className={para}>
              QuickBooks can&apos;t read statement PDFs, so when the bank feed skips a few weeks —
              or disconnects entirely — the only complete record is the statement itself, and
              someone ends up typing it in by hand. That&apos;s where the familiar problems start:
            </p>
            <figure className="mt-6">
              <Image
                src="/quickbooks/problem-messy-desk.jpg"
                alt="A business owner late at night surrounded by stacks of printed bank statements"
                width={1440}
                height={810}
                className="rounded-2xl shadow-lg ring-1 ring-slate-900/10 dark:ring-white/10 w-full h-auto"
              />
            </figure>
            <ul className="mt-4 space-y-2.5">
              {[
                "A reconciliation difference that won't go to zero, no matter how many times you re-check",
                "Transactions typed twice — once by hand, once by the bank feed",
                "Evenings lost to data entry instead of running the business",
                "Tax-time pressure because the books are months behind the bank",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className={para}>
              None of that is a bookkeeping problem — it&apos;s a file-format problem. Convert the
              statement into a file QuickBooks accepts, and the typing, the typos, and most
              reconciliation breaks go away with it.
            </p>

            <h2 className={h2}>How it works</h2>
            <ol className="mt-4 space-y-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">{s.title}</p>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-300 leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-3">Importing into QuickBooks Online</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <li>Go to <strong>Transactions → Bank transactions</strong>.</li>
                  <li>Open the drop-down next to <strong>Link account</strong> and choose <strong>Upload a file</strong>.</li>
                  <li>Select your QBO or CSV file and the account it belongs to.</li>
                  <li>Review the transactions in the <strong>For review</strong> tab, categorize, and add them.</li>
                  <li>Reconcile the month against the statement&apos;s closing balance.</li>
                </ol>
              </div>
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-3">Importing into QuickBooks Desktop</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <li>Download the <strong>QBO</strong> export from Convert Statement.</li>
                  <li>In QuickBooks Desktop, go to <strong>File → Utilities → Import → Web Connect Files</strong>.</li>
                  <li>Select the .qbo file and the bank account it belongs to.</li>
                  <li>Match and add the downloaded transactions in the Bank Feeds Center.</li>
                  <li>Reconcile the month against the statement&apos;s closing balance.</li>
                </ol>
              </div>
            </div>

            <h2 className={h2}>Balance-Check: reconciliation starts before the import</h2>
            <p className={para}>
              Most converters hand you a file and wish you luck. Ours proves itself first: before
              your download is ready, we walk the statement&apos;s own running balances and verify
              every step — previous balance plus transaction equals next balance. If the chain
              holds, your result shows a green confirmation. If a step doesn&apos;t add up, you
              get a warning instead, so a broken statement never becomes broken books.
            </p>
            <div className="mt-5 rounded-xl border border-teal-200 dark:border-teal-800 bg-zinc-50 dark:bg-zinc-900/50 p-4">
              <p className="flex items-center gap-2 font-bold text-teal-700 dark:text-teal-300 text-sm">
                <CheckCircle2 className="h-5 w-5" /> Balance verified
              </p>
              <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Opening {fmtUSD(2000)} → Closing {fmtUSD(10123.97)} · 10 transactions · every
                running balance ties to the statement.
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Actual result from our converter test with a sample Chase statement
              </p>
            </div>
            <ul className="mt-5 space-y-2.5">
              {[
                "Balance-Check on every conversion — opening balance, every transaction, closing balance, verified and shown on your result.",
                "The statement's closing balance travels inside the QBO as its ledger balance, dated to the statement's real period — the exact target reconciliation aims at.",
                "Transaction IDs are derived from each transaction itself, so next month's file can never be mistaken for this month's — and re-importing the same file is recognized safely.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <Check className="h-4 w-4 text-teal-500 shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <figure className="mt-6">
              <Image
                src="/quickbooks/solution-reconcile.jpg"
                alt="A laptop showing a bank reconciliation where every transaction matches and the total is balanced"
                width={1440}
                height={810}
                className="rounded-2xl shadow-lg ring-1 ring-slate-900/10 dark:ring-white/10 w-full h-auto"
              />
              <figcaption className="mt-2 text-center text-sm text-zinc-400">
                Illustration — your actual balance check appears on the conversion result.
              </figcaption>
            </figure>

            <h2 className={h2}>Export formats</h2>
            <p className={para}>
              QBO is the recommended format for QuickBooks, but every plan includes the formats
              below. Full walkthrough:{" "}
              <Link href="/guides/import-bank-statement-to-quickbooks" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                how to import bank statements into QuickBooks, step by step
              </Link>
              .
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
              {FORMATS.map((f, i) => (
                <div
                  key={f.name}
                  className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-4 ${i % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50 dark:bg-zinc-900/50"}`}
                >
                  <span className="font-bold text-zinc-900 dark:text-white w-32 shrink-0">{f.name}</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 flex-1">{f.use}</span>
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 shrink-0">{f.plan}</span>
                </div>
              ))}
            </div>

            <h2 className={h2}>Months behind? That&apos;s a cleanup, not a conversion</h2>
            <p className={para}>
              A converter fixes data entry, not a backlog. If your QuickBooks file has months of
              unreconciled accounts, duplicate transactions, and reports you can&apos;t trust at
              tax time, you need a cleanup: statements imported in order, everything categorized
              consistently, and each month re-reconciled until the balances match the bank. US
              firms typically charge four figures for this work.
            </p>
            <p className={para}>
              Our assessment is free, and you get a fixed quote before anything starts.{" "}
              <Link href="/contact" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                Contact us
              </Link>{" "}
              with the subject line &ldquo;QuickBooks Cleanup&rdquo; and tell us how many months
              and accounts you have. Want a quick self-check first? Run the{" "}
              <Link href="/tools/free-qbo-cleanup-checker" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                free duplicate finder
              </Link>{" "}
              on your latest export.
            </p>
            <figure className="mt-6">
              <Image
                src="/quickbooks/cleanup-team.jpg"
                alt="Two accounting professionals reviewing financial reports together during a QuickBooks cleanup"
                width={1440}
                height={960}
                className="rounded-2xl shadow-lg ring-1 ring-slate-900/10 dark:ring-white/10 w-full h-auto"
              />
            </figure>
          </div>

          {/* Sidebar (same pattern as guide pages) */}
          <div className="lg:col-span-4 space-y-10">
            <div className="p-6 rounded-2xl bg-teal-600 text-white">
              <h3 className="font-bold mb-2">Ready to convert?</h3>
              <p className="text-teal-100 text-sm mb-4">
                Your first 8 pages are free — CSV and Excel included, no credit card required.
              </p>
              <Link href="/signup" className="block w-full text-center bg-white text-teal-900 font-semibold py-2 rounded-lg hover:bg-zinc-50 transition-colors">
                Start Free Trial
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-500" /> QuickBooks Guides
              </h3>
              <div className="flex flex-col gap-3">
                {QB_BLOGS.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/blog/${b.slug}`}
                    className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-teal-300 dark:hover:border-teal-700 bg-zinc-50 dark:bg-zinc-900/50 transition-colors"
                  >
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm">
                      {b.label}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-500" /> Free QuickBooks tools
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { href: "/tools/free-qbo-cleanup-checker", label: "QBO Duplicate Finder & Cleanup Checker" },
                  { href: "/tools/free-stripe-to-quickbooks", label: "Stripe → QuickBooks Payout Converter" },
                  { href: "/tools/free-paypal-to-quickbooks", label: "PayPal → QuickBooks Payout Converter" },
                  { href: "/tools/free-receipt-to-quickbooks", label: "Receipt → QuickBooks Converter" },
                  { href: "/tools/qbo-checker", label: "QBO File Checker" },
                  { href: "/tools/csv-to-qbo", label: "CSV → QBO Converter" },
                  { href: "/tools/amazon-to-quickbooks", label: "Amazon Settlement → QuickBooks" },
                  { href: "/tools/shopify-to-quickbooks", label: "Shopify Payout → QuickBooks" },
                  { href: "/tools/reconciliation-finder", label: "Reconciliation Difference Finder" },
                  { href: "/tools/qbo-import-errors", label: "QBO Import Errors, Explained" },
                ].map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-teal-300 dark:hover:border-teal-700 bg-zinc-50 dark:bg-zinc-900/50 transition-colors"
                  >
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm">
                      {t.label}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-500" /> Specific Bank Converters
              </h3>
              <div className="flex flex-col gap-2">
                {QB_BANKS.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/banks/${b.slug}`}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 flex items-center justify-between group"
                  >
                    {b.label} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing ───────────────────────────────────────── */}
        <section className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white text-center">
              Less than one hour of a bookkeeper&apos;s time
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-center max-w-2xl mx-auto">
              Start free with CSV export. Move to Pro when you want one-click QBO files with the
              balance check for client books — 500 pages a month.
            </p>
            <div className="mt-8">
              <PricingCards />
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white text-center mb-8">
            QuickBooks conversion questions
          </h2>
          <FAQAccordion items={FAQS} />
        </section>

        {/* ── Final CTA (guide sidebar box pattern, centered) ── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="p-8 rounded-2xl bg-teal-600 text-white text-center">
            <h2 className="text-2xl font-extrabold">Your next statement could take one minute.</h2>
            <p className="text-teal-100 mt-3 max-w-lg mx-auto">
              Upload the PDF, watch the balance check pass, import the QBO. The first 8 pages are
              on us.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-block bg-white text-teal-900 font-semibold px-8 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              Start Converting Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
