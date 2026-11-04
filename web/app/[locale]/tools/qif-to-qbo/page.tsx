import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qif-to-qbo";

export const metadata: Metadata = {
  title: "QIF to QBO Converter — Free | Convert Statement",
  description: "Bring legacy Quicken QIF data forward into QuickBooks as a QBO Web Connect file — rescuing transactions modern Quicken left behind. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QIF to QBO Converter — Free",
    description: "Upload a QIF file and download it as QBO — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "QIF has no bank ID — what bank identity does the QBO actually get?",
    a: "Part placeholder, part absence, stated plainly. The builder writes the standard placeholder account ID 0000000000 and the placeholder bank ID 000000000 that the Web Connect structure requires, and it generates a unique transaction ID (FITID) for every transaction from its date, payee and amount. But it does not invent an INTU.BID — the file contains no financial-institution block at all, because your QIF never named a bank. If QuickBooks answers with an unable-to-verify-financial-institution message, that missing block is why.",
  },
  {
    q: "Will importing the same converted file twice create duplicates?",
    a: "QuickBooks should refuse the second import of the same file: because the QIF supplied no transaction IDs, the converter generates deterministic ones from each transaction's date, payee, amount and position, so converting the same QIF again produces the same IDs and QuickBooks recognises them. That protection covers re-importing an identical file — it cannot spot a genuinely repeated transaction that appears in two different QIF files.",
  },
  {
    q: "What from my QIF does not make it into the QBO?",
    a: "Categories and splits. The QIF reader keeps each record's date (D), amount (T), payee (P), memo (M) and check number (N) fields; the category line (L), cleared status and any split lines are ignored, and of the fields kept, the check number has no home in the QBO output. What imports is an uncategorised bank-feed transaction list — you categorise inside QuickBooks, where your chart of accounts lives.",
  },
  {
    q: "My QIF uses two-digit years. Is that a problem?",
    a: "Yes — check your dates before anything else. This converter reads a two-digit year as a 2000s year, so a genuinely old export written as 03/14/98 comes out dated 2098, not 1998. Four-digit-year files (including the MM/DD'YYYY form with an apostrophe) convert correctly. If your history is two-digit, convert a small file first, check the dates in the result, and fix the years in the QIF text before converting the full history.",
  },
  {
    q: "Can I convert an investment QIF?",
    a: "No. The converter supports Bank, Cash and credit-card (CCard) QIF files. An investment QIF — marked !Type:Invst — is refused with a message saying so, because investment positions and lots are not bank transactions and would be wrong as a QuickBooks bank feed. Export the account's cash or banking activity as a Bank QIF instead.",
  },
  {
    q: "Is this converter really free, and is my file stored?",
    a: "Yes — fully free with no account, for files up to 10 MB. Your file is processed in memory to build the QBO and is never stored, and we never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Find or export the QIF", body: "Use the .qif file you already have, or export a Bank, CCard or Cash QIF from the old Quicken or app that holds the history. Investment QIF files are not supported." },
  { title: "Check the years before you convert years", body: "Open the file as text and look at the D lines: four-digit years convert as written, but two-digit years are read as 2000s years — a 1998 record becomes 2098. Fix two-digit years in the text first if your export uses them." },
  { title: "Upload and convert to QBO", body: "Drop the .qif into the converter above and press Convert to QBO. Each kept record becomes a Web Connect transaction with a generated transaction ID; the file uses a placeholder account ID because QIF names no account." },
  { title: "Import into QuickBooks and categorise there", body: "In QuickBooks Online use Accounting, then Bank transactions, then Upload from file; in Desktop use File, then Utilities, then Import, then Web Connect Files. Expect uncategorised transactions — categories and splits do not survive QIF — and review the period totals against the old records." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QifToQboPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QIF to QBO Converter"
      subtitle="Bring legacy Quicken QIF data forward into QuickBooks as a QBO Web Connect file — rescuing transactions modern Quicken left behind. Fully free with no account."
      tool={<FormatConverter tool="qif-to-qbo" fromLabel="QIF" toLabel="QBO" accept=".qif" outputExt="qbo" />}
      currentPath="/tools/qif-to-qbo"
      faqs={FAQS}
      howToName="How to convert QIF to QBO"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Migrating years of legacy Quicken data into QuickBooks</h2>
          <p className={P}>
            Somewhere in most long-running small businesses there is a QIF file holding the early years: the first bank account, transactions from a Quicken era that ended when Intuit discontinued QIF imports in favour of QFX in the mid-2000s. The business now keeps its books in QuickBooks, but QuickBooks has never imported QIF — it takes QBO Web Connect files. So the early history sits stranded in a format neither the old door nor the new one will open, and it usually surfaces at the worst moment: a loan application asking for a longer record, a tax question reaching back, a migration that is supposed to move everything.
          </p>
          <p className={P}>
            This converter builds the missing bridge. It reads the QIF records and writes a QBO — OFX 1.02 underneath, denominated in US dollars, in the Web Connect shape QuickBooks imports. But QIF to QBO is the one conversion on this site where the source format is missing something the destination normally requires, so the honest mechanics matter. A QIF carries no bank ID, no account identity and no transaction IDs at all. What the converter does about each gap is specific, limited and worth understanding before you import — it is set out in full below, with no invented bank identity dressed up as your own.
          </p>
          <p className={P}>
            Plan the migration as a project, not a click: convert one account and one period at a time, import, reconcile the period total against the old Quicken record, and only then move to the next period. Years of history deserve that pace, and it is what makes any problem small and locatable instead of buried.
          </p>

          <h2 className={H2M}>How to convert QIF to QBO with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Prepare the QIF.</strong> Export or locate a Bank, Cash or CCard QIF — investment QIF files are refused, because positions and lots are not bank-feed transactions. Then open the file in a text editor and look at the D (date) lines. If the years are written with four digits, you are ready. If they are two digits, read the warning in the problems section below before converting anything you care about.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload it.</strong> Drop the .qif into the converter above — one file, up to 10 MB, no account. The file is processed in memory and never stored. A file in which no readable transactions are found is refused with an explanation, not converted into an empty QBO.
          </p>
          <p className={P}>
            <strong>Step 3 — Convert.</strong> Press Convert to QBO. For each record, the converter keeps the date, amount, payee and memo, and builds a Web Connect transaction. Because the QIF supplied no transaction IDs, it generates one for each transaction deterministically — from the transaction's date, payee, amount and position — so converting the same file again yields the same IDs. The account is written with the placeholder account ID 0000000000, and no institution block is added, because there is no bank identity in the source to add. The result panel reports the transaction count; check it against the record count you expected.
          </p>
          <p className={P}>
            <strong>Step 4 — Import and finish the job inside QuickBooks.</strong> In QuickBooks Online, go to Accounting, then Bank transactions, open the drop-down beside Link account and choose Upload from file. In QuickBooks Desktop, use File, then Utilities, then Import, then Web Connect Files. The transactions arrive uncategorised — categorising them against your chart of accounts is QuickBooks-side work, and for migrated history it is usually done in bulk by payee. Before you categorise anything, compare the imported period total with the old Quicken total for the same period.
          </p>
          <p className={P}>
            Prefer to inspect the history in a spreadsheet before it touches the books? The same QIF becomes a reviewable sheet through the <a href="/tools/qif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to CSV converter</a> or the <a href="/tools/qif-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to Excel converter</a>, and a printable copy for the migration file comes from the <a href="/tools/qif-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to PDF converter</a>.
          </p>

          <h2 className={H2M}>Problems and fixes specific to QIF to QBO</h2>
          <h3 className={H3}>Two-digit years land a century in the future</h3>
          <p className={P}>
            The single most damaging trap in old QIF data. Very old exports often wrote dates as MM/DD/YY — and this converter, like most modern parsers, reads a two-digit year as a 2000s year: 03/14/98 becomes March 2098. Dates written MM/DD'YYYY, with the apostrophe Quicken used as a century marker, carry four digits and convert correctly. The fix happens before conversion: open the QIF as text, expand two-digit years to the correct four-digit years, save, and convert the corrected file. Always test with one small period first and read the imported dates, not just the count.
          </p>
          <h3 className={H3}>&ldquo;Unable to verify your financial institution&rdquo;</h3>
          <p className={P}>
            This QuickBooks message is about the institution ID (INTU.BID), and here the cause is structural, not a defect in your data: a QIF names no bank, so the converted QBO contains no institution block — the converter will not guess your bank's ID, and a guessed ID would be worse than none. The placeholder account and bank-routing values in the file are generic structure, not a bank identity. If QuickBooks refuses the file on these grounds, do not hunt for a bank ID to paste in — a borrowed or guessed ID misidentifies the account the history belongs to. The practical fallback is the spreadsheet route for that account: convert with the QIF to Excel converter, review the history there, and use the <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a> workflow from there.
          </p>
          <h3 className={H3}>Categories and split transactions are gone</h3>
          <p className={P}>
            Old Quicken files are rich with categories (the L line) and split transactions — a paycheck divided into gross pay and withholdings, a deposit split across jobs. The QIF reader here keeps date, amount, payee, memo and check number, and deliberately ignores category, cleared status and split lines; the check number then has no field in the QBO either. Each transaction imports at its full amount, uncategorised. For most migrations that is acceptable — recategorising in QuickBooks is planned work — but a history whose value is in its splits should be reviewed as a spreadsheet first, not imported blind.
          </p>
          <h3 className={H3}>Some records never arrive</h3>
          <p className={P}>
            A QIF record with an unreadable date or an amount that is not a number cannot be converted, and the reader skips it rather than guessing. If the converted count is lower than the old Quicken count, the gap is records of that kind — often hand-edited or damaged lines in a very old file. Comparing the count period by period is how you find them while the fix is still cheap.
          </p>

          <h2 className={H2M}>Migration routes for legacy Quicken data, compared</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Route</th>
                  <th className={TH}>What lands in QuickBooks</th>
                  <th className={TH}>Watch out for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={TD}>This page — QIF straight to QBO</td>
                  <td className={TD}>Uncategorised bank-feed transactions with generated IDs</td>
                  <td className={TD}>No institution block; two-digit-year trap; splits flattened</td>
                </tr>
                <tr>
                  <td className={TD}>QIF to spreadsheet first, then CSV to QBO</td>
                  <td className={TD}>The same transactions, after human review and date fixes in the sheet</td>
                  <td className={TD}>Slower, but the right route for damaged or split-heavy history</td>
                </tr>
                <tr>
                  <td className={TD}>OFX or QFX source instead of QIF</td>
                  <td className={TD}>A conversion whose source carried a real bank identity</td>
                  <td className={TD}>Only possible if the bank still offers those downloads for the period — rarely true for the oldest years</td>
                </tr>
                <tr>
                  <td className={TD}>Retyping the history</td>
                  <td className={TD}>Exactly what you enter</td>
                  <td className={TD}>Practical for a handful of transactions, not for years of records</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Whichever route you take, keep the original QIF untouched as the source record of the migration. And if the file you are rescuing actually started life as a bank OFX download rather than a Quicken archive, the <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO converter and fixer</a> is the page built for that starting point.
          </p>
        </>
      }
    />
  );
}
