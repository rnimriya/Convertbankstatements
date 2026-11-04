import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/iif-to-csv";

export const metadata: Metadata = {
  title: "IIF to CSV Converter — Free | Convert Statement",
  description: "Flatten a QuickBooks Desktop IIF file into a plain CSV — one row per transaction — so you can review, share or migrate the data anywhere. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "IIF to CSV Converter — Free",
    description: "Upload a IIF file and download it as CSV — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert an IIF file to CSV?",
    a: "Drop the .iif file into the converter above (one file, up to 10 MB) and press Convert to CSV. One CSV row is written per transaction in the file, and the confirmation shows how many transactions were converted. Fully free, no account, and your file is processed in memory and never stored.",
  },
  {
    q: "What are the TRNS and SPL lines inside an IIF file?",
    a: "They are the two halves of QuickBooks Desktop's double entry. A TRNS line is the transaction itself — its date, type, name and total amount against the bank or main account. The SPL (split) lines underneath carry the other side: the category accounts that total is distributed across, one line per split, until an ENDTRNS line closes the transaction. Header lines starting with ! define which column means what for the lines that follow.",
  },
  {
    q: "What columns does the CSV have — and what does it leave out?",
    a: "Five columns: Date, Type (the IIF transaction type, such as DEPOSIT or CHECK), Description (the transaction's name), Amount, and Transaction ID — which is blank, because IIF carries no transaction IDs. What a flat CSV cannot hold stays behind: the SPL split lines and their category accounts, the account each transaction posted to, memos and document numbers. The CSV is the transaction list at its totals, which is what review and migration need — the original IIF remains the complete record.",
  },
  {
    q: "Why does the CSV have fewer rows than the IIF has lines?",
    a: "Because most lines in an IIF are not transactions. Header lines, SPL split lines and ENDTRNS markers are structure, not rows — only TRNS lines become CSV rows. A transaction split across three categories is still one TRNS line and one CSV row. If a TRNS line's amount is not numeric, that row is skipped, and if the file contains no TRNS lines at all — some IIFs carry only lists, like customers or items — the converter says so instead of returning an empty file.",
  },
  {
    q: "Can I edit the CSV and turn it back into an IIF?",
    a: "Not by renaming it — an IIF has to be rebuilt in TRNS/SPL structure with QuickBooks Desktop account names to post against. The CSV to IIF converter on this site does that rebuild from a spreadsheet. Keep in mind it creates a fresh import file from the rows; it does not restore the original file's split detail, because that detail is not in the CSV.",
  },
  {
    q: "Is this converter free, and is my file stored?",
    a: "Yes, fully free — no account and no paid tier behind the download. The file is processed in memory to build the CSV and is never stored, sold or shared.",
  },
];

const HOWTO = [
  { title: "Get the IIF file", body: "Use the .iif export you were sent or saved from QuickBooks Desktop — no QuickBooks installation is needed for anything that follows." },
  { title: "Upload it here", body: "Drop the .iif file into the converter above — one file, up to 10 MB, no account needed. Files are processed in memory and never stored." },
  { title: "Convert to CSV", body: "Press Convert to CSV. The converter reads the file's TRNS transaction lines and writes one spreadsheet row per transaction: date, type, name and amount." },
  { title: "Download and open anywhere", body: "The .csv downloads automatically — fully free — and opens in Excel, Google Sheets or any other tool that reads spreadsheets." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function IifToCsvPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="IIF to CSV Converter"
      subtitle="Flatten a QuickBooks Desktop IIF file into a plain CSV — one row per transaction — so you can review, share or migrate the data anywhere. Fully free with no account."
      tool={<FormatConverter tool="iif-to-csv" fromLabel="IIF" toLabel="CSV" accept=".iif" outputExt="csv" />}
      currentPath="/tools/iif-to-csv"
      faqs={FAQS}
      howToName="How to convert IIF to CSV"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>An IIF file, and no QuickBooks in sight</h2>
          <p className={P}>
            IIF files travel further than QuickBooks Desktop does. An accountant exports one and emails it to a client who has never owned Desktop. A bookkeeper inherits one during a migration to another system. An old company&apos;s records survive as a folder of IIF exports years after the last Desktop license lapsed. In every case the data is right there — and practically unusable, because IIF (Intuit Interchange Format) was written for Desktop&apos;s importer, not for human eyes. Open one in a text editor and you get tab-separated lines in a private shorthand; open one in a spreadsheet and the structure lands as an undifferentiated grid.
          </p>
          <p className={P}>
            Reading the file means understanding its grammar, which is genuinely simple once stated plainly. Lines beginning with <strong>!</strong> are headers that declare the columns for what follows. A transaction then arrives as a small block: a <strong>TRNS</strong> line carrying the transaction itself — its type (DEPOSIT, CHECK, and so on), date, the name on it, and its total amount against the main account — followed by one or more <strong>SPL</strong> “split” lines carrying the other side of the double entry, the category accounts the total is distributed across, and an <strong>ENDTRNS</strong> line closing the block. One real transaction can occupy two lines or ten, which is exactly why raw IIF resists review: you cannot total a column, sort by date, or hand it to anyone without Desktop and expect them to follow it.
          </p>
          <p className={P}>
            Converting to CSV trades that structure for legibility on purpose. The output is one row per transaction — Date, Type, Description, Amount, and a Transaction ID column that stays blank because IIF never had IDs — ready to sort, filter, total and share. What you give up is the split detail, and section three below is blunt about exactly what does and does not cross over, because “flattened” should be a decision, not a surprise.
          </p>

          <h2 className={H2M}>How to convert IIF to CSV with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Get the IIF file.</strong> Use the export as it came from QuickBooks Desktop or from whoever sent it — you do not need QuickBooks installed for any step here, which is rather the point. If you are asking someone to produce one, an IIF exported from Desktop&apos;s utilities or reports is the input this converter expects: a tab-separated text file whose transaction blocks follow the TRNS/SPL pattern above.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload it.</strong> Drop the .iif into the tool at the top of this page. One file, up to 10 MB, no account needed; the file is processed in memory and never stored.
          </p>
          <p className={P}>
            <strong>Step 3 — Convert.</strong> Press <strong>Convert to CSV</strong>. The converter reads the file&apos;s own !TRNS header when one is present — IIF column order is declared in the file, not fixed by law — and falls back to the standard Desktop layout when it is not. It then takes each TRNS line as one transaction, converting its MM/DD/YYYY date to the ISO form spreadsheets sort correctly, and writes the row out with its type, name and amount. SPL lines are read as what they are — parts of a transaction, not transactions — so they do not become rows. A TRNS line whose amount is not a number is skipped, and a file with no TRNS lines at all returns an honest error rather than an empty spreadsheet.
          </p>
          <p className={P}>
            <strong>Step 4 — Download and review.</strong> The .csv downloads automatically, fully free, and the confirmation reports the transaction count. Open it in any spreadsheet and do the two checks that catch almost everything: total the Amount column and compare it with a total you trust from the source system, and sort by date to confirm the period is complete at both ends.
          </p>

          <h2 className={H2M}>When an IIF to CSV conversion surprises you</h2>
          <h3 className={H3}>“The categories are gone”</h3>
          <p className={P}>
            They are — deliberately, and it is the main thing to understand about this conversion. Categorization in an IIF lives on the SPL lines, as the distribution side of each entry. A CSV row has one amount and no place to express “$400 split across three accounts,” so the output keeps the transaction at its TRNS total and leaves the splits in the original file. For reviewing activity, checking totals, sharing with a client or migrating transaction history, the totals are what matter. For a category-level audit, work from the IIF itself inside Desktop, or treat the CSV as the index that tells you which transactions deserve a closer look in the original.
          </p>
          <h3 className={H3}>Rows are missing — or the converter finds no transactions</h3>
          <p className={P}>
            Two different causes. Missing rows usually means a TRNS line had a non-numeric amount — a blank, a text note in the amount&apos;s place — and was skipped; compare the converted count against the number of TRNS lines in the file to size the gap. “No transactions found” means the file contains no TRNS lines at all: many IIF exports carry only lists — customers, vendors, items, chart of accounts — and those are legitimate IIF files with nothing for this converter to flatten. Check what the export was actually of before assuming the file is corrupt.
          </p>
          <h3 className={H3}>Dates that will not sort or parse</h3>
          <p className={P}>
            The converter recognizes the MM/DD/YYYY (and M/D/YY) dates Desktop writes and converts them to ISO form. A date written in any other shape passes through unchanged rather than being guessed at — honest, but it means a file produced by a third-party IIF generator with different date habits can yield a column your spreadsheet reads as text. If dates misbehave, look at the raw IIF lines for the affected rows before blaming the spreadsheet.
          </p>
          <h3 className={H3}>Amounts look right but the columns feel thin</h3>
          <p className={P}>
            Also by design. The CSV has no columns for the account each transaction posted to, its memo, or its document/check number, even though the IIF carries all three — the output is modeled on the standard statement row (date, type, description, amount) so that other tools ingest it cleanly. If your review genuinely needs the memos or accounts alongside, keep the IIF open beside the CSV and use the CSV to navigate it; the pair together is the working set.
          </p>

          <h2 className={H2M}>Four ways to read an IIF, honestly compared</h2>
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
                <tr>
                  <td className={TD}>Import it into QuickBooks Desktop</td>
                  <td className={TD}>The complete record, splits and all — when you have Desktop and a company file it belongs in</td>
                  <td className={TD}>Needs a Desktop installation and license; importing to review is heavy, and IIF imports cannot be undone in one step</td>
                </tr>
                <tr>
                  <td className={TD}>Open the raw file in a spreadsheet as tab-delimited text</td>
                  <td className={TD}>A quick glance at a small file</td>
                  <td className={TD}>TRNS and SPL lines mix in one grid; totals double-count the splits and nothing sorts meaningfully</td>
                </tr>
                <tr>
                  <td className={TD}>Convert to CSV here</td>
                  <td className={TD}>Review, totals, sharing and migration on any machine, no QuickBooks needed</td>
                  <td className={TD}>Split/category detail, account names and memos stay in the original file</td>
                </tr>
                <tr>
                  <td className={TD}>Convert to a formatted Excel workbook</td>
                  <td className={TD}>The same flat rows with typed dates and numbers, ready to filter</td>
                  <td className={TD}>Same flattening as CSV — the wrapping is nicer, the content is the transaction list</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The workbook route is the <a href="/tools/iif-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">IIF to Excel converter</a>. Going back toward Desktop, the <a href="/tools/csv-to-iif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to IIF converter</a> rebuilds a proper TRNS/SPL import file from a spreadsheet, and the <a href="/tools/qbo-to-iif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to IIF converter</a> brings Web Connect downloads into the same Desktop format. Starting instead from a QBO you want to inspect, the <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a> lays that file out as rows the same way.
          </p>
        </>
      }
    />
  );
}
