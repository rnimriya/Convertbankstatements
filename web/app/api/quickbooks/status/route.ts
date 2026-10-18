import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { qbConfigured, getConnection } from "@/lib/quickbooks";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const conn = await getConnection(session.sub).catch(() => null);
  return NextResponse.json({
    configured: qbConfigured(),
    connected: Boolean(conn),
    realmId: conn?.realmId ?? null,
    environment: process.env.QB_ENVIRONMENT === "production" ? "production" : "sandbox",
  });
}
