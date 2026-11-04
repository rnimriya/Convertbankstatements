import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-to-pdf";

export const metadata: Metadata = {
  title: "QBO to PDF Converter — Free | Convert Statement",
  description: "Render a QuickBooks QBO file as a readable, printable PDF statement — the copy you can send a client or file away. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QBO to PDF Converter — Free",
    description: "Upload a QBO file and download it as PDF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "How do I convert a QBO file to PDF?",
    a: "Drop the .qbo file into the converter above (one file, up to 10 MB) and press Convert to PDF. The transactions are laid out as a printable statement document and the PDF downloads automatically. Fully free, no account, and your file is processed in memory and never stored.",
  },
  {
    q: "What exactly appears in the PDF?",
    a: "A table of the QBO's transactions — date, description and amount, one row per transaction — headed by the source file's name, and closed with three totals computed from those rows: Total in, Total out and Net. Each page carries a footer and page number. That is the whole document, deliberately: there is no account number and no opening or closing balance in it, even though the QBO itself may contain a ledger balance — this converter renders the transaction list, and it does not print bank details it was not asked to present. If a balance matters for your purpose, the bank's own statement is the document that carries it.",
  },
  {
    q: "Is the PDF an official bank statement?",
    a: "No. It is a faithful, readable rendering of the data inside your QBO file — the same dates, descriptions and amounts — but it is produced by a converter, not issued by your bank, and it bears this converter's name in its title and footer rather than the bank's. For a client's records, an auditor's workpapers or your own paper file that is usually exactly what is needed. If a lender or agency asks for bank statements, expect them to want the statements the bank itself issued, and treat this PDF as the organized companion, not the substitute.",
  },
  {
    q: "Can the PDF be imported into QuickBooks or edited like a spreadsheet?",
    a: "No. A PDF is the end of the line: a document for reading, printing, emailing and filing. It cannot be imported into accounting software, and its numbers are text on a page, not cells you can total. Keep the original QBO as the importable source. If you need the same transactions as data — sortable, filterable, editable — use the QBO to CSV converter instead, which lays the identical rows out as a spreadsheet.",
  },
  {
    q: "Why not just open the QBO file to read it?",
    a: "Because a QBO is OFX markup written for software: the transactions are in there, but wrapped in nested tags, timestamps and IDs that make it painful to scan and impossible to hand to a client. QuickBooks will show you the data, but only inside QuickBooks, to someone with QuickBooks. The PDF is the version anyone — a client, an auditor, a loan officer, future you — can open anywhere and read at a glance.",
  },
  {
    q: "Is this converter free, and is my file stored?",
    a: "Yes, fully free — no account and no paid tier behind the download. Your QBO is processed in memory to build the PDF and is never stored, sold or shared.",
  },
];

const HOWTO = [
  { title: "Get the QBO file", body: "Use the Web Connect .qbo you downloaded from the bank — the machine file whose transactions you need in human-readable form." },
  { title: "Upload it here", body: "Drop the .qbo file into the converter above — one file, up to 10 MB, no account needed. Files are processed in memory and never stored." },
  { title: "Convert to PDF", body: "Press Convert to PDF. Each transaction becomes a dated row with its description and amount, followed by Total in, Total out and Net for the period in the file." },
  { title: "Download and use the document", body: "The PDF downloads automatically — fully free — ready to print, email to a client, attach to a loan file or archive with the period's records." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QboToPdfPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QBO to PDF Converter"
      subtitle="Render a QuickBooks QBO file as a readable, printable PDF statement — the copy you can send a client or file away. Fully free with no account."
      tool={<FormatConverter tool="qbo-to-pdf" fromLabel="QBO" toLabel="PDF" accept=".qbo" outputExt="pdf" />}
      currentPath="/tools/qbo-to-pdf"
      faqs={FAQS}
      howToName="How to convert QBO to PDF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>A file for software, when what you need is a document for people</h2>
          <p className={P}>
            A QBO file does its one job well: it feeds transactions into QuickBooks. For every other job around the books it is the wrong artifact. Your client wants to see the activity you just imported and does not have QuickBooks. An auditor asks for the statement behind a period and means something they can read, annotate and file. A loan application wants bank activity attached as a document. You want a paper copy for the year-end file that will still make sense in five years, when nobody remembers which version of anything opened a Web Connect file. Open the QBO itself and you get OFX markup — tags, timestamps, transaction IDs — the data present but wearing a machine&apos;s clothing.
          </p>
          <p className={P}>
            This converter produces the human copy: the same transactions, unwrapped into a clean statement document — date, description and amount in rows anyone can scan, with the period&apos;s Total in, Total out and Net computed from those rows at the end. Nothing is retyped, nothing is reworded, and no QuickBooks license is needed on either side of the exchange. The pair has a clear division of labor: the QBO stays your importable original, the file of record for the software; the PDF becomes the readable copy, the file of record for people.
          </p>
          <p className={P}>
            One boundary should be understood before the PDF is sent anywhere: it is a rendering by this converter, and it says so — the document is titled with your source file&apos;s name and “converted by ConvertStatement,” and its footer carries the same attribution. It is not a bank-issued statement, it shows no account number, and it prints no opening or closing balance. For most record-keeping that is a feature — the document claims exactly what it is. For the few purposes where a bank&apos;s own letterhead is the requirement, section three is explicit about which document to reach for instead.
          </p>

          <h2 className={H2M}>How to convert QBO to PDF with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Get the QBO file.</strong> Use the Web Connect file as downloaded from the bank. It is worth pausing on which file you feed in, because the PDF can only ever show what the QBO contains: a QBO for one month renders one month, and a file with an incomplete download renders an incomplete statement with complete confidence. If the period matters, confirm the QBO&apos;s date coverage first — the <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a> inspects a file&apos;s structure and contents without changing it.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload it.</strong> Drop the .qbo into the tool at the top of this page — one file, up to 10 MB, no account needed. The file is processed in memory and never stored.
          </p>
          <p className={P}>
            <strong>Step 3 — Convert.</strong> Press <strong>Convert to PDF</strong>. The converter reads the transactions out of the QBO&apos;s OFX structure and lays them onto letter-size pages: a title naming the source file, a Date / Description / Amount table with one row per transaction in the file&apos;s order, and a closing totals block — Total in (the sum of the positive amounts), Total out (the sum of the money out) and Net. Amounts are printed exactly as recorded, formatted with thousands separators and two decimals; no currency conversion is applied and no descriptions are rewritten. Very long bank descriptions are shortened with an ellipsis where a row would otherwise overflow the page — the one place the document abbreviates rather than reproduces, and worth knowing if a payee name matters legally.
          </p>
          <p className={P}>
            <strong>Step 4 — Download and file it with its source.</strong> The PDF downloads automatically, fully free, with the converted transaction count in the confirmation — a quick completeness check against the QBO. Save the PDF alongside the original QBO, under names that keep the pair together: the PDF is what you send, print and attach; the QBO is what you would re-import or re-render from. Every page of the PDF is numbered, so a printed copy filed out of order is easy to detect.
          </p>

          <h2 className={H2M}>When a QBO to PDF conversion disappoints</h2>
          <h3 className={H3}>“There&apos;s no balance and no account number on it”</h3>
          <p className={P}>
            Correct, and deliberate. Even though a QBO may carry a ledger balance internally, this document renders the transaction list and the totals computed from it — not bank identity, not balances. That keeps the PDF safe to circulate (there is no account number to leak) and honest about its provenance. When the person asking needs the account identified and a bank-certified balance — a lender verifying funds is the standard case — the bank&apos;s own issued statement is the right document, and this PDF serves as the working summary next to it, not instead of it.
          </p>
          <h3 className={H3}>The totals do not match the bank&apos;s statement</h3>
          <p className={P}>
            The totals are arithmetic over the rows in the file, so a mismatch almost always means the file and the statement cover different data: the QBO was downloaded for a narrower range than the statement month, it includes pending items the statement excludes (or the reverse), or the bank regenerated the download after some transactions changed. Compare row counts and the first and last dates before suspecting the math — the PDF&apos;s Total in, Total out and Net are computed from exactly the rows printed above them, so if the rows are right, the totals are right.
          </p>
          <h3 className={H3}>A description is cut off</h3>
          <p className={P}>
            Banks stuff descriptions with location codes, trace numbers and truncated merchant names, and some run long. The layout fits each row to the page width and shortens an over-long description with an ellipsis rather than wrapping it into the amounts. If the full text of one specific transaction matters — a disputed charge, say — the complete string lives in the original QBO and in the spreadsheet version from the <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a>, where nothing is abbreviated.
          </p>
          <h3 className={H3}>Someone tries to reconcile from the PDF</h3>
          <p className={P}>
            The PDF is for reading, not for working in: its figures are print, not data. A bookkeeper who needs to sort, filter, match or import should be given the QBO itself, or the CSV rendering of it — handing them the PDF makes them retype your file, which defeats the entire point of having a machine-readable original. Send both files when the recipient&apos;s job is ambiguous: the PDF for their eyes, the QBO for their software.
          </p>

          <h2 className={H2M}>Which rendering of a QBO do you need?</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>You need…</th>
                  <th className={TH}>Use</th>
                  <th className={TH}>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={TD}>A document a client, auditor or loan file can read and keep</td>
                  <td className={TD}>This PDF converter</td>
                  <td className={TD}>Readable anywhere, prints cleanly, carries totals and page numbers — no software required</td>
                </tr>
                <tr>
                  <td className={TD}>The transactions as data — to sort, filter, match or re-import elsewhere</td>
                  <td className={TD}>The QBO to CSV converter</td>
                  <td className={TD}>The same rows as a spreadsheet, with full untruncated descriptions and the transaction IDs the PDF leaves behind</td>
                </tr>
                <tr>
                  <td className={TD}>The activity inside QuickBooks Desktop&apos;s IIF workflow</td>
                  <td className={TD}>The QBO to IIF converter</td>
                  <td className={TD}>Rebuilds the transactions as Desktop TRNS/SPL entries instead of a document</td>
                </tr>
                <tr>
                  <td className={TD}>An official statement with the bank&apos;s identity and certified balance</td>
                  <td className={TD}>The bank&apos;s own statement download</td>
                  <td className={TD}>Only the bank can issue that document; a conversion can summarize its data but cannot certify it</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The same rendering exists for the rest of the family: the <a href="/tools/ofx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to PDF converter</a> for a bank&apos;s raw OFX download, the <a href="/tools/qfx-to-pdf" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to PDF converter</a> for Quicken files, and the <a href="/tools/qbo-to-iif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to IIF converter</a> mentioned above when the destination is Desktop rather than a reader. Between them, a machine file never has to stay machine-only.
          </p>
        </>
      }
    />
  );
}
