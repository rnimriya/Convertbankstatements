import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { checkCsrfOrigin } from "@/lib/csrf";
import { pushTransactions } from "@/lib/quickbooks";
import { z } from "zod";

const schema = z.object({
  bankAccountId: z.string().min(1).max(20),
  transactions: z
    .array(
      z.object({
        date: z.string().min(4).max(10),
        description: z.string().max(500),
        amount: z.number(),
      })
    )
    .min(1)
    .max(200),
});

export async function POST(req: NextRequest) {
  const csrf = checkCsrfOrigin(req);
  if (csrf) return csrf;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  try {
    const result = await pushTransactions(session.sub, parsed.data.bankAccountId, parsed.data.transactions);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Push failed" },
      { status: 400 }
    );
  }
}
