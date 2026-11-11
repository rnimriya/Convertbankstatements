/**
 * AutoPay Khoj — Detection Engine (Day 3, 2026-11-11)
 *
 * Input:  the Transaction[] that ConvertStatement's extractor already
 *         produces (date string, narration, signed amount).
 * Output: an honest audit — CONFIRMED recurring charges, plus a
 *         separate POSSIBLE list (seen once). The two are never mixed:
 *         totals are computed from confirmed charges only.
 *
 * How a group of charges earns "confirmed" (all must hold):
 *   1. Same merchant (dictionary) or same cleaned narration fingerprint.
 *   2. At least 2 charges (unknown merchants need the stricter path in 4).
 *   3. Gaps cluster around one known cycle: weekly / monthly /
 *      quarterly / half-yearly / yearly (median gap, most gaps near it).
 *   4. Amounts are consistent (within ~3% of the median), OR show one
 *      clean price step (old price repeated, then new price repeated).
 *      Random amounts — food orders, prepaid recharges, shopping —
 *      fail here and are NOT called subscriptions.
 *   5. Unknown merchants additionally need 3+ charges, or 2 charges of
 *      the exact same amount on a monthly gap.
 *
 * Rail detection reads the narration only, in this precedence:
 *   store billing (Play/App Store) > NACH > UPI > card e-mandate.
 * Store wins because a Play Store charge paid via UPI is still
 * cancelled in the Play Store, not in the UPI app. When the narration
 * proves nothing, rail is "unknown" and the merchant's usual rail is
 * offered separately as a hint — labelled as a hint, never as fact.
 *
 * Nothing in this file guesses a merchant name: unknown recurring
 * charges are reported under their cleaned narration text.
 */
import type { Transaction } from "@/types/billing";
import {
  normalizeMerchant,
  type AutopayMerchant,
  type PaymentRail,
} from "./merchants";

export type DetectedCycle =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "half-yearly"
  | "yearly"
  | "irregular";

export type GenericKind =
  | "emi"
  | "nach-mandate"
  | "sip"
  | "unknown-recurring";

export interface ChargeOccurrence {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Positive amount charged. */
  amount: number;
  /** Raw narration from the statement. */
  description: string;
}

export interface DetectedSubscription {
  key: string;
  merchant: AutopayMerchant | null;
  /** Merchant name, or the cleaned narration for unknown charges. */
  displayName: string;
  genericKind: GenericKind | null;
  category: string;
  rail: PaymentRail | "unknown";
  /** The narration pattern that proved the rail, when one did. */
  railEvidence: string | null;
  /** Merchant's usual rail, only when rail itself is unknown. */
  railHint: PaymentRail | null;
  occurrences: ChargeOccurrence[];
  count: number;
  /** Median charge amount. */
  typicalAmount: number;
  amountVaries: boolean;
  firstDate: string;
  lastDate: string;
  /** Median gap between charges, in days (null when seen once). */
  intervalDays: number | null;
  cycle: DetectedCycle;
  /** Estimated next charge date (ISO), from last charge + interval. */
  nextExpectedDate: string | null;
  /** Normalised cost: typicalAmount spread per month. */
  monthlyCost: number;
  yearlyCost: number;
  /** One clean price step, when detected. */
  priceChange: { from: number; to: number; pctChange: number } | null;
  /** First charge was a tiny trial/verification amount, then full price. */
  trialConverted: boolean;
  confidence: "high" | "medium";
}

export interface AutopayAudit {
  confirmed: DetectedSubscription[];
  /** Known merchants seen only once — may be subscriptions. */
  possible: DetectedSubscription[];
  totalMonthlyCost: number;
  totalYearlyCost: number;
  /** Statement window actually covered by parseable debit rows. */
  rangeFrom: string | null;
  rangeTo: string | null;
  debitsAnalysed: number;
  debitsSkippedBadDate: number;
}

// ── Dates ────────────────────────────────────────────────────────────

const MONTHS: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};

function iso(y: number, m: number, d: number): string | null {
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return dt.toISOString().slice(0, 10);
}

/**
 * Parse every date shape ConvertStatement's extractor emits:
 * YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, DD/MM/YY, "05 Nov 2026",
 * "05-Nov-26". Returns ISO or null — never a guessed date.
 */
export function parseStatementDate(raw: string): string | null {
  if (!raw) return null;
  const s = raw.trim().toUpperCase().replace(/,/g, " ");
  let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (m) return iso(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/);
  if (m) {
    let y = +m[3];
    if (y < 100) y += 2000;
    return iso(y, +m[2], +m[1]);
  }
  m = s.match(/^(\d{1,2})\s+([A-Z]{3,9})\s+(\d{2,4})/);
  if (m) {
    const mon = MONTHS[m[2].slice(0, 3)];
    if (!mon) return null;
    let y = +m[3];
    if (y < 100) y += 2000;
    return iso(y, mon, +m[1]);
  }
  m = s.match(/^(\d{1,2})[- ]([A-Z]{3,9})[- ](\d{2,4})/);
  if (m) {
    const mon = MONTHS[m[2].slice(0, 3)];
    if (!mon) return null;
    let y = +m[3];
    if (y < 100) y += 2000;
    return iso(y, mon, +m[1]);
  }
  return null;
}

function addDays(isoDate: string, days: number): string {
  const dt = new Date(isoDate + "T00:00:00Z");
  dt.setUTCDate(dt.getUTCDate() + Math.round(days));
  return dt.toISOString().slice(0, 10);
}

function dayGap(a: string, b: string): number {
  return Math.round(
    (new Date(b + "T00:00:00Z").getTime() - new Date(a + "T00:00:00Z").getTime()) / 86400000,
  );
}

function median(nums: number[]): number {
  const s = [...nums].sort((x, y) => x - y);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ── Rail detection ───────────────────────────────────────────────────

export function detectRail(description: string): { rail: PaymentRail | "unknown"; evidence: string | null } {
  const d = description.toUpperCase();
  if (d.includes("GOOGLE PLAY") || d.includes("GOOGLE *PLAY") || d.includes("PLAYSTORE") || d.includes("PLAY STORE")) {
    return { rail: "play-store", evidence: "Google Play" };
  }
  if (d.includes("APPLE.COM") || d.includes("ITUNES") || d.includes("APPLE SERVICES") || d.includes("APP STORE")) {
    return { rail: "app-store", evidence: "Apple billing" };
  }
  if (/\bNACH\b/.test(d) || d.includes("ACH/") || d.includes("/ACH") || /\bECS\b/.test(d)) {
    return { rail: "nach", evidence: "NACH" };
  }
  if (d.includes("UPI/") || d.startsWith("UPI") || d.includes("UPI-") || d.includes("UPI ") || d.includes("AUTOPAY-UPI") || d.includes("UPI AUTOPAY")) {
    return { rail: "upi", evidence: "UPI" };
  }
  if (d.includes("E-MANDATE") || d.includes("EMANDATE") || d.includes("/SI/") || d.includes("CARD MANDATE") || d.includes("RECURRING CARD")) {
    return { rail: "card", evidence: "card e-mandate" };
  }
  return { rail: "unknown", evidence: null };
}

// ── Narration cleaning (generic display names & fingerprints) ────────

const NOISE_WORDS = new Set([
  "UPI", "NACH", "ACH", "ECS", "MANDATE", "AUTOPAY", "AUTO", "PAYMENT",
  "PAY", "DR", "DEBIT", "SI", "REF", "TXN", "IMPS", "NEFT", "RTGS",
]);

export function cleanNarration(description: string): string {
  const words = description
    .toUpperCase()
    .replace(/[^A-Z&.' ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !NOISE_WORDS.has(w));
  return words.slice(0, 5).join(" ").trim() || "UNKNOWN CHARGE";
}

function fingerprint(description: string): string {
  return cleanNarration(description).split(" ").slice(0, 4).join(" ");
}

function genericKindOf(description: string): GenericKind {
  const d = description.toUpperCase();
  if (/\bEMI\b/.test(d) || (d.includes("LOAN") && (d.includes("NACH") || d.includes("ACH")))) return "emi";
  if (/\bSIP\b/.test(d)) return "sip";
  if (d.includes("NACH") || d.includes("MANDATE") || d.includes("ACH/")) return "nach-mandate";
  return "unknown-recurring";
}

const GENERIC_LABELS: Record<GenericKind, string> = {
  emi: "Loan EMI (auto-debit)",
  "nach-mandate": "Bank mandate (auto-debit)",
  sip: "Investment SIP (auto-debit)",
  "unknown-recurring": "Recurring charge",
};

// ── Cycle classification ─────────────────────────────────────────────

const CYCLE_BANDS: { cycle: Exclude<DetectedCycle, "irregular">; min: number; max: number; perMonth: number }[] = [
  { cycle: "weekly", min: 5, max: 9, perMonth: 30.44 / 7 },
  { cycle: "monthly", min: 24, max: 36, perMonth: 1 },
  { cycle: "quarterly", min: 75, max: 100, perMonth: 1 / 3 },
  { cycle: "half-yearly", min: 160, max: 200, perMonth: 1 / 6 },
  { cycle: "yearly", min: 335, max: 395, perMonth: 1 / 12 },
];

function classifyCycle(intervalDays: number): (typeof CYCLE_BANDS)[number] | null {
  return CYCLE_BANDS.find((b) => intervalDays >= b.min && intervalDays <= b.max) ?? null;
}

// ── Group analysis ───────────────────────────────────────────────────

interface Group {
  key: string;
  merchant: AutopayMerchant | null;
  genericKind: GenericKind | null;
  occurrences: ChargeOccurrence[];
}

/** One clean price step: earlier charges share price A, later share B. */
function findPriceStep(occs: ChargeOccurrence[]): { from: number; to: number; pctChange: number } | null {
  if (occs.length < 3) return null;
  const last = occs[occs.length - 1].amount;
  // Try every split point: [0..k) all ≈ first price, [k..] all ≈ last price.
  // The new price may be seen only once (the latest yearly renewal) —
  // allowed only when the old price repeated at least twice before it.
  for (let k = occs.length - 1; k >= 1; k--) {
    if (occs.length - k === 1 && k < 2) continue;
    const first = occs[0].amount;
    if (Math.abs(last - first) <= first * 0.03) return null; // no real change
    const earlierOk = occs.slice(0, k).every((o) => Math.abs(o.amount - first) <= first * 0.03);
    const laterOk = occs.slice(k).every((o) => Math.abs(o.amount - last) <= last * 0.01);
    if (earlierOk && laterOk) {
      return { from: first, to: last, pctChange: round2(((last - first) / first) * 100) };
    }
  }
  return null;
}

function analyseGroup(group: Group): DetectedSubscription | null {
  const occs = [...group.occurrences].sort((a, b) => a.date.localeCompare(b.date));
  const count = occs.length;
  const amounts = occs.map((o) => o.amount);
  const typicalAmount = median(amounts);
  const minAmt = Math.min(...amounts);
  const maxAmt = Math.max(...amounts);
  const variation = typicalAmount > 0 ? (maxAmt - minAmt) / typicalAmount : 0;

  // Trial conversion: a tiny first charge (≤ ₹10 / ≤ $1), then full price.
  // A trial step is NOT a price change, so it is checked first.
  const trialConverted =
    count >= 2 &&
    group.merchant?.trialProne === true &&
    occs[0].amount <= Math.max(10, typicalAmount * 0.05) &&
    occs[1].amount >= typicalAmount * 0.5;
  const priceChange = trialConverted ? null : findPriceStep(occs);
  const amountConsistent = variation <= 0.03 || priceChange !== null;
  // When the price stepped, the CURRENT price is what the user pays now.
  const currentAmount = priceChange ? priceChange.to : typicalAmount;

  // Rail: the most frequent proven rail across occurrences wins.
  const railVotes = new Map<string, { rail: PaymentRail | "unknown"; evidence: string | null; n: number }>();
  for (const o of occs) {
    const r = detectRail(o.description);
    const cur = railVotes.get(r.rail) ?? { ...r, n: 0 };
    cur.n += 1;
    railVotes.set(r.rail, cur);
  }
  const railWinner = [...railVotes.values()].sort((a, b) => b.n - a.n)[0];
  const rail = railWinner && railWinner.rail !== "unknown" ? railWinner.rail : "unknown";
  const railEvidence = rail !== "unknown" ? railWinner.evidence : null;
  const railHint = rail === "unknown" ? (group.merchant?.rails[0] ?? null) : null;

  const displayName = group.merchant
    ? group.merchant.name
    : cleanNarration(occs[0].description);
  const category = group.merchant
    ? group.merchant.category
    : GENERIC_LABELS[group.genericKind ?? "unknown-recurring"];

  const base: Omit<DetectedSubscription, "intervalDays" | "cycle" | "nextExpectedDate" | "monthlyCost" | "yearlyCost" | "confidence"> = {
    key: group.key,
    merchant: group.merchant,
    displayName,
    genericKind: group.merchant ? null : group.genericKind,
    category,
    rail,
    railEvidence,
    railHint,
    occurrences: occs,
    count,
    typicalAmount: round2(currentAmount),
    amountVaries: !amountConsistent,
    firstDate: occs[0].date,
    lastDate: occs[occs.length - 1].date,
    priceChange,
    trialConverted,
  };

  if (count === 1) {
    // Seen once: only dictionary merchants are even worth listing,
    // and never inside the totals.
    if (!group.merchant) return null;
    const cycleGuess = group.merchant.cycles[0];
    const band = CYCLE_BANDS.find((b) => b.cycle === cycleGuess);
    const monthly = band ? currentAmount * band.perMonth : currentAmount;
    return {
      ...base,
      intervalDays: null,
      cycle: cycleGuess,
      nextExpectedDate: null,
      monthlyCost: round2(monthly),
      yearlyCost: round2(monthly * 12),
      confidence: "medium",
    };
  }

  const gaps: number[] = [];
  for (let i = 1; i < occs.length; i++) gaps.push(dayGap(occs[i - 1].date, occs[i].date));
  const interval = median(gaps);
  const band = classifyCycle(interval);
  if (!band) return null; // gaps fit no known cycle — not a subscription pattern

  // Most gaps must sit near the median (one late/early charge is fine).
  const nearGaps = gaps.filter((g) => Math.abs(g - interval) <= Math.max(4, interval * 0.35)).length;
  const regularEnough = nearGaps >= Math.ceil(gaps.length * 0.6);
  if (!regularEnough) return null;
  if (!amountConsistent && !trialConverted) return null;

  // Unknown merchants walk the stricter path: at least 3 charges.
  // (Day-7 gate finding: a 2-charge path flagged a monthly LPG refill —
  // two identical charges prove too little about an unknown payee.)
  let confidence: "high" | "medium" = "high";
  if (!group.merchant) {
    const exactAmounts = minAmt === maxAmt;
    if (count < 3) return null;
    confidence = exactAmounts ? "high" : "medium";
  }

  const monthly = currentAmount * band.perMonth;
  return {
    ...base,
    intervalDays: Math.round(interval),
    cycle: band.cycle,
    nextExpectedDate: addDays(occs[occs.length - 1].date, interval),
    monthlyCost: round2(monthly),
    yearlyCost: round2(monthly * 12),
    confidence,
  };
}

// ── Main entry ───────────────────────────────────────────────────────

export function detectAutopays(transactions: Transaction[]): AutopayAudit {
  const groups = new Map<string, Group>();
  let debitsAnalysed = 0;
  let debitsSkippedBadDate = 0;
  let rangeFrom: string | null = null;
  let rangeTo: string | null = null;

  for (const t of transactions) {
    if (!(t.amount < 0)) continue; // debits only — credits are never charges
    const date = parseStatementDate(t.date);
    if (!date) {
      debitsSkippedBadDate += 1;
      continue;
    }
    debitsAnalysed += 1;
    if (!rangeFrom || date < rangeFrom) rangeFrom = date;
    if (!rangeTo || date > rangeTo) rangeTo = date;

    const occ: ChargeOccurrence = {
      date,
      amount: round2(Math.abs(t.amount)),
      description: t.description,
    };
    const merchant = normalizeMerchant(t.description);
    if (merchant) {
      const key = "m:" + merchant.id;
      const g = groups.get(key) ?? { key, merchant, genericKind: null, occurrences: [] };
      g.occurrences.push(occ);
      groups.set(key, g);
    } else {
      const kind = genericKindOf(t.description);
      const fp = kind === "unknown-recurring" ? fingerprint(t.description) : cleanNarration(t.description);
      const key = "g:" + kind + ":" + fp;
      const g = groups.get(key) ?? { key, merchant: null, genericKind: kind, occurrences: [] };
      g.occurrences.push(occ);
      groups.set(key, g);
    }
  }

  const confirmed: DetectedSubscription[] = [];
  const possible: DetectedSubscription[] = [];
  for (const group of groups.values()) {
    const result = analyseGroup(group);
    if (!result) continue;
    if (group.occurrences.length === 1) possible.push(result);
    else confirmed.push(result);
  }

  confirmed.sort((a, b) => b.monthlyCost - a.monthlyCost);
  possible.sort((a, b) => b.monthlyCost - a.monthlyCost);
  const totalMonthly = round2(confirmed.reduce((s, x) => s + x.monthlyCost, 0));

  return {
    confirmed,
    possible,
    totalMonthlyCost: totalMonthly,
    totalYearlyCost: round2(totalMonthly * 12),
    rangeFrom,
    rangeTo,
    debitsAnalysed,
    debitsSkippedBadDate,
  };
}
