import { NextRequest, NextResponse } from "next/server";
import { findUserByResetToken, updatePassword } from "@/lib/auth/users";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Reset token is required." }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const user = await findUserByResetToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(password, 12);
    // Pass the consumed token so updatePassword can delete the Redis reverse-index
    // key immediately — prevents reuse within the remaining TTL window.
    await updatePassword(user.id, newHash, token);

    return NextResponse.json({ ok: true, message: "Password updated successfully." });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
