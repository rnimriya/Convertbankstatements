import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-to-iif";

export const metadata: Metadata = {
  title: "QBO to IIF Converter — Free | Convert Statement",
  description: "Convert a QuickBooks Web Connect (QBO) file into an IIF for QuickBooks Desktop company files — Desktop's own import format. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QBO to IIF Converter — Free",
    description: "Upload a QBO file and download it as IIF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QBO file to IIF?",
    a: "Drop the .qbo file into the converter above (one file, up to 10 MB) and press Convert to IIF. Each transaction in the Web Connect file becomes a TRNS/SPL pair in QuickBooks Desktop's IIF format. Fully free, no account, and your file is processed in memory and never stored. Before importing the result, read the account note below — it decides where the transactions land.",
  },
  {
    q: "QuickBooks Desktop can import a QBO directly. Why convert to IIF?",
    a: "Often you should not — if Web Connect import works for your company file, use it, because it keeps the file's transaction IDs and duplicate protection. The IIF route earns its place when that door is closed or wrong for the job: the bank account is not set up for Web Connect in that company file, the bank's identity in the QBO is not recognized, you are working in an older Desktop version, or your established workflow posts bank activity through IIF imports with offset accounts rather than through the bank-feed center.",
  },
  {
    q: "Which accounts will the converted transactions post to?",
    a: "Fixed ones, and you should know them before importing: every transaction posts against a bank account named “Business Checking.” Money in is typed as a DEPOSIT with its offsetting split to “Uncategorized Income”; money out is typed as a CHECK with its split to “Uncategorized Expense.” IIF imports match account names exactly — if your company file's checking account has a different name, Desktop will create a new “Business Checking” account and post there. Either rename first, or open the IIF (it is plain tab-separated text) and replace the account names with your real ones before importing, then recategorize the uncategorized splits after import.",
  },
  {
    q: "Does the IIF keep the QBO's duplicate protection?",
    a: "No — and this is the sharpest difference between the two formats. A QBO carries a unique FITID per transaction, and QuickBooks skips IDs it has already imported. IIF has no transaction IDs at all, so the FITIDs are dropped in conversion and nothing stops a second import of the same IIF, or an IIF import of transactions that already arrived via the original QBO, from duplicating every entry. Convert once, import once, and do not run both routes for the same period.",
  },
  {
    q: "How do I import the IIF into QuickBooks Desktop?",
    a: "First back up the company file — an IIF import cannot be undone in one step, so the backup is your undo. Then use File, then Utilities, then Import, then IIF Files, and choose the downloaded file. Afterwards open the bank register and check where the transactions posted (see the account question above), recategorize the uncategorized income and expense splits, and reconcile the period against the bank statement as usual.",
  },
  {
    q: "Is this converter free, and is my file stored?",
    a: "Yes, fully free — no account, no paid tier behind the download. Your QBO is processed in memory to build the IIF and is never stored, sold or shared.",
  },
];

const HOWTO = [
  { title: "Get the QBO file", body: "Use the Web Connect .qbo you downloaded from the bank — the file whose transactions need to reach a QuickBooks Desktop company file." },
  { title: "Upload it here", body: "Drop the .qbo file into the converter above — one file, up to 10 MB, no account needed. Files are processed in memory and never stored." },
  { title: "Convert to IIF", body: "Press Convert to IIF. Each QBO transaction becomes a balanced TRNS/SPL pair — DEPOSIT or CHECK against Business Checking, offset to Uncategorized Income or Expense." },
  { title: "Download, adjust account names, import", body: "Save the .iif — fully free. If your Desktop accounts have different names, replace them in the file first, back up the company file, then import via File, then Utilities, then Import, then IIF Files." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QboToIifPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QBO to IIF Converter"
      subtitle="Convert a QuickBooks Web Connect (QBO) file into an IIF for QuickBooks Desktop company files — Desktop's own import format. Fully free with no account."
      tool={<FormatConverter tool="qbo-to-iif" fromLabel="QBO" toLabel="IIF" accept=".qbo" outputExt="iif" />}
      currentPath="/tools/qbo-to-iif"
      faqs={FAQS}
      howToName="How to convert QBO to IIF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>The bank speaks Web Connect. The books live in Desktop.</h2>
          <p className={P}>
            Here is the mismatch in its usual form: the bank has done its part — it offers a clean Web Connect download, a .qbo file — but the company&apos;s books live in QuickBooks Desktop, and the way transactions are supposed to enter those books is an IIF workflow: the accountant&apos;s established import routine, an older Desktop version, or a company file whose bank account was never set up for Web Connect at all. The QBO is a good file in the wrong dialect. It is OFX underneath, built for the bank-feed center; IIF is Desktop&apos;s own tab-separated language of TRNS and SPL double-entry lines. This converter is the bridge between them.
          </p>
          <p className={P}>
            Honesty about the alternative matters here, because there is one: QuickBooks Desktop can import many QBO files directly through Web Connect, and when that works it is the better route — it preserves the file&apos;s transaction IDs and its closing balance, and QuickBooks can refuse duplicates. Reach for the IIF conversion when the direct door is genuinely closed or wrong for the job: Desktop does not recognize the bank identity in the file, the account is not enrolled for Web Connect in that company file, you are consolidating downloads a client sent you into a Desktop ledger on your own terms, or the books are kept through IIF imports by long-standing practice and changing the pipeline is not on the table.
          </p>
          <p className={P}>
            What crosses the bridge is the transaction list: each entry&apos;s date, name and amount, rebuilt as a balanced double entry. What does not cross is everything that made the QBO a bank-feed file — its bank identity, its closing balance, and, most consequentially, its FITID transaction IDs. IIF has no field for any of them. The sections below treat those losses as the practical risks they are, with the account-name detail that decides whether an IIF import lands in the right register.
          </p>

          <h2 className={H2M}>How to convert QBO to IIF with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Get the QBO file.</strong> Use the Web Connect file as downloaded from the bank, unopened and unedited. If you have several monthly QBOs for the same account, convert them one at a time and keep the files clearly named by period — the discipline matters more with IIF than with QBO, for reasons step 4 makes plain.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload it.</strong> Drop the .qbo into the tool at the top of this page — one file, up to 10 MB, no account needed. It is processed in memory and never stored.
          </p>
          <p className={P}>
            <strong>Step 3 — Convert.</strong> Press <strong>Convert to IIF</strong>. The converter reads the transactions out of the QBO&apos;s OFX structure and writes each one as a TRNS/SPL pair that sums to zero, in Desktop&apos;s format: money in becomes a <strong>DEPOSIT</strong> and money out a <strong>CHECK</strong> — the original QBO transaction type is re-derived from the amount&apos;s sign, because that is the typing the IIF bank-import shape uses. Every transaction posts against a bank account named <strong>Business Checking</strong>, with the offsetting split to <strong>Uncategorized Income</strong> for deposits or <strong>Uncategorized Expense</strong> for payments. Amounts are copied exactly, with no currency conversion; dates are written in the MM/DD/YYYY form Desktop expects.
          </p>
          <p className={P}>
            <strong>Step 4 — Adjust, back up, then import.</strong> The .iif downloads automatically, fully free, with the converted count in the confirmation. Before importing: if your company file&apos;s bank account is not literally named “Business Checking,” open the IIF in a text editor or spreadsheet — it is plain tab-separated text — and replace that name with your real account name, so the import posts to your register instead of creating a new account. Then <strong>back up the company file</strong>, and import via <strong>File → Utilities → Import → IIF Files</strong>. Afterwards, recategorize the uncategorized splits in the register and reconcile the period against the statement. And import each converted file exactly once: with the FITIDs gone, a repeat import is a duplicate import.
          </p>

          <h2 className={H2M}>When a QBO to IIF conversion goes wrong</h2>
          <h3 className={H3}>A brand-new “Business Checking” account appears</h3>
          <p className={P}>
            The classic IIF import outcome, and the easiest to prevent. IIF matches accounts by exact name: a name the company file does not contain is not an error to Desktop — it is an instruction to create that account. Since the converted file posts everything against Business Checking, a company file whose account is called “Main Operating,” “Checking — 4471” or anything else will quietly gain a new account holding all the imported activity. Fix it before import with the find-and-replace in step 4; fixing it after means merging accounts and moving transactions, which is nobody&apos;s idea of a good afternoon.
          </p>
          <h3 className={H3}>Everything is in Uncategorized Income and Expense</h3>
          <p className={P}>
            Also expected, not a malfunction. A QBO carries no chart-of-accounts information — the bank does not know your categories — so the split side of every entry has to land somewhere neutral: Uncategorized Income for money in, Uncategorized Expense for money out. The conversion gets the bank side of the books complete and correct; the categorization pass in Desktop afterwards is where the entries become meaningful, and it goes faster as one deliberate pass over a register than it would have entry by entry.
          </p>
          <h3 className={H3}>Transactions double up</h3>
          <p className={P}>
            The FITID loss, arriving as damage. The original QBO would have protected you: QuickBooks recognizes its IDs and skips what it has seen. The IIF carries no IDs, so importing the same period twice — or importing the IIF after the same QBO already went in through Web Connect — posts everything twice with no warning. Pick one route per period, keep a note of what was imported, and if a duplication does happen, the company-file backup from step 4 is the clean way back.
          </p>
          <h3 className={H3}>Types and memos look thinner than the QBO</h3>
          <p className={P}>
            A QBO distinguishes transaction types the bank reported — POS purchases, ATM withdrawals, interest and so on. The IIF bank shape this converter writes uses the two types that cover bank activity, DEPOSIT and CHECK, chosen by the amount&apos;s sign, so that nuance flattens. Memo text from the bank file likewise does not carry into the IIF rows; the name and amount do. For register posting this costs nothing material — the bank type was informational — but if you need the QBO&apos;s full detail visible for review, keep the original file beside the converted one, or lay it out with the <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a> before you convert.
          </p>

          <h2 className={H2M}>Two doors into Desktop, honestly compared</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Route</th>
                  <th className={TH}>What it preserves</th>
                  <th className={TH}>Where it breaks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={TD}>Import the QBO through Web Connect</td>
                  <td className={TD}>Transaction IDs and duplicate protection, the closing balance, the bank&apos;s own account identity</td>
                  <td className={TD}>Needs the account set up for Web Connect and a bank identity Desktop recognizes; not every company file or version cooperates</td>
                </tr>
                <tr>
                  <td className={TD}>Convert the QBO to IIF here, then IIF-import</td>
                  <td className={TD}>Every transaction&apos;s date, name and amount, as balanced double entries that post on your chosen import schedule</td>
                  <td className={TD}>IDs, balance and bank identity are dropped; account names are fixed defaults you may need to replace; categories start uncategorized</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Neighboring routes cover the adjacent jobs: a spreadsheet source instead of a QBO goes through the <a href="/tools/csv-to-iif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to IIF converter</a>, an IIF you need to read rather than import flattens through the <a href="/tools/iif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">IIF to CSV converter</a> or the <a href="/tools/iif-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">IIF to Excel converter</a>, and the same QBO rendered as a document for a client or a loan file is the <a href="/tools/qbo-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to PDF converter</a>.
          </p>
        </>
      }
    />
  );
}
