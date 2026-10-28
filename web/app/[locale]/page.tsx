import type { Metadata } from"next";
import type { ReactNode } from"react";
import { getTranslations } from"next-intl/server";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Link } from"@/i18n/navigation";
import {
  ArrowRight, CheckCircle2, Zap, Lock, Globe,
  Download, Upload, Shield, Clock, CreditCard, FileCheck, Star,
  Sparkles, ChevronRight, FileText, BarChart3,
} from"lucide-react";
import { Footer } from"@/components/layout/Footer";
import { Navbar } from"@/components/layout/Navbar";
import { PricingCards } from"@/components/PricingCards";
import { FAQAccordion } from"@/components/home/FAQAccordion";
import { HeroSectionWrapper } from"@/components/home/HeroSectionWrapper";
import { BankMarquee } from"@/components/home/BankMarquee";

export const metadata: Metadata = {
  alternates: { canonical:"https://www.convertstatement.online" },
};

import { SUPPORTED_BANKS } from"@/lib/config/banks";

const BANKS = Array.from(new Set(SUPPORTED_BANKS.map((b) => b[1])));
export default async function HomePage() {
  const tHero  = await getTranslations("hero");
  const tStats = await getTranslations("stats");
  const tBanks = await getTranslations("banks");
  const tHow   = await getTranslations("howItWorks");
  const tFeat  = await getTranslations("features");
  const tTest  = await getTranslations("testimonials");
  const tFaq   = await getTranslations("faq");
  const tCta   = await getTranslations("cta");
  const nonce = BUILD_NONCE;

  type Feature = {
    icon: ReactNode; gradient: string; glow: string;
    title: string; body: string;
    stat?: string; statSuffix?: string;
    badge?: string; chips?: string[];
    img?: string;
  };
  const FEATURES: Feature[] = [
    { icon: <Zap size={22} className="text-pine-600 dark:text-pine-400" />, gradient:"", glow:"", stat:"15", statSuffix:"s", title: tFeat("fastTitle"), body: tFeat("fastBody"), img:"/features/feature-fast.webp" },
    { icon: <Shield size={22} className="text-pine-600 dark:text-pine-400" />, gradient:"", glow:"", title: tFeat("privateTitle"), body: tFeat("privateBody"), badge:"Zero storage", img:"/features/feature-private.webp" },
    { icon: <FileCheck size={22} className="text-pine-600 dark:text-pine-400" />, gradient:"", glow:"", stat:"99.4", statSuffix:"%", title: tFeat("accurateTitle"), body: tFeat("accurateBody"), img:"/features/feature-accurate.webp" },
    { icon: <FileText size={22} className="text-pine-500 dark:text-pine-400" />, gradient:"", glow:"", title: tFeat("formatsTitle"), body: tFeat("formatsBody"), chips: ["Excel","CSV","QBO · QuickBooks","OFX / Tally","Google Sheets"], img:"/features/feature-formats.webp" },
    { icon: <Globe size={22} className="text-pine-500 dark:text-pine-400" />, gradient:"", glow:"", stat:"30", statSuffix:"+", title: tFeat("banksTitle"), body: tFeat("banksBody"), img:"/features/feature-banks.webp" },
    { icon: <Lock size={20} className="text-pine-600 dark:text-pine-400" />, gradient:"", glow:"", title: tFeat("passwordTitle"), body: tFeat("passwordBody"), img:"/features/feature-password.webp" },
    { icon: <CreditCard size={20} className="text-pine-600 dark:text-pine-400" />, gradient:"", glow:"", title: tFeat("pricingTitle"), body: tFeat("pricingBody"), img:"/features/feature-pricing.webp" },
    { icon: <Clock size={20} className="text-pine-600 dark:text-pine-400" />, gradient:"", glow:"", title: tFeat("instantTitle"), body: tFeat("instantBody"), img:"/features/feature-instant.webp" },
  ];




  const stats = [
    { value:"15s",   label: tStats("conversion"), icon:"⚡" },
    { value:"30+",   label: tStats("banks"),       icon:"🏦" },
    { value:"99.4%", label: tStats("accuracy"),    icon:"✓" },
    { value:"8", label: tStats("freePages"), icon:"📄" },
  ];

  const steps = [
    {
      n:"01",
      img:"/steps/step-upload.webp",
      icon: <Upload className="text-pine-500 dark:text-pine-400"  size={20} />,
      title: tHow("step1Title"),
      body: tHow("step1Body"),
      gradient:"bg-zinc-100 text-zinc-900",
      glow:"",
    },
    {
      n:"02",
      img:"/steps/step-format.webp",
      icon: <FileCheck className="text-pine-600 dark:text-pine-400"  size={20} />,
      title: tHow("step2Title"),
      body: tHow("step2Body"),
      gradient:"bg-zinc-100 text-zinc-900",
      glow:"",
    },
    {
      n:"03",
      img:"/steps/step-download.webp",
      icon: <Download className="text-pine-500 dark:text-pine-400"  size={20} />,
      title: tHow("step3Title"),
      body: tHow("step3Body"),
      gradient:"bg-zinc-100 text-zinc-900",
      glow:"",
    },
  ];

  const testimonials = [
    { text: tTest("q1"), name: tTest("name1"), role: tTest("role1"), initial:"P", color:"bg-pine-500 text-white" },
    { text: tTest("q2"), name: tTest("name2"), role: tTest("role2"), initial:"R", color:"bg-pine-500 text-white" },
    { text: tTest("q3"), name: tTest("name3"), role: tTest("role3"), initial:"A", color:"bg-pine-500 text-white" },
    { text: tTest("q4"), name: tTest("name4"), role: tTest("role4"), initial:"V", color:"bg-pine-500 text-white" },
    { text: tTest("q5"), name: tTest("name5"), role: tTest("role5"), initial:"M", color:"bg-pine-500 text-white" },
    { text: tTest("q6"), name: tTest("name6"), role: tTest("role6"), initial:"D", color:"bg-pine-500 text-white" },
    { text: tTest("q1"), name: tTest("name1"), role: tTest("role1"), initial:"P", color:"bg-pine-500 text-white" },
    { text: tTest("q2"), name: tTest("name2"), role: tTest("role2"), initial:"R", color:"bg-pine-500 text-white" },
    { text: tTest("q3"), name: tTest("name3"), role: tTest("role3"), initial:"A", color:"bg-pine-500 text-white" },
    { text: tTest("q4"), name: tTest("name4"), role: tTest("role4"), initial:"V", color:"bg-pine-500 text-white" },
    { text: tTest("q5"), name: tTest("name5"), role: tTest("role5"), initial:"M", color:"bg-pine-500 text-white" },
    { text: tTest("q6"), name: tTest("name6"), role: tTest("role6"), initial:"D", color:"bg-pine-500 text-white" },
  ];

  const faqs = [
    { q: tFaq("q1"), a: tFaq("a1") },
    { q: tFaq("q2"), a: tFaq("a2") },
    { q: tFaq("q3"), a: tFaq("a3") },
    { q: tFaq("q4"), a: tFaq("a4") },
    { q: tFaq("q5"), a: tFaq("a5") },
    { q: tFaq("q6"), a: tFaq("a6") },
  ];

  const softwareAppSchema = {"@context":"https://schema.org","@type":"SoftwareApplication",
    name:"Convert Statement",
    applicationCategory:"FinanceApplication",
    operatingSystem:"Web",
    url:"https://www.convertstatement.online",
    description:"Convert bank statement PDFs from Wells Fargo, Citibank, U.S. Bank, Cadence Bank, Kotak and 400+ more into CSV, Excel, OFX for Tally, or Google Sheets in under 15 seconds.",
    offers: [
      {"@type":"Offer", name:"Free tier", price:"0", priceCurrency:"USD" },
      {"@type":"Offer", name:"Basic", price:"5", priceCurrency:"USD" },
      {"@type":"Offer", name:"Pro", price:"20", priceCurrency:"USD" },
      {"@type":"Offer", name:"Business", price:"75", priceCurrency:"USD" },
    ],
  };

  const faqPageSchema = {"@context":"https://schema.org","@type":"FAQPage",
    mainEntity: faqs.map((f) => ({"@type":"Question", name: f.q,
      acceptedAnswer: {"@type":"Answer", text: f.a}})),
  };

  return (
    <>
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
      <Navbar dark />
      <main className="overflow-x-hidden">

        {/* ─── HERO — CENTERED UPLOAD ───────────────────────── */}
        <HeroSectionWrapper />



        {/* ─── THE PROBLEM ──────────────────────────────────────── */}
        <section className="py-24 bg-pine-50 dark:bg-zinc-900">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">the problem</p>
            <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-brand-text max-w-2xl leading-[1.12]">Month-end means <span className="text-pine-600 dark:text-pine-400">hours of typing</span> the same numbers again.</h2>
            <p className="text-brand-muted max-w-xl mt-4 text-sm leading-relaxed">A client sends 40 statements. Someone on your team opens each PDF, retypes every transaction, and still finds the totals don&apos;t match. The work is slow, boring, and exactly where mistakes hide.</p>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 bg-brand-bg">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-left mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">{tHow("label")}</span>
              <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-brand-text mb-3">{tHow("title")}</h2>
              <p className="text-zinc-400 dark:text-brand-muted max-w-xl text-sm">{tHow("subtitle")}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {steps.map(({ n, icon, img, title, body, gradient }) => (
                <div
                  key={n}
                  className="relative group flex flex-col p-8 bg-white dark:bg-zinc-900 border border-brand-border rounded-[20px] hover:bg-brand-surface/80 transition-colors duration-300"
                >
                  <div className="absolute top-6 right-6 text-4xl font-black select-none text-pine-100 dark:text-pine-900">{n}</div>

                  {img ? (
                    <img src={img} alt="" className="relative w-[76px] h-[76px] object-contain bg-white rounded-lg mb-5" />
                  ) : (
                    <div className={`relative w-[60px] h-[60px] rounded-full flex items-center justify-center mb-5 bg-pine-50 dark:bg-pine-500/10 text-pine-700 dark:text-pine-300 border border-pine-100 dark:border-pine-900`}>
                      {icon}
                    </div>
                  )}
                  <h3 className="relative text-[0.95rem] font-bold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
                  <p className="relative text-sm text-brand-muted leading-relaxed">{body}</p>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── THE DIFFERENCE ───────────────────────────────────── */}
        <section className="py-24 bg-pine-50 dark:bg-zinc-900">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">the difference</p>
            <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-brand-text leading-[1.12]">Your options, honestly compared.</h2>
            <div className="mt-10 overflow-x-auto rounded-[20px] border border-brand-border">
              <table className="w-full min-w-[560px] bg-white dark:bg-zinc-900 text-left text-sm">
                <thead>
                  <tr className="bg-pine-800 text-white">
                    <th className="px-6 py-4 font-semibold">Your options</th>
                    <th className="px-6 py-4 font-semibold">What you get</th>
                    <th className="px-6 py-4 font-semibold">What&apos;s missing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-brand-border">
                    <td className="px-6 py-4">Manual typing</td>
                    <td className="px-6 py-4">Full control</td>
                    <td className="px-6 py-4">Hours per client, every month; typos guaranteed</td>
                  </tr>
                  <tr className="border-t border-brand-border">
                    <td className="px-6 py-4">Hire data-entry help</td>
                    <td className="px-6 py-4">Hands off your desk</td>
                    <td className="px-6 py-4">Training, payroll, and you still check every row</td>
                  </tr>
                  <tr className="border-t border-brand-border">
                    <td className="px-6 py-4">Bank&apos;s own export</td>
                    <td className="px-6 py-4">Clean data</td>
                    <td className="px-6 py-4">Only some banks, only some formats, no history</td>
                  </tr>
                  <tr className="border-t border-brand-border bg-pine-50">
                    <td className="px-6 py-4 font-bold text-pine-700 dark:text-pine-400">ConvertStatement</td>
                    <td className="px-6 py-4 font-bold text-pine-700 dark:text-pine-400">Any bank, any format, in 15 seconds</td>
                    <td className="px-6 py-4 font-bold text-pine-700 dark:text-pine-400">Nothing missing.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── FEATURES — ADVANCED BENTO ────────────────────────── */}
        <section id="features" className="relative py-24 bg-brand-surface">
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="text-left mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">{tFeat("label")}</span>
              <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight mb-3 text-brand-text">{tFeat("title")}</h2>
              <p className="text-brand-muted max-w-xl text-sm">{tFeat("subtitle")}</p>
            </div>

            {/* Fancy feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group relative flex flex-col overflow-hidden p-8 bg-white dark:bg-zinc-900 border border-brand-border rounded-[20px] hover:bg-brand-surface/80 transition-colors duration-300"
                >
                  <div className="relative z-10 flex flex-1 flex-col">
                    {f.img ? (
                      <img src={f.img} alt="" className="w-[76px] h-[76px] object-contain bg-white rounded-lg mb-5" />
                    ) : (
                      <div className="w-[60px] h-[60px] rounded-full bg-pine-50 dark:bg-pine-500/10 border border-pine-100 dark:border-pine-900 flex items-center justify-center mb-5 transition-transform group-hover:scale-105">
                        {f.icon}
                      </div>
                    )}

                    {f.stat && (
                      <div className="text-4xl font-black mb-1 leading-none">
                        <span className="text-zinc-900 dark:text-zinc-100">{f.stat}</span>
                        <span className="text-xl text-zinc-400 dark:text-brand-muted font-bold">{f.statSuffix}</span>
                      </div>
                    )}

                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 mt-1">{f.title}</h3>
                    <p className="text-sm text-brand-muted leading-relaxed flex-1">{f.body}</p>

                    {f.badge && (
                      <div className="mt-4 inline-flex items-center gap-1.5 self-start text-[11px] font-bold text-pine-600 bg-pine-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="text-pine-500 dark:text-pine-400"  size={11} /> {f.badge}
                      </div>
                    )}

                    {f.chips && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {f.chips.map((c, i) => (
                          <span
                            key={c}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-brand-surface text-zinc-600 dark:text-zinc-400 border-brand-border"
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
        <section className="py-24 bg-pine-50 dark:bg-zinc-900 overflow-hidden border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-6 mb-12 text-left">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">{tTest("label")}</span>
            <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-brand-text">{tTest("title")}</h2>
          </div>

          {/* Marquee of testimonial cards */}
          <div
            className="relative"
            style={{ maskImage:"linear-gradient(to right,transparent 0%,#000 6%,#000 94%,transparent 100%)", WebkitMaskImage:"linear-gradient(to right,transparent 0%,#000 6%,#000 94%,transparent 100%)" }}
          >
            <div className="flex gap-5 w-max animate-marquee" style={{ animationDuration:"30s" }}>
              {[...testimonials, ...testimonials].map(({ text, name, role, initial, color }, i) => (
                <div key={i} className="shrink-0 w-80 rounded-2xl border border-brand-border bg-white dark:bg-zinc-900 p-6 flex flex-col hover:bg-brand-surface/80 transition-colors">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} className="fill-honey-400 text-honey-400" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1 mb-5">{text}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-sm font-bold shrink-0`}>{initial}</div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{name}</p>
                      <p className="text-xs text-brand-muted">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING ──────────────────────────────────────────── */}
        <section id="pricing" className="py-24 bg-brand-surface border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-left mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">Pricing</span>
              <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-brand-text mb-3">Simple, transparent pricing</h2>
              <p className="text-brand-muted text-sm">Start free. Only pay when you need more.</p>
            </div>
            <PricingCards />
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section id="faq" className="py-24 bg-brand-bg border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-left mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">{tFaq("label")}</span>
              <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-brand-text">{tFaq("title")}</h2>
            </div>
            <FAQAccordion items={faqs} />
          </div>
        </section>

        {/* ─── SUPPORTED BANKS ──────────────────────────────────── */}
        <section className="py-24 bg-brand-surface border-y border-brand-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-left mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">Coverage</span>
              <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-brand-text mb-4">Supports major banks globally</h2>
              <p className="text-brand-muted max-w-xl text-sm">We process statements from top banks worldwide with 99.4% accuracy. If your bank is missing, contact us to add it.</p>
            </div>
            <div className="mt-8">
              <BankMarquee banks={BANKS} />
            </div>
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────── */}
        <section className="py-20 bg-brand-bg">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative bg-pine-800 rounded-[20px] px-8 py-14 sm:px-12 text-center">
              <div className="relative z-10">
                <span className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5 bg-pine-700 text-pine-100 border border-pine-600">
                  {tCta("label")}
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-[1.05]">
                  {tCta("title")}
                </h2>
                <p className="max-w-xl mx-auto text-sm leading-relaxed text-zinc-400">
                  {tCta("subtitle")}
                </p>
              </div>
              <div className="relative z-10 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-4 rounded-[10px] text-sm font-bold text-[#072b18] bg-pine-400 hover:bg-pine-300 transition-colors whitespace-nowrap">
                  <span>{tCta("button")}</span>
                  <ArrowRight className="text-[#072b18]" size={15} />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-[10px] text-sm font-semibold text-zinc-300 border border-zinc-700 hover:bg-zinc-800 transition-colors whitespace-nowrap"
                >
                  View pricing <ChevronRight className="text-pine-400" size={14} />
                </Link>
              </div>
              <p className="relative z-10 mt-6 text-xs text-zinc-400">{tCta("note")}</p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
