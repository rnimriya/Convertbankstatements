import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/csv-to-ofx";

export const metadata: Metadata = {
  title: "CSV to OFX Converter — Free | Convert Statement",
  description: "Turn a bank CSV export into a standard OFX file that finance and accounting apps can import — dates, descriptions and amounts carried over exactly. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "CSV to OFX Converter — Free",
    description: "Upload a CSV file and download it as OFX — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a CSV file to OFX?",
    a: "Export a CSV with a header row from your bank, drop it into the converter above (one .csv file, up to 10 MB), and press Convert to OFX. The file downloads automatically and the confirmation tells you how many transactions were converted. It is fully free, needs no account, and your file is processed in memory and never stored.",
  },
  {
    q: "What does my CSV need for the conversion to work?",
    a: "A header row the converter can recognize — a date column (Date, Posted or Transaction Date), a description column (Description, Payee or Name), and either one signed Amount column or a Debit and Credit pair. Rows whose date or amount cannot be read are skipped, so compare the converted transaction count with the number of rows you expected.",
  },
  {
    q: "What is inside the OFX file this converter builds?",
    a: "A standard OFX 1.02 statement: a sign-on block, an account block, and one STMTTRN entry per transaction carrying its type (CREDIT or DEBIT), posted date, amount, description, memo and a unique transaction ID (FITID). The FITID is generated from the transaction's own date, description and amount, so converting the same CSV again produces the same IDs instead of fresh duplicates.",
  },
  {
    q: "Does the OFX include my real account number or closing balance?",
    a: "No — a plain CSV carries neither, and the converter invents neither. The account ID is written as a placeholder (0000000000) and there is no closing ledger balance, because your source file has none. The transactions, dates and amounts are exactly yours; only the bank identity fields are generic, which is the honest limit of a CSV source.",
  },
  {
    q: "Is OFX the same thing as QBO or QFX?",
    a: "They are one family. QBO is OFX 1.02 as QuickBooks Web Connect uses it, and QFX is Quicken's variant of the same structure with an institution ID added. Plain OFX is the generic form: choose it when your software asks for OFX by name. If your destination is QuickBooks or Quicken specifically, the dedicated QBO and QFX converters on this site are the closer match.",
  },
  {
    q: "Is this converter really free, and what happens to my file?",
    a: "Yes — the conversion and the download are fully free with no account and no paid tier behind them. The file is processed in memory to build the OFX and is never stored, sold or shared.",
  },
];

const HOWTO = [
  { title: "Export the CSV from your bank", body: "Download the date range you need as CSV. Keep the bank's header row — the converter reads Date, Description and Amount (or a Debit/Credit pair) from it." },
  { title: "Upload it here", body: "Drop the .csv file into the converter above — one file, up to 10 MB, no account needed. Files are processed in memory and never stored." },
  { title: "Convert to OFX", body: "Press Convert to OFX. Each readable row becomes an OFX transaction with its date, description, amount and a generated transaction ID." },
  { title: "Download and import the OFX", body: "The .ofx file downloads automatically. Check the transaction count in the confirmation, then import it into the app that asked for OFX." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function CsvToOfxPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="CSV to OFX Converter"
      subtitle="Turn a bank CSV export into a standard OFX file that finance and accounting apps can import — dates, descriptions and amounts carried over exactly. Fully free with no account."
      tool={<FormatConverter tool="csv-to-ofx" fromLabel="CSV" toLabel="OFX" accept=".csv" outputExt="ofx" />}
      currentPath="/tools/csv-to-ofx"
      faqs={FAQS}
      howToName="How to convert CSV to OFX"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Your bank gave you a spreadsheet. Your software wants an OFX file.</h2>
          <p className={P}>
            OFX — Open Financial Exchange — is the format banks themselves use to hand transactions to software. It is the plain, unbranded member of the family: QBO is OFX dressed for QuickBooks, QFX is OFX dressed for Quicken, and plain OFX is what a long list of other tools still ask for by name — desktop finance apps like GnuCash and Moneydance, bookkeeping utilities, migration tools, and older accounting software that predates the Intuit variants. When one of those is your destination, a bank CSV is the wrong shape twice over: it is a grid of text with no statement structure, no transaction IDs, and no statement period.
          </p>
          <p className={P}>
            The mismatch shows up in ordinary ways. The app&apos;s import menu lists OFX and grey-spreadsheets nothing. Or it does offer a CSV import, but makes you re-map the columns by hand for every single file, every single month. Or the bank used to offer an OFX download next to the CSV and quietly removed it, leaving the spreadsheet as the only export. In each case the transactions themselves are fine — they are just wearing the wrong container. This converter rebuilds that container: your rows go in as a spreadsheet and come out as a structured OFX 1.02 statement, with each transaction carrying a type, a posted date, an amount, your description and memo text, and a unique FITID generated from the transaction itself, so an OFX reader that checks IDs sees a proper statement rather than anonymous rows.
          </p>
          <p className={P}>
            One limit is worth stating before you convert, because it shapes everything below: a CSV knows nothing about the account it came from. It has no bank routing identity, no account number and no closing balance, so the OFX built from it cannot honestly carry them either — the account fields are placeholders and there is no ledger balance. Software that simply reads transactions takes the file as it is. Software that validates the file against a specific bank&apos;s identity needs the bank&apos;s own OFX download, and no converter can truthfully substitute for that.
          </p>

          <h2 className={H2M}>How to convert CSV to OFX with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Export the CSV from your bank.</strong> Sign in to your bank and download the period you need as a CSV, keeping the export exactly as the bank produced it. Any normal bank shape works: one header row, then a date column, a description or payee column, and either a single signed amount column or separate debit and credit columns. Do not tidy the file in Excel first unless you have to — a fresh export is the most reliable input there is.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload it.</strong> Drop the .csv into the tool at the top of this page. One file at a time, up to 10 MB — that is years of transactions for most accounts. There is no account to create and nothing to install; the file is processed in memory and never stored.
          </p>
          <p className={P}>
            <strong>Step 3 — Convert.</strong> Press <strong>Convert to OFX</strong>. The converter reads your header row and auto-detects which column is the date, which is the description, and whether amounts live in one signed column or a debit/credit pair — a debit becomes a negative amount and a credit stays positive, the sign convention OFX expects. Each readable row becomes one STMTTRN entry in OFX 1.02, sorted by date, with its own generated FITID. A row whose date or amount cannot be read is skipped rather than guessed at.
          </p>
          <p className={P}>
            <strong>Step 4 — Download and check the count.</strong> The .ofx file downloads automatically, fully free, and the confirmation message tells you how many transactions were converted. Compare that number with the rows in your CSV before you import: it is the fastest possible check that nothing was skipped. Then import the OFX into your software and spot-check the first and last transactions against the bank&apos;s own statement.
          </p>

          <h2 className={H2M}>When a CSV to OFX conversion goes wrong</h2>
          <h3 className={H3}>The converter says it cannot read the file</h3>
          <p className={P}>
            This almost always means the header row was not recognized. The converter looks for familiar headers — Date, Posted, Transaction Date; Description, Payee, Name; Amount, or Debit and Credit. A bank that labels its columns something idiosyncratic, or a file with a title line, an account-summary block or blank rows above the real headers, defeats the detection. The fix is small: delete anything above the header row and, if the bank&apos;s labels are unusual, rename the headers to the plain words above in a copy of the file. If there is no header row at all, add one — without it there is nothing to detect from.
          </p>
          <h3 className={H3}>Deposits and payments come out swapped</h3>
          <p className={P}>
            Sign handling is the classic CSV trap. Amounts in (parentheses) are read as negative, as accounting notation intends, and a leading minus sign is honored. The dangerous file is the one where withdrawals and deposits are both positive numbers in a single Amount column, distinguished only by a separate Type or Dr/Cr column the converter does not map — in that shape there is genuinely nothing in the amount itself to convert, and the honest repair is to split the export into debit and credit columns before converting. If your bank offers both layouts, the debit/credit layout is the safer download.
          </p>
          <h3 className={H3}>Excel touched the file and now rows are missing</h3>
          <p className={P}>
            Opening a CSV in Excel and re-saving it rewrites data quietly: dates flip to your computer&apos;s locale format, leading zeros fall off reference numbers, long numbers become scientific notation, and stray subtotal or “Total” rows the bank included get carried along — rows with no readable amount are then skipped at conversion, which is correct behavior but shows up as a short transaction count. If the count in the confirmation is lower than expected, go back to the untouched bank export rather than debugging the edited copy.
          </p>
          <h3 className={H3}>The OFX imports, but the account looks generic</h3>
          <p className={P}>
            That is the placeholder identity described above, not a defect in your data: the file&apos;s bank ID and account ID are generic values because a CSV contains no real ones, and there is no closing balance for the same reason. Most OFX readers import the transactions and let you attach them to the right account on their side. If your software instead rejects files whose bank identity it cannot verify, it is asking for something only your bank can issue — download the OFX from the bank if it still offers one, and keep this route for the files it does not.
          </p>

          <h2 className={H2M}>Three routes from CSV to OFX, honestly compared</h2>
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
                  <td className={TD}>Map the CSV inside your app&apos;s own importer</td>
                  <td className={TD}>One small file, one time, in an app with a good CSV importer</td>
                  <td className={TD}>The mapping work repeats for every file and every bank, and some apps have no CSV import at all</td>
                </tr>
                <tr>
                  <td className={TD}>Download OFX directly from the bank</td>
                  <td className={TD}>The authoritative file, with real bank identity and closing balance — when the bank still offers it</td>
                  <td className={TD}>Many banks now offer CSV only, or limit OFX to recent months</td>
                </tr>
                <tr>
                  <td className={TD}>Convert the CSV to OFX here</td>
                  <td className={TD}>Any bank CSV, any period, for software that reads OFX transactions</td>
                  <td className={TD}>No real bank identity or closing balance can come from a CSV — the file carries transactions, not the bank&apos;s credentials</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            If the software asking for a file is actually QuickBooks or Quicken, skip plain OFX and use the variant it expects: the <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a> for QuickBooks, or the <a href="/tools/csv-to-qfx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QFX converter</a> for Quicken. For the legacy plain-text format some older apps still require, there is a <a href="/tools/csv-to-qif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QIF converter</a> as well. And the trip is reversible: the <a href="/tools/ofx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to CSV converter</a> lays any OFX file back out as spreadsheet rows when you need to inspect one.
          </p>
        </>
      }
    />
  );
}
