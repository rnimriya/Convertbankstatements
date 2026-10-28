import type { Metadata } from"next";
import type { ReactNode } from"react";
import { getTranslations } from"next-intl/server";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Link } from"@/i18n/navigation";
import {
  ArrowRight, Zap, Lock, Globe,
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
    { icon: <Globe size={22} className="text-pine-500 dark:text-pine-400" />, gradient:"", glow:"", stat:"30", statSuffix:"+", title: tFeat("banksTitle"), body: tFeat("banksBody"), img:"/features/feature-banks.webp" },
    { icon: <Lock size={20} className="text-pine-600 dark:text-pine-400" />, gradient:"", glow:"", title: tFeat("passwordTitle"), body: tFeat("passwordBody"), img:"/features/feature-password.webp" },
    { icon: <FileText size={22} className="text-pine-500 dark:text-pine-400" />, gradient:"", glow:"", title: tFeat("formatsTitle"), body: tFeat("formatsBody"), chips: ["Excel","CSV","QBO · QuickBooks","OFX / Tally","Google Sheets"], img:"/features/feature-formats.webp" },
    { icon: <CreditCard size={20} className="text-pine-600 dark:text-pine-400" />, gradient:"", glow:"", title: tFeat("pricingTitle"), body: tFeat("pricingBody"), img:"/features/feature-pricing.webp" },
    { icon: <Clock size={20} className="text-pine-600 dark:text-pine-400" />, gradient:"", glow:"", title: tFeat("instantTitle"), body: tFeat("instantBody"), img:"/features/feature-instant.webp" },
  ];
  const BAND_FEATURES = [FEATURES[0], FEATURES[2], FEATURES[3]];
  const TILE_FEATURES = FEATURES.filter((f) => !BAND_FEATURES.includes(f));




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

  const WHO = [
    { img:"/personas/persona-firms.webp", title:"Accounting firms", body:"Bulk-convert client statements every month and hand clean books back faster." },
    { img:"/personas/persona-bookkeepers.webp", title:"Bookkeepers", body:"Turn a pile of PDFs into reconciled QuickBooks and Xero files in minutes." },
    { img:"/personas/persona-cpa.webp", title:"CPAs & tax pros", body:"Tax-season statements to Excel and CSV — accurate, complete, on time." },
    { img:"/personas/persona-smallbiz.webp", title:"Small businesses", body:"Your own statements, converted yourself — no accountant bill for data entry." },
  ];

  const TOOLS = [
    { href: "/tools/free-qbo-cleanup-checker", label: "QBO Duplicate Finder", img: "/tools/tool-duplicates.webp" },
    { href: "/tools/free-stripe-to-quickbooks", label: "Stripe QBO Converter", img: "/tools/tool-stripe.webp" },
    { href: "/tools/free-paypal-to-quickbooks", label: "PayPal Payout to QBO Converter", img: "/tools/tool-paypal.webp" },
    { href: "/tools/free-receipt-to-quickbooks", label: "Receipt to QBO", img: "/tools/tool-receipt.webp" },
    { href: "/tools/qbo-checker", label: "QBO File Checker", img: "/tools/tool-checker.webp" },
    { href: "/tools/csv-to-qbo", label: "CSV to QBO Converter", img: "/tools/tool-csv.webp" },
    { href: "/tools/amazon-to-quickbooks", label: "Amazon Settlement to QuickBooks", img: "/tools/tool-amazon.webp" },
    { href: "/tools/shopify-to-quickbooks", label: "Shopify Payout to QuickBooks", img: "/tools/tool-shopify.webp" },
    { href: "/tools/reconciliation-finder", label: "Reconciliation Difference Finder", img: "/tools/tool-recon.webp" },
    { href: "/tools/qbo-import-errors", label: "QBO Import Errors, Explained", img: "/tools/tool-errors.webp" },
  ];
  const TOOL_DESC = "Free to scan — files are processed in memory and never stored. QBO downloads are on Pro.";

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

        {/* ─── HERO — DARK SPLIT + CONVERTER ─────────────── */}
        <HeroSectionWrapper />

        {/* ─── WHO IT'S FOR ───────────────────────────────────── */}
        <section className="py-24 bg-brand-bg">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">Who it&apos;s for</p>
            <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-brand-text max-w-2xl leading-[1.12]">Built for the people who close the books.</h2>
            <p className="text-brand-muted max-w-xl mt-4 text-sm leading-relaxed">One tool for every desk that touches bank statements — no retyping, no chasing exports.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              {WHO.map((w) => (
                <div key={w.title} className="p-7 bg-white border border-brand-border rounded-[20px]">
                  <img src={w.img} alt="" className="w-14 h-14 object-contain mb-4" />
                  <h3 className="text-[1.05rem] font-bold text-zinc-900 mb-2">{w.title}</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* ─── THE PROBLEM ──────────────────────────────────────── */}
        <section className="py-24 bg-pine-50 dark:bg-zinc-900">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">the problem</p>
            <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-brand-text max-w-2xl leading-[1.12]">Month-end means <span className="text-pine-600 dark:text-pine-400">hours of typing</span> the same numbers again.</h2>
            <p className="text-brand-muted max-w-xl mt-4 text-sm leading-relaxed">A client sends 40 statements. Someone on your team opens each PDF, retypes every transaction, and still finds the totals don&apos;t match. The work is slow, boring, and exactly where mistakes hide.</p>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 bg-brand-bg scroll-mt-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">{tHow("label")}</span>
              <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-brand-text mb-3">{tHow("title")}</h2>
              <p className="text-zinc-400 dark:text-brand-muted max-w-xl text-sm mx-auto">{tHow("subtitle")}</p>
            </div>

            <div className="relative">
              <div aria-hidden className="absolute top-16 left-[16%] right-[16%] border-t-2 border-dashed border-pine-200 hidden md:block" />
              <div className="relative grid md:grid-cols-3 gap-6">
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

        {/* ─── FEATURES — STAT-HERO + COMPACT TILES (Design I) ─── */}
        <section id="features" className="relative py-24 bg-white">
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="max-w-[720px] mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-4">{tFeat("label")}</span>
              <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight leading-[1.1] text-pine-800 mb-4">{tFeat("title")}</h2>
              <p className="text-zinc-600 text-base">{tFeat("subtitle")}</p>
            </div>

            {/* Stat-hero band: fast / accurate / banks */}
            <div className="bg-pine-50 rounded-[20px] px-8 py-11 sm:px-12 grid grid-cols-1 sm:grid-cols-3 mb-5">
              {BAND_FEATURES.map((f, i) => {
                // Banks hero number matches its title (400+) as in the approved mockup;
                // the old card stat (30+) is not used here.
                const num = f === FEATURES[3] ? "400" : f.stat;
                const sfx = f === FEATURES[3] ? "+" : f.statSuffix;
                const last = i === BAND_FEATURES.length - 1;
                const pad = i === 0 ? "pt-0 sm:pr-8" : last ? "sm:pl-8 sm:pr-0" : "sm:pl-8 sm:pr-8";
                const div = i === 0 ? "" : "border-t border-pine-200 sm:border-t-0 sm:border-l";
                return (
                  <div key={f.title} className={`py-6 sm:py-0 ${pad} ${div} ${last ? "pb-0" : ""}`}>
                    <div className="text-[60px] sm:text-[76px] font-extrabold leading-none tracking-tight text-pine-800">
                      {num}
                      <span className="text-[32px] sm:text-[40px] text-pine-600">{sfx}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-zinc-900 mt-3">{f.title}</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed mt-1.5">{f.body}</p>
                  </div>
                );
              })}
            </div>

            {/* Compact tiles: remaining 5, instant download wide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TILE_FEATURES.map((f) => {
                const wide = f === TILE_FEATURES[TILE_FEATURES.length - 1];
                return (
                  <div
                    key={f.title}
                    className={`bg-white border border-zinc-200 rounded-[20px] p-6 flex flex-col ${wide ? "sm:col-span-2 sm:flex-row sm:items-center gap-5" : ""}`}
                  >
                    {f.img ? (
                      <img src={f.img} alt="" className={`w-[52px] h-[52px] object-contain shrink-0 ${wide ? "mb-4 sm:mb-0" : "mb-4"}`} />
                    ) : (
                      <div className={`w-[52px] h-[52px] rounded-full bg-pine-50 border border-pine-100 flex items-center justify-center shrink-0 ${wide ? "mb-4 sm:mb-0" : "mb-4"}`}>
                        {f.icon}
                      </div>
                    )}
                    <div>
                      <h3 className="text-[17px] font-extrabold text-zinc-900">{f.title}</h3>
                      <p className="text-sm text-zinc-600 leading-relaxed mt-1.5">{f.body}</p>
                      {f.badge && (
                        <div className="mt-3 inline-flex items-center gap-1.5 self-start text-xs font-bold text-pine-700 bg-pine-50 px-3 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-pine-400" /> {f.badge}
                        </div>
                      )}
                      {f.chips && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {f.chips.map((c) => (
                            <span key={c} className="px-3 py-1 rounded-full text-xs font-bold border border-zinc-200 bg-white text-zinc-700">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── FREE QUICKBOOKS TOOLS — DARK BAND ───────────── */}
        <section className="py-24 bg-pine-800">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-left mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-pine-400 mb-3">Free tools</span>
              <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-white mb-3">More free QuickBooks tools</h2>
              <p className="text-zinc-400 max-w-xl text-sm">10 free tools — pick one, scan free, no account needed.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group flex items-center gap-4 rounded-2xl border border-[#1d4a30] bg-[#0e3a24] p-4 hover:border-pine-500 transition-colors"
                >
                  <img src={t.img} alt="" width={56} height={56} loading="lazy" className="h-14 w-14 shrink-0 rounded-xl bg-white object-contain" />
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold text-white truncate">{t.label}</span>
                    <span className="block text-[13px] text-zinc-400 mt-0.5 leading-snug">{TOOL_DESC}</span>
                  </span>
                  <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-pine-600 text-pine-400">
                    <ArrowRight size={15} />
                  </span>
                </Link>
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
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">Pricing</span>
              <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-brand-text mb-3">Simple, transparent pricing</h2>
              <p className="text-brand-muted text-sm max-w-xl mx-auto">Start free. Only pay when you need more.</p>
            </div>
            <PricingCards />
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section id="faq" className="py-24 bg-brand-bg border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-pine-600 mb-3">{tFaq("label")}</span>
              <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-brand-text">{tFaq("title")}</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <FAQAccordion items={faqs} />
            </div>
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

        {/* ─── CTA — FULL-WIDTH BRIGHT GREEN BAND, FOOTER SE CHIPKA ── */}
        <section className="bg-pine-400">
          <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 text-center">
            <div className="relative z-10">
                <span className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5 bg-[#072b18] text-white">
                  {tCta("label")}
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-[#072b18] mb-4 leading-[1.05]">
                  {tCta("title")}
                </h2>
                <p className="max-w-xl mx-auto text-sm leading-relaxed text-[#164234]">
                  {tCta("subtitle")}
                </p>
              </div>
              <div className="relative z-10 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-4 rounded-[10px] text-sm font-bold text-white bg-pine-800 hover:bg-pine-700 transition-colors whitespace-nowrap">
                  <span>{tCta("button")}</span>
                  <ArrowRight className="text-white" size={15} />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-[10px] text-sm font-semibold text-[#072b18] border border-[#072b18]/30 hover:bg-[#072b18]/10 transition-colors whitespace-nowrap"
                >
                  View pricing <ChevronRight className="text-[#072b18]" size={14} />
                </Link>
              </div>
              <p className="relative z-10 mt-6 text-xs text-[#164234]">{tCta("note")}</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
