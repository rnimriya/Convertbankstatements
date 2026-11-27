"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, ArrowRight } from "lucide-react";
import { UploadCard } from "@/components/upload/UploadCard";
import type { BillingContext } from "@/types/billing";

const GUEST_BILLING: BillingContext = {
  tier: "FREE",
  pagesUsedThisPeriod: 0,
  monthlyPageLimit: 8,
  razorpayCustomerId: null,
};

/**
 * LegacyBridge-pattern hero for convertstatement.in (owner order
 * 2026-11-27). Layout pattern only — ConvertStatement's own copy and
 * the real, working UploadCard. Rendered only when isIndiaSite().
 */
export function LegacyHero() {
  const [billing, setBilling] = useState<BillingContext>(GUEST_BILLING);
  const [hasSheetsAccess] = useState(false);
  const [userEmail] = useState<string | undefined>();

  const fetchBilling = useCallback(async () => {
    try {
      const res = await fetch("/api/billing-context", { credentials: "include" });
      if (!res.ok) return; // not logged in — keep guest defaults
      const data: BillingContext = await res.json();
      setBilling(data);
    } catch { /* non-fatal */ }
  }, []);

  useEffect(() => { fetchBilling(); }, [fetchBilling]);

  return (
    <section className="bg-[#FAFAFC]">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-16 lg:pt-20 lg:pb-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-12 lg:gap-14 items-center">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ecfdf5] border border-[#d1fae5] px-3.5 py-1.5 text-[12.5px] font-bold uppercase tracking-[0.06em] text-[#047857]">
            Bank statement conversion for Indian businesses
          </span>
          <h1 className="font-display font-extrabold text-[#0f172a] tracking-tight leading-[1.12] mt-6 mb-5" style={{ fontSize: "clamp(2rem, 4.2vw, 3.25rem)" }}>
            Stop typing bank statements into <span className="text-[#047857]">Excel</span>.
          </h1>
          <p className="text-[#334155] text-lg leading-relaxed max-w-[540px]">
            ConvertStatement reads your bank statement PDF, checks the balance on every conversion, and gives you clean Excel, CSV or Tally files — you review the rows before you download.
          </p>
          <p className="text-[#64748b] text-base mt-3 max-w-[540px]">
            Built for accountants, CAs and businesses that retype statements every month.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href="#upload" className="inline-flex items-center gap-2 rounded-xl bg-[#047857] px-7 py-4 text-base font-bold text-white whitespace-nowrap">
              Convert free — first 8 pages <ArrowRight size={17} />
            </a>
            <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-[#047857] px-7 py-4 text-base font-bold text-[#047857] whitespace-nowrap">
              See how it works
            </a>
          </div>
          <p className="text-sm text-[#64748b] mt-4">No account needed to start · Password-protected PDFs accepted</p>
        </div>

        {/* Working converter in the pattern's product-visual frame */}
        <div className="min-w-0 max-w-full bg-white border border-[#e2e8f0] rounded-[20px] p-5 sm:p-6 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.18)]">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="font-extrabold text-[15px] text-[#0f172a]">Statement conversion</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] border border-[#d1fae5] px-2.5 py-1 text-xs font-bold text-[#047857]">
              <Check size={13} strokeWidth={3} /> Balance checked
            </span>
          </div>
          <div id="upload" className="scroll-mt-24 text-left min-w-0 max-w-full overflow-x-auto">
            <UploadCard billing={billing} onBillingUpdate={fetchBilling} userEmail={userEmail} hasSheetsAccess={hasSheetsAccess} fullWidth={true} />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-center">
            <p className="text-[12.5px] text-[#64748b]">
              <span className="font-semibold text-[#334155]">Bank-grade security</span>
              {" "}— files processed securely and deleted immediately
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mt-4 text-[13px] font-semibold text-[#334155]">
            <span className="inline-flex items-center gap-1.5"><Check size={14} strokeWidth={3} className="text-[#047857]" /> Files processed in memory</span>
            <span className="inline-flex items-center gap-1.5"><Check size={14} strokeWidth={3} className="text-[#047857]" /> Never stored</span>
            <span className="inline-flex items-center gap-1.5"><Check size={14} strokeWidth={3} className="text-[#047857]" /> Indian banks covered</span>
          </div>
          <p className="mt-5 text-center text-[12.5px] font-medium text-[#94a3b8] tracking-wide">
            SBI · HDFC · ICICI · Axis · Kotak · PNB · Bank of Baroda · Canara · Union Bank · IDFC FIRST · Yes Bank · IndusInd
          </p>
        </div>
      </div>
    </section>
  );
}
