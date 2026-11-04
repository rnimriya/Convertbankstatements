import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qfx-to-excel";

export const metadata: Metadata = {
  title: "QFX to Excel Converter — Free | Convert Statement",
  description: "Turn a Quicken QFX download into a formatted Excel workbook — one row per transaction, ready to sort, filter and annotate. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QFX to Excel Converter — Free",
    description: "Upload a QFX file and download it as Excel — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Are the amounts in the workbook real numbers I can sum?",
    a: "Yes. Amount is stored in the workbook as a numeric value, not as text, so SUM, filters and totals work on it immediately, with money out negative and money in positive exactly as the QFX recorded it. That is the main practical difference from opening a raw CSV, where your spreadsheet has to guess each cell’s type on the way in.",
  },
  {
    q: "Are the dates real Excel dates?",
    a: "Honestly, no — and for most uses it does not matter. Dates are written as yyyy-mm-dd text, the same ISO form as the CSV version. Text in that format sorts chronologically, filters cleanly and reads unambiguously. If you need true Excel date values for date arithmetic or month grouping, add a helper column that converts the text with DATEVALUE, and keep the original column as the record of what the file stated.",
  },
  {
    q: "What does the workbook contain, exactly?",
    a: "One worksheet named Transactions, with five columns — Date, Type, Description, Amount and Transaction ID — and one row per transaction, in the order the QFX presents them. Column widths are set for those contents. There is no second sheet for account details or balances, because the workbook is the transaction list only.",
  },
  {
    q: "Does the workbook include the closing balance?",
    a: "No. The closing balance lives in the QFX wrapper, not in its transaction list, and this workbook holds the transactions. Summing Amount gives you the net movement across the rows converted — useful, but it is not the bank’s stated balance, and the workbook does not pretend otherwise.",
  },
  {
    q: "Can I edit the workbook and convert it back to QFX?",
    a: "You can edit it freely — it is an ordinary .xlsx workbook. To head back toward Quicken, save a CSV copy from Excel and use the CSV to QFX converter. Know the limit before you rely on it: the workbook holds no account number or institution ID, so a rebuilt QFX cannot recover the bank identity the original carried. Keep the original QFX untouched.",
  },
  {
    q: "Is this converter free, and is my file stored?",
    a: "Yes, it is fully free with no account. Your file is processed in memory to build the workbook and is never stored afterwards.",
  },
];

const HOWTO = [
  { title: "Get the QFX from your bank or archive", body: "Use the Quicken-format download for the account and period you need to work on in Excel." },
  { title: "Upload the .qfx file here", body: "Drop it into the converter above — one file, up to 10 MB, no account and no Quicken required." },
  { title: "Press Convert to Excel", body: "The transactions are written into a workbook named Transactions: five columns, amounts stored as numbers, dates in ISO text form." },
  { title: "Open it and prove the total", body: "Sum the Amount column in Excel and compare a few rows against the bank statement or Quicken register before you sort, filter or annotate anything." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QfxToExcelPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QFX to Excel Converter"
      subtitle="Turn a Quicken QFX download into a formatted Excel workbook — one row per transaction, ready to sort, filter and annotate. Fully free with no account."
      tool={<FormatConverter tool="qfx-to-excel" fromLabel="QFX" toLabel="Excel" accept=".qfx" outputExt="xlsx" />}
      currentPath="/tools/qfx-to-excel"
      faqs={FAQS}
      howToName="How to convert QFX to Excel"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>A QFX file is not a workbook — this turns it into one you can actually sum</h2>
          <p className={P}>
            There are two different reasons to pull transactions out of a Quicken download. One is to feed another program, and plain text serves that well. The other — the reason behind most QFX-to-Excel searches — is that a person is about to do work: reviewing a year of spending line by line, an accountant checking activity before filing, a business owner hunting the charges that explain a tight month. For that work, a raw CSV dump is a half-finished job. Your spreadsheet guesses at every cell when it opens the file, totals arrive as text that will not sum, and the first ten minutes go to tidying instead of reviewing.
          </p>
          <p className={P}>
            This converter skips the tidying by writing a real workbook in the first place. Precision about what “typed” means here matters, so here it is in one sentence: the Amount column is stored as numbers you can sum the moment the file opens, while Date, Type, Description and Transaction ID are stored as text — dates in the unambiguous yyyy-mm-dd form, which sorts in true chronological order. Anyone who promises you more than that from this conversion is describing a different file. What you get is one worksheet, named Transactions, with its column widths set, ready for filters, sorting and a notes column of your own.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Column</th><th className={TH}>Stored as</th><th className={TH}>What that means in practice</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Date</strong></td><td className={TD}>Text, yyyy-mm-dd</td><td className={TD}>Sorts and filters chronologically; convert with DATEVALUE only if you need date arithmetic</td></tr>
                <tr><td className={TD}><strong>Type</strong></td><td className={TD}>Text</td><td className={TD}>The type recorded in the QFX, such as DEBIT or CREDIT, exactly as the file states it</td></tr>
                <tr><td className={TD}><strong>Description</strong></td><td className={TD}>Text</td><td className={TD}>The transaction name, or its memo text when it has no name, read at up to 80 characters</td></tr>
                <tr><td className={TD}><strong>Amount</strong></td><td className={TD}>Number</td><td className={TD}>Sums, averages and filters work immediately; negative is money out, positive is money in</td></tr>
                <tr><td className={TD}><strong>Transaction ID</strong></td><td className={TD}>Text</td><td className={TD}>The FITID stays an identifier, not a number Excel can round — blank only when the source carried none</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert QFX to Excel with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Get the QFX for the period you are reviewing.</strong> Download the Quicken-format file from your bank, or take the stored .qfx from your archive. Reviews usually run by month, quarter or tax year; converting in those same chunks keeps each workbook a manageable, provable set.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload the .qfx above.</strong> One file, up to 10 MB, no account, and no Quicken on your machine at any stage. The converter reads the transaction blocks inside the QFX directly.
          </p>
          <p className={P}>
            <strong>Step 3 — Press Convert to Excel and note the count.</strong> The result panel reports the transactions converted, and the workbook downloads with the same base name as your QFX, now ending in .xlsx. Rows are in the order the QFX presents them; reordering is your job, in the sheet, where it belongs.
          </p>
          <p className={P}>
            <strong>Step 4 — Prove the workbook before working in it.</strong> Sum the Amount column and compare the total with the movement you expect for the period, then spot-check several rows against the bank statement. That two-minute check is what lets you trust every filter and subtotal you build afterward.
          </p>
          <p className={P}>
            <strong>Step 5 — Add your work beside the data, not inside it.</strong> Put notes, categories and flags in new columns to the right, and leave the five converted columns untouched. The workbook then stays reconcilable to the QFX — any row can still be traced by its Transaction ID — while your analysis lives clearly marked as yours. The plain-text version of the same rows comes from the <a href="/tools/qfx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to CSV converter</a> when a program, not a person, is the destination.
          </p>

          <h2 className={H2M}>Workbook problems worth knowing before they surprise you</h2>
          <h3 className={H3}>Your pivot table will not group the dates by month</h3>
          <p className={P}>
            That is the honest trade described above: the Date column is ISO text, not Excel date values, so Excel cannot group it by month or year until the values are real dates. Add a helper column using DATEVALUE on the text, group on the helper, and keep the original column untouched. Sorting and filtering, by contrast, work on the text exactly as delivered.
          </p>
          <h3 className={H3}>There is no balance sheet, totals sheet or account sheet</h3>
          <p className={P}>
            One worksheet, five columns, transactions only. The account number, institution identity and closing balance stayed in the QFX wrapper, so the workbook cannot state the bank’s closing position — and the sum of Amount is movement across the period, not a balance. Reviewers who need the closing figure should be given the bank statement alongside the workbook, and told which document carries it.
          </p>
          <h3 className={H3}>A long review comes out at 500 rows</h3>
          <p className={P}>
            The reader takes up to 500 transactions from one QFX, so a full year of an active account can arrive silently incomplete if you do not watch the count. Convert by quarter instead, keep each workbook separate, and note the period in each filename — four provable workbooks beat one plausible-looking one with its tail missing.
          </p>
          <h3 className={H3}>A row shows a blank Amount</h3>
          <p className={P}>
            That marks a transaction whose amount the source file stated in a form that could not be read as a number. The workbook leaves the cell without a value rather than placing an estimate in a column you are about to sum. Find that date and description on the bank statement, decide the correction yourself, and mark it visibly — a review workbook’s job is to make corrections obvious, not to hide them.
          </p>
          <h3 className={H3}>Descriptions look shorter than in Quicken</h3>
          <p className={P}>
            Transaction names are read at up to 80 characters during conversion, and a transaction with no name is represented by its memo text instead. For spending review that is almost always enough to identify the payee; for a disputed transaction where the exact full text matters, the QFX and the bank statement remain the sources to cite.
          </p>

          <h2 className={H2M}>Ways out of a QFX file, compared for review work</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Route</th><th className={TH}>Best for</th><th className={TH}>Where it breaks</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>This workbook (.xlsx)</strong></td><td className={TD}>A person reviewing, sorting, filtering and annotating, with amounts that sum immediately</td><td className={TD}>Dates are text, and interchange into other software is clumsier than CSV</td></tr>
                <tr><td className={TD}><strong>Plain CSV</strong></td><td className={TD}>Feeding another program or a database</td><td className={TD}>Your spreadsheet guesses cell types on open — the tidying this page exists to skip</td></tr>
                <tr><td className={TD}><strong>Export from inside Quicken</strong></td><td className={TD}>Registers already living in Quicken, in its own report layouts</td><td className={TD}>Needs Quicken and the data imported first; it cannot help with a QFX file someone just sent you</td></tr>
                <tr><td className={TD}><strong>Bulk export, many files at once</strong></td><td className={TD}>A stack of QFX files that must become one sheet with their sources labelled</td><td className={TD}>A combined sheet still needs its overlaps checked — it answers a different problem from one clean workbook</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The many-files route is the Bulk Exporter on this site, which combines up to ten OFX-family files into one sheet. Same-workbook treatment for a Desktop export lives at the <a href="/tools/iif-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">IIF to Excel converter</a>. If the review ends in a filing rather than a spreadsheet, the <a href="/tools/qfx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to PDF converter</a> renders the same download as a printable statement, and the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a> is the exit to take when QuickBooks, not Excel, is the real destination.
          </p>
        </>
      }
    />
  );
}
