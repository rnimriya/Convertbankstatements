import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight, CheckCircle2, Zap, Lock, Globe,
  Download, Upload, Shield, Clock, CreditCard, FileCheck, Star,
  Sparkles, ChevronRight,
} from "lucide-react";
import ConverterMockup from "@/components/ConverterMockup";
import { SamplePDFDemo } from "@/components/SamplePDFDemo";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PricingCards } from "@/components/PricingCards";
import { FAQAccordion } from "@/components/home/FAQAccordion";

export const metadata: Metadata = {
  alternates: { canonical: "https://convertstatement.online" },
};

const BANKS = [
  "SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank",
  "PNB", "Bank of Baroda", "Canara Bank", "Union Bank", "IndusInd",
  "Yes Bank", "IDFC First", "Federal Bank", "RBL Bank", "Bandhan Bank",
  "Indian Bank", "Central Bank", "UCO Bank", "Bank of India", "AU Bank",
  "South Indian", "City Union", "IOB", "Andhra Bank", "Karnataka Bank",
];

export default async function HomePage() {
  const tHero  = await getTranslations("hero");
  const tStats = await getTranslations("stats");
  const tBanks = await getTranslations("banks");
  const tHow   = await getTranslations("howItWorks");
  const tFeat  = await getTranslations("features");
  const tTest  = await getTranslations("testimonials");
  const tFaq   = await getTranslations("faq");
  const tCta   = await getTranslations("cta");

  const TRUST_INITIALS = [
    { i: "R", bg: "bg-violet-500" },
    { i: "S", bg: "bg-emerald-500" },
    { i: "P", bg: "bg-amber-500" },
    { i: "A", bg: "bg-navy" },
    { i: "K", bg: "bg-rose-500" },
  ];

  const stats = [
    { value: "15s",   label: tStats("conversion"), suffix: "" },
    { value: "30+",   label: tStats("banks"),       suffix: "" },
    { value: "99.4%", label: tStats("accuracy"),    suffix: "" },
    { value: "₹49",   label: tStats("perDoc"),      suffix: "" },
  ];

  const steps = [
    { n: "01", icon: <Upload size={22} />,    title: tHow("step1Title"), body: tHow("step1Body"), color: "bg-blue-50 text-blue-600" },
    { n: "02", icon: <FileCheck size={22} />, title: tHow("step2Title"), body: tHow("step2Body"), color: "bg-violet-50 text-violet-600" },
    { n: "03", icon: <Download size={22} />,  title: tHow("step3Title"), body: tHow("step3Body"), color: "bg-orange-50 text-orange-500" },
  ];

  const features = [
    { icon: <Zap size={20} />,        title: tFeat("fastTitle"),       body: tFeat("fastBody"),       accent: "text-amber-500",   bg: "bg-amber-50",   border: "hover:border-amber-200"  },
    { icon: <Shield size={20} />,     title: tFeat("privateTitle"),    body: tFeat("privateBody"),    accent: "text-emerald-500", bg: "bg-emerald-50", border: "hover:border-emerald-200" },
    { icon: <FileCheck size={20} />,  title: tFeat("accurateTitle"),   body: tFeat("accurateBody"),   accent: "text-navy",        bg: "bg-blue-50",    border: "hover:border-blue-200"   },
    { icon: <Globe size={20} />,      title: tFeat("banksTitle"),      body: tFeat("banksBody"),      accent: "text-violet-500",  bg: "bg-violet-50",  border: "hover:border-violet-200" },
    { icon: <CreditCard size={20} />, title: tFeat("pricingTitle"),    body: tFeat("pricingBody"),    accent: "text-orange-500",  bg: "bg-orange-50",  border: "hover:border-orange-200" },
    { icon: <Clock size={20} />,      title: tFeat("formatsTitle"),    body: tFeat("formatsBody"),    accent: "text-cyan-500",    bg: "bg-cyan-50",    border: "hover:border-cyan-200"   },
    { icon: <Lock size={20} />,       title: tFeat("passwordTitle"),   body: tFeat("passwordBody"),   accent: "text-rose-500",    bg: "bg-rose-50",    border: "hover:border-rose-200"   },
    { icon: <Upload size={20} />,     title: tFeat("anyAccountTitle"), body: tFeat("anyAccountBody"), accent: "text-indigo-500",  bg: "bg-indigo-50",  border: "hover:border-indigo-200" },
    { icon: <Download size={20} />,   title: tFeat("instantTitle"),    body: tFeat("instantBody"),    accent: "text-teal-500",    bg: "bg-teal-50",    border: "hover:border-teal-200"   },
  ];

  const testimonials = [
    { text: tTest("q1"), name: tTest("name1"), role: tTest("role1"), initial: "P", color: "bg-violet-500" },
    { text: tTest("q2"), name: tTest("name2"), role: tTest("role2"), initial: "R", color: "bg-emerald-500" },
    { text: tTest("q3"), name: tTest("name3"), role: tTest("role3"), initial: "A", color: "bg-navy" },
  ];

  const faqs = [
    { q: tFaq("q1"), a: tFaq("a1") },
    { q: tFaq("q2"), a: tFaq("a2") },
    { q: tFaq("q3"), a: tFaq("a3") },
    { q: tFaq("q4"), a: tFaq("a4") },
    { q: tFaq("q5"), a: tFaq("a5") },
    { q: tFaq("q6"), a: tFaq("a6") },
  ];

  const doubled  = [...BANKS, ...BANKS];
  const doubled2 = [...BANKS.slice(12), ...BANKS, ...BANKS.slice(0, 12)];

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Convert Statement",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: "https://convertstatement.online",
    description: "Convert Indian bank statement PDFs from SBI, HDFC, ICICI, Axis, Kotak and 25+ more into CSV, Excel, OFX for Tally, or Google Sheets in under 15 seconds.",
    offers: [
      { "@type": "Offer", name: "Free tier", price: "0", priceCurrency: "INR" },
      { "@type": "Offer", name: "Pay-per-document", price: "49", priceCurrency: "INR" },
      { "@type": "Offer", name: "Pro", price: "1198", priceCurrency: "INR" },
      { "@type": "Offer", name: "Business", price: "4498", priceCurrency: "INR" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main className="overflow-x-hidden">

        {/* ─── HERO ─────────────────────────────────────────────── */}
        <section className="relative pt-16 pb-20 sm:pt-20 sm:pb-28 bg-white overflow-hidden">

          {/* Mesh gradient background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(26,71,200,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(249,115,22,0.05) 0%, transparent 50%), radial-gradient(circle at 50% 0%, rgba(59,91,252,0.04) 0%, transparent 60%)" }} />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-navy/20 to-transparent" />
            {/* Animated blobs */}
            <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-blue-100/40 blur-3xl animate-blob" style={{ animationDelay: "0s" }} />
            <div className="absolute bottom-10 right-[8%] w-64 h-64 rounded-full bg-orange-100/40 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-50/30 blur-3xl animate-blob" style={{ animationDelay: "8s" }} />
          </div>

          <div className="relative max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center">

              {/* Left — copy */}
              <div className="animate-fade-up">
                {/* Live badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {tHero("badge")}
                </div>

                {/* H1 */}
                <h1 className="font-display text-[2.6rem] sm:text-[3.25rem] lg:text-[3.5rem] leading-[1.06] font-bold tracking-tight text-slate-900 mb-5">
                  {tHero("titleLine1")}{" "}
                  <span
                    className="relative inline-block"
                    style={{
                      background: "linear-gradient(135deg, #1A47C8 0%, #3B5BFC 50%, #1A47C8 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {tHero("titleHighlight")}
                  </span>
                  <br className="hidden sm:block" />
                  {" "}{tHero("titleLine3")}
                </h1>

                {/* Subtitle */}
                <p className="text-[1rem] text-slate-500 leading-relaxed mb-6 max-w-[460px]">
                  {tHero("subtitle")}
                </p>

                {/* Bullet pills */}
                <div className="flex flex-wrap gap-2 mb-7">
                  {[tHero("bullet1"), tHero("bullet2"), tHero("bullet3"), tHero("bullet4")].map((b) => (
                    <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
                      <CheckCircle2 size={12} className="text-navy shrink-0" />
                      {b}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 mb-7">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-navy hover:opacity-90 transition-all shadow-lg shadow-navy/30 hover:shadow-navy/40 hover:-translate-y-0.5 relative overflow-hidden"
                  >
                    <span className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)", animation: "shimmerSlide 2.5s ease-in-out infinite" }} />
                    <Sparkles size={15} className="relative z-10" />
                    <span className="relative z-10">{tHero("cta")}</span>
                    <ArrowRight size={14} className="relative z-10" />
                  </Link>
                  <SamplePDFDemo />
                </div>

                {/* Social proof */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center -space-x-2.5">
                    {TRUST_INITIALS.map(({ i, bg }) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shadow-sm ${bg}`}>
                        {i}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 mb-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{tHero("trustText")}</p>
                  </div>
                </div>
              </div>

              {/* Right — mockup */}
              <div className="flex justify-center lg:justify-end animate-slide-in-right animation-delay-200">
                <div className="relative">
                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-navy/10 to-blue-400/10 blur-2xl scale-110 pointer-events-none" />
                  <ConverterMockup />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS ────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-navy via-[#1e3fa8] to-navy border-y border-navy/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {stats.map(({ value, label }, i) => (
                <div key={label} className={`py-8 px-6 text-center ${i < 3 ? "border-b md:border-b-0 md:border-r border-white/10" : ""} ${i === 1 ? "border-r border-white/10" : ""}`}>
                  <div className="font-display text-3xl sm:text-4xl font-black text-white mb-1 tracking-tight">{value}</div>
                  <div className="text-xs font-medium text-white/55 uppercase tracking-widest">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── BANKS DUAL MARQUEE ───────────────────────────────── */}
        <section id="banks" className="py-12 bg-slate-50/60 border-b border-slate-100 overflow-hidden">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mb-6">
            {tBanks("heading")}
          </p>
          <div className="space-y-3">
            {/* Row 1 — left to right */}
            <div
              className="relative"
              style={{ maskImage: "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)" }}
            >
              <div className="flex gap-3 w-max animate-marquee">
                {doubled.map((b, i) => (
                  <span key={i} className="shrink-0 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full shadow-sm whitespace-nowrap hover:border-navy/30 hover:text-navy transition-colors">
                    {b}
                  </span>
                ))}
              </div>
            </div>
            {/* Row 2 — right to left (slower) */}
            <div
              className="relative"
              style={{ maskImage: "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)" }}
            >
              <div className="flex gap-3 w-max animate-marquee-reverse">
                {doubled2.map((b, i) => (
                  <span key={i} className="shrink-0 px-4 py-2 text-sm font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-full whitespace-nowrap">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-navy/5 text-navy text-xs font-bold uppercase tracking-widest mb-3">{tHow("label")}</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">{tHow("title")}</h2>
              <p className="text-slate-500 max-w-sm mx-auto text-sm">{tHow("subtitle")}</p>
            </div>

            {/* Desktop: 3-card row with connector */}
            <div className="hidden md:grid grid-cols-3 gap-6 relative">
              {/* Connecting line */}
              <div className="absolute top-12 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-orange-200 pointer-events-none" />
              {steps.map(({ n, icon, title, body, color }, idx) => (
                <div key={n} className="relative group flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Step number */}
                  <div className="absolute top-4 right-5 font-display text-[4.5rem] font-black text-slate-50 leading-none select-none group-hover:text-navy/5 transition-colors duration-300">{n}</div>
                  {/* Icon circle */}
                  <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    {icon}
                  </div>
                  <h3 className="relative z-10 text-base font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="relative z-10 text-sm text-slate-500 leading-relaxed">{body}</p>
                  {idx < 2 && (
                    <div className="hidden md:flex absolute -right-3 top-12 z-20 w-6 h-6 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm">
                      <ChevronRight size={12} className="text-slate-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: vertical timeline */}
            <div className="md:hidden relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-200 via-violet-200 to-orange-200" />
              <div className="space-y-8">
                {steps.map(({ n, icon, title, body, color }) => (
                  <div key={n} className="flex gap-5 items-start">
                    <div className={`relative z-10 shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${color} shadow-sm border-2 border-white`}>
                      {icon}
                    </div>
                    <div className="pt-1 flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Step {n}</p>
                      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES — BENTO GRID ────────────────────────────── */}
        <section id="features" className="py-24 bg-slate-50/60">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-navy/5 text-navy text-xs font-bold uppercase tracking-widest mb-3">{tFeat("label")}</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">{tFeat("title")}</h2>
              <p className="text-slate-500 max-w-md mx-auto text-sm">{tFeat("subtitle")}</p>
            </div>

            {/* Featured card — full width */}
            <div className="rounded-2xl bg-navy p-8 mb-4 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)" }} />
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-white shrink-0">
                <Zap size={26} />
              </div>
              <div className="relative z-10 flex-1">
                <h3 className="text-xl font-bold text-white mb-1.5">{tFeat("fastTitle")}</h3>
                <p className="text-white/70 text-sm leading-relaxed max-w-lg">{tFeat("fastBody")}</p>
              </div>
              <div className="relative z-10 shrink-0">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-5xl font-black text-white">15</span>
                  <span className="text-white/60 text-lg font-semibold">sec</span>
                </div>
                <p className="text-white/50 text-xs text-right mt-0.5">avg. conversion</p>
              </div>
            </div>

            {/* Grid of remaining features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.slice(1).map(({ icon, title, body, accent, bg, border }) => (
                <div key={title} className={`group rounded-2xl p-5 bg-white border border-slate-100 ${border} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${bg} ${accent} group-hover:scale-110 transition-transform duration-200`}>
                    {icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-widest mb-3">{tTest("label")}</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">{tTest("title")}</h2>
            </div>

            {/* Scrollable on mobile, grid on desktop */}
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
              {testimonials.map(({ text, name, role, initial, color }) => (
                <div key={name} className="shrink-0 w-[85vw] sm:w-[70vw] md:w-auto snap-start bg-white border border-slate-200 rounded-2xl p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  {/* Large quote mark */}
                  <div className="font-display text-6xl text-navy/10 leading-none mb-2 group-hover:text-navy/20 transition-colors">&ldquo;</div>
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3 -mt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed flex-1 mb-5">{text}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-sm font-bold text-white shrink-0`}>{initial}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{name}</p>
                      <p className="text-xs text-slate-400">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING ──────────────────────────────────────────── */}
        <section id="pricing" className="py-24 bg-slate-50/60">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-navy/5 text-navy text-xs font-bold uppercase tracking-widest mb-3">Pricing</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Simple, transparent pricing</h2>
              <p className="text-slate-500 text-sm">Start free. Only pay when you need more.</p>
            </div>
            <PricingCards />
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section id="faq" className="py-24 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-navy/5 text-navy text-xs font-bold uppercase tracking-widest mb-3">{tFaq("label")}</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">{tFaq("title")}</h2>
            </div>
            <FAQAccordion items={faqs} />
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────── */}
        <section className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d1f6e 0%, #1A47C8 50%, #0d1f6e 100%)" }}>
          {/* Animated grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
          {/* Glow orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,91,252,0.25) 0%, transparent 70%)" }} />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)" }} />

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-bold uppercase tracking-widest mb-6">
              {tCta("label")}
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
              {tCta("title")}
            </h2>
            <p className="text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">{tCta("subtitle")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 relative overflow-hidden"
              >
                <span className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)", animation: "shimmerSlide 2.2s ease-in-out infinite" }} />
                <span className="relative z-10">{tCta("button")}</span>
                <ArrowRight size={15} className="relative z-10" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-white/80 border border-white/20 hover:border-white/40 hover:text-white transition-all">
                View pricing
                <ChevronRight size={14} />
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/35">{tCta("note")}</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
