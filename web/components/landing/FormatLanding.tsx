import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingConverter } from "./LandingConverter";

export interface LandingFaq {
  q: string;
  a: string;
}

export interface LandingStep {
  title: string;
  body: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  desc: string;
}

const STEP_IMGS = [
  "/steps/step-upload.webp",
  "/steps/step-format.webp",
  "/steps/step-download.webp",
];

const BANKS = [
  { href: "/banks/jpmorgan-chase", name: "JPMorgan Chase", note: "Convert Chase statement PDFs" },
  { href: "/banks/bank-of-america", name: "Bank of America", note: "Convert Bank of America statement PDFs" },
  { href: "/banks/wells-fargo", name: "Wells Fargo", note: "Convert Wells Fargo statement PDFs" },
];

const PLANS = [
  { name: "Free", price: "$0", per: "", caption: "forever", features: ["8 pages free", "Excel & CSV export"] },
  { name: "Basic", price: "$5", per: " /mo", caption: "for occasional converts", features: ["25 pages / month", "Excel & CSV export"] },
  { name: "Pro", price: "$20", per: " /mo", caption: "for firms & bookkeepers", features: ["500 pages / month", "All export formats, incl. QBO / QFX / OFX"] },
  { name: "Business", price: "$75", per: " /mo", caption: "for high-volume teams", features: ["2,000 pages / month", "All export formats, incl. QBO / QFX / OFX"] },
];

/**
 * Shared shell for the format landing pages (/bank-statement-to-excel,
 * /bank-statement-to-csv, /pdf-to-qbo) — light-V3 standard from
 * ToolPageLayout: pale-green hero at pt-[124px], max-w-6xl, the working
 * converter above the fold, 3-step HowTo, pricing strip, static FAQ cards,
 * and FAQPage + HowTo + SoftwareApplication schema with the build nonce.
 * No animations anywhere.
 */
export function FormatLanding({
  eyebrow,
  title,
  subtitle,
  pageUrl,
  softwareDescription,
  howToName,
  steps,
  faqs,
  showBanks = false,
  related,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  pageUrl: string;
  softwareDescription: string;
  howToName: string;
  steps: LandingStep[];
  faqs: LandingFaq[];
  showBanks?: boolean;
  related: RelatedLink[];
  children: ReactNode;
}) {
  const nonce = BUILD_NONCE;

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
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Convert Statement",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: pageUrl,
    description: softwareDescription,
    offers: [
      { "@type": "Offer", name: "Free tier", price: "0", priceCurrency: "USD" },
      { "@type": "Offer", name: "Basic", price: "5", priceCurrency: "USD" },
      { "@type": "Offer", name: "Pro", price: "20", priceCurrency: "USD" },
      { "@type": "Offer", name: "Business", price: "75", priceCurrency: "USD" },
    ],
  };

  return (
    <div className="agri-sans">
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <Navbar />
      <main className="overflow-x-hidden">

        {/* ─── HERO — pale green, converter above the fold ─────── */}
        <section className="w-full relative overflow-hidden" style={{ background: "linear-gradient(180deg, #E9F5E4 0%, #F4FAF1 60%, #FFFFFF 100%)" }}>
          <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(44,160,28,0.18), transparent 72%)" }} />
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-[124px] pb-24">
            <div className="text-center mb-6 max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#D8E8D2] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                {eyebrow}
              </span>
              <h1 className="font-display font-bold text-[#0B1F16] tracking-tight leading-[1.08] mb-4" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)" }}>
                {title}
              </h1>
              <p className="text-[0.95rem] text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            </div>

            <LandingConverter />

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-7 text-[13px] font-semibold text-zinc-600">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#007A33]" /> Files processed in memory</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#007A33]" /> Never stored</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#007A33]" /> First 8 pages free — no account needed</span>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E3F2DF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                How it works
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F16]">{howToName}</h2>
            </div>
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E3EDE0] border border-[#E3EDE0] rounded-[24px] overflow-hidden">
              {steps.map((s, i) => (
                <div key={s.title} className="relative flex flex-col p-8 bg-white">
                  <div className="absolute top-6 right-6 text-4xl font-black select-none text-[#E9F5E4]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <img src={STEP_IMGS[i % STEP_IMGS.length]} alt="" className="relative w-[76px] h-[76px] object-contain bg-white rounded-lg mb-5" />
                  <h3 className="relative text-[0.95rem] font-bold text-zinc-900 mb-2">{s.title}</h3>
                  <p className="relative text-sm text-[#5B665C] leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PAGE CONTENT ────────────────────────────────────── */}
        <section className="py-24 bg-[#F7FAF5] border-t border-[#E3EDE0]">
          <div className="max-w-6xl mx-auto px-6">
            {children}
          </div>
        </section>

        {/* ─── SUPPORTED BANKS ─────────────────────────────────── */}
        {showBanks && (
          <section className="py-16 bg-white border-t border-[#E3EDE0]">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#E3F2DF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                  Supported banks
                </span>
                <h2 className="font-display text-3xl font-bold text-[#0B1F16]">Statements from major banks</h2>
                <p className="text-[#5B665C] text-sm mt-2">The converter works with statements from hundreds of banks. Start with yours:</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {BANKS.map((b) => (
                  <Link key={b.href} href={b.href} className="flex items-center gap-4 rounded-[20px] border border-[#E3EDE0] bg-white p-5">
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-bold text-zinc-900">{b.name}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-[#5B665C]">{b.note}</span>
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E3F2DF] border border-[#E3EDE0] text-[#007A33]">
                      <ArrowRight size={18} />
                    </span>
                  </Link>
                ))}
              </div>
              <p className="text-center text-sm text-[#5B665C] mt-6">
                Don&rsquo;t see your bank listed here? The converter above accepts statement PDFs from hundreds of banks — upload yours and check the preview before you download.
              </p>
            </div>
          </section>
        )}

        {/* ─── RELATED CONVERTERS ──────────────────────────────── */}
        <section className="py-16 bg-white border-t border-[#E3EDE0]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E3F2DF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                Related converters
              </span>
              <h2 className="font-display text-3xl font-bold text-[#0B1F16]">Need a different format?</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.href} href={r.href} className="flex items-center gap-4 rounded-[20px] border border-[#E3EDE0] bg-white p-5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-zinc-900">{r.label}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-[#5B665C]">{r.desc}</span>
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E3F2DF] border border-[#E3EDE0] text-[#007A33]">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING STRIP ───────────────────────────────────── */}
        <section id="pricing" className="py-24 bg-[#EFF7ED] border-t border-[#E3EDE0]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E3F2DF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                Pricing
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F16] mb-3">Simple, transparent pricing</h2>
              <p className="text-[#5B665C] text-sm">Start free — your first 8 pages are free on every account. Only pay when you need more.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {PLANS.map((p) => (
                <div key={p.name} className="rounded-[24px] p-7 border border-[#D8E8D2] bg-white flex flex-col">
                  <p className="text-[15px] font-bold text-[#0B1F16]">{p.name}</p>
                  <p className="text-[44px] font-extrabold leading-none tracking-tight mt-4 mb-1 text-[#0B1F16]">
                    {p.price}
                    {p.per && <small className="text-base font-medium text-[#5B665C]">{p.per}</small>}
                  </p>
                  <p className="text-[13px] text-[#5B665C]">{p.caption}</p>
                  <ul className="my-5 flex flex-col gap-2.5 text-sm text-zinc-700">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex gap-2">
                        <span className="font-bold text-[#007A33]">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/pricing" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold whitespace-nowrap mt-auto w-full border border-[#D8E8D2] text-[#0B1F16]">
                    See the {p.name} plan
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-[#5B665C] mt-8">
              Full plan details, annual pricing and what each format needs: <Link href="/pricing" className="font-semibold text-[#007A33] hover:underline">see pricing</Link>
            </p>
          </div>
        </section>

        {/* ─── FAQ ─────────────────────────────────────────────── */}
        <section id="faq" className="py-24 bg-white border-t border-[#E3EDE0]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E3F2DF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
                FAQ
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F16]">Frequently asked questions</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-[24px] border border-[#E3EDE0] bg-[#F7FAF5] p-6">
                  <h3 className="text-[15px] font-bold text-[#0B1F16] leading-snug">{f.q}</h3>
                  <p className="text-sm text-[#5B665C] leading-relaxed mt-2">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ───────────────────────────────────────── */}
        <section className="py-24 bg-white pt-0">
          <div className="max-w-6xl mx-auto px-6">
            <div className="rounded-[32px] px-6 py-16 sm:px-10 text-center bg-[#0B1F16]">
              <h2 className="font-display text-4xl sm:text-[44px] font-bold leading-[1.08] text-white">Convert your statement now</h2>
              <p className="text-[#A9BFA9] mt-4 max-w-[520px] mx-auto">Your first 8 pages are free and no account is needed. Upload a PDF statement above and download a clean file.</p>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <a href="#converter" className="inline-flex items-center gap-2 rounded-full bg-[#2CA01C] px-6 py-3.5 text-sm font-bold text-white whitespace-nowrap">
                  Convert free <ArrowRight size={15} />
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

/* Shared content typography — same classes as the csv-to-qbo tool page. */
export const H2 = "text-2xl font-extrabold text-zinc-900";
export const H2M = "text-2xl font-extrabold text-zinc-900 mt-12";
export const H3 = "text-lg font-bold text-zinc-900 mt-8";
export const P = "mt-3 text-zinc-600 leading-relaxed";
export const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
export const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 align-top";
export const INLINE_LINK = "font-semibold text-[#007A33] hover:underline";
