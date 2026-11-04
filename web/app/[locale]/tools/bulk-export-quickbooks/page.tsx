import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { BulkExporter } from "@/components/tools/BulkExporter";

const PAGE_URL = "https://www.convertstatement.online/tools/bulk-export-quickbooks";

export const metadata: Metadata = {
  title: "Bulk QBO Exporter — Merge Up to 10 QBO / OFX Files into One CSV or Excel | Convert Statement",
  description:
    "Free bulk exporter for QuickBooks files: upload up to 10 QBO, OFX or QFX files and merge every transaction into one CSV or Excel spreadsheet, with a Source File column on every row. Fully free, no account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Bulk QBO Exporter — Many QBO Files, One Spreadsheet",
    description:
      "Merge up to 10 QBO, OFX or QFX files into a single CSV or Excel file with a Source File column. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How does the bulk exporter work?",
    a: "Add up to 10 QBO, OFX or QFX files one at a time, choose CSV or Excel, and click Export. Every transaction from every file is merged into a single download, and each row carries one extra column — Source File — naming the file that transaction came from, so nothing loses its origin in the merge.",
  },
  {
    q: "Why merge QBO files into one spreadsheet at all?",
    a: "Banks hand you one file per account per month, so a year of bookkeeping for three accounts can mean 36 separate files. One merged spreadsheet lets you sort, filter and total a whole period at once — for a migration, a year-end review, or handing a client their complete activity in a single readable file.",
  },
  {
    q: "Will transactions get mixed up between accounts?",
    a: "No. Every row keeps its own date, type, description, amount and transaction ID exactly as they appear in its original file, and the Source File column records which file it came from. Amounts are never re-signed, rounded or converted — credits stay positive and debits stay negative.",
  },
  {
    q: "Can I merge bank and credit card files together?",
    a: "Yes. Credit card QBO files use the same format with a credit-card section instead of a bank section, and this exporter reads both. The Source File column keeps the two kinds apart in the merged spreadsheet, and charges appear negative while payments appear positive, matching the card statement.",
  },
  {
    q: "What is the difference between the CSV and Excel downloads?",
    a: "They contain exactly the same merged rows. Choose CSV when another system will import the data, and Excel when a person will read, sort or annotate it — the Excel version opens formatted in a spreadsheet app with the columns already sized.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Each file is processed in memory to build the merged download and is not stored afterwards. We never sell or share your financial data, the export is free with no account, and nothing is kept once you leave the page.",
  },
];

const HOWTO = [
  { title: "Collect your files", body: "Gather the .qbo, .ofx or .qfx files you want to combine — up to 10, each up to 10 MB, from any mix of bank and credit card accounts." },
  { title: "Add them one at a time", body: "Drop files in one by one and watch the list build. Remove any file you added by mistake before exporting." },
  { title: "Pick CSV or Excel", body: "CSV for importing into other software, Excel for reading and reviewing. Both hold the same merged transactions." },
  { title: "Export the merged file", body: "Download one spreadsheet with every transaction from every file, each row tagged with the file it came from. Fully free." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function BulkExportQuickBooksPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="Bulk QBO Exporter for QuickBooks"
      subtitle="Upload up to 10 QBO, OFX or QFX files and merge every transaction into one CSV or Excel spreadsheet — each row tagged with the file it came from. Fully free, no account."
      tool={<BulkExporter />}
      currentPath="/tools/bulk-export-quickbooks"
      faqs={FAQS}
      howToName="How to merge QBO files into one spreadsheet"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>One spreadsheet instead of a folder of files</h2>
          <p className={P}>
            QuickBooks downloads arrive in pieces: one QBO per account, per statement period,
            per bank. A bookkeeper closing a year for a client with a checking account, a
            savings account and a credit card can easily be holding dozens of small files,
            each readable only by QuickBooks itself. Answering even a simple question — what
            did this business spend on software last year? — means opening file after file.
          </p>
          <p className={P}>
            This exporter collapses the pile. Add up to ten QBO, OFX or QFX files and it
            merges every transaction they contain into a single CSV or Excel download: one
            row per transaction, in the order the files were added, with a Source File column
            recording exactly which file each row came from. The result is a spreadsheet you
            can sort by amount, filter by description, or total by period — across accounts,
            across banks, across a whole year at once.
          </p>

          <h2 className={H2M}>What the merged file contains</h2>
          <p className={P}>
            The merged download uses the same five columns as the single-file{" "}
            <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a>,
            plus the one column that makes a merge safe to use:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Column</th>
                  <th className={TH}>Contents</th>
                  <th className={TH}>Good to know</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Date</strong></td><td className={TD}>The transaction&apos;s posting date</td><td className={TD}>A real date, so the merged file sorts chronologically</td></tr>
                <tr><td className={TD}><strong>Type</strong></td><td className={TD}>CREDIT, DEBIT and the other OFX types</td><td className={TD}>Copied from the file, unchanged</td></tr>
                <tr><td className={TD}><strong>Description</strong></td><td className={TD}>Payee and memo text</td><td className={TD}>Word for word from the original file</td></tr>
                <tr><td className={TD}><strong>Amount</strong></td><td className={TD}>The signed amount</td><td className={TD}>Money in positive, money out negative — never re-signed in the merge</td></tr>
                <tr><td className={TD}><strong>Transaction ID</strong></td><td className={TD}>The FITID from the file</td><td className={TD}>Traces any row back to the exact transaction in its source</td></tr>
                <tr><td className={TD}><strong>Source File</strong></td><td className={TD}>The name of the file the row came from</td><td className={TD}>The merge never hides where a row started — filter on it to split the file apart again</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            After the export, the result panel lists how many rows each file contributed, so
            you can check the merged total against your expectations before you rely on it —
            a statement that should hold 212 transactions but contributed 0 would be caught
            there, not discovered at reconciliation time.
          </p>

          <h2 className={H2M}>When a bulk export earns its keep</h2>
          <p className={P}>
            Migrations are the classic case: moving a client off QuickBooks, or into a new
            accounting system, starts with getting every transaction out of Web Connect files
            and into a shape the new system can read. A single merged spreadsheet, with
            transaction IDs intact, is the safest possible hand-off. Year-end work is the
            other: an accountant reviewing twelve monthly files per account can merge the
            year, sort by description, and watch every recurring charge and duplicate
            subscription line up in adjacent rows.
          </p>
          <p className={P}>
            One caution the Source File column is built for: overlapping downloads. Banks let
            you pull overlapping date ranges, and if two of your files cover the same days,
            the merged spreadsheet will contain those transactions twice — faithfully, because
            both files contain them. Sort by Transaction ID and the duplicates sit next to
            each other sharing an ID; delete one copy of each pair and the totals return to
            the bank&apos;s numbers. Working the other direction instead? The{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>{" "}
            turns a spreadsheet back into a QuickBooks-ready file.
          </p>

          <h2 className={H2M}>Merging the files, step by step</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 1 — Collect the files.</strong>{" "}
            Gather the .qbo, .ofx or .qfx downloads you want in one sheet: up to 10 files, each
            up to 10 MB, from any mix of bank and credit card accounts.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 2 — Add them one at a time and check the list.</strong>{" "}
            Files are added individually so you can see exactly what is in the merge and remove
            anything added by mistake before exporting.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 3 — Choose CSV or Excel.</strong>{" "}
            Both downloads hold the same merged rows. CSV suits importing into other software;
            Excel (.xlsx) suits a person reading, sorting and annotating.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 4 — Export and verify the counts.</strong>{" "}
            The result panel lists how many rows each file contributed. Check those counts
            against the statements before you rely on the sheet — a file that contributed zero
            rows was empty or unreadable, and it is far better to learn that here.
          </p>

          <h2 className={H2M}>Problems a merged export surfaces — and the fixes</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">A file contributes no rows.</strong>{" "}
            Usually the download was truncated, or it is not really a QBO/OFX file at all (a CSV
            renamed by a browser is the classic). Re-download it untouched and add it again.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Totals do not match the statements.</strong>{" "}
            Work the Source File column: filter the sheet to one file at a time and total it
            against that statement. The mismatch isolates to a single source file almost every
            time — most often an overlapping download counted twice, which the Transaction ID
            column exposes when you sort by it.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">You need the data back in QuickBooks shape.</strong>{" "}
            A merged spreadsheet is a reading and migration format, not an import file. To move
            the other way — many CSVs into one import file — use the{" "}
            <a href="/tools/bulk-import-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Bulk Importer for QuickBooks</a>;
            to combine QBO files into a single QBO instead of a spreadsheet, use the{" "}
            <a href="/tools/qbo-merger" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Merger</a>.
          </p>
        </>
      }
    />
  );
}
