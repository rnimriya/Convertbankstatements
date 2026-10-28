"use client";

import { ArrowRight, CheckCircle2, Star } from"lucide-react";
import type { BillingContext } from"@/types/billing";
import { UploadCard } from"@/components/upload/UploadCard";

interface Props {
  billing: BillingContext;
  onBillingUpdate: () => void;
  userEmail?: string;
  hasSheetsAccess?: boolean;
}

export function HeroSection({ billing, onBillingUpdate, userEmail, hasSheetsAccess }: Props) {
  return (
    <section className="w-full relative overflow-hidden" style={{ background:"linear-gradient(180deg,#ffffff 0%,#f0ffee 130%)" }}>
      {/* soft green glow, top right */}
      <div aria-hidden className="absolute -right-44 -top-28 w-[520px] h-[520px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle,#dcf2dc 0%,transparent 70%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center py-16 lg:py-20">
        {/* ── Copy — left ── */}
        <div>
          <span className="inline-block text-pine-600 text-[11px] font-bold uppercase tracking-[0.18em] mb-5">For accountants, bookkeepers &amp; finance teams</span>
          <h1
            className="font-bold text-zinc-900 tracking-tight leading-[1.07] mb-4"
            style={{ fontSize:"clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            Free Bank Statement <span className="text-pine-400">Converter</span>
          </h1>
          <p className="text-[0.95rem] text-brand-muted max-w-xl leading-relaxed">
            Upload any Wells Fargo, Citibank, U.S. Bank, Cadence Bank, or Kotak statement — get CSV, Excel, OFX for Tally, or Google Sheets in under 15 seconds. No manual typing.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <a href="#upload" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] text-sm font-bold text-[#072b18] bg-pine-400 hover:bg-pine-300 transition-colors whitespace-nowrap">
              Convert free — 8 pages <ArrowRight size={15} />
            </a>
            <a href="#how-it-works" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] text-sm font-semibold text-zinc-900 border-[1.5px] border-zinc-300 bg-white hover:bg-zinc-50 transition-colors whitespace-nowrap">
              See how it works
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-7 text-[13px] font-semibold text-zinc-600">
            <span className="flex items-center gap-1.5">
              <span className="flex gap-0.5">
                {[0,1,2,3,4].map(i => <Star key={i} size={12} className="fill-honey-400 text-honey-400" />)}
              </span>
              10,000+ finance professionals
            </span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-pine-600" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-pine-600" /> Files never stored</span>
          </div>
        </div>

        {/* ── Converter card — right ── */}
        <div id="upload" className="scroll-mt-24">
          <UploadCard billing={billing} onBillingUpdate={onBillingUpdate} userEmail={userEmail} hasSheetsAccess={hasSheetsAccess} fullWidth={true} />

          {/* Security note */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <CheckCircle2 size={14} className="shrink-0 text-pine-500" />
            <p className="text-[12.5px] text-zinc-500">
              <span className="font-semibold text-zinc-700">Bank-grade security</span>
              {""}— Files processed securely and deleted immediately
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
