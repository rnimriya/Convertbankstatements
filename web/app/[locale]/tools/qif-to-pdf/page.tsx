import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qif-to-pdf";

export const metadata: Metadata = {
  title: "QIF to PDF Converter — Free | Convert Statement",
  description: "Render legacy Quicken QIF data as a readable, printable PDF statement — so old history can be archived and shared in a fixed form. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QIF to PDF Converter — Free",
    description: "Upload a QIF file and download it as PDF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What exactly appears in the PDF?",
    a: "Three columns — Date, Description and Amount — one line per readable QIF record, on Letter-size pages, ending with three totals computed from those lines: Total in, Total out and Net. Memos, check numbers and categories from the QIF do not appear, and there is no closing balance, because a QIF carries none and the PDF does not invent one.",
  },
  {
    q: "Why do some of my dates show years like 2098?",
    a: "Your QIF uses two-digit years, which the reader interprets as 2000s years — a record from 1998 prints as 2098. Four-digit years, including Quicken's MM/DD'YYYY apostrophe form, print as written. Expand the years to four digits in the QIF text and convert again; check the printed dates on a one-month test file before rendering a whole archive.",
  },
  {
    q: "My split transactions print as single lines. Is that right?",
    a: "For this document, yes. The reader ignores QIF split lines and category lines, so each transaction prints once, at its full amount, with its payee as the description. The PDF is a faithful statement of transactions and totals — if a reader needs the split breakdown or the categories, those live only in the original QIF and in Quicken, not in any rendering of this kind.",
  },
  {
    q: "Can the PDF be imported into QuickBooks or back into Quicken?",
    a: "No. The PDF is the fixed, readable end of the road — for filing, printing and sharing. The data routes stay open through the original QIF, which converts onward to a spreadsheet or to a QuickBooks QBO file. Archive the two together: PDF as the readable copy, QIF as the data.",
  },
  {
    q: "What if my QIF is an investment file?",
    a: "Investment QIF files (!Type:Invst) are not supported and are refused with a message saying so — holdings and lots cannot be honestly rendered as a bank-style statement. Bank, Cash and CCard QIF files convert normally. Export the investment account's cash activity separately if that is the history you need in document form.",
  },
  {
    q: "Is this converter really free, and is my file stored?",
    a: "Yes — fully free with no account, for files up to 10 MB. Your file is processed in memory to build the PDF and is never stored, and we never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Find or export the QIF", body: "Use the .qif archive you already have, or export a Bank, CCard or Cash QIF from the old Quicken or app. Investment QIF files are not supported." },
  { title: "Check the years before you render years", body: "Open the file as text and read the D lines: four-digit years print as written, but two-digit years are read as 2000s years — a 1998 record becomes 2098. Expand old years in the text first if your archive uses them." },
  { title: "Upload and convert to PDF", body: "Drop the .qif into the converter above and press Convert to PDF. Each readable record becomes a Date, Description and Amount line, with Total in, Total out and Net computed at the end." },
  { title: "File the PDF with the QIF", body: "Check the transaction count and the printed period, then store the PDF as the readable copy alongside the untouched QIF — the PDF for people, the QIF for any future data conversion." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QifToPdfPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QIF to PDF Converter"
      subtitle="Render legacy Quicken QIF data as a readable, printable PDF statement — so old history can be archived and shared in a fixed form. Fully free with no account."
      tool={<FormatConverter tool="qif-to-pdf" fromLabel="QIF" toLabel="PDF" accept=".qif" outputExt="pdf" />}
      currentPath="/tools/qif-to-pdf"
      faqs={FAQS}
      howToName="How to convert QIF to PDF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Printable records from a legacy Quicken archive</h2>
          <p className={P}>
            A QIF archive is usually the oldest financial record a person or a business owns — and the least readable. It may hold the first years of a company, a household's accounts from before online banking, a relative's estate paperwork, the history an auditor asks for when a question reaches back further than any current system goes. The data survived because QIF is plain text. But plain text in Quicken's coded shorthand — a D line, a T line, a P line, a caret — is not something you can hand to an executor, an auditor, a family member or a court file and expect it to be understood.
          </p>
          <p className={P}>
            This converter renders that archive as the document it always needed to become: a Letter-size PDF statement with a Date, Description and Amount line for every transaction, page numbers throughout, and Total in, Total out and Net figures at the end that are summed from the lines themselves. It is the archiving step for legacy data — the moment decades-old records take a fixed form that opens identically on any machine, prints cleanly, and can be filed next to the modern statements it predates.
          </p>
          <p className={P}>
            One discipline defines this page: the PDF presents only what the QIF recorded. A QIF carries no bank name, no account number and no closing balance, so the document shows none of those — it does not dress an old text file up as a bank-issued statement. What it certifies, by its totals, is the transaction history itself, and for most archive questions — what was paid, to whom, when, and what a period added up to — the history is exactly what was asked for.
          </p>

          <h2 className={H2M}>How to convert QIF to PDF with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Identify the archive.</strong> Confirm the file is a Bank, Cash or CCard QIF; an investment QIF is refused, because holdings cannot be honestly printed as a statement of bank activity. If the archive spans many years, consider rendering it in period files — a PDF per year is a more usable archive than one enormous document, and it makes every later check smaller.
          </p>
          <p className={P}>
            <strong>Step 2 — Check the dates in the text.</strong> Open the QIF in a text editor and read the D lines before you convert anything. Four-digit years, including the apostrophe form Quicken used (such as 03/14'1998), print exactly as written. Two-digit years are read as 2000s years — see the problems section, because on an old archive this is the difference between a correct record and a confidently wrong one.
          </p>
          <p className={P}>
            <strong>Step 3 — Upload and convert.</strong> Drop the .qif into the converter above — one file, up to 10 MB, no account, processed in memory and never stored — and press Convert to PDF. Each record with a readable date and amount becomes a statement line; the payee becomes the description; parenthesised amounts, the old convention for money out, print as negatives. The result panel reports the transaction count, and the document's title is taken from your file's name, followed by a note that it was converted by ConvertStatement — a small honesty marker that this is a rendering, not an original bank document.
          </p>
          <p className={P}>
            <strong>Step 4 — Verify, then archive the pair.</strong> Read the first and last printed dates, check the count, and glance at the Net total against any figure the old Quicken file reported for the period. Then store the PDF and the original QIF together, permanently. The PDF is the copy people will read; the QIF remains the data, still convertible through the <a href="/tools/qif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to CSV converter</a>, the <a href="/tools/qif-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to Excel converter</a> or the <a href="/tools/qif-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to QBO converter</a> whenever a future question needs the numbers rather than the document.
          </p>

          <h2 className={H2M}>Problems and fixes specific to QIF to PDF</h2>
          <h3 className={H3}>Printed dates a century too late</h3>
          <p className={P}>
            On a legacy archive this is the standing risk: two-digit years are interpreted as 2000s years, so a statement of 1998 activity prints as 2098 — wrong on every line, yet perfectly formatted, which is what makes it dangerous in a filed record. There is no fix inside the PDF. Expand the years to four digits in the QIF text, convert again, and always proof a rendered archive by its first and last dates before it is filed or sent anywhere.
          </p>
          <h3 className={H3}>No categories, memos or check numbers in the document</h3>
          <p className={P}>
            Old Quicken users recorded rich detail — an L category on every record, memos, check numbers, split breakdowns. This statement prints none of it: the reader sets categories and splits aside, and the memo and check-number lines have no column in a three-column statement. Each transaction therefore prints once, at full amount, under its payee. If the archive's value for your reader lies in how money was categorised, a PDF of transactions is the wrong deliverable — say so, and work from the source data instead of letting a clean-looking document imply completeness it does not have.
          </p>
          <h3 className={H3}>Missing records in a very old file</h3>
          <p className={P}>
            Records whose date cannot be read or whose amount is not a number are skipped rather than reconstructed — in a decades-old file, a hand edit or a damaged stretch is the usual cause. The converted transaction count is the tell: if it falls short of the archive's record count, render the file in smaller periods to isolate where the losses sit, and repair the source text if the records matter.
          </p>
          <h3 className={H3}>Very long payees are shortened on the line</h3>
          <p className={P}>
            A printed column has a fixed width, and a description that exceeds it is shortened with an ellipsis so dates and amounts stay aligned. Dates and amounts are never shortened. Where a payee's full text is legally or historically important, the complete wording remains in the QIF and in the spreadsheet conversions — one more reason the archive pair, document plus data, should never be separated.
          </p>

          <h2 className={H2M}>A document, a spreadsheet, or a migration — which output for old QIF?</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Route</th>
                  <th className={TH}>Right when</th>
                  <th className={TH}>Limit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={TD}>This page — QIF to PDF</td>
                  <td className={TD}>The history must be read, printed, filed or shared as a fixed record</td>
                  <td className={TD}>No categories or memos; cannot be imported or edited as data</td>
                </tr>
                <tr>
                  <td className={TD}>QIF to Excel or CSV</td>
                  <td className={TD}>Someone must sort, check, total or clean the old records</td>
                  <td className={TD}>Working data, not a fixed record — it changes as people edit it</td>
                </tr>
                <tr>
                  <td className={TD}>QIF to QBO</td>
                  <td className={TD}>The legacy history is moving into QuickBooks for good</td>
                  <td className={TD}>A machine file; nobody reviews it by eye on the way in</td>
                </tr>
                <tr>
                  <td className={TD}>Printing the raw QIF text</td>
                  <td className={TD}>Almost never — a technical reader debugging the file itself</td>
                  <td className={TD}>Coded lines that answer nothing for a normal reader</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The neighbouring documents follow the same pattern for newer sources: the <a href="/tools/qfx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to PDF converter</a> renders a modern Quicken download — a current bank export rather than an archive — and the <a href="/tools/ofx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to PDF converter</a> does the same for a raw bank OFX file. The distinction matters when you name your files: mark this one as the legacy archive it is, with its period in the filename, so nobody mistakes its age or its source years later.
          </p>
        </>
      }
    />
  );
}
