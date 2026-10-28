import type { Metadata } from"next";
import type { ReactNode } from"react";
import { getTranslations } from"next-intl/server";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Link } from"@/i18n/navigation";
import {
  ArrowRight, ArrowUpRight, Zap, Lock, Globe,
  Download, Upload, Shield, Clock, CreditCard, FileCheck, FileText,
} from"lucide-react";
import { Footer } from"@/components/layout/Footer";
import { Navbar } from"@/components/layout/Navbar";
import { FAQAccordion } from"@/components/home/FAQAccordion";
import { HeroSectionWrapper } from"@/components/home/HeroSectionWrapper";

export const metadata: Metadata = {
  alternates: { canonical:"https://www.convertstatement.online" },
};

export default async function HomePage() {
  const tHow   = await getTranslations("howItWorks");
  const tFeat  = await getTranslations("features");
  const tFaq   = await getTranslations("faq");
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

  const faqs = [
    { q: tFaq("q1"), a: tFaq("a1") },
    { q: tFaq("q2"), a: tFaq("a2") },
    { q: tFaq("q3"), a: tFaq("a3") },
    { q: tFaq("q4"), a: tFaq("a4") },
    { q: tFaq("q5"), a: tFaq("a5") },
    { q: tFaq("q6"), a: tFaq("a6") },
  ];
  const TOOLS = [
    { href: "/tools/free-qbo-cleanup-checker", label: "QBO Duplicate Finder", img: "/tools/tool-duplicates.webp", desc: "Find duplicate transactions hiding in a QBO file" },
    { href: "/tools/free-stripe-to-quickbooks", label: "Stripe QBO Converter", img: "/tools/tool-stripe.webp", desc: "Convert Stripe payouts to QBO" },
    { href: "/tools/free-paypal-to-quickbooks", label: "PayPal Payout to QBO Converter", img: "/tools/tool-paypal.webp", desc: "Convert PayPal payouts to QBO" },
    { href: "/tools/free-receipt-to-quickbooks", label: "Receipt to QBO", img: "/tools/tool-receipt.webp", desc: "Turn receipts into QBO rows" },
    { href: "/tools/qbo-checker", label: "QBO File Checker", img: "/tools/tool-checker.webp", desc: "Validate a QBO file before import" },
    { href: "/tools/csv-to-qbo", label: "CSV to QBO Converter", img: "/tools/tool-csv.webp", desc: "Convert CSV rows to QuickBooks QBO" },
    { href: "/tools/amazon-to-quickbooks", label: "Amazon Settlement to QuickBooks", img: "/tools/tool-amazon.webp", desc: "Convert Amazon payouts to QBO" },
    { href: "/tools/shopify-to-quickbooks", label: "Shopify Payout to QuickBooks", img: "/tools/tool-shopify.webp", desc: "Convert Shopify payouts to QBO" },
    { href: "/tools/reconciliation-finder", label: "Reconciliation Difference Finder", img: "/tools/tool-recon.webp", desc: "Find what does not match, fast" },
    { href: "/tools/qbo-import-errors", label: "QBO Import Errors, Explained", img: "/tools/tool-errors.webp", desc: "Decode QuickBooks import errors" },
  ];
  const NUMS = [
    { dot: "↗", num: "15", sfx: "s", cap: "multi-page PDFs converted, start to finish" },
    { dot: "✓", num: "99.4", sfx: "%", cap: "amount, date and reference accuracy" },
    { dot: "⌂", num: "400", sfx: "+", cap: "banks covered, worldwide" },
    { dot: "★", num: "8", sfx: "", cap: "pages free on every account, forever" },
  ];
  const PRICE_PLANS = [
    { name: "Free", price: "$0", suffix: "", per: "forever", features: ["8 pages free", "Excel & CSV export", "400+ banks"], btn: "Start free", hot: false },
    { name: "Basic", price: "$5", suffix: " /mo", per: "for occasional converts", features: ["25 pages a month", "All export formats", "Password PDFs"], btn: "Choose Basic", hot: false },
    { name: "Pro", price: "$20", suffix: " /mo", per: "for firms & bookkeepers", features: ["Everything in Basic", "QBO / QFX / OFX downloads", "Priority processing"], btn: "Choose Pro", hot: true },
    { name: "Business", price: "$75", suffix: " /mo", per: "for high-volume teams", features: ["Everything in Pro", "High-volume conversion", "Team-ready workflow"], btn: "Choose Business", hot: false },
  ];

  const Label = ({ children, light = false }: { children: ReactNode; light?: boolean }) => (
    <p className={`agri-mono text-[11px] font-medium uppercase tracking-[0.16em] flex items-center gap-2 ${light ? "text-[#B9D6B2]" : "text-[#13541C]"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#64CB48] shrink-0" />
      {children}
    </p>
  );
  const bentoCls = (i: number) =>
    i === 0 ? "bg-[linear-gradient(135deg,#DDFB8A,#8FE07A)] border-transparent"
    : i === 1 ? "bg-[#0B1F0E] border-[#24452A]"
    : i === 5 ? "bg-[#BACEBA] border-transparent"
    : "bg-white border-[#D8DEC9]";
  const bentoTitleCls = (i: number) => (i === 1 ? "text-white" : "text-[#101812]");
  const bentoBodyCls = (i: number) => (i === 0 ? "text-[#2C4416]" : i === 1 ? "text-[#A9BFA9]" : "text-[#5B665C]");

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
      <Navbar dark bg="#071106" />
      <main className="overflow-x-hidden agri-sans">

        {/* ─── HERO — DARK AGRIFRIKA + CONVERTER ─────────── */}
        <HeroSectionWrapper />

        {/* ─── 01 / NUMBERS — PALE SAGE ───────────────────── */}
        <section className="py-24 bg-[#E0E6D6]">
          <div className="max-w-6xl mx-auto px-6">
            <Label>01 / ConvertStatement in numbers</Label>
            <div className="grid lg:grid-cols-2 gap-12 mt-6 items-start">
              <div>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.04] text-[#071106]">The converter built for <span className="agri-serif font-normal">busy books.</span></h2>
                <p className="text-[#5B665C] mt-5 leading-relaxed max-w-md">Accountants, bookkeepers, CPAs and small businesses use ConvertStatement to skip manual entry and get reconciliation-ready files in seconds.</p>
                <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-[#C9D2BC] px-6 py-3.5 text-sm font-bold text-[#071106] whitespace-nowrap mt-6">
                  Discover the features <ArrowRight size={15} />
                </a>
              </div>
              <div className="grid grid-cols-2 border-t border-l border-[#C4CDB2]">
                {NUMS.map(({ dot, num, sfx, cap }) => (
                  <div key={cap} className="border-r border-b border-[#C4CDB2] p-7 sm:p-9">
                    <span className="w-[22px] h-[22px] rounded-full bg-[#13541C] text-white flex items-center justify-center text-[11px] mb-5">{dot}</span>
                    <div className="text-[52px] sm:text-[64px] font-extrabold leading-none tracking-tight text-[#071106]">
                      {num}
                      <span className="text-[#13541C]">{sfx}</span>
                    </div>
                    <p className="text-[13px] text-[#5B665C] mt-2">{cap}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 02 / THE PROBLEM ───────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <Label>02 / The problem</Label>
            <div className="grid lg:grid-cols-2 gap-8 mt-6 items-start">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.04] text-[#071106]">Manual entry eats your <span className="agri-serif font-normal">week.</span></h2>
              <p className="text-[#5B665C] leading-relaxed">A month of bank statements typed by hand means hours lost, typos that break reconciliation, and a month-end backlog that never shrinks. ConvertStatement reads the PDF and hands you a clean file instead.</p>
            </div>

            {/* Dotted conversion diagram */}
            <div className="bg-[#0B1F0E] text-white rounded-[24px] px-6 py-9 sm:px-10 mt-11">
              <p className="agri-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[#B9D6B2] mb-8">Conversion · PDF to spreadsheet</p>
              <div className="flex flex-col sm:flex-row items-center">
                {[
                  { label: "Bank PDF", cap: "Source" },
                  { label: "Parsed rows", cap: "Dates · Amounts" },
                  { label: "Excel · CSV", cap: "Spreadsheet" },
                  { label: "QBO · OFX", cap: "QuickBooks" },
                ].map((n, i, arr) => (
                  <span key={n.label} className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
                    <span className="text-center shrink-0 sm:w-[120px]">
                      <span className="block w-[34px] h-[34px] rounded-full bg-[#64CB48] border-[5px] border-[#1E3A22] mx-auto mb-3" style={{ boxShadow: "0 0 0 1px #64CB48" }} />
                      <b className="block text-sm">{n.label}</b>
                      <span className="agri-mono text-[10px] tracking-[0.14em] uppercase text-[#7E967F]">{n.cap}</span>
                    </span>
                    {i < arr.length - 1 && <span aria-hidden className="hidden sm:block flex-1 border-t-2 border-dashed border-[#4A6B4E] mt-[17px] min-w-6" />}
                  </span>
                ))}
              </div>
            </div>

            {/* Ruled rows */}
            <div className="border-t border-[#D8DEC9] mt-12">
              {[
                { rn: "01", title: "Manual typing", body: "Every line re-keyed by hand — slow, dull, and easy to get wrong." },
                { rn: "02", title: "Copy-paste errors", body: "Pasted tables split, merge and misalign — then reconciliation fails." },
                { rn: "03", title: "Month-end backlog", body: "Statements pile up while close week waits on clean data." },
              ].map((r) => (
                <div key={r.rn} className="grid sm:grid-cols-[56px_1fr_1.2fr_48px] gap-2 sm:gap-6 sm:items-center py-6 border-b border-[#D8DEC9]">
                  <span className="agri-mono text-xs text-[#5B665C] hidden sm:block">{r.rn}</span>
                  <h3 className="text-xl sm:text-[26px] font-extrabold tracking-tight text-[#071106]">{r.title}</h3>
                  <p className="text-sm text-[#5B665C] leading-relaxed">{r.body}</p>
                  <span className="hidden sm:flex w-11 h-11 rounded-full border border-[#D8DEC9] items-center justify-center shrink-0">
                    <ArrowUpRight size={17} className="text-[#071106]" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 03 / FEATURES — DARK BENTO ─────────────────── */}
        <section id="features" className="relative py-24 bg-[#071106] text-white overflow-hidden scroll-mt-24">
          <div aria-hidden className="absolute inset-x-0 top-8 text-center font-extrabold leading-none text-white/[0.04] select-none pointer-events-none whitespace-nowrap" style={{ fontSize: "clamp(80px, 18vw, 260px)" }}>CONVERT</div>
          <div className="relative max-w-6xl mx-auto px-6">
            <Label light>03 / Features</Label>
            <p className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] mt-6 max-w-3xl">We turn <span className="text-zinc-500">messy PDFs</span> into <span className="agri-serif font-normal text-[#64CB48]">ready-to-reconcile</span> data — fast, private, and exact.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
              {FEATURES.map((f, i) => {
                const wide = i === FEATURES.length - 1;
                const showStat = i === 0 || i === 2;
                return (
                  <div
                    key={f.title}
                    className={`rounded-[24px] p-8 border flex flex-col ${bentoCls(i)} ${wide ? "sm:col-span-2 lg:col-span-2 sm:flex-row sm:items-center gap-5" : ""}`}
                  >
                    {f.img ? (
                      <img src={f.img} alt="" className={`w-16 h-16 object-contain shrink-0 ${wide ? "mb-5 sm:mb-0" : "mb-5"}`} />
                    ) : (
                      <div className={`w-16 h-16 rounded-full bg-[#E0E6D6] border border-[#D8DEC9] flex items-center justify-center shrink-0 ${wide ? "mb-5 sm:mb-0" : "mb-5"}`}>
                        {f.icon}
                      </div>
                    )}
                    <div>
                      {showStat && (
                        <div className={`text-[56px] font-extrabold leading-none tracking-tight mb-2 ${i === 0 ? "text-[#071106]" : "text-[#101812]"}`}>
                          {f.stat}
                          <span className="text-[#13541C]">{f.statSuffix}</span>
                        </div>
                      )}
                      <h3 className={`text-[21px] font-extrabold tracking-tight mb-2 ${bentoTitleCls(i)}`}>{f.title}</h3>
                      <p className={`text-sm leading-relaxed ${bentoBodyCls(i)}`}>{f.body}</p>
                      {f.badge && (
                        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#13541C] bg-[#E0E6D6] px-3 py-1.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#64CB48]" /> {f.badge}
                        </div>
                      )}
                      {f.chips && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {f.chips.map((c) => (
                            <span key={c} className="px-3 py-1.5 rounded-full text-xs font-bold border border-[#D8DEC9] bg-white text-[#3f3f46]">
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

        {/* ─── 04 / HOW IT WORKS ──────────────────────────── */}
        <section id="how-it-works" className="py-24 bg-white scroll-mt-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap justify-between items-end gap-8 mb-12">
              <div>
                <Label>04 / How it works</Label>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.04] text-[#071106] mt-5">Three steps. <span className="agri-serif font-normal">Zero typing.</span></h2>
              </div>
              <p className="text-[#5B665C] leading-relaxed max-w-sm">From a locked PDF to a file your books accept — in less time than making coffee.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {steps.map(({ n, img, title, body }) => (
                <div key={n} className="bg-white border border-[#D8DEC9] rounded-[24px] p-8">
                  {img ? (
                    <img src={img} alt="" className="w-16 h-16 object-contain mb-5" />
                  ) : null}
                  <p className="agri-mono text-[11px] tracking-[0.16em] text-[#13541C]">STEP {n}</p>
                  <h3 className="text-[21px] font-extrabold tracking-tight text-[#071106] mt-2 mb-2">{title}</h3>
                  <p className="text-sm text-[#5B665C] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 05 / FREE QUICKBOOKS TOOLS — DARK BAND ─────── */}
        <section className="py-24 bg-[#071106] text-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap justify-between items-end gap-8 mb-12">
              <div>
                <Label light>05 / Free QuickBooks tools</Label>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.04] mt-5">Ten free tools. <span className="agri-serif font-normal text-[#64CB48]">Scan free.</span></h2>
              </div>
              <p className="text-[#A9BFA9] leading-relaxed max-w-sm">Pick one, scan free, no account needed. QBO downloads are on Pro.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3.5">
              {TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="flex items-center gap-4 bg-white border border-[#D8DEC9] rounded-[20px] px-5 py-4"
                >
                  <img src={t.img} alt="" width={56} height={56} loading="lazy" className="h-14 w-14 shrink-0 rounded-[14px] bg-[#F2F4EC] object-contain" />
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-[#101812]">{t.label}</span>
                    <span className="block text-[13px] text-[#5B665C] mt-0.5 leading-snug">{t.desc}</span>
                  </span>
                  <span className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D8DEC9] text-[#101812]">
                    <ArrowRight size={15} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 06 / PRICING TEASER — PALE SAGE ─────────────── */}
        <section id="pricing" className="py-24 bg-[#E0E6D6] scroll-mt-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap justify-between items-end gap-8 mb-12">
              <div>
                <Label>06 / Pricing</Label>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.04] text-[#071106] mt-5">Start free. <span className="agri-serif font-normal">Scale when ready.</span></h2>
              </div>
              <a href="/pricing" className="inline-flex items-center gap-2 rounded-full border border-[#C9D2BC] px-6 py-3.5 text-sm font-bold text-[#071106] whitespace-nowrap">
                See all plans <ArrowRight size={15} />
              </a>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {PRICE_PLANS.map((p) => (
                <div key={p.name} className={`rounded-[24px] p-8 border flex flex-col ${p.hot ? "bg-[#071106] text-white border-[#071106]" : "bg-white border-[#D8DEC9] text-[#101812]"}`}>
                  <p className="text-[15px] font-bold">{p.name}{p.hot ? " · Most popular" : ""}</p>
                  <p className="text-[56px] font-extrabold leading-none tracking-tight mt-5 mb-1">
                    {p.price}
                    {p.suffix && <small className={`text-base font-medium ${p.hot ? "text-[#A9BFA9]" : "text-[#5B665C]"}`}>{p.suffix}</small>}
                  </p>
                  <p className={`text-[13px] ${p.hot ? "text-[#A9BFA9]" : "text-[#5B665C]"}`}>{p.per}</p>
                  <ul className="my-6 flex flex-col gap-2.5 text-sm">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex gap-2">
                        <span className={`font-bold ${p.hot ? "text-[#64CB48]" : "text-[#13541C]"}`}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/pricing"
                    className={`inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold whitespace-nowrap mt-auto w-full ${p.hot ? "bg-[#64CB48] text-[#071106]" : p.name === "Free" ? "bg-[#071106] text-white" : "border border-[#C9D2BC] text-[#071106]"}`}
                  >
                    {p.btn}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 07 / FAQ ───────────────────────────────────── */}
        <section id="faq" className="py-24 bg-white scroll-mt-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <Label>07 / FAQ</Label>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.04] text-[#071106] mt-5">Questions, <span className="agri-serif font-normal">answered.</span></h2>
            </div>
            <div className="max-w-3xl">
              <FAQAccordion items={faqs} />
            </div>
          </div>
        </section>

        {/* ─── CTA BAND ───────────────────────────────────── */}
        <section className="py-24 bg-white pt-0">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-[32px] px-6 py-16 sm:px-10 sm:py-[72px] text-center text-white" style={{ background: "linear-gradient(180deg, #0E3D15, #13541C)" }}>
              <div aria-hidden className="absolute left-1/2 bottom-[-260px] -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,.4), transparent 75%)" }} />
              <h2 className="relative text-4xl sm:text-[52px] font-extrabold leading-[1.05]">Stop typing statements.<br /><span className="agri-serif font-normal">Start converting.</span></h2>
              <p className="relative text-[#B9D6B2] mt-4 max-w-[520px] mx-auto">Your first 8 pages are free. Upload a PDF and see a clean spreadsheet in under 15 seconds.</p>
              <div className="relative flex flex-wrap justify-center gap-3 mt-8">
                <a href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#071106] whitespace-nowrap">
                  Convert free <ArrowRight size={15} />
                </a>
                <a href="/pricing" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white whitespace-nowrap">
                  See pricing
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer variant="agri" />
    </>
  );
}
