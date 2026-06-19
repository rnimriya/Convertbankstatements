"use client";

import { useState, useEffect, useCallback } from "react";
import { HeroSection } from "./HeroSection";
import type { BillingContext } from "@/types/billing";

const GUEST_BILLING: BillingContext = {
  tier: "FREE",
  pagesUsedThisPeriod: 0,
  monthlyPageLimit: 8,
  razorpayCustomerId: null,
};

export function HeroSectionWrapper() {
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
    <HeroSection
      billing={billing}
      onBillingUpdate={fetchBilling}
      userEmail={userEmail}
      hasSheetsAccess={hasSheetsAccess}
    />
  );
}
