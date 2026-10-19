import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { QboCleanupChecker } from "@/components/tools/QboCleanupChecker";

const PAGE_URL = "https://convertstatement.online/tools/free-qbo-cleanup-checker";

export const metadata: Metadata = {
  title: "Free QBO Duplicate Finder & Cleanup Checker | Convert Statement",
  description:
    "Find duplicate transactions in your QuickBooks books before they break reconciliation: upload a .qbo, .ofx or .csv, get a health score, exact and near-duplicate report, and a cleaned QBO. Free with a free account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Free QBO Duplicate Finder & Cleanup Checker",
    description:
      "Upload a QBO or CSV, get a 0–100 health score and a duplicate report in seconds. Free and private.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I find duplicate transactions in QuickBooks Online?",
    a: "QuickBooks has no built-in duplicate finder, so most people sort the register by amount and eyeball it. This tool automates that: upload a .qbo, .ofx, or .csv export and it flags repeated transaction IDs, identical date/amount/payee rows, and near-duplicates (same amount within 3 days with a similar payee name) — with a 0–100 health score. Review the flagged groups before deleting anything.",
  },
  {
    q: "What causes duplicate transactions in QuickBooks?",
    a: "The usual causes are importing the same statement or bank feed range twice, manual entries that overlap the bank feed, and re-imported QBO files whose transaction IDs changed. Files converted with Convert Statement carry content-derived IDs, so re-importing the same statement is recognized safely instead of duplicated.",
  },
  {
    q: "Can I delete the duplicates straight from this tool?",
    a: "No — and that's deliberate. Near-duplicates can be genuine repeats (two identical coffee purchases in a week), so every flagged group needs your judgment. Pro users can download a cleaned QBO with the exact duplicates removed and every transaction ID regenerated; review it, then import it into QuickBooks.",
  },
  {
    q: "What does the health score mean?",
    a: "It starts at 100 and subtracts 10 per error (structural problems, balance breaks), 5 per duplicate instance, and 2 per warning. A score of 90+ is a clean file; anything under 70 deserves a cleanup pass before month-end.",
  },
  {
    q: "My reconciliation difference never goes to zero. Will this help?",
    a: "Often, yes. The most common causes of a stuck reconciliation difference are duplicate transactions and old uncleared items — both are flagged here, including uncleared entries older than 90 days (from CSV exports with a cleared/status column). If the file carries running balances, the tool also verifies the balance chain.",
  },
  {
    q: "Is my file uploaded to your servers?",
    a: "No. Your file is processed in memory to build the report and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Upload your file", body: "Drop in a .qbo, .ofx, .qfx, or .csv export from QuickBooks or your bank." },
  { title: "Read the report", body: "Get a 0–100 health score, every duplicate group with its rows, and all structural findings." },
  { title: "Clean up", body: "Review flagged groups, delete confirmed duplicates in QuickBooks, or download a cleaned QBO on Pro — and ask about a full cleanup if the books are months behind." },
];

export default function QboCleanupCheckerPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="QBO Duplicate Finder & Cleanup Checker"
      subtitle="Upload a QBO, OFX, or CSV export and find the duplicates, broken balance chains, and stale uncleared items that keep your QuickBooks reconciliation from tying out."
      tool={<QboCleanupChecker />}
      currentPath="/tools/free-qbo-cleanup-checker"
      faqs={FAQS}
      howToName="How to find duplicate transactions in QuickBooks"
      howToSteps={HOWTO}
      privacyLine="Free account · Checked in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">What this checker looks for</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Repeated transaction IDs</strong> — QuickBooks treats a repeated FITID as already-imported and can silently skip real transactions.</li>
            <li><strong className="text-zinc-900 dark:text-white">Identical transactions</strong> — same date, amount, and payee with no shared ID: the classic double export.</li>
            <li><strong className="text-zinc-900 dark:text-white">Near-duplicates</strong> — same amount within 3 days, similar payee name (AMZN vs Amazon). Flagged for your review, never auto-deleted.</li>
            <li><strong className="text-zinc-900 dark:text-white">Broken balance chains</strong> — when the file carries running balances, every step is verified: previous balance + transaction must equal the next balance.</li>
            <li><strong className="text-zinc-900 dark:text-white">Stale uncleared items</strong> — uncleared entries older than 90 days, the usual reason a reconciliation difference never reaches zero.</li>
            <li><strong className="text-zinc-900 dark:text-white">Import blockers</strong> — missing structure, missing ledger balance, missing dates, and transactions outside the declared statement period.</li>
          </ul>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">The Health Score</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Every file gets a score from 0 to 100: start at 100, subtract 10 per error, 5 per
            duplicate instance, and 2 per warning. A score of 90 or above is a clean file you can
            import with confidence. Under 70, run the cleanup pass first — and if you find the
            same problems month after month, the file is a symptom: your books need a{" "}
            <a href="/contact" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">cleanup</a>,
            not just a checker.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What the Cleaned QBO includes</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Pro users can download a cleaned QBO with exact duplicates removed, missing or
            repeated transaction IDs regenerated, and the original closing balance preserved as
            the ledger target — the same balance-ready format our{" "}
            <a href="/quickbooks" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">QuickBooks converter</a>{" "}
            produces. Import it through File → Utilities → Import → Web Connect Files (Desktop)
            or Transactions → Bank transactions → Upload a file (Online).
          </p>
        </>
      }
    />
  );
}
