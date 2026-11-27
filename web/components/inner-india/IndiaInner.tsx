import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * Shared inner-page shell for convertstatement.in — "Option A
 * (homepage-matched)" picked by the owner 2026-11-27. Mirrors the
 * homepage design language (home-legacy/LegacyHome + LegacyHero):
 * dark #052e22 heading band, eyebrow pattern, Manrope extrabold
 * headings, white 12px-radius cards, mint #ecfdf5 tiles, green
 * #047857, max-w-7xl rhythm, details/summary FAQ cards, sticky
 * mobile bottom bar, zero animations. Rendered only when
 * isIndiaSite(); .online keeps the existing templates untouched.
 */

export function IndiaEyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`text-[11px] font-bold uppercase tracking-[0.18em] mb-3.5 ${light ? "text-[#6ee7b7]" : "text-[#047857]"}`}>
      {children}
    </p>
  );
}

export function IndiaSecHead({
  eyebrow,
  title,
  body,
  center = false,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-[720px] mb-11 ${center ? "mx-auto text-center" : ""}`}>
      <IndiaEyebrow>{eyebrow}</IndiaEyebrow>
      <h2 className="font-display text-3xl sm:text-[38px] font-extrabold tracking-tight leading-[1.15] text-[#0f172a]">{title}</h2>
      {body && <p className="text-[17px] text-[#64748b] mt-3.5 leading-relaxed">{body}</p>}
    </div>
  );
}

export function IndiaIconTile({ children }: { children: ReactNode }) {
  return (
    <div className="w-[52px] h-[52px] rounded-[14px] bg-[#ecfdf5] border border-[#d1fae5] flex items-center justify-center mb-[18px]">
      {children}
    </div>
  );
}

/**
 * Dark green heading band (homepage-hero style) for inner pages:
 * optional breadcrumb, eyebrow, H1, subtitle, and an optional slot
 * below (usually the dropbox card). Accent spans inside `title`
 * written with the old #2CA01C class are remapped to #34d399 on
 * dark via the .india-dark-band rule in globals.css.
 */
export function IndiaHeadingBand({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="india-dark-band relative overflow-hidden bg-[#052e22] text-white">
      <div className="relative z-10 mx-auto max-w-[900px] px-4 pt-14 pb-16 text-center">
        {breadcrumb && <div className="mb-6 text-left">{breadcrumb}</div>}
        <IndiaEyebrow light>{eyebrow}</IndiaEyebrow>
        <h1 className="font-display font-extrabold tracking-[-0.02em] leading-[1.14] text-4xl sm:text-5xl text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#d1fae5] text-[17px] leading-relaxed max-w-[640px] mx-auto mt-4">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}

/** White card that holds the real dropbox inside the dark band. */
export function IndiaDropboxCard({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 min-w-0 max-w-full bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6 text-left shadow-[0_24px_50px_-24px_rgba(0,0,0,0.45)]">
      <div className="min-w-0 max-w-full overflow-x-auto">{children}</div>
    </div>
  );
}

/** Trust line under the dropbox (same facts as the old templates). */
export function IndiaTrustRow() {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-[13px] font-semibold text-[#d1fae5]">
      <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#34d399]" /> Files processed in memory</span>
      <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#34d399]" /> Never stored</span>
      <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#34d399]" /> First 8 pages free — no account needed</span>
    </div>
  );
}

/** Numbered step cards (homepage "1. Upload..." style). */
export function IndiaStepCards({ steps }: { steps: { title: string; body: string }[] }) {
  const cols = steps.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";
  return (
    <div className={`grid ${cols} gap-6`}>
      {steps.map((s, i) => (
        <div key={s.title} className="bg-white border border-[#e2e8f0] rounded-xl p-[30px]">
          <IndiaIconTile>
            <span className="text-[19px] font-extrabold text-[#047857]">{i + 1}</span>
          </IndiaIconTile>
          <h3 className="text-[19px] font-extrabold tracking-tight text-[#0f172a] mb-2">
            {i + 1}. {s.title}
          </h3>
          <p className="text-[15px] text-[#64748b] leading-relaxed">{s.body}</p>
        </div>
      ))}
    </div>
  );
}

/** FAQ as details/summary cards (homepage grouped-FAQ style). */
export function IndiaFaqCards({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3 text-left">
      {faqs.map((f) => (
        <details key={f.q} className="bg-white border border-[#e2e8f0] rounded-xl p-5">
          <summary className="font-bold text-[#0f172a] cursor-pointer">{f.q}</summary>
          <p className="text-sm text-[#64748b] leading-relaxed mt-2">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Related-tools / related-converters cards (homepage tools-grid style). */
export function IndiaLinkCards({
  items,
}: {
  items: { href: string; label: string; desc: string; img?: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((r) => (
        <Link
          key={r.href}
          href={r.href}
          className="flex flex-col rounded-xl border border-[#e2e8f0] bg-white p-5 hover:border-[#a7f3d0]"
        >
          {r.img && (
            <img src={r.img} alt="" width={52} height={52} loading="lazy" className="mb-3 h-[52px] w-[52px] rounded-[14px] bg-[#f8fafc] object-contain" />
          )}
          <span className="font-display text-[15.5px] font-bold text-[#0f172a]">{r.label}</span>
          <span className="mt-1 flex-1 text-[13px] leading-relaxed text-[#64748b]">{r.desc}</span>
          <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#047857]">
            Open tool <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}

/** Final dark CTA card (homepage style). */
export function IndiaFinalCta({
  title,
  body,
  href = "#converter",
  label = "Convert free",
  secondaryHref,
  secondaryLabel,
}: {
  title: ReactNode;
  body: string;
  href?: string;
  label?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="bg-[#0f172a] text-white text-center rounded-xl px-8 py-16">
      <h2 className="font-display text-3xl sm:text-[38px] font-extrabold tracking-tight">{title}</h2>
      <p className="text-[#cbd5e1] text-[17px] max-w-[560px] mx-auto mt-3.5 leading-relaxed">{body}</p>
      <div className="flex flex-wrap justify-center gap-3 mt-[30px]">
        <a
          href={href}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-[30px] py-4 text-[17px] font-bold text-[#0f172a] whitespace-nowrap"
        >
          {label} <ArrowRight size={17} />
        </a>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-[30px] py-4 text-[17px] font-bold text-white whitespace-nowrap"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

/** Sticky mobile bottom bar + spacer (same as homepage). */
export function IndiaStickyBar() {
  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-[#e2e8f0] shadow-[0_-4px_16px_rgba(0,0,0,0.12)] grid grid-cols-3 text-center text-[13px] font-bold">
        <a href="/tools" className="py-3.5 text-[#0f172a]">Tools</a>
        <a href="/pricing" className="py-3.5 text-[#0f172a]">Pricing</a>
        <a href="/#upload" className="py-3.5 bg-[#047857] text-white">Convert Free</a>
      </div>
      <div className="h-14 md:hidden" />
    </>
  );
}
