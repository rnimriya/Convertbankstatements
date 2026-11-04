import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { QboToCsv } from "@/components/tools/QboToCsv";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-to-csv";

export const metadata: Metadata = {
  title: "QBO to CSV Converter — Free QBO / OFX to CSV & Excel | Convert Statement",
  description:
    "Free QBO to CSV converter: turn a QuickBooks Web Connect (.qbo), OFX or QFX file into a clean CSV or Excel spreadsheet with dates, descriptions, amounts and transaction IDs. Fully free, no account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QBO to CSV Converter — QBO / OFX to CSV & Excel",
    description:
      "Upload a QBO, OFX or QFX file and download its transactions as CSV or Excel. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QBO file to CSV?",
    a: "Upload the .qbo file here. The tool reads the transactions inside it — date, type, description, amount, and the transaction ID (FITID) — and shows a preview with your totals. Download the CSV or the Excel file, both fully free with no account.",
  },
  {
    q: "Can I also convert OFX or QFX files?",
    a: "Yes. A QBO file is OFX format underneath, so the same converter reads .ofx files from banks and .qfx files from Quicken. All three produce the same spreadsheet every time: Date, Type, Description, Amount, Transaction ID.",
  },
  {
    q: "How do I open a .qbo file without QuickBooks?",
    a: "That is exactly what this page does — upload the file and read its transactions as a spreadsheet. A .qbo file is structured OFX text, not a spreadsheet, so opening it directly in Excel shows markup rather than rows. Converting it first gives you one readable row per transaction.",
  },
  {
    q: "What does the Transaction ID column contain, and are amounts changed?",
    a: "The Transaction ID is the FITID from your file — the unique ID QuickBooks uses to detect duplicates — kept intact so any row can be traced back to the exact transaction in the original file. It is blank only when the original file carried no ID. Amounts are copied exactly as they appear: credits stay positive and debits stay negative.",
  },
  {
    q: "Can I convert a credit card QBO file?",
    a: "Yes. Credit card downloads use the same QBO format with a credit-card section instead of a bank section, and this converter reads both. Charges come out negative and payments positive, matching how the card statement reads.",
  },
  {
    q: "Is this converter free, and is my data stored?",
    a: "Both downloads are fully free, with no account, for files up to 10 MB. Your file is processed in memory to build the conversion and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Get your QBO file", body: "Download the .qbo, .ofx, or .qfx file from your bank, or use one you already have on your computer." },
  { title: "Upload it here", body: "Drop the file in. The tool reads its transactions itself — there is nothing to map — and shows the statement period and totals." },
  { title: "Check the preview", body: "Review the first 50 rows and the money-in, money-out, and net totals, plus any warnings about the file itself." },
  { title: "Download CSV or Excel", body: "Save the spreadsheet — both downloads are fully free, with every row from the file included." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QboToCsvPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QBO to CSV Converter"
      subtitle="Turn a QuickBooks QBO, OFX, or QFX file into a clean CSV or Excel spreadsheet — dates, descriptions, amounts, and transaction IDs, fully free with no account."
      tool={<QboToCsv />}
      currentPath="/tools/qbo-to-csv"
      faqs={FAQS}
      howToName="How to convert a QBO to CSV"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>A QBO file only QuickBooks can read — until it is a spreadsheet</h2>
          <p className={P}>
            This converter runs in the opposite direction from most tools on this site. A QBO
            (Web Connect) file does exactly one job well: feeding transactions into QuickBooks.
            For everything else, it is the wrong shape. It is a nested tag format written for
            machines — open one and you see markup, not transactions. You cannot sort it, filter
            it, or hand it to a client who does not run QuickBooks and expect them to read it.
          </p>
          <p className={P}>
            Converting the file to CSV or Excel turns that markup into rows anyone can read: one
            transaction per line, with its date, type, description, amount, and the transaction
            ID (FITID) QuickBooks itself uses to spot duplicates. That makes this the auditing
            and sharing route for a Web Connect file — the version you send a client who works in
            another system, attach to a review, analyze in a pivot table, or keep when you are
            moving away from QuickBooks entirely. Nothing about the underlying data changes;
            only its shape does.
          </p>
          <p className={P}>
            The same converter also reads the QBO file&rsquo;s two close relatives: plain .ofx files
            from banks and .qfx files from Quicken. Underneath, all three are the same OFX data,
            so all three come out as the same five-column spreadsheet — a small mercy when a
            folder holds a mix of downloads from different banks and different years.
          </p>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="A spreadsheet of bank transactions converted out of a QBO file, with date, description, amount and transaction ID columns" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">The same transactions, laid out as rows anyone can open — no QuickBooks required.</figcaption>
          </figure>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Part of the file</th>
                  <th className={TH}>What it holds</th>
                  <th className={TH}>Where it lands</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Statement header</strong></td><td className={TD}>Bank, account, currency, statement period</td><td className={TD}>The preview summary, so you can confirm you converted the right file</td></tr>
                <tr><td className={TD}><strong>Transaction (STMTTRN)</strong></td><td className={TD}>Date, type, amount, payee and memo text</td><td className={TD}>One row per transaction in the spreadsheet</td></tr>
                <tr><td className={TD}><strong>FITID</strong></td><td className={TD}>The bank&rsquo;s unique ID for that transaction</td><td className={TD}>The Transaction ID column, kept intact</td></tr>
                <tr><td className={TD}><strong>Ledger balance (LEDGERBAL)</strong></td><td className={TD}>Closing balance for the statement period</td><td className={TD}>The totals panel, so the spreadsheet can be tied back to the bank</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert a QBO file to CSV or Excel</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 1 — Get the file.</strong>{" "}
            Download the .qbo, .ofx or .qfx file from your bank, or find the one already sitting
            on your computer — a file a client sent you works just as well. Files up to 10 MB are
            accepted.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 2 — Drop it in above.</strong>{" "}
            Unlike a CSV conversion, there is nothing to map: the converter reads the OFX data
            and identifies the account and statement period itself.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 3 — Check the preview and tie it out.</strong>{" "}
            Review the first 50 transactions, the statement period, and three numbers: money in,
            money out, and the net change. Add the net change to the balance the account had at
            the start of the period and you should land on the file&rsquo;s ledger balance, which is
            shown when the file carries one. Read any warnings before you rely on the data — a
            missing closing balance or a repeated transaction ID is listed, not hidden, because a
            spreadsheet built from a flawed file inherits the flaws.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 4 — Download CSV or Excel.</strong>{" "}
            Both files contain every transaction from the original, not just the previewed rows,
            in the same five columns — Date, Type, Description, Amount, Transaction ID — and both
            are fully free. Here is what the middle of a converted file looks like (sample data,
            shown for illustration):
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Date</th><th className={TH}>Type</th><th className={TH}>Description</th><th className={TH}>Amount</th><th className={TH}>Transaction ID</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>11/03/2026</td><td className={TD}>CREDIT</td><td className={TD}>Client payment — invoice 1042</td><td className={TD}>1,250.00</td><td className={TD}>20261103001</td></tr>
                <tr><td className={TD}>11/04/2026</td><td className={TD}>DEBIT</td><td className={TD}>Cloud hosting</td><td className={TD}>-96.40</td><td className={TD}>20261104001</td></tr>
                <tr><td className={TD}>11/06/2026</td><td className={TD}>DEBIT</td><td className={TD}>Office rent</td><td className={TD}>-1,800.00</td><td className={TD}>20261106001</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The totals those rows produce: money in $1,250.00, money out $1,896.40, net change
            −$646.40. Three tagged blocks inside the QBO become three readable rows, IDs intact,
            ready to sort or share. Dates are written as real dates, so spreadsheets sort them
            correctly, and descriptions are copied word for word — nothing is cleaned up or
            renamed on the way out.
          </p>

          <h2 className={H2M}>When a QBO will not convert — or converts with warnings</h2>
          <h3 className={H3}>The file is not OFX at all</h3>
          <p className={P}>
            Usually the download was cut short, or the file is not what its name claims — a PDF
            statement renamed to .qbo is the classic case, and a PDF cannot be converted here.
            Download the Web Connect file from your bank instead. If the file genuinely is OFX
            and still fails, the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            will read it and name the problem.
          </p>
          <h3 className={H3}>The structure inside the file is malformed</h3>
          <p className={P}>
            Some exporters write OFX with unclosed or mismatched tags. The data is usually all
            there — it is the wrapping that is broken. The{" "}
            <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO fixer</a>{" "}
            rebuilds the file as clean OFX 1.02, after which it converts — and imports — the way
            it should have in the first place.
          </p>
          <h3 className={H3}>The transaction list comes out empty</h3>
          <p className={P}>
            The file&rsquo;s statement section covers a period with no activity, or the download was a
            balance-only response rather than a transaction file. Check the period shown in the
            preview summary: if it is not the period you asked your bank for, re-download with
            the date range you actually need.
          </p>
          <h3 className={H3}>Warnings about duplicate IDs or a missing balance</h3>
          <p className={P}>
            Two warnings deserve a pause before the data goes anywhere that matters. A repeated
            transaction ID means QuickBooks would have skipped a real transaction as a supposed
            duplicate had you imported the file directly; in the spreadsheet both rows appear,
            and the shared ID tells you exactly which transactions to question. A missing closing
            balance means the rows cannot be tied back to the bank&rsquo;s target — they may be
            perfect, but there is no independent proof the set is complete. The same ID column
            also defuses the overlap trap: sort by Transaction ID and rows downloaded twice, from
            overlapping date ranges, sit next to each other sharing an ID no two genuine
            transactions ever share.
          </p>

          <h2 className={H2M}>Keep the QBO, download the CSV, or download Excel?</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Route</th>
                  <th className={TH}>Best for</th>
                  <th className={TH}>Where it breaks</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Keep the QBO as it is</strong></td><td className={TD}>Importing into QuickBooks — the job the file was built for</td><td className={TD}>Nobody without QuickBooks can read it; nothing can be sorted, filtered or annotated</td></tr>
                <tr><td className={TD}><strong>Download the CSV (this page)</strong></td><td className={TD}>Moving data into other software, or round-tripping it back later</td><td className={TD}>Plain text only — no formatting, and dates or IDs can be mangled if someone re-saves it carelessly from a spreadsheet app</td></tr>
                <tr><td className={TD}><strong>Download the Excel file (this page)</strong></td><td className={TD}>People: reviewing, sorting, annotating and sharing with clients</td><td className={TD}>Less universal than CSV for machine import — some systems want the plain text version instead</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The round trip is a real workflow, not a curiosity: convert a QBO to a spreadsheet,
            clean up payee names or remove rows that should never be imported, then send the
            result back through the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>,
            which maps the columns back into a Web Connect file with a balance-chain check. And
            if the job is not one file but a stack of them, the{" "}
            <a href="/tools/bulk-export-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Bulk Exporter for QuickBooks</a>{" "}
            combines up to 10 QBO, OFX or QFX files into one CSV or Excel sheet with a Source
            File column. Need a printed record instead of a spreadsheet? The{" "}
            <a href="/tools/qbo-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to PDF converter</a>{" "}
            makes a readable statement from the same file.
          </p>
        </>
      }
    />
  );
}
