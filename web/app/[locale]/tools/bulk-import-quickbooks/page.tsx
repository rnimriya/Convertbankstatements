import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { BulkImporter } from "@/components/tools/BulkImporter";

const PAGE_URL = "https://www.convertstatement.online/tools/bulk-import-quickbooks";

export const metadata: Metadata = {
  title: "Bulk Importer for QuickBooks — Merge Bank CSVs into One QBO or IIF File | Convert Statement",
  description:
    "Free bulk importer for QuickBooks: add several bank CSV exports, map the columns once, and download one merged QBO file for QuickBooks Online or IIF file for QuickBooks Desktop. Up to 10,000 transactions, no account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Bulk Importer for QuickBooks — Bank CSVs to One QBO or IIF File",
    description:
      "Merge multiple bank CSV exports into a single QuickBooks import file — QBO for Online, IIF for Desktop. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What does the Bulk Importer do?",
    a: "It takes several bank CSV exports — different accounts, different months, or one long export per account — reads them with a single column mapping, and merges every transaction into one import file: a .qbo for QuickBooks Online or an .iif for QuickBooks Desktop. Instead of importing a dozen small files one at a time and fixing the mapping on each, you map once and import once.",
  },
  {
    q: "Does this tool connect to my QuickBooks account or post transactions for me?",
    a: "No. This is a file-based tool: it prepares a standard import file and you import that file yourself inside QuickBooks. It never asks for your QuickBooks login, never connects to your company, and never posts, edits or deletes anything in your books. You review the file's transactions in QuickBooks before they are added, exactly as with any bank upload.",
  },
  {
    q: "Which CSV files can I use?",
    a: "Any bank or card CSV export that has a header row and, at minimum, a date column, a description or payee column, and either one signed amount column or a debit/credit column pair. The tool auto-detects the columns and shows you the mapping before building. All files in one batch should share the same column layout, which is automatic when they come from the same bank. Up to 20 files at a time, each up to 10 MB.",
  },
  {
    q: "How many transactions can I merge into one file?",
    a: "Up to 10,000 transactions in total across the whole batch — the tool stops the build with a clear message if the files hold more. That covers a month-end for most small businesses many times over. For a multi-year cleanup, build one file per year (or per batch of 10,000) and import them in sequence.",
  },
  {
    q: "What are the account fields for in the IIF option?",
    a: "An IIF file is double-entry: every bank transaction is balanced by an offset line against another account. The bank account field is the account the money moves through; deposits are offset to the income account and payments to the expense account. Use the exact names from your QuickBooks Desktop chart of accounts, because IIF imports match accounts by name.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your files are processed in memory to build the import file and are not stored afterwards. The tool is fully free with no account. The column mapping is kept only in your own browser's local storage on your device, and is offered back on your next visit.",
  },
];

const HOWTO = [
  { title: "Export your CSVs", body: "Download a CSV export for each account or period from your bank — the same export you would normally import one by one." },
  { title: "Add the files and map the columns", body: "Drop the CSVs in above, check the row counts, and confirm the column mapping the tool detected. One mapping covers the whole batch." },
  { title: "Choose QBO or IIF and build", body: "Pick QBO for QuickBooks Online or IIF for QuickBooks Desktop (adding your account names), then build the single merged import file." },
  { title: "Import inside QuickBooks", body: "In QuickBooks Online use Banking → Upload a file; in Desktop use File → Utilities → Import → IIF Files. Review the transactions before adding them to your books." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function BulkImportQuickBooksPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="Bulk CSV to QBO Importer for QuickBooks"
      subtitle="Add several bank CSV exports, map the columns once, and download one merged import file — QBO for QuickBooks Online or IIF for QuickBooks Desktop. Fully free, no account, and no connection to your QuickBooks company."
      tool={<BulkImporter />}
      currentPath="/tools/bulk-import-quickbooks"
      faqs={FAQS}
      howToName="How to bulk-import bank CSVs into QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>One import file from many CSV exports</h2>
          <p className={P}>
            QuickBooks is happy to import bank transactions from a file — it is the repetition
            that wears people down. A business with three bank accounts and a credit card,
            catching up on a quarter, is looking at a dozen separate exports. Imported one at
            a time, each file means the same routine: upload, check which column QuickBooks
            thinks is the amount, fix it, review, repeat. The mapping work is identical every
            time because the files all came from the same bank in the same format.
          </p>
          <p className={P}>
            The bulk importer removes the repetition. Add every CSV to one batch, confirm a
            single column mapping, and the tool merges all of the transactions — every
            account, every month — into one standard import file. One upload, one review pass
            in QuickBooks, and the batch is in your books. The transactions themselves are
            copied exactly as your bank exported them: dates, descriptions, and signed amounts
            are not re-typed, cleaned up, or re-calculated, so the merged file ties back to
            the exports it came from.
          </p>

          <h2 className={H2M}>QBO or IIF — which file do you need?</h2>
          <p className={P}>
            QuickBooks Online and QuickBooks Desktop accept different import files, and the
            right choice depends only on which product you use. Both files are built from the
            same merged transactions; nothing about your data changes between them.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Format</th>
                  <th className={TH}>For</th>
                  <th className={TH}>How you import it</th>
                  <th className={TH}>Good to know</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={TD}><strong>QBO</strong> (Web Connect)</td>
                  <td className={TD}>QuickBooks Online</td>
                  <td className={TD}>Banking → Link account dropdown → Upload a file</td>
                  <td className={TD}>Each transaction carries a unique ID, so re-importing the same file does not create duplicates</td>
                </tr>
                <tr>
                  <td className={TD}><strong>IIF</strong></td>
                  <td className={TD}>QuickBooks Desktop (Pro, Premier, Enterprise)</td>
                  <td className={TD}>File → Utilities → Import → IIF Files</td>
                  <td className={TD}>Double-entry format: bank lines are offset to your income and expense accounts, matched by exact account name</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            One caution belongs to the IIF side: Desktop IIF imports write directly into the
            company file and cannot be undone in bulk, so make a backup of the company file
            before importing a large batch — File → Create Backup takes a minute and turns a
            mistake into a restore instead of a cleanup. QBO imports into QuickBooks Online
            are gentler: uploaded transactions wait in the banking review tab until you add
            or exclude them, so a wrong file can simply be left un-added.
          </p>

          <h2 className={H2M}>What this tool does — and deliberately does not do</h2>
          <p className={P}>
            This tool prepares a file. It does not connect to QuickBooks, it does not ask for
            your Intuit login, and it cannot post, edit, or delete anything inside your
            company. That boundary is deliberate. Tools that work inside your live books need
            broad access to your accounting data; a file-based importer needs nothing but the
            CSVs you choose to give it, and you stay the person who decides what enters the
            books, because the import happens in QuickBooks under your own review.
          </p>
          <h3 className={H3}>Getting the mapping right</h3>
          <p className={P}>
            Almost every failed import traces back to the mapping, not the file. Two checks
            catch most problems before you build. First, the amount shape: if your export has
            one amount column, deposits should be positive and payments negative — if the bank
            exported them the other way around, map the debit and credit columns instead and
            the tool will sign them correctly. Second, the date format: exports in
            month/day/year and day/month/year look identical in a preview row like 03/04/2026,
            so if your bank is outside the US, scan a few preview rows against a transaction
            you recognize. The mapping is saved in your browser, so next month&apos;s batch
            from the same bank starts already mapped.
          </p>
          <p className={P}>
            Working the other direction? The{" "}
            <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a>{" "}
            turns a Web Connect file back into a spreadsheet, and the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>{" "}
            handles a single CSV with a running-balance check when you do not need the bulk merge.
          </p>

          <h2 className={H2M}>Where bulk imports go wrong</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Files with different layouts in one batch.</strong>{" "}
            One mapping covers the whole batch, so a Chase CSV and a credit-union CSV with
            different column orders cannot share it. Batch by source: one run per bank layout,
            one import file per run.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Overlapping months.</strong>{" "}
            If March's export and the first-quarter export both contain March, the merged file
            contains March twice. The QBO's transaction IDs protect you on a straight
            re-import of the same file, but two different exports of the same activity can
            carry different IDs — check overlaps before you build, and scan the result with the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            if a range looks doubled.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Crossing the 10,000-row cap mid-cleanup.</strong>{" "}
            The build stops rather than silently truncating, so split the batch at a clean
            boundary — by year or by account — and import the files in date order, reviewing
            each in QuickBooks before the next.
          </p>
        </>
      }
    />
  );
}
