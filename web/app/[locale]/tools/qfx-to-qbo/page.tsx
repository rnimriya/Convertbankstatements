import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { FormatConverter } from "@/components/tools/FormatConverter";

const PAGE_URL = "https://www.convertstatement.online/tools/qfx-to-qbo";

export const metadata: Metadata = {
  title: "QFX to QBO Converter — Free | Convert Statement",
  description: "Move a Quicken QFX download into QuickBooks as a QBO Web Connect file — same OFX family, with the source file's bank identity kept. Fully free with no account. Files are processed in memory and never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QFX to QBO Converter — Free",
    description: "Upload a QFX file and download it as QBO — dates, descriptions and amounts carried over exactly. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Why will QuickBooks not import my QFX file directly?",
    a: "QuickBooks imports its own Web Connect variant, the .qbo file. A QFX is Quicken’s variant of the same OFX family, written for a different program, so QuickBooks refuses it by name even though the transactions inside are in a structure it understands. Converting rebuilds that structure as a clean QBO rather than asking you to re-enter or re-download anything.",
  },
  {
    q: "Is the Intuit institution ID swapped for a QuickBooks one?",
    a: "No — it is kept, not swapped, and the distinction matters. The ID your QFX carries (its FID, surfaced as INTU.BID) is written into the QBO as the file’s institution identity, because there is no separate QuickBooks ID for your bank sitting in the file to swap in, and inventing one could point the import at the wrong bank. If your QFX carried no ID, the QBO carries none either.",
  },
  {
    q: "Does the closing balance carry over?",
    a: "Yes, when the source QFX states a ledger balance: the amount and its as-of date are carried into the QBO, so QuickBooks reconciliation keeps the bank’s target figure. If the QFX states none, the QBO has none — a balance is never invented to make the file look complete.",
  },
  {
    q: "Will importing the converted file twice create duplicates?",
    a: "The defence is the transaction IDs, and they survive: FITIDs from the QFX are written into the QBO unchanged, so QuickBooks can recognize a transaction it has already imported, and a transaction that had no ID is given one generated from its own date, description and amount — the same ID if you convert the same file again. One exception: IDs that were already duplicated inside the source QFX stay duplicated here. Repairing those is the fixer’s job, not this converter’s.",
  },
  {
    q: "Can I use this for a credit card QFX?",
    a: "Not safely. The rebuilt file is written as a bank statement for a checking account, whatever the source described, with the account number carried over. That is right for a bank account moving from Quicken to QuickBooks; for a card account it asks QuickBooks to treat card activity as a checking account, so use another route for card files.",
  },
  {
    q: "Is this converter free, and is my file stored?",
    a: "Yes, it is fully free with no account — unlike the main statement converter on this site, this format conversion has no Pro download step. Your file is processed in memory to build the QBO and is never stored afterwards.",
  },
];

const HOWTO = [
  { title: "Take the QFX the bank still offers", body: "Download the Quicken-format file for the account and period QuickBooks is missing — the fact that it is a QFX is the reason you are here, not a problem with the file." },
  { title: "Upload the .qfx file here", body: "Drop it into the converter above — one file, up to 10 MB, no account needed." },
  { title: "Press Convert to QBO", body: "The statement is rebuilt as a clean OFX 1.02 Web Connect file: chronological order, full timestamps, account number, institution ID and closing balance carried over when the source has them." },
  { title: "Import the .qbo into QuickBooks", body: "In QuickBooks Online, upload it from the bank transactions screen; in QuickBooks Desktop, import it as a Web Connect file. Check the converted transaction count against what loads, and link it to the existing account for that account number." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QfxToQboPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QFX to QBO Converter"
      subtitle="Move a Quicken QFX download into QuickBooks as a QBO Web Connect file — same OFX family, with the source file's bank identity kept. Fully free with no account."
      tool={<FormatConverter tool="qfx-to-qbo" fromLabel="QFX" toLabel="QBO" accept=".qfx" outputExt="qbo" />}
      currentPath="/tools/qfx-to-qbo"
      faqs={FAQS}
      howToName="How to convert QFX to QBO"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Your bank kept the Quicken download and dropped QuickBooks — the file you have still works</h2>
          <p className={P}>
            It happens in a particular, frustrating order. The business moves its books from Quicken to QuickBooks, or a bank quietly trims the formats on its download page, and one day the Web Connect option is simply gone — while the Quicken QFX download sits there exactly as it always did. The transactions you need exist, in a file you can download today, in a format your new software refuses by name. Re-downloading as QBO is not an option the bank offers anymore, and for older periods it was often never an option at all.
          </p>
          <p className={P}>
            The rescue works because the refusal is about the wrapper, not the data. QFX is Quicken’s variant of OFX, and a QBO file is OFX 1.02 underneath, so the same statement can be rebuilt in the form QuickBooks imports: same transactions, same account number, and — this is the part worth stating precisely — the same institution identity the QFX already carries. The ID is preserved, not swapped for a different one. Your bank’s FID from the Quicken file is written into the QBO’s institution block, because that number identifies your bank; there is no second, QuickBooks-flavored ID hidden in the file waiting to be substituted, and a converter that invented one would risk filing your statement under the wrong institution.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Part of the QFX</th><th className={TH}>In the QBO you download</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Transactions</strong></td><td className={TD}>All of them, reordered chronologically, with posting dates expanded to full OFX timestamps and amounts copied exactly</td></tr>
                <tr><td className={TD}><strong>Transaction IDs (FITID)</strong></td><td className={TD}>Kept unchanged, so QuickBooks duplicate detection works on the bank’s own IDs; a missing ID is generated from the transaction’s date, description and amount</td></tr>
                <tr><td className={TD}><strong>Account number</strong></td><td className={TD}>Carried over, so the import can be matched to the QuickBooks account for that account</td></tr>
                <tr><td className={TD}><strong>Institution ID (FID / INTU.BID)</strong></td><td className={TD}>Preserved from the source and written as the QBO’s institution block — never swapped, never invented, and absent if the source had none</td></tr>
                <tr><td className={TD}><strong>Closing balance</strong></td><td className={TD}>Carried over with its as-of date when the QFX states one, so reconciliation keeps its target; absent when the source states none</td></tr>
                <tr><td className={TD}><strong>Account shape</strong></td><td className={TD}>Written as a USD bank statement for a checking account — the Web Connect shape QuickBooks expects for a bank account</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>How to convert QFX to QBO with this converter</h2>
          <p className={P}>
            <strong>Step 1 — Download the QFX for the missing period.</strong> Take exactly the range QuickBooks does not yet have. Because the converted file keeps the bank’s transaction IDs, a modest overlap is survivable — QuickBooks can recognize what it has seen — but a full duplicate period still creates review work nobody needs.
          </p>
          <p className={P}>
            <strong>Step 2 — Upload the .qfx above.</strong> One file, up to 10 MB, no account, and nothing to map: the format labels its own fields, so the converter reads the statement directly.
          </p>
          <p className={P}>
            <strong>Step 3 — Press Convert to QBO and note the transaction count.</strong> The rebuild normalizes the header to OFX 1.02, sorts the transactions into chronological order, expands their dates to full timestamps, and carries the account number, institution identity and closing balance across when the source states them. The count on the result panel is the number that should appear when QuickBooks loads the file.
          </p>
          <p className={P}>
            <strong>Step 4 — Import it the way you would a bank download.</strong> In QuickBooks Online, go to the bank transactions screen and upload the file; in QuickBooks Desktop, import it through the Web Connect route. When QuickBooks asks which account the file belongs to, match it to the existing account for that account number rather than creating a new one.
          </p>
          <p className={P}>
            <strong>Step 5 — Reconcile against the bank’s figure, then keep both files.</strong> If the QFX carried a closing balance, the QBO carries it too, and reconciliation has its target. File the original QFX with the converted QBO: the QFX remains the bank’s artifact, and the QBO is your import copy. Before a first import of an important period, you can also run the result through the QBO File Checker on this site to inspect its structure and balance without changing it.
          </p>

          <h2 className={H2M}>When QuickBooks still says no to the converted file</h2>
          <h3 className={H3}>“Unable to verify your financial institution”</h3>
          <p className={P}>
            This message is about the institution ID, and it has two honest causes. Either the source QFX carried no ID — in which case the QBO has none either, because this converter preserves rather than invents — or the ID it carries is not one QuickBooks accepts for Web Connect imports. The repair route is the <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO converter and fixer</a>, where an ID copied from a working QBO downloaded from your own bank can be supplied explicitly. Never borrow an ID from a different bank’s file.
          </p>
          <h3 className={H3}>Error OL-222, or “not a valid Web Connect file”</h3>
          <p className={P}>
            OL-222 is a structure complaint. The rebuild on this page already normalizes the header and timestamps, which clears the common version of it; if the message persists, the source download itself was probably truncated, and no rebuild can restore transactions that never arrived. Re-download the QFX and convert the fresh copy.
          </p>
          <h3 className={H3}>Real transactions get skipped as duplicates</h3>
          <p className={P}>
            That is the signature of duplicated FITIDs inside the source file: two different transactions sharing one ID, so QuickBooks treats the second as already imported. This converter passes IDs through unchanged — deliberately, because the bank’s IDs are the good ones — which means it also passes a duplicated ID through. The fixer linked above regenerates repeated IDs deterministically; use it when the checker shows repeats, and use this direct conversion when it does not.
          </p>
          <h3 className={H3}>A card account’s QFX imports as a bank account</h3>
          <p className={P}>
            The output is written in bank-statement form with a checking account type, whatever the source described. For the bank-account rescue this page is built for, that is correct. For credit card history it is the wrong shape, and forcing it in will put card activity in a checking register — a mess that is much harder to unwind than to avoid.
          </p>
          <h3 className={H3}>The end of a long period never arrives</h3>
          <p className={P}>
            The reader takes up to 500 transactions from one file. Split a long migration into period-sized QFX downloads at the bank, convert each one, and import them oldest first, reconciling as you go, so a problem in one period is found while it is still one period’s problem.
          </p>

          <h2 className={H2M}>Getting Quicken data into QuickBooks: the routes compared</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Route</th><th className={TH}>What it gives you</th><th className={TH}>Where it breaks</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Ask the bank for a QBO download</strong></td><td className={TD}>The ideal file, when it exists</td><td className={TD}>The premise of this page is that it does not — the bank kept Quicken and dropped QuickBooks, or the period is too old to download</td></tr>
                <tr><td className={TD}><strong>Rename .qfx to .qbo</strong></td><td className={TD}>A file with the right name, in ten seconds</td><td className={TD}>Nothing inside is rebuilt: header version, short dates and ordering all reach QuickBooks exactly as Quicken’s exporter left them</td></tr>
                <tr><td className={TD}><strong>Convert the QFX here</strong></td><td className={TD}>A clean OFX 1.02 Web Connect file with IDs, account number and closing balance preserved, fully free</td><td className={TD}>The institution ID can only be preserved — a QFX without one can still meet the verify-institution refusal, which needs the fixer route</td></tr>
                <tr><td className={TD}><strong>Upload the data as CSV to QuickBooks Online</strong></td><td className={TD}>A route in, for Online only, after reshaping the data into columns</td><td className={TD}>CSV carries no transaction IDs and no closing balance, so duplicate protection and the reconciliation target are lost — and Desktop cannot use it for bank imports at all</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            Starting from a spreadsheet rather than a Quicken file, the <a href="/tools/csv-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">CSV to QBO converter</a> builds the Web Connect file from columns. Staying with this QFX but heading elsewhere, the <a href="/tools/qfx-to-ofx" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to OFX converter</a> produces generic OFX and the <a href="/tools/qfx-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QFX to CSV converter</a> produces the spreadsheet. Older Quicken data in QIF form reaches QuickBooks through the <a href="/tools/qif-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QIF to QBO converter</a>.
          </p>
        </>
      }
    />
  );
}
