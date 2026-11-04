import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qif-to-excel";

export const metadata: Metadata = {
  title: "QIF to Excel Converter — Free | Convert Statement",
  description: "Turn legacy Quicken QIF data into a formatted Excel workbook — one row per transaction — for review, sharing and archiving. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QIF to Excel Converter — Free",
    description: "Upload a QIF file and download it as Excel — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What columns does the workbook have, and are they typed?",
    a: "One sheet named Transactions with five columns: Date, Type, Description, Amount and Transaction ID. Dates are written in uniform ISO form (YYYY-MM-DD), which sorts chronologically, and amounts are written as real numbers to two decimal places, so Excel filters the rows and sums the Amount column correctly as soon as you open the file. The Transaction ID column is empty for QIF data — QIF carries no IDs, and none are invented.",
  },
  {
    q: "How is this different from the QIF to CSV converter?",
    a: "The rows are identical — same reader, same fields, same things left behind. The difference is the wrapping: CSV is plain text for importing onward, while the .xlsx workbook opens formatted for a person, with set column widths and typed values ready for sorting, filtering, pivot tables and notes. Choose CSV for systems, Excel for people.",
  },
  {
    q: "Where did the categories and split transactions go?",
    a: "They were never read into the workbook. The QIF reader keeps each record's date, amount and payee for this output; the category line (L), cleared status and split lines are ignored, and the memo and check-number lines have no column here. A split transaction appears once, at its full amount. If your audit turns on categories or splits, work from the original QIF and Quicken — this workbook is a transaction list, not a category ledger.",
  },
  {
    q: "My workbook shows dates in 2098. How do I fix that?",
    a: "Your QIF uses two-digit years, which the reader interprets as 2000s years — a 1998 record becomes 2098. Four-digit years, including Quicken's MM/DD'YYYY apostrophe form, convert correctly. Correct the years in the QIF text file, convert again, and sort the new workbook by Date to confirm the history sits in the century you meant.",
  },
  {
    q: "Can I edit the workbook and still trust it as an audit copy?",
    a: "You can edit it freely — it is an ordinary spreadsheet, and annotation is a normal audit step. But an edited workbook is a working paper, not evidence of the source. Keep the original QIF untouched alongside it, and note your edits in the workbook itself, so anyone reviewing later can trace every changed cell back to the source record.",
  },
  {
    q: "Is this converter really free, and is my file stored?",
    a: "Yes — fully free with no account, for files up to 10 MB. Your file is processed in memory to build the workbook and is never stored, and we never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Find or export the QIF", body: "Use the .qif you already have, or export a Bank, CCard or Cash QIF from the old Quicken or app that holds the records. Investment QIF files are not supported." },
  { title: "Check the years in the source", body: "Open the QIF as text and read the D lines: four-digit years convert as written; two-digit years are read as 2000s years, so expand genuinely old years to four digits before converting." },
  { title: "Upload and convert to Excel", body: "Drop the .qif into the converter above and press Convert to Excel. You get an .xlsx workbook with a Transactions sheet — ISO dates and numeric amounts, one row per readable record." },
  { title: "Clean up in the workbook, archive the QIF", body: "Sort, filter and annotate in Excel, and use the row count in the result panel to confirm nothing readable was left behind. Keep the original QIF untouched as the source of the history." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QifToExcelPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QIF to Excel Converter"
      subtitle="Turn legacy Quicken QIF data into a formatted Excel workbook — one row per transaction — for review, sharing and archiving. Fully free with no account."
      tool={<FormatConverter tool="qif-to-excel" fromLabel="QIF" toLabel="Excel" accept=".qif" outputExt="xlsx" />}
      currentPath="/tools/qif-to-excel"
      faqs={FAQS}
      howToName="How to convert QIF to Excel"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>A typed workbook from a legacy export, built for cleanup and audit</h2>
          <p className={P}>
            The usual reason someone converts a QIF to Excel is not curiosity — it is a job. An auditor needs an old account's activity in a form they can test. A bookkeeper inheriting a client's history needs to clean payee names, hunt duplicates and find the transactions that do not belong. A business owner preparing years of records for a migration needs to see the data before any of it is allowed into new books. In every case the work happens in a spreadsheet, and the quality of that work depends on the sheet behaving like data — real dates that sort, real numbers that sum — not like text that merely looks like a table.
          </p>
          <p className={P}>
            That is the specific promise of this page. The QIF is Quicken's legacy plain-text format, a stack of coded lines per transaction that no modern spreadsheet opens. This converter parses those records and writes a genuine .xlsx workbook: a single sheet named Transactions, with Date, Type, Description, Amount and Transaction ID columns, dates in uniform ISO form and amounts held as numbers. Open it and you can immediately filter by payee, total a period, or build the pivot that answers the auditor's question — with no un-mangling of text-formatted numbers first.
          </p>
          <p className={P}>
            The honesty note belongs up front, because audit work depends on it: a workbook built this way is a transaction list. Categories, split breakdowns, memos and check numbers from the QIF do not appear in it — the fields and the reasons are detailed below — so the original QIF stays part of the audit trail for anything those details touch.
          </p>

          <h2 className={H2M}>How to convert QIF to Excel with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Source-check the QIF.</strong> Confirm the file is a Bank, Cash or CCard export; investment QIF files are refused, because holdings are not workbook rows of bank activity. Then open the file as text and read a few D (date) lines. Four-digit years convert as written. Two-digit years are interpreted as 2000s years — the classic legacy trap, covered in the problems section — so expand old years in the text first if your export uses them.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload it.</strong> Drop the .qif into the converter above. One file, up to 10 MB, no account; it is processed in memory and never stored. A file with no readable transactions is refused with an explanation instead of producing an empty workbook.
          </p>
          <p className={P}>
            <strong>Step 3 — Convert.</strong> Press Convert to Excel. Each readable record becomes one row: the date normalised to YYYY-MM-DD, the Type set to CREDIT for money in or DEBIT for money out based on the amount's sign, the payee as the Description, and the amount as a number — with parenthesised amounts in the source, an old QIF convention, read as negatives. The Transaction ID column is present but blank throughout, because QIF carries no IDs and the workbook does not invent them. Note the transaction count in the result panel; it is your completeness check against the source.
          </p>
          <p className={P}>
            <strong>Step 4 — Do the cleanup work in the workbook.</strong> This is where the typed output earns its keep: sort by Amount to surface the largest items an auditor will sample, filter the Description column to group one payee's spelling variants, sum a month and tie it to the old Quicken total. Keep your annotations in the workbook and the original QIF untouched beside it. If the cleaned history is headed for QuickBooks next, the <a href="/tools/qif-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to QBO converter</a> takes the original QIF directly — convert a fresh copy rather than trying to round-trip your edited sheet.
          </p>
          <p className={P}>
            Need the same rows in the plainest possible form for another system instead? The <a href="/tools/qif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to CSV converter</a> writes the identical fields as CSV text.
          </p>

          <h2 className={H2M}>Problems and fixes specific to QIF to Excel</h2>
          <h3 className={H3}>The audit finds no categories — because there are none to find</h3>
          <p className={P}>
            Reviewers opening the workbook often go looking for the category column first, since old Quicken users categorised diligently. It is not there. The reader ignores the L category line, the cleared-status line and every split line, and the memo and check-number lines it does read have no column in this layout. A split paycheck therefore appears as one row at its full amount — correct as a transaction total, silent about its parts. Plan the audit accordingly: test amounts, dates and payees from this workbook, and take category questions back to the source file or to Quicken itself.
          </p>
          <h3 className={H3}>Dates sorted into the wrong century</h3>
          <p className={P}>
            Because the workbook's dates are uniform ISO values, a two-digit-year source produces a workbook that sorts beautifully — into 2098. The consistent format makes the error more visible, not less: sort ascending and a history that starts a century late announces itself. The fix is at the source, expanding the QIF's years to four digits and converting again, never by editing dates cell by cell in the workbook, which leaves the next conversion just as wrong.
          </p>
          <h3 className={H3}>Row count does not match the old record count</h3>
          <p className={P}>
            Records with an unreadable date or a non-numeric amount are skipped, not guessed — damaged or hand-edited lines in an old file are the usual cause, and account-header blocks in the QIF are also passed over by design. Work period by period: convert a year at a time and the shortfall, if any, narrows to a findable stretch of the source text.
          </p>
          <h3 className={H3}>Descriptions that say &ldquo;Transaction&rdquo;</h3>
          <p className={P}>
            A record with no payee line is given the placeholder description Transaction so the row is never blank, and extremely long payees are trimmed. In cleanup work, treat those rows as flags to check against the source rather than names to trust — their dates and amounts still convert exactly.
          </p>

          <h2 className={H2M}>Excel, CSV or PDF for legacy QIF data?</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Output</th>
                  <th className={TH}>Best job</th>
                  <th className={TH}>Honest limit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={TD}>This page — Excel workbook</td>
                  <td className={TD}>Cleanup and audit: sorting, filtering, totals, pivots, annotations</td>
                  <td className={TD}>Editable by design — a working paper, not a fixed record</td>
                </tr>
                <tr>
                  <td className={TD}>QIF to CSV</td>
                  <td className={TD}>Feeding the rows into another app or importer</td>
                  <td className={TD}>Same fields, plainer wrapping; values arrive as text for the importer to type</td>
                </tr>
                <tr>
                  <td className={TD}>QIF to PDF</td>
                  <td className={TD}>A fixed, printable statement of the same history</td>
                  <td className={TD}>Cannot be sorted, summed or imported — reading only</td>
                </tr>
                <tr>
                  <td className={TD}>QIF to QBO</td>
                  <td className={TD}>Landing the history in QuickBooks as a bank feed</td>
                  <td className={TD}>Bypasses the spreadsheet review this page exists to give you</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Many real projects use two outputs in sequence: this workbook first, to see and clean the history, then the <a href="/tools/qif-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to PDF converter</a> to file a fixed copy of what was reviewed. Workbooks from other legacy formats follow the same pattern — see the <a href="/tools/iif-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">IIF to Excel converter</a> for QuickBooks Desktop exports and the <a href="/tools/qfx-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to Excel converter</a> for modern Quicken downloads.
          </p>
        </>
      }
    />
  );
}
