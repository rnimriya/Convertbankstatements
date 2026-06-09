import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Zap, Lock, Globe,
  Download, Upload, Shield, Clock, CreditCard, FileCheck,
} from "lucide-react";
import FormatPills from "@/components/FormatPills";
import ConverterMockup from "@/components/ConverterMockup";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "https://convertstatement.online" },
};

// ── Data ─────────────────────────────────────────────────────────────────────

const BANKS = [
  "SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank",
  "PNB", "Bank of Baroda", "Canara Bank", "Union Bank", "IndusInd",
  "Yes Bank", "IDFC First", "Federal Bank", "RBL Bank", "Bandhan Bank",
  "Indian Bank", "Central Bank", "UCO Bank", "Bank of India", "AU Bank",
  "South Indian", "City Union", "Lakshmi Vilas", "IOB", "Andhra Bank",
];

const FAQS = [
  { q: "Which Indian banks are supported?", a: "Over 30 banks including SBI, HDFC, ICICI, Axis, Kotak, PNB, Bank of Baroda, Canara, Union Bank, IndusInd, Yes Bank, IDFC First, Federal Bank, RBL, Bandhan, and more. Email us if yours isn't listed." },
  { q: "Is my financial data safe?", a: "Yes. PDFs are processed in memory and deleted immediately after conversion. Nothing is stored on disk or in a database. We follow GDPR and India's IT Act 2000." },
  { q: "Can I process password-protected PDFs?", a: "Yes. Enter the password during upload — most Indian banks lock PDFs with your date of birth or mobile number. We never store the password." },
  { q: "How does the 8 free pages work?", a: "Every new account gets 8 pages free — no card needed. That covers most 1-3 month statements. After that, pay ₹49 per document or choose a monthly plan." },
  { q: "How do I import into Tally?", a: "Export as OFX from ConvertStatement, then import into Tally ERP or Tally Prime via the Bank Reconciliation module. Takes about two minutes." },
  { q: "Can I pay via UPI?", a: "Yes. We accept UPI (GPay, PhonePe, Paytm, BHIM), all Visa/Mastercard/RuPay cards, net banking, and wallets via Razorpay." },
];

// ── Schema markup ─────────────────────────────────────────────────────────────

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ConvertStatement",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://convertstatement.online",
  description: "Convert Indian bank statement PDFs from SBI, HDFC, ICICI, Axis, Kotak and 25+ more into CSV, Excel, OFX for Tally, or Google Sheets in under 15 seconds.",
  offers: [
    { "@type": "Offer", name: "Free tier", price: "0", priceCurrency: "INR", description: "First 8 pages free" },
    { "@type": "Offer", name: "Pay-per-document", price: "49", priceCurrency: "INR" },
    { "@type": "Offer", name: "Pro", price: "299", priceCurrency: "INR" },
    { "@type": "Offer", name: "Business", price: "999", priceCurrency: "INR" },
  ],
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

// ── Sections ──────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="ConvertStatement" className="h-8 w-8" />
          <span className="font-bold text-slate-900 font-display text-[17px]">ConvertStatement</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
          <Link href="#features"    className="hover:text-slate-900 transition-colors">Features</Link>
          <Link href="#pricing"     className="hover:text-slate-900 transition-colors">Pricing</Link>
          <Link href="#banks"       className="hover:text-slate-900 transition-colors">Banks</Link>
          <Link href="/blog"        className="hover:text-slate-900 transition-colors">Blog</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login"  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign in</Link>
          <Link href="/signup" className="text-sm font-semibold text-white bg-navy px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-28 pb-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-navy/20 bg-navy/5 text-navy">
              <CheckCircle2 size={13} />
              30+ Indian banks supported
            </div>

            <h1 className="font-display text-[2.75rem] leading-[1.07] font-bold tracking-tight text-slate-900 mb-5">
              Bank Statement<br />
              Converter<br />
              <span className="text-navy">PDF to Excel/CSV</span>
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-md">
              Upload any Indian bank PDF — SBI, HDFC, ICICI, and 30 more. Get clean Excel, CSV, OFX, or Google Sheets without manual typing.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/signup" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-navy hover:opacity-90 transition-opacity">
                Convert free — 8 pages
                <ArrowRight size={15} />
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200 hover:border-slate-300 bg-white transition-colors">
                See how it works
              </Link>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">Converts to</p>
              <FormatPills />
            </div>
          </div>

          {/* Right — mockup */}
          <div className="flex justify-center lg:justify-end">
            <ConverterMockup />
          </div>

        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: "8 pages",  label: "free every month",       sub: "No credit card required" },
    { value: "15s",      label: "average conversion",      sub: "Usually faster" },
    { value: "30+",      label: "banks supported",          sub: "SBI, HDFC, ICICI & more" },
    { value: "₹49",     label: "per document",             sub: "Pay only when you need" },
  ];
  return (
    <div className="border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
          {items.map(({ value, label, sub }) => (
            <div key={value} className="py-10 px-6 first:pl-0 last:pr-0">
              <div className="font-display text-3xl font-bold tracking-tight text-slate-900 mb-1">{value}</div>
              <div className="text-sm font-semibold text-slate-700">{label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BankChips() {
  return (
    <section id="banks" className="py-16 bg-slate-50/60">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest text-center mb-6">
          Works with every major Indian bank
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {BANKS.map(b => (
            <span key={b} className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full shadow-sm">
              {b}
            </span>
          ))}
          <span className="px-3 py-1.5 text-sm font-medium text-navy bg-navy/5 border border-navy/20 rounded-full">
            + more
          </span>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: <Upload size={19} />,
      title: "Upload your PDF",
      body: "Drag & drop or click to select. Works with every major Indian bank, including password-protected files.",
    },
    {
      n: "02",
      icon: <FileCheck size={19} />,
      title: "Choose your format",
      body: "Pick Excel, CSV, OFX for Tally, QFX for QuickBooks, or Google Sheets. Each format is optimized for its target.",
    },
    {
      n: "03",
      icon: <Download size={19} />,
      title: "Download & use",
      body: "Your file is ready in under 15 seconds. Clean columns, correct dates, all transactions captured accurately.",
    },
  ];
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">Three steps. Done.</h2>
          <p className="text-slate-500 max-w-md mx-auto">No account needed for your first 8 pages. Just upload and download.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-200 rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {steps.map(({ n, title, body, icon }) => (
            <div key={n} className="p-8 bg-white">
              <div className="flex items-start gap-3 mb-5">
                <span className="font-display text-5xl font-black text-slate-100 leading-none select-none">{n}</span>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-navy/10 text-navy shrink-0 mt-1">
                  {icon}
                </div>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: <Zap size={19} />,         title: "Lightning fast",        body: "Multi-page PDFs processed in under 15 seconds. No queuing, no waiting room." },
    { icon: <Shield size={19} />,      title: "Private by design",     body: "Files are processed in memory and never stored. Your financial data stays yours." },
    { icon: <FileCheck size={19} />,   title: "High accuracy",         body: "Amounts, dates, and references pulled precisely from structured bank PDFs." },
    { icon: <Globe size={19} />,       title: "30+ banks covered",     body: "Public sector, private, cooperative, and small finance banks all supported." },
    { icon: <CreditCard size={19} />,  title: "Simple pricing",        body: "First 8 pages free. Then ₹49 per document — no subscription traps." },
    { icon: <Clock size={19} />,       title: "5 export formats",      body: "Excel, CSV, OFX for Tally, QFX for QuickBooks, and Google Sheets in one tool." },
    { icon: <Lock size={19} />,        title: "Password-protected",    body: "Enter your PDF password at upload — most Indian bank PDFs are DOB-locked." },
    { icon: <Upload size={19} />,      title: "Any account type",      body: "Savings, current, salary, NRE/NRO — any statement format from any year." },
    { icon: <Download size={19} />,    title: "Instant download",      body: "No email delivery, no waiting. Click Convert and your file downloads immediately." },
  ];
  return (
    <section id="features" className="py-24 bg-slate-50/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">Built for accountants and finance teams</h2>
          <p className="text-slate-500 max-w-lg mx-auto">Everything you need to convert bank statements — nothing you don&apos;t.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon, title, body }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-default">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-navy/10 text-navy">
                {icon}
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "₹0",
      period: "",
      desc: "Perfect for occasional use",
      features: ["8 pages / month", "All output formats", "All supported banks", "No account required"],
      cta: "Start free",
      href: "/convert",
      featured: false,
    },
    {
      name: "Pay-as-you-go",
      price: "₹49",
      period: "/ document",
      desc: "For when you need more",
      features: ["Unlimited pages per doc", "All output formats", "All supported banks", "No subscription"],
      cta: "Convert now",
      href: "/convert",
      featured: false,
    },
    {
      name: "Pro",
      price: "₹299",
      period: "/ month",
      desc: "For regular use",
      badge: "Most popular",
      features: ["500 pages / month", "All output formats", "Priority processing", "Email support"],
      cta: "Start Pro",
      href: "/signup",
      featured: true,
    },
    {
      name: "Business",
      price: "₹999",
      period: "/ month",
      desc: "For teams and CA firms",
      features: ["2000 pages / month", "All output formats", "API access", "Priority support"],
      cta: "Start Business",
      href: "/signup",
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">Simple, transparent pricing</h2>
          <p className="text-slate-500">Start free. Only pay when you need more.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map(({ name, price, period, desc, features, cta, href, featured, badge }) => (
            <div
              key={name}
              className={`relative rounded-2xl p-6 flex flex-col ${
                featured
                  ? "border-2 border-navy shadow-lg bg-navy/[0.03]"
                  : "border border-slate-200 bg-white"
              }`}
            >
              {badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[11px] font-bold text-white bg-navy rounded-full whitespace-nowrap">
                  {badge}
                </span>
              )}
              <div className="mb-5">
                <h3 className="font-semibold text-slate-900 mb-1">{name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-2xl font-bold text-slate-900">{price}</span>
                  <span className="text-sm text-slate-500">{period}</span>
                </div>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={13} className="shrink-0 text-navy" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={href}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold text-center transition-opacity hover:opacity-90 ${
                  featured
                    ? "bg-navy text-white"
                    : "border border-slate-200 text-slate-700 bg-white hover:border-slate-300"
                }`}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="py-24 bg-slate-50/60">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10 text-center">Frequently asked questions</h2>
        <div className="space-y-2">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none text-sm font-medium text-slate-900 gap-4">
                <span>{q}</span>
                <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-slate-500 leading-relaxed border-t border-slate-100">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 bg-[#0a0f1e]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-3xl font-bold text-white mb-4">
          Stop typing transactions manually
        </h2>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
          Join thousands of accountants and finance professionals who convert bank statements in seconds, not hours.
        </p>
        <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold text-[#0a0f1e] bg-white hover:bg-slate-100 transition-colors">
          Convert free — 8 pages
          <ArrowRight size={15} />
        </Link>
        <p className="mt-4 text-sm text-slate-500">No credit card required · Pay via UPI if you need more</p>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <BankChips />
        <HowItWorks />
        <Features />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
