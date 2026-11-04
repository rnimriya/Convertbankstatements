import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/ofx-to-pdf";

export const metadata: Metadata = {
  title: "OFX to PDF Converter — Free | Convert Statement",
  description: "Turn a bank OFX file into a readable, printable PDF statement — for records, sharing and sign-off, not for importing. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OFX to PDF Converter — Free",
    description: "Upload a OFX file and download it as PDF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What exactly appears in the PDF?",
    a: "A title made from your source file’s name, then one line per transaction with three columns — Date, Description and Amount — in the order the OFX presents them. At the end sit three totals calculated from those rows: Total in, Total out and Net. Every page carries a ConvertStatement footer and a page number. Nothing else is added.",
  },
  {
    q: "Does the PDF show my closing balance or account number?",
    a: "No. The PDF does not print the account number, the bank name or the closing balance from the OFX, even when the source file contains them. Its totals are sums of the converted transactions, not the bank’s stated balance. Keep the original OFX alongside the PDF whenever the balance itself is part of the evidence.",
  },
  {
    q: "Is this PDF an official bank statement?",
    a: "No. It is a readable rendering of your OFX download, produced by this converter — the title and footer say so on the page. That is fine for client packets, internal approvals and your own records. A lender, auditor or agency that asks for a bank-issued statement needs the statement your bank itself issued, not a conversion.",
  },
  {
    q: "Can I import the PDF back into QuickBooks or a spreadsheet?",
    a: "Not usefully. A PDF is the end of the data journey — a document for people, not a format software imports. Keep your OFX for importing, and if you need the same transactions as data, convert the OFX to CSV instead of trying to extract them back out of the PDF.",
  },
  {
    q: "Why is a long description cut off with an ellipsis?",
    a: "Each transaction gets one printed line, and a description wider than its column is shortened with an ellipsis so the Amount column stays aligned and readable. The full name remains in your source OFX; only the printed rendering is trimmed.",
  },
  {
    q: "Is this converter free, and is my file stored?",
    a: "Yes, it is fully free with no account. Your file is processed in memory to build the PDF and is never stored afterwards.",
  },
];

const HOWTO = [
  { title: "Get the OFX for the period you need to show", body: "Download it from your bank, or use the OFX file already in your records for that account and period." },
  { title: "Upload the .ofx file here", body: "Drop it into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Press Convert to PDF", body: "The transactions are laid out as a Letter-size document: date, description and amount per line, with Total in, Total out and Net calculated at the end." },
  { title: "File the PDF with the original OFX", body: "Save both together. The PDF is the copy people read, print and sign off; the OFX stays as the source that holds the account identity and closing balance." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function OfxToPdfPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="OFX to PDF Converter"
      subtitle="Turn a bank OFX file into a readable, printable PDF statement — for records, sharing and sign-off, not for importing. Fully free with no account."
      tool={<FormatConverter tool="ofx-to-pdf" fromLabel="OFX" toLabel="PDF" accept=".ofx" outputExt="pdf" />}
      currentPath="/tools/ofx-to-pdf"
      faqs={FAQS}
      howToName="How to convert OFX to PDF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>An OFX file nobody can read, and three people who need a statement</h2>
          <p className={P}>
            The OFX download was never meant for human eyes, and that becomes a practical problem the moment someone other than your software needs the statement. A client asks what a month of activity looked like. An auditor’s file needs a readable copy of the period next to the working papers. A loan packet, an expense sign-off, a year-end archive — each wants a document a person can open, read and print, and a file full of STMTTRN tags is not that document. Sending the raw OFX just moves the problem to someone who has even less chance of opening it.
          </p>
          <p className={P}>
            This converter renders the transaction list inside the OFX as that document: a clean, Letter-size PDF with a line per transaction. Two limits define what it honestly is, and both are worth knowing before you send it anywhere. First, it is a conversion, not a bank-issued statement — the document is titled from your source file’s name and footed as converted by ConvertStatement, and it carries no bank letterhead, account number or closing balance. Second, its totals are arithmetic on the rows it printed: Total in, Total out and Net for the transactions converted. For internal records, client packets and approvals, that is exactly what is needed. Where a bank-issued statement is formally required, this PDF supports the file — it does not replace the bank’s own document.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>On the PDF</th><th className={TH}>What it is</th><th className={TH}>What it is not</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Title</strong></td><td className={TD}>Your source file’s name, marked as converted by ConvertStatement</td><td className={TD}>Not a bank heading, and no account holder or account number is printed</td></tr>
                <tr><td className={TD}><strong>Transaction lines</strong></td><td className={TD}>Date, Description and Amount, one line each, in the file’s own order</td><td className={TD}>No transaction type, no transaction ID and no running balance column</td></tr>
                <tr><td className={TD}><strong>Totals</strong></td><td className={TD}>Total in, Total out and Net, summed from the rows in the document</td><td className={TD}>Not the closing balance from the OFX, which is not printed even when the source states one</td></tr>
                <tr><td className={TD}><strong>Footer</strong></td><td className={TD}>ConvertStatement credit and Page X of Y on every page</td><td className={TD}>Nothing is watermarked across the transactions themselves</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert OFX to PDF with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Start from the OFX for the exact period being asked about.</strong> If a client or auditor wants March, download or locate the OFX that covers March — not a quarter-long file you then apologize for. The PDF prints what the file contains, in the file’s order, so the period you choose here is the document you get.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload it above.</strong> One .ofx file, up to 10 MB, no account. The converter reads the transaction list directly; there are no settings to choose, because a statement document should not be an occasion for editorial decisions.
          </p>
          <p className={P}>
            <strong>Step 3 — Press Convert to PDF and read the result before you send it.</strong> Check the first page: the title should name the source file you intended, the dates should span the period you were asked for, and the transaction count in the result message should match what you expected. Skim the totals at the end — Total in minus Total out is the Net line, and all three are calculated from the printed rows.
          </p>
          <p className={P}>
            <strong>Step 4 — File the pair together.</strong> Save the PDF under a name that states the account and period in your own filing system, and keep the original OFX beside it. Anyone questioning a line later can be handed both: the readable document, and the source file that still holds the account identity, transaction IDs and the bank’s closing balance. If the same period is later needed as data rather than as a document, the <a href="/tools/ofx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to CSV converter</a> produces it from that same OFX.
          </p>

          <h2 className={H2M}>Problems and fixes specific to OFX statements as PDFs</h2>
          <h3 className={H3}>The recipient expected the closing balance on the document</h3>
          <p className={P}>
            It is not there, by design of this output: the PDF prints transactions and their totals, not the OFX wrapper that holds the ledger balance. If the balance matters to the recipient, send the bank’s own statement for the period alongside the PDF, or state the balance in your covering email and point to the original OFX as its source. Do not annotate the PDF with a balance and present the result as the bank’s document.
          </p>
          <h3 className={H3}>A long payee name ends in an ellipsis</h3>
          <p className={P}>
            Printed lines have a fixed width. A description too wide for its column is shortened with an ellipsis so amounts stay in a clean right-hand column — and before that, transaction names are read at up to 80 characters in the first place. For a records copy this is normally fine; where the exact full payee text is itself evidence, the source OFX or the bank statement is the document to cite.
          </p>
          <h3 className={H3}>The document ends before the period does</h3>
          <p className={P}>
            The reader takes up to 500 transactions from one file. A high-activity account converted for a full quarter can exceed that, and the PDF will faithfully render a partial period — which is a bad document to send. Convert in shorter periods instead: one OFX per month, one PDF per month, each complete, and label them as a set.
          </p>
          <h3 className={H3}>Someone tried to import the PDF into accounting software</h3>
          <p className={P}>
            That route does not exist, and it is not a failure of the PDF. If the transactions need to enter QuickBooks, convert the original OFX with the <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO converter</a>, which keeps the IDs and balances an importer depends on. Circulating the PDF while quietly keeping the OFX importable is the correct division of labor between the two files.
          </p>
          <h3 className={H3}>The order of lines looks unusual</h3>
          <p className={P}>
            The PDF follows the order transactions appear in the OFX; it does not re-sort them. Most bank files are already chronological, but an export assembled from several downloads may not be. If order matters for the reader, say so in your covering note — or work from a single bank download for the period rather than a stitched file.
          </p>

          <h2 className={H2M}>Getting a printable statement: the routes compared</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Route</th><th className={TH}>What you get</th><th className={TH}>Where it breaks</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Download the PDF statement from the bank</strong></td><td className={TD}>The bank-issued document, with letterhead, account details and stated balances</td><td className={TD}>Only covers periods the bank still offers, in the bank’s layout — and it is not always the same transaction set as the OFX you already hold</td></tr>
                <tr><td className={TD}><strong>Print from your finance app</strong></td><td className={TD}>A register report in the app’s format</td><td className={TD}>Only possible after importing, and the report reflects the app’s edited data rather than the bank file itself</td></tr>
                <tr><td className={TD}><strong>Convert the OFX here</strong></td><td className={TD}>A tidy statement of exactly the file you hold, fully free, in minutes</td><td className={TD}>No letterhead, account number or closing balance — a rendering for reading and filing, not a bank-issued statement</td></tr>
                <tr><td className={TD}><strong>Send the raw OFX</strong></td><td className={TD}>The complete source data</td><td className={TD}>Most recipients cannot open it, which is the problem this page exists to solve</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The same rendering exists for the rest of the family: the <a href="/tools/qbo-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to PDF converter</a> for a Web Connect file and the <a href="/tools/qfx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to PDF converter</a> for a Quicken download follow the same layout, so statements converted from different sources file consistently together.
          </p>
        </>
      }
    />
  );
}
