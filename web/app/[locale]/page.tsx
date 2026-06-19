import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight, CheckCircle2, Zap, Lock, Globe,
  Download, Upload, Shield, Clock, CreditCard, FileCheck, Star,
  Sparkles, ChevronRight, FileText, BarChart3,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PricingCards } from "@/components/PricingCards";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { HeroSectionWrapper } from "@/components/home/HeroSectionWrapper";

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
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  type Feature = {
    icon: ReactNode; gradient: string; glow: string;
    title: string; body: string;
    stat?: string; statSuffix?: string;
    badge?: string; chips?: string[];
  };
  const FEATURES: Feature[] = [
    { icon: <Zap size={22} className="text-zinc-700 dark:text-zinc-100" />, gradient: "", glow: "", stat: "15", statSuffix: "s", title: tFeat("fastTitle"), body: tFeat("fastBody") },
    { icon: <Shield size={22} className="text-zinc-700 dark:text-zinc-100" />, gradient: "", glow: "", title: tFeat("privateTitle"), body: tFeat("privateBody"), badge: "Zero storage" },
    { icon: <FileCheck size={22} className="text-zinc-700 dark:text-zinc-100" />, gradient: "", glow: "", stat: "99.4", statSuffix: "%", title: tFeat("accurateTitle"), body: tFeat("accurateBody") },
    { icon: <FileText size={22} className="text-zinc-700 dark:text-zinc-100" />, gradient: "", glow: "", title: tFeat("formatsTitle"), body: tFeat("formatsBody"), chips: ["Excel", "CSV", "OFX / Tally", "QFX / QuickBooks", "Google Sheets"] },
    { icon: <Globe size={22} className="text-zinc-700 dark:text-zinc-100" />, gradient: "", glow: "", stat: "30", statSuffix: "+", title: tFeat("banksTitle"), body: tFeat("banksBody") },
    { icon: <Lock size={20} className="text-zinc-700 dark:text-zinc-100" />, gradient: "", glow: "", title: tFeat("passwordTitle"), body: tFeat("passwordBody") },
    { icon: <CreditCard size={20} className="text-zinc-700 dark:text-zinc-100" />, gradient: "", glow: "", title: tFeat("pricingTitle"), body: tFeat("pricingBody") },
    { icon: <Clock size={20} className="text-zinc-700 dark:text-zinc-100" />, gradient: "", glow: "", title: tFeat("instantTitle"), body: tFeat("instantBody") },
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
      gradient: "bg-zinc-100 text-zinc-900",
      glow: "",
    },
    {
      n: "02",
      icon: <FileCheck size={20} />,
      title: tHow("step2Title"),
      body: tHow("step2Body"),
      gradient: "bg-zinc-100 text-zinc-900",
      glow: "",
    },
    {
      n: "03",
      icon: <Download size={20} />,
      title: tHow("step3Title"),
      body: tHow("step3Body"),
      gradient: "bg-zinc-100 text-zinc-900",
      glow: "",
    },
  ];

  const testimonials = [
    { text: tTest("q1"), name: tTest("name1"), role: tTest("role1"), initial: "P", color: "bg-zinc-200 text-zinc-800" },
    { text: tTest("q2"), name: tTest("name2"), role: tTest("role2"), initial: "R", color: "bg-zinc-200 text-zinc-800" },
    { text: tTest("q3"), name: tTest("name3"), role: tTest("role3"), initial: "A", color: "bg-zinc-200 text-zinc-800" },
    { text: tTest("q4"), name: tTest("name4"), role: tTest("role4"), initial: "V", color: "bg-zinc-200 text-zinc-800" },
    { text: tTest("q5"), name: tTest("name5"), role: tTest("role5"), initial: "M", color: "bg-zinc-200 text-zinc-800" },
    { text: tTest("q6"), name: tTest("name6"), role: tTest("role6"), initial: "D", color: "bg-zinc-200 text-zinc-800" },
    { text: tTest("q1"), name: tTest("name1"), role: tTest("role1"), initial: "P", color: "bg-zinc-200 text-zinc-800" },
    { text: tTest("q2"), name: tTest("name2"), role: tTest("role2"), initial: "R", color: "bg-zinc-200 text-zinc-800" },
    { text: tTest("q3"), name: tTest("name3"), role: tTest("role3"), initial: "A", color: "bg-zinc-200 text-zinc-800" },
    { text: tTest("q4"), name: tTest("name4"), role: tTest("role4"), initial: "V", color: "bg-zinc-200 text-zinc-800" },
    { text: tTest("q5"), name: tTest("name5"), role: tTest("role5"), initial: "M", color: "bg-zinc-200 text-zinc-800" },
    { text: tTest("q6"), name: tTest("name6"), role: tTest("role6"), initial: "D", color: "bg-zinc-200 text-zinc-800" },
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
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main className="overflow-x-hidden">

        {/* ─── HERO — CENTERED UPLOAD ───────────────────────── */}
        <HeroSectionWrapper />



        {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 bg-white dark:bg-zinc-950">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-widest mb-3">{tHow("label")}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">{tHow("title")}</h2>
              <p className="text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto text-sm">{tHow("subtitle")}</p>
            </div>

            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              {steps.map(({ n, icon, title, body, gradient }, idx) => (
                <div
                  key={n}
                  className="relative group flex flex-col p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-300"
                >
                  <div className="absolute top-6 right-6 text-4xl font-black select-none text-zinc-100">{n}</div>

                  <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800`}>
                    {icon}
                  </div>
                  <h3 className="relative text-[0.95rem] font-bold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
                  <p className="relative text-sm text-zinc-500 leading-relaxed">{body}</p>

                  {idx < 2 && (
                    <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 items-center justify-center">
                      <ChevronRight size={13} className="text-zinc-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES — ADVANCED BENTO ────────────────────────── */}
        <section id="features" className="relative py-24 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[11px] font-bold uppercase tracking-widest mb-3">{tFeat("label")}</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-zinc-900 dark:text-zinc-50">{tFeat("title")}</h2>
              <p className="text-zinc-500 max-w-sm mx-auto text-sm">{tFeat("subtitle")}</p>
            </div>

            {/* Fancy feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 [&>*:nth-child(n)]:border-b [&>*:nth-child(n)]:border-r [&>*:nth-child(n)]:border-zinc-200 dark:[&>*:nth-child(n)]:border-zinc-800">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group relative flex flex-col overflow-hidden p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50 transition-colors"
                >
                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-5 transition-transform group-hover:scale-105">
                      {f.icon}
                    </div>

                    {f.stat && (
                      <div className="text-4xl font-black mb-1 leading-none">
                        <span className="text-zinc-900 dark:text-zinc-100">{f.stat}</span>
                        <span className="text-xl text-zinc-400 dark:text-zinc-500 font-bold">{f.statSuffix}</span>
                      </div>
                    )}

                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 mt-1">{f.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed flex-1">{f.body}</p>

                    {f.badge && (
                      <div className="mt-4 inline-flex items-center gap-1.5 self-start text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={11} /> {f.badge}
                      </div>
                    )}

                    {f.chips && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {f.chips.map((c, i) => (
                          <span
                            key={c}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS — INFINITE MARQUEE ──────────────────── */}
        <section className="py-24 bg-white dark:bg-zinc-950 overflow-hidden border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-widest mb-3">{tTest("label")}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">{tTest("title")}</h2>
          </div>

          {/* Marquee of testimonial cards */}
          <div
            className="relative"
            style={{ maskImage: "linear-gradient(to right,transparent 0%,#000 6%,#000 94%,transparent 100%)", WebkitMaskImage: "linear-gradient(to right,transparent 0%,#000 6%,#000 94%,transparent 100%)" }}
          >
            <div className="flex gap-5 w-max animate-marquee" style={{ animationDuration: "30s" }}>
              {[...testimonials, ...testimonials].map(({ text, name, role, initial, color }, i) => (
                <div key={i} className="shrink-0 w-80 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} className="text-zinc-400 fill-zinc-400" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1 mb-5">{text}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-sm font-bold shrink-0`}>{initial}</div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{name}</p>
                      <p className="text-xs text-zinc-500">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING ──────────────────────────────────────────── */}
        <section id="pricing" className="py-24 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[11px] font-bold uppercase tracking-widest mb-3">Pricing</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Simple, transparent pricing</h2>
              <p className="text-zinc-500 text-sm">Start free. Only pay when you need more.</p>
            </div>
            <PricingCards />
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section id="faq" className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-widest mb-3">{tFaq("label")}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">{tFaq("title")}</h2>
            </div>
            <FAQAccordion items={faqs} />
          </div>
        </section>

        {/* ─── SUPPORTED BANKS ──────────────────────────────────── */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-[11px] font-bold uppercase tracking-widest mb-3">Coverage</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Supports every major Indian bank</h2>
              <p className="text-zinc-500 max-w-xl mx-auto text-sm">We process statements from 30+ top banks with 99.4% accuracy. If your bank is missing, contact us to add it.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {BANKS.map((bank) => (
                <div key={bank} className="px-5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-default flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  {bank}
                </div>
              ))}
              <div className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-xl text-sm font-semibold text-zinc-500 flex items-center gap-2">
                + Many more
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────── */}
        <section className="py-28 relative overflow-hidden bg-zinc-900">
          {/* Background glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-30 bg-blue-500 rounded-full blur-[120px] pointer-events-none" />

          {/* Elegant Graph Paper Grid with a bottom-up radial mask fade */}
          <div 
            className="absolute inset-0 pointer-events-none bg-graph-paper-dark" 
            style={{
              maskImage: 'radial-gradient(ellipse 100% 100% at 50% 100%, black 50%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 100%, black 50%, transparent 100%)'
            }} 
          />

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <span className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 bg-zinc-800 text-zinc-300 border border-zinc-700">
              {tCta("label")}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-[1.05]">
              {tCta("title")}
            </h2>
            <p className="mb-10 max-w-md mx-auto text-sm leading-relaxed text-zinc-400">
              {tCta("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-bold transition-colors shadow-xl dark:shadow-none bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border-0 shadow-none">
                <span>{tCta("button")}</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-zinc-300 border border-zinc-700 hover:bg-zinc-800 transition-colors"
              >
                View pricing <ChevronRight size={14} />
              </Link>
            </div>
            <p className="mt-8 text-xs text-zinc-500">{tCta("note")}</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
