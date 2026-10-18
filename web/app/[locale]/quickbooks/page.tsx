import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingCards } from "@/components/PricingCards";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import {
  ArrowRight, Upload, FileDown, ClipboardCheck, Shield, Clock,
  AlertTriangle, RefreshCcw, FileText, Landmark, Sparkles, BookOpen,
} from "lucide-react";

const PAGE_URL = "https://convertstatement.online/quickbooks";

export const metadata: Metadata = {
  title: "Convert PDF Bank Statements to QuickBooks (QBO & CSV) — Convert Statement",
  description:
    "Turn any PDF bank statement into a QuickBooks-ready QBO or CSV file in minutes. Built for US bookkeepers and small businesses using QuickBooks Online or Desktop. First 8 pages free.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "PDF Bank Statement to QuickBooks Converter (QBO & CSV)",
    description:
      "Upload a statement PDF, download a QBO file QuickBooks accepts, and reconcile without manual data entry. First 8 pages free.",
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
    q: "Which format should I use: QBO or CSV?",
    a: "QBO is the safer default. Dates, amounts, and transaction types are already structured the way QuickBooks expects, so there is no column mapping to get wrong. CSV also works in QuickBooks Online through manual upload, but you must map the columns during import and use one consistent style — a single Amount column, or separate Money In / Money Out columns.",
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
    a: "Only if you import a period your live bank feed already downloaded. Before uploading, check the file's date range against what is already in QuickBooks and import each statement period once, oldest first. Imported transactions sit in the For review tab, so you can catch and exclude anything that does not belong before it reaches your books.",
  },
  {
    q: "Is QBO export included on the free plan?",
    a: "The free plan includes 8 pages with CSV and Excel export — and QuickBooks Online accepts CSV through manual upload, so you can test the full flow for free. QBO, QFX, and OFX export are included on the Pro plan ($20/month, 500 pages), which is what most bookkeepers use for client work.",
  },
  {
    q: "Is my financial data stored on your servers?",
    a: "No. Statements are processed in memory to build your export file and are not retained afterwards. We never sell or share your financial data.",
  },
  {
    q: "My books are months behind. Can a converter fix that?",
    a: "A converter fixes data entry, not a backlog. If several months are unreconciled or your chart of accounts is a mess, you need a cleanup: statements imported in order, transactions categorized consistently, and each month re-reconciled. We offer a free cleanup assessment with a fixed quote before any work starts — use the contact page and tell us how many months and accounts you have.",
  },
];

const PAINS = [
  {
    icon: <RefreshCcw className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
    title: "Reconciliation won't tie out",
    body: "The beginning balance is off, a prior-period entry was edited, and the difference is never zero. Most reconciliation breaks trace back to missing or duplicated transactions — exactly what a clean, statement-based import prevents.",
  },
  {
    icon: <AlertTriangle className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
    title: "Bank feed gaps and duplicates",
    body: "Feeds disconnect, skip months, or re-download transactions you already entered by hand. When the feed can't give you the history, the official statement PDF is the only complete record you have.",
  },
  {
    icon: <Clock className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
    title: "Hours lost to manual typing",
    body: "Typing hundreds of transactions from a PDF into QuickBooks is slow and error-prone — one transposed digit can take an hour to find at reconciliation time. Converting the statement takes minutes instead.",
  },
];

const STEPS = [
  {
    icon: <Upload className="h-6 w-6 text-white" />,
    title: "1. Upload your statement PDF",
    body: "Drag in the official PDF from your bank — Chase, Bank of America, Wells Fargo, Citi, and hundreds more. Scanned statements and multi-page files are supported.",
  },
  {
    icon: <FileDown className="h-6 w-6 text-white" />,
    title: "2. Download the QBO file",
    body: "We extract every transaction with its date, description, and amount, and build a QBO file (or CSV, QFX, OFX, Excel) with USD defaults set for US QuickBooks accounts.",
  },
  {
    icon: <ClipboardCheck className="h-6 w-6 text-white" />,
    title: "3. Import and reconcile",
    body: "Upload the file in QuickBooks, categorize the transactions in the For review tab, and reconcile against the statement's closing balance. No typing, no transposed digits.",
  },
];

const FORMATS = [
  { name: "QBO", use: "QuickBooks Online upload & Desktop Web Connect — recommended", plan: "Pro" },
  { name: "CSV", use: "QuickBooks Online manual upload with column mapping", plan: "Free & all plans" },
  { name: "QFX / OFX", use: "Quicken and other accounting software that reads OFX", plan: "Pro" },
  { name: "Excel (.xlsx)", use: "Review, categorize, and clean up before importing", plan: "Free & all plans" },
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

export default async function QuickBooksPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Convert Statement — QuickBooks Converter",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: PAGE_URL,
    description:
      "Convert PDF bank statements to QuickBooks-ready QBO and CSV files for QuickBooks Online and Desktop.",
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
      name: s.title.replace(/^\d+\.\s*/, ""),
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
        {/* Hero */}
        <section className="bg-gradient-to-b from-violet-50/70 to-white dark:from-zinc-900 dark:to-zinc-950 border-b border-zinc-100 dark:border-zinc-800 px-6 py-16 sm:py-20 text-center">
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-3">
            For QuickBooks Online &amp; Desktop
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white leading-tight max-w-4xl mx-auto">
            PDF Bank Statements to QuickBooks — Without the Manual Data Entry
          </h1>
          <p className="mt-5 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            QuickBooks can&apos;t read statement PDFs. Convert Statement turns them into clean
            QBO or CSV files QuickBooks accepts — so you can import, categorize, and reconcile
            in minutes instead of typing for hours.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-white font-semibold hover:bg-violet-500 transition-colors"
            >
              Convert Your First Statement Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/guides/import-bank-statement-to-quickbooks"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-6 py-3.5 font-semibold text-zinc-800 dark:text-zinc-100 hover:border-violet-400 transition-colors"
            >
              <BookOpen className="h-4 w-4" /> Read the Import Guide
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5"><Shield className="h-4 w-4 text-emerald-500" /> Files processed in memory — never stored</span>
            <span className="inline-flex items-center gap-1.5"><FileText className="h-4 w-4 text-emerald-500" /> First 8 pages free, no card required</span>
            <span className="inline-flex items-center gap-1.5"><Landmark className="h-4 w-4 text-emerald-500" /> Chase, Bank of America, Wells Fargo, Citi &amp; hundreds more</span>
          </div>
        </section>

        {/* Pain points */}
        <section className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white text-center">
            Why QuickBooks users end up here
          </h2>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-center max-w-2xl mx-auto">
            The bank feed is great — until it isn&apos;t. These are the three problems that send
            bookkeepers and business owners looking for a statement converter.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAINS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6">
                <div className="mb-4">{p.icon}</div>
                <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{p.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-100 dark:border-zinc-800">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white text-center">
              From PDF to reconciled in three steps
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s) => (
                <div key={s.title} className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="mb-4 inline-flex rounded-xl bg-violet-600 p-2.5">{s.icon}</div>
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </div>
        </section>

        {/* Formats */}
        <section className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white text-center">
            Every format QuickBooks takes — and a few more
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            {FORMATS.map((f, i) => (
              <div
                key={f.name}
                className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-4 ${i % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50 dark:bg-zinc-900/50"}`}
              >
                <span className="font-bold text-zinc-900 dark:text-white w-32 shrink-0">{f.name}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 flex-1">{f.use}</span>
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 shrink-0">{f.plan}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            Full walkthrough:{" "}
            <Link href="/guides/import-bank-statement-to-quickbooks" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">
              How to import bank statements into QuickBooks, step by step
            </Link>
          </p>
        </section>

        {/* Pricing */}
        <section className="bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-100 dark:border-zinc-800">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white text-center">
              Pricing that pays for itself in one statement
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-center max-w-2xl mx-auto">
              Start free with CSV export. Move to Pro when you want one-click QBO files for
              client books — 500 pages a month for less than one hour of manual data entry.
            </p>
            <div className="mt-10">
              <PricingCards />
            </div>
          </div>
        </section>

        {/* Cleanup upsell */}
        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-3xl bg-violet-700 dark:bg-violet-800 px-6 py-10 sm:px-12 sm:py-12 text-white">
            <div className="flex items-center gap-2 text-violet-200 text-sm font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" /> QuickBooks Cleanup Service
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight max-w-3xl">
              Months behind on your books? A converter alone won&apos;t fix that.
            </h2>
            <p className="mt-4 text-violet-100 max-w-3xl leading-relaxed">
              If your QuickBooks file has months of unreconciled accounts, duplicate transactions,
              and reports you can&apos;t trust at tax time, you need a cleanup — statements imported
              in order, everything categorized consistently, and each month re-reconciled until the
              balances match the bank. US firms typically charge four figures for this work. Our
              assessment is free, and you get a fixed quote before anything starts.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-violet-900 hover:bg-zinc-100 transition-colors"
              >
                Get a Free Cleanup Assessment <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-sm text-violet-200 self-center">
                Use subject line &ldquo;QuickBooks Cleanup&rdquo; and tell us how many months and accounts you have.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 pb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white text-center mb-8">
            QuickBooks conversion questions
          </h2>
          <FAQAccordion items={FAQS} />
        </section>

        {/* Related resources */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Bank-by-bank QuickBooks guides</h3>
              <div className="flex flex-col gap-3">
                {QB_BLOGS.map((b) => (
                  <Link key={b.slug} href={`/blog/${b.slug}`} className="group flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400">
                    {b.label} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Convert a specific bank&apos;s statements</h3>
              <div className="flex flex-col gap-3">
                {QB_BANKS.map((b) => (
                  <Link key={b.slug} href={`/banks/${b.slug}`} className="group flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400">
                    {b.label} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
