import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { QboEditor } from "@/components/tools/QboEditor";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-file-editor";

export const metadata: Metadata = {
  title: "QBO File Editor — Edit QBO Transactions Free | Convert Statement",
  description:
    "Free QBO file editor: open a QuickBooks Web Connect (.qbo), OFX or QFX file, edit dates, names and amounts, find & replace payee text, remove rows, and download a clean rebuilt QBO. Fully free, no account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QBO File Editor — Edit QBO / OFX / QFX Transactions",
    description:
      "Upload a QBO, OFX or QFX file, fix its transactions in a table, and download a rebuilt QBO. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What does this editor actually edit?",
    a: "It edits the transactions inside a copy of your QBO, OFX or QFX file: each transaction's date, name (payee text) and amount. You can also delete individual rows and run find & replace across all transaction names. When you are done, the tool builds a brand-new QBO file from the edited rows and you download that. Your original file is never modified.",
  },
  {
    q: "Does this change anything inside QuickBooks?",
    a: "No. This is a file editor, not a QuickBooks connection — nothing here logs into QuickBooks or touches your company file. The edited QBO only affects QuickBooks if you choose to import it afterwards, the same as any Web Connect file from your bank.",
  },
  {
    q: "Why can't I edit the transaction ID (FITID) column?",
    a: "On purpose. The FITID is how QuickBooks recognises a transaction it has already imported — it is the duplicate-detection key. If IDs could be edited casually, a re-import would either duplicate transactions or skip real ones. The editor shows FITIDs read-only and carries them into the rebuilt file unchanged.",
  },
  {
    q: "Is it safe to change an amount or a date?",
    a: "Only when you are correcting the file before its first import. If some of these transactions are already in QuickBooks, importing an edited copy can create mismatches: an edited amount will not match the transaction QuickBooks already has, and reconciliation targets move. The safe pattern is to edit the file first, check the totals on this page against your statement, and import once.",
  },
  {
    q: "What happens to the file's closing (ledger) balance?",
    a: "It is carried into the rebuilt file exactly as it was, along with the account number. The editor does not recompute it — so if you change amounts or delete rows, check the totals shown on this page: the net change of your edited rows plus the opening balance should still land on that closing balance, or reconciliation in QuickBooks will show a difference to investigate.",
  },
  {
    q: "What format is the downloaded file?",
    a: "A clean OFX 1.02 Web Connect file (.qbo) — the dialect of OFX current QuickBooks versions accept — with full timestamps and the original FITIDs preserved. OFX and QFX uploads are rebuilt in the same format, so this page doubles as a format normalizer.",
  },
  {
    q: "What is find & replace good for?",
    a: "Cleaning up payee text in bulk. Bank files often carry truncated or coded names — the same merchant appearing under five spellings. Find the bank's version, replace it with the name your books use, and every matching transaction is renamed at once. Matching is exact and case-sensitive, and the tool tells you how many names contain the text before you apply it.",
  },
  {
    q: "Can I add brand-new transactions in the editor?",
    a: "No — the editor works on the transactions the file already contains. To build a QBO from data that is not in a file yet, use the CSV to QBO converter: it turns a spreadsheet of transactions into a Web Connect file with generated IDs and a balance-chain check.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is parsed in memory so its transactions can be shown in the table, and it is not stored afterwards. We never sell or share your financial data, and the tool is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Upload your QBO file", body: "Drop in the .qbo, .ofx, or .qfx file you want to fix. Its transactions appear in an editable table." },
  { title: "Make your edits", body: "Change dates, names, or amounts, delete rows that should not be there, and use find & replace to clean up payee names in bulk." },
  { title: "Check the totals", body: "The money-in, money-out, and net figures update as you edit — tie them back to your statement before downloading." },
  { title: "Download the rebuilt QBO", body: "Save the new file — fully free — and import it into QuickBooks the way you would a file from your bank." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QboFileEditorPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QBO File Editor"
      subtitle="Open a QuickBooks QBO, OFX, or QFX file, fix its transactions in a table — dates, names, amounts, find & replace, row removal — and download a clean rebuilt QBO. Fully free with no account."
      tool={<QboEditor />}
      currentPath="/tools/qbo-file-editor"
      faqs={FAQS}
      howToName="How to edit a QBO file"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why edit a QBO file at all?</h2>
          <p className={P}>
            A Web Connect file is supposed to be a one-way trip: bank to QuickBooks, untouched.
            Real files break that ideal in ordinary ways. The statement you downloaded covers
            three extra days and includes two transactions that belong to another period. The
            bank truncates payee names to a code nobody recognises. One amount was exported with
            the wrong sign. Until now the choices were to import the flaws and repair them inside
            QuickBooks one transaction at a time, or to open the QBO in a text editor and risk
            breaking its OFX structure with a stray keystroke.
          </p>
          <p className={P}>
            This editor is the middle path. It reads the file's transactions into a table where
            each value is a field — not markup — so a fix is a typed correction, not surgery on
            tags. When you download, the file is rebuilt from scratch as clean OFX 1.02 with the
            same structure the{" "}
            <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO fixer</a>{" "}
            produces: valid whether or not the file you started with was.
          </p>

          <h2 className={H2M}>What you can change — and what you deliberately cannot</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Field</th>
                  <th className={TH}>Editable?</th>
                  <th className={TH}>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Date</strong></td><td className={TD}>Yes</td><td className={TD}>Posted dates are the most common export error, and the fix is unambiguous</td></tr>
                <tr><td className={TD}><strong>Name</strong></td><td className={TD}>Yes, plus find &amp; replace</td><td className={TD}>Payee text is presentation — cleaning it harms nothing and helps every report</td></tr>
                <tr><td className={TD}><strong>Amount</strong></td><td className={TD}>Yes, with totals watching</td><td className={TD}>Sign and keying errors happen; the live totals show the effect of every change</td></tr>
                <tr><td className={TD}><strong>Whole rows</strong></td><td className={TD}>Can be removed</td><td className={TD}>Out-of-period and stray transactions are easier to drop here than inside QuickBooks</td></tr>
                <tr><td className={TD}><strong>Transaction ID (FITID)</strong></td><td className={TD}>No — shown read-only</td><td className={TD}>It is QuickBooks' duplicate-detection key; editing it would defeat re-import protection</td></tr>
                <tr><td className={TD}><strong>Account &amp; closing balance</strong></td><td className={TD}>No — carried over as-is</td><td className={TD}>They identify the account and anchor reconciliation; the editor preserves, never invents, them</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>Find &amp; replace: the payee-name cleanup</h2>
          <p className={P}>
            The highest-value edit is usually the least dramatic one. Bank exports shorten names
            to fit legacy fields, so a year of card spending arrives as fragments: “AMZN MKTP
            US*”, “SQ *COFFEE”, “DD *DOORDASH”. Inside QuickBooks those fragments become vendor
            names, and every report inherits the mess. Find &amp; replace fixes a whole class of
            transactions in one pass: search for the bank's fragment, replace it with the name
            your chart of accounts expects, and the tool reports exactly how many transaction
            names contained the text before anything changes.
          </p>
          <p className={P}>
            Two cautions keep the feature honest. Matching is exact and case-sensitive — the
            tool will never rename something that merely resembles your search text. And
            replacement applies to the name field only: amounts, dates, and IDs are untouched,
            so a cleanup pass cannot move a single cent.
          </p>

          <h2 className={H2M}>The reconciliation caution, stated plainly</h2>
          <p className={P}>
            Editing a statement file is safest <em>before</em> its first import. QuickBooks
            matches imported transactions against what it already holds, using the FITID and the
            transaction details. If a file was already imported and you edit an amount or a date
            and import it again, QuickBooks sees a transaction it cannot match to its earlier
            copy — and reconciliation inherits the difference. The totals bar in the editor
            exists for exactly this reason: money in, money out, and net update with every edit,
            so you can prove your edited file still adds up to the statement before it goes
            anywhere near QuickBooks.
          </p>
          <h3 className={H3}>When to use a different tool instead</h3>
          <p className={P}>
            If the file is structurally broken — unclosed tags, a wrong OFX version, repeated
            FITIDs — the{" "}
            <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO fixer</a>{" "}
            repairs it automatically rather than asking you to edit around the damage. If you
            only need part of the file, the{" "}
            <a href="/tools/qbo-splitter" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO splitter</a>{" "}
            trims it to a date range and recomputes the closing balance for the kept period.
            And if you are not sure the file is sound, run it through the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            first — it diagnoses without changing a byte.
          </p>

          <h2 className={H2M}>How the rebuild works</h2>
          <p className={P}>
            Downloading does not patch your file — it builds a new one. The rows in the table,
            in the order shown, become the transaction list of a fresh OFX 1.02 document with
            full 14-digit timestamps, your file's account number, and its closing (ledger)
            balance carried over untouched. FITIDs ride along unchanged where they exist; a row
            whose original file carried no ID gets a deterministic one generated from its own
            contents, so re-importing the same edited file twice cannot create duplicates. If
            you would rather work in a spreadsheet, the CSV download contains the same edited
            rows in the same columns as the{" "}
            <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a>.
          </p>
        </>
      }
    />
  );
}
