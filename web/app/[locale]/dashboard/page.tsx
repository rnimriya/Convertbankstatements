import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { findById, findByEmail, getConversionLogs } from "@/lib/auth/users";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { Footer } from "@/components/layout/Footer";
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
    razorpayCustomerId: null,
  };

  const recentLogs = user ? await getConversionLogs(user.id) : [];

  return (
    <DashboardClient
      billing={billing}
      recentLogs={recentLogs.map(log => ({
        ...log,
        createdAt: new Date(log.createdAt),
      }))}
      userEmail={user?.email ?? session.email}
      userName={user?.name ?? session.name}
      emailVerified={user?.emailVerified ?? false}
      hasSheetsAccess={Boolean(user?.googleSheetsRefreshToken)}
      isDemo={false}
      footer={<Footer />}
    />
  );
}
