import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { VendorChecker1099 } from "@/components/tools/VendorChecker1099";

const PAGE_URL = "https://www.convertstatement.online/tools/1099-checker";

export const metadata: Metadata = {
  title: "1099 Vendor Checker — Total Payments by Vendor from CSV or QBO | Convert Statement",
  description:
    "Free 1099 vendor checker: upload a bank CSV or QBO file and see total payments grouped by vendor, with name variants combined and vendors at or above a threshold you set highlighted. Informational report only — not tax filing or tax advice. No account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "1099 Vendor Checker — Payments by Vendor",
    description:
      "Group outgoing payments by vendor from a bank CSV or QBO file and see who sits at or above a threshold you choose. Free informational report, no account.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What does the 1099 vendor checker do?",
    a: "It reads a bank CSV export or a QBO/OFX file, takes only the money-out rows, groups them by vendor, and shows each vendor's total paid, payment count, and last payment date. Vendors at or above the threshold you set are highlighted so you can see at a glance who may need a closer look at year end. It is an informational report only — this is not tax filing or tax advice.",
  },
  {
    q: "What threshold should I use?",
    a: "The default threshold in the tool is $600 and you can change it to any amount. Thresholds and rules change and have exceptions, so treat the default as a starting point for your review — confirm the current rules with your tax professional before you rely on any cutoff.",
  },
  {
    q: "How are vendor name variants handled?",
    a: "Names are normalized before grouping: capitalization and punctuation are ignored, common entity suffixes (such as LLC and Inc) and trailing store or location numbers are stripped. That means “ACME LLC”, “Acme, LLC”, and “ACME” are totaled as one vendor instead of three small ones that each slip under your threshold.",
  },
  {
    q: "Does it count deposits and money in?",
    a: "No. Only money-out rows (negative amounts) count as payments to vendors. Deposits, refunds in, and other money-in rows are ignored, so a vendor who also paid you does not inflate the total.",
  },
  {
    q: "Which files does it accept?",
    a: "A bank transaction CSV with date, description, and amount columns, or a QBO, OFX, or QFX file exported from your bank or QuickBooks. Both go through the same grouping, so you get the same vendor list either way.",
  },
  {
    q: "Is this tax filing or tax advice?",
    a: "No. Informational report only — this is not tax filing or tax advice. Thresholds and rules have exceptions (for example, payments to corporations and payments made by card are often treated differently). Confirm your filing obligations with your tax professional.",
  },
];

const HOWTO = [
  { title: "Export your payments", body: "Download a bank CSV for the year, or a QBO/OFX file, covering the accounts you pay vendors from." },
  { title: "Upload it here", body: "Drop the file in. Money-out rows are grouped by vendor, with name variants combined into one total per vendor." },
  { title: "Set your threshold", body: "The default threshold in the tool is $600 and you can change it — vendors at or above it are highlighted. Confirm the current rules with your tax professional." },
  { title: "Download the report", body: "Save the vendor report CSV for your records and share it with your bookkeeper or tax professional." },
];

export default function VendorChecker1099Page() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="1099 Vendor Checker"
      subtitle="See what you paid each vendor this year: upload a bank CSV or QBO file and get payments grouped by vendor — name variants combined, deposits ignored, and vendors at or above your threshold highlighted."
      tool={<VendorChecker1099 />}
      currentPath="/tools/1099-checker"
      faqs={FAQS}
      howToName="How to total payments by vendor"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">The year-end vendor scramble, done in one upload</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Working out who you paid — and how much — usually means scrolling a year of bank
            transactions and adding up names that never quite match. The same vendor appears
            as “ACME LLC” on one line and “Acme, LLC” on the next, store numbers trail some
            names, and deposits sit in the same list as payments. This checker does that
            grouping for you: it normalizes the names, counts only money out, and totals
            each vendor with a payment count and a last payment date.
          </p>
          <p className="mt-4 rounded-[20px] border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            Informational report only — this is not tax filing or tax advice. Thresholds and rules have exceptions (for example, payments to corporations and payments made by card are often treated differently). Confirm your filing obligations with your tax professional.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">CSV or QBO input</strong> — use a bank CSV export or a QBO/OFX/QFX file; both produce the same vendor list.</li>
            <li><strong className="text-zinc-900 dark:text-white">Name-variant grouping</strong> — capitalization, punctuation, entity suffixes, and store numbers are normalized so one vendor gets one total.</li>
            <li><strong className="text-zinc-900 dark:text-white">Money out only</strong> — deposits and other money-in rows never count toward a vendor total.</li>
            <li><strong className="text-zinc-900 dark:text-white">Your threshold, highlighted</strong> — the default threshold in the tool is $600 and you can change it; vendors at or above it are badged in the table and marked in the report. Confirm the current rules with your tax professional.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Cleaning up the file before you review it? The{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QBO Duplicate Finder</a>{" "}
            flags repeated transactions, and the{" "}
            <a href="/tools/csv-to-qbo" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">CSV to QBO converter</a>{" "}
            turns a bank CSV into a QuickBooks-ready QBO file.
          </p>
        </>
      }
    />
  );
}
