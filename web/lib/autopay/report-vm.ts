/**
 * AutoPay Khoj — report view model (Day 6, 2026-11-11).
 *
 * One builder shared by the /autopay-audit page (sample report) and
 * the /api/autopay-audit route (real uploaded statements), so the two
 * can never drift apart. Pure functions over engine output.
 */
import type { Transaction } from "@/types/billing";
import { detectAutopays, type DetectedSubscription } from "./detect";
import { scoreWaste, type ScoredSubscription } from "./waste";
import { getCancelGuide, getRailGuide, type RailGuide } from "./cancel-guides";

export interface GuideVM {
  serviceSteps: string[] | null;
  afterCancel: string | null;
  warning: string | null;
  railGuides: { title: string; steps: string[]; note?: string }[];
}

export interface ItemVM {
  key: string;
  name: string;
  category: string;
  essential: boolean;
  score: number;
  band: "green" | "yellow" | "red";
  typicalAmountLabel: string;
  cycle: string;
  monthlyCost: number;
  count: number;
  firstDateLabel: string;
  nextDateLabel: string | null;
  railLabel: string;
  railHintLabel: string | null;
  signals: { id: string; detail: string }[];
  guide: GuideVM;
}

export interface ReportVM {
  totalMonthlyLabel: string;
  totalYearlyLabel: string;
  possibleWasteMonthlyLabel: string;
  possibleWasteYearlyLabel: string;
  confirmedCount: number;
  rangeLabel: string;
  headlineFacts: string[];
  red: ItemVM[];
  yellow: ItemVM[];
  green: ItemVM[];
  possible: { name: string; amountLabel: string; cycle: string; lastDateLabel: string }[];
}

export function fmtINR(n: number): string {
  return (
    "₹" +
    (Number.isInteger(n)
      ? n.toLocaleString("en-IN")
      : n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function dateLabel(isoDate: string | null): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

const RAIL_LABELS: Record<string, string> = {
  upi: "UPI AutoPay",
  nach: "NACH bank mandate",
  card: "card e-mandate",
  "play-store": "Google Play billing",
  "app-store": "Apple billing",
  unknown: "a route this statement line does not name",
};

const RAIL_GUIDE_IDS: Record<string, string[]> = {
  upi: ["upi-npci", "upi-gpay", "upi-phonepe", "upi-paytm"],
  nach: ["nach-bank"],
  card: ["card-emandate"],
  "play-store": ["play-store"],
  "app-store": ["app-store"],
  unknown: ["upi-npci", "card-emandate", "nach-bank"],
};

function cycleLabel(cycle: DetectedSubscription["cycle"]): string {
  switch (cycle) {
    case "monthly": return "month";
    case "yearly": return "year";
    case "weekly": return "week";
    case "quarterly": return "3 months";
    case "half-yearly": return "6 months";
    default: return cycle;
  }
}

function toItem(scored: ScoredSubscription): ItemVM {
  const sub: DetectedSubscription = scored.sub;
  const guide = sub.merchant ? getCancelGuide(sub.merchant.id) : null;
  const railGuides = (RAIL_GUIDE_IDS[sub.rail] ?? [])
    .map((id) => getRailGuide(id))
    .filter((g): g is RailGuide => g !== null)
    .map((g) => ({ title: g.title, steps: g.steps, note: g.note }));
  return {
    key: sub.key,
    name: sub.displayName,
    category: sub.category,
    essential: scored.essential,
    score: scored.score,
    band: scored.band,
    typicalAmountLabel: fmtINR(sub.typicalAmount),
    cycle: cycleLabel(sub.cycle),
    monthlyCost: sub.monthlyCost,
    count: sub.count,
    firstDateLabel: dateLabel(sub.firstDate),
    nextDateLabel: sub.nextExpectedDate ? dateLabel(sub.nextExpectedDate) : null,
    railLabel: RAIL_LABELS[sub.rail] ?? sub.rail,
    railHintLabel: sub.railHint ? `usually ${RAIL_LABELS[sub.railHint] ?? sub.railHint}` : null,
    signals: scored.signals.map((s) => ({ id: s.id, detail: s.detail })),
    guide: {
      serviceSteps: guide ? guide.serviceSteps : null,
      afterCancel: guide ? guide.afterCancel : null,
      warning: guide ? (guide.warning ?? null) : null,
      railGuides,
    },
  };
}

export function buildReportVM(transactions: Transaction[]): ReportVM {
  const audit = detectAutopays(transactions);
  const report = scoreWaste(audit);
  const items = report.scored.map(toItem);
  return {
    totalMonthlyLabel: fmtINR(report.totalMonthlyCost),
    totalYearlyLabel: fmtINR(report.totalYearlyCost),
    possibleWasteMonthlyLabel: fmtINR(report.possibleWasteMonthly),
    possibleWasteYearlyLabel: fmtINR(report.possibleWasteYearly),
    confirmedCount: audit.confirmed.length,
    rangeLabel: `${dateLabel(audit.rangeFrom)} – ${dateLabel(audit.rangeTo)}`,
    headlineFacts: report.headlineFacts,
    red: items.filter((i) => i.band === "red"),
    yellow: items.filter((i) => i.band === "yellow"),
    green: items.filter((i) => i.band === "green"),
    possible: audit.possible.map((p) => ({
      name: p.displayName,
      amountLabel: fmtINR(p.typicalAmount),
      cycle: p.cycle,
      lastDateLabel: dateLabel(p.lastDate),
    })),
  };
}
