import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/csv-to-qfx";

export const metadata: Metadata = {
  title: "CSV to QFX Converter — Free | Convert Statement",
  description: "Turn a bank CSV export into a QFX file Quicken can import — the same transactions, in Quicken's own variant of OFX. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "CSV to QFX Converter — Free",
    description: "Upload a CSV file and download it as QFX — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a CSV file to QFX?",
    a: "Export a CSV with a header row from your bank, drop it into the converter above (one .csv file, up to 10 MB), and press Convert to QFX. The QFX downloads automatically and the confirmation shows how many transactions were converted. Fully free, no account, and your file is processed in memory and never stored.",
  },
  {
    q: "Why won't Quicken just import my bank's CSV?",
    a: "Because Quicken's supported file route for bank account transactions is Web Connect — the QFX file. Modern Quicken does not import a CSV into a bank register, and QIF import for bank and investment accounts was discontinued many versions ago. A CSV is a spreadsheet shape; Quicken is listening for a statement file, which is what this conversion builds.",
  },
  {
    q: "Will Quicken accept a QFX made from a CSV?",
    a: "The file is a genuine QFX — OFX 1.02 with Quicken's statement structure, one entry per transaction, each with a unique transaction ID generated from the transaction itself. What a CSV cannot give it is your bank's institution ID (INTU.BID): the converter never invents one, so the file carries no bank identity block. Quicken versions and banks differ in how they treat a file without that ID — many imports proceed and let you link the transactions to your account — but where Quicken insists on a bank-issued file for a specific institution, only the bank's own QFX download carries the authoritative ID.",
  },
  {
    q: "What does the QFX contain, exactly?",
    a: "Your transactions and nothing made up: for each row, the posted date, a CREDIT or DEBIT type taken from the amount's sign, the amount itself, your description and memo text, and a generated FITID. The account block uses placeholder values because a CSV has no account number to carry, and there is no closing balance because a CSV has none. Amounts are copied exactly, with no currency conversion.",
  },
  {
    q: "Can I convert a credit card CSV for Quicken?",
    a: "You can convert it, but know what comes out: this converter builds a bank-account statement (checking), because that is the structure the shared conversion engine writes. A card CSV will arrive wrapped as a bank statement rather than a credit card statement, so check how Quicken presents it before relying on it for a card account — and keep the original CSV either way.",
  },
  {
    q: "Is this converter free, and is my data stored?",
    a: "Yes, fully free — the conversion and the QFX download cost nothing and need no account. Your file is processed in memory to build the QFX and is never stored, sold or shared.",
  },
];

const HOWTO = [
  { title: "Export the CSV from your bank", body: "Download the date range you need as CSV and keep the bank's header row — Date, Description and Amount (or a Debit/Credit pair) are what the converter reads." },
  { title: "Upload it here", body: "Drop the .csv file into the converter above — one file, up to 10 MB, no account needed. Files are processed in memory and never stored." },
  { title: "Convert to QFX", body: "Press Convert to QFX. Each readable row becomes a Quicken statement transaction with its date, description, amount and a generated transaction ID." },
  { title: "Download and import into Quicken", body: "The .qfx file downloads automatically. Note the transaction count, then import it in Quicken with File, then Import, then Web Connect (.QFX) File." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function CsvToQfxPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="CSV to QFX Converter"
      subtitle="Turn a bank CSV export into a QFX file Quicken can import — the same transactions, in Quicken's own variant of OFX. Fully free with no account."
      tool={<FormatConverter tool="csv-to-qfx" fromLabel="CSV" toLabel="QFX" accept=".csv" outputExt="qfx" />}
      currentPath="/tools/csv-to-qfx"
      faqs={FAQS}
      howToName="How to convert CSV to QFX"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Quicken does not want your CSV. It wants a statement file.</h2>
          <p className={P}>
            This is the dead end Quicken users know well: the bank offers a perfectly good CSV download, you open Quicken&apos;s import menu, and there is simply no door for it. Modern Quicken&apos;s file import for bank accounts is Web Connect — the QFX format, Quicken&apos;s licensed variant of OFX. It does not import a CSV into a bank register, and the older QIF route people remember was discontinued for bank and investment accounts many versions ago. So a spreadsheet of transactions, however clean, has nowhere to land. The gap is not your data; it is the container.
          </p>
          <p className={P}>
            It happens for predictable reasons. The bank supports Quicken&apos;s live Direct Connect for recent activity but only offers CSV for older statements or custom date ranges. The account is at a smaller bank or credit union that never joined Quicken&apos;s download program at all. Or you are rebuilding history — moving a year of transactions into Quicken at cleanup time, from files the bank exported as spreadsheets. In each case QFX is the door in: rebuild the CSV as a Quicken statement file, and the import menu that ignored your spreadsheet accepts the same transactions.
          </p>
          <p className={P}>
            One honest limit belongs up front, because it decides whether this route works for a given bank. A bank-issued QFX carries the bank&apos;s institution ID (INTU.BID) in an identity block, and Quicken uses that ID to tie a file to a financial institution. A CSV contains no such ID, and this converter never invents one — the QFX you download carries your transactions, each with a unique ID of its own, under placeholder account values and no institution block. Many imports proceed and let you link the statement to your Quicken account; where Quicken requires a recognized institution ID for a particular bank, only that bank&apos;s own download can supply it. Any converter that offers to stamp your bank&apos;s real ID onto a file is making the number up.
          </p>

          <h2 className={H2M}>How to convert CSV to QFX with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Export the CSV from your bank.</strong> Download the period you need as CSV and leave the file exactly as exported, header row included. The converter needs a recognizable date column, a description or payee column, and either one signed amount column or a debit/credit pair. A fresh bank export is the best input; a copy that has been opened and re-saved in Excel is where date and number damage usually creeps in.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload it.</strong> Drop the .csv into the tool at the top of this page — one file, up to 10 MB, no account needed. The file is processed in memory and never stored.
          </p>
          <p className={P}>
            <strong>Step 3 — Convert.</strong> Press <strong>Convert to QFX</strong>. The header row is auto-detected, debits become negative amounts and credits stay positive, and each readable row becomes one transaction in an OFX 1.02 statement — the QFX structure — sorted by date and given a FITID generated from its own date, description and amount. Generating the ID from the transaction matters: convert the same CSV again and you get the same IDs, which is what lets Quicken recognize a repeated file instead of treating every row as new. Rows whose date or amount cannot be read are skipped, not guessed.
          </p>
          <p className={P}>
            <strong>Step 4 — Download and import into Quicken.</strong> The .qfx downloads automatically, fully free. Note the transaction count in the confirmation — it is your check that the file is complete — then in Quicken use <strong>File → Import → Web Connect (.QFX) File</strong> and link the statement to the right account when Quicken asks. Review the imported transactions against the bank statement before you accept them into the register, as you would with any downloaded file.
          </p>

          <h2 className={H2M}>When a CSV to QFX conversion goes wrong</h2>
          <h3 className={H3}>The converter cannot read the CSV at all</h3>
          <p className={P}>
            Unrecognized headers are the usual cause. The converter looks for familiar column names — Date, Posted, Transaction Date; Description, Payee, Name; Amount, or Debit together with Credit — and it needs a real header row to find them in. Title lines, account summaries or blank rows above the headers break detection, and so does a headerless export. Clear whatever sits above the header row, rename eccentric headers to the plain words in a copy of the file, and convert again.
          </p>
          <h3 className={H3}>Quicken questions the file&apos;s institution</h3>
          <p className={P}>
            This is the INTU.BID limit stated above, arriving in practice: the file is structurally sound, but it does not claim to be from your bank, because a CSV cannot say whose it is. Work with what Quicken offers — if it lets you choose or link an account for the import, do that and verify the transactions carefully. If it refuses the file outright for that institution, the remaining routes are the bank&apos;s own QFX download (authoritative ID included) or entering the period another way; no honest converter can close that particular gap, and it is better to know that here than after an hour of retries.
          </p>
          <h3 className={H3}>Money in and money out are reversed</h3>
          <p className={P}>
            Sign conventions again. Parenthesized amounts are read as negative and minus signs are honored, but a single amount column in which both deposits and withdrawals are positive — told apart only by a separate debit/credit marker column — cannot be converted faithfully, because the amount itself carries no direction. Re-export with separate debit and credit columns if your bank offers that layout; the converter maps the pair explicitly, debits negative and credits positive.
          </p>
          <h3 className={H3}>A card statement imports as a bank account</h3>
          <p className={P}>
            The conversion engine writes a bank statement — a checking account wrapper — whatever the CSV came from. A checking or savings CSV is therefore at home in the output, while a credit card CSV arrives wearing the wrong account type. Convert it if a readable import is better than none, but check the result in Quicken before accepting it, and do not treat the converted file as a card statement for reconciliation purposes.
          </p>

          <h2 className={H2M}>Three ways into Quicken, honestly compared</h2>
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
                  <td className={TD}>The bank&apos;s own QFX (Web Connect) download</td>
                  <td className={TD}>The authoritative route — real institution ID, real account identity, closing balance</td>
                  <td className={TD}>Only exists if your bank offers it, and often only for recent periods</td>
                </tr>
                <tr>
                  <td className={TD}>Quicken&apos;s live account connection</td>
                  <td className={TD}>Ongoing activity, with nothing to convert</td>
                  <td className={TD}>Connections cover a limited history window and cannot rebuild old periods or import a client&apos;s files</td>
                </tr>
                <tr>
                  <td className={TD}>Convert the CSV to QFX here</td>
                  <td className={TD}>CSV-only banks, older periods, and history rebuilds</td>
                  <td className={TD}>No institution ID can come from a CSV, so a bank that requires a bank-issued file is out of reach for any converter</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            If your real destination is not Quicken, the sibling formats are one step sideways: plain OFX for other finance software via the <a href="/tools/csv-to-ofx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to OFX converter</a>, QuickBooks&apos; own variant via the <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a>, and the legacy text format via the <a href="/tools/csv-to-qif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QIF converter</a> for software old enough to still ask for it. Already holding a QFX and moving the other way? The <a href="/tools/qfx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to CSV converter</a> opens one as a spreadsheet, and the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a> carries one into QuickBooks.
          </p>
        </>
      }
    />
  );
}
