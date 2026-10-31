"use client";

import type { BillingContext } from "@/types/billing";
import { UploadCard } from "@/components/upload/UploadCard";

interface Props {
  billing: BillingContext;
  onBillingUpdate: () => void;
  userEmail?: string;
  hasSheetsAccess?: boolean;
}

export function HeroSection({ billing, onBillingUpdate, userEmail, hasSheetsAccess }: Props) {
  return (
    <section className="w-full relative overflow-hidden agri-sans" style={{ background: "linear-gradient(180deg, #E9F5E4 0%, #F4FAF1 55%, #FFFFFF 100%)" }}>
      {/* Soft green glow (static, no animation) */}
      <div aria-hidden className="absolute left-1/2 top-[-460px] -translate-x-1/2 w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(44,160,28,.20), transparent 72%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-12 pb-14">
        <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#D8E8D2] px-4 py-1.5 text-[12.5px] font-semibold text-[#007A33] shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C]" />
          First 8 pages free — no account needed
        </span>

        <h1
          className="font-display font-bold text-[#0B1F16] tracking-tight leading-[1.05] mt-6 mb-4"
          style={{ fontSize: "clamp(2.5rem, 5.6vw, 4.1rem)" }}
        >
          Bank statements <span className="text-[#2CA01C]">converter</span>
        </h1>
        <p className="text-zinc-600 text-lg max-w-xl mx-auto leading-relaxed">
          Convert PDF bank statements to Excel, CSV, QBO, OFX and Google Sheets in under 15 seconds.
        </p>

        {/* ── Converter card — real UploadCard, internals untouched ── */}
        <div id="upload" className="scroll-mt-24 max-w-[880px] mx-auto mt-9 text-left rounded-[28px] shadow-[0_24px_60px_rgba(11,31,22,0.13)]">
          <UploadCard billing={billing} onBillingUpdate={onBillingUpdate} userEmail={userEmail} hasSheetsAccess={hasSheetsAccess} fullWidth={true} />

          {/* Security note */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <p className="text-[12.5px] text-zinc-500">
              <span className="font-semibold text-zinc-700">Bank-grade security</span>
              {" "}— Files processed securely and deleted immediately
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-7 text-[13px] font-semibold text-zinc-600">
          <span><span className="text-[#007A33] font-bold">✓</span> Files processed in memory</span>
          <span><span className="text-[#007A33] font-bold">✓</span> Never stored</span>
          <span><span className="text-[#007A33] font-bold">✓</span> 400+ banks covered</span>
        </div>

        <p className="mt-8 text-[13px] font-medium text-zinc-400 tracking-wide">
          Chase · Wells Fargo · Bank of America · Citi · Capital One · U.S. Bank · Truist · HSBC · Barclays · Santander · BMO · Kotak
        </p>
      </div>
    </section>
  );
}
