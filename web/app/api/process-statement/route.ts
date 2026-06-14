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
import { findById, incrementPages, addConversionLog } from "@/lib/auth/users";
import { randomUUID } from "crypto";
import { getPortal } from "@/lib/portals";
import { TIER_CONFIG } from "@/lib/config/tiers";
import { inferBankName } from "@/lib/config/banks";
import { extractTransactions } from "@/lib/extraction/extract";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { getRedis } from "@/lib/redis";
import { cookies } from "next/headers";

const FREE_PAGE_CAP = TIER_CONFIG.FREE.pagesPerMonth;

// Server-side anonymous quota, keyed by client IP. The `bs_pages_used` cookie is
// user-deletable, so it cannot be the only brake on free usage. This Redis counter
// (30-day TTL) is the authoritative backstop for unauthenticated uploads.
const ANON_IP_KEY = (ip: string) => `cs:anon:pages:${ip}`;
const ANON_TTL_SECONDS = 60 * 60 * 24 * 30;

function clientIp(req: NextRequest): string {
  return (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0].trim();
}

export async function POST(req: NextRequest) {
  // Rate limit every upload — each non-demo request can trigger a paid Vision call.
  // Applied before any work so anonymous abuse can't amplify cost.
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

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

  // BUG-10: reject empty or structurally invalid PDFs before any quota or payment logic.
  // countPdfPages now returns 0 for files with no detectable pages.
  if (pageCount === 0) {
    return NextResponse.json(
      { error: "Invalid PDF: no pages detected. The file may be corrupted or empty." },
      { status: 400 }
    );
  }
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
    // Anonymous: cookie-based tracking, backstopped by a server-side IP counter.
    // The cookie alone is user-deletable; we take the MAX of the cookie value and
    // the Redis IP counter so clearing cookies can't reset the free allowance.
    // On any tampered/invalid cookie value default to FREE_PAGE_CAP.
    const raw = parseInt(jar.get("bs_pages_used")?.value ?? "0", 10);
    const cookiePages =
      Number.isInteger(raw) && raw >= 0 && raw <= FREE_PAGE_CAP * 10 ? raw : FREE_PAGE_CAP;

    let ipPages = 0;
    const redis = getRedis();
    if (redis) {
      const stored = await redis.get<number>(ANON_IP_KEY(clientIp(req)));
      ipPages = typeof stored === "number" && stored >= 0 ? stored : 0;
    }
    pagesUsed = Math.max(cookiePages, ipPages);
  }

  if (tier === "FREE") {
    const remaining = Math.max(0, FREE_PAGE_CAP - pagesUsed);
    if (remaining < pageCount) {
      return NextResponse.json(
        {
          error: "PAYMENT_REQUIRED",
          message: `You have ${remaining} free page${remaining !== 1 ? "s" : ""} left. This document has ${pageCount} pages. Please upgrade to Pro to continue.`,
          page_count: pageCount,
        },
        { status: 402 }
      );
    }
  } else if (["BASIC", "PRO", "BUSINESS"].includes(tier)) {
    if (pagesUsed + pageCount > monthlyPageLimit) {
      return NextResponse.json(
        {
          error: "PAYMENT_REQUIRED",
          message: `Monthly limit of ${monthlyPageLimit} pages reached. Please upgrade to Business to continue.`,
          page_count: pageCount,
        },
        { status: 402 }
      );
    }
  }

  // ── Extract transactions in-app (no external backend required) ─────────────
  // Text PDFs are parsed locally; scanned PDFs use Claude Vision when
  // ANTHROPIC_API_KEY is set. We never fabricate financial data.
  let transactions: ReturnType<typeof generateMockTransactions> = [];
  let bankName = inferBankName(file.name, bytes.toString("latin1").slice(0, 2000));
  const isDemo = false;

  const extraction = await extractTransactions(bytes, file.name);
  transactions = extraction.transactions;
  bankName = extraction.bankName ?? bankName;

  if (extraction.method === "none" || transactions.length === 0) {
    // A valid PDF we couldn't read (likely scanned with no Vision configured).
    // Be honest rather than returning fake rows.
    return NextResponse.json(
      {
        error: "NO_TRANSACTIONS_FOUND",
        message:
          "We couldn't read any transactions from this PDF. If it's a scanned/photo statement, scanned-document support must be enabled. Otherwise the file may be password-protected or in an unsupported layout.",
        page_count: pageCount,
      },
      { status: 422 }
    );
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

  // ── Record usage & log ─────────────────────────────────────────────────────
  // BUG-06: Only charge quota for real (non-demo) conversions.
  // isDemo=true means the FastAPI backend was unavailable and we returned mock data.
  // Incrementing pages for a failed/mocked result silently burns the user's quota
  // while giving them nothing of value.
  if (userId && !isDemo) {
    await incrementPages(userId, pageCount);
    await addConversionLog({
      id: randomUUID(),
      userId,
      fileName: file.name,
      pageCount,
      transactionCount: transactions.length,
      billingType: tier === "FREE" ? "FREE_TIER" : "SUBSCRIPTION",
      bankName: bankName ?? null,
      exportFormats,
      createdAt: new Date().toISOString(),
    }).catch(() => {/* non-fatal */});
  } else if (!userId && !isDemo) {
    jar.set("bs_pages_used", String(pagesUsed + pageCount), {
      httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 365,
    });
    // Mirror into the authoritative server-side IP counter so the quota survives
    // cookie deletion. INCRBY is atomic; refresh the TTL on each write.
    const redis = getRedis();
    if (redis) {
      const key = ANON_IP_KEY(clientIp(req));
      await redis.incrby(key, pageCount);
      await redis.expire(key, ANON_TTL_SECONDS);
    }
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

