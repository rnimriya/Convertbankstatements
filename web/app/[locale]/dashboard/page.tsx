import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { findById, findByEmail } from "@/lib/auth/users";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { BillingContext } from "@/types/billing";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) redirect("/login?redirectTo=/dashboard");

  let user = await findById(session.sub);
  if (!user) user = await findByEmail(session.email);

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
