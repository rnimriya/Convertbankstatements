import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findByEmail } from "@/lib/auth/users";
import { signJWT } from "@/lib/auth/jwt";
import { sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = await findByEmail(email);

    if (!user) {
      // Constant-time response to prevent user enumeration
      await bcrypt.hash("dummy", 1);
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signJWT({ sub: user.id, email: user.email, name: user.name });

    const res = NextResponse.json({ ok: true, email: user.email });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
