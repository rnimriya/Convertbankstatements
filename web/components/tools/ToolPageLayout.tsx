import type { ReactNode } from "react";
import Link from "next/link";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { PricingCards } from "@/components/PricingCards";
import {
  CheckCircle2, ArrowRight,
  Zap, Shield, Lock,
} from "lucide-react";

export interface ToolFaq {
  q: string;
  a: string;
}

const FREE_TOOLS = [
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

const TRUST_PILLS = [
  { icon: <Zap size={13} className="text-[#007A33]" />, label: "Free to use" },
  { icon: <Shield size={13} className="text-[#007A33]" />, label: "Scan free, QBO downloads on Pro" },
  { icon: <Lock size={13} className="text-[#007A33]" />, label: "Files never stored" },
];

const STEP_IMGS = [
  "/steps/step-upload.webp",
  "/steps/step-format.webp",
  "/steps/step-download.webp",
  "/steps/step-finish.webp",
];

/**
 * Shared layout for the free QuickBooks tools — same look & feel as the
 * homepage: dark-green hero with centered H1, overlapping card,
 * "How it works" section, FAQ accordion, dark final CTA. No animations.
 */
export async function ToolPageLayout({
  eyebrow,
  title,
  subtitle,
  tool,
  content,
  faqs,
  howToName,
  howToSteps,
  currentPath,
  privacyLine,
  fullyFree,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  tool: ReactNode;
  content: ReactNode;
  faqs: ToolFaq[];
  howToName: string;
  howToSteps: { title: string; body: string }[];
  currentPath: string;
  privacyLine: string;
  fullyFree?: boolean;
}) {
  const nonce = BUILD_NONCE;
  const pills = fullyFree
    ? TRUST_PILLS.map((p) =>
        p.label.startsWith("Scan free")
          ? { ...p, label: "Downloads free — no account needed" }
          : p
      )
    : TRUST_PILLS;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howToName,
    step: howToSteps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };

  const stepGrid =
    howToSteps.length === 4
      ? "grid md:grid-cols-2 lg:grid-cols-4"
      : "grid md:grid-cols-3";

  return (
    <div className="agri-sans">
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Navbar dark />
      <main className="overflow-x-hidden">

        {/* ─── HERO — homepage twin ─────────────────────────────── */}
        <section className="w-full relative overflow-hidden bg-[#0B1F16]">
          <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,0.38), rgba(19,84,28,0.28) 55%, transparent 75%)" }} />

          {/* Elegant Graph Paper Grid with a top-down radial mask fade */}

          {/* Content container — same width as /blog (max-w-6xl) */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-10 pb-28">

            {/* ── Headline block — centered ── */}
            <div className="text-center mb-6 max-w-4xl mx-auto">
              <span className="agri-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#B9D6B2] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                {eyebrow}
              </span>
              <h1
                className="font-extrabold text-white tracking-tight leading-[1.07] mb-4"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                {title.split(/(QBO)/g).map((part, i) =>
                  part === "QBO" ? <span key={i} className="text-[#2CA01C]">QBO</span> : part
                )}
              </h1>
              <p className="text-[0.95rem] text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>
        </section>
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 -mt-20">
          <div className="w-full">
              {tool}

              {/* Security note */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <CheckCircle2 size={14} className="shrink-0 text-[#007A33]" />
                <p className="text-[12.5px] text-zinc-500">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Bank-grade security</span>
                  {" "}— {privacyLine}
                </p>
              </div>
            </div>

          </div>
        <div className="w-full max-w-6xl mx-auto px-6 mt-6">
          <div className="pt-6 border-t border-zinc-200">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {pills.map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-[12.5px] text-zinc-500">
                    <span className="text-zinc-400">{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
          </div>
        </div>

        {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="agri-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#007A33] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                How it works
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-text mb-3">{howToName}</h2>
            </div>

            <div className={`${stepGrid} divide-y md:divide-y-0 md:divide-x divide-[#CBE3C4] border border-[#CBE3C4] rounded-[24px] overflow-hidden`}>
              {howToSteps.map((s, i) => {
                const stepImg = STEP_IMGS[i % STEP_IMGS.length];
                return (
                  <div
                    key={i}
                    className="relative flex flex-col p-8 bg-white"
                  >
                    <div className="absolute top-6 right-6 text-4xl font-black select-none text-zinc-100">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <img src={stepImg} alt="" className="relative w-[76px] h-[76px] object-contain bg-white rounded-lg mb-5" />
                    <h3 className="relative text-[0.95rem] font-bold text-zinc-900 dark:text-zinc-100 mb-2">{s.title}</h3>
                    <p className="relative text-sm text-brand-muted leading-relaxed">{s.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── TOOL CONTENT — same words, homepage section rhythm ─ */}
        <section className="py-24 bg-[#F2F4EC] border-t border-[#CBE3C4]">
          <div className="max-w-6xl mx-auto px-6">
            {content}
          </div>
        </section>

        {/* ─── MORE FREE TOOLS ──────────────────────────────────── */}
        <section className="py-16 bg-white border-t border-[#CBE3C4]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-8">
              <span className="agri-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#007A33] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                Free tools
              </span>
              <h2 className="text-3xl font-bold text-brand-text">More free QuickBooks tools</h2>
              <p className="text-brand-muted text-sm mt-2">9 more free tools — pick one, scan free, no account needed.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FREE_TOOLS.filter((t) => t.href !== currentPath).map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="flex items-center gap-4 rounded-[20px] border border-[#CBE3C4] bg-white p-4"
                >
                  <img
                    src={t.img}
                    alt=""
                    width={76}
                    height={76}
                    loading="lazy"
                    className="h-[76px] w-[76px] shrink-0 rounded-[20px] bg-white object-contain"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-zinc-900">
                      {t.label}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-brand-muted">
                      Free to scan — files are processed in memory and never stored. QBO downloads are on Pro.
                    </span>
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E3F2DF] border border-[#CBE3C4] text-[#007A33]">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING — homepage pattern ─────────────────────────── */}
        <section id="pricing" className="py-24 bg-[#E3F2DF] border-t border-[#CBE3C4]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="agri-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#007A33] mb-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />Pricing</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-text mb-3">Simple, transparent pricing</h2>
              <p className="text-brand-muted text-sm">Start free. Only pay when you need more.</p>
            </div>
            <PricingCards />
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section id="faq" className="py-24 bg-white border-t border-[#CBE3C4]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="agri-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#007A33] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                FAQ
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">Frequently asked questions</h2>
            </div>
            <FAQAccordion items={faqs} />
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────── */}
        <section className="py-28 relative overflow-hidden bg-gradient-to-b from-[#0E3D15] to-[#007A33]">

          {/* Elegant Graph Paper Grid with a bottom-up radial mask fade */}

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-[1.05]">
              Bringing statements into QuickBooks?
            </h2>
            <p className="mb-10 max-w-md mx-auto text-sm leading-relaxed text-zinc-400">
              Convert any PDF bank statement into a balance-checked QBO or CSV file in minutes.
              The first 8 pages are on us.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/quickbooks"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-bold bg-white text-zinc-900"
              >
                <span>See the QuickBooks converter</span>
                <ArrowRight size={15} className="text-[#007A33]" />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
