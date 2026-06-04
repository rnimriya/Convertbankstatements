import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { findById, findByEmail } from "@/lib/auth/users";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { BillingContext } from "@/types/billing";

export default async function DashboardPage() {
  const session = await getSession();

  // No valid JWT at all → go to login
  if (!session) redirect("/login?redirectTo=/dashboard");

  // Try to load the full user record from the file store.
  // On Vercel, different serverless instances each have their own /tmp,
  // so findById can return null even though the JWT is perfectly valid.
  // Fall back to: (1) search by email, (2) use JWT claims with safe defaults.
  let user = await findById(session.sub);

  if (!user) {
    // Fallback 1: find by email (handles ID mismatch after re-seed)
    user = await findByEmail(session.email);
  }

  // Fallback 2: JWT is verified and valid — trust it and use defaults.
  // This keeps the user logged in instead of wiping their session.
  const billing: BillingContext = {
    tier: (user?.tier ?? "FREE") as BillingContext["tier"],
    pagesUsedThisPeriod: user?.pagesUsed ?? 0,
    monthlyPageLimit: user?.monthlyPageLimit ?? 8,
    stripeCustomerId: null,
  };

  return (
    <DashboardClient
      billing={billing}
      recentLogs={[]}
      userEmail={user?.email ?? session.email}
      userName={user?.name ?? session.name}
      isDemo={false}
    />
  );
}
