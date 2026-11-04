import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight, CheckCircle2, Download, FileText, Lock,
  Settings2, Shield, Upload, Zap,
} from "lucide-react";
import { SamplePreview } from "@/components/banks/SamplePreview";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { BankConverter } from "@/components/banks/BankConverter";
import { TOP_20_BANKS, type TopBank } from "@/lib/seo/banks-top20";

/**
 * Light-V3 landing template for the top-20 bank pages — same standard as
 * ToolPageLayout: light Navbar, pale-green hero (pt-[124px], max-w-6xl),
 * the working homepage converter overlapping the hero, then content
 * sections. No animations, QuickBooks-green palette only.
 */

const FORMATS = [
  { label: "Excel", sub: ".xlsx spreadsheet", note: "Included on every plan" },
  { label: "CSV", sub: "Universal plain-text rows", note: "Included on every plan" },
  { label: "OFX", sub: "For OFX-ready accounting tools", note: "Pro plan and above" },
  { label: "QBO", sub: "QuickBooks Web Connect", note: "Pro plan and above" },
  { label: "Google Sheets", sub: "Export straight to Sheets", note: "Pro plan and above" },
];

const TRUST_PILLS = [
  { icon: <Zap size={13} className="text-[#007A33]" />, label: "First 8 pages free" },
  { icon: <Shield size={13} className="text-[#007A33]" />, label: "Files processed in memory" },
  { icon: <Lock size={13} className="text-[#007A33]" />, label: "Never stored — deleted after conversion" },
];

export async function BankLanding({ bank, bankName }: { bank: TopBank; bankName: string }) {
  const nonce = BUILD_NONCE;
  const pageUrl = `https://www.convertstatement.online/banks/${bank.slug}`;

  const convertSteps = [
    {
      icon: <Upload size={22} className="text-[#007A33]" />,
      title: `Upload your ${bankName} PDF`,
      body: `Drop the statement PDF into the converter above — password-protected files work too; just enter the PDF password at upload.`,
    },
    {
      icon: <Settings2 size={22} className="text-[#007A33]" />,
      title: "Choose your format",
      body: "Pick Excel, CSV, OFX or QBO for QuickBooks, or Google Sheets — one format or several, with a separate download for each.",
    },
    {
      icon: <Download size={22} className="text-[#007A33]" />,
      title: "Download your file",
      body: "Your converted file is ready in seconds — clean columns, correct dates, and the running balance checked as part of the conversion.",
    },
  ];

  const howToSteps = [
    ...bank.downloadSteps.map((s) => ({ name: s, text: s })),
    ...convertSteps.map((s) => ({ name: s.title, text: s.body })),
  ];

  const relatedBanks = bank.related
    .map((slug) => TOP_20_BANKS.find((b) => b.slug === slug))
    .filter((b): b is TopBank => Boolean(b));

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `ConvertStatement for ${bankName}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "WebBrowser",
    url: pageUrl,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: `Convert ${bankName} PDF bank statements to Excel, CSV, OFX, QBO or Google Sheets. First 8 pages free.`,
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to download and convert a ${bankName} bank statement`,
    description: `Download your ${bankName} statement PDF, then convert it to Excel, CSV, OFX, QBO or Google Sheets with ConvertStatement.`,
    step: howToSteps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: bank.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="agri-sans min-h-screen bg-white flex flex-col text-zinc-900 antialiased">
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
      <Navbar />
      <main className="flex-1 overflow-x-hidden">

        {/* ─── HERO — pale green, ToolPageLayout standard ─── */}
        <section className="w-full relative overflow-hidden" style={{ background: "linear-gradient(180deg, #E9F5E4 0%, #F4FAF1 60%, #FFFFFF 100%)" }}>
          <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(44,160,28,0.18), transparent 72%)" }} />
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-[124px] pb-24">
            <div className="text-center mb-6 max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#D8E8D2] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                Bank converter
              </span>
              <h1
                className="font-display font-bold text-[#0B1F16] tracking-tight leading-[1.08] mb-4"
                style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)" }}
              >
                Convert {bankName} Statements to Excel, CSV &amp; <span className="text-[#2CA01C]">QBO</span>
              </h1>
              <p className="text-[0.95rem] text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                Upload your {bankName} PDF statement and convert it to Excel, CSV, OFX, QBO for
                QuickBooks, or Google Sheets. First 8 pages free — no account needed.
              </p>
            </div>
          </div>
        </section>

        {/* ─── CONVERTER — working UploadCard, overlapping the hero ─── */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 -mt-20">
          <div id="convert" className="scroll-mt-24 max-w-[845px] mx-auto text-left">
            <BankConverter />
            <div className="mt-4 flex items-center justify-center gap-2">
              <CheckCircle2 size={14} className="shrink-0 text-[#007A33]" />
              <p className="text-[12.5px] text-zinc-500">
                <span className="font-semibold text-zinc-700">Bank-grade security</span>
                {" "}— files are processed in memory and deleted immediately after conversion
              </p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-6xl mx-auto px-6 mt-6">
          <div className="pt-6 border-t border-zinc-200">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {TRUST_PILLS.map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[12.5px] text-zinc-500">
                  {icon}
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── HOW TO DOWNLOAD YOUR STATEMENT ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E3F2DF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                Step one — get the PDF
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F16] tracking-tight">
                How to download your {bankName} statement
              </h2>
              <p className="text-[#5B665C] leading-relaxed mt-4">{bank.about}</p>
            </div>
            <ol className="grid md:grid-cols-2 gap-4 mt-10">
              {bank.downloadSteps.map((step, i) => (
                <li key={i} className="flex gap-4 rounded-[20px] border border-[#D8E8D2] bg-[#EFF7ED] p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2CA01C] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-[#33502F] pt-1.5">{step}</p>
                </li>
              ))}
            </ol>
            <p className="text-sm text-[#5B665C] leading-relaxed mt-6 max-w-3xl">
              Menu names can differ slightly between the {bankName} website, the mobile app and
              account types — look for the statements or documents area of your account, choose the
              month, and save the file as a PDF. Then bring it back here.
            </p>
          </div>
        </section>

        {/* ─── HOW CONVERTING WORKS ─── */}
        <section className="py-24 bg-[#F7FAF5] border-t border-[#E3EDE0]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E3F2DF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                Step two — convert it
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F16] tracking-tight">How converting works</h2>
              <p className="text-[#5B665C] mt-3">From PDF to spreadsheet in three steps.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {convertSteps.map((s, i) => (
                <div key={i} className="bg-white p-8 rounded-[24px] border border-[#D8E8D2]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#EFF7ED] border border-[#D8E8D2] flex items-center justify-center">
                      {s.icon}
                    </div>
                    <span className="text-sm font-bold text-[#5B665C]">Step {i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1F16] mb-2">{s.title}</h3>
                  <p className="text-[#5B665C] text-sm leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SAMPLE PREVIEW ─── */}
        <SamplePreview bankName={bankName} />

        {/* ─── FORMATS ─── */}
        <section className="py-24 bg-white border-t border-[#E3EDE0]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E3F2DF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                Export formats
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F16] tracking-tight">
                One {bankName} PDF, five ways out
              </h2>
              <p className="text-[#5B665C] mt-3 max-w-2xl mx-auto leading-relaxed">{bank.formatsNote}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {FORMATS.map((f) => (
                <div key={f.label} className="rounded-[20px] border border-[#D8E8D2] bg-[#EFF7ED] p-5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#D8E8D2] flex items-center justify-center mb-4">
                    <FileText size={18} className="text-[#007A33]" />
                  </div>
                  <h3 className="font-bold text-[#0B1F16]">{f.label}</h3>
                  <p className="text-[13px] text-[#5B665C] mt-1 leading-snug">{f.sub}</p>
                  <p className="text-[12px] font-semibold text-[#007A33] mt-3">{f.note}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#5B665C] leading-relaxed mt-8 max-w-3xl mx-auto text-center">
              Working from a CSV export instead of a PDF? The{" "}
              <Link href="/tools/csv-to-qbo" className="font-semibold text-[#007A33] hover:underline">
                CSV to QBO converter
              </Link>{" "}
              turns bank CSV files into QuickBooks-ready QBO files — and the{" "}
              <Link href="/tools" className="font-semibold text-[#007A33] hover:underline">
                full tools list
              </Link>{" "}
              covers QBO checks, fixes and payout converters, all free to scan.
            </p>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-24 bg-[#F7FAF5] border-t border-[#E3EDE0]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E3F2DF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                FAQ
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F16] tracking-tight">
                {bankName} conversion FAQs
              </h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <FAQAccordion items={bank.faqs} />
            </div>
          </div>
        </section>

        {/* ─── RELATED BANKS ─── */}
        <section className="py-20 bg-white border-t border-[#E3EDE0]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0B1F16]">Convert statements from other banks</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedBanks.map((b) => (
                <Link
                  key={b.slug}
                  href={`/banks/${b.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#D8E8D2] text-sm font-medium text-[#0B1F16] hover:border-[#007A33]"
                >
                  <CheckCircle2 size={15} className="text-[#007A33]" />
                  {b.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link
                href="/tools/csv-to-qbo"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EFF7ED] border border-[#D8E8D2] text-sm font-semibold text-[#00573F]"
              >
                CSV to QBO Converter <ArrowRight size={14} />
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EFF7ED] border border-[#D8E8D2] text-sm font-semibold text-[#00573F]"
              >
                All free QuickBooks tools <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-24 bg-white pt-0">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-[32px] px-6 py-16 sm:px-10 sm:py-[72px] text-center text-white" style={{ background: "linear-gradient(180deg, #0E3D15, #007A33)" }}>
              <div aria-hidden className="absolute left-1/2 bottom-[-260px] -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,.4), transparent 75%)" }} />
              <h2 className="relative font-display text-4xl sm:text-[52px] font-bold leading-[1.08]">
                Stop typing {bankName} transactions manually
              </h2>
              <p className="relative text-[#B9D6B2] mt-4 max-w-[520px] mx-auto">
                Your first 8 pages are free. Upload a {bankName} PDF and download a clean,
                reconciliation-ready file.
              </p>
              <div className="relative flex flex-wrap justify-center gap-3 mt-8">
                <a href="#convert" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#0B1F16] whitespace-nowrap">
                  Convert free — 8 pages <ArrowRight size={15} />
                </a>
                <Link href="/pricing" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white whitespace-nowrap">
                  See pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
