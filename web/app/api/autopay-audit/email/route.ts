/**
 * AutoPay Khoj — email-my-report API (Day 6, 2026-11-11).
 *
 * POST JSON { email, vm } → builds the PDF from the view model the
 * client already holds (no statement data is involved at this step —
 * only the finished report) and sends it via the site's existing
 * Resend setup. If email is not configured, the route says so
 * honestly instead of pretending the mail went.
 */
import { NextRequest, NextResponse } from "next/server";
import { getResend, EMAIL_FROM } from "@/lib/email";
import { buildReportPdf } from "@/lib/autopay/report-pdf";
import type { ReportVM } from "@/lib/autopay/report-vm";

export const maxDuration = 60;

function looksLikeVM(v: unknown): v is ReportVM {
  if (!v || typeof v !== "object") return false;
  const vm = v as Record<string, unknown>;
  return (
    typeof vm.totalMonthlyLabel === "string" &&
    Array.isArray(vm.red) &&
    Array.isArray(vm.yellow) &&
    Array.isArray(vm.green) &&
    Array.isArray(vm.possible)
  );
}

export async function POST(req: NextRequest) {
  let body: { email?: unknown; vm?: unknown };
  try {
    body = (await req.json()) as { email?: unknown; vm?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!looksLikeVM(body.vm)) {
    return NextResponse.json({ error: "That report data could not be read. Please run the audit again." }, { status: 400 });
  }

  const resend = getResend();
  if (!resend) {
    return NextResponse.json(
      { error: "Email delivery is not available right now. Your report is on this page — you can also print it to PDF from your browser." },
      { status: 503 },
    );
  }

  const vm = body.vm;
  const generatedOn = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const pdf = await buildReportPdf(vm, generatedOn);

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "Your AutoPay Khoj report — every recurring charge, in one place",
    text: [
      "Your AutoPay Khoj audit report is attached as a PDF.",
      "",
      `Recurring charges found: ${vm.confirmedCount}, costing ${vm.totalMonthlyLabel} a month (${vm.totalYearlyLabel} a year).`,
      `Possible waste: ${vm.possibleWasteMonthlyLabel} a month — only charges with a clear written reason are counted.`,
      "",
      "To cancel any charge, open the full report — every item carries a two-part cancel guide (stop the service AND stop the mandate):",
      "https://www.convertstatement.online/autopay-audit",
      "",
      "This email was sent at your request from the AutoPay Khoj page. Your bank statement was processed in memory and was never stored.",
    ].join("\n"),
    attachments: [
      {
        filename: "autopay-khoj-report.pdf",
        content: Buffer.from(pdf).toString("base64"),
      },
    ],
  });

  if (error) {
    console.error("[autopay-audit] email send failed:", error);
    return NextResponse.json(
      { error: "The email could not be sent. Please try again in a little while." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
