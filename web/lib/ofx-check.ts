/**
 * QBO / OFX file checker — parses an OFX 1.x (SGML) or 2.x (XML) file and
 * validates the things QuickBooks cares about: structure, ledger balance,
 * statement period, FITID uniqueness, duplicate transactions, date sanity.
 * Pure parsing — no network, no storage.
 */

export interface OfxTxn {
  date: string; // ISO yyyy-mm-dd
  type: string;
  amount: number;
  fitid: string | null;
  name: string;
}

export interface OfxIssue {
  level: "error" | "warning";
  message: string;
}

export interface OfxAnalysis {
  valid: boolean;
  fileKind: string; // e.g. "OFX 1.02 (QBO / Web Connect)"
  bankId: string | null;
  accountMasked: string | null;
  accountType: string | null;
  currency: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  ledgerBalance: number | null;
  ledgerAsOf: string | null;
  transactionCount: number;
  creditsTotal: number;
  debitsTotal: number;
  netChange: number;
  transactions: OfxTxn[];
  issues: OfxIssue[];
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}>([^<\\r\\n]+)`, "i"));
  return m ? m[1].trim() : null;
}

function ofxDate(raw: string | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 8) return null;
  const y = digits.slice(0, 4);
  const mo = digits.slice(4, 6);
  const d = digits.slice(6, 8);
  const dt = new Date(`${y}-${mo}-${d}T00:00:00Z`);
  if (Number.isNaN(dt.getTime())) return null;
  return `${y}-${mo}-${d}`;
}

export function analyzeOfx(text: string): OfxAnalysis {
  const issues: OfxIssue[] = [];
  const isOfx = /OFXHEADER\s*:/i.test(text) || /<OFX>/i.test(text);
  const versionMatch = text.match(/VERSION\s*:\s*"?([\d.]+)/i) || text.match(/<VERSION>([\d.]+)/i);
  const version = versionMatch?.[1] ?? null;

  if (!isOfx) {
    issues.push({
      level: "error",
      message:
        "This does not look like an OFX/QBO file. QuickBooks expects a Web Connect (.qbo) file, which is OFX format underneath.",
    });
  }
  if (!/<BANKMSGSRSV1>|<CREDITCARDMSGSRSV1>/i.test(text)) {
    issues.push({
      level: "error",
      message: "No bank or credit-card message set found — QuickBooks will reject this file on import.",
    });
  }

  const bankId = tag(text, "BANKID");
  const acctId = tag(text, "ACCTID");
  const accountMasked = acctId ? `••••${acctId.slice(-4)}` : null;
  const accountType = tag(text, "ACCTTYPE");
  const currency = tag(text, "CURDEF");

  const periodStart = ofxDate(tag(text, "DTSTART"));
  const periodEnd = ofxDate(tag(text, "DTEND"));

  const ledgerBlockMatch = text.match(/<LEDGERBAL>([\s\S]*?)<\/LEDGERBAL>/i);
  const ledgerBlock = ledgerBlockMatch?.[1] ?? "";
  const ledgerRaw = tag(ledgerBlock, "BALAMT");
  const ledgerBalance = ledgerRaw != null && !Number.isNaN(parseFloat(ledgerRaw)) ? parseFloat(ledgerRaw) : null;
  const ledgerAsOf = ofxDate(tag(ledgerBlock, "DTASOF"));

  if (ledgerBalance == null) {
    issues.push({
      level: "error",
      message:
        "No ledger (closing) balance in the file. QuickBooks reconciliation needs it as the target — without it you must type the closing balance by hand and mismatches are harder to spot.",
    });
  }
  if (ledgerAsOf && periodEnd && ledgerAsOf !== periodEnd) {
    issues.push({
      level: "warning",
      message: `The ledger balance is dated ${ledgerAsOf} but the statement period ends ${periodEnd}. A mismatch here can make reconciliation start from the wrong target.`,
    });
  }
  if (!periodStart || !periodEnd) {
    issues.push({
      level: "warning",
      message: "The file does not declare a clear statement period (DTSTART/DTEND). QuickBooks may import it, but period-based duplicate detection gets weaker.",
    });
  }

  // ── Transactions ──────────────────────────────────────────────────────────
  const txnBlocks = text.match(/<STMTTRN>([\s\S]*?)(?=<STMTTRN>|<\/BANKTRANLIST>|<\/CCSTMTTRN>|<\/STMTTRNRS>|$)/gi) ?? [];
  const transactions: OfxTxn[] = [];
  for (const block of txnBlocks) {
    const amtRaw = tag(block, "TRNAMT");
    const amount = amtRaw != null ? parseFloat(amtRaw) : NaN;
    transactions.push({
      date: ofxDate(tag(block, "DTPOSTED")) ?? "",
      type: tag(block, "TRNTYPE") ?? "",
      amount,
      fitid: tag(block, "FITID"),
      name: (tag(block, "NAME") ?? tag(block, "MEMO") ?? "").slice(0, 80),
    });
  }

  if (transactions.length === 0) {
    issues.push({ level: "error", message: "No transactions found in the file." });
  }
  if (transactions.some((t) => Number.isNaN(t.amount))) {
    issues.push({ level: "error", message: "At least one transaction has a missing or unreadable amount." });
  }

  const fitids = transactions.map((t) => t.fitid).filter(Boolean) as string[];
  if (transactions.length > 0 && fitids.length < transactions.length) {
    issues.push({
      level: "warning",
      message: `${transactions.length - fitids.length} transaction(s) have no FITID. QuickBooks uses FITIDs to detect duplicates — missing IDs raise the duplicate risk on re-import.`,
    });
  }
  const seenFitid = new Map<string, number>();
  for (const f of fitids) seenFitid.set(f, (seenFitid.get(f) ?? 0) + 1);
  const dupFitids = [...seenFitid.values()].filter((n) => n > 1).length;
  if (dupFitids > 0) {
    issues.push({
      level: "error",
      message: `${dupFitids} FITID value(s) repeat inside this file. QuickBooks treats a repeated FITID as an already-imported transaction and may silently skip real transactions.`,
    });
  }

  const seenTxn = new Map<string, number>();
  for (const t of transactions) {
    const key = `${t.date}|${t.amount}|${t.name.toLowerCase()}`;
    seenTxn.set(key, (seenTxn.get(key) ?? 0) + 1);
  }
  const dupTxns = [...seenTxn.values()].filter((n) => n > 1).length;
  if (dupTxns > 0) {
    issues.push({
      level: "warning",
      message: `${dupTxns} transaction(s) look identical (same date, amount, and name). They may be genuine repeats — or duplicates worth checking before import.`,
    });
  }

  if (periodStart && periodEnd) {
    const outside = transactions.filter((t) => t.date && (t.date < periodStart || t.date > periodEnd)).length;
    if (outside > 0) {
      issues.push({
        level: "warning",
        message: `${outside} transaction(s) are dated outside the declared statement period (${periodStart} → ${periodEnd}).`,
      });
    }
  }

  const validAmounts = transactions.filter((t) => !Number.isNaN(t.amount));
  const creditsTotal = validAmounts.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const debitsTotal = validAmounts.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);

  return {
    valid: isOfx && transactions.length > 0 && !issues.some((i) => i.level === "error"),
    fileKind: version ? `OFX ${version} (QBO / Web Connect)` : "OFX (QBO / Web Connect)",
    bankId,
    accountMasked,
    accountType,
    currency,
    periodStart,
    periodEnd,
    ledgerBalance,
    ledgerAsOf,
    transactionCount: transactions.length,
    creditsTotal: Math.round(creditsTotal * 100) / 100,
    debitsTotal: Math.round(debitsTotal * 100) / 100,
    netChange: Math.round((creditsTotal + debitsTotal) * 100) / 100,
    transactions: transactions.slice(0, 500),
    issues,
  };
}
