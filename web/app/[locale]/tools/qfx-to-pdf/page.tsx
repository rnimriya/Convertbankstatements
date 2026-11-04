import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qfx-to-pdf";

export const metadata: Metadata = {
  title: "QFX to PDF Converter — Free | Convert Statement",
  description: "Render a Quicken QFX download as a readable, printable PDF statement — for records, sharing and expense sign-off. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QFX to PDF Converter — Free",
    description: "Upload a QFX file and download it as PDF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What exactly appears in the PDF?",
    a: "Three columns — Date, Description and Amount — one line per transaction in the QFX, on Letter-size pages. At the end the PDF adds three totals computed from those lines: Total in, Total out and Net. It does not show your account number, bank name or a closing balance, even if the QFX carries them.",
  },
  {
    q: "Can I send this PDF to a lender or auditor instead of a bank statement?",
    a: "You can send it as a readable record of the transactions in your download, and lenders and auditors often work from documents like it. Be clear about what it is, though: it is a rendering of a QFX file, not a statement issued by your bank, and it carries no bank letterhead, account number or official balance. If the request asks for an official statement, get that from the bank.",
  },
  {
    q: "Will the amounts in the PDF match my QFX exactly?",
    a: "Yes. Amounts are copied with no currency conversion and no rounding beyond the two decimal places already in the file, and money in and money out keep their signs. The Total in, Total out and Net lines at the end are sums of those same amounts, so you can cross-check them against the lines above.",
  },
  {
    q: "My PDF is missing transactions I can see in Quicken. Why?",
    a: "The PDF can only show what is inside the QFX file you uploaded. If Quicken shows a longer history than the download covers, the bank exported a shorter date range than you expected — re-download the QFX for the full period and convert that file. If the file itself is not really an OFX-family file, the converter says so instead of producing an empty PDF.",
  },
  {
    q: "Can someone import this PDF back into Quicken or QuickBooks?",
    a: "No. The PDF is a fixed document for reading, printing and filing — it has no transaction IDs or import structure. Keep the original QFX beside it: the QFX is still the file Quicken reads, and it is the file you would convert onward to a spreadsheet or to QuickBooks.",
  },
  {
    q: "Is this converter really free, and is my file stored?",
    a: "Yes — the conversion is fully free with no account, for files up to 10 MB. Your file is processed in memory to build the PDF and is never stored, and we never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Download the QFX from your bank", body: "In your bank's portal, choose the Quicken or Web Connect download for the account and date range you need, and save the .qfx file it gives you." },
  { title: "Upload it here", body: "Drop the .qfx file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to PDF", body: "Press Convert to PDF. The transactions are read out of the QFX and laid out as Date, Description and Amount lines, with Total in, Total out and Net added at the end." },
  { title: "Check the count, then file it", body: "The result panel tells you how many transactions were converted. Open the PDF, confirm the period and totals look right, then print it or attach it to the file that needs it." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QfxToPdfPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QFX to PDF Converter"
      subtitle="Render a Quicken QFX download as a readable, printable PDF statement — for records, sharing and expense sign-off. Fully free with no account."
      tool={<FormatConverter tool="qfx-to-pdf" fromLabel="QFX" toLabel="PDF" accept=".qfx" outputExt="pdf" />}
      currentPath="/tools/qfx-to-pdf"
      faqs={FAQS}
      howToName="How to convert QFX to PDF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>A Quicken download is data — a loan file needs a document</h2>
          <p className={P}>
            A QFX file is built for one reader: Quicken. It is Quicken's variant of OFX, the format banks use to hand transactions to software, and opened on its own it is a wall of tags that means nothing to a client, an auditor or a loan officer. Yet the moment a current account leaves your own screen, those are exactly the people who need to read it — a bookkeeper's client reviewing a month of spending, an auditor sampling transactions for a file, a borrower assembling the income and expense record a lender asked for.
          </p>
          <p className={P}>
            None of them can open a QFX, and most of them should not have to. What they need is the same transactions as a plain statement: dated lines, descriptions, amounts, in an order a person can follow and a format that prints the same way everywhere. That is what this converter makes. It reads the transaction list out of a modern Quicken download and renders it as a Letter-size PDF with three columns — Date, Description and Amount — plus three totals at the end (Total in, Total out and Net) that are summed from the lines themselves.
          </p>
          <p className={P}>
            Be precise about what the result is and is not. It is an honest rendering of your download, useful for client packets, audit files, expense sign-off and loan documentation you assemble yourself. It is not a bank-issued statement: the PDF shows no bank name, no account number and no closing balance, because it is a document built from transaction lines, not a copy of the bank's own paperwork. When a lender or auditor specifically requires an official statement, only the bank can issue that. When they need the transactions in a readable form, this is the file to send.
          </p>

          <h2 className={H2M}>How to convert QFX to PDF with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Download the right QFX.</strong> In your bank's online portal, export the account as a Quicken or Web Connect (.qfx) download and choose the date range deliberately — the PDF will cover exactly the period the file covers, no more. If you already have the QFX from a Quicken sync, you can use that file as it stands.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload it.</strong> Drop the .qfx file into the converter above. One file at a time, up to 10 MB, no account and no install. The file is processed in memory and never stored.
          </p>
          <p className={P}>
            <strong>Step 3 — Convert.</strong> Press Convert to PDF. The converter parses the OFX structure inside the QFX, takes each transaction's date, description and amount, and lays them out in date order as statement lines. Amounts are copied exactly, with their signs — money out stays negative — and no currency conversion is applied. The result panel reports how many transactions were converted, which is your first check: it should match the count you expect for the period.
          </p>
          <p className={P}>
            <strong>Step 4 — Review before you send it.</strong> Open the PDF and scan the first and last dates to confirm the period is the one you intended, then glance at the Total in, Total out and Net lines. Those totals are computed from the lines in the document, so if they tie to the activity you expected, the rendering is complete. Then print it, email it or file it — and keep the original QFX alongside it, because the PDF cannot be imported anywhere and the QFX remains your reusable data.
          </p>
          <p className={P}>
            If the person receiving the file will want to sort, filter or annotate the transactions rather than just read them, a PDF is the wrong deliverable — send a spreadsheet instead, made with the <a href="/tools/qfx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to CSV converter</a> or the workbook from the <a href="/tools/qfx-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to Excel converter</a>.
          </p>

          <h2 className={H2M}>Problems and fixes specific to QFX to PDF</h2>
          <h3 className={H3}>The PDF shows no balance — and that is correct</h3>
          <p className={P}>
            A QFX usually carries a ledger balance from the bank, and readers often expect to see it on the printed statement. This PDF does not carry it over: the document is built from the transaction lines only, and it never prints a balance it did not compute. What it does show is the arithmetic of the period itself — Total in, Total out and Net. If a reviewer needs the closing balance, quote it from the bank's own statement for the same period rather than expecting this rendering to supply it.
          </p>
          <h3 className={H3}>Transactions missing at the start or end</h3>
          <p className={P}>
            This is almost always a download-range problem, not a conversion problem. Banks commonly default Quicken downloads to a recent window, so a PDF that starts later than you wanted means the QFX itself starts there. Re-export from the bank with a custom date range and convert the new file. The transaction count in the result panel, checked against the bank's own count for the period, settles the question quickly.
          </p>
          <h3 className={H3}>&ldquo;That file does not look like a QBO, OFX or QFX file&rdquo;</h3>
          <p className={P}>
            The converter reads the OFX structure underneath the .qfx extension. This error means the file's contents are not that structure — most often because the bank actually delivered a CSV or PDF with a renamed extension, or the download was interrupted and truncated. Download the file again from the bank, choosing the Quicken format explicitly, and convert the fresh copy.
          </p>
          <h3 className={H3}>Very long descriptions are shortened</h3>
          <p className={P}>
            Bank descriptions can run long, and a printed line cannot. In the PDF, a description that exceeds the column width is shortened with an ellipsis so the amounts stay aligned and readable. The amount and date are never shortened. If a specific payee's full text matters for your file, the complete description survives in the spreadsheet versions — another reason the QFX to Excel converter makes a good companion copy.
          </p>

          <h2 className={H2M}>The routes from a QFX, compared honestly</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Route</th>
                  <th className={TH}>Best for</th>
                  <th className={TH}>Limit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={TD}>This page — QFX to PDF</td>
                  <td className={TD}>People: clients, auditors, loan files, printed records</td>
                  <td className={TD}>Fixed document; cannot be imported or edited as data</td>
                </tr>
                <tr>
                  <td className={TD}>QFX to CSV or Excel</td>
                  <td className={TD}>Review work: sorting, filtering, annotating, reconciling by hand</td>
                  <td className={TD}>Editable, so it is a working copy, not a fixed record</td>
                </tr>
                <tr>
                  <td className={TD}>QFX to QBO</td>
                  <td className={TD}>Getting the same transactions into QuickBooks</td>
                  <td className={TD}>A machine file — nobody can read it without software</td>
                </tr>
                <tr>
                  <td className={TD}>Print from inside Quicken</td>
                  <td className={TD}>Reports shaped by your Quicken categories and views</td>
                  <td className={TD}>Needs Quicken installed and the account already imported and reconciled there</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            In practice the PDF and the data file travel together: the PDF for the human reader, the original QFX kept as the source. When the destination is QuickBooks rather than a person, skip the document entirely and use the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a>. The same rendering for the neighbouring formats lives on the <a href="/tools/qbo-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to PDF converter</a> and the <a href="/tools/ofx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to PDF converter</a>.
          </p>
        </>
      }
    />
  );
}
