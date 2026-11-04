import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qfx-to-ofx";

export const metadata: Metadata = {
  title: "QFX to OFX Converter — Free | Convert Statement",
  description: "Convert a Quicken QFX file back to generic OFX — the standard form other finance apps import — with the source file's bank identity kept. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QFX to OFX Converter — Free",
    description: "Upload a QFX file and download it as OFX — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What is the difference between QFX and OFX?",
    a: "OFX — Open Financial Exchange — is the generic standard banks and finance software exchange statements in. QFX is Quicken’s variant of that same structure, carrying an Intuit institution identity Quicken uses to tie the file to a bank. The transaction content is the same family of data; the variant decides which programs accept the file by name.",
  },
  {
    q: "Does converting remove the Quicken institution ID from the file?",
    a: "No, and this page will not pretend otherwise. The rebuilt OFX keeps the source file’s account number and, when the QFX carries an institution ID, writes that identity into the output as an FI block. What changes is the form: a clean OFX 1.02 statement with a .ofx name, chronological transactions and full timestamps. If your target software specifically rejects files containing an institution block, this conversion does not strip it — that is a different edit.",
  },
  {
    q: "Does the account number and closing balance carry over?",
    a: "Yes to both, on the same condition: they are carried over when the source QFX states them. The account number is written into the OFX so an importer can match the statement to the account you already have set up, and a stated ledger balance is written with its as-of date. Neither is ever invented when the source leaves it out.",
  },
  {
    q: "Will other finance software definitely import the result?",
    a: "Software that imports OFX 1.02 bank statements gets a file in exactly that form, which is the widest-read version of the standard. No converter can guarantee a particular app’s importer — programs differ in how strictly they read the format — but converting to the generic standard removes the Quicken-variant objection, which is the one this page can honestly remove.",
  },
  {
    q: "Can I just rename the .qfx file to .ofx?",
    a: "You can, and some lenient importers will read the result, because the underlying structure is one family. What renaming cannot do is rebuild the statement: order, date precision and header shape all stay exactly as Quicken’s exporter wrote them. This converter rebuilds the contents into a clean OFX 1.02 statement and then names it .ofx.",
  },
  {
    q: "Is this converter free, and is my file stored?",
    a: "Yes, it is fully free with no account. Your file is processed in memory to build the OFX and is never stored afterwards.",
  },
];

const HOWTO = [
  { title: "Take the QFX your bank or Quicken gave you", body: "Use the Quicken-format download for the account and period your other software needs." },
  { title: "Upload the .qfx file here", body: "Drop it into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Press Convert to OFX", body: "The statement is rebuilt as a clean OFX 1.02 file: chronological order, full timestamps, and the source file’s account number, institution identity and closing balance carried over when present." },
  { title: "Import the .ofx into your other software", body: "Use that program’s OFX or bank-statement import, and when it asks, match the statement to the existing account for the account number the file carries." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QfxToOfxPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QFX to OFX Converter"
      subtitle="Convert a Quicken QFX file back to generic OFX — the standard form other finance apps import — with the source file's bank identity kept. Fully free with no account."
      tool={<FormatConverter tool="qfx-to-ofx" fromLabel="QFX" toLabel="OFX" accept=".qfx" outputExt="ofx" />}
      currentPath="/tools/qfx-to-ofx"
      faqs={FAQS}
      howToName="How to convert QFX to OFX"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>The Quicken download is fine — your other software just wants plain OFX</h2>
          <p className={P}>
            Leaving Quicken rarely happens in one step. The new finance app is chosen, the accounts are set up, and then the history problem arrives: months or years of bank downloads exist only as QFX, Quicken’s variant, and the new software imports OFX — the generic Open Financial Exchange standard — while declining the Quicken file in front of it. The data is not wrong, obsolete or locked in any deep sense. It is wearing the wrong variant of its own format, and this page changes the variant.
          </p>
          <p className={P}>
            Because “stripping the Quicken wrapper” is the phrase people reach for, here is exactly what is and is not stripped. Stripped: the .qfx identity itself — the output is rebuilt from the transactions up as a clean OFX 1.02 statement file, transactions in chronological order, posting dates expanded to full timestamps, in the generic shape non-Quicken software reads. Not stripped: your bank identity. The account number is carried over so the new app can match the statement to your account, and an institution ID present in the QFX is written into the OFX as its FI block rather than deleted. Deleting it would make the file less able to identify the account it belongs to, and no importer is helped by that. If a specific program objects to the institution block itself, that is a different repair — and it is better to know it here than to discover a silent claim was wrong.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Aspect</th><th className={TH}>In the OFX you download</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Format</strong></td><td className={TD}>OFX 1.02 statement, rebuilt header, with a .ofx filename — the generic form, not the Quicken variant</td></tr>
                <tr><td className={TD}><strong>Transactions</strong></td><td className={TD}>All transactions read from the QFX, sorted chronologically, amounts copied exactly with no currency conversion</td></tr>
                <tr><td className={TD}><strong>Transaction IDs (FITID)</strong></td><td className={TD}>Kept unchanged, so an importer that tracks IDs sees the bank’s own; a missing ID is generated from the transaction’s date, description and amount</td></tr>
                <tr><td className={TD}><strong>Account and institution</strong></td><td className={TD}>Account number carried over; institution identity written as an FI block when the source carries one</td></tr>
                <tr><td className={TD}><strong>Closing balance</strong></td><td className={TD}>Carried over with its as-of date when the QFX states one, giving the new app the same reconciliation target; absent when it does not</td></tr>
                <tr><td className={TD}><strong>Account shape</strong></td><td className={TD}>Written as a bank statement for a checking account — right for bank accounts, the wrong shape for a credit card QFX</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert QFX to OFX with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Confirm the target really wants OFX.</strong> Check your new software’s import options for a bank statement or OFX import before converting anything. Some programs accept QFX directly despite not advertising it, and a direct import always beats a conversion. This page is for the common case where the generic standard is the door that is actually open.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload the .qfx above.</strong> One file, up to 10 MB, no account. Convert period by period rather than in one giant file: the reader takes up to 500 transactions per conversion, and a migration done in monthly or quarterly statements is a migration you can verify as you go.
          </p>
          <p className={P}>
            <strong>Step 3 — Press Convert to OFX and note the count.</strong> The result panel reports the transactions in the rebuilt file. That count, file by file, is your migration ledger — when the new app has imported everything, its transaction totals per period should match the counts you noted here.
          </p>
          <p className={P}>
            <strong>Step 4 — Import, and match the account deliberately.</strong> In the target software, run its OFX import and, when it asks which account the statement belongs to, choose the account you set up for the account number the file carries. Letting an importer create a fresh account for a statement mid-migration splits one account’s history across two, and reuniting it later is painstaking.
          </p>
          <p className={P}>
            <strong>Step 5 — Work oldest to newest, reconciling as you go.</strong> Import the earliest period first and confirm the running position after each file against the bank statement for that period. The closing balance carried into each OFX gives the new app its target; a mismatch found at period two is a small investigation, while the same mismatch found after twelve periods is an archeological dig.
          </p>

          <h2 className={H2M}>When the generic OFX still does not import cleanly</h2>
          <h3 className={H3}>The target app rejects the file outright</h3>
          <p className={P}>
            Narrow down which objection remains, because the Quicken-variant objection is now gone. The rebuilt file is OFX 1.02 in its classic text form; an importer that only accepts the newer XML form of OFX will still refuse it, and that limitation belongs to the importer, not to your data. At that point the honest fallback is the data route: take the same transactions out as a spreadsheet through the <a href="/tools/qfx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to CSV converter</a> and use the target’s CSV import, accepting that IDs and balances do not travel that way.
          </p>
          <h3 className={H3}>A credit card QFX becomes a checking statement</h3>
          <p className={P}>
            The output is written in bank-statement form with a checking account type, whatever the source described — the same rebuilding rule as the other OFX-family outputs on this site. For the checking and savings accounts that make up most migrations, that is exactly right. For a card account it misdescribes the account to the new software, and the card history should enter through whatever card route the target app offers instead.
          </p>
          <h3 className={H3}>Transactions import twice into the new app</h3>
          <p className={P}>
            IDs are your protection and they survive conversion: the bank’s FITIDs are written through unchanged, so an importer with ID tracking can recognize a statement it has already taken, and a generated ID is derived from the transaction’s own data, so reconverting the same QFX produces the same ID rather than a fresh disguise. Duplicates that still appear almost always trace to an overlapping period imported from two different files — check the boundary dates before deleting, and delete the overlap, not a month.
          </p>
          <h3 className={H3}>A separate memo or check number did not arrive</h3>
          <p className={P}>
            The rebuilt file holds each transaction’s name; a memo that differs from the name, and a check number as its own field, do not cross over in this rebuild. For register migration that is normally invisible. If a specific transaction’s full text matters — a disputed payment, say — the original QFX remains the complete record, which is why migrations should archive the source files rather than discard them at the finish line.
          </p>
          <h3 className={H3}>The history has a gap at the end</h3>
          <p className={P}>
            Count the transactions. If a period’s OFX holds exactly 500, the source almost certainly held more, and the reader’s per-file limit — not the new app — is where the rest stopped. Re-download or split that period at the bank into smaller QFX files, convert each, and import the missing tail in order.
          </p>

          <h2 className={H2M}>Leaving the Quicken variant behind: the routes compared</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Route</th><th className={TH}>What it preserves</th><th className={TH}>Where it breaks</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Try importing the QFX directly</strong></td><td className={TD}>Everything, untouched, when the target quietly accepts the variant</td><td className={TD}>Most software that wants OFX refuses QFX by name — this is the first thing to test, not a plan</td></tr>
                <tr><td className={TD}><strong>Rename .qfx to .ofx</strong></td><td className={TD}>The file’s contents, exactly as exported</td><td className={TD}>Only the name becomes generic: ordering, date precision and header shape all stay in Quicken-export form</td></tr>
                <tr><td className={TD}><strong>Convert the QFX here</strong></td><td className={TD}>A rebuilt generic OFX 1.02 statement with IDs, account number and closing balance carried over, fully free</td><td className={TD}>Written as a checking bank statement, and the institution block is preserved rather than removed</td></tr>
                <tr><td className={TD}><strong>Go through CSV</strong></td><td className={TD}>The transactions as rows almost any importer accepts</td><td className={TD}>Transaction IDs, account identity and the closing balance are all left behind — duplicate protection goes with them</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            This conversion runs both ways: the <a href="/tools/ofx-to-qfx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QFX converter</a> takes a generic bank download into Quicken’s variant. From the generic OFX you now hold, QuickBooks is reached through the <a href="/tools/qfx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QBO converter</a> applied to the original file, a workbook through the <a href="/tools/qfx-to-excel" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to Excel converter</a>, and legacy software through the <a href="/tools/qfx-to-qif" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to QIF converter</a>.
          </p>
        </>
      }
    />
  );
}
