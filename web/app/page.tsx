import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, FileText, Zap, Lock, Globe,
  Download, ChevronDown, TrendingUp, Shield, Clock, IndianRupee,
} from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "https://bankstatements.io" },
};
import { Footer } from "@/components/layout/Footer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const INDIAN_BANKS = [
  "SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank",
  "PNB", "Bank of Baroda", "Canara Bank", "Union Bank", "IndusInd",
  "Yes Bank", "IDFC FIRST", "Federal Bank", "RBL Bank", "Bandhan Bank",
  "Indian Bank", "Central Bank", "UCO Bank", "Bank of India", "AU Bank",
];

const STATS = [
  { value: "30+", label: "Indian banks supported" },
  { value: "5", label: "Export formats" },
  { value: "< 15s", label: "Processing time" },
  { value: "₹49", label: "Pay-per-document" },
];

const STEPS = [
  { step: "01", icon: <FileText className="h-5 w-5" />, title: "Upload your PDF", desc: "Drag and drop your bank statement. Works with SBI, HDFC, ICICI, Axis, Kotak, and 25+ more. Any year, any account type." },
  { step: "02", icon: <Zap className="h-5 w-5" />, title: "We extract every transaction", desc: "Dates, descriptions, amounts, and balances are pulled out automatically. Works on password-protected and scanned PDFs too." },
  { step: "03", icon: <Download className="h-5 w-5" />, title: "Download and use it", desc: "Get CSV, Excel, or OFX for Tally and QuickBooks. You can also push straight to Google Sheets." },
];

const FEATURES = [
  { icon: <Globe className="h-5 w-5 text-brand-600" />, bg: "bg-brand-50 dark:bg-brand-900/30", title: "30+ Indian banks", desc: "SBI, HDFC, ICICI, Axis, Kotak, PNB, Bank of Baroda, Canara, IndusInd, Yes Bank, IDFC FIRST, Federal Bank, RBL, and Bandhan are all supported. Cooperative banks work too." },
  { icon: <Zap className="h-5 w-5 text-amber-600" />, bg: "bg-amber-50 dark:bg-amber-900/20", title: "5 export formats", desc: "Pick CSV, Excel, OFX for Tally or QuickBooks, QFX for Quicken, or sync straight to Google Sheets. No copy-pasting." },
  { icon: <Lock className="h-5 w-5 text-emerald-600" />, bg: "bg-emerald-50 dark:bg-emerald-900/20", title: "Your data is never stored", desc: "PDFs are processed in memory and deleted right after. Nothing is written to disk or kept on our servers." },
  { icon: <TrendingUp className="h-5 w-5 text-purple-600" />, bg: "bg-purple-50 dark:bg-purple-900/20", title: "Auto categorisation", desc: "Every transaction gets a label: groceries, fuel, EMI, salary, UPI, utilities. Your books are sorted before you open them." },
  { icon: <Shield className="h-5 w-5 text-rose-600" />, bg: "bg-rose-50 dark:bg-rose-900/20", title: "Payments via Razorpay", desc: "Pay with UPI, card, net banking, or wallet. All connections use TLS 1.3. No data is shared with third parties." },
  { icon: <Clock className="h-5 w-5 text-sky-600" />, bg: "bg-sky-50 dark:bg-sky-900/20", title: "Done in under 15 seconds", desc: "A 12-month PDF with 300 transactions is ready to download in about 10 seconds. No waiting, no queue." },
];

const PRICING = [
  { label: "First 8 pages", price: "Free", sub: "No card required", highlight: false },
  { label: "Pay-per-document", price: "₹49", sub: "UPI / Card / NetBanking", highlight: false },
  { label: "Pro — 200 pages/mo", price: "₹399", sub: "Best for CAs & freelancers", highlight: true },
  { label: "Business — 500 pages/mo", price: "₹999", sub: "CA firms & fintech teams", highlight: false },
];

const FAQS = [
  { q: "Which Indian banks are supported?", a: "Over 30 banks work right now: SBI, HDFC, ICICI, Axis, Kotak, PNB, Bank of Baroda, Canara, Union Bank, IndusInd, Yes Bank, IDFC FIRST, Federal Bank, RBL, Bandhan, and several cooperative and payment banks. If your bank is not on the list, email us and we will check." },
  { q: "Is my financial data safe?", a: "Yes. Your PDF is processed in memory and deleted the moment we send back your data. Nothing is written to disk. Nothing is stored in a database. We follow GDPR and India's IT Act 2000." },
  { q: "Can I process password-protected PDFs?", a: "Yes. Most Indian bank PDFs are locked with your date of birth or mobile number. Enter the password during upload and we handle the rest. We do not store the password." },
  { q: "How does the 8 free pages work?", a: "Every new account gets 8 pages free, no card needed. That covers most 1-3 month statements. After that, pay Rs. 49 per document or switch to a monthly plan if you convert often." },
  { q: "How do I import into Tally?", a: "Tally accepts OFX bank feeds. Export as OFX from BankStatements, then import into Tally ERP or Tally Prime through the Bank Reconciliation module. Takes about two minutes." },
  { q: "Can I pay via UPI?", a: "Yes. We accept Google Pay, PhonePe, Paytm, BHIM, all Visa and Mastercard cards, RuPay, net banking, and wallets. Payments go through Razorpay." },
];

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 dark:border-white/10 bg-white/80 dark:bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="BankStatements" className="h-8 w-8" />
          <div className="hidden sm:block">
            <span className="font-bold text-slate-800 dark:text-white">BankStatements</span>
            <span className="ml-1.5 rounded-full bg-brand-100 dark:bg-brand-900/50 px-1.5 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">India</span>
          </div>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="#how-it-works" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">How it works</Link>
          <Link href="#features" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">Features</Link>
          <Link href="/pricing" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">Pricing</Link>
          <Link href="#faq" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">FAQ</Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-gray-100">Sign in</Link>
          <Link href="/signup" className="rounded-lg bg-brand-400 px-4 py-2 text-sm font-semibold text-black hover:bg-brand-300 transition-colors">
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-surface px-6 pb-10 pt-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[360px] w-[500px] -translate-x-1/2 rounded-full bg-brand-50 dark:bg-brand-900/20 blur-3xl opacity-50" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">

          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              8 pages free · No card needed · Pay via UPI
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Turn Indian bank PDFs
              <br />
              <span className="bg-gradient-to-r from-brand-300 to-brand-400 bg-clip-text text-transparent dark:neon-text-glow">
                into clean Excel data
              </span>
            </h1>

            <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-500 dark:text-gray-400 lg:mx-0 mx-auto">
              Works with SBI, HDFC, ICICI, Axis, Kotak, and 25+ more.
              Get CSV, Excel, OFX for Tally, or Google Sheets in under 15 seconds.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/signup"
                className="flex items-center gap-2 rounded-lg bg-brand-400 px-5 py-2.5 text-sm font-bold text-black shadow-glow-sm hover:bg-brand-300 transition-all hover:scale-[1.02]"
              >
                Start free <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-surface px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <IndianRupee className="h-3.5 w-3.5 text-brand-500" /> See pricing
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 lg:justify-start">
              {["30+ Indian banks", "Rs. 49 per document", "Data deleted after conversion"].map((t) => (
                <span key={t} className="flex items-center gap-1 text-xs text-slate-400 dark:text-gray-500">
                  <span className="text-emerald-500">✓</span> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full max-w-sm shrink-0 lg:max-w-xs xl:max-w-sm">
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/50">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-surface px-3 py-2">
                <div className="flex gap-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto flex items-center gap-1.5 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-surface px-2 py-0.5 text-[10px] text-slate-400 dark:text-gray-400">
                  <Lock className="h-2.5 w-2.5 text-emerald-500" /> bankstatements.io
                </div>
              </div>
              <MockDashboard />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function MockDashboard() {
  return (
    <div className="bg-slate-50 dark:bg-surface p-3 space-y-2">
      <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-surface px-3 py-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600 dark:text-gray-300">Free pages</span>
          <span className="font-bold text-brand-600 dark:text-brand-400">6 / 8 left</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/10">
          <div className="h-1.5 w-1/4 rounded-full bg-brand-500" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-200 dark:border-brand-700 bg-brand-50 dark:bg-brand-900/20 py-5 gap-1.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-800/50">
          <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        </div>
        <p className="text-xs font-semibold text-slate-700 dark:text-gray-200">Drop SBI / HDFC / ICICI PDF</p>
        <div className="flex gap-1.5">
          {["CSV", "Excel", "OFX"].map((f) => (
            <span key={f} className="rounded-full border border-brand-200 dark:border-brand-700 bg-white dark:bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 dark:text-brand-400">{f}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-surface px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-900/30">
          <FileText className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold text-slate-700 dark:text-gray-200">SBI_Nov2024.pdf</p>
          <p className="text-[10px] text-slate-400 dark:text-gray-500">58 transactions · CSV ready</p>
        </div>
        <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Free</span>
      </div>
    </div>
  );
}

function BankLogos() {
  return (
    <section className="border-y border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-surface/50 py-10">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-gray-500">Works with statements from</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {INDIAN_BANKS.map((bank) => (
            <span key={bank} className="rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-surface px-3 py-1 text-xs font-semibold text-slate-600 dark:text-gray-300 shadow-sm">
              {bank}
            </span>
          ))}
          <span className="rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-700 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">+ more</span>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="bg-white dark:bg-surface py-14">
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">{value}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 dark:bg-surface/50 px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-400">How it works</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Upload, convert, done</h2>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {STEPS.map(({ step, icon, title, desc }) => (
            <div key={step} className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-400 text-black shadow-glow dark:shadow-brand-900/50">{icon}</div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 translate-x-6 rounded-full bg-brand-100 dark:bg-brand-900/50 px-2.5 py-0.5 text-xs font-bold text-brand-600 dark:text-brand-400">{step}</div>
              <h3 className="mt-5 text-lg font-bold text-slate-800 dark:text-gray-200">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="bg-white dark:bg-surface px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-400">Features</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Everything a CA or bookkeeper needs</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
          {FEATURES.map(({ icon, bg, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-shadow">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>{icon}</div>
              <h3 className="mt-4 font-bold text-slate-800 dark:text-gray-200">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPreview() {
  return (
    <section className="bg-slate-50 dark:bg-surface/50 px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-400">Pricing</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Pay only for what you use</h2>
        <p className="mt-3 text-slate-500 dark:text-gray-400">Start free. Pay Rs. 49 per document after that, or pick a monthly plan if you convert often.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING.map(({ label, price, sub, highlight }) => (
            <div key={label} className={`rounded-2xl border p-5 text-left ${highlight ? "border-brand-400 bg-brand-400 text-black" : "border-slate-200 dark:border-white/10 bg-white dark:bg-surface"}`}>
              <p className={`text-sm font-medium ${highlight ? "text-brand-100" : "text-slate-600 dark:text-gray-300"}`}>{label}</p>
              <p className={`mt-2 text-3xl font-extrabold ${highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>{price}</p>
              <p className={`mt-1 text-xs ${highlight ? "text-brand-200" : "text-slate-400 dark:text-gray-500"}`}>{sub}</p>
            </div>
          ))}
        </div>

        <Link href="/pricing" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline">
          View full pricing <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="bg-white dark:bg-surface px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-400">FAQ</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Common questions</h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-800 dark:text-gray-200">
                {q}
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 dark:text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-gray-400">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-[#0a0f1e] dark:bg-[#0a0f1e] border-y border-brand-900/50 px-6 py-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.12)_0%,transparent_70%)] pointer-events-none" />
      <h2 className="relative text-3xl font-extrabold text-white sm:text-4xl">Stop typing out bank transactions by hand</h2>
      <p className="relative mt-4 text-lg text-brand-300">CAs and bookkeepers use this to cut hours of data entry down to seconds.</p>
      <div className="relative mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/signup" className="flex items-center gap-2 rounded-xl bg-brand-400 px-8 py-3.5 font-bold text-black shadow-glow hover:bg-brand-300 transition-all hover:scale-[1.02]">
          Get 8 pages free <ArrowRight className="h-4 w-4" />
        </Link>
        <span className="text-sm text-brand-400/70">No card needed. Pay via UPI if you need more.</span>
      </div>
    </section>
  );
}


const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BankStatements India",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://bankstatements.io",
  description:
    "Convert Indian bank statement PDFs from SBI, HDFC, ICICI, Axis, Kotak and 25+ more into CSV, Excel, OFX for Tally, or Google Sheets in under 15 seconds.",
  offers: [
    {
      "@type": "Offer",
      name: "Free tier",
      price: "0",
      priceCurrency: "INR",
      description: "First 8 pages free, no credit card required",
    },
    {
      "@type": "Offer",
      name: "Pay-per-document",
      price: "49",
      priceCurrency: "INR",
      description: "₹49 per document, all formats, all Indian banks",
    },
    {
      "@type": "Offer",
      name: "Pro plan",
      price: "399",
      priceCurrency: "INR",
      description: "₹399/month — 200 pages, Google Sheets, priority processing",
    },
    {
      "@type": "Offer",
      name: "Business plan",
      price: "999",
      priceCurrency: "INR",
      description: "₹999/month — 500 pages for CA firms and fintech teams",
    },
  ],
  featureList: [
    "30+ Indian banks supported",
    "CSV, Excel, OFX, QFX, Google Sheets export",
    "Password-protected PDF support",
    "Auto-categorisation of transactions",
    "Under 15 seconds processing time",
    "Data deleted after conversion — never stored",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "120",
    bestRating: "5",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert an Indian bank statement PDF to Excel or CSV",
  description:
    "Convert any Indian bank PDF (SBI, HDFC, ICICI, Axis, Kotak and more) to CSV, Excel, or OFX in under 15 seconds using BankStatements.",
  totalTime: "PT15S",
  tool: [{ "@type": "HowToTool", name: "BankStatements India", url: "https://bankstatements.io" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload your PDF",
      text: "Drag and drop your bank statement PDF. Works with SBI, HDFC, ICICI, Axis, Kotak, and 25+ more Indian banks. Any year, any account type, including password-protected and scanned PDFs.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Automatic extraction",
      text: "Dates, descriptions, amounts, and balances are extracted automatically. Transactions are categorised as groceries, fuel, EMI, salary, UPI, utilities, and more.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Download your data",
      text: "Download as CSV, Excel (.xlsx), OFX for Tally or QuickBooks, QFX for Quicken, or push straight to Google Sheets.",
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Navbar />
      <Hero />
      <BankLogos />
      <Stats />
      <HowItWorks />
      <Features />
      <PricingPreview />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
