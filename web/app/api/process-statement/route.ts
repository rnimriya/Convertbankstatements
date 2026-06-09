import { NextRequest, NextResponse } from "next/server";
import { countPdfPages, sha256Hex } from "@/lib/pdf-utils";
import {
  generateMockTransactions,
  transactionsToCSV,
  transactionsToExcel,
  transactionsToOFX,
  transactionsToQFX,
  transactionsToGoogleSheets,
} from "@/lib/mock-transactions";
import { getSession } from "@/lib/auth/session";
import { findById, incrementPages, markPaygUsed } from "@/lib/auth/users";
import { getPortal } from "@/lib/portals";
import { TIER_CONFIG } from "@/lib/config/tiers";
import { inferBankName } from "@/lib/config/banks";
import { cookies } from "next/headers";

const FREE_PAGE_CAP = TIER_CONFIG.FREE.pagesPerMonth;

export async function POST(req: NextRequest) {
  // ── Demo mode ──────────────────────────────────────────────────────────────
  // ?demo=true skips file upload, billing, and auth — used by the "Try sample" button.
  if (req.nextUrl.searchParams.get("demo") === "true") {
    const start = Date.now();
    const transactions = generateMockTransactions(5);
    const content = transactionsToCSV(transactions);
    const csvUrl = `data:text/csv;base64,${Buffer.from(content).toString("base64")}`;
    const xlsxBuf = transactionsToExcel(transactions);
    const xlsxUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${xlsxBuf.toString("base64")}`;
    return NextResponse.json({
      success: true,
      file_name: "SBI_Sample_Statement.pdf",
      page_count: 5,
      transaction_count: transactions.length,
      bank_name: "State Bank of India (SBI)",
      is_demo: true,
      billing: { billing_type: "FREE_TIER", pages_charged: 0, payment_required: false, message: "Demo — no pages consumed." },
      transactions: transactions.slice(0, 10),
      export_urls: { csv: csvUrl, xlsx: xlsxUrl },
      processing_ms: Date.now() - start,
    });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const exportFormats = ((formData.get("export_formats") as string) || "csv")
    .split(",").map((f) => f.trim().toLowerCase());
  const portalToken = (formData.get("portal_token") as string | null) ?? null;

  if (!file)
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf")
    return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 415 });
  if (file.size > 50 * 1024 * 1024)
    return NextResponse.json({ error: "File exceeds 50 MB limit." }, { status: 413 });

  const start = Date.now();
  const bytes = Buffer.from(await file.arrayBuffer());
  const pageCount = countPdfPages(bytes);
  const _fileHash = sha256Hex(bytes);

  // ── Auth & Billing ─────────────────────────────────────────────────────────
  const session = await getSession();
  const jar = await cookies();

  let userId: string | null = null;
  let pagesUsed = 0;
  let tier = "FREE";
  let monthlyPageLimit = FREE_PAGE_CAP;
  let isPortalUpload = false;

  // Portal upload: resolve portal owner and bill their account
  if (portalToken) {
    const portal = await getPortal(portalToken);
    if (portal && portal.active) {
      const owner = await findById(portal.ownerId);
      if (owner) {
        userId = owner.id;
        pagesUsed = owner.pagesUsed;
        tier = owner.tier;
        monthlyPageLimit = owner.monthlyPageLimit;
        isPortalUpload = true;
      }
    }
    // If portal is invalid or inactive, fall through to normal anonymous billing
  }

  if (!isPortalUpload) {
    if (session) {
      const user = await findById(session.sub);
      if (user) {
        userId = user.id;
        pagesUsed = user.pagesUsed;
        tier = user.tier;
        monthlyPageLimit = user.monthlyPageLimit;
      }
    }
  }

  if (!isPortalUpload && !session) {
    // Anonymous: cookie-based tracking (soft limit — requires login for real enforcement)
    const raw = parseInt(jar.get("bs_pages_used")?.value ?? "0", 10);
    pagesUsed = Number.isFinite(raw) && raw >= 0 ? raw : 0;
  }

  // ── Billing decision ───────────────────────────────────────────────────────
  if (tier === "FREE") {
    const remaining = Math.max(0, FREE_PAGE_CAP - pagesUsed);
    if (remaining < pageCount) {
      // Atomically consume the one-time PAYG payment cookie.
      // markPaygUsed uses Redis SET NX — only one concurrent request can win.
      if (!(await consumePayg(jar, userId))) {
        return NextResponse.json(
          {
            error: "PAYMENT_REQUIRED",
            message: `You have ${remaining} free page${remaining !== 1 ? "s" : ""} left. This document has ${pageCount} pages.`,
            page_count: pageCount,
            price_inr: 49,
            plan: "payg",
          },
          { status: 402 }
        );
      }
    }
  } else if (["PRO", "BUSINESS"].includes(tier)) {
    if (pagesUsed + pageCount > monthlyPageLimit) {
      // PRO/BUSINESS users who exceed their monthly limit can also pay PAYG
      if (!(await consumePayg(jar, userId))) {
        return NextResponse.json(
          {
            error: "PAYMENT_REQUIRED",
            message: `Monthly limit of ${monthlyPageLimit} pages reached. Pay ₹49 per additional document.`,
            page_count: pageCount,
            price_inr: 49,
            plan: "payg",
          },
          { status: 402 }
        );
      }
    }
  }

  // ── Extract transactions: try FastAPI first, fall back to mock ────────────
  let transactions: ReturnType<typeof generateMockTransactions> = [];
  let bankName = inferBankName(file.name, bytes.toString("latin1").slice(0, 2000));
  let isDemo = true;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
  try {
    const upstreamForm = new FormData();
    upstreamForm.append("file", new Blob([bytes], { type: "application/pdf" }), file.name);
    upstreamForm.append("export_formats", exportFormats.join(","));

    const upstream = await fetch(`${backendUrl}/api/process-statement`, {
      method: "POST",
      body: upstreamForm,
      signal: AbortSignal.timeout(300_000),
      headers: {
        "x-api-key": process.env.BACKEND_API_KEY ?? "",
      },
    });

    if (upstream.ok) {
      const data = await upstream.json();
      transactions = data.transactions ?? [];
      bankName = data.bank_name ?? bankName;
      isDemo = false;
    }
  } catch {
    // FastAPI not running — fall through to mock
  }

  if (transactions.length === 0) {
    transactions = generateMockTransactions(pageCount);
    isDemo = true;
  }

  // ── Build export URLs ──────────────────────────────────────────────────────
  const exportUrls: Record<string, string> = {};

  for (const fmt of exportFormats) {
    if (fmt === "csv") {
      const content = transactionsToCSV(transactions);
      exportUrls.csv = `data:text/csv;base64,${Buffer.from(content).toString("base64")}`;
    } else if (fmt === "xlsx") {
      const buf = transactionsToExcel(transactions);
      exportUrls.xlsx = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${buf.toString("base64")}`;
    } else if (fmt === "ofx") {
      const content = transactionsToOFX(transactions);
      exportUrls.ofx = `data:application/x-ofx;base64,${Buffer.from(content).toString("base64")}`;
    } else if (fmt === "qfx") {
      const content = transactionsToQFX(transactions);
      exportUrls.qfx = `data:application/x-qfx;base64,${Buffer.from(content).toString("base64")}`;
    } else if (fmt === "sheets") {
      const content = transactionsToGoogleSheets(transactions);
      exportUrls.sheets = `data:text/csv;base64,${Buffer.from(content).toString("base64")}`;
    }
  }

  if (Object.keys(exportUrls).length === 0) {
    const content = transactionsToCSV(transactions);
    exportUrls.csv = `data:text/csv;base64,${Buffer.from(content).toString("base64")}`;
  }

  // ── Record usage ───────────────────────────────────────────────────────────
  if (userId) {
    await incrementPages(userId, pageCount);
  } else {
    jar.set("bs_pages_used", String(pagesUsed + pageCount), {
      httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 365,
    });
  }

  return NextResponse.json({
    success: true,
    file_name: file.name,
    page_count: pageCount,
    transaction_count: transactions.length,
    bank_name: bankName,
    is_demo: isDemo,
    billing: {
      billing_type: tier === "FREE" ? "FREE_TIER" : "SUBSCRIPTION",
      pages_charged: pageCount,
      payment_required: false,
      message:
        tier === "FREE"
          ? `${Math.max(0, FREE_PAGE_CAP - pagesUsed - pageCount)} free pages remaining.`
          : `${Math.max(0, monthlyPageLimit - pagesUsed - pageCount)} pages remaining this month.`,
    },
    transactions: transactions.slice(0, 10),
    export_urls: exportUrls,
    processing_ms: Date.now() - start,
  });
}

/**
 * Atomically consume the bs_payg_cleared one-time payment cookie.
 *
 * Uses markPaygUsed (Redis SET NX) so two concurrent requests carrying the
 * same payment ID can only succeed once — the TOCTOU race is closed.
 *
 * Returns true if payment was successfully consumed (upload may proceed).
 * Returns false if no cookie, or cookie already consumed by another request.
 */
async function consumePayg(
  jar: Awaited<ReturnType<typeof cookies>>,
  userId: string | null
): Promise<boolean> {
  const paymentId = jar.get("bs_payg_cleared")?.value;
  if (!paymentId) return false;
  const consumed = await markPaygUsed(paymentId, userId ?? "anon");
  if (consumed) jar.delete("bs_payg_cleared");
  return consumed;
}

