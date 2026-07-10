import { NextResponse } from "next/server";

export async function GET() {
  // In a real implementation, we would generate a state token, construct the Intuit
  // authorization URL (https://appcenter.intuit.com/connect/oauth2), and redirect the user.
  // Since we are mocking the OAuth flow for testing/beta:
  
  const callbackUrl = new URL("/api/quickbooks/callback", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");
  return NextResponse.redirect(callbackUrl);
}
