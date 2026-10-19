/**
 * Cleanup analysis — extends the QBO checker (lib/ofx-check.ts) into a
 * duplicate finder / cleanup report. Pure parsing, no network, no storage.
 *
 * Accepts OFX/QBO/QFX (via analyzeOfx) or CSV (date/description/amount with
 * optional balance + cleared columns). Returns structured duplicate groups,
 * a 0–100 Health Score, and the balance-chain result when the file carries
 * running balances.
 */
import { analyzeOfx, type OfxTxn } from "@/lib/ofx-check";
import { verifyBalanceChain, transactionsToQBO } from "@/lib/mock-transactions";
import type { Transaction } from "@/types/billing";

export interface CleanupRow {
  index: number;
  date: string;
  name: string;
  amount: number;
  fitid: string | null;
  balance: number | null;
  cleared: string | null;
}

export interface DuplicateGroup {
  kind: "exact-fitid" | "exact-match" | "near-match";
  rows: CleanupRow[];
  note: string;
}

export interface CleanupIssue {
  level: "error" | "warning";
  message: string;
}

export interface CleanupAnalysis {
  source: "ofx" | "csv";
  fileKind: string;
  currency: string | null;
  accountMasked: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  ledgerBalance: number | null;
  transactionCount: number;
  creditsTotal: number;
  debitsTotal: number;
  netChange: number;
  duplicateGroups: DuplicateGroup[];
  duplicateInstances: number;
  errorCount: number;
  warningCount: number;
  healthScore: number;
  issues: CleanupIssue[];
  balanceChecked: boolean;
  balanceOk: boolean | null;
  staleUncleared: number;
  rows: CleanupRow[]; // first 500, for the report table
}

const r2 = (n: number) => Math.round(n * 100) / 100;

function looksLikeOfx(text: string): boolean {
  return /OFXHEADER\s*:/i.test(text) || /<OFX>/i.test(text);
}

// ── CSV parsing ─────────────────────────────────────────────────────────────

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else inQ = false;
      } else cur += c;
    } else if (c === '"') {
      inQ = true;
    } else if (c === ",") {
      out.push(cur); cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

const DATE_COLS = ["date", "posted", "posting date", "transaction date", "post date", "txn date"];
const NAME_COLS = ["description", "memo", "name", "payee", "details", "narrative", "transaction details"];
const AMT_COLS = ["amount", "amt", "value", "debit/credit"];
const BAL_COLS = ["balance", "running balance", "bal", "ledger balance"];
const CLR_COLS = ["clr", "cleared", "status", "reconciled", "rec"];

function findCol(headers: string[], names: string[]): number {
  for (const n of names) {
    const i = headers.indexOf(n);
    if (i >= 0) return i;
  }
  return -1;
}

function parseMoney(raw: string): number | null {
  if (!raw) return null;
  let s = raw.trim();
  const neg = /^\(.*\)$/.test(s) || s.startsWith("-");
  s = s.replace(/[()$,£€\s]/g, "");
  if (!/^-?[\d,]*\.?\d+$/.test(s.replace(/,/g, ""))) return null;
  const v = parseFloat(s.replace(/,/g, ""));
  if (Number.isNaN(v)) return null;
  return neg && v > 0 ? -v : v;
}

function parseDateFlex(raw: string): string {
  const s = (raw ?? "").trim();
  if (!s) return "";
  let m = s.match(/^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/);
  if (m) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  }
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return "";
}

function parseCsvRows(text: string): CleanupRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const di = findCol(headers, DATE_COLS);
  const ni = findCol(headers, NAME_COLS);
  const ai = findCol(headers, AMT_COLS);
  const bi = findCol(headers, BAL_COLS);
  const ci = findCol(headers, CLR_COLS);
  if (di < 0 || ni < 0 || ai < 0) return [];
  const rows: CleanupRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const amount = parseMoney(cells[ai] ?? "");
    if (amount === null) continue;
    rows.push({
      index: i - 1,
      date: parseDateFlex(cells[di] ?? ""),
      name: (cells[ni] ?? "").trim().slice(0, 120),
      amount,
      fitid: null,
      balance: bi >= 0 ? parseMoney(cells[bi] ?? "") : null,
      cleared: ci >= 0 ? (cells[ci] ?? "").trim().toUpperCase() : null,
    });
  }
  return rows;
}

// ── Name normalization + fuzzy match ─────────────────────────────────────────

function normName(s: string): string {
  return (s ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function similarNames(a: string, b: string): boolean {
  const na = normName(a);
  const nb = normName(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.length >= 6 && nb.length >= 6 && (na.includes(nb) || nb.includes(na))) return true;
  // Same reference number (e.g. AMZN MKTP US*2R3T41 vs Amazon Mktp US 2R3T41):
  // identical digit-bearing tokens are a strong same-transaction signal.
  const numToks = (s: string) =>
    (s.toUpperCase().match(/[A-Z0-9]*\d[A-Z0-9]*/g) ?? []).filter((t) => t.length >= 3);
  const ta = new Set(numToks(a));
  const tb = new Set(numToks(b));
  for (const t of ta) if (tb.has(t)) return true;
  const ga = new Set(na.match(/.{1,4}/g) ?? []);
  const gb = new Set(nb.match(/.{1,4}/g) ?? []);
  let common = 0;
  for (const t of ga) if (gb.has(t)) common++;
  const jaccard = common / (ga.size + gb.size - common);
  return jaccard >= 0.6;
}

function dateDiffDays(a: string, b: string): number {
  if (!a || !b) return 999;
  return Math.abs((new Date(a).getTime() - new Date(b).getTime()) / 86_400_000);
}

// ── Main analysis ───────────────────────────────────────────────────────────

export function analyzeCleanup(text: string, fileName: string): CleanupAnalysis {
  const ofx = looksLikeOfx(text) || /\.(qbo|ofx|qfx)$/i.test(fileName);
  const issues: CleanupIssue[] = [];
  let rows: CleanupRow[] = [];
  let base: ReturnType<typeof analyzeOfx> | null = null;

  if (ofx) {
    base = analyzeOfx(text);
    rows = base.transactions.map((t: OfxTxn, i: number) => ({
      index: i,
      date: t.date,
      name: t.name,
      amount: t.amount,
      fitid: t.fitid,
      balance: null,
      cleared: null,
    }));
    for (const i of base.issues) issues.push({ level: i.level, message: i.message });
  } else {
    rows = parseCsvRows(text);
    if (rows.length === 0) {
      issues.push({
        level: "error",
        message:
          "We couldn't read any transactions from this CSV. It needs a header row with date, description, and amount columns (balance and cleared columns are optional but help the check).",
      });
    }
  }

  // ── Duplicate engine ──
  const duplicateGroups: DuplicateGroup[] = [];

  // 1. Exact FITID repeats
  const fitidIdx = new Map<string, number[]>();
  rows.forEach((r, i) => {
    if (r.fitid) {
      const list = fitidIdx.get(r.fitid) ?? [];
      list.push(i);
      fitidIdx.set(r.fitid, list);
    }
  });
  for (const [, idxs] of fitidIdx) {
    if (idxs.length > 1) {
      duplicateGroups.push({
        kind: "exact-fitid",
        rows: idxs.map((i) => rows[i]),
        note: "Same transaction ID appears more than once. QuickBooks treats a repeated FITID as already imported and may silently skip real transactions.",
      });
    }
  }

  // 2. Exact matches: same date + amount + normalized name
  const exactIdx = new Map<string, number[]>();
  rows.forEach((r, i) => {
    const key = `${r.date}|${r2(r.amount)}|${normName(r.name)}`;
    const list = exactIdx.get(key) ?? [];
    list.push(i);
    exactIdx.set(key, list);
  });
  const exactCovered = new Set<number>();
  for (const [, idxs] of exactIdx) {
    if (idxs.length > 1) {
      // Skip groups already reported as exact-fitid duplicates (same single FITID).
      const fids = new Set(idxs.map((i) => rows[i].fitid).filter(Boolean));
      if (fids.size === 1) continue;
      duplicateGroups.push({
        kind: "exact-match",
        rows: idxs.map((i) => rows[i]),
        note: "Identical date, amount, and payee with no shared transaction ID — a classic double export or typed-twice entry.",
      });
      idxs.forEach((i) => exactCovered.add(i));
    }
  }

  // 3. Near matches: same amount, dates within ±3 days, similar payee name
  const nearSeen = new Set<number>();
  for (let i = 0; i < rows.length; i++) {
    if (nearSeen.has(i) || exactCovered.has(i)) continue;
    const group = [i];
    for (let j = i + 1; j < rows.length; j++) {
      if (nearSeen.has(j) || exactCovered.has(j)) continue;
      const a = rows[i];
      const b = rows[j];
      if (Number.isNaN(a.amount) || Number.isNaN(b.amount)) continue;
      if (r2(a.amount) !== r2(b.amount)) continue;
      if (a.date === b.date && normName(a.name) === normName(b.name)) continue; // already exact
      if (dateDiffDays(a.date, b.date) <= 3 && similarNames(a.name, b.name)) {
        group.push(j);
        nearSeen.add(j);
      }
    }
    if (group.length > 1) {
      nearSeen.add(i);
      duplicateGroups.push({
        kind: "near-match",
        rows: group.map((k) => rows[k]),
        note: "Same amount within 3 days with a similar payee name (e.g. AMZN vs Amazon). These are often the same transaction recorded twice — please review before deleting.",
      });
    }
  }

  // ── Balance chain (only when the file carries running balances, i.e. CSV) ──
  let balanceChecked = false;
  let balanceOk: boolean | null = null;
  const withBal = rows.filter((r) => r.balance !== null && r.balance !== undefined);
  if (withBal.length >= 2) {
    const txns: Transaction[] = withBal.map((r) => ({
      date: r.date || "1970-01-01",
      description: r.name,
      amount: r.amount,
      balance: r.balance,
      category: null,
      reference: null,
    }));
    const chain = verifyBalanceChain(txns);
    balanceChecked = chain.checked;
    balanceOk = chain.checked ? chain.ok : null;
    if (chain.checked && !chain.ok) {
      issues.push({
        level: "error",
        message:
          "The running-balance chain breaks somewhere in this file: previous balance + transaction does not equal the next balance. The file's own math disagrees with itself — reconcile against the statement before importing.",
      });
    }
  }

  // ── Stale uncleared (CSV with a cleared/status column) ──
  let staleUncleared = 0;
  if (rows.some((r) => r.cleared !== null)) {
    const dated = rows.filter((r) => r.date);
    const refDate = dated.length
      ? dated.map((r) => r.date).sort().pop()!
      : new Date().toISOString().slice(0, 10);
    const ref = new Date(refDate).getTime();
    staleUncleared = rows.filter((r) => {
      if (!r.date) return false;
      const isCleared = /^(Y|YES|C|CLEARED|R|RECONCILED|X|\*)$/.test(r.cleared ?? "");
      if (isCleared) return false;
      return (ref - new Date(r.date).getTime()) / 86_400_000 > 90;
    }).length;
    if (staleUncleared > 0) {
      issues.push({
        level: "warning",
        message: `${staleUncleared} uncleared transaction(s) are more than 90 days old. Old uncleared items are the usual reason a reconciliation difference never goes to zero — clear, void, or delete them.`,
      });
    }
  }

  // ── Health score ──
  const duplicateInstances = duplicateGroups.reduce((s, g) => s + g.rows.length - 1, 0);
  const errorCount = issues.filter((i) => i.level === "error").length;
  const warningCount = issues.filter((i) => i.level === "warning").length;
  const healthScore = Math.max(0, 100 - errorCount * 10 - duplicateInstances * 5 - warningCount * 2);

  const validAmounts = rows.filter((r) => !Number.isNaN(r.amount));
  const creditsTotal = r2(validAmounts.filter((r) => r.amount > 0).reduce((s, r) => s + r.amount, 0));
  const debitsTotal = r2(validAmounts.filter((r) => r.amount < 0).reduce((s, r) => s + r.amount, 0));

  return {
    source: ofx ? "ofx" : "csv",
    fileKind: base?.fileKind ?? "CSV (bank / QuickBooks transaction export)",
    currency: base?.currency ?? null,
    accountMasked: base?.accountMasked ?? null,
    periodStart: base?.periodStart ?? null,
    periodEnd: base?.periodEnd ?? null,
    ledgerBalance: base?.ledgerBalance ?? null,
    transactionCount: rows.length,
    creditsTotal,
    debitsTotal,
    netChange: r2(creditsTotal + debitsTotal),
    duplicateGroups: duplicateGroups.slice(0, 50),
    duplicateInstances,
    errorCount,
    warningCount,
    healthScore,
    issues,
    balanceChecked,
    balanceOk,
    staleUncleared,
    rows: rows.slice(0, 500),
  };
}

// ── Cleaned QBO generation (Pro) ─────────────────────────────────────────────

function cleanFitId(row: CleanupRow, idx: number): string {
  if (row.fitid) return row.fitid;
  const raw = `${row.date}|${row.name}|${row.amount.toFixed(2)}|${idx}`;
  let h = 5381;
  for (let i = 0; i < raw.length; i++) h = ((h << 5) + h + raw.charCodeAt(i)) >>> 0;
  return `CSCLN${h.toString(36).toUpperCase()}${idx + 1}`;
}

/** Drop exact duplicates (repeated FITID or identical date+amount+payee),
 *  regenerate missing/invalid FITIDs, keep near-matches (flagged for review). */
export function buildCleanedTransactions(analysis: CleanupAnalysis): {
  txns: Transaction[];
  removed: number;
} {
  const keep = new Set<number>();
  const skip = new Set<number>();
  for (const g of analysis.duplicateGroups) {
    if (g.kind === "exact-fitid" || g.kind === "exact-match") {
      g.rows.forEach((r, n) => {
        if (n === 0) keep.add(r.index);
        else skip.add(r.index);
      });
    } else {
      g.rows.forEach((r) => keep.add(r.index));
    }
  }
  analysis.rows.forEach((r) => {
    if (!skip.has(r.index) && !keep.has(r.index)) keep.add(r.index);
  });
  const kept = analysis.rows
    .filter((r) => keep.has(r.index))
    .sort((a, b) => a.date.localeCompare(b.date) || a.index - b.index);
  const seenFitid = new Set<string>();
  const txns: Transaction[] = kept.map((r, i) => {
    let fitid = cleanFitId(r, i);
    let n = 1;
    while (seenFitid.has(fitid)) fitid = `${fitid.slice(0, -2)}${n++}`;
    seenFitid.add(fitid);
    return {
      date: r.date || "1970-01-01",
      description: r.name || "Transaction",
      amount: r.amount,
      balance: null,
      category: null,
      reference: fitid, // transactionsToQBO uses reference as FITID verbatim
    };
  });
  return { txns, removed: analysis.rows.length - kept.length };
}

/**
 * Full cleaned QBO body: deduped transactions, unique FITIDs, and the
 * original file's closing balance preserved as the ledger target so the
 * result still passes the balance checks QuickBooks cares about.
 */
export function buildCleanedQbo(analysis: CleanupAnalysis): { qbo: string; removed: number } {
  const { txns, removed } = buildCleanedTransactions(analysis);
  let qbo = transactionsToQBO(txns, "0000000000");
  if (analysis.ledgerBalance !== null) {
    const dtEnd = analysis.periodEnd
      ? analysis.periodEnd.replace(/-/g, "") + "000000"
      : txns.length
        ? txns
            .map((t) => t.date)
            .sort()
            .pop()!
            .replace(/-/g, "") + "000000"
        : null;
    const ledger = `\n<LEDGERBAL>\n<BALAMT>${analysis.ledgerBalance.toFixed(2)}</BALAMT>\n${
      dtEnd ? `<DTASOF>${dtEnd}</DTASOF>\n` : ""
    }</LEDGERBAL>`;
    qbo = qbo.replace("</BANKTRANLIST>", `</BANKTRANLIST>${ledger}`);
  }
  return { qbo, removed };
}
