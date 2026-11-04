/**
 * POST /api/tools/bulk-import — free bulk CSV importer for QuickBooks,
 * no account required. One multipart endpoint, two steps:
 *  - step=preview: reads each CSV (max 10 MB each) and returns its
 *    headers, the auto-detected column mapping, the parsed row count
 *    and the first 5 rows, so the browser can show the mapping editor.
 *  - step=build: re-reads the same files with the caller's mapping,
 *    merges every row (10,000 transactions total cap) and returns ONE
 *    import file — a .qbo for QuickBooks Online or an .iif for
 *    QuickBooks Desktop — with an X-Rows header giving the row count.
 * The tool only prepares a file for import. It never connects to
 * QuickBooks and never posts anything into a QuickBooks company.
 * Nothing is stored. Anonymous use is rate-limited by checkUploadRateLimit.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import {
  splitCsvLine,
  autoDetectMapping,
  parseGenericCsv,
  genericRowsToQbo,
  type CsvMapping,
  type GenericRow,
} from "@/lib/tools/csv-to-qbo";
import { buildIif, type IifAccounts } from "@/lib/tools/csv-to-iif";

export const maxDuration = 30;

const MAX_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 20;
const MAX_ROWS = 10_000;

const DEFAULT_ACCOUNTS: IifAccounts = {
  bankAccount: "Business Checking",
  incomeAccount: "Uncategorized Income",
  expenseAccount: "Uncategorized Expense",
};

function normalizeMapping(raw: unknown): CsvMapping | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as Record<string, unknown>;
  const num = (v: unknown) => (typeof v === "number" && Number.isInteger(v) ? v : -1);
  return {
    date: num(m.date),
    payee: num(m.payee),
    amount: num(m.amount),
    debit: num(m.debit),
    credit: num(m.credit),
    memo: num(m.memo),
    balance: num(m.balance),
  };
}

function normalizeAccounts(raw: unknown): IifAccounts {
  if (!raw || typeof raw !== "object") return DEFAULT_ACCOUNTS;
  const a = raw as Record<string, unknown>;
  const str = (v: unknown, fallback: string) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, 80) : fallback;
  return {
    bankAccount: str(a.bankAccount, DEFAULT_ACCOUNTS.bankAccount),
    incomeAccount: str(a.incomeAccount, DEFAULT_ACCOUNTS.incomeAccount),
    expenseAccount: str(a.expenseAccount, DEFAULT_ACCOUNTS.expenseAccount),
  };
}

async function readCsvFiles(formData: FormData): Promise<{ name: string; text: string }[]> {
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    throw new Error("No files received — please add at least one CSV file.");
  }
  if (files.length > MAX_FILES) {
    throw new Error(`Too many files — please add no more than ${MAX_FILES} CSV files at once.`);
  }
  const out: { name: string; text: string }[] = [];
  for (const file of files) {
    if (!/\.csv$/i.test(file.name)) {
      throw new Error(`"${file.name}" is not a .csv file — please choose CSV exports only.`);
    }
    if (file.size > MAX_SIZE) {
      throw new Error(`"${file.name}" is over 10 MB — please try a smaller export.`);
    }
    const text = (await file.text()).replace(/^\uFEFF/, ""); // strip BOM so the first header matches
    if (!text.trim()) {
      throw new Error(`"${file.name}" appears to be empty.`);
    }
    out.push({ name: file.name, text });
  }
  return out;
}

function preview(files: { name: string; text: string }[]): NextResponse {
  const results = files.map((f) => {
    const firstLine = f.text.split(/\r?\n/)[0] ?? "";
    const headers = splitCsvLine(firstLine).map((h) => h.trim());
    const mapping = autoDetectMapping(headers);
    let rowCount = 0;
    let sampleRows: GenericRow[] = [];
    let parseError: string | undefined;
    try {
      const parsed = parseGenericCsv(f.text, mapping);
      rowCount = parsed.rows.length;
      sampleRows = parsed.rows.slice(0, 5);
    } catch (err) {
      parseError = err instanceof Error ? err.message : "Could not read this file.";
    }
    return {
      name: f.name,
      headers,
      mapping,
      rowCount,
      sampleRows,
      ...(parseError ? { parseError } : {}),
    };
  });
  return NextResponse.json({ success: true, files: results });
}

function build(formData: FormData, files: { name: string; text: string }[]): NextResponse {
  const mappingRaw = formData.get("mapping") as string | null;
  let mapping: CsvMapping | null = null;
  if (mappingRaw) {
    try {
      mapping = normalizeMapping(JSON.parse(mappingRaw));
    } catch {
      mapping = null;
    }
  }
  if (!mapping) {
    throw new Error("The column mapping is missing — go back and check the mapping step.");
  }

  const format = String(formData.get("format") ?? "qbo");
  if (format !== "qbo" && format !== "iif") {
    throw new Error("Please choose an output format: QBO or IIF.");
  }

  let accounts = DEFAULT_ACCOUNTS;
  const accountsRaw = formData.get("accounts") as string | null;
  if (accountsRaw) {
    try {
      accounts = normalizeAccounts(JSON.parse(accountsRaw));
    } catch {
      accounts = DEFAULT_ACCOUNTS;
    }
  }

  const rows: GenericRow[] = [];
  for (const f of files) {
    let parsed;
    try {
      parsed = parseGenericCsv(f.text, mapping);
    } catch (err) {
      throw new Error(
        `"${f.name}": ${err instanceof Error ? err.message : "could not be read with this mapping."}`
      );
    }
    rows.push(...parsed.rows);
    if (rows.length > MAX_ROWS) {
      throw new Error(
        `Those files hold more than ${MAX_ROWS.toLocaleString("en-US")} transactions in total — the limit for one import file. Split the files into smaller batches and build one import file per batch.`
      );
    }
  }
  if (rows.length === 0) {
    throw new Error("No transaction rows could be read with this mapping.");
  }

  const headers = (fileName: string) => ({
    "Content-Type": "application/octet-stream",
    "Content-Disposition": `attachment; filename="${fileName}"`,
    "X-Rows": String(rows.length),
  });

  if (format === "iif") {
    return new NextResponse(buildIif(rows, accounts), { headers: headers("bulk-import.iif") });
  }
  return new NextResponse(genericRowsToQbo(rows), { headers: headers("bulk-import.qbo") });
}

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload CSV files." }, { status: 400 });
  }

  const step = String(formData.get("step") ?? "");
  try {
    const files = await readCsvFiles(formData);
    if (step === "preview") return preview(files);
    if (step === "build") return build(formData, files);
    return NextResponse.json(
      { error: 'Unknown step — expected "preview" or "build".' },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not read those files." },
      { status: 400 }
    );
  }
}
