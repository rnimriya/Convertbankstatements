import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Zap, Lock, Globe,
  Download, Upload, Shield, Clock, CreditCard, FileCheck, Star,
} from "lucide-react";
import ConverterMockup from "@/components/ConverterMockup";
import { SamplePDFDemo } from "@/components/SamplePDFDemo";
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
  "South Indian", "City Union", "IOB", "Andhra Bank", "Karnataka Bank",
];

const FAQS = [
  { q: "Which Indian banks are supported?", a: "Over 30 banks including SBI, HDFC, ICICI, Axis, Kotak, PNB, Bank of Baroda, Canara, Union Bank, IndusInd, Yes Bank, IDFC First, Federal Bank, RBL, Bandhan, and more. Email us if yours isn't listed." },
  { q: "Is my financial data safe?", a: "Yes. PDFs are processed in memory and deleted immediately after conversion. Nothing is stored on disk or in a database. We follow GDPR and India's IT Act 2000." },
  { q: "Can I process password-protected PDFs?", a: "Yes. Enter the password during upload — most Indian banks lock PDFs with your date of birth or mobile number. We never store the password." },
  { q: "How does the 8 free pages work?", a: "Every new account gets 8 pages free — no card needed. That covers most 1-3 month statements. After that, pay ₹49 per document or choose a monthly plan." },
  { q: "How do I import into Tally?", a: "Export as OFX from Convert Statement, then import into Tally ERP or Tally Prime via the Bank Reconciliation module. Takes about two minutes." },
  { q: "Can I pay via UPI?", a: "Yes. We accept UPI (GPay, PhonePe, Paytm, BHIM), all Visa/Mastercard/RuPay cards, net banking, and wallets via Razorpay." },
];

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Convert Statement",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://convertstatement.online",
  description: "Convert Indian bank statement PDFs from SBI, HDFC, ICICI, Axis, Kotak and 25+ more into CSV, Excel, OFX for Tally, or Google Sheets in under 15 seconds.",
  offers: [
    { "@type": "Offer", name: "Free tier",          price: "0",    priceCurrency: "INR" },
    { "@type": "Offer", name: "Pay-per-document",   price: "49",   priceCurrency: "INR" },
    { "@type": "Offer", name: "Pro",      price: "1198", priceCurrency: "INR" },
    { "@type": "Offer", name: "Business", price: "4498", priceCurrency: "INR" },
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
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-100/80">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
          <span className="font-bold text-slate-900 font-display text-[17px]">Convert Statement</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
          <Link href="#features"    className="hover:text-slate-900 transition-colors">Features</Link>
          <Link href="#pricing"     className="hover:text-slate-900 transition-colors">Pricing</Link>
          <Link href="#banks"       className="hover:text-slate-900 transition-colors">Banks</Link>
          <Link href="/blog"        className="hover:text-slate-900 transition-colors">Blog</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login"  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
            Sign in
          </Link>
          <Link href="/signup" className="text-sm font-semibold text-white bg-navy px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Get started free
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const TRUST_INITIALS = [
    { i: "R", bg: "bg-violet-500" },
    { i: "S", bg: "bg-emerald-500" },
    { i: "P", bg: "bg-amber-500" },
    { i: "A", bg: "bg-navy"       },
    { i: "K", bg: "bg-rose-500"   },
  ];
  const BULLETS = [
    "30+ Indian banks — SBI, HDFC, ICICI & more",
    "Excel, CSV, OFX for Tally, Google Sheets",
    "Files never stored — private by design",
    "First 8 pages free · No card required",
  ];
  return (
    <section className="relative pt-28 pb-20 bg-white overflow-hidden">
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* Left copy */}
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border border-emerald-200 bg-emerald-50 text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              30+ Indian banks · Instant results
            </div>

            {/* Headline */}
            <h1 className="font-display text-[2.85rem] sm:text-[3.25rem] leading-[1.06] font-bold tracking-tight text-slate-900 mb-5">
              Bank Statement<br />
              <span className="text-navy">PDF to Excel</span><br />
              in 15 seconds
            </h1>

            {/* Sub */}
            <p className="text-[1.05rem] text-slate-500 leading-relaxed mb-7 max-w-[420px]">
              Upload any Indian bank PDF. Get clean spreadsheets instantly — no manual typing, no subscription traps.
            </p>

            {/* Bullet list */}
            <ul className="space-y-2.5 mb-8">
              {BULLETS.map(b => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="shrink-0 text-navy mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-9">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-navy hover:opacity-90 transition-opacity shadow-lg shadow-navy/30"
              >
                Convert free — 8 pages
                <ArrowRight size={15} />
              </Link>
              <SamplePDFDemo />
            </div>

            {/* Trust bar */}
            <div className="flex items-center gap-4">
              <div className="flex items-center -space-x-2">
                {TRUST_INITIALS.map(({ i, bg }) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white ${bg}`}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  Trusted by <span className="font-semibold text-slate-700">500+ CAs</span> across India
                </p>
              </div>
            </div>
          </div>

          {/* Right — animated mockup */}
          <div className="flex justify-center lg:justify-end">
            <ConverterMockup />
          </div>

        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const stats = [
    { value: "15s",   label: "Average conversion" },
    { value: "30+",   label: "Indian banks"        },
    { value: "99.4%", label: "Accuracy rate"       },
    { value: "₹49",  label: "Per document"         },
  ];
  return (
    <div className="bg-navy">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-navy/30">
          {stats.map(({ value, label }) => (
            <div key={label} className="py-8 px-6 text-center first:pl-0 last:pr-0">
              <div className="font-display text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-xs font-medium text-white/60 uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BankMarquee() {
  const doubled = [...BANKS, ...BANKS];
  return (
    <section id="banks" className="py-14 bg-slate-50/70 border-y border-slate-100 overflow-hidden">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest text-center mb-6">
        Supports every major Indian bank
      </p>
      {/* Left + right fade masks */}
      <div
        className="relative"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
        }}
      >
        <div className="flex gap-3 w-max animate-marquee">
          {doubled.map((b, i) => (
            <span
              key={i}
              className="shrink-0 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full shadow-sm whitespace-nowrap"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: <Upload size={20} />,
      title: "Upload your PDF",
      body: "Drag & drop or click to select. Works with every major Indian bank, including password-protected files.",
    },
    {
      n: "02",
      icon: <FileCheck size={20} />,
      title: "Choose your format",
      body: "Pick Excel, CSV, OFX for Tally, QFX for QuickBooks, or Google Sheets — each optimized for its target.",
    },
    {
      n: "03",
      icon: <Download size={20} />,
      title: "Download instantly",
      body: "File is ready in under 15 seconds. Clean columns, correct dates, every transaction captured accurately.",
    },
  ];
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">How it works</p>
          <h2 className="font-display text-[2rem] font-bold text-slate-900 mb-3">Three steps. Done.</h2>
          <p className="text-slate-500 max-w-sm mx-auto text-sm">No account needed for your first 8 pages. Just upload and download.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {steps.map(({ n, title, body, icon }, idx) => (
            <div key={n} className="relative p-8 bg-white group hover:bg-slate-50/60 transition-colors duration-200">
              {/* Step number watermark */}
              <div className="font-display text-[5rem] font-black text-slate-100 leading-none select-none absolute top-4 right-5 group-hover:text-navy/10 transition-colors duration-200">
                {n}
              </div>
              <div className="relative">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-navy/10 text-navy mb-5 group-hover:bg-navy group-hover:text-white transition-all duration-200">
                  {icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
              {/* Arrow connector (not on last) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm">
                  <ArrowRight size={13} className="text-slate-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: <Zap size={18} />,        title: "Lightning fast",      body: "Multi-page PDFs in under 15 seconds. No queuing, no waiting room.",                     highlight: true  },
    { icon: <Shield size={18} />,     title: "Private by design",   body: "Files are processed in memory and never stored. Your data stays yours.",                 highlight: false },
    { icon: <FileCheck size={18} />,  title: "High accuracy",       body: "Amounts, dates, and references pulled precisely from structured bank PDFs.",             highlight: false },
    { icon: <Globe size={18} />,      title: "30+ banks covered",   body: "Public sector, private, cooperative, and small finance banks all supported.",           highlight: false },
    { icon: <CreditCard size={18} />, title: "Simple pricing",      body: "First 8 pages free. Then ₹49 per document — no subscription traps.",                  highlight: false },
    { icon: <Clock size={18} />,      title: "5 export formats",    body: "Excel, CSV, OFX for Tally, QFX for QuickBooks, and Google Sheets in one tool.",        highlight: false },
    { icon: <Lock size={18} />,       title: "Password PDFs",       body: "Enter your PDF password at upload — most Indian bank PDFs are DOB-locked.",             highlight: false },
    { icon: <Upload size={18} />,     title: "Any account type",    body: "Savings, current, salary, NRE/NRO — any statement format from any year.",               highlight: false },
    { icon: <Download size={18} />,   title: "Instant download",    body: "No email delivery, no waiting. Click Convert and your file downloads immediately.",     highlight: false },
  ];
  return (
    <section id="features" className="py-24 bg-slate-50/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">Features</p>
          <h2 className="font-display text-[2rem] font-bold text-slate-900 mb-3">Built for accountants & finance teams</h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm">Everything you need to convert bank statements — nothing you don&apos;t.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon, title, body, highlight }) => (
            <div
              key={title}
              className={`rounded-xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-default ${
                highlight
                  ? "bg-navy text-white border border-navy/20 shadow-md shadow-navy/20"
                  : "bg-white border border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                highlight ? "bg-white/15 text-white" : "bg-navy/10 text-navy"
              }`}>
                {icon}
              </div>
              <h3 className={`font-semibold mb-1.5 ${highlight ? "text-white" : "text-slate-900"}`}>{title}</h3>
              <p className={`text-sm leading-relaxed ${highlight ? "text-white/75" : "text-slate-500"}`}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      text: "Saves me 3–4 hours every month. Best tool for CA reconciliation work — the OFX export for Tally is seamless.",
      name: "Priya Mehta",
      role: "Chartered Accountant, Mumbai",
      initial: "P",
      color: "bg-violet-500",
    },
    {
      text: "We process 40–50 statements a month for clients. Convert Statement handles all banks perfectly. Worth every rupee.",
      name: "Rajesh Agarwal",
      role: "Tax Consultant, Delhi",
      initial: "R",
      color: "bg-emerald-500",
    },
    {
      text: "Downloaded 12 months of HDFC statements and had them all in Excel in under 5 minutes. Incredible time saver.",
      name: "Anjali Soni",
      role: "Finance Manager, Bangalore",
      initial: "A",
      color: "bg-navy",
    },
  ];
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="font-display text-[2rem] font-bold text-slate-900">Loved by finance professionals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quotes.map(({ text, name, role, initial, color }) => (
            <div key={name} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed flex-1 mb-5">&ldquo;{text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-500">{role}</p>
                </div>
              </div>
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
      desc: "Try it out — no card needed",
      features: ["8 pages free, forever", "CSV & Excel export", "All Indian banks", "No credit card required"],
      cta: "Start free",
      href: "/signup",
      featured: false,
    },
    {
      name: "Pay-per-doc",
      price: "₹49",
      period: "/ doc",
      desc: "No subscription, pay only when you need",
      features: ["₹49 per document", "All export formats", "UPI / Cards / NetBanking", "All Indian banks"],
      cta: "Get started",
      href: "/signup",
      featured: false,
    },
    {
      name: "Pro",
      price: "₹1,198",
      period: "/ mo",
      desc: "Perfect for CAs & individuals",
      badge: "Most popular",
      features: ["500 pages / month", "All export formats", "Google Sheets export", "Priority processing", "Email support"],
      cta: "Start Pro",
      href: "/signup",
      featured: true,
    },
    {
      name: "Business",
      price: "₹4,498",
      period: "/ mo",
      desc: "For CA firms & fintech teams",
      features: ["2,000 pages / month", "All export formats", "Google Sheets export", "Priority processing", "API access", "5 team seats", "Dedicated support"],
      cta: "Start Business",
      href: "/signup",
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="font-display text-[2rem] font-bold text-slate-900 mb-3">Simple, transparent pricing</h2>
          <p className="text-slate-500 text-sm">Start free. Only pay when you need more.</p>
          <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto">
            <span className="font-medium text-slate-500">Pay-as-you-go</span> charges ₹49 per document regardless of page count.{" "}
            <span className="font-medium text-slate-500">Pro & Business</span> plans give you a shared monthly page pool — e.g. a 20-page statement uses 20 of your 500 pages.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map(({ name, price, period, desc, features, cta, href, featured, badge }) => (
            <div
              key={name}
              className={`relative rounded-2xl p-6 flex flex-col ${
                featured
                  ? "bg-navy border-2 border-navy shadow-2xl shadow-navy/25 -mt-2 -mb-2 z-10"
                  : "bg-white border border-slate-200"
              }`}
            >
              {badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold text-navy bg-white border border-navy/20 rounded-full whitespace-nowrap shadow-sm">
                  {badge}
                </span>
              )}
              <div className="mb-5">
                <h3 className={`font-semibold mb-1 ${featured ? "text-white/80 text-sm" : "text-slate-500 text-sm"}`}>{name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`font-display text-2xl font-bold ${featured ? "text-white" : "text-slate-900"}`}>{price}</span>
                  <span className={`text-sm ${featured ? "text-white/60" : "text-slate-400"}`}>{period}</span>
                </div>
                <p className={`text-xs ${featured ? "text-white/60" : "text-slate-400"}`}>{desc}</p>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={13} className={`shrink-0 ${featured ? "text-white/70" : "text-navy"}`} />
                    <span className={featured ? "text-white/85" : "text-slate-600"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={href}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-150 hover:opacity-90 ${
                  featured
                    ? "bg-white text-navy hover:bg-slate-50"
                    : "border border-slate-200 text-slate-700 bg-white hover:border-navy/30 hover:text-navy"
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
    <section className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="font-display text-[2rem] font-bold text-slate-900">Frequently asked questions</h2>
        </div>
        <div className="space-y-2">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none text-sm font-medium text-slate-900 gap-4 hover:bg-slate-50/60 transition-colors">
                <span>{q}</span>
                <svg className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    <section className="py-24 bg-navy relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Get started today</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          Stop typing transactions<br className="hidden sm:block" /> manually
        </h2>
        <p className="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed text-sm">
          Join 500+ CAs and finance professionals across India who convert bank statements in seconds, not hours.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-bold text-navy bg-white hover:bg-slate-50 transition-colors shadow-xl"
        >
          Convert free — 8 pages
          <ArrowRight size={15} />
        </Link>
        <p className="mt-5 text-xs text-white/40">No credit card required · Pay via UPI if you need more</p>
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
        <StatsStrip />
        <BankMarquee />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
