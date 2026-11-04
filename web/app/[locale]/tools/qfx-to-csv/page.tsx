import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qfx-to-csv";

export const metadata: Metadata = {
  title: "QFX to CSV Converter — Free | Convert Statement",
  description: "Turn a Quicken QFX download into a clean CSV spreadsheet — one row per transaction — for review, sharing or moving away from Quicken. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QFX to CSV Converter — Free",
    description: "Upload a QFX file and download it as CSV — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I open a QFX file if I do not have Quicken?",
    a: "Convert it here and open the CSV. A QFX is a tagged OFX-family document that Windows and macOS have no built-in reader for; as a CSV it opens in Excel, Google Sheets or LibreOffice as one row per transaction, and you never need Quicken installed.",
  },
  {
    q: "What columns does the CSV have?",
    a: "Five, in this order: Date (yyyy-mm-dd), Type (the transaction type as recorded in the file, such as DEBIT or CREDIT), Description, Amount (signed, to two decimal places) and Transaction ID (the FITID from the QFX, blank only when the transaction carried none).",
  },
  {
    q: "Does the CSV include the account number, bank name or closing balance?",
    a: "No. Those live in the QFX wrapper around the transactions, and the CSV is the transactions only. Keep the original QFX with the spreadsheet whenever the closing balance or account identity might be questioned later.",
  },
  {
    q: "Can I turn the CSV back into a QFX later?",
    a: "A spreadsheet can be rebuilt into a QFX with the CSV to QFX converter, but treat the trip as one-way for identity: the CSV holds no account number or institution ID, so a rebuilt file cannot recover the bank identity the original QFX carried. Keep the original if there is any chance Quicken needs it again.",
  },
  {
    q: "Why are there two rows that look exactly the same?",
    a: "Usually because two bank downloads overlapped and both copies were converted and combined — the spreadsheet faithfully holds whatever it was given, twice. Sort by Transaction ID: rows sharing an ID are the same bank transaction appearing twice. Two rows with different IDs, the same amount and the same description may be a genuine repeat purchase, so check the IDs before deleting anything.",
  },
  {
    q: "Is this converter free, and is my file stored?",
    a: "Yes, it is fully free with no account. Your file is processed in memory to build the CSV and is never stored afterwards.",
  },
];

const HOWTO = [
  { title: "Find the QFX download", body: "Use the Quicken-format file from your bank’s download page, or the .qfx already stored from your Quicken years." },
  { title: "Upload the .qfx file here", body: "Drop it into the converter above — one file, up to 10 MB, no account and no Quicken required." },
  { title: "Press Convert to CSV", body: "Each transaction block in the QFX becomes one row — date, type, description, amount and transaction ID — in the order the file presents them." },
  { title: "Open the CSV and check the count", body: "The result panel reports how many transactions were converted. Open the download in your spreadsheet and confirm the row count and Amount total before you share or import it." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QfxToCsvPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QFX to CSV Converter"
      subtitle="Turn a Quicken QFX download into a clean CSV spreadsheet — one row per transaction — for review, sharing or moving away from Quicken. Fully free with no account."
      tool={<FormatConverter tool="qfx-to-csv" fromLabel="QFX" toLabel="CSV" accept=".qfx" outputExt="csv" />}
      currentPath="/tools/qfx-to-csv"
      faqs={FAQS}
      howToName="How to convert QFX to CSV"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>How to open a QFX file when Quicken is not in the picture</h2>
          <p className={P}>
            A QFX file usually arrives with a job attached and no way to look inside it. The bank offered it as the Quicken download; a client, a former bookkeeper or your own archive holds years of them; and the person who now needs the transactions — an accountant reviewing a year, a business owner leaving Quicken for other software, anyone answering a question about one payment — may not have Quicken at all. Opening the file directly gives tagged markup in a text editor, if it gives anything. The spreadsheet is the universal reader, and CSV is how a Quicken download becomes one.
          </p>
          <p className={P}>
            The conversion is deliberately narrow. Out of the QFX come its transactions, one row each: posting date, the type the file records, description, signed amount, and the transaction ID Quicken relied on. What stays behind is just as deliberate — the account number, the institution identity and the closing balance belong to the Quicken hand-off, not to a spreadsheet, and none of them become columns. So the CSV answers questions about activity completely, and questions about the account’s stated position not at all. Keep the QFX itself for those.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>CSV column</th><th className={TH}>What is in it</th><th className={TH}>Good to know</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Date</strong></td><td className={TD}>The posting date, written yyyy-mm-dd</td><td className={TD}>Sorts chronologically as plain text, in any spreadsheet</td></tr>
                <tr><td className={TD}><strong>Type</strong></td><td className={TD}>The OFX transaction type from the file, such as DEBIT, CREDIT or CHECK</td><td className={TD}>Copied from the source, not inferred from the amount</td></tr>
                <tr><td className={TD}><strong>Description</strong></td><td className={TD}>The transaction name, or its memo text when it has no name</td><td className={TD}>Read at up to 80 characters, exactly as parsed — nothing is cleaned or renamed</td></tr>
                <tr><td className={TD}><strong>Amount</strong></td><td className={TD}>The signed amount, to two decimal places</td><td className={TD}>Money out negative, money in positive, no currency conversion</td></tr>
                <tr><td className={TD}><strong>Transaction ID</strong></td><td className={TD}>The FITID Quicken used to tell transactions apart</td><td className={TD}>Your duplicate detector when several downloads are combined — and blank only if the source had none</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert QFX to CSV with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Locate the QFX for the period you need.</strong> That may mean a fresh Quicken-format download from the bank, or the stored file from the year in question. Check the filename and period before converting: converting last year’s file beautifully is still converting the wrong file.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload the .qfx above.</strong> One file, up to 10 MB, no account, and no Quicken installation involved at any point. The converter reads the statement’s transaction blocks directly, so there is no column mapping to configure.
          </p>
          <p className={P}>
            <strong>Step 3 — Press Convert to CSV and read the count.</strong> Rows come out in the order the QFX presents them — this converter does not re-sort the statement — and the result panel reports how many transactions it found. That number is your completeness check against the spreadsheet’s row count.
          </p>
          <p className={P}>
            <strong>Step 4 — Open it like data, not like a document.</strong> In Excel, import through the From Text/CSV flow and set the Transaction ID column to Text, so long IDs survive as IDs rather than being rounded into approximate numbers. Then sum the Amount column and compare a handful of rows against the bank statement or the Quicken register the file came from.
          </p>
          <p className={P}>
            <strong>Step 5 — Sort a copy, never the only copy.</strong> Sorting is how a spreadsheet answers questions, and sorting is also how a spreadsheet gets quietly scrambled when only some columns move. Select the entire table before sorting, work on a copy, and keep the downloaded CSV untouched as the version that still matches the QFX row for row.
          </p>

          <h2 className={H2M}>Reading a QFX as a spreadsheet: the problems that actually show up</h2>
          <h3 className={H3}>There is no running balance, and the sum is not the balance</h3>
          <p className={P}>
            People open the CSV expecting the register view Quicken gave them, balance after every row. There is no balance column here, because the QFX does not state a balance per transaction — it states one closing figure for the whole period, and that figure is not in the spreadsheet. Summing Amount gives the net movement across the rows you converted, which only becomes a balance when added to the account’s opening position from outside the file. Present it as movement, and nobody downstream mistakes it for money in the bank.
          </p>
          <h3 className={H3}>Two downloads were combined and the overlap is counted twice</h3>
          <p className={P}>
            Banks let you download overlapping ranges, and a CSV has no memory: it holds both copies of the overlap without complaint. This is what the Transaction ID column is for. Sort the combined sheet by that column and duplicated transactions sit adjacent, sharing an ID no two genuine transactions share. Remove one of each pair and re-check the total. If you hold many QFX files rather than two, the Bulk Exporter on this site combines up to ten into one sheet with a source-file column, which makes overlaps easier to trace — though spotting them remains your job.
          </p>
          <h3 className={H3}>A check number or a separate memo is missing</h3>
          <p className={P}>
            Correct — neither is a column in this output. The description is the transaction’s name, falling back to its memo text only when there is no name, and a check number written in the source file does not cross into the spreadsheet. If check numbers matter for the review you are doing, they have to be matched back from the QFX or the bank statement; do not reconstruct them from memory in a new column and let the sheet look authoritative.
          </p>
          <h3 className={H3}>The sheet stops at 500 rows</h3>
          <p className={P}>
            The reader takes up to 500 transactions from a single QFX. A full year of a busy personal account — the classic leaving-Quicken export — can pass that easily. Download or split the period into quarters, convert each file, and append them in date order, checking the seam dates so no boundary week appears twice or not at all.
          </p>
          <h3 className={H3}>Excel has reformatted the dates or IDs after all</h3>
          <p className={P}>
            If the IDs show in scientific notation or the dates have flipped to your locale’s format, the CSV is fine and Excel’s opening guesses are the problem. Re-open it through the import flow with explicit column types rather than fixing cells one by one — and never save the mangled version over the download, because saving writes Excel’s guesses back into the data permanently.
          </p>

          <h2 className={H2M}>From a Quicken download to a spreadsheet: the routes compared</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Route</th><th className={TH}>What you get</th><th className={TH}>Where it breaks</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Open the QFX in a text editor</strong></td><td className={TD}>The raw statement, tags and all</td><td className={TD}>Readable for one transaction, hopeless for a year — no sorting, no totals, nothing to hand to an accountant</td></tr>
                <tr><td className={TD}><strong>Export from Quicken itself</strong></td><td className={TD}>A register export in Quicken’s own layout</td><td className={TD}>Requires Quicken, the account set up in it, and the data already imported — useless for a QFX someone simply sent you</td></tr>
                <tr><td className={TD}><strong>Convert to CSV here</strong></td><td className={TD}>The same five columns for every file, IDs kept, fully free, no Quicken needed</td><td className={TD}>Transactions only: no account identity, no closing balance, no check numbers</td></tr>
                <tr><td className={TD}><strong>Convert to Excel instead</strong></td><td className={TD}>The same rows as a workbook, with amounts stored as numbers ready to sum</td><td className={TD}>Better for a person reading and annotating; worse as an interchange file for other software, which generally wants CSV</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The Excel route is the <a href="/tools/qfx-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to Excel converter</a>. If the destination turns out to be QuickBooks rather than a spreadsheet after all, skip the spreadsheet entirely and use the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a>, which keeps the bank identity this page’s CSV sets aside. Generic software gets the <a href="/tools/qfx-to-ofx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to OFX converter</a>, and a printable copy comes from the <a href="/tools/qfx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to PDF converter</a>. The same spreadsheet treatment for a plain bank OFX lives at the <a href="/tools/ofx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to CSV converter</a>.
          </p>
        </>
      }
    />
  );
}
