import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { CsvToQbo } from "@/components/tools/CsvToQbo";

const PAGE_URL = "https://www.convertstatement.online/tools/csv-to-qbo";

export const metadata: Metadata = {
  title: "CSV to QBO Converter — Free Bank CSV to QuickBooks | Convert Statement",
  description:
    "Free CSV to QBO converter: turn any bank transaction CSV into a QuickBooks-ready QBO file with a column-mapping step, a balance-chain check, and unique transaction IDs. Scan and CSV export are free with no account; QBO download is on Pro.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "CSV to QBO Converter — Bank CSV to QuickBooks",
    description:
      "Upload a bank CSV, map its columns, and get a QuickBooks-ready QBO file with a balance check. Free to scan.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Can I import a CSV into QuickBooks Online directly?",
    a: "Yes — through Accounting → Bank transactions → Upload from file — but only a clean one: three or four columns in QuickBooks' expected layout, one date format, under 350 KB. Anything messier is worth converting to QBO first, which also gives you duplicate protection the CSV route does not have.",
  },
  {
    q: "Can QuickBooks Desktop import a CSV of bank transactions?",
    a: "No. Desktop has no native CSV bank import. Convert the CSV to a QBO file and import it through File → Utilities → Import → Web Connect Files, or use an IIF file for Desktop-style imports.",
  },
  {
    q: "Why does QuickBooks say some of the info in my file is missing?",
    a: "That is QuickBooks Online's message for a CSV it cannot read: an unrecognized header, numbers sitting in the description column, or mixed date formats are the usual causes. Re-check the column mapping here and keep one date format throughout the file.",
  },
  {
    q: "Will importing the same file twice create duplicates?",
    a: "Through a QBO file, no — QuickBooks matches on the unique transaction ID inside the file and skips rows it has already imported. Through a plain CSV upload, yes, it can: the CSV route has no ID check, so overlapping date ranges duplicate silently.",
  },
  {
    q: "My CSV has separate debit and credit columns. What do I map?",
    a: "Map both columns and leave the single Amount column unmapped. Money out (debits) becomes negative amounts and money in (credits) stays positive — the convention QuickBooks expects. A row with neither side filled is skipped and counted in the warnings.",
  },
  {
    q: "Is this converter free?",
    a: "The scan, the column mapping, the balance check and the cleaned CSV export are free with no account. The .QBO download is on the Pro plan. Either way, your file is processed in memory and never stored.",
  },
];

const HOWTO = [
  { title: "Export the CSV from your bank", body: "Download the date range you need as CSV — any export with a header row and date, description and amount columns works." },
  { title: "Upload it", body: "Drop the CSV into the tool (files up to 10 MB). Nothing is installed, and the scan needs no account." },
  { title: "Check the column mapping", body: "The tool auto-detects the date, payee and amount columns — fix any dropdown it guessed wrong and the file is re-read instantly." },
  { title: "Review the preview and the checks", body: "Check the parsed transactions, the warning count for unreadable rows, and the balance-chain check if your CSV carries a running balance." },
  { title: "Download and import", body: "Download the cleaned CSV free, or the .QBO on Pro, and import it in QuickBooks Online via Upload from file or in Desktop via Web Connect Files." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function CsvToQboPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Tool"
      title="CSV to QBO Converter"
      subtitle="Turn any bank transaction CSV into a QuickBooks-ready QBO file: map your columns, check the balance chain, and import without duplicates."
      tool={<CsvToQbo />}
      currentPath="/tools/csv-to-qbo"
      faqs={FAQS}
      howToName="How to convert a CSV to QBO"
      howToSteps={HOWTO}
      privacyLine="No account needed to scan · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>The CSV file your bank gives you is not the file QuickBooks wants</h2>
          <p className={P}>
            Every US bank lets you download your transactions as a CSV. Almost none of those
            downloads match what QuickBooks expects — and that gap is where hours of bookkeeping
            time disappear.
          </p>
          <p className={P}>
            QuickBooks Online does accept a CSV upload in the banking center, but only in a narrow
            shape: either <strong className="text-zinc-900 dark:text-white">three columns</strong> (Date,
            Description, Amount) or <strong className="text-zinc-900 dark:text-white">four columns</strong> (Date,
            Description, Credit, Debit), with one date format used consistently from the first row
            to the last, and a file no bigger than <strong className="text-zinc-900 dark:text-white">350 KB or
            about 1,000 lines</strong>. A real bank export rarely survives those rules. Chase adds its own
            column order, a credit union export carries a running balance and a check-number column,
            and a client&rsquo;s PayPal or card CSV arrives with fees, holds and currency columns mixed
            in. QuickBooks Desktop is stricter still: it has <strong className="text-zinc-900 dark:text-white">no
            CSV bank import at all</strong>, so a CSV has to become a QBO or IIF file before Desktop will
            touch it.
          </p>
          <p className={P}>
            The failures are not always loud, either. QuickBooks may refuse the file outright — or
            it may import it politely with a sign flipped, a debit column read as credits, or a week
            of transactions missing, and the problem only surfaces at reconciliation. Converting the
            CSV to a QBO (Web Connect) file first fixes the file instead of fighting the importer:
            the QBO carries the bank identity, the closing balance and a unique ID for every
            transaction, so QuickBooks imports it through the same door as a bank download — and
            recognizes it if it ever sees it again.
          </p>
          <p className={P}>
            This page is for the people who hit that wall every month: bookkeepers handed a folder
            of client CSVs at cleanup time, businesses whose bank feed broke or never existed, and
            anyone moving a year of transactions into QuickBooks at tax time. Upload the CSV, check
            the mapping, and download a file QuickBooks actually wants.
          </p>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="A bank transaction spreadsheet with dates, descriptions and amounts ready to map into QuickBooks fields" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">A typical bank CSV export before conversion — dates, descriptions and amounts in the bank&rsquo;s own columns, ready to be mapped into QuickBooks fields.</figcaption>
          </figure>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <caption className="pb-3 text-left font-semibold text-zinc-900 dark:text-white">Which file will QuickBooks actually take?</caption>
              <thead>
                <tr>
                  <th className={TH}>File</th>
                  <th className={TH}>QuickBooks Online</th>
                  <th className={TH}>QuickBooks Desktop</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>CSV</strong></td><td className={TD}>Banking upload only — 3 or 4 columns, one date format, up to 350 KB</td><td className={TD}>Not accepted for bank transactions</td></tr>
                <tr><td className={TD}><strong>QBO (Web Connect)</strong></td><td className={TD}>Accepted — banking upload</td><td className={TD}>Accepted — Web Connect import</td></tr>
                <tr><td className={TD}><strong>OFX</strong></td><td className={TD}>Not accepted directly — convert first</td><td className={TD}>Not accepted directly — convert first</td></tr>
                <tr><td className={TD}><strong>QFX</strong></td><td className={TD}>Not accepted (it is Quicken&rsquo;s file)</td><td className={TD}>Not accepted</td></tr>
                <tr><td className={TD}><strong>IIF</strong></td><td className={TD}>Not used for bank imports</td><td className={TD}>Accepted for lists and transactions</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert a CSV to QBO with this converter</h2>
          <h3 className={H3}>Step 1 — Export the CSV from your bank</h3>
          <p className={P}>
            Sign in to your bank and download the date range you need as CSV. Any export with a
            header row and date, description and amount columns works — Chase, Bank of America,
            Wells Fargo, Citi, Capital One and most regional banks and credit unions all export
            this shape.
          </p>
          <h3 className={H3}>Step 2 — Upload it</h3>
          <p className={P}>
            Drop the file into the tool above (CSV files up to 10 MB — years of transactions for
            most accounts). Nothing is installed, and the scan needs no account.
          </p>
          <h3 className={H3}>Step 3 — Check the column mapping</h3>
          <p className={P}>
            The tool reads your header row and auto-detects which column is the date, which is the
            payee, and whether amounts live in one signed column or a debit/credit pair. If it
            guesses wrong, change the dropdown and the file is re-read instantly. Three things are
            worth ten seconds here:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:text-[#007A33]">
            <li><strong className="text-zinc-900 dark:text-white">Dates.</strong> MM/DD/YYYY is the format QuickBooks never argues with. If your export mixes formats (1/5/2026 next to Jan 6, 2026), fix the mapping now — a converted file freezes one format in place.</li>
            <li><strong className="text-zinc-900 dark:text-white">Amounts.</strong> Map <em>either</em> one signed amount column (money out negative) <em>or</em> a debit and a credit column — never both. Debit rows become negative amounts and credit rows stay positive, which is the sign convention QuickBooks uses.</li>
            <li><strong className="text-zinc-900 dark:text-white">Payees.</strong> Bank descriptions carry noise — location codes, trace numbers, truncated names. The payee text you see in the preview is what lands in your bank feed, where your categorization rules have to match it, so clean names beat raw ones.</li>
          </ul>
          <h3 className={H3}>Step 4 — Review the preview and the checks</h3>
          <p className={P}>
            You will see the parsed transactions, a warning count for any rows that could not be
            read (they are skipped and counted, never silently dropped), and — if your CSV carries
            a running-balance column — a <strong className="text-zinc-900 dark:text-white">balance-chain check</strong>:
            each balance must equal the previous balance plus its transaction. A break means the
            export itself is missing a row or carries a wrong amount, and it is far cheaper to
            learn that here than inside a reconciliation.
          </p>
          <h3 className={H3}>Step 5 — Download and import</h3>
          <p className={P}>
            The cleaned CSV export is free. The .QBO file is a Pro download — it is the file that
            carries the bank ID and per-transaction IDs into QuickBooks. Import it the normal way:
            in QuickBooks Online, go to <strong className="text-zinc-900 dark:text-white">Accounting → Bank
            transactions</strong>, open the drop-down next to <strong className="text-zinc-900 dark:text-white">Link
            account</strong> and choose <strong className="text-zinc-900 dark:text-white">Upload from file</strong>; in
            QuickBooks Desktop, use <strong className="text-zinc-900 dark:text-white">File → Utilities → Import →
            Web Connect Files</strong>. (Desktop users working with lists and journal-style imports instead
            have a dedicated{" "}
            <a href="/tools/csv-to-iif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to IIF converter</a>.)
          </p>
          <p className={P}>
            Have a drawer of monthly CSVs rather than one? The{" "}
            <a href="/tools/bulk-import-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Bulk Importer for QuickBooks</a>{" "}
            merges many CSV files, maps the columns once and builds a single import file.
          </p>
          <figure className="mt-6 flex flex-col gap-4 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:p-6">
            <img src="/tools/csv-to-qbo-infographic.png" alt="CSV to QBO in 5 steps — export the CSV, upload it, map the columns, review the checks, import the QBO" className="w-full rounded-[16px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">The whole conversion in five steps — and the five common CSV import errors the checks in steps 3 and 4 are there to catch.</figcaption>
          </figure>

          <h2 className={H2M}>When conversions go wrong: the five failure points that matter</h2>
          <h3 className={H3}>Negative amounts that are not negative</h3>
          <p className={P}>
            Some banks export money out in (parentheses), some add a &ldquo;Dr&rdquo; marker, and some simply
            list withdrawals as positive numbers in their own column. Read as a signed amount
            column, all three corrupt the import — deposits and payments swap places. The fix is
            mapping discipline: a debit/credit pair, or a genuinely signed column, never a hopeful
            guess.
          </p>
          <h3 className={H3}>Excel quietly rewriting your file</h3>
          <p className={P}>
            Opening a CSV in Excel and re-saving is the most common way good data goes bad. Excel
            re-formats dates to your computer&rsquo;s locale, drops leading zeros from check and
            reference numbers, turns long card numbers into scientific notation, and may save
            amounts with currency symbols QuickBooks cannot parse. If you must edit in Excel, edit
            a copy, keep the date column formatted as MM/DD/YYYY text, and re-check the file
            afterwards — this converter&rsquo;s preview shows you exactly what survived.
          </p>
          <h3 className={H3}>Split columns and totals rows</h3>
          <p className={P}>
            Statements exported &ldquo;for print&rdquo; often include running totals, subtotal lines or a balance
            carried across two columns. Those rows are not transactions. If a row has a date but no
            readable amount, this tool skips it and tells you — a warning count that does not match
            your expectations is the first sign your source file has furniture in it.
          </p>
          <h3 className={H3}>Duplicate transactions after re-import</h3>
          <p className={P}>
            A CSV upload has no memory: import the same month twice through QuickBooks&rsquo; CSV route
            and you own two of everything. A QBO file defends itself — every row carries a unique
            transaction ID (FITID) derived from its date, payee and amount, and QuickBooks refuses
            to import an ID it has already seen. If a file you did not convert looks suspicious,
            run it through the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            before it reaches your books.
          </p>
          <h3 className={H3}>&ldquo;The file is damaged&rdquo; and &ldquo;cannot verify your financial institution&rdquo;</h3>
          <p className={P}>
            These two messages sound like your data is broken; usually the wrapper is. &ldquo;Not a valid
            Web Connect file&rdquo; (error OL-222) means the file&rsquo;s OFX structure is malformed — a broken
            tag or a truncated download. The verify-institution message means the bank ID
            (INTU.BID) inside the file is missing or not on Intuit&rsquo;s list. Files built here carry a
            valid ID; an older QBO or OFX file with a bad one can be repaired with the{" "}
            <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO fixer</a>.
          </p>
          <figure className="mt-10 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-review.webp" alt="A bookkeeper reviewing converted transactions against a bank statement before importing them" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">A two-minute review before importing saves an hour of cleanup after — checking names, amounts and duplicates while the file is still outside your books.</figcaption>
          </figure>

          <h2 className={H2M}>Three ways to get a CSV into QuickBooks, honestly compared</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Route</th>
                  <th className={TH}>What it costs you</th>
                  <th className={TH}>Where it breaks</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Clean the CSV by hand in Excel, upload to QuickBooks Online</strong></td><td className={TD}>Free, and fine for one small file</td><td className={TD}>Every import repeats the work; Excel rewrites dates and numbers; no duplicate protection; Desktop cannot use it at all</td></tr>
                <tr><td className={TD}><strong>Connect the live bank feed</strong></td><td className={TD}>Nothing to convert</td><td className={TD}>Feeds disconnect, many only fetch a limited history window, some banks and card accounts have no feed — and a feed cannot help with last year&rsquo;s files or a client&rsquo;s exports</td></tr>
                <tr><td className={TD}><strong>Convert the CSV to QBO first (this page)</strong></td><td className={TD}>A few minutes per file; the .QBO download is on Pro</td><td className={TD}>You still review the mapping — no converter can know your chart of accounts — but the file imports into Online and Desktop, carries balances and IDs, and re-imports safely</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Starting from a PDF statement rather than a CSV? That is a different first step — the{" "}
            <a href="/pdf-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">PDF to QBO converter</a>{" "}
            handles the statement itself.
          </p>
        </>
      }
    />
  );
}
