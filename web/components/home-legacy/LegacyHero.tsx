"use client";

import { useState, useEffect, useCallback } from "react";
import { Check } from "lucide-react";
import { UploadCard } from "@/components/upload/UploadCard";
import { bankCountLabel } from "@/lib/config/bank-region";
import type { BillingContext } from "@/types/billing";

const GUEST_BILLING: BillingContext = {
  tier: "FREE",
  pagesUsedThisPeriod: 0,
  monthlyPageLimit: 8,
  razorpayCustomerId: null,
};

/**
 * Hero for convertstatement.in — "Hero Sample 1" picked by the owner
 * 2026-11-27: dark #052e22 band, NO eyebrow above the heading, H1
 * "Bank Statement Converter" (mint accent), and the dropbox directly
 * on the dark background — no white card wrapper div around it.
 * Rendered only when isIndiaSite().
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
    <section className="relative overflow-hidden bg-[#052e22] text-white">
      <div className="relative z-10 mx-auto max-w-[860px] px-4 pt-12 pb-14 sm:px-6 lg:pt-[72px] lg:pb-20 text-center">
        <h1 className="font-display font-extrabold tracking-[-0.02em] leading-[1.12] text-[33px] sm:text-5xl lg:text-[48px]">
          Bank Statement <span className="text-[#34d399]">Converter</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[640px] text-base sm:text-lg font-medium leading-relaxed text-[#a7c4b8]">
          Upload your bank statement PDF. Get a clean Excel or CSV file — ready for Tally, your accounting software or your CA.
        </p>

        {/* The dropbox — real working converter, directly on the dark band */}
        <div id="upload" className="scroll-mt-24 mx-auto mt-10 w-full max-w-[720px] text-left min-w-0 overflow-x-auto">
          <UploadCard billing={billing} onBillingUpdate={fetchBilling} userEmail={userEmail} hasSheetsAccess={hasSheetsAccess} fullWidth={true} dark />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-x-9 gap-y-3.5">
          {[
            "First 8 pages free",
            "No signup needed",
            `SBI, HDFC, ICICI, Axis, Kotak and ${bankCountLabel()} Indian banks`,
          ].map((t) => (
            <span key={t} className="flex items-center gap-2 text-[14.5px] font-semibold text-[#c9ddd3]">
              <Check size={17} strokeWidth={3} className="shrink-0 text-[#34d399]" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
