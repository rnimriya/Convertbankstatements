/**
 * 1099 vendor payment checker.
 *
 * Groups outgoing payments by vendor from a bank CSV or a QBO/OFX file so a
 * bookkeeper can see who was paid, how much, and who sits at or above a
 * threshold they choose. Payee names are normalized the same way the
 * cleanup analysis normalizes names (uppercase, punctuation removed,
 * spacing collapsed), plus stripping of store/location numbers and common
 * entity suffixes, so "ACME LLC", "Acme, LLC" and "ACME" group together.
 * Pure parsing, no network, no storage.
 *
 * Informational only — this is not tax filing or tax advice.
 */
import { parseGenericCsv, autoDetectMapping, splitCsvLine } from "@/lib/tools/csv-to-qbo";
import { analyzeOfx } from "@/lib/ofx-check";

export interface VendorTxn {
  date: string;
  payee: string;
  amount: number;
}

export interface VendorGroup {
  vendor: string;
  total: number;
  count: number;
  lastDate: string;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

const ENTITY_SUFFIXES = new Set(["LLC", "INC", "CORP", "CO", "LTD"]);

/**
 * Normalize a payee name for grouping. Mirrors the cleanup-analysis
 * normalization approach (uppercase, strip punctuation, collapse
 * whitespace), then strips trailing store/location numbers (e.g. "#1234"
 * or a trailing digit group) and common entity suffixes (LLC, INC, CORP,
 * CO, LTD) as whole words, repeatedly, so variants of one vendor group
 * together.
 */
export function normalizePayee(name: string): string {
  let s = (name ?? "").toUpperCase();
  // Trailing store/location numbers written as "#1234".
  s = s.replace(/#\s*\d+/g, " ");
  // Remove punctuation, collapse whitespace.
  s = s.replace(/[^A-Z0-9]+/g, " ").replace(/\s+/g, " ").trim();
  // Repeatedly strip a trailing digit group or entity suffix.
  let changed = true;
  while (changed && s) {
    changed = false;
    if (/\s\d+$/.test(s)) {
      s = s.replace(/\s\d+$/, "").trim();
      changed = true;
      continue;
    }
    const words = s.split(" ");
    const last = words[words.length - 1];
    if (words.length > 1 && ENTITY_SUFFIXES.has(last)) {
      s = words.slice(0, -1).join(" ").trim();
      changed = true;
    }
  }
  return s;
}

export function groupVendorPayments(txns: VendorTxn[]): VendorGroup[] {
  interface Acc {
    total: number;
    count: number;
    lastDate: string;
    forms: Map<string, number>;
    firstSeen: Map<string, number>;
  }
  const groups = new Map<string, Acc>();
  let seq = 0;
  for (const t of txns) {
    seq++;
    if (!(t.amount < 0)) continue; // only money out counts as a vendor payment
    const payee = (t.payee ?? "").trim();
    if (!payee) continue;
    const key = normalizePayee(payee) || payee.toUpperCase();
    let acc = groups.get(key);
    if (!acc) {
      acc = { total: 0, count: 0, lastDate: "", forms: new Map(), firstSeen: new Map() };
      groups.set(key, acc);
    }
    acc.total += Math.abs(t.amount);
    acc.count += 1;
    if (t.date && t.date > acc.lastDate) acc.lastDate = t.date;
    acc.forms.set(payee, (acc.forms.get(payee) ?? 0) + 1);
    if (!acc.firstSeen.has(payee)) acc.firstSeen.set(payee, seq);
  }

  const out: VendorGroup[] = [];
  for (const acc of groups.values()) {
    // Display name = most frequent original form in the group
    // (ties go to the form seen first).
    let display = "";
    let bestCount = -1;
    let bestSeq = Infinity;
    for (const [form, n] of acc.forms) {
      const s = acc.firstSeen.get(form) ?? Infinity;
      if (n > bestCount || (n === bestCount && s < bestSeq)) {
        display = form;
        bestCount = n;
        bestSeq = s;
      }
    }
    out.push({ vendor: display, total: r2(acc.total), count: acc.count, lastDate: acc.lastDate });
  }
  out.sort((a, b) => b.total - a.total);
  return out;
}

function csvEscape(v: string): string {
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function vendorReportCsv(groups: VendorGroup[], threshold: number): string {
  const lines = [
    "Vendor,Total Paid,Transactions,Last Payment,At or Above Threshold",
    ...groups.map((g) =>
      [
        csvEscape(g.vendor),
        g.total.toFixed(2),
        String(g.count),
        csvEscape(g.lastDate),
        g.total >= threshold ? "Yes" : "No",
      ].join(",")
    ),
  ];
  return lines.join("\n");
}

export function txnsFromCsv(text: string): VendorTxn[] {
  const firstLine = text.split(/\r?\n/)[0] ?? "";
  const headers = splitCsvLine(firstLine).map((h) => h.trim());
  const mapping = autoDetectMapping(headers);
  const result = parseGenericCsv(text, mapping);
  return result.rows.map((r) => ({ date: r.date, payee: r.payee, amount: r.amount }));
}

export function txnsFromQbo(text: string): VendorTxn[] {
  const analysis = analyzeOfx(text);
  return analysis.transactions
    .filter((t) => !Number.isNaN(t.amount))
    .map((t) => ({ date: t.date, payee: t.name, amount: t.amount }));
}
