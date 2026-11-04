import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qif-to-csv";

export const metadata: Metadata = {
  title: "QIF to CSV Converter — Free | Convert Statement",
  description: "Rescue legacy Quicken QIF data into a clean CSV spreadsheet — one row per transaction — that any modern tool can read. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QIF to CSV Converter — Free",
    description: "Upload a QIF file and download it as CSV — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What do the QIF field tags mean — D, T, P, L and the rest?",
    a: "Each QIF record is a stack of one-letter lines: D is the date, T is the amount (the total for the transaction), P is the payee, M is a memo, N is a check number and L is the category. A line containing only ^ ends the record. This converter reads D, T, P, M and N — and the CSV it writes keeps only the date, a CREDIT or DEBIT type, the payee as the description, and the amount, so the L category and the M and N details do not appear in the spreadsheet.",
  },
  {
    q: "Why is the Transaction ID column empty in my CSV?",
    a: "Because QIF has no transaction IDs to fill it with. The CSV uses the shared statement layout — Date, Type, Description, Amount, Transaction ID — and for a QIF source the ID is honestly blank rather than invented. A practical consequence: a CSV has no duplicate protection either, so importing the same sheet twice into another app can duplicate rows.",
  },
  {
    q: "My dates came out in the wrong century. What happened?",
    a: "Your QIF almost certainly uses two-digit years. The reader interprets a two-digit year as a 2000s year, so a record dated 11/02/98 becomes 2098-11-02 in the CSV. Four-digit dates, including Quicken's MM/DD'YYYY apostrophe form, convert as written. Fix the years in the QIF text — expand them to four digits — and convert again.",
  },
  {
    q: "What happens to split transactions and categories?",
    a: "They are left behind, deliberately and visibly. The reader ignores the L category line, the cleared-status line and all split lines (S, E and $), so a split transaction appears in the CSV as a single row at its full T amount — the total is right, the breakdown is not in the sheet. If the splits themselves are what you need, no converter output on this page will give them to you; work from the original Quicken data.",
  },
  {
    q: "Can I convert an investment QIF to CSV here?",
    a: "No. Bank, Cash and CCard QIF files are supported; an investment QIF (!Type:Invst) is refused with a message explaining why, because positions, buys and sells are not simple dated amounts and would mislead as spreadsheet rows of bank activity.",
  },
  {
    q: "Is this converter really free, and is my file stored?",
    a: "Yes — fully free with no account, for files up to 10 MB. Your file is processed in memory to build the CSV and is never stored, and we never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Find or export the QIF", body: "Use the .qif you already have, or export a Bank, CCard or Cash QIF from the old Quicken or app. Investment QIF files are not supported." },
  { title: "Glance at the D lines first", body: "Open the file as text: dates with four-digit years convert as written, but two-digit years are read as 2000s years. Expand old two-digit years in the text before converting if your history predates them." },
  { title: "Upload and convert to CSV", body: "Drop the .qif into the converter above and press Convert to CSV. Each readable record becomes one row — Date, Type, Description, Amount, Transaction ID — with the ID left blank because QIF carries none." },
  { title: "Open, count and keep the original", body: "Open the CSV in any spreadsheet app, check the row count and a few amounts against the old records, and keep the untouched QIF beside it — it still holds the categories and splits the CSV does not." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QifToCsvPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QIF to CSV Converter"
      subtitle="Rescue legacy Quicken QIF data into a clean CSV spreadsheet — one row per transaction — that any modern tool can read. Fully free with no account."
      tool={<FormatConverter tool="qif-to-csv" fromLabel="QIF" toLabel="CSV" accept=".qif" outputExt="csv" />}
      currentPath="/tools/qif-to-csv"
      faqs={FAQS}
      howToName="How to convert QIF to CSV"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Rescuing old Quicken exports into a spreadsheet anyone can read</h2>
          <p className={P}>
            A QIF file is a message from a retired era of personal finance. It is plain text — you can open it in any editor — but its grammar belongs to Quicken's past: each transaction is a small stack of coded lines, and the stack ends with a line containing a single caret, ^. Almost nothing a modern user owns will open it natively. Excel will not, Google Sheets will not, a client's bookkeeping app will not, and current Quicken itself walked away from the format when Intuit discontinued QIF imports in favour of QFX in the mid-2000s.
          </p>
          <p className={P}>
            CSV is the opposite: the one format everything reads. Converting a QIF to CSV is therefore less a conversion than a rescue — the moment the transactions become ordinary rows, the history is usable again. It can be sorted, searched, sent to an accountant, checked against a bank statement, or fed onward into modern software. This page is built for exactly that moment, and it is honest about the rescue's limits: the spreadsheet gets the transaction list in full, but a QIF holds a few things — categories, memos, check numbers, split breakdowns — that this particular output does not carry, and the sections below say precisely which.
          </p>
          <p className={P}>
            The typical files are old and irreplaceable: a decade of household accounts exported before a computer change, a small business's early years, a parent's or a client's archive found on a backup drive. Treat the QIF as an original document throughout — convert copies, never edit the only copy in place except to repair dates, and keep it after the rescue is done.
          </p>

          <h2 className={H2M}>How to convert QIF to CSV with this converter</h2>
          <p className={P}>
            <strong>First, learn to read the source — it takes one minute.</strong> Open the QIF in a text editor and you will see records like this in spirit: a D line carrying the date, a T line carrying the amount, a P line carrying the payee, sometimes an M memo line, an N check-number line and an L category line, then ^ to close the record. Knowing the tags tells you what a good conversion must show — and explains, later, exactly what the CSV does and does not contain.
          </p>
          <p className={P}>
            <strong>Step 1 — Check the date format.</strong> Look at the D lines. Four-digit years, including Quicken's apostrophe form such as 11/02'1998, convert as written. Two-digit years are read as 2000s years, so genuinely old two-digit exports need their years expanded in the text before conversion — see the problems section.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload the file.</strong> Drop the .qif into the converter above — one file, up to 10 MB, no account, processed in memory and never stored. Bank, Cash and CCard files are supported; an investment QIF is refused with an explanation rather than mangled into rows.
          </p>
          <p className={P}>
            <strong>Step 3 — Convert.</strong> Press Convert to CSV. Each record with a readable date and amount becomes one row in a sheet headed Date, Type, Description, Amount, Transaction ID. Dates are normalised to ISO form (YYYY-MM-DD), the Type is CREDIT for money in and DEBIT for money out, the Description is the payee, and parenthesised amounts in the QIF — an old convention for negatives — are read as negative numbers. The Transaction ID column is left blank, because QIF never had IDs. The result panel reports how many transactions were converted.
          </p>
          <p className={P}>
            <strong>Step 4 — Verify three things in the sheet.</strong> Check the row count against the record count you expected, spot-check two or three amounts against the QIF text, and sort by date to confirm the years are the years you meant. Then the sheet is yours to work with. If the same history is ultimately headed for QuickBooks, the direct route is the <a href="/tools/qif-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to QBO converter</a>; if you would rather work in a formatted workbook than a plain text sheet, the <a href="/tools/qif-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to Excel converter</a> produces the same rows as an .xlsx file.
          </p>

          <h2 className={H2M}>Problems and fixes specific to QIF to CSV</h2>
          <h3 className={H3}>Dates in 2098: the two-digit-year trap</h3>
          <p className={P}>
            The most common defect in rescued QIF data, and the easiest to miss because the conversion itself succeeds. A two-digit year is interpreted as a 2000s year, so a 1990s archive silently becomes a 2090s one. Catch it by sorting the CSV by date before you use it for anything. Fix it in the source: expand the years in the QIF text to four digits and convert again. A small test file — one month, converted and eyeballed — is the professional habit for any archive-scale rescue.
          </p>
          <h3 className={H3}>Categories, memos and check numbers are not in the sheet</h3>
          <p className={P}>
            The reader does parse the M memo and N check-number lines, but the CSV layout has no columns for them, and the L category line is not read at all — so none of the three appear in the output. Neither do split breakdowns: a split transaction arrives as one row at its full T total. If your purpose is analysis of the transactions themselves, none of this matters. If your purpose is reconstructing how the money was categorised, this CSV is the wrong artefact — the categories survive only in the original QIF and in Quicken itself, and the honest move is to keep the QIF as the record of them.
          </p>
          <h3 className={H3}>Fewer rows than records</h3>
          <p className={P}>
            A record whose date cannot be read, or whose amount is not a number, is skipped rather than guessed at — a hand-edited line or a damaged stretch of an old file is the usual cause. If every record fails, the converter refuses the file outright with a no-transactions message. Compare the converted count with the count of ^ record-endings in the source text; a shortfall points you at the damaged records instead of hiding them.
          </p>
          <h3 className={H3}>A payee shows as simply &ldquo;Transaction&rdquo;</h3>
          <p className={P}>
            Records with no P line — or an empty one — are given the placeholder description Transaction rather than a blank cell, and very long payees are trimmed. Neither is data loss you can repair in the CSV; both reflect what the source record itself held. The amounts and dates, which are what most reconciliations turn on, are unaffected.
          </p>

          <h2 className={H2M}>CSV, Excel or straight onward — which rescue output?</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Output</th>
                  <th className={TH}>Choose it when</th>
                  <th className={TH}>Trade-off</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={TD}>This page — CSV</td>
                  <td className={TD}>The data travels onward: another app, an import, long-term plain-text archiving</td>
                  <td className={TD}>Plainest possible shape; no formatting, and the same fields as every other output here</td>
                </tr>
                <tr>
                  <td className={TD}>QIF to Excel</td>
                  <td className={TD}>A person will sort, filter and annotate the history in a workbook</td>
                  <td className={TD}>Same rows in a friendlier wrapping — no extra fields appear</td>
                </tr>
                <tr>
                  <td className={TD}>QIF to PDF</td>
                  <td className={TD}>The history needs to be read or filed as a fixed document</td>
                  <td className={TD}>Not editable and not importable — a record, not working data</td>
                </tr>
                <tr>
                  <td className={TD}>QIF to QBO</td>
                  <td className={TD}>QuickBooks is the destination and the spreadsheet is only a waypoint</td>
                  <td className={TD}>Skips your chance to eyeball the rows first — convert to CSV as a check copy even then</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            One more direction exists for completeness: the <a href="/tools/csv-to-qif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QIF converter</a> rebuilds QIF records from a sheet, if a cleaned spreadsheet ever has to go back into a legacy app. And when the rescued sheet reveals a period that needs a printable copy, the <a href="/tools/qif-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to PDF converter</a> renders the same history as a statement document.
          </p>
        </>
      }
    />
  );
}
