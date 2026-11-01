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
    a: "Upload your bank's CSV export, check the mapping (date, payee, and an amount or debit/credit pair), and set your bank, income, and expense account names to match your chart of accounts. Download the IIF and import it in QuickBooks Desktop via File → Utilities → Import → IIF Files.",
  },
  {
    q: "Should I back up my company file before importing an IIF?",
    a: "Yes. Make a backup first (File, then Back Up Company in QuickBooks Desktop). IIF imports cannot be undone in one step, so a backup is the standard way to protect your books before any import. If anything looks wrong after importing, you can restore the backup and try again.",
  },
  {
    q: "How are deposits and payments handled in the IIF file?",
    a: "A positive amount becomes a DEPOSIT — bank line positive, offset line negative against your income account. A negative amount becomes a CHECK — bank line negative, offset line positive against your expense account. Each pair sums to zero, which is the double-entry convention IIF expects.",
  },
  {
    q: "What if my CSV uses debit and credit columns instead of one amount column?",
    a: "Map both columns. Debit rows (money out) become negative amounts and credit rows (money in) stay positive. A row that fills neither side is skipped and counted in the warnings so you can check it.",
  },
  {
    q: "What happens if an account name does not exist in QuickBooks Desktop?",
    a: "Type account names exactly as they appear in your chart of accounts, including spelling. If a name does not exist yet, QuickBooks Desktop will typically ask whether to create it during import. Checking the names here first avoids creating duplicate or misspelled accounts in your books.",
  },
  {
    q: "Why must every IIF entry sum to zero?",
    a: "IIF is double-entry: each TRNS line needs an SPL line so books stay balanced. A $1,000 deposit adds $1,000 to the bank account and removes $1,000 from income. If a pair does not sum to zero, QuickBooks Desktop can reject or mispost it.",
  },
  {
    q: "Can I edit the IIF file in Excel before importing?",
    a: "Risky — IIF files are tab-delimited text, and Excel can reformat dates, strip leading characters, and save with the wrong delimiter, all of which break the import. If you must inspect it, open a copy in a text editor — and never re-save it from Excel.",
  },
  {
    q: "Which date format does IIF require?",
    a: "MM/DD/YYYY — month first, then day, then a four-digit year. This converter writes dates in that format automatically from your CSV. It matters because a day-first file does not error politely: 03/04/2026 silently becomes March 4 instead of April 3, and the transaction lands in the wrong month.",
  },
  {
    q: "Does IIF work with QuickBooks Online?",
    a: "No. IIF is a QuickBooks Desktop format; QuickBooks Online does not import IIF files. If your books live in QuickBooks Online, convert the same CSV with the CSV to QBO converter instead and import the result through the bank feed — the workflow is the same, only the file changes.",
  },
  {
    q: "Is this tool really free, and is my data stored?",
    a: "Yes — the IIF download is fully free, with no account and no Pro plan required. Your CSV is processed in memory to build the conversion and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Export from your bank", body: "Download your transactions as a CSV from your bank's website — any export with date, description, and amount columns works." },
  { title: "Upload and map columns", body: "Drop the CSV in. The tool auto-detects the column mapping from your header row, and you can correct any column here." },
  { title: "Set your account names", body: "Enter your QuickBooks Desktop bank account, income account for deposits, and expense account for payments, exactly as named in your chart of accounts." },
  { title: "Download and import", body: "Download the free IIF file, back up your company file, then import it in QuickBooks Desktop from File, then Utilities, then Import, then IIF Files." },
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
          <h2 className={H2}>Why QuickBooks Desktop still runs on IIF</h2>
          <p className={P}>
            QuickBooks Desktop never learned the friendly CSV import that QuickBooks Online
            has. For Desktop, the long-standing way to move data in and out without retyping
            it is IIF — Intuit Interchange Format — a plain-text format Desktop has accepted
            for decades. If your bank gives you a CSV and your books live in Desktop, an IIF
            file is the bridge between them.
          </p>
          <p className={P}>
            The catch is that IIF is unforgiving to build by hand. The header block has to
            name the columns in exactly the expected order. The file must be tab-delimited,
            not comma-delimited. Dates must be written month/day/year. And every transaction
            needs a second, offsetting line, or the entry does not balance and the import
            misposts. One wrong character in a hundred-row file can spoil the whole run.
            This converter takes your bank's CSV and produces a file that observes every one
            of those rules — free, with your own account names baked in.
          </p>

          <h2 className={H2M}>What an IIF file actually is</h2>
          <p className={P}>
            An IIF file is a tab-delimited text file built from two kinds of lines. It opens
            with three header rows whose names start with an exclamation mark; those rows
            declare the columns for everything that follows. After the headers, each
            transaction is a small block: a TRNS line, one or more SPL lines, and an ENDTRNS
            line to close it. The whole file for a month of banking is just those blocks
            repeated:
          </p>
          <div className="mt-4 overflow-x-auto">
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
                <tr><td className={TD}><strong>TRNS</strong></td><td className={TD}>Once per transaction</td><td className={TD}>The transaction itself: date, bank account, amount, payee</td></tr>
                <tr><td className={TD}><strong>SPL</strong></td><td className={TD}>Once per transaction here</td><td className={TD}>The offsetting line, against the income or expense account</td></tr>
                <tr><td className={TD}><strong>ENDTRNS</strong></td><td className={TD}>Once per transaction</td><td className={TD}>Closes the block so the next transaction can begin</td></tr>
              </tbody>
            </table>
          </div>
          <figure className="mt-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="Rows of a bank CSV export, each one ready to become a balanced transaction and split line pair in an IIF file" className="w-full rounded-[20px] border border-[#E3EDE0]" loading="lazy" />
            <figcaption className="mt-2 text-center text-xs text-zinc-400">Illustration: each CSV row becomes a balanced pair of IIF lines.</figcaption>
          </figure>

          <h2 className={H2M}>The one rule IIF never forgives: every entry must balance</h2>
          <p className={P}>
            IIF is double-entry bookkeeping in text form. The TRNS line moves money in the
            bank account; the SPL line must move exactly the same amount in the opposite
            direction against another account. Add the two lines together and they must sum
            to zero — always, for every transaction, to the cent. A deposit of $1,000.00 is
            +$1,000.00 on the bank line and −$1,000.00 on the split line against your income
            account. A check for $250.50 is −$250.50 on the bank line and +$250.50 against
            your expense account. When a hand-built file breaks this rule — a rounding
            difference, a split typed from memory — Desktop can refuse the entry or post it
            somewhere you did not intend, and the imbalance surfaces later as a register that
            will not reconcile. This converter constructs each pair from the same amount, so
            a pair cannot drift apart: whatever the TRNS line says, the SPL line is its exact
            mirror.
          </p>
          <p className={P}>
            "To the cent" is not a figure of speech. An amount like $33.335 cannot exist in
            the file — every value is rounded to two decimals before the pair is written, and
            both lines take the same rounded value, so rounding can never open a gap between
            them. If your CSV carries amounts with more precision, the rounding happens once,
            visibly, in the converted file you can review — not silently inside QuickBooks
            during the import.
          </p>

          <h2 className={H2M}>How to convert and import, step by step</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li><strong className="text-zinc-900 dark:text-white">Export from your bank.</strong> Download your transactions as CSV — any export with date, description, and amount columns works.</li>
            <li><strong className="text-zinc-900 dark:text-white">Upload and map.</strong> Drop the CSV in; the mapping is auto-detected from your headers, and you can correct any column.</li>
            <li><strong className="text-zinc-900 dark:text-white">Set your account names.</strong> Enter the bank, income, and expense accounts exactly as they appear in your Desktop chart of accounts.</li>
            <li><strong className="text-zinc-900 dark:text-white">Back up the company file.</strong> In Desktop: File → Back Up Company. IIF imports cannot be undone in one step; the backup is your way back.</li>
            <li><strong className="text-zinc-900 dark:text-white">Import the IIF.</strong> File → Utilities → Import → IIF Files, choose the file you downloaded, and review the register entries it creates.</li>
          </ol>

          <h2 className={H2M}>Getting the inputs right</h2>
          <p className={P}>
            Three inputs decide whether the import is boring — and boring is what you want.
            First, account names: they are matched as text, character for character, so copy
            them from your chart of accounts rather than typing from memory; a near-miss name
            is how duplicate accounts are born. Second, dates: the converter reads your CSV's
            dates and writes them as MM/DD/YYYY, the only order IIF should carry, so an
            export from a day-first country cannot smuggle April 3 in as March 4. Third, the
            CSV itself: keep the bank's original file untouched. Opening it in a spreadsheet
            first invites quiet edits — reformatted dates, amounts turned into text — that
            make any converter's job harder. Upload the file the bank gave you.
          </p>
          <p className={P}>
            One more naming case worth knowing: subaccounts. If the account you want lives
            under a parent in your chart of accounts — Electric under Utilities, for example —
            IIF expects the full path joined by a colon: "Utilities:Electric". Type just
            "Electric" and Desktop will look for a top-level account by that name, fail to
            find it, and offer to create one. The converter passes through whatever you type,
            so give it the full path for any account that has a parent.
          </p>

          <h2 className={H2M}>A worked example: two entries as IIF lines</h2>
          <p className={P}>
            Below are the first two transactions of a sample file, shown field by field: a
            $1,000.00 deposit posted to Sales Income, and a $250.50 check posted to Rent
            Expense. In the real file these lines are separated by tabs, not columns:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
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
            Read the pairs: +1,000.00 and −1,000.00 sum to zero; −250.50 and +250.50 sum to
            zero. The bank account ends up $749.50 richer, income records the $1,000.00 sale,
            and rent records the $250.50 cost — a complete, balanced piece of bookkeeping from
            two CSV rows. (Sample data, shown for illustration.)
          </p>

          <h2 className={H2M}>When an IIF import goes wrong</h2>
          <h3 className={H3}>The entry is not balanced</h3>
          <p className={P}>
            The signature failure of hand-edited files: a TRNS and SPL that differ by a cent,
            or a split line deleted to "simplify" the file. Desktop may reject the block or
            post the difference somewhere unhelpful. Files from this converter are built as
            mirrored pairs, so if you see this error, the file was changed after download —
            convert a fresh copy and import that.
          </p>
          <h3 className={H3}>Excel destroyed the file</h3>
          <p className={P}>
            IIF lives and dies by its tabs. Open the file in Excel and three things quietly
            happen: dates get reformatted into whatever the spreadsheet prefers, long numbers
            can be restyled, and saving replaces the tab delimiters with commas or spaces. The
            result looks similar and imports terribly. If you need to look inside an IIF file,
            use a plain text editor — and never re-save from Excel a file you plan to import.
          </p>
          <h3 className={H3}>Transactions land in the wrong month</h3>
          <p className={P}>
            IIF dates must be MM/DD/YYYY. A file written day-first does not produce an error —
            it produces April transactions filed in March, discovered weeks later when the
            register will not reconcile. This converter always writes month-first, and the
            worked example above shows the exact format every date in your file will carry.
          </p>
          <h3 className={H3}>QuickBooks created accounts you did not want</h3>
          <p className={P}>
            When Desktop cannot find an account name from the file, it offers to create it.
            Accept that prompt for a typo and your chart of accounts grows a near-duplicate
            that transactions then scatter across. Cancel the import, correct the names here
            to match your chart exactly, and convert again — this is the mistake the backup
            exists for.
          </p>

          <h2 className={H2M}>The two-minute review before you import</h2>
          <p className={P}>
            IIF gives you a rare gift: the file is readable before it touches your books.
            Open the download in a text editor and run three checks. Count the ENDTRNS lines —
            that is your transaction count, and it should match the CSV you started with.
            Spot-check the first pair and confirm the two amounts mirror each other. Read the
            account names once against your chart of accounts. Two minutes, and the import
            holds no surprises. If your workflow also involves QBO files, the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            gives those files the same kind of pre-import review.
          </p>
          <p className={P}>
            Keep the reviewed download together with the backup you made of the company file.
            If a question ever arises about an imported batch — which CSV it came from, which
            account names were used — the pair answers it completely: the backup shows the
            books before, and the IIF shows exactly what was added.
          </p>

          <h2 className={H2M}>Converting every month? Make it a system</h2>
          <p className={P}>
            Desktop bookkeeping tends to be a monthly ritual: bank export in, IIF across,
            reconcile. When that ritual repeats, a free account keeps every CSV you converted
            and every IIF you produced in one searchable history — the file behind a question
            from two quarters ago is findable in seconds. The dashboard adds bulk conversion
            when a client sends a stack of statement PDFs at once, and client portals let
            clients upload through their own link instead of emailing attachments. Downloads
            on this page stay fully free either way; the account simply keeps the trail.
          </p>
          <p className={P}>
            Using QuickBooks Online for some clients instead? The same CSV goes through the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>{" "}
            to become a Web Connect file — one source export, both destinations covered.
          </p>
        </>
      }
    />
  );
}
