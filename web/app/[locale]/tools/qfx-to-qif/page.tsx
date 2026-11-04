import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qfx-to-qif";

export const metadata: Metadata = {
  title: "QFX to QIF Converter — Free | Convert Statement",
  description: "Convert a modern Quicken QFX download into the legacy QIF format for older and specialist apps that still import it. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QFX to QIF Converter — Free",
    description: "Upload a QFX file and download it as QIF — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What exactly is lost when a QFX becomes a QIF?",
    a: "Everything except the transaction lines. The QIF this converter writes carries each transaction's date, amount and payee under a !Type:Bank header — and nothing else. The QFX's institution ID (INTU.BID), bank and account identity, currency, ledger balance and per-transaction IDs (FITIDs) have no place in the output, so none of them cross over.",
  },
  {
    q: "Why does losing the transaction IDs matter?",
    a: "A FITID is how Quicken recognises a transaction it has already imported. QIF has no equivalent field, so a QIF file carries no duplicate protection: import the same QIF twice into an app that does not check dates and amounts itself, and you can own two of everything. Convert only the period you need, and import each converted file once.",
  },
  {
    q: "Can current Quicken import the QIF I get here?",
    a: "Current Quicken is built around QFX for bank accounts, and QIF import into bank accounts has been restricted since Intuit moved Quicken to QFX in the mid-2000s. Keep your original QFX for Quicken itself. This conversion is for the older Quicken versions, GnuCash-style workflows and specialist apps that still ask for QIF by name.",
  },
  {
    q: "Do memos and check numbers survive?",
    a: "In this direction there is nothing to survive: the QFX reading used here takes each transaction's date, type, name and amount, and does not carry a separate memo or check number into the conversion. The QIF records therefore hold date, amount and payee only, each closed by a ^ line — which is what QIF-importing apps expect to read.",
  },
  {
    q: "Are amounts or dates changed during conversion?",
    a: "No. Amounts are copied exactly, to two decimal places, with money out negative, and dates are written in QIF's MM/DD/YYYY form converted from the dates in the QFX. No currency conversion is applied — and note that QIF records carry no currency marker, so the receiving app will assume its own default currency.",
  },
  {
    q: "Is this converter really free, and is my file stored?",
    a: "Yes — fully free with no account, for files up to 10 MB. Your file is processed in memory to build the QIF and is never stored, and we never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Get your QFX file", body: "Use the Quicken (.qfx) download from your bank for the account and period the older app needs — convert one statement period at a time." },
  { title: "Upload it here", body: "Drop the .qfx file into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Convert to QIF", body: "Press Convert to QIF. Each transaction is rewritten as a QIF record — D date, T amount, P payee, closed by a ^ line — under a !Type:Bank header." },
  { title: "Import it once, into the legacy app", body: "Save the .qif file and import it into the older app a single time. QIF has no duplicate protection, so do not re-import the same file to fix a mistake — delete the bad import first." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QfxToQifPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QFX to QIF Converter"
      subtitle="Convert a modern Quicken QFX download into the legacy QIF format for older and specialist apps that still import it. Fully free with no account."
      tool={<FormatConverter tool="qfx-to-qif" fromLabel="QFX" toLabel="QIF" accept=".qfx" outputExt="qif" />}
      currentPath="/tools/qfx-to-qif"
      faqs={FAQS}
      howToName="How to convert QFX to QIF"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Stepping a modern Quicken file back into the format older software reads</h2>
          <p className={P}>
            Most format conversions move data forward. This one deliberately moves it back. Your bank hands you a QFX — Quicken's current download format, an OFX file with an Intuit institution ID woven through it — but the software that needs your transactions predates that world. An older Quicken release kept for a long-running file, a GnuCash book, a specialist or long-abandoned finance app: what they share is that they import QIF, Quicken Interchange Format, the plain-text format Quicken used before QFX replaced it in the mid-2000s.
          </p>
          <p className={P}>
            QIF is a humbler format, and converting down to it means being honest about what it cannot carry. A QIF file has no bank ID — there is no INTU.BID, no institution block, no account identity at all. It has no transaction IDs, so it offers no duplicate protection on import. It carries no closing balance and no currency marker. What it carries, reliably, is the transaction list itself: a date, an amount and a payee per record. For an older app reconstructing an account's history, that list is the substance — and it crosses over complete.
          </p>
          <p className={P}>
            This page is for that specific errand: feeding current bank data into legacy software that is still doing a job. If your destination is current Quicken, you do not need a conversion at all — import the QFX as it is. If your destination is QuickBooks, use the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a> instead, which keeps the bank identity this page's output must drop.
          </p>

          <h2 className={H2M}>How to convert QFX to QIF with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Download the period you actually need.</strong> Export the .qfx from your bank for a defined date range — one statement period is the safest unit. Because the QIF you are about to make has no duplicate protection, a tight, known period is much easier to import cleanly than an everything-file you will be tempted to import twice.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload it.</strong> Drop the .qfx into the converter above. One file, up to 10 MB, no account. The file is processed in memory and never stored.
          </p>
          <p className={P}>
            <strong>Step 3 — Convert.</strong> Press Convert to QIF. The converter reads the OFX transactions inside the QFX and writes each one as a QIF record under a !Type:Bank header: a D line with the date in MM/DD/YYYY form, a T line with the amount to two decimal places (money out negative), and a P line with the payee, each record closed by a line containing only ^. The result panel reports how many transactions were converted — compare it with the count in your source before you import.
          </p>
          <p className={P}>
            <strong>Step 4 — Import once, then verify in the receiving app.</strong> Import the .qif into the older app a single time, then check the account total for the period against the bank's figure. That total check matters more here than in modern formats, because nothing in a QIF lets the receiving app catch a double import or a wrong account on your behalf.
          </p>
          <p className={P}>
            Working in the opposite direction as well? The <a href="/tools/csv-to-qif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QIF converter</a> builds QIF records from spreadsheet rows, and once data sits in QIF form it can come forward again through the <a href="/tools/qif-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to CSV converter</a> or the <a href="/tools/qif-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to QBO converter</a>.
          </p>

          <h2 className={H2M}>Problems and fixes specific to QFX to QIF</h2>
          <h3 className={H3}>Every transaction appears twice after import</h3>
          <p className={P}>
            The classic QIF failure, and the direct consequence of the format having no transaction IDs. A QFX protects itself — each transaction carries a FITID Quicken remembers — but the QIF conversion cannot pass that ID on, because QIF has no field for it. If the file was imported twice, or overlapped a period already entered, the receiving app had no way to refuse the second copy. The fix is procedural: remove the duplicated import in the app, then re-import the converted file once, for a period that does not overlap what is already there.
          </p>
          <h3 className={H3}>The receiving app assumes the wrong currency</h3>
          <p className={P}>
            Amounts cross over as bare numbers — QIF records do not name a currency — so an app set to a different default currency will present the same numbers in that currency. No conversion or exchange has happened; only the label changed. Set the account or app currency to match the bank account before importing, so the label is right from the start.
          </p>
          <h3 className={H3}>The older app splits deposits and withdrawals oddly</h3>
          <p className={P}>
            The QIF written here uses one signed T amount per record: negative for money out, positive for money in. Most QIF readers expect exactly that. If an older app instead expects separate treatment, the sign convention is the first thing to check in its import settings — the underlying amounts in the file are the bank's own figures, unchanged.
          </p>
          <h3 className={H3}>&ldquo;That file does not look like a QBO, OFX or QFX file&rdquo;</h3>
          <p className={P}>
            The converter validates the OFX structure inside the upload before converting. A file that fails is usually a renamed CSV or a truncated download. Re-export the .qfx from the bank using its Quicken download option and convert the fresh file.
          </p>

          <h2 className={H2M}>Going down to QIF, or somewhere else entirely?</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Destination</th>
                  <th className={TH}>Use</th>
                  <th className={TH}>What QIF does there</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={TD}>Older Quicken or legacy finance app</td>
                  <td className={TD}>This page — QFX to QIF</td>
                  <td className={TD}>Imports the transaction list; no bank ID, no duplicate protection</td>
                </tr>
                <tr>
                  <td className={TD}>Current Quicken</td>
                  <td className={TD}>No conversion — import the QFX directly</td>
                  <td className={TD}>QIF is the restricted legacy route; the QFX is the supported one</td>
                </tr>
                <tr>
                  <td className={TD}>QuickBooks</td>
                  <td className={TD}>QFX to QBO converter</td>
                  <td className={TD}>QIF is not a QuickBooks import format at all</td>
                </tr>
                <tr>
                  <td className={TD}>A spreadsheet, for review</td>
                  <td className={TD}>QFX to CSV converter</td>
                  <td className={TD}>Simpler than detouring through a legacy format you then have to escape</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The honest summary: QIF is a one-purpose bridge. Cross it when the receiving software genuinely asks for QIF, keep the original QFX as your complete copy — bank identity, transaction IDs and balance included — and use the <a href="/tools/qfx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to CSV converter</a> or the QFX to OFX converter when a modern destination needs the same transactions in a modern shape.
          </p>
        </>
      }
    />
  );
}
