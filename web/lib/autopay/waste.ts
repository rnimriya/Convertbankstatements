/**
 * AutoPay Khoj — Waste Signals & Score (Day 4, 2026-11-11)
 *
 * Takes the Detection Engine's CONFIRMED list and asks, per charge:
 * "is there a concrete, checkable reason this might be waste?"
 * Every point a charge earns comes with a written reason containing
 * the actual numbers — no reason, no points. A statement cannot see
 * usage (we never claim "you don't use this"); signals therefore say
 * "worth a look" in conditional words, and the score maps to bands:
 *
 *   0        → green  "No waste signal"
 *   1 – 29   → yellow "Worth a look"
 *   30 – 100 → red    "Likely waste" (only these enter the
 *                      "possible waste" money total)
 *
 * Essential money is protected by design:
 *   - Loan EMIs, SIPs/investments and insurance premiums can carry
 *     informational notes (price rise, long tenure) but their band
 *     is capped at yellow and they NEVER enter the waste total.
 *   - Duplicate-service points apply only where a duplicate is a
 *     real concept: video, music and news services. Two SIPs, two
 *     insurance policies, or two electricity connections are normal
 *     life, not waste, and earn nothing.
 */
import type { AutopayAudit, DetectedSubscription } from "./detect";

export interface WasteSignal {
  id: string;
  /** Points added to the 0–100 waste score (0 = note only). */
  points: number;
  /** One plain-English sentence with the real numbers in it. */
  detail: string;
}

export type WasteBand = "green" | "yellow" | "red";

export interface ScoredSubscription {
  sub: DetectedSubscription;
  signals: WasteSignal[];
  score: number;
  band: WasteBand;
  /** Essential money (EMI / investment / insurance) — capped, never "waste". */
  essential: boolean;
}

export interface WasteReport {
  scored: ScoredSubscription[];
  totalMonthlyCost: number;
  totalYearlyCost: number;
  /** Monthly cost of RED items only — phrased to users as possible waste. */
  possibleWasteMonthly: number;
  possibleWasteYearly: number;
  redCount: number;
  yellowCount: number;
  greenCount: number;
  /** Plain-English summary lines for the report header. */
  headlineFacts: string[];
}

const DUPLICATE_CATEGORIES = new Set(["OTT Video", "Music & Audio", "News & Reading"]);
const ESSENTIAL_CATEGORIES = new Set(["Insurance", "Investments & Finance"]);

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthYear(isoDate: string): string {
  const [y, m] = isoDate.split("-").map(Number);
  return MONTH_NAMES[m - 1] + " " + y;
}

function fmt(amount: number): string {
  return (
    "₹" +
    (Number.isInteger(amount)
      ? amount.toLocaleString("en-IN")
      : amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
  );
}

function isEssential(sub: DetectedSubscription): boolean {
  if (sub.genericKind === "emi" || sub.genericKind === "sip") return true;
  return ESSENTIAL_CATEGORIES.has(sub.category);
}

function essentialNote(sub: DetectedSubscription): string {
  if (sub.genericKind === "emi") {
    return "This is a loan payment, not a subscription — never stop it without speaking to your lender first.";
  }
  if (sub.genericKind === "sip" || sub.category === "Investments & Finance") {
    return "This is money going into investments — review the goal it serves, not just the charge.";
  }
  return "Insurance protects your family — review the cover before ever touching this payment.";
}

function scoreOne(
  sub: DetectedSubscription,
  duplicatePeers: DetectedSubscription[],
  smallSubCount: number,
): ScoredSubscription {
  const signals: WasteSignal[] = [];
  const essential = isEssential(sub);
  if (essential) {
    signals.push({ id: "essential-note", points: 0, detail: essentialNote(sub) });
  }

  if (!essential && duplicatePeers.length > 0) {
    const names = [sub, ...duplicatePeers].map((s) => s.displayName).join(", ");
    signals.push({
      id: "duplicate-category",
      points: 25,
      detail: `You pay for ${duplicatePeers.length + 1} ${categoryLabel(sub.category)} services (${names}). Most households mainly use one or two — the rest is the easiest money to save.`,
    });
  }

  if (sub.trialConverted) {
    signals.push({
      id: "trial-converted",
      points: 30,
      detail: `This started as a tiny trial charge of ${fmt(sub.occurrences[0].amount)} on ${monthYear(sub.firstDate)} and quietly became ${fmt(sub.typicalAmount)} every ${cycleWord(sub.cycle)}. Trial conversions are the most commonly forgotten subscriptions.`,
    });
  }

  if (sub.priceChange && Math.abs(sub.priceChange.pctChange) >= 5) {
    const changeDate = sub.occurrences.find((o) => o.amount === sub.priceChange!.to)?.date ?? sub.lastDate;
    signals.push({
      id: "price-hike",
      points: 20,
      detail: `The price rose from ${fmt(sub.priceChange.from)} to ${fmt(sub.priceChange.to)} (${sub.priceChange.pctChange > 0 ? "+" : ""}${sub.priceChange.pctChange}%) around ${monthYear(changeDate)}. If you did not notice, it is worth deciding whether it still earns its place.`,
    });
  }

  const tenureDays = daysBetween(sub.firstDate, sub.lastDate);
  if (!essential && sub.cycle === "monthly" && tenureDays >= 335 && sub.count >= 11) {
    signals.push({
      id: "long-tenure",
      points: 15,
      detail: `You have paid this every month since ${monthYear(sub.firstDate)} — over a year of charges (${sub.count} in this statement). If you have not used it lately, every further month is pure waste.`,
    });
  }

  // Small leaks are monthly drips — a yearly plan normalised to a small
  // monthly figure is not a leak and must not stack toward red this way.
  if (!essential && sub.monthlyCost < 200 && (sub.cycle === "monthly" || sub.cycle === "weekly") && smallSubCount >= 3) {
    signals.push({
      id: "small-leak",
      points: 5,
      detail: `Small on its own (${fmt(sub.monthlyCost)}/month) — but you have ${smallSubCount} such small subscriptions, and small leaks add up quietly.`,
    });
  }

  if (!essential && sub.cycle === "yearly" && sub.typicalAmount >= 2999) {
    signals.push({
      id: "big-yearly-renewal",
      points: 10,
      detail: `One big yearly charge of ${fmt(sub.typicalAmount)}. The next one is expected around ${sub.nextExpectedDate ? monthYear(sub.nextExpectedDate) : "its renewal date"} — decide before it lands, not after.`,
    });
  }

  if (!essential && sub.monthlyCost >= 999 && sub.cycle === "monthly") {
    signals.push({
      id: "pricey-monthly",
      points: 10,
      detail: `At ${fmt(sub.monthlyCost)}/month this is one of your biggest recurring costs — worth a deliberate yes every year, not an automatic one.`,
    });
  }

  const rawScore = signals.reduce((s, x) => s + x.points, 0);
  const score = Math.min(100, rawScore);
  let band: WasteBand = score >= 30 ? "red" : score >= 1 ? "yellow" : "green";
  if (essential && band === "red") band = "yellow"; // hard cap: essentials are never "waste"
  return { sub, signals, score, band, essential };
}

function categoryLabel(category: string): string {
  if (category === "OTT Video") return "video streaming";
  if (category === "Music & Audio") return "music/audio";
  if (category === "News & Reading") return "news/reading";
  return category.toLowerCase();
}

function cycleWord(cycle: DetectedSubscription["cycle"]): string {
  switch (cycle) {
    case "weekly": return "week";
    case "monthly": return "month";
    case "quarterly": return "3 months";
    case "half-yearly": return "6 months";
    case "yearly": return "year";
    default: return "cycle";
  }
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b + "T00:00:00Z").getTime() - new Date(a + "T00:00:00Z").getTime()) / 86400000,
  );
}

export function scoreWaste(audit: AutopayAudit): WasteReport {
  const confirmed = audit.confirmed;

  // Duplicate groups: same duplicable category, 2+ distinct merchants.
  const byCategory = new Map<string, DetectedSubscription[]>();
  for (const sub of confirmed) {
    if (!DUPLICATE_CATEGORIES.has(sub.category) || isEssential(sub)) continue;
    const list = byCategory.get(sub.category) ?? [];
    list.push(sub);
    byCategory.set(sub.category, list);
  }
  const peersOf = new Map<string, DetectedSubscription[]>();
  for (const list of byCategory.values()) {
    if (list.length < 2) continue;
    for (const sub of list) {
      peersOf.set(sub.key, list.filter((x) => x.key !== sub.key));
    }
  }

  const smallSubCount = confirmed.filter(
    (s) => s.monthlyCost < 200 && (s.cycle === "monthly" || s.cycle === "weekly") && !isEssential(s),
  ).length;

  const scored = confirmed
    .map((sub) => scoreOne(sub, peersOf.get(sub.key) ?? [], smallSubCount))
    .sort((a, b) => b.score - a.score || b.sub.monthlyCost - a.sub.monthlyCost);

  const red = scored.filter((s) => s.band === "red");
  const possibleWasteMonthly = round2(red.reduce((s, x) => s + x.sub.monthlyCost, 0));

  const headlineFacts: string[] = [];
  headlineFacts.push(
    `${confirmed.length} recurring charges found, costing ${fmt(audit.totalMonthlyCost)} a month (${fmt(audit.totalYearlyCost)} a year).`,
  );
  if (red.length > 0) {
    headlineFacts.push(
      `${red.length} of them look like likely waste worth ${fmt(possibleWasteMonthly)} a month (${fmt(possibleWasteMonthly * 12)} a year) — each one below says exactly why.`,
    );
  } else if (scored.some((s) => s.band === "yellow")) {
    headlineFacts.push("Nothing looks like clear waste — a few charges are worth a quick look below.");
  } else {
    headlineFacts.push("No waste signals found. Every recurring charge looks deliberate.");
  }
  const dupGroups = [...byCategory.values()].filter((l) => l.length >= 2);
  if (dupGroups.length > 0) {
    const g = dupGroups[0];
    headlineFacts.push(
      `You pay for ${g.length} ${categoryLabel(g[0].category)} services at once: ${g.map((s) => s.displayName).join(", ")}.`,
    );
  }

  return {
    scored,
    totalMonthlyCost: audit.totalMonthlyCost,
    totalYearlyCost: audit.totalYearlyCost,
    possibleWasteMonthly,
    possibleWasteYearly: round2(possibleWasteMonthly * 12),
    redCount: red.length,
    yellowCount: scored.filter((s) => s.band === "yellow").length,
    greenCount: scored.filter((s) => s.band === "green").length,
    headlineFacts,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
