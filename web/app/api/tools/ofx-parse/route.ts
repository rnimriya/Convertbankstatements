/**
 * POST /api/tools/ofx-parse — shared parser for the QBO File Editor and
 * the QBO Merger. Accepts 1–10 .qbo/.ofx/.qfx files (max 10 MB each) as
 * multipart files[] and returns each file's transactions and summary as
 * JSON so the client tools can edit or combine them before rebuilding a
 * .qbo at /api/tools/ofx-build. Fully free, no account. Files are parsed
 * in memory and never stored. Anonymous use is rate-limited by
 * checkUploadRateLimit.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import { analyzeOfx } from "@/lib/ofx-check";
import { analyzeQboToCsv } from "@/lib/tools/qbo-to-csv";

export const maxDuration = 30;

const MAX_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 10;

/** Same single-tag read analyzeOfx uses internally — the analysis only
 *  exposes the masked account number, but a rebuilt file needs the real
 *  ACCTID to stay attached to the same QuickBooks account. */
function rawTag(text: string, name: string): string | null {
  const m = text.match(new RegExp(`<${name}>([^<\\r\\n]+)`, "i"));
  return m ? m[1].trim() : null;
}

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload one or more .qbo, .ofx or .qfx files." }, { status: 400 });
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  const single = formData.get("file");
  if (single instanceof File) files.push(single);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Please upload at most ${MAX_FILES} files at a time — ${files.length} were received.` },
      { status: 400 }
    );
  }

  const parsed = [];
  for (const file of files) {
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `${file.name}: that file is over 10 MB — a QBO/OFX file should be far smaller.` },
        { status: 400 }
      );
    }
    if (!/\.(qbo|ofx|qfx)$/i.test(file.name)) {
      return NextResponse.json(
        { error: `${file.name}: please choose .qbo, .ofx or .qfx files.` },
        { status: 400 }
      );
    }
    const text = await file.text();
    if (!text || text.length < 50) {
      return NextResponse.json({ error: `${file.name}: that file appears to be empty.` }, { status: 400 });
    }
    try {
      const result = analyzeQboToCsv(text);
      const analysis = analyzeOfx(text);
      parsed.push({
        name: file.name,
        transactions: result.rows,
        summary: {
          ...result.summary,
          accountId: rawTag(text, "ACCTID"),
          ledgerAsOf: analysis.ledgerAsOf,
        },
        issues: result.issues,
      });
    } catch (err) {
      return NextResponse.json(
        { error: `${file.name}: ${err instanceof Error ? err.message : "Could not parse that file."}` },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ success: true, files: parsed });
}
