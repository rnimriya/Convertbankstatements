import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";
import { ReferralsDashboard } from "@/components/dashboard/ReferralsDashboard";

export const metadata = { title: "Referrals — Convert Statement" };

export default async function ReferralsPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirectTo=/dashboard/referrals");

  const user = await findById(session.sub);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://convertstatement.online";

  const referralCode = user?.referralCode ?? session.sub.slice(0, 8);
  const referralUrl = `${baseUrl}/signup?ref=${referralCode}`;
  const pagesCredited = user?.referralPagesCredited ?? 0;

  return <ReferralsDashboard referralUrl={referralUrl} pagesCredited={pagesCredited} />;
}
