import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { ReconciliationFinder } from "@/components/tools/ReconciliationFinder";

const PAGE_URL = "https://www.convertstatement.online/tools/reconciliation-finder";

export const metadata: Metadata = {
  title: "Reconciliation Difference Finder — Why QuickBooks Doesn't Reconcile | Convert Statement",
  description:
    "Free reconciliation difference finder: upload a bank statement and a QuickBooks export, and see exactly which entries are missing, extra, amount-mismatched, or date-drifted. Free CSV difference report with no account; matched-only QBO on Pro.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Reconciliation Difference Finder",
    description:
      "Compare a bank statement against QuickBooks and find the exact entries behind the difference. Free to scan.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Why doesn't my QuickBooks account reconcile?",
    a: "Almost always one of four things: a transaction recorded in QuickBooks but not on the statement (or the reverse), an amount that differs by a fee or a partial payment, a transaction posted on a different date than it cleared, or a duplicate. This tool separates those cases instead of giving you one lump difference to hunt through.",
  },
  {
    q: "What files should I upload?",
    a: "Two exports for the same period: your bank statement as CSV (or QBO/OFX) and your QuickBooks transactions as CSV (or QBO). In QuickBooks Online, export from the account register or a transaction report. Both files need date, description, and amount columns.",
  },
  {
    q: "What is a date-drift entry? Is it a real problem?",
    a: "Usually not. A date-drift entry has the same amount and payee on both sides but posted a few days apart — the difference between when you recorded it and when it cleared the bank. It explains a timing difference at month-end but is not an error to fix.",
  },
  {
    q: "What does the matched-only QBO contain?",
    a: "Only the entries that agreed on both sides, with fresh transaction IDs. It is meant for importing into a clean account — not for re-importing the whole month, which would duplicate the entries that already imported correctly. The matched-only download is on Pro; the full difference report (CSV) is free.",
  },
  {
    q: "My difference is exactly one transaction. What do I do?",
    a: "Look at the missing or extra list for that amount. A missing entry means it was never recorded in QuickBooks — record it. An extra entry means it was recorded twice, voided, or belongs to another period — delete or void it in QuickBooks, after checking the statement.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "No. Both files are processed in memory to build the comparison and are not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export both sides", body: "Download the bank statement and the QuickBooks transactions for the same period, as CSV or QBO." },
  { title: "Upload both files", body: "Drop the statement on the left and the QuickBooks export on the right, then run the comparison." },
  { title: "Read the findings", body: "Missing, extra, amount-mismatch, and date-drift entries are listed separately, with totals for each side." },
  { title: "Fix and re-check", body: "Fix the entries in QuickBooks, then re-run the comparison until the difference is zero." },
];

export default function ReconciliationFinderPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="Reconciliation Difference Finder"
      subtitle="Your QuickBooks balance is off — but by which entries? Compare the statement against QuickBooks and see every missing, extra, and mismatched entry."
      tool={<ReconciliationFinder />}
      currentPath="/tools/reconciliation-finder"
      faqs={FAQS}
      howToName="How to find a reconciliation difference"
      howToSteps={HOWTO}
      privacyLine="No account needed to scan · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">A difference is a list, not a number</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            A reconciliation difference of, say, $142.50 tells you nothing by itself — it
            could be one missing deposit, three small fees, or a duplicate that happens to
            net out. This tool turns the difference into a list: entries on the statement
            but not in QuickBooks, entries in QuickBooks but not on the statement, entries
            whose amounts disagree, and entries whose dates drifted by a few days. Fix the
            list and the difference goes to zero; there is no step where you adjust the
            books to force it.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What counts as a match</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Matched</strong> — same date, same amount, same payee on both sides.</li>
            <li><strong className="text-zinc-900 dark:text-white">Amount mismatch</strong> — same date and payee, different amount: a fee, a partial payment, or a typo.</li>
            <li><strong className="text-zinc-900 dark:text-white">Date drift</strong> — same amount and payee within 7 days: usually posting date vs cleared date.</li>
            <li><strong className="text-zinc-900 dark:text-white">Missing / extra</strong> — on one side only: unrecorded, duplicated, voided, or from another period.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Checking a single file before import instead? Use the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">QBO Duplicate Finder</a>{" "}
            or the{" "}
            <a href="/tools/qbo-checker" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">QBO File Checker</a>.
            {" "}If the mess spans months, our{" "}
            <a href="/services/quickbooks-cleanup" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">cleanup service</a>{" "}
            handles it with a free assessment first.
          </p>
        </>
      }
    />
  );
}
