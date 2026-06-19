import { useEffect, useState, useCallback } from "react";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

interface BillingContext {
  tier: string;
  pagesUsedThisPeriod: number;
  monthlyPageLimit: number;
}

export function useBillingContext() {
  const [billing, setBilling] = useState<BillingContext | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/billing-context`);
      if (res.ok) {
        const data = await res.json();
        setBilling(data);
      }
    } catch {
      // silently fail — billing context is a nice-to-have in mobile
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { billing, refresh };
}
