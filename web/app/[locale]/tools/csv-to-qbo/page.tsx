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
    q: "How do I convert a CSV file to QBO for QuickBooks?",
    a: "Upload your bank's CSV export, check the auto-detected column mapping (date, payee, and either a signed amount column or a debit/credit pair), and download the result. The CSV export is free; the QBO file is available on the Pro plan. Import the QBO through QuickBooks' bank-feed import, and QuickBooks matches it against your account.",
  },
  {
    q: "What if my CSV uses debit and credit columns instead of one amount column?",
    a: "Map both columns. Debit rows (money out) become negative amounts and credit rows (money in) stay positive, which is the sign convention QuickBooks expects. A row that fills neither side is skipped and counted in the warnings so you can check it.",
  },
  {
    q: "Why does the tool check the running-balance chain?",
    a: "If your CSV carries a running-balance column, the tool verifies that each balance equals the previous balance plus the transaction. A break means the export is missing a row or has a wrong amount — importing it would leave your QuickBooks reconciliation off by exactly that amount, so the break is flagged before you import.",
  },
  {
    q: "Will re-importing the same file create duplicates in QuickBooks?",
    a: "No. Every row gets a unique transaction ID derived from its own date, payee, and amount, so QuickBooks recognizes a re-imported row as already imported. If you are unsure, run the file through the QBO Duplicate Finder first — it flags repeated IDs before they reach your books.",
  },
  {
    q: "Which CSV exports does this work with?",
    a: "Any export with a header row and date, description, and amount columns — most US banks (Chase, Wells Fargo, Bank of America, Citi, Capital One, and others) export this shape. If your bank's headers differ, the mapping step lets you point each field at the right column.",
  },
  {
    q: "Is there a file size limit?",
    a: "This converter accepts CSV files up to 10 MB, which covers years of transactions for most accounts. QuickBooks Online's own CSV upload, by contrast, refuses files over 350 KB — one more reason to convert first. Very long histories are still easiest to import month by month.",
  },
  {
    q: "What is the difference between QBO, OFX and QFX files?",
    a: "All three belong to the same OFX family. QBO is Intuit's 'Web Connect' flavour for QuickBooks and carries a bank ID (INTU.BID) that QuickBooks checks before accepting the file. QFX is the Quicken variant, and plain OFX is the generic original. A file in the wrong flavour is a common reason QuickBooks refuses an import.",
  },
  {
    q: "Can I import the converted file into QuickBooks Desktop?",
    a: "Yes. In QuickBooks Desktop use File → Utilities → Import → Web Connect Files and pick the QBO file. If the bank account is already linked to online services, disconnect it first (the account shows a yellow online-linked icon) or import into a new account, otherwise Desktop may reject the file or post to the wrong place.",
  },
  {
    q: "QuickBooks says it cannot verify my financial institution. What does that mean?",
    a: "QuickBooks checks the bank ID (INTU.BID) inside the file against its own list. A missing or wrong ID triggers that message even when the transactions themselves are fine. This converter writes a valid bank ID into every file; if an older file still fails, our OFX to QBO fixer can repair the ID in place.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "No. Your CSV is processed in memory to build the conversion and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export from your bank", body: "Download your transactions as a CSV from your bank's website — any export with date, description, and amount columns works." },
  { title: "Upload it here", body: "Drop the CSV in. The tool auto-detects the column mapping from your header row." },
  { title: "Check the mapping", body: "Confirm the date, payee, and amount (or debit/credit) columns are right, and review the balance-chain check." },
  { title: "Download and import", body: "Download the CSV free, or the QBO on Pro, and import it into QuickBooks through the bank-feed import." },
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
          <h2 className={H2}>Why a plain CSV import goes wrong</h2>
          <p className={P}>
            QuickBooks Online can import a CSV directly — but it is strict about the shape it accepts,
            and it has no way to tell you that the file itself is broken. It wants three columns
            (Date, Description, Amount) or four (with separate Credit and Debit), one consistent date
            format, and a file no larger than 350 KB. Real bank exports rarely match that on the first
            try. Worse, the failures are silent: a missing row, a flipped sign, or a debit/credit pair
            read backwards all import without complaint — and surface weeks later as a reconciliation
            difference nobody can explain.
          </p>
          <p className={P}>
            Converting the CSV to a QBO file first fixes the file instead of fighting the importer.
            The converter normalizes dates and signs, verifies the running-balance chain when your
            export carries balances, writes a valid bank ID, and gives every row a unique transaction
            ID so a re-import cannot duplicate your books. The short version: upload the CSV above,
            confirm the column mapping, download the QBO, and import it through the bank feed.
          </p>

          <h2 className={H2M}>What a QBO file actually is</h2>
          <p className={P}>
            A QBO file is a Web Connect file — a structured text file in the OFX format that tells
            QuickBooks which bank account the transactions belong to, what the closing balance should
            be, and how to recognize each transaction if it ever sees it again. That structure is
            exactly what a raw CSV lacks, and it is why a converted file imports cleanly where the
            CSV argued. The fields that matter most:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Field</th>
                  <th className={TH}>What it holds</th>
                  <th className={TH}>Why it matters</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>DTPOSTED</strong></td><td className={TD}>Transaction date</td><td className={TD}>QuickBooks files the transaction on the right day — no format guessing.</td></tr>
                <tr><td className={TD}><strong>TRNAMT</strong></td><td className={TD}>Signed amount</td><td className={TD}>Money out is negative, money in positive — the convention QuickBooks expects.</td></tr>
                <tr><td className={TD}><strong>TRNTYPE</strong></td><td className={TD}>Credit or debit</td><td className={TD}>Tells QuickBooks how to categorize the movement at a glance.</td></tr>
                <tr><td className={TD}><strong>NAME / MEMO</strong></td><td className={TD}>Payee and description</td><td className={TD}>What you see in the bank feed — and what rules and matching work from.</td></tr>
                <tr><td className={TD}><strong>FITID</strong></td><td className={TD}>Unique transaction ID</td><td className={TD}>QuickBooks deduplicates on this ID, so importing twice cannot double your books.</td></tr>
                <tr><td className={TD}><strong>INTU.BID</strong></td><td className={TD}>Your bank's ID</td><td className={TD}>The "verify financial institution" check reads this. Wrong or missing = refused import.</td></tr>
                <tr><td className={TD}><strong>LEDGERBAL</strong></td><td className={TD}>Closing balance</td><td className={TD}>QuickBooks compares it with the imported rows; a mismatch is visible immediately.</td></tr>
              </tbody>
            </table>
          </div>
          <figure className="mt-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="A bank transaction spreadsheet with dates, descriptions and amounts ready to map into QuickBooks fields" className="w-full rounded-[20px] border border-[#E3EDE0]" loading="lazy" />
            <figcaption className="mt-2 text-center text-xs text-zinc-400">Illustration: a typical bank CSV export before conversion.</figcaption>
          </figure>

          <h2 className={H2M}>Direct CSV upload vs a converted QBO file</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}></th>
                  <th className={TH}>Upload the CSV directly</th>
                  <th className={TH}>Convert to QBO first</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Column mapping</strong></td><td className={TD}>Redone by hand on every import</td><td className={TD}>Done once here, stored inside the file</td></tr>
                <tr><td className={TD}><strong>Duplicate protection</strong></td><td className={TD}>None — overlapping date ranges duplicate silently</td><td className={TD}>Every row carries a unique ID QuickBooks recognizes</td></tr>
                <tr><td className={TD}><strong>Balance verification</strong></td><td className={TD}>None</td><td className={TD}>Closing balance in the file, plus the balance-chain check here</td></tr>
                <tr><td className={TD}><strong>QuickBooks Desktop</strong></td><td className={TD}>Not supported</td><td className={TD}>Imports through Web Connect</td></tr>
                <tr><td className={TD}><strong>File size</strong></td><td className={TD}>Refused over 350 KB</td><td className={TD}>This converter accepts CSVs up to 10 MB</td></tr>
                <tr><td className={TD}><strong>Bank identity</strong></td><td className={TD}>None</td><td className={TD}>Valid bank ID (INTU.BID) written into the file</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>Importing the converted file into QuickBooks Online</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>Go to <strong className="text-zinc-900 dark:text-white">Accounting → Bank transactions</strong> (in some accounts: Banking).</li>
            <li>On the account tile, open the drop-down next to <strong className="text-zinc-900 dark:text-white">Link account</strong> and choose <strong className="text-zinc-900 dark:text-white">Upload from file</strong>.</li>
            <li>Select the QBO file you downloaded and pick the account it belongs to.</li>
            <li>Review the transactions in the For Review tab, categorize, and add them.</li>
          </ol>
          <p className={P}>
            Because the file carries unique transaction IDs, importing the same period twice does not
            create a second copy — QuickBooks matches what it has already seen.
          </p>

          <h2 className={H2M}>Importing into QuickBooks Desktop</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>Back up your company file first — Desktop imports cannot be undone with one click.</li>
            <li>Go to <strong className="text-zinc-900 dark:text-white">File → Utilities → Import → Web Connect Files</strong> and select the QBO file.</li>
            <li>Choose the bank account when prompted, review the downloaded transactions, and add them to the register.</li>
          </ol>
          <p className={P}>
            One caution: if the account is already connected to your bank's online services (its name
            shows a yellow online-linked icon), disconnect it before a Web Connect import, or import
            into a fresh account — otherwise Desktop can reject the file or post it to the wrong place.
          </p>

          <h2 className={H2M}>Prepare your CSV the way QuickBooks wants it</h2>
          <p className={P}>
            A clean source file makes every route work better. Check these before you convert: a header
            row with clear names; dates all in one format (MM/DD/YYYY is the safest); amounts as plain
            numbers with no currency symbols or thousands separators; money out marked negative, or in
            its own debit column; and no blank rows in the middle. Here is the shape that converts
            perfectly every time — three ordinary rows from a sample account:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Date</th><th className={TH}>Description</th><th className={TH}>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>10/01/2026</td><td className={TD}>Payroll deposit — ACME LLC</td><td className={TD}>3,000.00</td></tr>
                <tr><td className={TD}>10/03/2026</td><td className={TD}>Office supplies</td><td className={TD}>-84.20</td></tr>
                <tr><td className={TD}>10/05/2026</td><td className={TD}>Office rent</td><td className={TD}>-1,450.00</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The arithmetic QuickBooks will do on import: opening balance $2,340.55 + $3,000.00 in
            − $1,534.20 out = closing balance $3,806.35. If the closing balance in the file and the
            sum of the rows ever disagree, something is missing — which is exactly what the
            balance-chain check on this page looks for before you import. (Sample data, shown for
            illustration.)
          </p>

          <h2 className={H2M}>Getting the CSV out of your bank</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Chase:</strong> sign in, open the account, choose <em>Download account activity</em>,
            set the date range, and pick the spreadsheet/CSV file type.{" "}
            <strong className="text-zinc-900 dark:text-white">Bank of America:</strong> open the account and use the <em>Download</em> link, choosing a
            comma-separated (CSV) format.{" "}
            <strong className="text-zinc-900 dark:text-white">Wells Fargo:</strong> open the account, choose <em>Download Account Activity</em>, and select CSV.
            Other banks hide the same option under names like "Export" or "Download transactions" —
            any export with date, description and amount columns works with the mapping step above.
          </p>

          <h2 className={H2M}>When QuickBooks still says no</h2>
          <h3 className={H3}>"Some of the info in the file is missing"</h3>
          <p className={P}>
            QuickBooks Online's message for a CSV whose columns or formats it cannot read — usually a
            header it does not recognize, numbers inside the description column, or mixed date formats.
            Re-check the mapping here and keep one date format throughout.
          </p>
          <h3 className={H3}>"Unable to verify financial institution"</h3>
          <p className={P}>
            The bank ID inside the QBO file (INTU.BID) is missing or not on Intuit's list. Files from
            this converter carry a valid ID; an older file can be repaired with the{" "}
            <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO fixer</a>.
          </p>
          <h3 className={H3}>"Not a valid Web Connect file" (OL-222)</h3>
          <p className={P}>
            The file's OFX structure is malformed — a broken tag or a truncated download. Re-export
            from your bank, or run the file through the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            to see exactly where it breaks.
          </p>
          <h3 className={H3}>File too large</h3>
          <p className={P}>
            Direct CSV uploads stop at 350 KB. Convert here instead — up to 10 MB — and for very long
            histories, split the work into monthly files so each import stays easy to review.
          </p>
          <h3 className={H3}>Duplicates after importing</h3>
          <p className={P}>
            Almost always an overlapping date range: the same week imported twice through a route with
            no ID checking. Converted QBO files dedupe on transaction ID; if a file is already
            suspect, the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO Duplicate Finder</a>{" "}
            lists the repeated IDs before they reach your books.
          </p>
          <h3 className={H3}>Money in and money out are reversed</h3>
          <p className={P}>
            Your bank exports money out as positive (or the debit/credit columns were mapped in the
            wrong order). Flip the mapping in the step above and convert again — the balance check
            will confirm the direction before you import.
          </p>

          <figure className="mt-10">
            <img src="/tools/csv-to-qbo-review.webp" alt="A bookkeeper reviewing converted transactions against a bank statement before importing them" className="w-full rounded-[20px] border border-[#E3EDE0]" loading="lazy" />
            <figcaption className="mt-2 text-center text-xs text-zinc-400">Illustration: a two-minute review before importing saves an hour of cleanup after.</figcaption>
          </figure>

          <h2 className={H2M}>The two-minute check that prevents reconciliation pain</h2>
          <p className={P}>
            Every reconciliation difference has a shape. If your QuickBooks balance is off by exactly
            one transaction, a row is missing or doubled. If it is off by exactly twice a transaction,
            that row's sign is flipped. If it is off by a round number, look for a manual entry.
            Checking the file against that logic <em>before</em> import — opening balance, plus money
            in, minus money out, equals closing balance — turns a month-end mystery into a two-minute
            fix. When the two sides still do not agree after importing, the{" "}
            <a href="/tools/reconciliation-finder" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Reconciliation Difference Finder</a>{" "}
            compares your statement against QuickBooks and names the entries responsible.
          </p>

          <h2 className={H2M}>Converting every month? Make it a system</h2>
          <p className={P}>
            One file is a chore; twelve files a month, every month, is a workflow. A free account
            keeps every conversion in one searchable history, so last quarter's file is never lost in
            a downloads folder. The dashboard adds bulk conversion when a whole month of statements
            lands at once, and client portals if you collect statements from other people — each
            client uploads through their own link and the conversion bills to you. When you are ready
            for QBO downloads and higher limits,{" "}
            <a href="/pricing" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Pro</a>{" "}
            covers 500 statement pages a month alongside the tools. Start with the file you have:
            scanning and the CSV export on this page are free, with no account needed.
          </p>
          <p className={P}>
            Working from a PDF statement instead? The{" "}
            <a href="/quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QuickBooks hub</a>{" "}
            covers the full statement-to-QuickBooks route, and the{" "}
            <a href="/tools/qbo-import-errors" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO import-error decoder</a>{" "}
            explains every refusal message QuickBooks can show you.
          </p>
        </>
      }
    />
  );
}
