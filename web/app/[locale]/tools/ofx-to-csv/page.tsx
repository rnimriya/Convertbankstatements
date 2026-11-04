import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/ofx-to-csv";

export const metadata: Metadata = {
  title: "OFX to CSV Converter — Free | Convert Statement",
  description: "Turn a bank OFX file into a clean CSV spreadsheet — one row per transaction with dates, descriptions and amounts — for review, sharing or migration. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OFX to CSV Converter — Free",
    description: "Upload a OFX file and download it as CSV — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I open an OFX file without QuickBooks or Quicken?",
    a: "Convert it here. Upload the .ofx, press Convert to CSV, and open the download in Excel, Google Sheets or LibreOffice. You get one row per transaction instead of tagged markup, with no accounting software involved at any point.",
  },
  {
    q: "What columns does the CSV have?",
    a: "Five, in this order: Date (in ISO yyyy-mm-dd form), Type (the transaction type exactly as the file records it, such as DEBIT or CREDIT), Description, Amount (signed, to two decimal places) and Transaction ID (the FITID from the source file, blank only when the file carried none).",
  },
  {
    q: "Does the CSV include my account number or closing balance?",
    a: "No. Account number, bank name, statement period and closing balance live in the OFX wrapper, not in the transaction list, and this CSV is the transaction list only. If you need the closing balance, read it from the original OFX — it is never copied into the spreadsheet and never invented.",
  },
  {
    q: "Why did Excel turn my Transaction IDs into numbers like 2.02611E+11?",
    a: "Excel guesses at cell types when it opens a CSV, and a long ID looks like a number to it. Use Data, then From Text/CSV, and set the Transaction ID column to Text before loading, or open the file in Google Sheets. The ID in the CSV itself is unchanged — only Excel’s display of it went wrong.",
  },
  {
    q: "How many transactions can one OFX file hold here?",
    a: "The reader takes up to 500 transactions from one file, and the file itself can be up to 10 MB. For a longer period, download the OFX from your bank in shorter chunks — a quarter at a time, say — convert each one, and stack the CSVs in your spreadsheet.",
  },
  {
    q: "Is this converter free, and is my file stored?",
    a: "Yes, it is fully free with no account, and no Pro step sits behind the download. Your file is processed in memory to build the CSV and is never stored afterwards.",
  },
];

const HOWTO = [
  { title: "Download the OFX from your bank", body: "In your bank’s download or export area, choose the OFX format and the date range you need — not the PDF statement, which is a different file." },
  { title: "Upload the .ofx file here", body: "Drop it into the converter above. One file at a time, up to 10 MB, no account and no column mapping to set up." },
  { title: "Press Convert to CSV", body: "The converter reads the transaction blocks inside the OFX and writes one CSV row per transaction, in the order the file presents them." },
  { title: "Check the count, then open the CSV", body: "The result panel reports how many transactions were converted. Open the download in your spreadsheet and check that count and the Amount total before you rely on it." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function OfxToCsvPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="OFX to CSV Converter"
      subtitle="Turn a bank OFX file into a clean CSV spreadsheet — one row per transaction with dates, descriptions and amounts — for review, sharing or migration. Fully free with no account."
      tool={<FormatConverter tool="ofx-to-csv" fromLabel="OFX" toLabel="CSV" accept=".ofx" outputExt="csv" />}
      currentPath="/tools/ofx-to-csv"
      faqs={FAQS}
      howToName="How to convert OFX to CSV"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Your bank gave you an OFX file, but you need to read it in a spreadsheet</h2>
          <p className={P}>
            Double-clicking an OFX file is a dead end for most people. It opens in a text editor as nested tags — STMTTRN blocks, DTPOSTED timestamps, amounts buried inside markup — or it opens in nothing at all. Yet the reason you downloaded it usually has nothing to do with accounting software: you want to sort a year of spending, filter out one payee, hand the transactions to an accountant who works in Excel, check a client’s activity, or feed the data into a tool that accepts CSV and has never heard of OFX. No QuickBooks is involved, and none should have to be.
          </p>
          <p className={P}>
            That is the whole job of this page. The OFX transaction list becomes a plain spreadsheet: one row per transaction, in a file Excel, Google Sheets, LibreOffice and almost every importer can open. What you get is exactly the transactions — and it helps to know what stays behind. The account number, the bank name, the statement period and the closing balance are part of the OFX wrapper, not the transaction list, so none of them appear as columns. A CSV built here can tell you what moved; tying it back to the bank’s closing figure still happens against the original file.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>CSV column</th><th className={TH}>What is in it</th><th className={TH}>Good to know</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Date</strong></td><td className={TD}>The posting date, written yyyy-mm-dd</td><td className={TD}>ISO order means the column sorts chronologically as plain text</td></tr>
                <tr><td className={TD}><strong>Type</strong></td><td className={TD}>The OFX transaction type, such as DEBIT, CREDIT or CHECK</td><td className={TD}>Copied from the file, not worked out from the sign</td></tr>
                <tr><td className={TD}><strong>Description</strong></td><td className={TD}>The transaction name; the memo text is used when a transaction has no name</td><td className={TD}>Names are read at up to 80 characters, as the parser takes them</td></tr>
                <tr><td className={TD}><strong>Amount</strong></td><td className={TD}>The signed amount, to two decimal places</td><td className={TD}>Money out is negative and money in is positive, exactly as the bank recorded it</td></tr>
                <tr><td className={TD}><strong>Transaction ID</strong></td><td className={TD}>The FITID the bank assigned that transaction</td><td className={TD}>Blank only when the source transaction carried no ID</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert OFX to CSV with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Download the right file from your bank.</strong> In the bank’s export area, pick the OFX option and the date range you actually need. Banks often place OFX next to CSV, QFX and PDF choices that sound similar; the PDF statement in that list cannot be used here, because it is a picture of a statement rather than transaction data.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload it.</strong> Drop the .ofx into the converter above. There is nothing to map and nothing to install: the format carries its own structure, so the converter reads the transaction blocks directly. Files can be up to 10 MB.
          </p>
          <p className={P}>
            <strong>Step 3 — Press Convert to CSV.</strong> Each transaction block becomes one row, in the order the file presents them — this converter does not re-sort your statement. Amounts are copied exactly, with no currency conversion.
          </p>
          <p className={P}>
            <strong>Step 4 — Verify before you trust it.</strong> The result panel states how many transactions were converted. In your spreadsheet, count the rows and sum the Amount column, then spot-check two or three rows against the bank’s own statement. If you have several monthly OFX files to combine rather than one, the <a href="/tools/bulk-export-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Bulk Exporter for QuickBooks</a> merges up to ten OFX-family files into one sheet with a source-file column.
          </p>
          <p className={P}>
            <strong>Step 5 — Work in the spreadsheet, keep the original.</strong> Sort, filter and annotate the CSV freely, but keep the OFX untouched in the same folder. The CSV is your working copy; the OFX remains the file that still holds the account identity and closing balance.
          </p>

          <h2 className={H2M}>When the spreadsheet is not what you expected</h2>
          <h3 className={H3}>The converter says the file does not look like OFX</h3>
          <p className={P}>
            The usual cause is a renamed file: a PDF statement saved as .ofx, or a download that was cut short before it finished. Check the file size and re-download it from the bank. If a genuine, complete OFX still fails, run it through the QBO File Checker on this site, which reads OFX-family files and names the structural problem without changing the file.
          </p>
          <h3 className={H3}>The rows stop partway through a long period</h3>
          <p className={P}>
            The reader takes up to 500 transactions from a single file. A busy account downloaded for a full year can pass that, and the CSV will hold the first 500 the file presents. The fix is at the bank’s end: download the same account in shorter periods, convert each file, and append the results in your spreadsheet, checking the boundaries so no week is counted twice.
          </p>
          <h3 className={H3}>A column you expected is missing</h3>
          <p className={P}>
            Check numbers, a separate memo column and a running balance are not part of this output. A transaction’s check number stays in the source file, a memo is only used as the description when the transaction has no name, and no running balance is calculated — the bank’s OFX does not promise one per row, and inventing one would put a figure in your spreadsheet that the bank never stated. If you need a running total, sort a copy of the sheet by date and add a cumulative sum of Amount; treat it as movement since the first row, not as the account balance.
          </p>
          <h3 className={H3}>Excel has mangled dates or IDs on open</h3>
          <p className={P}>
            That damage happens in Excel, not in the conversion. Excel reinterprets CSV cells on open: long Transaction IDs can become scientific notation and lose digits, and dates can be reformatted to your computer’s locale. Import through Excel’s From Text/CSV flow with the Transaction ID set to Text, and never re-save over your only copy after tidying — keep the downloaded CSV as the clean original.
          </p>
          <h3 className={H3}>One row has an empty Amount</h3>
          <p className={P}>
            A transaction whose amount the source file states in an unreadable form comes through with a blank amount rather than a guessed one. Find that date and description in the original OFX or on the bank statement, fix the spreadsheet row by hand, and note the correction — a silent estimate would be worse than a visible gap.
          </p>

          <h2 className={H2M}>Four ways to read an OFX file, honestly compared</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Route</th><th className={TH}>What you get</th><th className={TH}>Where it breaks</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Open it in a text editor</strong></td><td className={TD}>The raw tags, free and immediate</td><td className={TD}>Fine for finding one value; unusable for sorting, totalling or sharing a year of activity</td></tr>
                <tr><td className={TD}><strong>Ask the bank for a CSV instead</strong></td><td className={TD}>A spreadsheet made by the bank</td><td className={TD}>Only helps if the bank offers one for that account and period, and its layout varies from bank to bank — and it still cannot rescue an OFX you already hold</td></tr>
                <tr><td className={TD}><strong>Convert the OFX to CSV here</strong></td><td className={TD}>The same five columns every time, IDs kept, fully free</td><td className={TD}>Wrapper data stays behind: no account number, no closing balance, no check numbers</td></tr>
                <tr><td className={TD}><strong>Import it into finance software</strong></td><td className={TD}>The transactions inside an app’s register</td><td className={TD}>Only helps if you use that app — and getting the data back out for someone else starts the problem again</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Need a document instead of data from the same file? The <a href="/tools/ofx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to PDF converter</a> renders it as a printable statement. If the destination is Quicken or QuickBooks rather than a spreadsheet, use the <a href="/tools/ofx-to-qfx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QFX converter</a> or the <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO converter</a> instead — both keep the bank identity a spreadsheet drops. A Web Connect file reads the same way through the <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a>.
          </p>
        </>
      }
    />
  );
}
