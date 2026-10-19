/**
 * In-app bank-statement extraction. Runs entirely inside the Next.js server —
 * no separate FastAPI/Python backend required.
 *
 *   1. Text PDFs  → parsed with unpdf (pdf.js) + columnar heuristics. Zero config.
 *   2. Scanned PDFs → Vision: Gemini first (free tier, GEMINI_API_KEY), then
 *      Claude (claude-sonnet-4-6, ANTHROPIC_API_KEY) as the paid backup.
 *
 * Ported from the original Python backend (backend/main.py).
 */
import { extractText, getDocumentProxy } from "unpdf";
import Anthropic from "@anthropic-ai/sdk";
import type { Transaction } from "@/types/billing";
import { inferBankName } from "@/lib/config/banks";
import { getRedis } from "@/lib/redis";

// Denial-of-wallet/quota guard: Vision calls hit external providers (Gemini
// free-tier quota, Claude spend). Cap invocations per IP/day and globally/day.
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
  /** Extra context for "vision_error" (e.g. the provider's error message). */
  detail?: string;
}

type VisionOutcome =
  | { status: "ok"; transactions: Transaction[]; bankName: string | null }
  | { status: "no_key" }
  | { status: "error"; detail: string };

// ── Categorisation (ported from backend _categorise) ───────────────────────────

const CATEGORY_RULES: [string[], string][] = [
  [["SALARY", "PAYROLL", "NEFT CR", "RTGS CR"], "Income"],
  // Specific US vendors before the generic "AMAZON" shopping rule below.
  [["AMAZON WEB SERVICES", "AWS", "GOOGLE CLOUD", "MICROSOFT 365", "ADOBE", "INTUIT", "QUICKBOOKS", "GITHUB", "DROPBOX", "ZOOM", "SLACK"], "Software"],
  [["EMI", "LOAN", "HOUSING", "HOME LOAN", "CAR LOAN"], "Loan EMI"],
  [["SIP", "MUTUAL FUND", "ZERODHA", "GROWW", "NSDL", "CDSL"], "Investments"],
  [["LIC", "INSURANCE", "HDFC LIFE", "BAJAJ", "STAR HEALTH", "ICICI PRU"], "Insurance"],
  [["ELECTRICITY", "WATER BILL", "GAS", "JIO", "AIRTEL", "BSNL", "VODAFONE", "MSEDCL", "BESCOM"], "Utilities"],
  [["SWIGGY", "ZOMATO", "DOMINOS", "PIZZA", "RESTAURANT", "FOOD"], "Food & Dining"],
  [["AMAZON", "FLIPKART", "MYNTRA", "MEESHO", "SNAPDEAL", "NYKAA"], "Shopping"],
  [["IRCTC", "RAILWAY", "FLIGHT", "MAKEMYTRIP", "GOIBIBO", "REDBUS", "OYO"], "Travel"],
  [["OLA", "UBER", "RAPIDO", "AUTO", "METRO", "PETROL", "HPCL", "BPCL", "HP GAS"], "Transport"],
  [["ATM", "CASH WDL", "CASH WITHDRAWAL"], "Cash"],
  // ── US rules ──────────────────────────────────────────────────────────────
  [["DIRECT DEP", "ADP PAYROLL", "GUSTO", "PAYCHEX", "PAYROLL"], "Income"],
  [["SHELL OIL", "CHEVRON", "EXXON", "MOBIL", "ARCO", "CIRCLE K", "SPEEDWAY"], "Fuel"],
  [["AMAZON WEB SERVICES", "AWS", "GOOGLE CLOUD", "MICROSOFT 365", "ADOBE", "INTUIT", "QUICKBOOKS", "GITHUB", "DROPBOX", "ZOOM", "SLACK"], "Software"],
  [["STARBUCKS", "MCDONALD", "CHIPOTLE", "DOORDASH", "UBER EATS", "GRUBHUB", "DUNKIN"], "Food & Dining"],
  [["WALMART", "TARGET", "COSTCO", "BEST BUY", "HOME DEPOT", "LOWES", "AMAZON MKTPLACE", "AMZN"], "Shopping"],
  [["COMCAST", "XFINITY", "VERIZON", "AT&T", "T-MOBILE", "PG&E", "DUKE ENERGY", "CON EDISON"], "Utilities"],
  [["IRS", "US TREASURY", "STATE TAX", "FRANCHISE TAX"], "Taxes"],
  [["SERVICE CHARGE", "SERVICE FEE", "MONTHLY MAINTENANCE FEE", "MONTHLY FEE", "OVERDRAFT", "NSF FEE", "WIRE FEE"], "Bank Fees"],
  [["UPI", "NEFT", "RTGS", "IMPS", "TRANSFER", "ZELLE", "VENMO", "WIRE"], "Transfer"],
];

/** Apply a user's learned category rules (substring match, first hit wins). */
export function applyUserCategoryRules(
  transactions: Transaction[],
  rules: [string, string][] | undefined
): Transaction[] {
  if (!rules || rules.length === 0) return transactions;
  return transactions.map((t) => {
    const d = (t.description ?? "").toUpperCase();
    for (const [pattern, category] of rules) {
      if (pattern && d.includes(pattern.toUpperCase())) return { ...t, category };
    }
    return t;
  });
}

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

const VISION_PROMPT = `You are extracting bank statement transactions.
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

/** Parse a vision provider's JSON reply into pipeline transactions. Throws on bad JSON. */
function parseVisionJson(rawText: string): { transactions: Transaction[]; bankName: string | null } {
  let raw = rawText.trim();
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

  return { transactions, bankName: parsed.bank_name ?? null };
}

/** Image variant of the Claude vision call (receipts / photos). Same provider
 *  and key as the PDF path — only the content block differs. */
async function extractWithClaudeImage(bytes: Buffer, mimeType: string): Promise<VisionOutcome> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { status: "no_key" };

  const client = new Anthropic({ apiKey });
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: bytes.toString("base64"),
              },
            },
            { type: "text", text: VISION_PROMPT },
          ],
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { status: "error", detail: "Claude Vision returned no text" };
    }

    const { transactions, bankName } = parseVisionJson(textBlock.text);
    return { status: "ok", transactions, bankName };
  } catch (err) {
    console.error("[extraction] Claude image vision failed:", err);
    const detail = err instanceof Error ? err.message.slice(0, 200) : "unknown error";
    return { status: "error", detail: `Claude: ${detail}` };
  }
}

/**
 * Extract line items from a receipt photo/scan. Reuses the same vision chain
 * as scanned PDFs (Gemini free tier first, Claude as the paid backup) — no
 * new providers or keys. Returns method "none" with a precise reason when
 * nothing could read the image.
 */
export async function extractReceiptFromImage(
  bytes: Buffer,
  mimeType: string,
  clientIp?: string
): Promise<ExtractionResult> {
  if (await visionBudgetExceeded(clientIp)) {
    return {
      transactions: [],
      bankName: null,
      method: "none",
      reason: "vision_error",
      detail: "Daily scanned-document limit reached — please try again later.",
    };
  }
  const g = await extractWithGeminiVision(bytes, mimeType);
  if (g.status === "ok") {
    return { transactions: g.transactions, bankName: g.bankName, method: "vision" };
  }
  if (g.status === "no_key") {
    // Try the Claude backup before giving up.
    const c = await extractWithClaudeImage(bytes, mimeType);
    if (c.status === "ok") return { transactions: c.transactions, bankName: c.bankName, method: "vision" };
    if (c.status === "no_key") {
      return { transactions: [], bankName: null, method: "none", reason: "no_vision_key" };
    }
    return { transactions: [], bankName: null, method: "none", reason: "vision_error", detail: c.detail };
  }
  return { transactions: [], bankName: null, method: "none", reason: "vision_error", detail: g.detail };
}

async function extractWithClaudeVision(bytes: Buffer): Promise<VisionOutcome> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { status: "no_key" };

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
      return { status: "error", detail: "Claude Vision returned no text" };
    }

    const { transactions, bankName } = parseVisionJson(textBlock.text);
    return { status: "ok", transactions, bankName };
  } catch (err) {
    console.error("[extraction] Claude Vision failed:", err);
    const detail = err instanceof Error ? err.message.slice(0, 200) : "unknown error";
    return { status: "error", detail: `Claude: ${detail}` };
  }
}

// ── Gemini Vision (scanned PDFs, free tier — tried first) ─────────────────────

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

async function geminiGenerate(
  apiKey: string,
  model: string,
  base64Data: string,
  mimeType = "application/pdf"
): Promise<string> {
  const res = await fetch(`${GEMINI_API_BASE}/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: VISION_PROMPT },
            { inline_data: { mime_type: mimeType, data: base64Data } },
          ],
        },
      ],
      generationConfig: { temperature: 0, responseMimeType: "application/json", maxOutputTokens: 16000 },
    }),
    signal: AbortSignal.timeout(120_000),
  });

  const data = (await res.json().catch(() => null)) as {
    error?: { message?: string };
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  } | null;

  if (!res.ok) {
    throw new Error(`${res.status}: ${String(data?.error?.message ?? "request failed").slice(0, 160)}`);
  }

  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p) => (typeof p?.text === "string" ? p.text : "")).join("");
  if (!text) throw new Error("Gemini returned no text");
  return text;
}

/** List the Flash models this project can call, best first (names shift over time). */
async function discoverGeminiModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch(`${GEMINI_API_BASE}/models`, {
      headers: { "x-goog-api-key": apiKey },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>;
    };
    const names = (data?.models ?? [])
      .filter((m) => (m?.supportedGenerationMethods ?? []).includes("generateContent"))
      .map((m) => String(m?.name ?? "").replace(/^models\//, ""))
      .filter((n) => n.includes("flash") && !n.includes("image") && !n.includes("tts") && !n.includes("audio") && !n.includes("live"));
    // Current flagship first, then full Flash models (API order), then Flash-Lite.
    const rank = (n: string) => (n === "gemini-3.8-flash" ? 0 : n.includes("lite") ? 2 : 1);
    names.sort((a, b) => rank(a) - rank(b));
    return names;
  } catch {
    return [];
  }
}

async function extractWithGeminiVision(bytes: Buffer, mimeType = "application/pdf"): Promise<VisionOutcome> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { status: "no_key" };

  const base64Pdf = bytes.toString("base64");
  // NOTE: a model can be listed yet closed to new users (e.g. gemini-2.5-flash
  // returns 404 for new projects) — so on a model-availability error we walk
  // the discovered model list until one actually answers.
  const candidates: string[] = [process.env.GEMINI_MODEL ?? "gemini-3.8-flash"];
  let lastDetail = "unknown error";

  for (let attempt = 0; attempt < 3; attempt++) {
    const model = candidates[attempt];
    if (!model) break;
    try {
      const text = await geminiGenerate(apiKey, model, base64Pdf, mimeType);
      const { transactions, bankName } = parseVisionJson(text);
      return { status: "ok", transactions, bankName };
    } catch (err) {
      lastDetail = err instanceof Error ? err.message : "unknown error";
      if (!/404|not found|not supported|no longer available/i.test(lastDetail)) break;
      if (attempt === 0) {
        const discovered = await discoverGeminiModels(apiKey);
        for (const m of discovered) if (!candidates.includes(m)) candidates.push(m);
      }
    }
  }
  return { status: "error", detail: `Gemini: ${lastDetail.slice(0, 200)}` };
}

// ── Vision dispatcher: Gemini (free) first, Claude (paid) as backup ────────────

async function extractWithVision(bytes: Buffer, clientIp?: string): Promise<VisionOutcome> {
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;
  if (!hasGemini && !hasClaude) return { status: "no_key" };

  if (await visionBudgetExceeded(clientIp)) {
    return { status: "error", detail: "Daily scanned-document limit reached — please try again later." };
  }

  const errors: string[] = [];
  if (hasGemini) {
    const g = await extractWithGeminiVision(bytes);
    if (g.status === "ok") return g;
    if (g.status === "error") errors.push(g.detail);
  }
  if (hasClaude) {
    const c = await extractWithClaudeVision(bytes);
    if (c.status === "ok") return c;
    if (c.status === "error") errors.push(c.detail);
  }
  return { status: "error", detail: errors.join(" | ").slice(0, 300) || "Vision extraction failed" };
}

// ── Public entry point ───────────────────────────────────────────────────────────

/**
 * Extract transactions from a PDF. Tries text parsing first (free, no external
 * calls), then Vision for scanned PDFs (Gemini free tier first, Claude backup).
 * Never fabricates data — returns method "none" with an empty list if nothing reads.
 */
export async function extractTransactions(bytes: Buffer, fileName: string, clientIp?: string, userRules?: [string, string][]): Promise<ExtractionResult> {
  let firstPageText = "";
  try {
    const { lines, firstPageText: fpt } = await extractPdfText(bytes);
    firstPageText = fpt;
    const transactions = parseTransactionsFromText(lines);
    if (transactions.length > 0) {
      return { transactions: applyUserCategoryRules(transactions, userRules), bankName: inferBankName(fileName, firstPageText), method: "text" };
    }
  } catch (err) {
    console.error("[extraction] text extraction failed:", err);
  }

  // No text-layer transactions → likely scanned. Try Vision if configured.
  const vision = await extractWithVision(bytes, clientIp);
  if (vision.status === "ok" && vision.transactions.length > 0) {
    return {
      transactions: applyUserCategoryRules(vision.transactions, userRules),
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
