import Link from "next/link";
import {
  ArrowRight, CheckCircle2, FileText, Zap, Lock, Globe,
  Download, ChevronDown, TrendingUp, Shield, Clock, IndianRupee,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";

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
  { step: "01", icon: <FileText className="h-5 w-5" />, title: "Upload your PDF", desc: "Drag and drop your bank statement — SBI, HDFC, ICICI, Axis, Kotak and 25+ more. Any format, any year." },
  { step: "02", icon: <Zap className="h-5 w-5" />, title: "AI extracts everything", desc: "Our AI reads every transaction — date, description, amount, and balance — even from password-protected or scanned PDFs." },
  { step: "03", icon: <Download className="h-5 w-5" />, title: "Download clean data", desc: "Export as CSV, Excel, OFX (Tally/QuickBooks), or push to Google Sheets. Import directly into your accounting software." },
];

const FEATURES = [
  { icon: <Globe className="h-5 w-5 text-brand-600" />, bg: "bg-brand-50", title: "30+ Indian banks", desc: "SBI, HDFC, ICICI, Axis, Kotak, PNB, BoB, Canara, IndusInd, Yes Bank, IDFC, and many more — including cooperative banks." },
  { icon: <Zap className="h-5 w-5 text-amber-600" />, bg: "bg-amber-50", title: "5 export formats", desc: "CSV, Excel (.xlsx), OFX (Tally/QuickBooks), QFX (Quicken), and Google Sheets API for direct live sync." },
  { icon: <Lock className="h-5 w-5 text-emerald-600" />, bg: "bg-emerald-50", title: "Zero data retention", desc: "Your PDFs are processed in memory and deleted immediately. We never store your financial documents on our servers." },
  { icon: <TrendingUp className="h-5 w-5 text-purple-600" />, bg: "bg-purple-50", title: "Auto categorisation", desc: "Transactions auto-labelled — groceries, fuel, EMI, salary, UPI, utilities — so your books are ready for filing." },
  { icon: <Shield className="h-5 w-5 text-rose-600" />, bg: "bg-rose-50", title: "Secure payments", desc: "Pay via UPI, Credit/Debit Card, Net Banking, or Wallets through Razorpay. All data encrypted with TLS 1.3." },
  { icon: <Clock className="h-5 w-5 text-sky-600" />, bg: "bg-sky-50", title: "Results in seconds", desc: "Most statements — even 12-month PDFs with hundreds of entries — are processed and ready to download in under 15 seconds." },
];

const PRICING = [
  { label: "First 8 pages", price: "Free", sub: "No card required", highlight: false },
  { label: "Pay-per-document", price: "₹49", sub: "UPI / Card / NetBanking", highlight: false },
  { label: "Pro — 200 pages/mo", price: "₹399", sub: "Best for CAs & freelancers", highlight: true },
  { label: "Business — 500 pages/mo", price: "₹999", sub: "CA firms & fintech teams", highlight: false },
];

const FAQS = [
  { q: "Which Indian banks are supported?", a: "We support 30+ banks including SBI, HDFC, ICICI, Axis, Kotak, PNB, Bank of Baroda, Canara, Union Bank, IndusInd, Yes Bank, IDFC FIRST, Federal Bank, RBL, Bandhan, and many more including cooperative banks and payment banks like Paytm and Airtel." },
  { q: "Is my financial data safe?", a: "Yes. Your PDFs are processed entirely in memory and are never written to disk or stored in a database. Once we return your converted data, the file is permanently deleted from our servers. We are GDPR and IT Act 2000 compliant." },
  { q: "Can I process password-protected PDFs?", a: "Yes — most bank statement PDFs from Indian banks are protected with the account holder's date of birth or mobile number. You can enter the password during upload and we will handle the rest." },
  { q: "How does the 8 free pages work?", a: "Every new account gets 8 pages of processing completely free — that covers most 1-3 month statements. After that, pay just ₹49 per document or upgrade to a monthly plan." },
  { q: "What formats does Tally support?", a: "Tally accepts OFX bank feeds. Export in OFX format from BankStatements and import directly into Tally ERP or Tally Prime via the Bank Reconciliation module." },
  { q: "Can I pay via UPI?", a: "Yes! We accept all UPI apps (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, and Wallets through Razorpay." },
];

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-800">BankStatements</span>
            <span className="ml-1.5 rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-600">India</span>
          </div>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">How it works</Link>
          <Link href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Features</Link>
          <Link href="/pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Pricing</Link>
          <Link href="#faq" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">FAQ</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign in</Link>
          <Link href="/signup" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors">
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pb-10 pt-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[360px] w-[500px] -translate-x-1/2 rounded-full bg-brand-50 blur-3xl opacity-50" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Two-column layout: text left, mock UI right */}
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">

          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              8 pages free · No card · Pay via UPI
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Convert Indian bank
              <br />
              <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                statements to Excel
              </span>
            </h1>

            <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-500 lg:mx-0 mx-auto">
              SBI, HDFC, ICICI, Axis, Kotak &amp; 25+ more.
              CSV · Excel · OFX (Tally) · Google Sheets — in under 15 seconds.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/signup"
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-200 hover:bg-brand-700 transition-all hover:scale-[1.02]"
              >
                Start for free <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <IndianRupee className="h-3.5 w-3.5 text-brand-500" /> View pricing
              </Link>
            </div>

            {/* Quick trust signals */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 lg:justify-start">
              {["30+ Indian banks", "₹49 / document", "Data never stored"].map((t) => (
                <span key={t} className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="text-emerald-500">✓</span> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: mock UI */}
          <div className="w-full max-w-sm shrink-0 lg:max-w-xs xl:max-w-sm">
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
                <div className="flex gap-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-400">
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
    <div className="bg-slate-50 p-3 space-y-2">
      {/* Free pages bar */}
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">Free pages</span>
          <span className="font-bold text-brand-600">6 / 8 left</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
          <div className="h-1.5 w-1/4 rounded-full bg-brand-500" />
        </div>
      </div>

      {/* Upload zone */}
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-200 bg-brand-50 py-5 gap-1.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100">
          <FileText className="h-5 w-5 text-brand-600" />
        </div>
        <p className="text-xs font-semibold text-slate-700">Drop SBI / HDFC / ICICI PDF</p>
        <div className="flex gap-1.5">
          {["CSV", "Excel", "OFX"].map((f) => (
            <span key={f} className="rounded-full border border-brand-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">{f}</span>
          ))}
        </div>
      </div>

      {/* One result row */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-50">
          <FileText className="h-3.5 w-3.5 text-emerald-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold text-slate-700">SBI_Nov2024.pdf</p>
          <p className="text-[10px] text-slate-400">58 transactions · CSV ready</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">Free</span>
      </div>
    </div>
  );
}

function BankLogos() {
  return (
    <section className="border-y border-slate-100 bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">Supports statements from</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {INDIAN_BANKS.map((bank) => (
            <span key={bank} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
              {bank}
            </span>
          ))}
          <span className="rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-600">+ more</span>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold text-brand-600">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">How it works</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">3 steps to clean data</h2>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {STEPS.map(({ step, icon, title, desc }) => (
            <div key={step} className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-200">{icon}</div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 translate-x-6 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-600">{step}</div>
              <h3 className="mt-5 text-lg font-bold text-slate-800">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">Features</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Built for Indian banks & accountants</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
          {FEATURES.map(({ icon, bg, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>{icon}</div>
              <h3 className="mt-4 font-bold text-slate-800">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPreview() {
  return (
    <section className="bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">Pricing</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Affordable for every CA & business</h2>
        <p className="mt-3 text-slate-500">Pay via UPI, Card, Net Banking or Wallet through Razorpay</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING.map(({ label, price, sub, highlight }) => (
            <div key={label} className={`rounded-2xl border p-5 text-left ${highlight ? "border-brand-400 bg-brand-600 text-white" : "border-slate-200 bg-white"}`}>
              <p className={`text-sm font-medium ${highlight ? "text-brand-100" : "text-slate-600"}`}>{label}</p>
              <p className={`mt-2 text-3xl font-extrabold ${highlight ? "text-white" : "text-slate-900"}`}>{price}</p>
              <p className={`mt-1 text-xs ${highlight ? "text-brand-200" : "text-slate-400"}`}>{sub}</p>
            </div>
          ))}
        </div>

        <Link href="/pricing" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline">
          View full pricing <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">FAQ</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Frequently asked questions</h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-800">
                {q}
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-brand-600 px-6 py-20 text-center">
      <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Stop manually entering bank transactions</h2>
      <p className="mt-4 text-lg text-brand-100">Join CAs, accountants and businesses saving hours every month.</p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/signup" className="flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-bold text-brand-700 shadow hover:bg-brand-50 transition-all hover:scale-[1.02]">
          Start free — 8 pages on us <ArrowRight className="h-4 w-4" />
        </Link>
        <span className="text-sm text-brand-200">No card · Pay via UPI when you need more</span>
      </div>
    </section>
  );
}


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
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
