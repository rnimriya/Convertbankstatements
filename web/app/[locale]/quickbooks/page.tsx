import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingCards } from "@/components/PricingCards";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import {
  ArrowRight, Upload, FileDown, ClipboardCheck, Shield,
  Sparkles, BookOpen, Check, X,
  CheckCircle2, Scale, Fingerprint, FileCheck2,
} from "lucide-react";

const PAGE_URL = "https://convertstatement.online/quickbooks";

export const metadata: Metadata = {
  title: "Convert PDF Bank Statements to QuickBooks (QBO & CSV) — Convert Statement",
  description:
    "Turn any PDF bank statement into a QuickBooks-ready QBO or CSV file in minutes. Every export is balance-checked against the statement before you import. Built for US bookkeepers and small businesses. First 8 pages free.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "PDF Bank Statement to QuickBooks Converter (QBO & CSV)",
    description:
      "Upload a statement PDF, download a balance-verified QBO file, and reconcile in QuickBooks without manual data entry. First 8 pages free.",
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
    q: "Is my financial data stored on your servers?",
    a: "No. Statements are processed in memory to build your export file and are not retained afterwards. We never sell or share your financial data.",
  },
  {
    q: "My books are months behind. Can a converter fix that?",
    a: "A converter fixes data entry, not a backlog. If several months are unreconciled or your chart of accounts is a mess, you need a cleanup: statements imported in order, transactions categorized consistently, and each month re-reconciled. We offer a free cleanup assessment with a fixed quote before any work starts — use the contact page and tell us how many months and accounts you have.",
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
    body: "We extract every transaction with its date, description, and amount, check the running balances, and build a QBO file (or CSV, QFX, OFX, Excel) with USD defaults for US QuickBooks accounts.",
  },
  {
    icon: <ClipboardCheck className="h-6 w-6 text-white" />,
    title: "3. Import and reconcile",
    body: "Upload the file in QuickBooks, categorize the transactions in the For review tab, and reconcile against the statement's closing balance. No typing, no transposed digits.",
  },
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
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
          <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider">
                For QuickBooks Online &amp; Desktop
              </p>
              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white leading-[1.08]">
                Your bank statement, in QuickBooks,{" "}
                <span className="text-blue-600 dark:text-blue-400">in minutes — not hours.</span>
              </h1>
              <p className="mt-5 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
                QuickBooks can&apos;t read statement PDFs, so bookkeepers type them in by hand —
                and one wrong digit breaks reconciliation. Convert Statement turns the PDF into a
                clean QBO file, <strong className="text-zinc-700 dark:text-zinc-200">balance-checked against the statement itself</strong>,
                ready to import.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-white font-semibold hover:bg-blue-500 transition-colors"
                >
                  Convert Your First Statement Free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/guides/import-bank-statement-to-quickbooks"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-6 py-3.5 font-semibold text-zinc-800 dark:text-zinc-100 hover:border-blue-400 transition-colors"
                >
                  <BookOpen className="h-4 w-4" /> See How Import Works
                </Link>
              </div>
              <div className="mt-6 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> First 8 pages free — no credit card required</p>
                <p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Files processed in memory — never stored on our servers</p>
                <p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Works with Chase, Bank of America, Wells Fargo, Citi &amp; hundreds more</p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/quickbooks/hero-bookkeeper.jpg"
                alt="A bookkeeper reviewing clean financial charts after converting a bank statement for QuickBooks"
                width={1440}
                height={960}
                priority
                className="rounded-3xl shadow-2xl shadow-blue-200/60 dark:shadow-none w-full h-auto"
              />
              {/* Real result from our end-to-end test with a sample statement */}
              <div className="sm:absolute sm:-bottom-6 sm:-left-6 mt-4 sm:mt-0 rounded-2xl border border-emerald-200 bg-white dark:bg-zinc-900 dark:border-emerald-800 shadow-xl p-4 max-w-sm">
                <p className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                  <CheckCircle2 className="h-5 w-5" /> Balance verified
                </p>
                <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Opening {fmtUSD(2000)} → Closing {fmtUSD(10123.97)} · 10 transactions ·
                  every running balance ties to the statement.
                </p>
                <p className="mt-1 text-xs text-zinc-400">Actual result from our converter test with a sample Chase statement</p>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
            <div className="mx-auto max-w-7xl px-6 py-5 flex items-stretch justify-center gap-2.5 flex-wrap">
              {[
                { name: "QBO", sub: "QuickBooks — recommended", active: true },
                { name: "CSV", sub: "QBO manual upload", active: false },
                { name: "QFX / OFX", sub: "Quicken & others", active: false },
                { name: "Excel", sub: "Review first", active: false },
                { name: "Google Sheets", sub: "Direct sync", active: false },
              ].map((f) => (
                <span
                  key={f.name}
                  className={`rounded-xl border px-4 py-2 text-left ${
                    f.active
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
                  }`}
                >
                  <span className="block text-sm font-bold leading-tight">{f.name}</span>
                  <span className="block text-[11px] text-zinc-400 leading-tight mt-0.5">{f.sub}</span>
                </span>
              ))}
            </div>
            <p className="pb-5 -mt-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Full walkthrough:{" "}
              <Link href="/guides/import-bank-statement-to-quickbooks" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                How to import bank statements into QuickBooks, step by step
              </Link>
            </p>
          </div>
        </section>

        {/* ── Problem ──────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Image
              src="/quickbooks/problem-messy-desk.jpg"
              alt="A business owner late at night surrounded by stacks of printed bank statements"
              width={1440}
              height={810}
              className="rounded-3xl shadow-lg w-full h-auto order-2"
            />
            <div className="order-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                Sound familiar?
              </h2>
              <p className="mt-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Month-end arrives. The bank feed skipped six weeks, the statement is a 14-page PDF,
                and QuickBooks is waiting for numbers that only exist on paper. So the typing starts —
                and so do the errors that surface weeks later, at reconciliation, when they&apos;re
                hardest to find.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Reconciliation difference that won't go to zero, no matter how many times you re-check",
                  "Transactions typed twice — once by hand, once by the bank feed",
                  "A whole evening lost to data entry instead of running the business",
                  "Tax time pressure because the books are months behind the bank",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-200">
                    <span className="mt-0.5 rounded-full bg-red-100 dark:bg-red-900/40 p-1 shrink-0"><X className="h-3.5 w-3.5 text-red-500" /></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-semibold text-zinc-900 dark:text-white">
                None of that is a bookkeeping problem. It&apos;s a file-format problem — and it has a one-minute fix.
              </p>
            </div>
          </div>

        </section>

        {/* ── How it works ─────────────────────────────────── */}
        <section className="bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-100 dark:border-zinc-800">
          <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white text-center">
            From PDF to reconciled in three steps
          </h2>
          <div className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {STEPS.map((s, i) => (
              <div key={s.title} className="grid grid-cols-1 sm:grid-cols-[90px_1fr_1.5fr] gap-1 sm:gap-6 items-center px-6 sm:px-8 py-6">
                <span className="text-4xl font-black text-blue-200 dark:text-blue-900">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-bold text-zinc-900 dark:text-white">{s.title.replace(/^\d+\.\s*/, "")}</h3>
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

        {/* ── Reconciliation spotlight ─────────────────────── */}
        <section className="bg-zinc-900 dark:bg-zinc-900 text-white">
          <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 text-emerald-300 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider">
                <Scale className="h-3.5 w-3.5" /> The reconciliation difference
              </p>
              <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight">
                Every export is balance-checked <span className="text-emerald-400">before</span> it reaches QuickBooks
              </h2>
              <p className="mt-4 text-zinc-300 leading-relaxed">
                Most converters hand you a file and wish you luck. Ours proves itself first: we walk
                the statement&apos;s running balances and verify every single step. If the numbers
                tie, you see the proof. If they don&apos;t, you see a warning — not a surprise inside
                QuickBooks three weeks later.
              </p>
              <ul className="mt-7 space-y-5">
                <li className="flex gap-4">
                  <span className="rounded-xl bg-emerald-500/15 p-2.5 h-fit shrink-0"><FileCheck2 className="h-5 w-5 text-emerald-300" /></span>
                  <div>
                    <p className="font-bold">Balance-Check on every conversion</p>
                    <p className="text-sm text-zinc-400 leading-relaxed mt-1">Opening balance, every transaction, closing balance — the full chain is verified and shown on your result, so reconciliation starts from a file that already agrees with the bank.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="rounded-xl bg-emerald-500/15 p-2.5 h-fit shrink-0"><Scale className="h-5 w-5 text-emerald-300" /></span>
                  <div>
                    <p className="font-bold">Closing balance travels inside the QBO</p>
                    <p className="text-sm text-zinc-400 leading-relaxed mt-1">The statement&apos;s closing balance is embedded in the file as its ledger balance, dated to the statement&apos;s real period — the exact target QuickBooks reconciliation aims at.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="rounded-xl bg-emerald-500/15 p-2.5 h-fit shrink-0"><Fingerprint className="h-5 w-5 text-emerald-300" /></span>
                  <div>
                    <p className="font-bold">Transaction IDs that can&apos;t collide</p>
                    <p className="text-sm text-zinc-400 leading-relaxed mt-1">Each transaction ID is derived from its own date, description, and amount. Next month&apos;s file can never be mistaken for this month&apos;s — and re-importing the same file is recognized safely.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="lg:order-1">
              <Image
                src="/quickbooks/solution-reconcile.jpg"
                alt="A laptop showing a bank reconciliation where every transaction matches and the total is balanced"
                width={1440}
                height={810}
                className="rounded-3xl shadow-2xl w-full h-auto"
              />
              <p className="mt-3 text-xs text-zinc-500 text-center">Illustration — your actual balance check appears on the conversion result, as shown in the hero above.</p>
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────── */}
        <section className="bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-100 dark:border-zinc-800">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white text-center">
              Less than one hour of a bookkeeper&apos;s time
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-center max-w-2xl mx-auto">
              Start free with CSV export. Move to Pro when you want one-click QBO files with the
              balance check for client books — 500 pages a month.
            </p>
            <div className="mt-10">
              <PricingCards />
            </div>
          </div>
        </section>

        {/* ── Cleanup upsell ───────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 border-l-8 border-l-blue-600 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="px-6 py-10 sm:px-12 sm:py-12">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-wider">
                <Sparkles className="h-4 w-4" /> QuickBooks Cleanup Service
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight text-zinc-900 dark:text-white">
                Months behind on your books? A converter alone won&apos;t fix that.
              </h2>
              <p className="mt-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
                If your QuickBooks file has months of unreconciled accounts, duplicate transactions,
                and reports you can&apos;t trust at tax time, you need a cleanup — statements imported
                in order, everything categorized consistently, and each month re-reconciled until the
                balances match the bank. US firms typically charge four figures for this work. Our
                assessment is free, and you get a fixed quote before anything starts.
              </p>
              <div className="mt-7">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                  Get a Free Cleanup Assessment <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-3 text-sm text-zinc-400">
                  Use subject line &ldquo;QuickBooks Cleanup&rdquo; and tell us how many months and accounts you have.
                </p>
              </div>
            </div>
            <Image
              src="/quickbooks/cleanup-team.jpg"
              alt="Two accounting professionals reviewing financial reports together during a QuickBooks cleanup"
              width={1440}
              height={960}
              className="w-full h-full object-cover min-h-64"
            />
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white text-center mb-8">
            QuickBooks conversion questions
          </h2>
          <FAQAccordion items={FAQS} />
        </section>

        {/* ── Final CTA ────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="px-6 py-6 text-center">
            <Shield className="h-10 w-10 mx-auto text-blue-600" />
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">Your next statement could take one minute.</h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Upload the PDF, watch the balance check pass, import the QBO. The first 8 pages are on us.
            </p>
            <Link
              href="/signup"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white hover:bg-blue-500 transition-colors"
            >
              Start Converting Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ── Related resources ────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Bank-by-bank QuickBooks guides</h3>
              <div className="flex flex-col gap-3">
                {QB_BLOGS.map((b) => (
                  <Link key={b.slug} href={`/blog/${b.slug}`} className="group flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400">
                    {b.label} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Convert a specific bank&apos;s statements</h3>
              <div className="flex flex-col gap-3">
                {QB_BANKS.map((b) => (
                  <Link key={b.slug} href={`/banks/${b.slug}`} className="group flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400">
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
