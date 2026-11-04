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
 * Client island for the bank landing pages — the exact pattern the homepage
 * uses (HeroSectionWrapper → HeroSection → UploadCard): start from guest
 * billing defaults, then refresh from /api/billing-context so a signed-in
 * visitor gets their real tier and page balance. UploadCard itself is the
 * homepage component, untouched, with the same props the homepage passes.
 */
export function BankConverter() {
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
    <UploadCard
      billing={billing}
      onBillingUpdate={fetchBilling}
      userEmail={userEmail}
      hasSheetsAccess={hasSheetsAccess}
      fullWidth={true}
    />
  );
}
