/**
 * POST /api/tools/convert — free statement-format conversion matrix,
 * no account required. Accepts one statement file (max 10 MB) plus a
 * `tool` field naming one of the 19 supported conversion slugs (or,
 * failing that, a `from` + `to` format pair) and returns the converted
 * file as a download. All parsing / emitting lives in
 * lib/tools/convert-matrix.ts; its honest error messages are surfaced
 * as-is. Nothing is stored. Anonymous use is rate-limited by
 * checkUploadRateLimit.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit } from "@/lib/rate-limit";
import {
  CONVERSIONS,
  emitStatement,
  parseStatement,
  type Conversion,
  type InputFormat,
  type OutputFormat,
} from "@/lib/tools/convert-matrix";

export const maxDuration = 30;

const MAX_SIZE = 10 * 1024 * 1024;

const INPUT_FORMATS: InputFormat[] = ["csv", "ofx", "qbo", "qfx", "iif", "qif"];
const OUTPUT_FORMATS: OutputFormat[] = [
  "csv", "xlsx", "ofx", "qfx", "qbo", "iif", "qif", "pdf",
];

/** The "excel" alias used by the qfx-to-excel / qif-to-excel slugs. */
function normalizeOutput(raw: string): OutputFormat | null {
  const v = raw.trim().toLowerCase();
  if (v === "excel") return "xlsx";
  return (OUTPUT_FORMATS as string[]).includes(v) ? (v as OutputFormat) : null;
}

function resolveConversion(formData: FormData): Conversion | null {
  const tool = formData.get("tool");
  if (typeof tool === "string" && tool.trim()) {
    return CONVERSIONS[tool.trim().toLowerCase()] ?? null;
  }
  const fromRaw = formData.get("from");
  const toRaw = formData.get("to");
  if (typeof fromRaw === "string" && typeof toRaw === "string") {
    const from = fromRaw.trim().toLowerCase();
    const to = normalizeOutput(toRaw);
    if ((INPUT_FORMATS as string[]).includes(from) && to) {
      const pair = Object.values(CONVERSIONS).find(
        (c) => c.from === (from as InputFormat) && c.to === to
      );
      return pair ?? null;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const limited = await checkUploadRateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Please upload a statement file." },
      { status: 400 }
    );
  }

  const conversion = resolveConversion(formData);
  if (!conversion) {
    return NextResponse.json(
      { error: "Unsupported conversion. Please choose one of the supported conversion tools." },
      { status: 400 }
    );
  }
  const { from, to } = conversion;

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "That file is over 10 MB — please try a smaller one." },
      { status: 400 }
    );
  }
  const extRe = new RegExp(`\\.${from}$`, "i");
  if (!extRe.test(file.name)) {
    return NextResponse.json(
      { error: `Please choose a .${from} file.` },
      { status: 400 }
    );
  }

  const text = await file.text();
  if (!text || text.length < 20) {
    return NextResponse.json(
      { error: "That file appears to be empty." },
      { status: 400 }
    );
  }

  const base =
    file.name.replace(extRe, "").replace(/[^a-zA-Z0-9._-]+/g, "-") ||
    "statement";

  let parsed;
  let emitted;
  try {
    parsed = parseStatement(from, text);
    emitted = await emitStatement(to, parsed.txns, parsed.meta, base);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "That file could not be converted." },
      { status: 400 }
    );
  }

  const body =
    typeof emitted.body === "string" ? emitted.body : new Uint8Array(emitted.body);
  return new NextResponse(body, {
    headers: {
      "Content-Type": emitted.contentType,
      "Content-Disposition": `attachment; filename="${base}.${emitted.ext}"`,
      "X-Rows": String(parsed.txns.length),
    },
  });
}
