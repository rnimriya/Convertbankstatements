"use client";

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
    <section className="w-full relative overflow-hidden bg-[#071106] agri-sans">
      {/* Static lime glow (no animation) */}
      <div aria-hidden className="absolute left-1/2 top-[-420px] -translate-x-1/2 w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,.38), rgba(19,84,28,.28) 55%, transparent 75%)" }} />
      <div aria-hidden className="absolute left-0 right-0 bottom-0 h-[180px] pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, rgba(100,203,72,.14))" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-10 pb-12">
        <h1
          className="font-extrabold text-white tracking-tight leading-[1.04] mt-6 mb-4"
          style={{ fontSize:"clamp(2.25rem, 5vw, 3.25rem)" }}
        >
          Bank statements converter
        </h1>
        <p className="text-zinc-300 max-w-xl mx-auto leading-relaxed">
          Convert PDF bank statements to Excel, CSV, QBO, OFX and Google Sheets in under 15 seconds. First 8 pages free — no account needed.
        </p>

        {/* ── Converter card — real UploadCard, internals untouched ── */}
        <div id="upload" className="scroll-mt-24 max-w-[880px] mx-auto mt-8 text-left">
          <UploadCard billing={billing} onBillingUpdate={onBillingUpdate} userEmail={userEmail} hasSheetsAccess={hasSheetsAccess} fullWidth={true} />

          {/* Security note */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <p className="text-[12.5px] text-zinc-400">
              <span className="font-semibold text-zinc-300">Bank-grade security</span>
              {""}— Files processed securely and deleted immediately
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-[13px] font-semibold text-zinc-300">
          <span>✓ Files processed in memory</span>
          <span>✓ Never stored</span>
          <span>✓ 400+ banks covered</span>
        </div>
      </div>
    </section>
  );
}
