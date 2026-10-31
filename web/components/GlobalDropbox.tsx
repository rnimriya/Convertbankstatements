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
 * Full-width converter drop box rendered above the footer on every
 * marketing page (owner order 2026-10-31: "home dropbox full page
 * chahiye hr ek page pe"). Same UploadCard + billing wiring as the
 * homepage hero. Dashboard uses the light footer variant and never
 * renders this.
 */
export function GlobalDropbox() {
  const [billing, setBilling] = useState<BillingContext>(GUEST_BILLING);
  const [hasSheetsAccess, setHasSheetsAccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>();

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
    <section className="bg-[#F0F9EE] border-t border-[#BFE3B8]/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-9">
          <p className="agri-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[#007A33] mb-4">
            — Free converter —
          </p>
          <h2 className="agri-sans text-3xl sm:text-[40px] leading-[1.12] font-extrabold tracking-tight text-[#0B1F16]">
            Convert a bank statement,{" "}
            <span className="agri-serif text-[#2CA01C]">right here.</span>
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-zinc-600">
            Drop a PDF bank statement and get Excel, CSV, QBO, OFX or Google
            Sheets in under 15 seconds. First 8 pages free — files are
            processed in memory and never stored.
          </p>
        </div>
        <UploadCard
          billing={billing}
          onBillingUpdate={fetchBilling}
          userEmail={userEmail}
          hasSheetsAccess={hasSheetsAccess}
          fullWidth={true}
        />
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[13px] font-medium text-zinc-600">
          <span>✓ Files never stored</span>
          <span>✓ 400+ banks covered</span>
          <span>✓ Password PDFs supported</span>
          <span>✓ 99.4% accuracy</span>
        </div>
      </div>
    </section>
  );
}
