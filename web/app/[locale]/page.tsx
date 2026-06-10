import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight, CheckCircle2, Zap, Lock, Globe,
  Download, Upload, Shield, Clock, CreditCard, FileCheck, Star,
  Sparkles, ChevronRight, FileText, BarChart3, RefreshCw,
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
    { value: "15s",   label: tStats("conversion"), icon: "⚡" },
    { value: "30+",   label: tStats("banks"),       icon: "🏦" },
    { value: "99.4%", label: tStats("accuracy"),    icon: "✓" },
    { value: "₹49",   label: tStats("perDoc"),      icon: "₹" },
  ];

  const steps = [
    {
      n: "01",
      icon: <Upload size={20} />,
      title: tHow("step1Title"),
      body: tHow("step1Body"),
      gradient: "from-blue-500 to-indigo-600",
      glow: "shadow-blue-500/20",
    },
    {
      n: "02",
      icon: <FileCheck size={20} />,
      title: tHow("step2Title"),
      body: tHow("step2Body"),
      gradient: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/20",
    },
    {
      n: "03",
      icon: <Download size={20} />,
      title: tHow("step3Title"),
      body: tHow("step3Body"),
      gradient: "from-orange-500 to-rose-500",
      glow: "shadow-orange-500/20",
    },
  ];

  const testimonials = [
    { text: tTest("q1"), name: tTest("name1"), role: tTest("role1"), initial: "P", color: "bg-violet-500" },
    { text: tTest("q2"), name: tTest("name2"), role: tTest("role2"), initial: "R", color: "bg-emerald-500" },
    { text: tTest("q3"), name: tTest("name3"), role: tTest("role3"), initial: "A", color: "bg-navy" },
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

        {/* ─── HERO — SPLIT LEFT / RIGHT ───────────────────────── */}
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #060c1e 0%, #0b1640 40%, #0e1f5c 65%, #07112e 100%)" }}>

          {/* Dot-grid texture */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

          {/* Animated ambient orbs */}
          <div className="absolute -top-32 left-[30%] w-[600px] h-[600px] rounded-full pointer-events-none animate-blob" style={{ background: "radial-gradient(ellipse, rgba(59,91,252,0.22) 0%, transparent 65%)", filter: "blur(2px)" }} />
          <div className="absolute top-10 right-[-80px] w-96 h-96 rounded-full pointer-events-none blur-3xl animate-blob" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.16) 0%, transparent 70%)", animationDelay: "-4s", animationDuration: "14s" }} />
          <div className="absolute bottom-0 left-[-60px] w-80 h-80 rounded-full pointer-events-none blur-3xl animate-blob" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", animationDelay: "-8s", animationDuration: "16s" }} />
          {/* Extra deep-blue orb top-right */}
          <div className="absolute -top-10 right-[20%] w-72 h-72 rounded-full pointer-events-none blur-3xl animate-blob" style={{ background: "radial-gradient(circle, rgba(26,71,200,0.18) 0%, transparent 70%)", animationDelay: "-2s", animationDuration: "18s" }} />

          {/* Floating particles */}
          {[
            { top: "18%", left: "8%",  size: 4, delay: "0s",    dur: "6s",  opacity: 0.25 },
            { top: "55%", left: "14%", size: 3, delay: "-2s",   dur: "8s",  opacity: 0.18 },
            { top: "75%", left: "6%",  size: 5, delay: "-4s",   dur: "7s",  opacity: 0.20 },
            { top: "30%", left: "88%", size: 3, delay: "-1s",   dur: "9s",  opacity: 0.18 },
            { top: "65%", left: "92%", size: 4, delay: "-3s",   dur: "6.5s",opacity: 0.22 },
            { top: "12%", left: "55%", size: 3, delay: "-5s",   dur: "10s", opacity: 0.15 },
            { top: "82%", left: "72%", size: 5, delay: "-6s",   dur: "7.5s",opacity: 0.18 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute pointer-events-none rounded-full"
              style={{
                top: p.top, left: p.left,
                width: p.size, height: p.size,
                background: "#818cf8",
                opacity: p.opacity,
                animation: `floatCard ${p.dur} ease-in-out ${p.delay} infinite`,
              }}
            />
          ))}

          {/* Animated ring accent */}
          <div
            className="absolute pointer-events-none rounded-full"
            style={{
              top: "15%", right: "8%",
              width: 140, height: 140,
              border: "1px solid rgba(99,120,255,0.12)",
              animation: "floatCard 10s ease-in-out -3s infinite",
            }}
          />
          <div
            className="absolute pointer-events-none rounded-full"
            style={{
              bottom: "20%", left: "4%",
              width: 90, height: 90,
              border: "1px solid rgba(139,92,246,0.10)",
              animation: "floatCard 12s ease-in-out -6s infinite",
            }}
          />

          {/* Subtle horizontal glow line */}
          <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(99,120,255,0.4) 40%, rgba(99,120,255,0.4) 60%, transparent 100%)" }} />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center min-h-[88vh] py-16 lg:py-20">

              {/* ── LEFT — Copy ──────────────────────────────────────── */}
              <div className="flex flex-col items-start">

                {/* Live badge */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7 text-xs font-semibold"
                  style={{ borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.78)" }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  {tHero("badge")}
                  <ChevronRight size={11} className="opacity-40" />
                </div>

                {/* H1 */}
                <h1 className="font-display font-black tracking-tight text-white leading-[1.04] mb-5" style={{ fontSize: "clamp(2.4rem, 4.2vw, 3.9rem)" }}>
                  {tHero("titleLine1")}{" "}
                  <span style={{
                    background: "linear-gradient(135deg, #7dd3fc 0%, #818cf8 45%, #c4b5fd 80%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    {tHero("titleHighlight")}
                  </span>
                  <br />
                  <span style={{ color: "rgba(255,255,255,0.88)" }}>{tHero("titleLine3")}</span>
                </h1>

                {/* Subtitle */}
                <p className="text-[1rem] leading-relaxed mb-7 max-w-[480px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                  {tHero("subtitle")}
                </p>

                {/* Feature bullets */}
                <div className="flex flex-col gap-2 mb-8">
                  {[tHero("bullet1"), tHero("bullet2"), tHero("bullet3"), tHero("bullet4")].map((b) => (
                    <div key={b} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={10} className="text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{b}</span>
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold text-white relative overflow-hidden transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #f97316 0%, #dc5e0a 100%)", boxShadow: "0 4px 28px rgba(249,115,22,0.50), inset 0 1px 0 rgba(255,255,255,0.15)" }}
                  >
                    <span className="absolute inset-0" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)", animation: "shimmerSlide 2.5s ease-in-out infinite" }} />
                    <Sparkles size={14} className="relative z-10" />
                    <span className="relative z-10">{tHero("cta")}</span>
                    <ArrowRight size={13} className="relative z-10" />
                  </Link>
                  <SamplePDFDemo />
                </div>

                {/* Social proof */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center -space-x-2.5">
                    {TRUST_INITIALS.map(({ i, bg }) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold text-white shadow-lg ${bg}`} style={{ borderColor: "rgba(255,255,255,0.14)" }}>
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
                    <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>{tHero("trustText")}</p>
                  </div>
                </div>

              </div>

              {/* ── RIGHT — Mockup ───────────────────────────────────── */}
              <div className="relative flex items-center justify-center lg:justify-end">

                {/* Self-contained illustration — dark bg, browser window, floating cards all inside */}
                <div className="relative z-10 w-full flex justify-center lg:justify-end">
                  <ConverterMockup />
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* ─── BANKS DUAL MARQUEE ───────────────────────────────── */}
        <section id="banks" className="py-10 bg-slate-50 border-b border-slate-100 overflow-hidden">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center mb-5">
            {tBanks("heading")}
          </p>
          <div className="space-y-2.5">
            <div className="relative" style={{ maskImage: "linear-gradient(to right,transparent 0%,#000 8%,#000 92%,transparent 100%)", WebkitMaskImage: "linear-gradient(to right,transparent 0%,#000 8%,#000 92%,transparent 100%)" }}>
              <div className="flex gap-2.5 w-max animate-marquee">
                {doubled.map((b, i) => (
                  <span key={i} className="shrink-0 px-4 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-full shadow-sm whitespace-nowrap hover:border-navy/40 hover:text-navy transition-colors">
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative" style={{ maskImage: "linear-gradient(to right,transparent 0%,#000 8%,#000 92%,transparent 100%)", WebkitMaskImage: "linear-gradient(to right,transparent 0%,#000 8%,#000 92%,transparent 100%)" }}>
              <div className="flex gap-2.5 w-max animate-marquee-reverse">
                {doubled2.map((b, i) => (
                  <span key={i} className="shrink-0 px-4 py-1.5 text-xs font-medium text-slate-400 bg-slate-100 border border-slate-200/60 rounded-full whitespace-nowrap">
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
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-navy/5 text-navy text-[11px] font-bold uppercase tracking-widest mb-3">{tHow("label")}</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">{tHow("title")}</h2>
              <p className="text-slate-400 max-w-xs mx-auto text-sm">{tHow("subtitle")}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-9 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px pointer-events-none" style={{ background: "linear-gradient(90deg,rgba(99,102,241,0.3),rgba(249,115,22,0.3))", borderTop: "1px dashed rgba(148,163,184,0.4)" }} />

              {steps.map(({ n, icon, title, body, gradient, glow }, idx) => (
                <div
                  key={n}
                  className={`relative group flex flex-col p-7 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${idx === 1 ? "md:mt-6" : ""}`}
                >
                  <div className={`absolute top-5 right-5 font-display text-[5rem] font-black leading-none select-none text-slate-50 group-hover:text-navy/5 transition-colors duration-300`}>{n}</div>

                  <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white bg-gradient-to-br ${gradient} shadow-lg ${glow} group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                  </div>
                  <h3 className="relative z-10 text-[0.95rem] font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="relative z-10 text-sm text-slate-400 leading-relaxed">{body}</p>

                  {idx < 2 && (
                    <div className="hidden md:flex absolute -right-3.5 top-9 z-20 w-7 h-7 rounded-full bg-white border border-slate-200 items-center justify-center shadow-md">
                      <ChevronRight size={13} className="text-slate-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES — ADVANCED BENTO ────────────────────────── */}
        <section id="features" className="py-24 overflow-hidden" style={{ background: "linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%)" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-navy/5 text-navy text-[11px] font-bold uppercase tracking-widest mb-3">{tFeat("label")}</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">{tFeat("title")}</h2>
              <p className="text-slate-400 max-w-sm mx-auto text-sm">{tFeat("subtitle")}</p>
            </div>

            {/* Top row: 3 equal cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Speed — dark accent */}
              <div className="md:col-span-1 rounded-2xl p-7 flex flex-col relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0d1a4a 0%,#1A47C8 100%)" }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%,rgba(255,255,255,0.5) 0%,transparent 50%)" }} />
                <div className="relative z-10 w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-white mb-4">
                  <Zap size={20} />
                </div>
                <div className="relative z-10 font-display text-5xl font-black text-white mb-1">15<span className="text-2xl text-white/50 font-bold">s</span></div>
                <div className="relative z-10 text-sm font-bold text-white mb-2">{tFeat("fastTitle")}</div>
                <p className="relative z-10 text-xs text-white/50 leading-relaxed flex-1">{tFeat("fastBody")}</p>
              </div>

              {/* Privacy */}
              <div className="rounded-2xl p-7 bg-white border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                  <Shield size={128} />
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                  <Shield size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{tFeat("privateTitle")}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tFeat("privateBody")}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={11} /> Zero storage
                </div>
              </div>

              {/* Accuracy */}
              <div className="rounded-2xl p-7 bg-white border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-navy mb-4 group-hover:scale-110 transition-transform">
                  <FileCheck size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{tFeat("accurateTitle")}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tFeat("accurateBody")}</p>
                <div className="mt-4 font-display text-3xl font-black text-navy">99.4<span className="text-base text-slate-400 font-medium">%</span></div>
              </div>
            </div>

            {/* Middle row: wide + narrow */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {/* Formats — wide */}
              <div className="md:col-span-3 rounded-2xl p-7 bg-white border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">5 formats</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{tFeat("formatsTitle")}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-5">{tFeat("formatsBody")}</p>
                <div className="flex flex-wrap gap-2">
                  {["Excel", "CSV", "OFX / Tally", "QFX / QuickBooks", "Google Sheets"].map((f, i) => (
                    <span key={f} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${i === 0 ? "bg-emerald-500 text-white border-emerald-500" : i === 4 ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Banks count — narrow */}
              <div className="md:col-span-2 rounded-2xl p-7 relative overflow-hidden group" style={{ background: "linear-gradient(135deg,#7c3aed 0%,#a855f7 100%)" }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%,rgba(255,255,255,0.5) 0%,transparent 50%)" }} />
                <div className="relative z-10 w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-white mb-4">
                  <Globe size={20} />
                </div>
                <div className="relative z-10 font-display text-5xl font-black text-white mb-1">30<span className="text-2xl text-white/50 font-bold">+</span></div>
                <div className="relative z-10 text-sm font-bold text-white mb-1">{tFeat("banksTitle")}</div>
                <p className="relative z-10 text-xs text-white/50 leading-relaxed">{tFeat("banksBody")}</p>
              </div>
            </div>

            {/* Bottom row: 3 small cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Lock size={18} />, title: tFeat("passwordTitle"), body: tFeat("passwordBody"), bg: "bg-rose-50", accent: "text-rose-500" },
                { icon: <CreditCard size={18} />, title: tFeat("pricingTitle"), body: tFeat("pricingBody"), bg: "bg-orange-50", accent: "text-orange-500" },
                { icon: <Clock size={18} />, title: tFeat("instantTitle"), body: tFeat("instantBody"), bg: "bg-teal-50", accent: "text-teal-600" },
              ].map(({ icon, title, body, bg, accent }) => (
                <div key={title} className="rounded-2xl p-6 bg-white border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className={`w-10 h-10 rounded-xl ${bg} ${accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS — INFINITE MARQUEE ──────────────────── */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold uppercase tracking-widest mb-3">{tTest("label")}</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">{tTest("title")}</h2>
          </div>

          {/* Marquee of testimonial cards */}
          <div
            className="relative"
            style={{ maskImage: "linear-gradient(to right,transparent 0%,#000 6%,#000 94%,transparent 100%)", WebkitMaskImage: "linear-gradient(to right,transparent 0%,#000 6%,#000 94%,transparent 100%)" }}
          >
            <div className="flex gap-5 w-max animate-marquee" style={{ animationDuration: "30s" }}>
              {[...testimonials, ...testimonials].map(({ text, name, role, initial, color }, i) => (
                <div key={i} className="shrink-0 w-80 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-5">{text}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-sm font-bold text-white shrink-0`}>{initial}</div>
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
        <section id="pricing" className="py-24" style={{ background: "linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%)" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-navy/5 text-navy text-[11px] font-bold uppercase tracking-widest mb-3">Pricing</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Simple, transparent pricing</h2>
              <p className="text-slate-400 text-sm">Start free. Only pay when you need more.</p>
            </div>
            <PricingCards />
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section id="faq" className="py-24 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-navy/5 text-navy text-[11px] font-bold uppercase tracking-widest mb-3">{tFaq("label")}</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">{tFaq("title")}</h2>
            </div>
            <FAQAccordion items={faqs} />
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────── */}
        <section className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(160deg,#080e24 0%,#0d1a4a 40%,#1A47C8 70%,#0d1a4a 100%)" }}>
          <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[300px] rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(ellipse,rgba(249,115,22,0.6) 0%,transparent 70%)" }} />
          </div>

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <span className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
            >
              {tCta("label")}
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-5 leading-[1.05]">
              {tCta("title")}
            </h2>
            <p className="mb-10 max-w-md mx-auto text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              {tCta("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold text-white relative overflow-hidden transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 4px 32px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.15)" }}
              >
                <span className="absolute inset-0" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)", animation: "shimmerSlide 2.2s ease-in-out infinite" }} />
                <span className="relative z-10">{tCta("button")}</span>
                <ArrowRight size={15} className="relative z-10" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}
              >
                View pricing <ChevronRight size={14} />
              </Link>
            </div>
            <p className="mt-8 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{tCta("note")}</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
