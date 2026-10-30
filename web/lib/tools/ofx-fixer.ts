/**
 * OFX / QFX → QBO converter + QBO fixer.
 *
 * Takes a bank OFX (or QFX / QBO) file that QuickBooks rejects or imports
 * badly and rebuilds it as a clean OFX 1.02 Web Connect (.qbo) file:
 * the header is normalized to OFX 1.02, DTPOSTED values become full
 * 14-digit timestamps, and missing or duplicated FITIDs (the transaction
 * IDs QuickBooks uses for duplicate detection) are regenerated
 * deterministically from the transaction itself.
 *
 * INTU.BID honesty rule: this fixer NEVER guesses a bank's ID. The
 * value already in the file is preserved; a value the user types in
 * (copied from a working QBO downloaded from their own bank) overrides
 * it; when neither exists the field is left unset.
 * Pure parsing — no network, no storage.
 */
import { analyzeOfx, type OfxIssue } from "@/lib/ofx-check";
import { transactionsToQBO } from "@/lib/mock-transactions";
import type { Transaction } from "@/types/billing";

export interface OfxFix {
  kind: string;
  count: number;
  detail: string;
}

export interface OfxFixReport {
  fixes: OfxFix[];
  intuBid: string | null;
  intuBidSource: "file" | "user" | null;
  bankName: string | null;
  transactionCount: number;
  issuesBefore: OfxIssue[];
}

export interface OfxFixResult {
  report: OfxFixReport;
  transactions: Transaction[];
  accountId: string;
  currency: string | null;
  // The original file's closing balance, carried through so the rebuilt
  // file does not lose it (fixer transactions carry balance: null, and
  // transactionsToQBO only embeds a ledger balance from balances).
  ledgerBalance: number | null;
  ledgerAsOf: string | null;
}

export interface OfxFixOptions {
  intuBid?: string;
  bankName?: string;
}

function tagRaw(text: string, name: string): string | null {
  const m = text.match(new RegExp(`<${name}>([^<\\r\\n]+)`, "i"));
  return m ? m[1].trim() : null;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Deterministic regenerated FITID — same djb2-style hash as fitIdFor in
 * lib/mock-transactions.ts, over date|name|amount|index, so re-running
 * the fixer on the same file always produces the same IDs and
 * QuickBooks dedupes a re-import instead of duplicating it.
 */
function regeneratedFitId(date: string, name: string, amount: number, index: number): string {
  const amountPart = Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
  const raw = `${date}|${name}|${amountPart}|${index}`;
  let h = 5381;
  for (let i = 0; i < raw.length; i++) h = ((h << 5) + h + raw.charCodeAt(i)) >>> 0;
  return `CSFIX${h.toString(36).toUpperCase()}${index + 1}`;
}

/** The file's existing INTU.BID: a direct <INTU.BID> tag wins; otherwise the <FID> inside an <FI> block. */
function existingIntuBid(text: string): string | null {
  const direct = text.match(/<INTU\.BID>(\d+)/i);
  if (direct) return direct[1];
  const fi = text.match(/<FI>[\s\S]*?<FID>(\d+)/i);
  return fi ? fi[1] : null;
}

function existingOrgName(text: string): string | null {
  const fi = text.match(/<FI>[\s\S]*?<ORG>([^<]+)/i);
  return fi ? fi[1].trim() : null;
}

export function fixOfx(text: string, opts: OfxFixOptions = {}): OfxFixResult {
  const analysis = analyzeOfx(text);
  const fixes: OfxFix[] = [];

  // (a) Header kind — OFXHEADER + VERSION 102 is already OFX 1.02 (QBO).
  // Anything else (OFX 2.x XML, another version, a missing header) is
  // rebuilt as 1.02 by transactionsToQBO below.
  const hasHeader = /OFXHEADER\s*:/i.test(text);
  const versionMatch = text.match(/VERSION\s*:\s*"?([\d.]+)/i) || text.match(/<VERSION>([\d.]+)/i);
  const version = versionMatch?.[1] ?? null;
  const already102 = hasHeader && version === "102";
  if (!already102) {
    fixes.push({
      kind: "header-normalized",
      count: 1,
      detail: "Header normalized to OFX 1.02 (QBO)",
    });
  }

  // (b) DTPOSTED raw values — anything that is not a full 14-digit
  // timestamp (YYYYMMDDHHMMSS) gets normalized on rebuild.
  const dtPostedValues = [...text.matchAll(/<DTPOSTED>([^\s<]+)/gi)].map((m) => m[1]);
  const badDates = dtPostedValues.filter((v) => v.replace(/\D/g, "").length !== 14).length;
  if (badDates > 0) {
    fixes.push({
      kind: "dates-normalized",
      count: badDates,
      detail: `${badDates} date/time value(s) normalized to full OFX timestamps (YYYYMMDDHHMMSS)`,
    });
  }

  // (c) FITIDs — missing IDs and 2nd+ occurrences of a repeated ID are
  // regenerated deterministically; the first occurrence is kept.
  const seen = new Set<string>();
  let missingCount = 0;
  let duplicateCount = 0;
  const transactions: Transaction[] = analysis.transactions.map((t, index) => {
    let fitid = t.fitid;
    if (!fitid) {
      missingCount += 1;
      fitid = regeneratedFitId(t.date, t.name, t.amount, index);
    } else if (seen.has(fitid)) {
      duplicateCount += 1;
      fitid = regeneratedFitId(t.date, t.name, t.amount, index);
    }
    seen.add(fitid);
    return {
      date: t.date,
      description: t.name,
      amount: t.amount,
      balance: null,
      category: null,
      reference: fitid,
    };
  });
  if (missingCount > 0) {
    fixes.push({
      kind: "missing-fitid",
      count: missingCount,
      detail: `${missingCount} transaction(s) had no FITID — a new unique transaction ID was generated for each`,
    });
  }
  if (duplicateCount > 0) {
    fixes.push({
      kind: "duplicate-fitid",
      count: duplicateCount,
      detail: `${duplicateCount} transaction(s) repeated an earlier FITID — each repeat was given a new unique transaction ID`,
    });
  }

  // (d) INTU.BID — user input wins, then the file's own value, else unset.
  const userBid = (opts.intuBid ?? "").replace(/\D/g, "");
  const fileBid = existingIntuBid(text);
  let intuBid: string | null = null;
  let intuBidSource: "file" | "user" | null = null;
  if (userBid) {
    intuBid = userBid;
    intuBidSource = "user";
  } else if (fileBid) {
    intuBid = fileBid;
    intuBidSource = "file";
  }

  const userBankName = (opts.bankName ?? "").trim().slice(0, 120);
  const bankName = userBankName || existingOrgName(text) || null;

  const accountId = tagRaw(text, "ACCTID") || "0000000000";

  return {
    report: {
      fixes,
      intuBid,
      intuBidSource,
      bankName,
      transactionCount: transactions.length,
      issuesBefore: analysis.issues,
    },
    transactions,
    accountId,
    currency: analysis.currency,
    ledgerBalance: analysis.ledgerBalance,
    ledgerAsOf: analysis.ledgerAsOf,
  };
}

/**
 * Build the fixed .qbo file. Starts from transactionsToQBO (OFX 1.02,
 * USD, full timestamps, unique FITIDs from each transaction's
 * reference) and, when an INTU.BID is known, inserts the <FI> block
 * immediately before </SONRS> in the sign-on response — where
 * QuickBooks reads the bank identity from.
 */
export function buildFixedQbo(
  transactions: Transaction[],
  opts: {
    intuBid?: string | null;
    bankName?: string | null;
    accountId?: string;
    ledgerBalance?: number | null;
    ledgerAsOf?: string | null; // ISO yyyy-mm-dd
  }
): string {
  const accountId = opts.accountId || "0000000000";
  let qbo = transactionsToQBO(transactions, accountId);

  // Preserve the original file's closing balance when the transactions
  // themselves carry no balances (the normal fixer flow): without a
  // LEDGERBAL the rebuilt file fails the site's own QBO checker and
  // QuickBooks reconciliation loses its target. Skipped when
  // transactionsToQBO already embedded one from transaction balances.
  if (
    opts.ledgerBalance != null &&
    Number.isFinite(opts.ledgerBalance) &&
    !qbo.includes("<LEDGERBAL>")
  ) {
    const asOfIso =
      opts.ledgerAsOf && /^\d{4}-\d{2}-\d{2}$/.test(opts.ledgerAsOf)
        ? opts.ledgerAsOf
        : [...transactions].sort((a, b) => a.date.localeCompare(b.date)).at(-1)?.date;
    if (asOfIso) {
      const dtAsof = `${asOfIso.replace(/-/g, "")}000000`;
      const ledger = `\n<LEDGERBAL>\n<BALAMT>${opts.ledgerBalance.toFixed(2)}</BALAMT>\n<DTASOF>${dtAsof}</DTASOF>\n</LEDGERBAL>`;
      qbo = qbo.replace("</STMTRS>", `${ledger}\n</STMTRS>`);
    }
  }

  const bid = (opts.intuBid ?? "").replace(/\D/g, "");
  if (bid) {
    const org = escapeXml((opts.bankName ?? "").trim() || "Bank");
    const fiBlock = `\n<FI>\n<ORG>${org}</ORG>\n<FID>${bid}</FID>\n</FI>`;
    qbo = qbo.replace("</SONRS>", `${fiBlock}\n</SONRS>`);
  }
  return qbo;
}
