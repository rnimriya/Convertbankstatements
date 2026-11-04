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
  type HomeTool = {
    href: string;
    label: string;
    desc: string;
    img: string;
    tag?: "free" | "pop";
  };
  const TOOLS: HomeTool[] = [
    { href: "/tools/csv-to-qbo", label: "CSV to QBO Converter", desc: "Convert any CSV or Excel file into a QBO file QuickBooks imports cleanly.", img: "/tools/tool-csv.webp", tag: "pop" },
    { href: "/tools/qbo-to-csv", label: "QBO to CSV Converter", desc: "Turn a QBO file back into a clean CSV or Excel sheet you can edit.", img: "/tools/tool-qbo-csv.webp", tag: "free" },
    { href: "/tools/csv-to-iif", label: "CSV to IIF Converter", desc: "Build IIF files for QuickBooks Desktop imports — no manual mapping pain.", img: "/tools/tool-csv-iif.webp", tag: "free" },
    { href: "/tools/ofx-to-qbo", label: "OFX to QBO + BID Fixer", desc: "Fix broken OFX/QFX files and the INTU.BID error so QuickBooks accepts them.", img: "/tools/tool-ofx-fix.webp", tag: "free" },
    { href: "/tools/free-receipt-to-quickbooks", label: "Receipt to QuickBooks", desc: "Snap a receipt and get a QuickBooks-ready expense entry from it.", img: "/tools/tool-receipt.webp" },
    { href: "/tools/bulk-import-quickbooks", label: "Bulk Importer for QuickBooks", desc: "Merge many CSV files, map the columns once, and build one QBO or IIF import file.", img: "/tools/tool-bulk-import.webp", tag: "free" },
    { href: "/tools/bulk-export-quickbooks", label: "Bulk Exporter for QuickBooks", desc: "Combine up to 10 QBO, OFX or QFX files into one clean CSV or Excel sheet.", img: "/tools/tool-bulk-export.webp", tag: "free" },
    { href: "/tools/iif-to-excel", label: "IIF to Excel Converter", desc: "Turn a QuickBooks Desktop IIF export into a readable Excel or CSV sheet.", img: "/tools/tool-iif-excel.webp", tag: "free" },
    { href: "/tools/free-stripe-to-quickbooks", label: "Stripe to QuickBooks", desc: "Convert Stripe payouts into QBO entries with fees split out properly.", img: "/tools/tool-stripe.webp" },
    { href: "/tools/free-paypal-to-quickbooks", label: "PayPal to QuickBooks", desc: "Turn PayPal payout files into clean QuickBooks imports.", img: "/tools/tool-paypal.webp" },
    { href: "/tools/amazon-to-quickbooks", label: "Amazon to QuickBooks", desc: "Amazon seller payouts converted into QuickBooks-ready files.", img: "/tools/tool-amazon.webp" },
    { href: "/tools/shopify-to-quickbooks", label: "Shopify to QuickBooks", desc: "Shopify payout reports mapped and converted for QuickBooks.", img: "/tools/tool-shopify.webp" },
    { href: "/tools/square-to-quickbooks", label: "Square to QuickBooks", desc: "Square payouts to QBO — sales, fees and taxes in the right lines.", img: "/tools/tool-square.webp", tag: "free" },
    { href: "/tools/etsy-to-quickbooks", label: "Etsy to QuickBooks", desc: "Etsy payment files converted into QuickBooks-ready imports.", img: "/tools/tool-etsy.webp", tag: "free" },
    { href: "/tools/free-qbo-cleanup-checker", label: "QBO Cleanup Checker", desc: "Scan your QBO file for duplicates and mess — free report, no signup.", img: "/tools/tool-duplicates.webp" },
    { href: "/tools/qbo-checker", label: "QBO File Checker", desc: "Verify a QBO file's balance chain and structure before you import it.", img: "/tools/tool-checker.webp" },
    { href: "/tools/qbo-import-errors", label: "QBO Import Error Decoder", desc: "Paste a QuickBooks import error and learn what it means and how to fix it.", img: "/tools/tool-errors.webp" },
    { href: "/tools/reconciliation-finder", label: "Reconciliation Finder", desc: "Compare a statement against QuickBooks to find missing or duplicate entries.", img: "/tools/tool-recon.webp" },
    { href: "/tools/qbo-splitter", label: "QBO File Splitter", desc: "Split a big QBO file into smaller chunks QuickBooks can handle.", img: "/tools/tool-splitter.webp", tag: "free" },
    { href: "/tools/bulk-deleter-quickbooks", label: "Bulk Deleter for QuickBooks", desc: "Remove duplicate or unwanted transactions from a QBO file before you import it.", img: "/tools/tool-bulk-delete.webp", tag: "free" },
    { href: "/tools/qbo-file-editor", label: "QBO File Editor", desc: "Edit dates, names and amounts inside a QBO file, with find-and-replace for payees.", img: "/tools/tool-editor.webp", tag: "free" },
    { href: "/tools/qbo-merger", label: "QBO File Merger", desc: "Combine several QBO files from the same account into one clean file.", img: "/tools/tool-merger.webp", tag: "free" },
    { href: "/tools/invoice-import-checker", label: "Invoice Import Checker", desc: "Check invoice files for errors before they fail inside QuickBooks.", img: "/tools/tool-invoice.webp", tag: "free" },
    { href: "/tools/1099-checker", label: "1099 Vendor Checker", desc: "Check which vendors cross the 1099 threshold and need forms.", img: "/tools/tool-1099.webp", tag: "free" },
    { href: "/tools/payroll-journal-generator", label: "Payroll Journal Generator", desc: "Build a balanced payroll journal entry for QuickBooks in minutes.", img: "/tools/tool-payroll.webp", tag: "free" },
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
    <p className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] ${light ? "bg-white/10 text-[#BFE3B8]" : "bg-[#E3F2DF] text-[#007A33]"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
      {children}
    </p>
  );
  const bentoCls = (_i: number) => "bg-white border-[#E3EDE0] shadow-[0_1px_2px_rgba(16,24,40,0.04)]";
  const bentoTitleCls = (_i: number) => "text-[#101812]";
  const bentoBodyCls = (_i: number) => "text-[#5B665C]";

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
      <Navbar />
      <main className="overflow-x-hidden agri-sans">

        {/* ─── HERO — DARK AGRIFRIKA + CONVERTER ─────────── */}
        <HeroSectionWrapper />

        {/* ─── 01 / NUMBERS — PALE SAGE ───────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <Label>01 / ConvertStatement in numbers</Label>
            <div className="grid lg:grid-cols-2 gap-12 mt-6 items-start">
              <div>
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-[#0B1F16]">The converter built for <span className="text-[#2CA01C]">busy books.</span></h2>
                <p className="text-[#5B665C] mt-5 leading-relaxed max-w-md">Accountants, bookkeepers, CPAs and small businesses use ConvertStatement to skip manual entry and get reconciliation-ready files in seconds.</p>
                <a href="#features" className="inline-flex items-center gap-2 rounded-full bg-[#0B1F16] px-6 py-3.5 text-sm font-bold text-white whitespace-nowrap mt-6">
                  Discover the features <ArrowRight size={15} />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {NUMS.map(({ dot, num, sfx, cap }) => (
                  <div key={cap} className="rounded-[24px] border border-[#E3EDE0] bg-[#F7FAF5] p-7 sm:p-8">
                    <span className="w-[22px] h-[22px] rounded-full bg-[#007A33] text-white flex items-center justify-center text-[11px] mb-5">{dot}</span>
                    <div className="text-[52px] sm:text-[64px] font-extrabold leading-none tracking-tight text-[#0B1F16]">
                      {num}
                      <span className="text-[#007A33]">{sfx}</span>
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
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-[#0B1F16]">Manual entry eats your <span className="text-[#2CA01C]">week.</span></h2>
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
                      <span className="block w-[34px] h-[34px] rounded-full bg-[#2CA01C] border-[5px] border-[#1E3A22] mx-auto mb-3" style={{ boxShadow: "0 0 0 1px #2CA01C" }} />
                      <b className="block text-sm">{n.label}</b>
                      <span className="agri-mono text-[10px] tracking-[0.14em] uppercase text-[#7E967F]">{n.cap}</span>
                    </span>
                    {i < arr.length - 1 && <span aria-hidden className="hidden sm:block flex-1 border-t-2 border-dashed border-[#4A6B4E] mt-[17px] min-w-6" />}
                  </span>
                ))}
              </div>
            </div>

            {/* Ruled rows */}
            <div className="border-t border-[#CBE3C4] mt-12">
              {[
                { rn: "01", title: "Manual typing", body: "Every line re-keyed by hand — slow, dull, and easy to get wrong." },
                { rn: "02", title: "Copy-paste errors", body: "Pasted tables split, merge and misalign — then reconciliation fails." },
                { rn: "03", title: "Month-end backlog", body: "Statements pile up while close week waits on clean data." },
              ].map((r) => (
                <div key={r.rn} className="grid sm:grid-cols-[56px_1fr_1.2fr_48px] gap-2 sm:gap-6 sm:items-center py-6 border-b border-[#CBE3C4]">
                  <span className="agri-mono text-xs text-[#5B665C] hidden sm:block">{r.rn}</span>
                  <h3 className="text-xl sm:text-[26px] font-extrabold tracking-tight text-[#0B1F16]">{r.title}</h3>
                  <p className="text-sm text-[#5B665C] leading-relaxed">{r.body}</p>
                  <span className="hidden sm:flex w-11 h-11 rounded-full border border-[#CBE3C4] items-center justify-center shrink-0">
                    <ArrowUpRight size={17} className="text-[#0B1F16]" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 03 / FEATURES — DARK BENTO ─────────────────── */}
        <section id="features" className="relative py-24 bg-[#F7FAF5] overflow-hidden scroll-mt-24">
          <div className="relative max-w-6xl mx-auto px-6">
            <Label>03 / Features</Label>
            <p className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1] mt-6 max-w-3xl text-[#0B1F16]">We turn <span className="text-zinc-400">messy PDFs</span> into <span className="text-[#2CA01C]">ready-to-reconcile</span> data — fast, private, and exact.</p>
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
                      <div className={`w-16 h-16 rounded-full bg-[#E3F2DF] border border-[#CBE3C4] flex items-center justify-center shrink-0 ${wide ? "mb-5 sm:mb-0" : "mb-5"}`}>
                        {f.icon}
                      </div>
                    )}
                    <div>
                      {showStat && (
                        <div className={`text-[56px] font-extrabold leading-none tracking-tight mb-2 ${i === 0 ? "text-[#0B1F16]" : "text-[#101812]"}`}>
                          {f.stat}
                          <span className="text-[#007A33]">{f.statSuffix}</span>
                        </div>
                      )}
                      <h3 className={`text-[21px] font-extrabold tracking-tight mb-2 ${bentoTitleCls(i)}`}>{f.title}</h3>
                      <p className={`text-sm leading-relaxed ${bentoBodyCls(i)}`}>{f.body}</p>
                      {f.badge && (
                        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#007A33] bg-[#E3F2DF] px-3 py-1.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C]" /> {f.badge}
                        </div>
                      )}
                      {f.chips && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {f.chips.map((c) => (
                            <span key={c} className="px-3 py-1.5 rounded-full text-xs font-bold border border-[#CBE3C4] bg-white text-[#3f3f46]">
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
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-[#0B1F16] mt-5">Three steps. <span className="text-[#2CA01C]">Zero typing.</span></h2>
              </div>
              <p className="text-[#5B665C] leading-relaxed max-w-sm">From a locked PDF to a file your books accept — in less time than making coffee.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {steps.map(({ n, img, title, body }) => (
                <div key={n} className="bg-white border border-[#E3EDE0] rounded-[24px] p-8 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  {img ? (
                    <img src={img} alt="" className="w-16 h-16 object-contain mb-5" />
                  ) : null}
                  <p className="agri-mono text-[11px] tracking-[0.16em] text-[#007A33]">STEP {n}</p>
                  <h3 className="text-[21px] font-extrabold tracking-tight text-[#0B1F16] mt-2 mb-2">{title}</h3>
                  <p className="text-sm text-[#5B665C] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 05 / FREE QUICKBOOKS TOOLS — DARK BAND ─────── */}
        <section className="py-24 bg-[#EFF7ED]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap justify-between items-end gap-8 mb-12">
              <div>
                <Label>05 / QuickBooks tools</Label>
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-[#0B1F16] mt-5">All 25 tools. <span className="text-[#2CA01C]">Fifteen free.</span></h2>
              </div>
              <p className="text-[#5B665C] leading-relaxed max-w-sm">Pick any tool — fifteen are completely free, no account needed.</p>
            </div>
            {/* Same card as the /tools page: per-tool Lucide icon tile,
                name, description, free/popular tag and an Open tool link —
                three cards per row on desktop. */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOOLS.map((t) => {
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="group flex flex-col rounded-[22px] border border-[#E3EDE0] bg-white p-5 shadow-[0_1px_3px_rgba(11,31,22,0.05)] transition-colors hover:border-[#CBE3C4]"
                  >
                    <img src={t.img} alt="" width={52} height={52} loading="lazy" className="mb-3 h-[52px] w-[52px] rounded-[14px] bg-[#F2F4EC] object-contain" />
                    <span className="font-display text-[15.5px] font-bold text-[#0B1F16]">{t.label}</span>
                    <span className="mt-1 flex-1 text-[13px] leading-relaxed text-[#5C6F5B]">{t.desc}</span>
                    <span className="mt-3 flex items-center justify-between">
                      {t.tag === "free" ? (
                        <span className="inline-block rounded-full bg-[#E4F4E0] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#1E7A12]">
                          100% Free
                        </span>
                      ) : t.tag === "pop" ? (
                        <span className="inline-block rounded-full bg-[#FFF3D6] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#8A6100]">
                          Most popular
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2CA01C]">
                        Open tool <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── 06 / PRICING TEASER — PALE SAGE ─────────────── */}
        <section id="pricing" className="py-24 bg-white scroll-mt-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap justify-between items-end gap-8 mb-12">
              <div>
                <Label>06 / Pricing</Label>
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-[#0B1F16] mt-5">Start free. <span className="text-[#2CA01C]">Scale when ready.</span></h2>
              </div>
              <a href="/pricing" className="inline-flex items-center gap-2 rounded-full border border-[#C9D2BC] px-6 py-3.5 text-sm font-bold text-[#0B1F16] whitespace-nowrap">
                See all plans <ArrowRight size={15} />
              </a>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {PRICE_PLANS.map((p) => (
                <div key={p.name} className={`rounded-[24px] p-8 border flex flex-col ${p.hot ? "bg-[#0B1F16] text-white border-[#0B1F16]" : "bg-white border-[#CBE3C4] text-[#101812]"}`}>
                  <p className="text-[15px] font-bold">{p.name}{p.hot ? " · Most popular" : ""}</p>
                  <p className="text-[56px] font-extrabold leading-none tracking-tight mt-5 mb-1">
                    {p.price}
                    {p.suffix && <small className={`text-base font-medium ${p.hot ? "text-[#A9BFA9]" : "text-[#5B665C]"}`}>{p.suffix}</small>}
                  </p>
                  <p className={`text-[13px] ${p.hot ? "text-[#A9BFA9]" : "text-[#5B665C]"}`}>{p.per}</p>
                  <ul className="my-6 flex flex-col gap-2.5 text-sm">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex gap-2">
                        <span className={`font-bold ${p.hot ? "text-[#2CA01C]" : "text-[#007A33]"}`}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/pricing"
                    className={`inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold whitespace-nowrap mt-auto w-full ${p.hot ? "bg-[#2CA01C] text-[#0B1F16]" : p.name === "Free" ? "bg-[#0B1F16] text-white" : "border border-[#C9D2BC] text-[#0B1F16]"}`}
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
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-[#0B1F16] mt-5">Questions, <span className="text-[#2CA01C]">answered.</span></h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-[24px] border border-[#E3EDE0] bg-[#F7FAF5] p-6">
                  <h3 className="text-[15px] font-bold text-[#0B1F16] leading-snug">{f.q}</h3>
                  <p className="text-sm text-[#5B665C] leading-relaxed mt-2">{f.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[24px] bg-[#0B1F16] px-7 py-7 sm:px-9 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-white font-display font-bold text-lg">Still have questions?</p>
                <p className="text-[#A9BFA9] text-sm mt-0.5">Send us a message and we&apos;ll help you out.</p>
              </div>
              <a href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#2CA01C] px-6 py-3 text-sm font-bold text-white whitespace-nowrap">
                Contact us <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* ─── CTA BAND ───────────────────────────────────── */}
        <section className="py-24 bg-white pt-0">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-[32px] px-6 py-16 sm:px-10 sm:py-[72px] text-center text-white" style={{ background: "linear-gradient(180deg, #0E3D15, #007A33)" }}>
              <div aria-hidden className="absolute left-1/2 bottom-[-260px] -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,.4), transparent 75%)" }} />
              <h2 className="relative font-display text-4xl sm:text-[52px] font-bold leading-[1.08]">Stop typing statements.<br />Start converting.</h2>
              <p className="relative text-[#B9D6B2] mt-4 max-w-[520px] mx-auto">Your first 8 pages are free. Upload a PDF and see a clean spreadsheet in under 15 seconds.</p>
              <div className="relative flex flex-wrap justify-center gap-3 mt-8">
                <a href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#0B1F16] whitespace-nowrap">
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
