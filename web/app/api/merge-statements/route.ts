/**
 * POST /api/merge-statements
 *
 * Accepts the results array from /api/bulk-process, fetches each file's CSV
 * data URL, merges all transactions into a single chronologically-sorted
 * Excel sheet with an added "Bank" column, and returns a data URL for download.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import * as XLSX from "xlsx";

interface FileResult {
  fileName: string;
  bankName: string | null;
  exportUrls: { csv?: string; xlsx?: string };
}

interface MergedRow {
  Date: string;
  Description: string;
  Amount: number;
  Balance: number | null;
  Category: string | null;
  Bank: string;
  Source: string;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { results } = (await req.json()) as { results: FileResult[] };
  if (!Array.isArray(results) || results.length === 0) {
    return NextResponse.json({ error: "No results provided." }, { status: 400 });
  }

  const allRows: MergedRow[] = [];

  for (const result of results) {
    if (!result.exportUrls?.csv) continue;

    try {
      // Decode the data URL
      const dataUrl = result.exportUrls.csv;
      const base64 = dataUrl.split(",")[1];
      const csvText = Buffer.from(base64, "base64").toString("utf8");

      // Parse CSV rows
      const lines = csvText.split("\n").filter(l => l.trim());
      if (lines.length < 2) continue;

      const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim());
      const dateIdx = headers.findIndex(h => h.toLowerCase() === "date");
      const descIdx = headers.findIndex(h => h.toLowerCase().includes("desc"));
      const amtIdx  = headers.findIndex(h => h.toLowerCase().includes("amount"));
      const balIdx  = headers.findIndex(h => h.toLowerCase().includes("balance"));
      const catIdx  = headers.findIndex(h => h.toLowerCase().includes("category"));

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (cols.length < 2) continue;

        const row: MergedRow = {
          Date:        dateIdx >= 0 ? cols[dateIdx] ?? "" : "",
          Description: descIdx >= 0 ? cols[descIdx] ?? "" : "",
          Amount:      amtIdx  >= 0 ? parseFloat(cols[amtIdx] ?? "0") || 0 : 0,
          Balance:     balIdx  >= 0 ? parseFloat(cols[balIdx] ?? "") || null : null,
          Category:    catIdx  >= 0 ? cols[catIdx] ?? null : null,
          Bank:        result.bankName ?? "Unknown",
          Source:      result.fileName,
        };
        allRows.push(row);
      }
    } catch { /* skip malformed files */ }
  }

  if (allRows.length === 0) {
    return NextResponse.json({ error: "No transactions could be extracted." }, { status: 422 });
  }

  // Sort chronologically (best-effort date parse)
  allRows.sort((a, b) => {
    const da = parseDateLoose(a.Date);
    const db = parseDateLoose(b.Date);
    if (!da || !db) return 0;
    return da.getTime() - db.getTime();
  });

  // Build Excel workbook
  const ws = XLSX.utils.json_to_sheet(allRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Merged Statements");

  // Column widths
  ws["!cols"] = [
    { wch: 12 }, { wch: 40 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 28 }, { wch: 36 },
  ];

  const buf = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
  const base64 = Buffer.from(buf).toString("base64");

  return NextResponse.json({
    xlsx: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`,
    transactionCount: allRows.length,
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuote = false;
  let i = 0;
  while (i < line.length) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') {
        // Escaped double-quote ("") inside a quoted field → literal "
        current += '"';
        i += 2;
        continue;
      }
      inQuote = !inQuote;
      i++;
      continue;
    }
    if (ch === "," && !inQuote) {
      result.push(current.trim());
      current = "";
      i++;
      continue;
    }
    current += ch;
    i++;
  }
  result.push(current.trim());
  return result;
}

function parseDateLoose(s: string): Date | null {
  if (!s) return null;
  // Try standard formats: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY
  const m1 = s.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
  if (m1) return new Date(`${m1[3]}-${m1[2]}-${m1[1]}`);
  const m2 = s.match(/^(\d{4})[\/\-](\d{2})[\/\-](\d{2})$/);
  if (m2) return new Date(s);
  return null;
}
