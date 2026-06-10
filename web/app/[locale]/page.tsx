import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight, CheckCircle2, Zap, Lock, Globe,
  Download, Upload, Shield, Clock, CreditCard, FileCheck, Star,
} from "lucide-react";
import ConverterMockup from "@/components/ConverterMockup";
import { SamplePDFDemo } from "@/components/SamplePDFDemo";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

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
  const tHero = await getTranslations("hero");
  const tStats = await getTranslations("stats");
  const tBanks = await getTranslations("banks");
  const tHow = await getTranslations("howItWorks");
  const tFeat = await getTranslations("features");
  const tTest = await getTranslations("testimonials");
  const tPrice = await getTranslations("pricing");
  const tFaq = await getTranslations("faq");
  const tCta = await getTranslations("cta");

  const TRUST_INITIALS = [
    { i: "R", bg: "bg-violet-500" },
    { i: "S", bg: "bg-emerald-500" },
    { i: "P", bg: "bg-amber-500" },
    { i: "A", bg: "bg-navy" },
    { i: "K", bg: "bg-rose-500" },
  ];

  const BULLETS = [
    tHero("bullet1"),
    tHero("bullet2"),
    tHero("bullet3"),
    tHero("bullet4"),
  ];

  const stats = [
    { value: "15s",   label: tStats("conversion") },
    { value: "30+",   label: tStats("banks") },
    { value: "99.4%", label: tStats("accuracy") },
    { value: "₹49",   label: tStats("perDoc") },
  ];

  const steps = [
    { n: "01", icon: <Upload size={20} />, title: tHow("step1Title"), body: tHow("step1Body") },
    { n: "02", icon: <FileCheck size={20} />, title: tHow("step2Title"), body: tHow("step2Body") },
    { n: "03", icon: <Download size={20} />, title: tHow("step3Title"), body: tHow("step3Body") },
  ];

  const features = [
    { icon: <Zap size={18} />,        title: tFeat("fastTitle"),        body: tFeat("fastBody"),        highlight: true  },
    { icon: <Shield size={18} />,     title: tFeat("privateTitle"),     body: tFeat("privateBody"),     highlight: false },
    { icon: <FileCheck size={18} />,  title: tFeat("accurateTitle"),    body: tFeat("accurateBody"),    highlight: false },
    { icon: <Globe size={18} />,      title: tFeat("banksTitle"),       body: tFeat("banksBody"),       highlight: false },
    { icon: <CreditCard size={18} />, title: tFeat("pricingTitle"),     body: tFeat("pricingBody"),     highlight: false },
    { icon: <Clock size={18} />,      title: tFeat("formatsTitle"),     body: tFeat("formatsBody"),     highlight: false },
    { icon: <Lock size={18} />,       title: tFeat("passwordTitle"),    body: tFeat("passwordBody"),    highlight: false },
    { icon: <Upload size={18} />,     title: tFeat("anyAccountTitle"),  body: tFeat("anyAccountBody"),  highlight: false },
    { icon: <Download size={18} />,   title: tFeat("instantTitle"),     body: tFeat("instantBody"),     highlight: false },
  ];

  const testimonials = [
    { text: tTest("q1"), name: tTest("name1"), role: tTest("role1"), initial: "P", color: "bg-violet-500" },
    { text: tTest("q2"), name: tTest("name2"), role: tTest("role2"), initial: "R", color: "bg-emerald-500" },
    { text: tTest("q3"), name: tTest("name3"), role: tTest("role3"), initial: "A", color: "bg-navy" },
  ];

  const tiers = [
    {
      name: tPrice("freeName"), price: "₹0", period: tPrice("freePeriod"),
      desc: tPrice("freeDesc"), featured: false, href: "/signup", cta: tPrice("freeCta"),
      features: [tPrice("freeF1"), tPrice("freeF2"), tPrice("freeF3"), tPrice("freeF4")],
    },
    {
      name: tPrice("paygName"), price: "₹49", period: tPrice("paygPeriod"),
      desc: tPrice("paygDesc"), featured: false, href: "/signup", cta: tPrice("paygCta"),
      features: [tPrice("paygF1"), tPrice("paygF2"), tPrice("paygF3"), tPrice("paygF4")],
    },
    {
      name: tPrice("proName"), price: "₹1,198", period: tPrice("proPeriod"),
      desc: tPrice("proDesc"), featured: true, href: "/signup", cta: tPrice("proCta"),
      badge: tPrice("mostPopular"),
      features: [tPrice("proF1"), tPrice("proF2"), tPrice("proF3"), tPrice("proF4"), tPrice("proF5")],
    },
    {
      name: tPrice("businessName"), price: "₹4,498", period: tPrice("businessPeriod"),
      desc: tPrice("businessDesc"), featured: false, href: "/signup", cta: tPrice("businessCta"),
      features: [tPrice("businessF1"), tPrice("businessF2"), tPrice("businessF3"), tPrice("businessF4"), tPrice("businessF5"), tPrice("businessF6"), tPrice("businessF7")],
    },
  ];

  const faqs = [
    { q: tFaq("q1"), a: tFaq("a1") },
    { q: tFaq("q2"), a: tFaq("a2") },
    { q: tFaq("q3"), a: tFaq("a3") },
    { q: tFaq("q4"), a: tFaq("a4") },
    { q: tFaq("q5"), a: tFaq("a5") },
    { q: tFaq("q6"), a: tFaq("a6") },
  ];

  const doubled = [...BANKS, ...BANKS];

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
      <main>
        {/* Hero */}
        <section className="relative pt-20 pb-20 bg-white overflow-hidden">
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
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border border-emerald-200 bg-emerald-50 text-emerald-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {tHero("badge")}
                </div>
                <h1 className="font-display text-[2.85rem] sm:text-[3.25rem] leading-[1.06] font-bold tracking-tight text-slate-900 mb-5">
                  {tHero("titleLine1")}<br />
                  <span className="text-navy">{tHero("titleHighlight")}</span><br />
                  {tHero("titleLine3")}
                </h1>
                <p className="text-[1.05rem] text-slate-500 leading-relaxed mb-7 max-w-[420px]">
                  {tHero("subtitle")}
                </p>
                <ul className="space-y-2.5 mb-8">
                  {BULLETS.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="shrink-0 text-navy mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-navy hover:opacity-90 transition-opacity shadow-lg shadow-navy/30"
                  >
                    {tHero("cta")}
                    <ArrowRight size={15} />
                  </Link>
                  <SamplePDFDemo />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center -space-x-2">
                    {TRUST_INITIALS.map(({ i, bg }) => (
                      <div key={i} className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white ${bg}`}>
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
                    <p className="text-xs text-slate-500">{tHero("trustText")}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <ConverterMockup />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
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

        {/* Banks marquee */}
        <section id="banks" className="py-14 bg-slate-50/70 border-y border-slate-100 overflow-hidden">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest text-center mb-6">
            {tBanks("heading")}
          </p>
          <div
            className="relative"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
            }}
          >
            <div className="flex gap-3 w-max animate-marquee">
              {doubled.map((b, i) => (
                <span key={i} className="shrink-0 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full shadow-sm whitespace-nowrap">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">{tHow("label")}</p>
              <h2 className="font-display text-[2rem] font-bold text-slate-900 mb-3">{tHow("title")}</h2>
              <p className="text-slate-500 max-w-sm mx-auto text-sm">{tHow("subtitle")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {steps.map(({ n, title, body, icon }, idx) => (
                <div key={n} className="relative p-8 bg-white group hover:bg-slate-50/60 transition-colors duration-200">
                  <div className="font-display text-[5rem] font-black text-slate-100 leading-none select-none absolute top-4 right-5 group-hover:text-navy/10 transition-colors duration-200">{n}</div>
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-navy/10 text-navy mb-5 group-hover:bg-navy group-hover:text-white transition-all duration-200">{icon}</div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
                  </div>
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

        {/* Features */}
        <section id="features" className="py-24 bg-slate-50/60">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">{tFeat("label")}</p>
              <h2 className="font-display text-[2rem] font-bold text-slate-900 mb-3">{tFeat("title")}</h2>
              <p className="text-slate-500 max-w-md mx-auto text-sm">{tFeat("subtitle")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map(({ icon, title, body, highlight }) => (
                <div key={title} className={`rounded-xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-default ${highlight ? "bg-navy text-white border border-navy/20 shadow-md shadow-navy/20" : "bg-white border border-slate-200 hover:border-slate-300"}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${highlight ? "bg-white/15 text-white" : "bg-navy/10 text-navy"}`}>{icon}</div>
                  <h3 className={`font-semibold mb-1.5 ${highlight ? "text-white" : "text-slate-900"}`}>{title}</h3>
                  <p className={`text-sm leading-relaxed ${highlight ? "text-white/75" : "text-slate-500"}`}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">{tTest("label")}</p>
              <h2 className="font-display text-[2rem] font-bold text-slate-900">{tTest("title")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map(({ text, name, role, initial, color }) => (
                <div key={name} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed flex-1 mb-5">&ldquo;{text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>{initial}</div>
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

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-slate-50/60">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">{tPrice("label")}</p>
              <h2 className="font-display text-[2rem] font-bold text-slate-900 mb-3">{tPrice("title")}</h2>
              <p className="text-slate-500 text-sm">{tPrice("subtitle")}</p>
              <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto">
                {tPrice("note", { payg: tPrice("payg"), pro: tPrice("proPlans") })}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiers.map(({ name, price, period, desc, features: tf, cta, href, featured, badge }) => (
                <div key={name} className={`relative rounded-2xl p-6 flex flex-col ${featured ? "bg-navy border-2 border-navy shadow-2xl shadow-navy/25 -mt-2 -mb-2 z-10" : "bg-white border border-slate-200"}`}>
                  {badge && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold text-navy bg-white border border-navy/20 rounded-full whitespace-nowrap shadow-sm">{badge}</span>
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
                    {tf.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={13} className={`shrink-0 ${featured ? "text-white/70" : "text-navy"}`} />
                        <span className={featured ? "text-white/85" : "text-slate-600"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={href} className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-150 hover:opacity-90 ${featured ? "bg-white text-navy hover:bg-slate-50" : "border border-slate-200 text-slate-700 bg-white hover:border-navy/30 hover:text-navy"}`}>
                    {cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-3">{tFaq("label")}</p>
              <h2 className="font-display text-[2rem] font-bold text-slate-900">{tFaq("title")}</h2>
            </div>
            <div className="space-y-2">
              {faqs.map(({ q, a }) => (
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

        {/* CTA */}
        <section className="py-24 bg-navy relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">{tCta("label")}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">{tCta("title")}</h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto leading-relaxed text-sm">{tCta("subtitle")}</p>
            <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-bold text-navy bg-white hover:bg-slate-50 transition-colors shadow-xl">
              {tCta("button")}
              <ArrowRight size={15} />
            </Link>
            <p className="mt-5 text-xs text-white/40">{tCta("note")}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
