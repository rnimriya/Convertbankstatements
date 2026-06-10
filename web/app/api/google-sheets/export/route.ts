import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";
import { z } from "zod";

const schema = z.object({
  fileName: z.string(),
  transactions: z.array(z.object({
    date: z.string(),
    description: z.string(),
    amount: z.number(),
    balance: z.number().nullable(),
    category: z.string().nullable(),
    reference: z.string().nullable(),
  })),
  bankName: z.string().nullable().optional(),
});

async function getAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Token refresh failed");
  return data.access_token;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findById(session.sub);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!user.googleSheetsRefreshToken) {
    return NextResponse.json({ error: "Google Sheets not connected. Go to Settings → Integrations." }, { status: 400 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { fileName, transactions, bankName } = parsed.data;

  try {
    const accessToken = await getAccessToken(user.googleSheetsRefreshToken);

    // Create spreadsheet
    const spreadsheetRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          title: `${bankName ?? "Bank"} Statement — ${fileName.replace(".pdf", "")}`,
        },
        sheets: [{
          properties: { title: "Transactions" },
        }],
      }),
    });

    const spreadsheet = await spreadsheetRes.json();
    if (!spreadsheetRes.ok) throw new Error(spreadsheet.error?.message ?? "Failed to create spreadsheet");

    const spreadsheetId = spreadsheet.spreadsheetId;

    // Populate data
    const headers = ["Date", "Description", "Amount (₹)", "Balance (₹)", "Category", "Reference"];
    const rows = [
      headers,
      ...transactions.map(t => [t.date, t.description, t.amount, t.balance ?? "", t.category ?? "", t.reference ?? ""]),
    ];

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Transactions!A1:F${rows.length}?valueInputOption=RAW`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ range: `Transactions!A1:F${rows.length}`, majorDimension: "ROWS", values: rows }),
    });

    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    return NextResponse.json({ ok: true, url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Export failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
