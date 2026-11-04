import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { InvoiceChecker } from "@/components/tools/InvoiceChecker";

const PAGE_URL = "https://www.convertstatement.online/tools/invoice-import-checker";

export const metadata: Metadata = {
  title: "Invoice Import Checker — Validate & Format Invoices for QuickBooks | Convert Statement",
  description:
    "Free invoice import validator and formatter: check an invoice CSV row by row before QuickBooks Online sees it, fix date and amount formatting automatically, catch missing customers and duplicate invoice numbers, and download a QuickBooks-ready CSV. No account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Invoice Import Checker — Validate Invoices for QuickBooks",
    description:
      "Upload an invoice CSV, see every error and automatic fix row by row, and download a cleaned CSV in the layout QuickBooks Online invoice import accepts. Free, no account.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What does the invoice import checker validate?",
    a: "Every row is checked for what QuickBooks Online invoice import needs: a customer name, a readable invoice date, a product or service item, and a positive amount. It also flags duplicate invoice numbers and amounts, quantities, or rates it cannot read — before any of them can fail inside QuickBooks.",
  },
  {
    q: "What fixes does it apply automatically?",
    a: "Three safe fixes. Dates are reformatted to MM/DD/YYYY, as QuickBooks expects. Currency symbols and thousands separators are cleaned out of amounts, turning $1,200.00 into 1200.00. When an amount is missing but quantity and rate are present, it is calculated from quantity × rate. Each fix is marked on its row.",
  },
  {
    q: "Which columns does my invoice CSV need?",
    a: "At minimum, a customer column and an invoice date column. The checker recognizes common header names — Customer, Customer Name, Client, Invoice Date, Txn Date — and also picks up invoice number, due date, item, quantity, rate, and amount columns when they are present. Missing essentials are reported, not guessed.",
  },
  {
    q: "What happens to rows with errors?",
    a: "They stay visible in the report with the error written on the row, and they are left out of the downloaded QuickBooks-ready CSV. One bad row cannot stall the import: the clean rows go in now, and you fix the flagged rows in your source file and import them later.",
  },
  {
    q: "What format is the downloaded CSV in?",
    a: "The download uses the column layout QuickBooks Online invoice import accepts: InvoiceNo, Customer, InvoiceDate, DueDate, ItemName, ItemQuantity, ItemRate, and ItemAmount, with all dates in MM/DD/YYYY. Map those columns on the QuickBooks import screen and the rows import as single-line invoices.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the report and the cleaned download, and it is not stored afterwards — the report and the fixed CSV exist only in your browser session and your download. We never sell or share your financial data.",
  },
  {
    q: "My dates are in ISO format, like 2026-01-15. Do I need to fix them first?",
    a: "No. Any readable date that is not already in MM/DD/YYYY is reformatted automatically, and the change is shown on the row as a fix. Mixed formats in one file are fine — each date is converted on its own. Only a date the checker cannot read becomes an error.",
  },
  {
    q: "What if the same invoice number appears twice in my file?",
    a: "The first use is treated as the original. The second row is flagged as a duplicate, with the line where the number first appeared, and it is held out of the download — QuickBooks would reject it or create an invoice with the same number, so it never imports silently.",
  },
  {
    q: "Can the checker calculate a missing invoice amount?",
    a: "Yes, when the row has both a quantity and a rate: the amount is calculated as quantity × rate and marked as a fix, so the row can import. If quantity or rate is missing or unreadable, nothing can be calculated safely, and the row is flagged as an error.",
  },
  {
    q: "Does every row need a product or service item?",
    a: "Yes — QuickBooks attaches every invoice line to a product or service, so a row with no item is flagged as an error. If your export names the column Description or Product/Service instead of Item, the checker still finds it; only a genuinely blank item holds the row back.",
  },
];

const HOWTO = [
  { title: "Export your invoices", body: "Save your invoice list as a CSV from your spreadsheet or billing tool — it needs at least a customer column and an invoice date column." },
  { title: "Upload it here", body: "Drop the CSV in. Every row is checked against what QuickBooks Online invoice import needs." },
  { title: "Review errors and fixes", body: "Read the row-by-row table: errors in red need your attention, fixes in amber were already applied for you." },
  { title: "Download and import", body: "Download the QuickBooks-ready CSV — clean rows only — and import it through QuickBooks Online's invoice import." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function InvoiceImportCheckerPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="Invoice Import Validator + Formatter"
      subtitle="Check an invoice CSV before QuickBooks does: catch missing customers, duplicate invoice numbers and bad amounts, fix dates and formatting automatically, and download a clean file ready to import."
      tool={<InvoiceChecker />}
      currentPath="/tools/invoice-import-checker"
      faqs={FAQS}
      howToName="How to validate invoices for QuickBooks import"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why invoice imports fail at the worst moment</h2>
          <p className={P}>
            QuickBooks Online only checks an invoice file at the moment you import it — and one
            bad row can stall the whole batch while a month-end close is waiting on it. A date in
            ISO format, an amount typed as $1,250.00, a blank customer, or the same invoice
            number used twice are all easy to miss in a spreadsheet and painful to untangle
            inside QuickBooks afterwards, where a half-imported batch means some customers were
            billed twice and others not at all.
          </p>
          <p className={P}>
            This checker moves that review earlier. You upload the file here first, and every
            row is checked against what the QuickBooks importer actually requires — with the
            safe fixes already applied and shown on the row. What downloads is a file that has
            already passed the tests the importer would have run, so the import itself becomes
            the boring part.
          </p>

          <h2 className={H2M}>The QuickBooks Online invoice import specification</h2>
          <p className={P}>
            QuickBooks Online's invoice import expects one row per invoice line, in a fixed
            column layout. Dates must be in MM/DD/YYYY — the single most common reason a
            clean-looking file is refused. The columns the downloaded file uses, and what each
            one must hold:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Column</th>
                  <th className={TH}>What it holds</th>
                  <th className={TH}>The rule</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>InvoiceNo</strong></td><td className={TD}>Invoice number</td><td className={TD}>Must be unique within the file; a repeat is flagged as a duplicate.</td></tr>
                <tr><td className={TD}><strong>Customer</strong></td><td className={TD}>Customer name</td><td className={TD}>Required. A blank customer is an error, never a fix.</td></tr>
                <tr><td className={TD}><strong>InvoiceDate</strong></td><td className={TD}>Invoice date</td><td className={TD}>Must read MM/DD/YYYY in the final file.</td></tr>
                <tr><td className={TD}><strong>DueDate</strong></td><td className={TD}>Payment due date</td><td className={TD}>Optional; carried through when your file has one.</td></tr>
                <tr><td className={TD}><strong>ItemName</strong></td><td className={TD}>Product or service</td><td className={TD}>Required per line — QuickBooks bills against items, not free text.</td></tr>
                <tr><td className={TD}><strong>ItemQuantity</strong></td><td className={TD}>Quantity billed</td><td className={TD}>Must be numeric when present.</td></tr>
                <tr><td className={TD}><strong>ItemRate</strong></td><td className={TD}>Price per unit</td><td className={TD}>Must be numeric when present.</td></tr>
                <tr><td className={TD}><strong>ItemAmount</strong></td><td className={TD}>Line total</td><td className={TD}>Must be positive; calculated from quantity × rate when missing.</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Two details of the specification trip people up. First, one row is one line: an
            invoice with three services on it is three rows sharing the same InvoiceNo,
            Customer, and dates — QuickBooks groups them back into a single invoice on import.
            Second, the importer reads the columns by the mapping you confirm on its screen, so
            the header names in your source file can vary; what cannot vary is the content —
            a real customer, a real date, a real item, and a positive amount on every row.
          </p>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="A spreadsheet of invoice rows with customers, dates and amounts being checked before a QuickBooks import" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">Invoice rows in a spreadsheet, mid-check.</figcaption>
          </figure>

          <h2 className={H2M}>What the checker enforces, row by row</h2>
          <p className={P}>
            Every row gets one of three verdicts — clean, fixed, or error — and the report shows
            which verdict it earned and why:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Check</th>
                  <th className={TH}>What triggers it</th>
                  <th className={TH}>Verdict</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Missing customer</strong></td><td className={TD}>The customer cell is blank</td><td className={TD}>Error — row held out of the download</td></tr>
                <tr><td className={TD}><strong>Duplicate invoice number</strong></td><td className={TD}>Same InvoiceNo as an earlier row</td><td className={TD}>Error — first use kept, repeat flagged</td></tr>
                <tr><td className={TD}><strong>Unreadable date</strong></td><td className={TD}>The date cell cannot be parsed at all</td><td className={TD}>Error</td></tr>
                <tr><td className={TD}><strong>Date in the wrong format</strong></td><td className={TD}>ISO or another readable format</td><td className={TD}>Auto-fix — rewritten as MM/DD/YYYY</td></tr>
                <tr><td className={TD}><strong>Formatted amount</strong></td><td className={TD}>$ signs, commas, or spaces in the amount</td><td className={TD}>Auto-fix — cleaned to a plain number</td></tr>
                <tr><td className={TD}><strong>Missing amount</strong></td><td className={TD}>Amount blank, quantity and rate present</td><td className={TD}>Auto-fix — calculated as quantity × rate</td></tr>
                <tr><td className={TD}><strong>Negative or zero amount</strong></td><td className={TD}>Amount is zero or below</td><td className={TD}>Error — invoice lines must be positive</td></tr>
                <tr><td className={TD}><strong>Non-numeric quantity or rate</strong></td><td className={TD}>Text where a number belongs</td><td className={TD}>Error</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>Preparing your invoice CSV</h2>
          <p className={P}>
            The checker is forgiving about headers — Customer, Customer Name, and Client are all
            recognized, as are Invoice Date and Txn Date — but a few habits make every file pass
            the first time. Keep one row per invoice line rather than one row per invoice with
            the lines crammed into a notes field. Keep customer names spelled exactly the way
            they appear in QuickBooks; a new spelling creates a new customer there. Make sure
            the amount column holds the line total, not a running balance of the whole file.
            And if your billing tool exports tax as separate columns, leave them out of this
            file — the import maps the eight columns above, and the cleaned download carries
            exactly the layout it expects.
          </p>
          <p className={P}>
            One more habit pays off later: export from your billing tool monthly, while the
            invoices are still familiar. A file checked in the same week it was created takes
            minutes to repair, because the person who raised the invoices still remembers the
            odd customer name and the one-off discount. The same file checked six months
            later, at year-end, turns every flagged row into a small research project — the
            checker still finds the problems, but only you can answer them.
          </p>

          <h2 className={H2M}>A worked example: three rows, three outcomes</h2>
          <p className={P}>
            A three-line extract from a sample export shows how the verdicts land (sample data,
            shown for illustration):
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>InvoiceNo</th><th className={TH}>Customer</th><th className={TH}>InvoiceDate</th><th className={TH}>Amount</th><th className={TH}>Result</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>1041</td><td className={TD}>Bluepeak Studio</td><td className={TD}>01/05/2026</td><td className={TD}>850.00</td><td className={TD}>Clean — imports as-is</td></tr>
                <tr><td className={TD}>1042</td><td className={TD}>Harbor Dental</td><td className={TD}>2026-01-07</td><td className={TD}>$1,200.00</td><td className={TD}>Fixed — date rewritten to 01/07/2026, amount cleaned to 1200.00</td></tr>
                <tr><td className={TD}>1043</td><td className={TD}>(blank)</td><td className={TD}>01/09/2026</td><td className={TD}>300.00</td><td className={TD}>Error — no customer; held out of the download</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Two of the three rows download in the cleaned file. The third is not lost — it stays
            in the report with its error, ready to be corrected in the source spreadsheet and
            run through again. Nothing is silently dropped and nothing is silently changed:
            every fix is listed on the row it touched.
          </p>

          <h2 className={H2M}>Importing the cleaned file into QuickBooks Online</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li>In QuickBooks Online, open <strong className="text-zinc-900 dark:text-white">Settings → Import data</strong> and choose <strong className="text-zinc-900 dark:text-white">Invoices</strong>.</li>
            <li>Upload the cleaned CSV you downloaded from this page.</li>
            <li>Match each QuickBooks field to the column it names — the layout already follows the importer's own column names, so the mapping is one-to-one.</li>
            <li>Review the preview, import, and spot-check two or three invoices against your source file.</li>
          </ol>
          <p className={P}>
            Imported invoices arrive as single-line invoices, ready to send or to reconcile
            against payments when they land. Keep the source file and the report together — if
            a customer questions an invoice later, the report shows exactly what was imported
            and what was fixed on the way in.
          </p>

          <h2 className={H2M}>When the import still goes wrong</h2>
          <h3 className={H3}>The same invoices appear twice</h3>
          <p className={P}>
            Unlike bank feeds, the invoice import does no duplicate detection of its own —
            importing the same cleaned file twice creates a second set of invoices. Import
            once, and if a batch must be redone, delete or void the first set in QuickBooks
            before importing again. When the importer itself reports an error, the{" "}
            <a href="/tools/qbo-import-errors" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO import-error decoder</a>{" "}
            explains what the message means.
          </p>
          <h3 className={H3}>A customer shows up twice in QuickBooks</h3>
          <p className={P}>
            The name in the file did not match the name on the existing customer record —
            "Harbor Dental" versus "Harbor Dental LLC" is enough. Standardize customer names in
            your source file before importing (this checker reports exactly the names it
            found; it never merges them silently), and merge the duplicate customers inside
            QuickBooks afterwards.
          </p>
          <h3 className={H3}>QuickBooks rejects an invoice number it already has</h3>
          <p className={P}>
            If an invoice number in the file already exists in QuickBooks from an earlier
            import or a manual entry, QuickBooks will not overwrite it. The checker catches
            duplicates inside your file; duplicates against QuickBooks' own history only it
            can see. Renumber in the source file, or enter those few invoices by hand and
            import the rest.
          </p>
          <h3 className={H3}>An item in the file does not exist in QuickBooks</h3>
          <p className={P}>
            QuickBooks bills against its own product and service list. Depending on your
            import settings, an unknown ItemName is either rejected or created on the fly —
            and a slightly different spelling ("Consulting" versus "Consulting Services")
            creates a near-duplicate item that splits your sales reporting. Keep item names
            in the source file identical to the names in QuickBooks, and tidy the item list
            there after any large import.
          </p>
          <h3 className={H3}>Totals look different after import</h3>
          <p className={P}>
            The import treats ItemAmount as the line amount. If your export carried tax inside
            that amount, or split a line's value oddly across columns, the totals shift. Keep
            tax out of the eight import columns, let each row's amount be the full line total,
            and let QuickBooks apply its own tax settings on top.
          </p>

          <h2 className={H2M}>Fixing the rows that were left out</h2>
          <p className={P}>
            The rows held back are the real work list, and they are usually quick: a missing
            customer is a lookup in your billing system, a duplicate number is a renumber, an
            unreadable date is a typo. Fix them in the source file — not in QuickBooks, and not
            in the cleaned download — so the next export starts from corrected data. Then run
            just those rows through the checker again and import the small follow-up file. Your
            source data gets cleaner every cycle, which is the quiet benefit of checking before
            importing instead of repairing afterwards.
          </p>

          <h2 className={H2M}>Importing invoices every month? Make it a system</h2>
          <p className={P}>
            A monthly billing run deserves the same treatment as a monthly bank feed. This
            checker is completely free with no account, and it stays that way — but the work
            around it is where an account earns its keep: a free account keeps your statement
            conversions in one searchable history, the dashboard adds bulk conversion when a
            whole month of statements lands at once, and client portals let bookkeepers collect
            files from clients through their own upload links. Pair this page with the{" "}
            <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>{" "}
            for the bank side of the same month-end, and the whole close — invoices in, bank
            activity in, both verified first — runs the same way every time.
          </p>
        </>
      }
    />
  );
}
