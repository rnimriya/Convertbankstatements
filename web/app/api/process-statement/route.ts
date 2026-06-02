import { NextRequest, NextResponse } from "next/server";
import { countPdfPages, sha256Hex } from "@/lib/pdf-utils";
import { generateMockTransactions, transactionsToCSV } from "@/lib/mock-transactions";
import { getSession } from "@/lib/auth/session";
import { findById, incrementPages } from "@/lib/auth/users";
import { cookies } from "next/headers";

const FREE_PAGE_CAP = 8;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const exportFormats = ((formData.get("export_formats") as string) || "csv")
    .split(",").map((f) => f.trim().toLowerCase());

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

  // ── Auth & Billing ─────────────────────────────────────────────────────
  const session = await getSession();
  const jar = await cookies();

  let userId: string | null = null;
  let pagesUsed = 0;
  let tier = "FREE";
  let monthlyPageLimit = FREE_PAGE_CAP;

  if (session) {
    const user = await findById(session.sub);
    if (user) {
      userId = user.id;
      pagesUsed = user.pagesUsed;
      tier = user.tier;
      monthlyPageLimit = user.monthlyPageLimit;
    }
  } else {
    // Anonymous: cookie-based tracking
    pagesUsed = parseInt(jar.get("bs_pages_used")?.value ?? "0", 10);
  }

  // ── Billing decision ───────────────────────────────────────────────────
  if (tier === "FREE") {
    const remaining = Math.max(0, FREE_PAGE_CAP - pagesUsed);

    if (remaining < pageCount) {
      // Check if user paid via Razorpay PAYG (cookie cleared after use)
      const paygCleared = jar.get("bs_payg_cleared")?.value;
      if (!paygCleared) {
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
      // Payment verified — clear the one-time cookie
      jar.delete("bs_payg_cleared");
    }
  } else if (["PRO", "BUSINESS"].includes(tier)) {
    if (pagesUsed + pageCount > monthlyPageLimit) {
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

  // ── Extract transactions: try FastAPI first, fall back to mock ────────
  let transactions: ReturnType<typeof generateMockTransactions> = [];
  let bankName = inferIndianBankName(file.name, bytes.toString("latin1").slice(0, 2000));
  let isDemo = true;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
  try {
    // Forward the file to FastAPI with a short timeout probe first
    const upstreamForm = new FormData();
    upstreamForm.append("file", new Blob([bytes], { type: "application/pdf" }), file.name);
    upstreamForm.append("export_formats", exportFormats.join(","));

    const upstream = await fetch(`${backendUrl}/api/process-statement`, {
      method: "POST",
      body: upstreamForm,
      signal: AbortSignal.timeout(300_000),
      headers: session ? { Authorization: `Bearer ${session.sub}` } : {},
    });

    if (upstream.ok) {
      const data = await upstream.json();
      transactions = data.transactions ?? [];
      bankName = data.bank_name ?? bankName;
      isDemo = false;
    }
  } catch {
    // FastAPI not running — use mock data
  }

  if (transactions.length === 0) {
    transactions = generateMockTransactions(pageCount);
    isDemo = true;
  }

  // ── Export CSV ─────────────────────────────────────────────────────────
  const csvContent = transactionsToCSV(transactions);
  const csvBase64 = Buffer.from(csvContent).toString("base64");

  // ── Record usage ───────────────────────────────────────────────────────
  if (userId) {
    await incrementPages(userId, pageCount);
  } else {
    // Anonymous cookie update (response cookies set below)
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
    export_urls: { csv: `data:text/csv;base64,${csvBase64}` },
    processing_ms: Date.now() - start,
  });
}

function inferIndianBankName(filename: string, pdfText: string): string | null {
  const combined = (filename + " " + pdfText).toLowerCase();
  const banks: [string, string][] = [
    ["state bank", "State Bank of India (SBI)"], ["sbi", "State Bank of India (SBI)"],
    ["hdfc", "HDFC Bank"], ["icici", "ICICI Bank"],
    ["axis", "Axis Bank"], ["kotak", "Kotak Mahindra Bank"],
    ["punjab national", "Punjab National Bank"], ["pnb", "Punjab National Bank"],
    ["bank of baroda", "Bank of Baroda"], ["bob", "Bank of Baroda"],
    ["canara", "Canara Bank"], ["union bank", "Union Bank of India"],
    ["indusind", "IndusInd Bank"], ["yes bank", "Yes Bank"],
    ["idfc", "IDFC FIRST Bank"], ["federal bank", "Federal Bank"],
    ["south indian bank", "South Indian Bank"], ["rbl", "RBL Bank"],
    ["bandhan", "Bandhan Bank"], ["paytm", "Paytm Payments Bank"],
    ["airtel", "Airtel Payments Bank"], ["au bank", "AU Small Finance Bank"],
    ["indian bank", "Indian Bank"], ["central bank", "Central Bank of India"],
    ["uco bank", "UCO Bank"], ["bank of india", "Bank of India"],
  ];
  for (const [key, name] of banks) {
    if (combined.includes(key)) return name;
  }
  return null;
}
