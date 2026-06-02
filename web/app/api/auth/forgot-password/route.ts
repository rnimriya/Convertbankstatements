import { NextRequest, NextResponse } from "next/server";
import { findByEmail, setResetToken } from "@/lib/auth/users";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await findByEmail(email);
    if (!user) {
      // Return success anyway to prevent email enumeration
      return NextResponse.json({
        ok: true,
        message: "If an account exists with that email, a password reset link has been generated.",
      });
    }

    const token = randomUUID();
    const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await setResetToken(user.email, token, expiry);

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Print to server logs
    console.log("-----------------------------------------");
    console.log(`[PASSWORD RESET REQUEST] User: ${user.email}`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log("-----------------------------------------");

    return NextResponse.json({
      ok: true,
      message: "If an account exists with that email, a password reset link has been generated.",
      // Include URL in response for development convenience
      resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
    });
  } catch (e) {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
