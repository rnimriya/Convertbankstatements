import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { BillingContext } from "@/types/billing";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) redirect("/login?redirectTo=/dashboard");

  const user = await findById(session.sub);
  if (!user) redirect("/login?clear=1");

  const billing: BillingContext = {
    tier: user.tier as BillingContext["tier"],
    pagesUsedThisPeriod: user.pagesUsed,
    monthlyPageLimit: user.monthlyPageLimit,
    stripeCustomerId: null,
  };

  return (
    <DashboardClient
      billing={billing}
      recentLogs={[]}
      userEmail={user.email}
      userName={user.name}
      isDemo={false}
    />
  );
}
