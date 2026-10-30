import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { QboSplitter } from "@/components/tools/QboSplitter";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-splitter";

export const metadata: Metadata = {
  title: "QBO File Splitter — Free Trim a QBO to a Date Range | Convert Statement",
  description:
    "Free QBO file splitter: upload a QBO, OFX, or QFX file, choose a date range, and download a trimmed QBO containing only those transactions, with the closing balance adjusted to the last kept transaction. Fully free, no account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QBO File Splitter — Trim a QBO File to a Date Range",
    description:
      "Upload a QBO file, pick the dates you want to keep, and download a smaller QBO free — no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Why would I split or trim a QBO file?",
    a: "Common reasons are importing one month at a time from a file that covers several months, re-importing a short period after a problem without touching the rest of the file, or sharing only the transactions for a specific period. Trimming the file to the dates you need keeps the import limited to exactly that range.",
  },
  {
    q: "What happens to the closing balance in the trimmed file?",
    a: "When the original file carries a closing (ledger) balance, the tool rebuilds running balances from it and sets the trimmed file's closing balance to the balance after the last kept transaction. That keeps the balance chain consistent, so reconciliation in QuickBooks starts from the right target for the kept period.",
  },
  {
    q: "What if my file has no closing balance?",
    a: "Then there is no real balance to carry into the trimmed file. In that case the trimmed file carries a zero ledger balance, and the tool tells you this before you download, because the original file had no closing balance. You can still import the transactions; you will set the reconciliation target in QuickBooks yourself.",
  },
  {
    q: "Are the start and end dates inclusive?",
    a: "Yes. Transactions dated exactly on the start date or exactly on the end date are kept. The tool shows live counts of how many transactions are kept, how many are dropped before the range, and how many are dropped after it, so you can check the range before downloading.",
  },
  {
    q: "Which file types can I split?",
    a: "QBO, OFX, and QFX files — they are all OFX format underneath. The download is always a QBO file containing only the transactions inside your chosen date range, keeping each transaction's original date, name, amount, and transaction ID.",
  },
  {
    q: "Is this tool really free, and is my file stored?",
    a: "Yes — the trimmed QBO download is fully free, with no account and no Pro plan required. Your file is processed in memory and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Upload your QBO file", body: "Drop in a QBO, OFX, or QFX file. The tool reads its statement period, transaction count, and closing balance." },
  { title: "Choose the date range", body: "Set the start and end dates to keep. Both dates are inclusive, and the kept and dropped counts update as you change them." },
  { title: "Check the counts", body: "Confirm the number of transactions kept matches the period you intended before downloading." },
  { title: "Download and import", body: "Download the trimmed QBO free and import it into QuickBooks through the usual bank-feed or Web Connect import." },
];

export default function QboSplitterPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QBO File Splitter"
      subtitle="Trim a QBO file to just the dates you need: upload it, choose a date range, and download a smaller QBO free — no account needed."
      tool={<QboSplitter />}
      currentPath="/tools/qbo-splitter"
      faqs={FAQS}
      howToName="How to split a QBO file"
      howToSteps={HOWTO}
      privacyLine="Fully free, no account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Why trimming a QBO by hand goes wrong</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            A QBO file is not a spreadsheet you can safely delete rows from in a text editor.
            Deleting transactions by hand leaves the file's statement period and closing balance
            describing the original, longer period — so when QuickBooks imports the edited file,
            reconciliation starts from a target that no longer matches the transactions inside
            it. This splitter rebuilds the file properly: it keeps the original transaction IDs,
            sets the period to the kept range, and adjusts the closing balance to the balance
            after the last kept transaction.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Inclusive date range</strong> — transactions on the start and end dates are kept, with live kept and dropped counts.</li>
            <li><strong className="text-zinc-900 dark:text-white">Balance rebuilt correctly</strong> — when the original file has a closing balance, running balances are rebuilt from it so the trimmed file's chain still checks out.</li>
            <li><strong className="text-zinc-900 dark:text-white">Honest handling of missing balances</strong> — a file with no closing balance produces a trimmed file with a zero ledger balance, and the tool says so up front.</li>
            <li><strong className="text-zinc-900 dark:text-white">Original transaction IDs kept</strong> — each kept transaction retains its ID, so QuickBooks duplicate detection still works as expected.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Before importing any QBO, you can run it through the{" "}
            <a href="/tools/qbo-checker" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QBO File Checker</a>{" "}
            to review its structure and balances, or use the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QBO Duplicate Finder</a>{" "}
            if you are worried about importing the same transactions twice.
          </p>
        </>
      }
    />
  );
}
