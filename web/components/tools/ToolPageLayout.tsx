import type { ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { PricingCards } from "@/components/PricingCards";
import {
  Wrench, CheckCircle2, Upload, FileCheck, Download, Sparkles, ArrowRight,
  Zap, Shield, Lock,
} from "lucide-react";

export interface ToolFaq {
  q: string;
  a: string;
}

const FREE_TOOLS = [
  { href: "/tools/free-qbo-cleanup-checker", label: "QBO Duplicate Finder" },
  { href: "/tools/free-stripe-to-quickbooks", label: "Stripe → QuickBooks Converter" },
  { href: "/tools/free-paypal-to-quickbooks", label: "PayPal → QuickBooks Converter" },
  { href: "/tools/free-receipt-to-quickbooks", label: "Receipt → QuickBooks Tool" },
  { href: "/tools/qbo-checker", label: "QBO File Checker" },
];

const TRUST_PILLS = [
  { icon: <Zap size={13} className="text-amber-500 dark:text-amber-400" />, label: "Free to use" },
  { icon: <Shield size={13} className="text-emerald-500 dark:text-emerald-400" />, label: "Free with account" },
  { icon: <Lock size={13} className="text-sky-500 dark:text-sky-400" />, label: "Files never stored" },
];

const STEP_ICONS = [
  { icon: <Upload size={20} />, color: "text-blue-500 dark:text-blue-400" },
  { icon: <FileCheck size={20} />, color: "text-emerald-500 dark:text-emerald-400" },
  { icon: <Download size={20} />, color: "text-amber-500 dark:text-amber-400" },
  { icon: <Sparkles size={20} />, color: "text-blue-500 dark:text-blue-400" },
];

/**
 * Shared layout for the free QuickBooks tools — same look & feel as the
 * homepage: blue-glow hero with graph paper, centered H1, upload card,
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
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

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
    <>
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Navbar />
      <main className="overflow-x-hidden">

        {/* ─── HERO — homepage twin ─────────────────────────────── */}
        <section className="w-full relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-20 dark:opacity-15 bg-blue-500 dark:bg-blue-600 rounded-full blur-[120px] pointer-events-none" />

          {/* Elegant Graph Paper Grid with a top-down radial mask fade */}
          <div
            className="absolute inset-0 pointer-events-none bg-graph-paper dark:bg-graph-paper-dark"
            style={{
              maskImage: "radial-gradient(ellipse 100% 100% at 50% 0%, black 50%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 0%, black 50%, transparent 100%)",
            }}
          />

          {/* Content container — same width as /blog (max-w-6xl) */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-10 pb-12">

            {/* ── Headline block — centered ── */}
            <div className="text-center mb-6 max-w-4xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-surface text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-widest mb-4">
                {eyebrow}
              </span>
              <h1
                className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.07] mb-4"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
              >
                {title}
              </h1>
              <p className="text-[0.95rem] text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* ── Tool card — full width of the page container ── */}
            <div className="w-full">
              {tool}

              {/* Security note */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-500 dark:text-emerald-400" />
                <p className="text-[12.5px] text-zinc-500">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Bank-grade security</span>
                  {" "}— {privacyLine}
                </p>
              </div>
            </div>

            {/* ── Trust pills bar — full width ── */}
            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {TRUST_PILLS.map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-[12.5px] text-zinc-500">
                    <span className="text-zinc-400">{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 bg-brand-bg">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-surface text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-widest mb-3">
                How it works
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-text mb-3">{howToName}</h2>
            </div>

            <div className={`${stepGrid} divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 border border-brand-border rounded-2xl overflow-hidden`}>
              {howToSteps.map((s, i) => {
                const stepIcon = STEP_ICONS[i % STEP_ICONS.length];
                return (
                  <div
                    key={i}
                    className="relative group flex flex-col p-8 bg-brand-bg hover:bg-brand-surface/80 transition-colors duration-300"
                  >
                    <div className="absolute top-6 right-6 text-4xl font-black select-none text-zinc-100">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-brand-surface text-zinc-900 dark:text-zinc-100 border border-brand-border">
                      <span className={stepIcon.color}>{stepIcon.icon}</span>
                    </div>
                    <h3 className="relative text-[0.95rem] font-bold text-zinc-900 dark:text-zinc-100 mb-2">{s.title}</h3>
                    <p className="relative text-sm text-brand-muted leading-relaxed">{s.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── TOOL CONTENT — same words, homepage section rhythm ─ */}
        <section className="py-24 bg-brand-surface border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-6">
            {content}
          </div>
        </section>

        {/* ─── MORE FREE TOOLS ──────────────────────────────────── */}
        <section className="py-24 bg-brand-bg border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-surface text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-widest mb-3">
                Free tools
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">More free QuickBooks tools</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-brand-border rounded-2xl overflow-hidden bg-brand-bg [&>*:nth-child(n)]:border-b [&>*:nth-child(n)]:border-r [&>*:nth-child(n)]:border-zinc-200 dark:[&>*:nth-child(n)]:border-zinc-800">
              {FREE_TOOLS.filter((t) => t.href !== currentPath).map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group relative flex flex-col overflow-hidden p-8 bg-brand-bg hover:bg-brand-surface/80 transition-colors duration-300"
                >
                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="w-12 h-12 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center mb-5">
                      <Wrench size={22} className="text-blue-500 dark:text-blue-400" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t.label}
                    </h3>
                    <p className="text-sm text-brand-muted leading-relaxed flex-1">
                      Free with a free account — files are processed in memory and never stored.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING — homepage pattern ─────────────────────────── */}
        <section id="pricing" className="py-24 bg-brand-surface border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-border text-brand-text text-[11px] font-bold uppercase tracking-widest mb-3">Pricing</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-text mb-3">Simple, transparent pricing</h2>
              <p className="text-brand-muted text-sm">Start free. Only pay when you need more.</p>
            </div>
            <PricingCards />
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section id="faq" className="py-24 bg-brand-bg border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-surface text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-widest mb-3">
                FAQ
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-text">Frequently asked questions</h2>
            </div>
            <FAQAccordion items={faqs} />
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
              maskImage: "radial-gradient(ellipse 100% 100% at 50% 100%, black 50%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 100%, black 50%, transparent 100%)",
            }}
          />

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
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-bold transition-colors bg-white text-zinc-900 hover:bg-zinc-200"
              >
                <span>See the QuickBooks converter</span>
                <ArrowRight size={15} className="text-amber-500" />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
