/**
 * POST /api/bulk-process
 *
 * Accepts:
 *   - Multiple PDF files via multipart/form-data (field name "files[]")
 *   - A single .zip file containing PDFs (field name "files[]")
 *   - export_formats: comma-separated string
 *
 * Processes files sequentially (avoids memory spikes) and returns all results
 * in a single JSON response. Max 20 files per request, max 50 MB per file.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { findById, incrementPages } from "@/lib/auth/users";
import { countPdfPages } from "@/lib/pdf-utils";
import {
  generateMockTransactions,
  transactionsToCSV,
  transactionsToExcel,
} from "@/lib/mock-transactions";
import { TIER_CONFIG } from "@/lib/config/tiers";
import { inferBankName } from "@/lib/config/banks";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { isDeployed } from "@/lib/env";
import JSZip from "jszip";

const MAX_FILES = 20;
const MAX_SIZE_MB = 50;
const FREE_PAGE_CAP = TIER_CONFIG.FREE.pagesPerMonth;

interface FileResult {
  fileName: string;
  pageCount: number;
  transactionCount: number;
  bankName: string | null;
  exportUrls: { csv?: string; xlsx?: string };
  error?: string;
}

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findById(session.sub);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const formData = await req.formData();
  const rawFiles = formData.getAll("files[]") as File[];
  const exportFormats = ((formData.get("export_formats") as string) || "csv,xlsx")
    .split(",").map(f => f.trim().toLowerCase());

  if (rawFiles.length === 0) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
  }

  // ── Unpack ZIP if a single .zip was submitted ──────────────────────────────
  let pdfFiles: { name: string; bytes: Buffer }[] = [];

  for (const file of rawFiles) {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) continue;
    const bytes = Buffer.from(await file.arrayBuffer());

    if (file.name.toLowerCase().endsWith(".zip") || file.type === "application/zip") {
      const zip = await JSZip.loadAsync(bytes);
      const entries = Object.entries(zip.files);

      // BUG-12: guard against ZIP bombs — a ~1 MB ZIP can decompress to gigabytes,
      // exhausting server memory and crashing the process. Cap both entry count and
      // total extracted size before touching any entry content.
      if (entries.length > 500) {
        return NextResponse.json(
          { error: "ZIP contains too many files. Maximum 500 entries allowed." },
          { status: 400 }
        );
      }

      let extractedBytes = 0;
      const MAX_EXTRACTED_BYTES = 500 * 1024 * 1024; // 500 MB across all entries

      for (const [name, entry] of entries) {
        if (!name.toLowerCase().endsWith(".pdf") || entry.dir) continue;
        const buf = Buffer.from(await entry.async("arraybuffer"));
        extractedBytes += buf.length;
        if (extractedBytes > MAX_EXTRACTED_BYTES) {
          return NextResponse.json(
            { error: "Extracted ZIP contents exceed the 500 MB limit." },
            { status: 413 }
          );
        }
        pdfFiles.push({ name, bytes: buf });
      }
    } else if (file.name.toLowerCase().endsWith(".pdf")) {
      pdfFiles.push({ name: file.name, bytes });
    }
  }

  if (pdfFiles.length === 0) {
    return NextResponse.json({ error: "No valid PDF files found." }, { status: 400 });
  }

  pdfFiles = pdfFiles.slice(0, MAX_FILES);

  // ── Page budget check ──────────────────────────────────────────────────────
  const totalPages = pdfFiles.reduce((sum, f) => sum + countPdfPages(f.bytes), 0);
  const { tier, pagesUsed, monthlyPageLimit } = user;

  if (tier === "FREE") {
    const remaining = Math.max(0, FREE_PAGE_CAP - pagesUsed);
    if (totalPages > remaining) {
      return NextResponse.json({
        error: "PAYMENT_REQUIRED",
        message: `Bulk upload requires ${totalPages} pages but you only have ${remaining} free pages left.`,
        totalPages,
      }, { status: 402 });
    }
  } else if (["PRO", "BUSINESS"].includes(tier)) {
    if (pagesUsed + totalPages > monthlyPageLimit) {
      return NextResponse.json({
        error: "PAYMENT_REQUIRED",
        message: `Bulk upload requires ${totalPages} pages but you only have ${monthlyPageLimit - pagesUsed} pages remaining this month.`,
        totalPages,
      }, { status: 402 });
    }
  }

  // ── Process each file ──────────────────────────────────────────────────────
  const backendUrl = process.env.BACKEND_URL_SERVER ?? "http://localhost:8000";
  const results: FileResult[] = [];

  for (const { name, bytes } of pdfFiles) {
    try {
      let transactions = generateMockTransactions(countPdfPages(bytes));
      let bankName: string | null = inferBankName(name);
      let backendSucceeded = false;

      // Try FastAPI upstream
      try {
        const fd = new FormData();
        fd.append("file", new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }), name);
        fd.append("export_formats", exportFormats.join(","));
        const up = await fetch(`${backendUrl}/api/process-statement`, {
          method: "POST",
          body: fd,
          signal: AbortSignal.timeout(120_000),
          headers: { "x-api-key": process.env.BACKEND_API_KEY ?? "" } as HeadersInit,
        });
        if (up.ok) {
          const d = await up.json();
          transactions = d.transactions ?? transactions;
          bankName = d.bank_name ?? bankName;
          backendSucceeded = true;
        }
      } catch { /* FastAPI unreachable — handled below */ }

      // Never return fabricated transactions in a deployed environment.
      if (!backendSucceeded && isDeployed()) {
        results.push({
          fileName: name,
          pageCount: 0,
          transactionCount: 0,
          bankName,
          exportUrls: {},
          error: "Extraction service unavailable",
        });
        continue;
      }

      const exportUrls: { csv?: string; xlsx?: string } = {};
      if (exportFormats.includes("csv")) {
        const content = transactionsToCSV(transactions);
        exportUrls.csv = `data:text/csv;base64,${Buffer.from(content).toString("base64")}`;
      }
      if (exportFormats.includes("xlsx")) {
        const buf = transactionsToExcel(transactions);
        exportUrls.xlsx = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${buf.toString("base64")}`;
      }

      results.push({
        fileName: name,
        pageCount: countPdfPages(bytes),
        transactionCount: transactions.length,
        bankName,
        exportUrls,
      });
    } catch (err) {
      results.push({
        fileName: name,
        pageCount: 0,
        transactionCount: 0,
        bankName: null,
        exportUrls: {},
        error: err instanceof Error ? err.message : "Processing failed",
      });
    }
  }

  // ── Record usage ───────────────────────────────────────────────────────────
  const successPages = results
    .filter(r => !r.error)
    .reduce((s, r) => s + r.pageCount, 0);
  if (successPages > 0) await incrementPages(session.sub, successPages);

  return NextResponse.json({
    success: true,
    totalFiles: results.length,
    successCount: results.filter(r => !r.error).length,
    totalPages: successPages,
    results,
  });
}

