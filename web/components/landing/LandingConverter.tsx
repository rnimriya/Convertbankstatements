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
 * The working statement converter for the format landing pages — the exact
 * UploadCard the homepage hero embeds (same component, same props), with the
 * same guest-billing bootstrap as components/home/HeroSectionWrapper.
 */
export function LandingConverter() {
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
    <div id="converter" className="scroll-mt-24 max-w-[845px] mx-auto mt-2 text-left rounded-[28px]">
      <UploadCard billing={billing} onBillingUpdate={fetchBilling} userEmail={userEmail} hasSheetsAccess={hasSheetsAccess} fullWidth={true} />

      {/* Security note */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <p className="text-[12.5px] text-zinc-500">
          <span className="font-semibold text-zinc-700">Bank-grade security</span>
          {" "}— Files processed securely and deleted immediately
        </p>
      </div>
    </div>
  );
}
