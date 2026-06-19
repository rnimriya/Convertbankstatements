import { NextRequest, NextResponse } from "next/server";
import { verifyEmail, creditReferralForUser } from "@/lib/auth/users";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?error=missing_token", req.url));
  }

  const userId = await verifyEmail(token);

  if (userId) {
    // Grant referral bonuses only now that the email is proven — prevents
    // throwaway-account farming. Non-fatal: a failure here must not block verification.
    await creditReferralForUser(userId).catch((err) =>
      console.error("[verify-email] referral credit failed", err)
    );
    return NextResponse.redirect(new URL("/verify-email?success=1", req.url));
  } else {
    return NextResponse.redirect(new URL("/verify-email?error=invalid_token", req.url));
  }
}
