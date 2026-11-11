/**
 * AutoPay Khoj — PDF report builder (Day 6, 2026-11-11).
 *
 * Renders the same view model the web report shows, as a clean,
 * plain PDF for emailing. pdf-lib's standard fonts are WinAnsi, so
 * the rupee sign is written as "Rs" and stray unicode is normalised —
 * an honest cosmetic limit of the built-in fonts, noted here rather
 * than hidden.
 */
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type { ItemVM, ReportVM } from "./report-vm";

function clean(s: string): string {
  return s
    .replace(/₹/g, "Rs ")
    .replace(/→/g, "->")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/–/g, "-");
}

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

export async function buildReportPdf(vm: ReportVM, generatedOn: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.06, 0.12, 0.09);
  const muted = rgb(0.36, 0.44, 0.39);
  const green = rgb(0, 0.47, 0.2);
  const red = rgb(0.71, 0.14, 0.09);
  const amber = rgb(0.71, 0.33, 0.03);

  let page = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  function wrap(text: string, f: PDFFont, size: number, width: number): string[] {
    const words = clean(text).split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const trial = line ? line + " " + w : w;
      if (f.widthOfTextAtSize(trial, size) > width && line) {
        lines.push(line);
        line = w;
      } else {
        line = trial;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function ensure(need: number) {
    if (y - need < MARGIN) {
      page = doc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }
  }

  function text(str: string, f: PDFFont, size: number, color = ink, gapAfter = 4, indent = 0) {
    for (const line of wrap(str, f, size, CONTENT_W - indent)) {
      ensure(size + gapAfter + 2);
      page.drawText(line, { x: MARGIN + indent, y: y - size, size, font: f, color });
      y -= size + gapAfter;
    }
  }

  // Header
  text("AutoPay Khoj — Your Subscription Audit", bold, 19, ink, 6);
  text(`Generated ${generatedOn} · Statement period: ${vm.rangeLabel}`, font, 10, muted, 12);

  text(`Recurring charges: ${vm.totalMonthlyLabel} a month (${vm.totalYearlyLabel} a year)`, bold, 13, ink, 4);
  text(`Possible waste: ${vm.possibleWasteMonthlyLabel} a month (${vm.possibleWasteYearlyLabel} a year)`, bold, 13, red, 10);
  for (const fact of vm.headlineFacts) text("• " + fact, font, 10.5, ink, 3);
  y -= 8;

  function bandSection(title: string, items: ItemVM[], color: ReturnType<typeof rgb>) {
    if (items.length === 0) return;
    ensure(30);
    text(`${title} (${items.length})`, bold, 14, color, 8);
    for (const item of items) {
      text(`${item.name} — ${item.typicalAmountLabel} per ${item.cycle} (${item.count} charges, next: ${item.nextDateLabel ?? "—"})`, bold, 11, ink, 3);
      text(`Paid via ${item.railLabel}${item.railHintLabel ? ` (${item.railHintLabel})` : ""} · Category: ${item.category}${item.essential ? " · ESSENTIAL" : ""}`, font, 9.5, muted, 3, 10);
      for (const sig of item.signals) text(sig.detail, font, 10, ink, 3, 10);
      y -= 6;
    }
    y -= 4;
  }

  bandSection("Likely waste — act on these first", vm.red, red);
  bandSection("Worth a look", vm.yellow, amber);
  bandSection("Looks fine", vm.green, green);

  if (vm.possible.length > 0) {
    ensure(30);
    text(`Seen once — check these yourself (${vm.possible.length})`, bold, 14, ink, 8);
    for (const p of vm.possible) {
      text(`${p.name} — ${p.amountLabel}, charged ${p.lastDateLabel}`, font, 10.5, ink, 3, 10);
    }
    y -= 6;
  }

  ensure(40);
  text(
    "How to cancel: every charge in the full web report carries a two-part cancel guide — stop the service in its own app, and stop the money mandate in your UPI app or bank. Both halves are needed. Open your report at convertstatement.online/autopay-audit.",
    font, 9.5, muted, 3,
  );
  text(
    "This report was built from the statement you uploaded. The statement itself was processed in memory and never stored.",
    font, 9.5, muted, 3,
  );

  return doc.save();
}
