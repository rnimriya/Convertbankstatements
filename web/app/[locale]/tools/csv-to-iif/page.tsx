import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { CsvToIif } from "@/components/tools/CsvToIif";

const PAGE_URL = "https://www.convertstatement.online/tools/csv-to-iif";

export const metadata: Metadata = {
  title: "CSV to IIF Converter — Free CSV to QuickBooks Desktop | Convert Statement",
  description:
    "Free CSV to IIF converter for QuickBooks Desktop: turn any bank transaction CSV into an import-ready IIF file with a column-mapping step and your own bank, income, and expense account names. Fully free download, no account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "CSV to IIF Converter — Bank CSV to QuickBooks Desktop",
    description:
      "Upload a bank CSV, map its columns, set your QuickBooks Desktop accounts, and download a free IIF file ready to import.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a CSV file to IIF for QuickBooks Desktop?",
    a: "Upload your bank's CSV export, check the mapping (date, payee, and an amount or debit/credit pair), and set your bank, income, and expense account names to match your chart of accounts. Download the IIF and import it in QuickBooks Desktop via File → Utilities → Import → IIF Files — after backing up your company file.",
  },
  {
    q: "Why can't QuickBooks Desktop just import my bank CSV?",
    a: "Desktop has no native CSV bank import — that upload exists only in QuickBooks Online. Desktop moves data through IIF files and Web Connect (QBO) files instead, so a bank CSV has to be converted into one of those formats before Desktop will touch it.",
  },
  {
    q: "What are the TRNS and SPL lines in an IIF file?",
    a: "They are the two halves of every transaction. The file opens with header rows (!TRNS, !SPL, !ENDTRNS) that declare the columns. Each transaction is then a TRNS line against your bank account, an SPL line carrying the opposite amount against your income or expense account, and an ENDTRNS marker. The pair always sums to zero — that is the double-entry rule IIF is built on.",
  },
  {
    q: "Why do the account names have to match exactly?",
    a: "Desktop matches account names as text, character for character. If a name in the file does not exist in your chart of accounts, Desktop typically offers to create it during import — which is how a typo becomes a duplicate account. Copy the names from your chart of accounts, and for a subaccount use the full path joined by a colon, such as Utilities:Electric.",
  },
  {
    q: "What if my CSV uses debit and credit columns instead of one amount column?",
    a: "Map both columns and leave the single Amount column unmapped. Debit rows (money out) become negative amounts and credit rows (money in) stay positive. A row that fills neither side is skipped and counted in the warnings so you can check it.",
  },
  {
    q: "Is this converter free, and is my data stored?",
    a: "Yes — the IIF download is fully free, with no account and no Pro plan required, for CSV files up to 10 MB. Your CSV is processed in memory to build the conversion and is not stored afterwards.",
  },
];

const HOWTO = [
  { title: "Export from your bank", body: "Download your transactions as a CSV from your bank's website — any export with date, description, and amount columns works." },
  { title: "Upload and check the mapping", body: "Drop the CSV in. The tool auto-detects the column mapping from your header row, and changing a dropdown re-reads the file right away." },
  { title: "Set your account names", body: "Enter your QuickBooks Desktop bank account, income account for deposits, and expense account for payments, exactly as named in your chart of accounts." },
  { title: "Download the IIF (free)", body: "Save the file — every transaction is written as a balanced TRNS/SPL pair under the !TRNS/!SPL header rows." },
  { title: "Back up, then import", body: "Back up your company file, then in QuickBooks Desktop go to File → Utilities → Import → IIF Files and choose the downloaded file." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function CsvToIifPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="CSV to IIF Converter"
      subtitle="Turn any bank transaction CSV into a QuickBooks Desktop IIF file: map your columns, set your account names, and download it free — no account needed."
      tool={<CsvToIif />}
      currentPath="/tools/csv-to-iif"
      faqs={FAQS}
      howToName="How to convert a CSV to IIF"
      howToSteps={HOWTO}
      privacyLine="Fully free, no account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>QuickBooks Desktop has no CSV bank import — IIF is the bridge</h2>
          <p className={P}>
            If your books live in QuickBooks Desktop, the friendly CSV upload you may have seen in
            QuickBooks Online simply is not there. Desktop never got a CSV bank import. What it has
            accepted for decades is IIF — Intuit Interchange Format — a plain-text, tab-delimited
            format built for moving lists and transactions in and out of a company file. When your
            bank hands you a CSV and Desktop is where the books live, an IIF file is the bridge
            between the two.
          </p>
          <p className={P}>
            The catch is that IIF is unforgiving to build by hand, and it is picky in ways a CSV
            never is. The file must open with header rows — !TRNS, !SPL and !ENDTRNS — that declare
            the columns in exactly the expected order. Every transaction needs two lines, not one:
            a TRNS line against the bank account and an SPL line carrying the opposite amount
            against an income or expense account, so each pair sums to zero. Dates must be written
            MM/DD/YYYY. And the account names are matched as text: they must be spelled exactly as
            they appear in your chart of accounts, or Desktop will offer to create new accounts
            you never wanted. One wrong character in a hundred-row file can spoil the whole run.
          </p>
          <p className={P}>
            This converter handles the format rules for you. It reads your bank&rsquo;s CSV, lets you
            check the column mapping, takes your own bank, income and expense account names, and
            writes a balanced IIF file you can download free. If some of your books live in
            QuickBooks Online instead, the same CSV belongs in the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>{" "}
            — IIF is a Desktop-only format, and Online does not import it.
          </p>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="Rows of a bank CSV export, each one ready to become a balanced transaction and split line pair in an IIF file" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">Each CSV row becomes a balanced pair of IIF lines — a TRNS line and its SPL offset.</figcaption>
          </figure>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Line</th>
                  <th className={TH}>Where it appears</th>
                  <th className={TH}>What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>!TRNS</strong></td><td className={TD}>Header, once</td><td className={TD}>Names the columns of every transaction line</td></tr>
                <tr><td className={TD}><strong>!SPL</strong></td><td className={TD}>Header, once</td><td className={TD}>Names the columns of every split (offset) line</td></tr>
                <tr><td className={TD}><strong>!ENDTRNS</strong></td><td className={TD}>Header, once</td><td className={TD}>Declares the marker that closes each transaction</td></tr>
                <tr><td className={TD}><strong>TRNS</strong></td><td className={TD}>Once per transaction</td><td className={TD}>The transaction itself: date, bank account, amount, payee — typed DEPOSIT or CHECK</td></tr>
                <tr><td className={TD}><strong>SPL</strong></td><td className={TD}>Once per transaction here</td><td className={TD}>The offsetting line, against the income or expense account</td></tr>
                <tr><td className={TD}><strong>ENDTRNS</strong></td><td className={TD}>Once per transaction</td><td className={TD}>Closes the block so the next transaction can begin</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert a CSV to IIF with this converter</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 1 — Export the CSV from your bank.</strong>{" "}
            Download the date range you need as CSV. Any export with a header row and date,
            description and amount columns works — Chase, Bank of America, Wells Fargo, Citi,
            Capital One and most regional banks and credit unions all export this shape. Keep the
            bank&rsquo;s original file untouched; opening it in a spreadsheet first invites quiet edits
            to dates and amounts.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 2 — Upload it and check the mapping.</strong>{" "}
            Drop the file into the tool above (CSV files up to 10 MB). The tool reads your header
            row and auto-detects the date, payee and amount columns. Map either one signed amount
            column (money out negative) or a debit and a credit column — never both. If a dropdown
            is wrong, change it and the file is re-read right away. Rows that cannot be read are
            skipped and counted in the warnings, never silently dropped.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 3 — Set your three account names.</strong>{" "}
            Type the bank account these transactions belong to, the income account deposits should
            post against, and the expense account payments should post against — exactly as they
            appear in your Desktop chart of accounts, including the full colon path for
            subaccounts (Utilities:Electric, not just Electric). The defaults are Business
            Checking, Uncategorized Income and Uncategorized Expense; replace them with your real
            names. Changing a name and leaving the field re-runs the conversion.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 4 — Review the preview, then download.</strong>{" "}
            The preview shows the parsed transactions — date, payee and signed amount — with the
            first 50 rows on screen and every row in the download. A positive amount becomes a
            DEPOSIT: bank line positive, offset line negative against your income account. A
            negative amount becomes a CHECK: bank line negative, offset line positive against
            your expense account. Each pair sums to zero by construction, because both lines are
            written from the same rounded amount. Download the .IIF — it is fully free.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 5 — Back up, then import into Desktop.</strong>{" "}
            In QuickBooks Desktop, first make a backup (File → Back Up Company) — IIF imports
            cannot be undone in one step, so the backup is your way back. Then go to File →
            Utilities → Import → IIF Files, choose the downloaded file, and review the register
            entries it creates against your chart of accounts.
          </p>
          <p className={P}>
            Working through a stack of monthly CSVs rather than one file? The{" "}
            <a href="/tools/bulk-import-quickbooks" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">Bulk Importer for QuickBooks</a>{" "}
            merges many CSV files, maps the columns once and builds a single import file — IIF
            included.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <caption className="pb-3 text-left font-semibold text-zinc-900 dark:text-white">A worked example: two CSV rows as IIF lines (tabs in the real file)</caption>
              <thead>
                <tr><th className={TH}>Line</th><th className={TH}>Date</th><th className={TH}>Account</th><th className={TH}>Amount</th><th className={TH}>Payee / memo</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>TRNS</strong></td><td className={TD}>01/15/2026</td><td className={TD}>Checking</td><td className={TD}>1,000.00</td><td className={TD}>Acme Consulting — invoice 88</td></tr>
                <tr><td className={TD}><strong>SPL</strong></td><td className={TD}>01/15/2026</td><td className={TD}>Sales Income</td><td className={TD}>-1,000.00</td><td className={TD}>Acme Consulting — invoice 88</td></tr>
                <tr><td className={TD}><strong>ENDTRNS</strong></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td></tr>
                <tr><td className={TD}><strong>TRNS</strong></td><td className={TD}>01/20/2026</td><td className={TD}>Checking</td><td className={TD}>-250.50</td><td className={TD}>Riverbend Properties</td></tr>
                <tr><td className={TD}><strong>SPL</strong></td><td className={TD}>01/20/2026</td><td className={TD}>Rent Expense</td><td className={TD}>250.50</td><td className={TD}>Riverbend Properties</td></tr>
                <tr><td className={TD}><strong>ENDTRNS</strong></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Read the pairs: +1,000.00 and −1,000.00 sum to zero; −250.50 and +250.50 sum to zero.
            The bank account ends up $749.50 richer, income records the sale, and rent records the
            cost. (Sample data, shown for illustration.)
          </p>

          <h2 className={H2M}>When an IIF import goes wrong</h2>
          <h3 className={H3}>QuickBooks created accounts you did not want</h3>
          <p className={P}>
            The most common IIF accident. Desktop cannot find an account name from the file, offers
            to create it, and one accepted prompt for a typo later your chart of accounts has a
            near-duplicate that transactions scatter across. Cancel the import, correct the names
            here to match your chart exactly — subaccounts with their full colon path — and convert
            again. This is the mistake the backup exists for.
          </p>
          <h3 className={H3}>The entry is not balanced</h3>
          <p className={P}>
            The signature failure of hand-edited files: a TRNS and SPL that differ by a cent, or a
            split line deleted to &ldquo;simplify&rdquo; the file. Desktop may reject the block or post the
            difference somewhere unhelpful. Files from this converter are built as mirrored pairs
            from one rounded amount, so if you see this error, the file was changed after download
            — convert a fresh copy and import that.
          </p>
          <h3 className={H3}>Excel destroyed the file</h3>
          <p className={P}>
            IIF lives and dies by its tabs. Open the file in Excel and dates get reformatted,
            long numbers can be restyled, and saving replaces the tab delimiters with commas or
            spaces. The result looks similar and imports terribly. If you need to look inside an
            IIF file, use a plain text editor — count the ENDTRNS lines to check the transaction
            count — and never re-save from Excel a file you plan to import. To audit a Desktop
            export in a spreadsheet safely, go the other direction with the{" "}
            <a href="/tools/iif-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">IIF to Excel converter</a>.
          </p>
          <h3 className={H3}>Transactions land in the wrong month — or land twice</h3>
          <p className={P}>
            IIF dates must be MM/DD/YYYY; a day-first file does not error, it files April
            transactions in March. This converter always writes month-first. The second trap is
            the opposite of the QBO route: an IIF file carries no transaction IDs, so Desktop has
            no duplicate check — import the same file twice and you own two of everything. Keep
            the downloaded file with the backup you made, so any imported batch can be traced to
            exactly one CSV.
          </p>

          <h2 className={H2M}>Three routes into QuickBooks Desktop, honestly compared</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Route</th>
                  <th className={TH}>Where it shines</th>
                  <th className={TH}>Where it breaks</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Convert the CSV to IIF (this page)</strong></td><td className={TD}>Posts straight into the accounts you name; fully free; the file is readable text you can check before importing</td><td className={TD}>No duplicate protection — re-importing doubles entries; one income and one expense offset account for the whole file, so you categorize in Desktop afterwards</td></tr>
                <tr><td className={TD}><strong>Convert the CSV to QBO and use Web Connect</strong></td><td className={TD}>Imports through the bank-feed door, with a unique ID per transaction, so a re-import is recognized</td><td className={TD}>The .QBO download is on Pro on that page; transactions land in the bank feed for review rather than posting directly to named accounts</td></tr>
                <tr><td className={TD}><strong>Type the transactions in by hand</strong></td><td className={TD}>Nothing to convert; fine for two or three missing entries</td><td className={TD}>Every row is a chance to transpose a digit or pick the wrong account — and there is no file left to audit afterwards</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Already have Desktop data in IIF form and need it back out? The{" "}
            <a href="/tools/iif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">IIF to CSV converter</a>{" "}
            turns a Desktop export back into a plain spreadsheet you can review anywhere.
          </p>
        </>
      }
    />
  );
}
