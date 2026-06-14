/**
 * In-app bank-statement extraction. Runs entirely inside the Next.js server —
 * no separate FastAPI/Python backend required.
 *
 *   1. Text PDFs  → parsed with unpdf (pdf.js) + columnar heuristics. Zero config.
 *   2. Scanned PDFs → Claude Vision (claude-sonnet-4-6) IF ANTHROPIC_API_KEY is set.
 *
 * Ported from the original Python backend (backend/main.py).
 */
import { extractText, getDocumentProxy } from "unpdf";
import Anthropic from "@anthropic-ai/sdk";
import type { Transaction } from "@/types/billing";
import { inferBankName } from "@/lib/config/banks";
import { getRedis } from "@/lib/redis";

// Denial-of-wallet guard: each Vision call is billed to our Anthropic account.
// Cap invocations per IP/day and globally/day so abuse can't run up spend.
const VISION_DAILY_CAP = parseInt(process.env.VISION_DAILY_CAP ?? "2000", 10);
const VISION_IP_DAILY_CAP = parseInt(process.env.VISION_IP_DAILY_CAP ?? "25", 10);

async function visionBudgetExceeded(clientIp?: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false; // no durable store (local dev) — can't enforce
  const day = new Date().toISOString().slice(0, 10);
  const ttl = 93_600; // ~26h
  const g = await redis.incr(`cs:vision:global:${day}`);
  if (g === 1) await redis.expire(`cs:vision:global:${day}`, ttl);
  if (g > VISION_DAILY_CAP) return true;
  if (clientIp) {
    const ipKey = `cs:vision:ip:${clientIp}:${day}`;
    const c = await redis.incr(ipKey);
    if (c === 1) await redis.expire(ipKey, ttl);
    if (c > VISION_IP_DAILY_CAP) return true;
  }
  return false;
}

export type ExtractionMethod = "text" | "vision" | "none";

/** Why extraction produced nothing — drives a precise user/admin message. */
export type ExtractionReason = "no_vision_key" | "vision_error" | "empty";

export interface ExtractionResult {
  transactions: Transaction[];
  bankName: string | null;
  /** "text"/"vision" = a real extractor ran; "none" = nothing could read the file. */
  method: ExtractionMethod;
  /** Set when method === "none". */
  reason?: ExtractionReason;
  /** Extra context for "vision_error" (e.g. the Anthropic error message). */
  detail?: string;
}

type VisionOutcome =
  | { status: "ok"; transactions: Transaction[]; bankName: string | null }
  | { status: "no_key" }
  | { status: "error"; detail: string };

// ── Categorisation (ported from backend _categorise) ───────────────────────────

const CATEGORY_RULES: [string[], string][] = [
  [["SALARY", "PAYROLL", "NEFT CR", "RTGS CR"], "Income"],
  [["EMI", "LOAN", "HOUSING", "HOME LOAN", "CAR LOAN"], "Loan EMI"],
  [["SIP", "MUTUAL FUND", "ZERODHA", "GROWW", "NSDL", "CDSL"], "Investments"],
  [["LIC", "INSURANCE", "HDFC LIFE", "BAJAJ", "STAR HEALTH", "ICICI PRU"], "Insurance"],
  [["ELECTRICITY", "WATER BILL", "GAS", "JIO", "AIRTEL", "BSNL", "VODAFONE", "MSEDCL", "BESCOM"], "Utilities"],
  [["SWIGGY", "ZOMATO", "DOMINOS", "PIZZA", "RESTAURANT", "FOOD"], "Food & Dining"],
  [["AMAZON", "FLIPKART", "MYNTRA", "MEESHO", "SNAPDEAL", "NYKAA"], "Shopping"],
  [["IRCTC", "RAILWAY", "FLIGHT", "MAKEMYTRIP", "GOIBIBO", "REDBUS", "OYO"], "Travel"],
  [["OLA", "UBER", "RAPIDO", "AUTO", "METRO", "PETROL", "HPCL", "BPCL", "HP GAS"], "Transport"],
  [["ATM", "CASH WDL", "CASH WITHDRAWAL"], "Cash"],
  [["UPI", "NEFT", "RTGS", "IMPS", "TRANSFER"], "Transfer"],
];

function categorise(desc: string): string {
  const d = desc.toUpperCase();
  for (const [keywords, category] of CATEGORY_RULES) {
    if (keywords.some((k) => d.includes(k))) return category;
  }
  return "Others";
}

// ── Text parsing (ported from backend extract_from_text) ───────────────────────

const DATE_RE =
  /(\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4}|\d{4}[/\-]\d{2}[/\-]\d{2}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{2,4})/;
const NUM_RE = /[\d,]+\.\d{2}/g;
const CREDIT_KEYWORDS = ["CREDIT", "SALARY", "NEFT CR", "UPI CR", "RTGS CR"];

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function parseTransactionsFromText(lines: string[]): Transaction[] {
  const txns: Transaction[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (line.length < 20) continue;

    const dateMatch = line.match(DATE_RE);
    if (!dateMatch || dateMatch.index === undefined) continue;

    const dateStr = dateMatch[1];
    const afterDate = line.slice(dateMatch.index + dateMatch[0].length).trim();

    const numbers = afterDate.match(NUM_RE);
    if (!numbers) continue;

    // Description is everything before the first number.
    const firstNum = afterDate.match(/[\d,]+\.\d{2}/);
    let desc = (firstNum && firstNum.index !== undefined
      ? afterDate.slice(0, firstNum.index)
      : afterDate
    ).trim();
    desc = desc.replace(/\s{2,}/g, " ").trim();
    if (!desc || desc.length < 3) continue;

    const floats = numbers
      .map((n) => parseFloat(n.replace(/,/g, "")))
      .filter((f) => !Number.isNaN(f));
    if (floats.length === 0) continue;

    const descUpper = desc.toUpperCase();
    const looksCredit = CREDIT_KEYWORDS.some((kw) => descUpper.includes(kw));

    let amount: number;
    let balance: number | null;

    if (floats.length >= 3) {
      // debit  credit  balance
      const [debit, credit, bal] = [floats[floats.length - 3], floats[floats.length - 2], floats[floats.length - 1]];
      amount = debit > 0 && credit === 0 ? -debit : credit;
      balance = bal;
    } else if (floats.length === 2) {
      amount = looksCredit ? Math.abs(floats[0]) : -Math.abs(floats[0]);
      balance = floats[1];
    } else {
      amount = looksCredit ? Math.abs(floats[0]) : -Math.abs(floats[0]);
      balance = null;
    }

    txns.push({
      date: dateStr,
      description: desc,
      amount: round2(amount),
      balance: balance !== null ? round2(balance) : null,
      category: categorise(desc),
      reference: null,
    });
  }

  return txns;
}

// ── unpdf text extraction ──────────────────────────────────────────────────────

async function extractPdfText(bytes: Buffer): Promise<{ lines: string[]; firstPageText: string }> {
  const pdf = await getDocumentProxy(new Uint8Array(bytes));
  const { text } = await extractText(pdf, { mergePages: false });
  const pages = Array.isArray(text) ? text : [text];
  const lines = pages.flatMap((p) => p.split(/\r?\n/));
  return { lines, firstPageText: pages[0] ?? "" };
}

// ── Claude Vision (scanned PDFs) ─────────────────────────────────────────────────

const VISION_PROMPT = `You are extracting Indian bank statement transactions.
Return ONLY a valid JSON object — no markdown, no explanation:

{
  "bank_name": "Bank Name or null",
  "transactions": [
    { "date": "DD/MM/YYYY or YYYY-MM-DD", "description": "narration", "amount": -1234.56, "balance": 50000.00 }
  ]
}

Rules:
- Debits / withdrawals → NEGATIVE amount
- Credits / deposits → POSITIVE amount
- Skip header rows, totals, and page footers
- If no transactions found return an empty array`;

async function extractWithVision(bytes: Buffer, clientIp?: string): Promise<VisionOutcome> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { status: "no_key" };

  if (await visionBudgetExceeded(clientIp)) {
    return { status: "error", detail: "Daily scanned-document limit reached — please try again later." };
  }

  const client = new Anthropic({ apiKey });
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6", // matches the original backend's choice for this task
      max_tokens: 16000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: bytes.toString("base64") },
            },
            { type: "text", text: VISION_PROMPT },
          ],
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { status: "error", detail: "Vision returned no text" };
    }

    let raw = textBlock.text.trim();
    if (raw.startsWith("```")) raw = raw.split("\n").slice(1, -1).join("\n");

    const parsed = JSON.parse(raw) as {
      bank_name?: string | null;
      transactions?: Array<{ date?: string; description?: string; amount?: number; balance?: number | null }>;
    };

    const transactions: Transaction[] = (parsed.transactions ?? []).map((t) => ({
      date: t.date ?? "",
      description: t.description ?? "",
      amount: round2(Number(t.amount ?? 0)),
      balance: t.balance === null || t.balance === undefined ? null : round2(Number(t.balance)),
      category: categorise(t.description ?? ""),
      reference: null,
    }));

    return { status: "ok", transactions, bankName: parsed.bank_name ?? null };
  } catch (err) {
    console.error("[extraction] Vision failed:", err);
    const detail = err instanceof Error ? err.message.slice(0, 200) : "unknown error";
    return { status: "error", detail };
  }
}

// ── Public entry point ───────────────────────────────────────────────────────────

/**
 * Extract transactions from a PDF. Tries text parsing first (free, no external
 * calls), then Claude Vision for scanned PDFs when ANTHROPIC_API_KEY is set.
 * Never fabricates data — returns method "none" with an empty list if nothing reads.
 */
export async function extractTransactions(bytes: Buffer, fileName: string, clientIp?: string): Promise<ExtractionResult> {
  let firstPageText = "";
  try {
    const { lines, firstPageText: fpt } = await extractPdfText(bytes);
    firstPageText = fpt;
    const transactions = parseTransactionsFromText(lines);
    if (transactions.length > 0) {
      return { transactions, bankName: inferBankName(fileName, firstPageText), method: "text" };
    }
  } catch (err) {
    console.error("[extraction] text extraction failed:", err);
  }

  // No text-layer transactions → likely scanned. Try Vision if configured.
  const vision = await extractWithVision(bytes, clientIp);
  if (vision.status === "ok" && vision.transactions.length > 0) {
    return {
      transactions: vision.transactions,
      bankName: vision.bankName ?? inferBankName(fileName, firstPageText),
      method: "vision",
    };
  }

  // Nothing read — say precisely why so the issue is fixable.
  const reason: ExtractionReason =
    vision.status === "no_key" ? "no_vision_key" : vision.status === "error" ? "vision_error" : "empty";
  return {
    transactions: [],
    bankName: inferBankName(fileName, firstPageText),
    method: "none",
    reason,
    detail: vision.status === "error" ? vision.detail : undefined,
  };
}
