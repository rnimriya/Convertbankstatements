import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { IifToExcel } from "@/components/tools/IifToExcel";

const PAGE_URL = "https://www.convertstatement.online/tools/iif-to-excel";

export const metadata: Metadata = {
  title: "IIF to Excel Converter — Free IIF to CSV & Excel | Convert Statement",
  description:
    "Free IIF to Excel converter: turn a QuickBooks Desktop IIF export into a clean CSV or Excel spreadsheet — every transaction and split line, dates in ISO format. Fully free, no account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "IIF to Excel Converter — QuickBooks Desktop IIF to CSV & Excel",
    description:
      "Upload an IIF file from QuickBooks Desktop and download its transactions as Excel or CSV. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert an IIF file to Excel?",
    a: "Export the .iif file from QuickBooks Desktop, drop it in above, choose Excel (.xlsx) or CSV, and click Convert & download. The spreadsheet downloads right away — fully free, no account — with one row per transaction line and split line in the file.",
  },
  {
    q: "What does the spreadsheet contain?",
    a: "One row per line of substance in the file: every TRNS transaction line, and every SPL split line marked \"Split line\" in the Type column, so a transaction and its distributions stay together and in order. Columns are Date, Type, Account, Name, Amount, and Memo — the fields almost every IIF export carries.",
  },
  {
    q: "Why are the split lines included?",
    a: "Because they hold the accounting. A TRNS line says a check for $1,000 left the bank; its SPL lines say $600 was rent and $400 was utilities. A spreadsheet with only the TRNS lines totals correctly but explains nothing. Keeping the splits — clearly marked, so they are never confused with transactions — preserves both views.",
  },
  {
    q: "Are dates or amounts changed during conversion?",
    a: "Dates are rewritten from the IIF convention (MM/DD/YYYY) to ISO format (yyyy-mm-dd) whenever they are recognizable, because spreadsheets sort ISO dates correctly. Amounts are copied as numbers, exactly as written — split lines keep the negative sign convention QuickBooks uses for distributions.",
  },
  {
    q: "What if the converter says my file does not look like IIF?",
    a: "The file contains no TRNS transaction rows. The usual causes: it is a list-only export (customers or items with no transactions), it is actually a QBO or CSV file with an .iif name, or the export was cut short. Re-export from QuickBooks Desktop with transactions included, and make sure the file you choose is the one Desktop created.",
  },
  {
    q: "Can I edit the spreadsheet and import it back as IIF?",
    a: "Not with this tool — it is deliberately one-way. Turning a spreadsheet back into a valid IIF is a different, stricter job (header blocks, balanced splits, Desktop's field rules), and a malformed IIF can damage a Desktop company file on import. For building Desktop imports from spreadsheets, the CSV to IIF converter creates properly structured files.",
  },
];

const HOWTO = [
  { title: "Export an IIF from QuickBooks Desktop", body: "In QuickBooks Desktop, use File → Utilities → Export → Lists to IIF (or the report export) and save the .iif file." },
  { title: "Upload it here", body: "Drop the .iif file in. The converter reads its transaction and split lines — no QuickBooks connection needed." },
  { title: "Choose Excel or CSV", body: "Excel for reading, sorting, and sharing; CSV for importing into other software." },
  { title: "Convert and download", body: "Click Convert & download — fully free — and the spreadsheet saves with every TRNS and SPL line as a row, dates in ISO format." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function IifToExcelPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="IIF to Excel Converter"
      subtitle="Turn a QuickBooks Desktop IIF export into a clean Excel or CSV spreadsheet — every transaction and split line as a row, dates converted to ISO format. Fully free with no account."
      tool={<IifToExcel />}
      currentPath="/tools/iif-to-excel"
      faqs={FAQS}
      howToName="How to convert an IIF file to Excel"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>An IIF export nobody outside QuickBooks Desktop can read</h2>
          <p className={P}>
            IIF — Intuit Interchange Format — was designed for exactly one reader: QuickBooks
            Desktop. To every other program, and to every human who opens one in a text editor,
            an IIF export is a wall of tab-separated codes: header rows starting with &ldquo;!&rdquo;, lines
            labelled TRNS and SPL, account names and amounts with no columns to hold them. Yet
            IIF files hold data people regularly need outside Desktop — years of transactions
            for an audit, the detail behind a migration to another accounting system, a client&rsquo;s
            history in a form an accountant can actually review on a machine that may not even
            have QuickBooks installed.
          </p>
          <p className={P}>
            Converting the file to Excel or CSV decodes it: the codes become columns anyone can
            sort, filter and check. The conversion is faithful rather than clever. Nothing is
            summarized away — if the file has 400 transactions with 900 split lines, the
            spreadsheet has 1,300 rows in the file&rsquo;s own order, with the splits marked so the
            two kinds of row are never confused. That completeness is the point of this page: an
            audit copy that quietly dropped the split lines would total correctly and explain
            nothing.
          </p>
          <p className={P}>
            One scope note, stated plainly: IIF belongs to QuickBooks Desktop (Pro, Premier,
            Enterprise). QuickBooks Online neither exports nor imports IIF files — it uses CSV
            uploads and QBO Web Connect files instead. If your file ends in .qbo, the{" "}
            <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a>{" "}
            is the right tool; this page is for Desktop .iif exports.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Line</th>
                  <th className={TH}>What it is</th>
                  <th className={TH}>Where it lands</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>!TRNS / !SPL headers</strong></td><td className={TD}>Lines starting with &ldquo;!&rdquo; that declare the column layout for the lines that follow</td><td className={TD}>Read to map the fields — they never become rows</td></tr>
                <tr><td className={TD}><strong>TRNS</strong></td><td className={TD}>One transaction: its type, date, main account, name, and total amount</td><td className={TD}>One row, with its real transaction type (CHECK, DEPOSIT, INVOICE…)</td></tr>
                <tr><td className={TD}><strong>SPL</strong></td><td className={TD}>A split (distribution) line: the account one part of the transaction posts to, and that part&rsquo;s amount</td><td className={TD}>One row each, Type marked &ldquo;Split line&rdquo;</td></tr>
                <tr><td className={TD}><strong>ENDTRNS</strong></td><td className={TD}>Closes the transaction block</td><td className={TD}>A structural marker only — no row</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert an IIF file to Excel or CSV</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 1 — Export the IIF from QuickBooks Desktop.</strong>{" "}
            Use File → Utilities → Export and save the .iif file, with transactions included — a
            list-only export (customers or items on their own) has no TRNS rows to convert. If
            someone sent you the file, that works too; no QuickBooks connection is needed at any
            point. Files up to 10 MB are accepted.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 2 — Drop the file in above.</strong>{" "}
            The converter reads the &ldquo;!&rdquo; header rows to learn the file&rsquo;s column layout, then
            reads every TRNS and SPL line in order. Very old exports occasionally omit the header
            lines for some blocks; in that case the converter falls back to the standard column
            layout Desktop itself uses, so a headerless export still lands in the right columns.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 3 — Choose Excel or CSV.</strong>{" "}
            Pick Excel (.xlsx) when a person will read, sort or annotate the result; pick CSV
            when another system will import it. The rows are identical either way — switching the
            format and converting again gives you the other wrapping of the same data.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 4 — Convert and download.</strong>{" "}
            The download starts right away, fully free, and the confirmation tells you exactly
            how many rows were converted. You get six columns:{" "}
            <strong className="text-zinc-900 dark:text-white">Date</strong> — converted from MM/DD/YYYY to
            yyyy-mm-dd, so sorting works; <strong className="text-zinc-900 dark:text-white">Type</strong> — the IIF
            transaction type for TRNS rows (CHECK, DEPOSIT, BILL, INVOICE and the rest), or &ldquo;Split
            line&rdquo; for SPL rows; <strong className="text-zinc-900 dark:text-white">Account</strong> — the account the
            line posts to; <strong className="text-zinc-900 dark:text-white">Name</strong> — the customer, vendor or
            payee on the line; <strong className="text-zinc-900 dark:text-white">Amount</strong> — as written, splits
            keeping their sign; and <strong className="text-zinc-900 dark:text-white">Memo</strong> — the line&rsquo;s memo
            text, word for word.
          </p>

          <h2 className={H2M}>When an IIF conversion looks wrong</h2>
          <h3 className={H3}>&ldquo;That file does not look like IIF&rdquo;</h3>
          <p className={P}>
            The converter found no TRNS transaction rows. The usual causes are a list-only export
            with no transactions in it, a file that is really a QBO or CSV wearing an .iif name,
            or an export that was cut short. Re-export from Desktop with transactions included —
            and if the file is genuinely a Web Connect file, the QBO to CSV converter linked
            above is the tool it needs.
          </p>
          <h3 className={H3}>The spreadsheet total is double what it should be</h3>
          <p className={P}>
            The classic audit trap with this format, and it is a reading error, not a conversion
            error. TRNS and SPL lines mirror each other by design: the TRNS line carries the
            transaction&rsquo;s total against the bank account, and its SPL lines carry the same money
            out to the distribution accounts with the opposite sign. Sum every row in the sheet
            and you count the money twice and net near zero. Sum the TRNS rows only for
            transaction totals, or filter Type to &ldquo;Split line&rdquo; and sum by Account to see where
            the money was distributed — those are the two honest ways to add this file up, and
            the marked split rows are what make both possible.
          </p>
          <h3 className={H3}>A date did not convert, or a total will not tie out</h3>
          <p className={P}>
            Dates are rewritten to ISO only when they are recognizable as MM/DD/YYYY; an unusual
            value is passed through exactly as written rather than guessed at, so search the
            Date column for anything that does not look like yyyy-mm-dd. And if the TRNS amounts
            in the spreadsheet do not match the export&rsquo;s own report in Desktop, treat that as
            the honest stop sign — most often it means a genuinely unusual old variant placed a
            field differently. The totals check is quick, and it is what makes the spreadsheet
            safe to rely on for an audit or a migration.
          </p>

          <h2 className={H2M}>Excel, CSV, or back into Desktop? Choosing the route</h2>
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
                <tr><td className={TD}><strong>Download the Excel file (this page)</strong></td><td className={TD}>Auditing and reviewing a Desktop export — sorting, filtering, and account-by-account checks with the splits visible</td><td className={TD}>A working copy, not an import file: editing it does not produce a valid IIF</td></tr>
                <tr><td className={TD}><strong>Download the CSV (this page)</strong></td><td className={TD}>Feeding the data into other software, or a migration out of Desktop</td><td className={TD}>Plain text only — no formatting, and the same care is needed not to let a spreadsheet app rewrite dates on a re-save</td></tr>
                <tr><td className={TD}><strong>Build a fresh IIF from a spreadsheet</strong></td><td className={TD}>Getting edited or new transactions back into QuickBooks Desktop</td><td className={TD}>A stricter job than reading: header blocks, balanced TRNS/SPL pairs and exact account names are all required, or Desktop misposts the import</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            That third route is a separate tool on purpose: the{" "}
            <a href="/tools/csv-to-iif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to IIF converter</a>{" "}
            builds properly structured Desktop imports from a bank CSV, with your account names
            baked in. If you only need the plain-text version of an export, the{" "}
            <a href="/tools/iif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">IIF to CSV converter</a>{" "}
            is this page&rsquo;s sibling with CSV as its focus. And when the file you are handed is a
            QBO that needs to become a Desktop import instead, the{" "}
            <a href="/tools/qbo-to-iif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to IIF converter</a>{" "}
            bridges those two formats directly.
          </p>
        </>
      }
    />
  );
}
