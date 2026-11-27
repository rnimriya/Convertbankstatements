"use client";

import { useState, useEffect, useCallback } from "react";
import { UploadCard } from "@/components/upload/UploadCard";
import type { BillingContext } from "@/types/billing";

const GUEST_BILLING: BillingContext = {
  tier: "FREE",
  pagesUsedThisPeriod: 0,
  monthlyPageLimit: 8,
  razorpayCustomerId: null,
};

/**
 * Hero for convertstatement.in (owner orders 2026-11-27): current-site
 * heading + ONLY the dropbox (real working UploadCard). No eyebrow,
 * buttons, stat row or extra copy. Rendered only when isIndiaSite().
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
      <div className="relative z-10 mx-auto max-w-3xl px-4 pt-14 pb-14 lg:pt-20 lg:pb-20 text-center">
        <h1 className="font-display font-extrabold tracking-[-0.02em] leading-[1.14] mb-10 text-4xl sm:text-5xl lg:text-[54px]">
          Stop typing bank statements into <span className="text-[#34d399]">Excel</span>.
        </h1>

        {/* The dropbox — real working converter */}
        <div className="min-w-0 max-w-full bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.45)]">
          <div id="upload" className="scroll-mt-24 text-left min-w-0 max-w-full overflow-x-auto">
            <UploadCard billing={billing} onBillingUpdate={fetchBilling} userEmail={userEmail} hasSheetsAccess={hasSheetsAccess} fullWidth={true} />
          </div>
        </div>
      </div>
    </section>
  );
}
