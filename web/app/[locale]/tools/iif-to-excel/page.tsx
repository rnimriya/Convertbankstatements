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
    q: "What is an IIF file?",
    a: "IIF (Intuit Interchange Format) is QuickBooks Desktop's long-standing import/export format: a plain-text, tab-separated file in which lines beginning with \"!\" declare the columns, TRNS lines carry each transaction, SPL lines carry its split (distribution) lines, and ENDTRNS closes the block. It predates the QBO Web Connect format and is still how Desktop moves lists and transactions in and out.",
  },
  {
    q: "Is IIF a QuickBooks Online format too?",
    a: "No. IIF belongs to QuickBooks Desktop (Pro, Premier, Enterprise). QuickBooks Online does not export or import IIF files — it uses CSV uploads and QBO Web Connect files instead. If your file ends in .qbo, use the QBO to CSV converter; this page is for Desktop .iif exports.",
  },
  {
    q: "What does the spreadsheet contain?",
    a: "One row per line of substance in the file: every TRNS transaction line, and every SPL split line marked \"Split line\" in the Type column, so a transaction and its distributions stay together and in order. Columns are Date, Type, Account, Name, Amount, and Memo — the fields almost every IIF export carries.",
  },
  {
    q: "Why are the split lines included?",
    a: "Because they hold the accounting. A TRNS line says a check for $1,000 left the bank; its SPL lines say $600 was rent and $400 was utilities. A spreadsheet with only the TRNS lines totals correctly but explains nothing. Keeping the splits — clearly marked, so they never pollute a transaction count — preserves both views.",
  },
  {
    q: "Are dates or amounts changed during conversion?",
    a: "Dates are rewritten from the IIF convention (MM/DD/YYYY) to ISO format (yyyy-mm-dd) whenever they are recognizable, because spreadsheets sort ISO dates correctly. Amounts are copied as numbers, exactly as written — split lines keep the negative sign convention QuickBooks uses for distributions.",
  },
  {
    q: "Can I edit the spreadsheet and import it back as IIF?",
    a: "Not with this tool — it is deliberately one-way. Turning a spreadsheet back into a valid IIF is a different, stricter job (header blocks, balanced splits, Desktop's field rules), and a malformed IIF can damage a Desktop company file on import. For building Desktop imports from spreadsheets, the CSV to IIF converter creates properly structured files.",
  },
  {
    q: "What if the converter says my file does not look like IIF?",
    a: "The file contains no TRNS transaction rows. The usual causes: it is a list-only export (customers or items with no transactions), it is actually a QBO or CSV file with an .iif name, or the export was cut short. Re-export from QuickBooks Desktop with transactions included, and make sure the file you choose is the one Desktop created.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the spreadsheet and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Export an IIF from QuickBooks Desktop", body: "In QuickBooks Desktop, use File → Utilities → Export → Lists to IIF (or the report export) and save the .iif file." },
  { title: "Upload it here", body: "Drop the .iif file in. The converter reads its transaction and split lines — no QuickBooks connection needed." },
  { title: "Choose Excel or CSV", body: "Excel for reading, sorting, and sharing; CSV for importing into other software." },
  { title: "Download the spreadsheet", body: "Save it — fully free — with every TRNS and SPL line as a row, dates in ISO format." },
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
          <h2 className={H2}>Why convert an IIF file to a spreadsheet?</h2>
          <p className={P}>
            IIF was designed for one reader: QuickBooks Desktop. To every other program — and to
            every human who opens one in a text editor — an IIF export is a wall of tab-separated
            codes. Yet IIF files hold data people regularly need outside Desktop: years of
            transactions for an audit, the detail behind a migration to another accounting
            system, a client's history in a form an accountant can actually review. Converting
            the file to Excel or CSV turns the codes into columns anyone can sort, filter, and
            check.
          </p>
          <p className={P}>
            The conversion is faithful rather than clever. Nothing is summarised away: if the
            file has 400 transactions with 900 split lines, the spreadsheet has 1,300 rows in
            the file's own order, with the splits marked so the two kinds of row are never
            confused.
          </p>

          <h2 className={H2M}>How an IIF file is built</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Line</th>
                  <th className={TH}>What it is</th>
                  <th className={TH}>Where it lands</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>!TRNS / !SPL headers</strong></td><td className={TD}>Lines starting with "!" that declare the column layout for the lines that follow</td><td className={TD}>Read to map the fields — they never become rows</td></tr>
                <tr><td className={TD}><strong>TRNS</strong></td><td className={TD}>One transaction: its type, date, main account, name, and total amount</td><td className={TD}>One row, with its real transaction type (CHECK, DEPOSIT, INVOICE…)</td></tr>
                <tr><td className={TD}><strong>SPL</strong></td><td className={TD}>A split (distribution) line: the account one part of the transaction posts to, and that part's amount</td><td className={TD}>One row each, Type marked "Split line"</td></tr>
                <tr><td className={TD}><strong>ENDTRNS</strong></td><td className={TD}>Closes the transaction block</td><td className={TD}>A structural marker only — no row</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The split lines are the part most converters drop and the part accountants most
            need. In QuickBooks' double-entry shape, a transaction's TRNS line touches one
            account and its SPL lines touch the others, with amounts that mirror each other in
            sign. Keeping them — labelled, in order, immediately under their transaction —
            means the spreadsheet can be re-added-up both ways: by transaction, or by account.
          </p>

          <h2 className={H2M}>The six columns you get</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Date</strong> — converted from
            MM/DD/YYYY to yyyy-mm-dd, so sorting works.{" "}
            <strong className="text-zinc-900 dark:text-white">Type</strong> — the IIF transaction
            type for TRNS rows (CHECK, DEPOSIT, BILL, INVOICE and the rest), or "Split line" for
            SPL rows. <strong className="text-zinc-900 dark:text-white">Account</strong> — the
            account the line posts to. <strong className="text-zinc-900 dark:text-white">Name</strong>{" "}
            — the customer, vendor, or payee on the line.{" "}
            <strong className="text-zinc-900 dark:text-white">Amount</strong> — as written,
            splits keeping their sign. <strong className="text-zinc-900 dark:text-white">Memo</strong>{" "}
            — the line's memo text, word for word.
          </p>

          <h2 className={H2M}>Desktop format, honestly scoped</h2>
          <p className={P}>
            IIF belongs to QuickBooks Desktop, and this tool does not pretend otherwise. It
            reads IIF exports; it does not connect to a Desktop company file, and QuickBooks
            Online neither produces nor consumes the format. If your data lives in Online, the
            equivalents are the{" "}
            <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a>{" "}
            for Web Connect files and the bank-statement converters for PDFs. Going the other
            direction — building a Desktop-ready IIF from a spreadsheet — is the{" "}
            <a href="/tools/csv-to-iif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to IIF converter's</a>{" "}
            job, with the header blocks and balanced splits a real import requires.
          </p>
          <h3 className={H3}>A note on very old IIF files</h3>
          <p className={P}>
            IIF has been written by decades of QuickBooks versions, and the oldest exports
            occasionally omit the "!" header lines for some blocks. The converter falls back to
            the standard column layout Desktop itself uses in that case, so a headerless export
            still lands in the right columns. If a genuinely unusual variant misplaces a field,
            the honest check is the totals: the TRNS amounts in the spreadsheet should match
            the export's own report in Desktop before you rely on the file.
          </p>
        </>
      }
    />
  );
}
