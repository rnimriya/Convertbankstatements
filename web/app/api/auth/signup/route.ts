import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser } from "@/lib/auth/users";
import { signJWT } from "@/lib/auth/jwt";
import { sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser(email, passwordHash, name);

    const token = await signJWT({ sub: user.id, email: user.email, name: user.name });

    const res = NextResponse.json({ ok: true, email: user.email });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signup failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
