/**
 * Reconciliation finder — compares a bank-statement export against a
 * QuickBooks export and reports what does not line up.
 *
 * Both inputs go through the existing cleanup analysis (analyzeCleanup), so
 * OFX/QBO/QFX and CSV inputs all work, and duplicate detection on each side
 * comes free. Matching is deliberately conservative and explained in plain
 * language: an entry only counts as "matched" when date, amount, and payee
 * agree; everything else is surfaced for review rather than silently merged.
 * Pure parsing, no network, no storage.
 */
import { analyzeCleanup, type CleanupRow } from "@/lib/tools/cleanup-analysis";
import { transactionsToQBO } from "@/lib/mock-transactions";
import type { Transaction } from "@/types/billing";

export type ReconKind = "matched" | "missing" | "extra" | "amount-mismatch" | "date-drift";

export interface ReconEntry {
  kind: ReconKind;
  statement: CleanupRow | null;
  quickbooks: CleanupRow | null;
  note: string;
}

export interface ReconResult {
  statementCount: number;
  quickbooksCount: number;
  matchedCount: number;
  missingCount: number;
  extraCount: number;
  amountMismatchCount: number;
  dateDriftCount: number;
  statementNet: number;
  quickbooksNet: number;
  difference: number;
  entries: ReconEntry[];
  warnings: string[];
}

const r2 = (n: number) => Math.round(n * 100) / 100;

function normName(s: string): string {
  return (s ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function dateDiffDays(a: string, b: string): number {
  if (!a || !b) return 999;
  return Math.abs((new Date(a).getTime() - new Date(b).getTime()) / 86_400_000);
}

function similarNames(a: string, b: string): boolean {
  const na = normName(a);
  const nb = normName(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.length >= 6 && nb.length >= 6 && (na.includes(nb) || nb.includes(na))) return true;
  return false;
}

export function compareStatementToQbo(
  statementText: string,
  statementName: string,
  qboText: string,
  qboName: string
): ReconResult {
  const warnings: string[] = [];
  const stmt = analyzeCleanup(statementText, statementName);
  const qb = analyzeCleanup(qboText, qboName);
  if (stmt.rows.length === 0) {
    throw new Error("We couldn't read any transactions from the bank-statement file. It needs date, description, and amount columns (CSV) or a valid OFX/QBO body.");
  }
  if (qb.rows.length === 0) {
    throw new Error("We couldn't read any transactions from the QuickBooks file. Export transactions from QuickBooks as CSV or QBO and try again.");
  }
  if (stmt.duplicateInstances > 0) {
    warnings.push(`The bank-statement file itself contains ${stmt.duplicateInstances} duplicate instance(s) — clean those first or they will show up as differences here.`);
  }
  if (qb.duplicateInstances > 0) {
    warnings.push(`The QuickBooks file itself contains ${qb.duplicateInstances} duplicate instance(s) — those duplicates appear below as extra entries.`);
  }

  const entries: ReconEntry[] = [];
  const usedQb = new Set<number>();
  const usedStmt = new Set<number>();

  const stmtRows = stmt.rows;
  const qbRows = qb.rows;

  // Pass 1 — exact matches: same date, same amount, same normalized payee.
  for (const s of stmtRows) {
    const j = qbRows.findIndex(
      (q, qi) =>
        !usedQb.has(qi) &&
        q.date === s.date &&
        r2(q.amount) === r2(s.amount) &&
        normName(q.name) === normName(s.name)
    );
    if (j >= 0) {
      usedQb.add(j);
      usedStmt.add(s.index);
      entries.push({ kind: "matched", statement: s, quickbooks: qbRows[j], note: "Date, amount, and payee all agree." });
    }
  }

  // Pass 2 — amount mismatches: same date + similar payee, different amount.
  for (const s of stmtRows) {
    if (usedStmt.has(s.index)) continue;
    const j = qbRows.findIndex(
      (q, qi) => !usedQb.has(qi) && q.date === s.date && similarNames(q.name, s.name)
    );
    if (j >= 0) {
      usedQb.add(j);
      usedStmt.add(s.index);
      entries.push({
        kind: "amount-mismatch",
        statement: s,
        quickbooks: qbRows[j],
        note: `Same date and payee, but the amounts differ by ${r2(Math.abs(qbRows[j].amount - s.amount)).toFixed(2)} — a fee, a partial payment, or a typo.`,
      });
    }
  }

  // Pass 3 — date drift: same amount + similar payee, dates within 7 days.
  for (const s of stmtRows) {
    if (usedStmt.has(s.index)) continue;
    const j = qbRows.findIndex(
      (q, qi) =>
        !usedQb.has(qi) && r2(q.amount) === r2(s.amount) && similarNames(q.name, s.name) && dateDiffDays(q.date, s.date) <= 7
    );
    if (j >= 0) {
      usedQb.add(j);
      usedStmt.add(s.index);
      entries.push({
        kind: "date-drift",
        statement: s,
        quickbooks: qbRows[j],
        note: `Same amount and payee, but posted ${dateDiffDays(qbRows[j].date, s.date)} day(s) apart — usually a posting-date vs cleared-date difference, not a real discrepancy.`,
      });
    }
  }

  // Leftovers: statement rows with no QuickBooks counterpart, and vice versa.
  for (const s of stmtRows) {
    if (!usedStmt.has(s.index)) {
      entries.push({ kind: "missing", statement: s, quickbooks: null, note: "On the bank statement but not in QuickBooks — an unrecorded transaction, or an export that stopped short." });
    }
  }
  qbRows.forEach((q, qi) => {
    if (!usedQb.has(qi)) {
      entries.push({ kind: "extra", statement: null, quickbooks: q, note: "In QuickBooks but not on the statement — a duplicate, a voided entry, or a transaction from another period." });
    }
  });

  const byKind = (k: ReconKind) => entries.filter((e) => e.kind === k).length;
  const statementNet = r2(stmtRows.reduce((s, r) => s + r.amount, 0));
  const quickbooksNet = r2(qbRows.reduce((s, r) => s + r.amount, 0));

  return {
    statementCount: stmtRows.length,
    quickbooksCount: qbRows.length,
    matchedCount: byKind("matched"),
    missingCount: byKind("missing"),
    extraCount: byKind("extra"),
    amountMismatchCount: byKind("amount-mismatch"),
    dateDriftCount: byKind("date-drift"),
    statementNet,
    quickbooksNet,
    difference: r2(statementNet - quickbooksNet),
    entries,
    warnings,
  };
}

/** Matched entries as clean transactions for a corrected QBO (Pro-gated at the route). */
export function matchedEntriesToQbo(result: ReconResult): string {
  const txns: Transaction[] = result.entries
    .filter((e) => e.kind === "matched" && e.statement)
    .map((e, i) => {
      const s = e.statement!;
      const raw = `${s.date}|${s.name}|${s.amount.toFixed(2)}|${i}`;
      let h = 5381;
      for (let k = 0; k < raw.length; k++) h = ((h << 5) + h + raw.charCodeAt(k)) >>> 0;
      return {
        date: s.date || "1970-01-01",
        description: s.name || "Transaction",
        amount: s.amount,
        balance: null,
        category: null,
        reference: `CSREC${h.toString(36).toUpperCase()}${i + 1}`,
      };
    });
  if (txns.length === 0) {
    throw new Error("No matched entries to export.");
  }
  return transactionsToQBO(txns, "0000000000");
}

/** Free CSV report of every difference (matched rows included for reference). */
export function reconToCsv(result: ReconResult): string {
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const lines = [
    "Finding,Statement date,Statement payee,Statement amount,QuickBooks date,QuickBooks payee,QuickBooks amount,Note",
    ...result.entries.map((e) =>
      [
        e.kind,
        e.statement?.date ?? "",
        esc(e.statement?.name ?? ""),
        e.statement ? e.statement.amount.toFixed(2) : "",
        e.quickbooks?.date ?? "",
        esc(e.quickbooks?.name ?? ""),
        e.quickbooks ? e.quickbooks.amount.toFixed(2) : "",
        esc(e.note),
      ].join(",")
    ),
  ];
  return lines.join("\n");
}
