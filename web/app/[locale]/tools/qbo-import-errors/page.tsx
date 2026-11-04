import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { SampleDownloads } from "@/components/tools/SampleDownloads";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-import-errors";

export const metadata: Metadata = {
  title: "QBO Import Errors, Explained — Why QuickBooks Rejects a QBO File | Convert Statement",
  description:
    "QuickBooks rejected your QBO file? Find the error — duplicate transaction IDs, ledger-balance mismatch, invalid dates, missing statement period — and the exact fix for each, plus sample files to test with. Free, no account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QBO Import Errors, Explained",
    description:
      "Every common QuickBooks import error, what it actually means, and how to fix it — with sample files to test against.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Why does QuickBooks say my QBO file has duplicate transactions?",
    a: "QuickBooks identifies imported transactions by their FITID (transaction ID). When two rows share one FITID, QuickBooks treats the second as already imported and skips it, or rejects the file. The QBO Duplicate Finder lists every repeated ID; its cleaned QBO download (Pro) drops exact duplicates and regenerates missing IDs.",
  },
  {
    q: "What does a ledger-balance mismatch mean?",
    a: "The closing balance in the file (LEDGERBAL) does not agree with its transactions, or with the balance QuickBooks already holds for that account. Compare it with the statement's closing balance, and confirm the import account — a checking file sent to savings produces exactly this error.",
  },
  {
    q: "My file imports but the transactions are missing. What happened?",
    a: "Usually one of two causes: the file's statement period (DTSTART–DTEND) covers dates QuickBooks already imported, so rows were silently skipped as duplicates; or the transactions landed in the wrong account. Check the account first, then the period, then run the cleanup checker to see whether those FITIDs were already used.",
  },
  {
    q: "What if QuickBooks says the file is not a valid Web Connect file?",
    a: "QuickBooks accepts OFX 1.02 files with a .qbo extension and, for US accounts, USD currency. A file saved as .ofx, a Quicken QFX file renamed to .qbo, or a file with a non-USD currency tag will be refused. Re-export as QBO with a QuickBooks converter, and check the extension first.",
  },
  {
    q: "Can I fix a broken QBO by editing it in a text editor?",
    a: "For one small problem, yes: a duplicated FITID can be made unique, and a wrong closing balance can be corrected to match the statement. But OFX is unforgiving — one broken tag corrupts the file. Beyond a row or two, use the cleanup checker, then verify with the QBO checker before importing.",
  },
  {
    q: "What does 'Unable to verify financial institution' mean?",
    a: "QuickBooks checks the file's bank ID (INTU.BID) against Intuit's list before accepting it. A missing, mistyped, or delisted ID triggers this message even if every transaction is correct. Regenerate the file with a valid bank ID, or repair it with the OFX to QBO fixer.",
  },
  {
    q: "What is error OL-222 in QuickBooks Desktop?",
    a: "OL-222 is Desktop's way of saying the file is not a valid Web Connect file: the OFX structure is malformed — a broken or missing tag, a truncated download, or content that was never OFX. Re-download the file untouched, or run it through the QBO File Checker to find where the structure breaks.",
  },
  {
    q: "Why does QuickBooks reject my CSV for being too large?",
    a: "QuickBooks Online caps direct CSV uploads at 350 KB, and a year of busy account activity sails past that. Convert the CSV to QBO instead — the cap does not apply the same way — or split the export into monthly files and import them one at a time, checking each before the next.",
  },
  {
    q: "My transactions imported with money in and money out reversed. Why?",
    a: "The sign convention flipped somewhere: either the bank exports money out as positive numbers, or separate debit and credit columns were mapped in the wrong order during conversion. Delete the imported batch, fix the mapping in the file, and re-import — do not correct it entry by entry.",
  },
  {
    q: "Is my data uploaded or stored when I use the checkers linked here?",
    a: "No. The checkers linked from this page process files in memory to build their reports, and nothing is stored afterwards — the sample files on this page are the only downloads involved. We never sell or share your financial data, and you can test everything with the samples first.",
  },
];

const HOWTO = [
  { title: "Note the exact error", body: "Write down what QuickBooks says and which file it refuses — the message points at the row below." },
  { title: "Find it in the table", body: "Match your error to a row in the decoder table and read what it actually means." },
  { title: "Fix the file, not the books", body: "Fix the file with the cleanup checker (or a careful text edit for one or two rows) — never force the import and fix the books afterwards." },
  { title: "Verify before re-importing", body: "Run the fixed file through the QBO checker. A clean report means the re-import should go through." },
];

const ERRORS: { title: string; meaning: string; fix: string }[] = [
  {
    title: "Duplicate transaction ID (FITID)",
    meaning: "Two or more rows share one FITID. QuickBooks treats a repeated ID as already imported and skips or rejects the later rows, so real transactions go missing.",
    fix: "Run the file through the QBO Duplicate Finder and download the cleaned QBO (Pro): exact duplicates are dropped and missing or repeated IDs are regenerated. For a single row, change its FITID to a unique value by hand.",
  },
  {
    title: "Ledger-balance mismatch",
    meaning: "The file's closing balance (LEDGERBAL) disagrees with the transactions in the file, or with the balance QuickBooks already holds for that account.",
    fix: "Compare the file's closing balance with the statement's closing balance, and confirm you are importing into the correct account. If the file is yours, regenerate it from the statement rather than editing the balance.",
  },
  {
    title: "Missing closing balance",
    meaning: "The file has no LEDGERBAL block. Some imports accept this; others warn or refuse, and reconciliation has no target to aim at.",
    fix: "Regenerate the file from a converter that embeds the closing balance, or add the statement's closing balance as the LEDGERBAL with the statement's end date.",
  },
  {
    title: "Invalid or missing transaction date",
    meaning: "A row's DTPOSTED is empty, malformed, or outside the statement period. QuickBooks cannot place the transaction, so the import stops or the row is dropped.",
    fix: "Find the row in the cleanup report, correct its date to the statement date, and make sure every date falls inside the file's DTSTART–DTEND period.",
  },
  {
    title: "Missing statement period",
    meaning: "The file declares no DTSTART or DTEND, so QuickBooks cannot tell which month the transactions belong to and may treat them as already imported.",
    fix: "Regenerate the file with the statement's start and end dates, or add DTSTART and DTEND matching the statement period.",
  },
  {
    title: "Duplicate transactions, different IDs",
    meaning: "The same date, amount, and payee appear twice with different FITIDs — a double export or a typed-twice entry. QuickBooks imports both, and the account is overstated.",
    fix: "The cleanup checker flags these as exact matches (not FITID duplicates). Delete one copy from the file — or from QuickBooks if it already imported — and check the statement to be sure it is really one transaction.",
  },
  {
    title: "Not a valid Web Connect file",
    meaning: "QuickBooks expects OFX 1.02 with a .qbo extension and USD currency (for US accounts). A renamed .ofx or .qfx file, or a non-USD currency tag, is refused outright.",
    fix: "Re-export as QBO from a QuickBooks-targeted converter and confirm the extension is .qbo before importing. Do not just rename another format's file.",
  },
  {
    title: "Corrupt or truncated file",
    meaning: "The file ends mid-transaction, has a broken tag, or is not OFX at all (for example, a CSV saved with a .qbo extension). The parser fails before any row is read.",
    fix: "Re-download or regenerate the file. If you edited it by hand, restore the original and use the cleanup checker instead of editing tags directly.",
  },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QboImportErrorsPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Reference"
      title="QBO Import Errors, Explained"
      subtitle="QuickBooks rejected your file? Find the error below, learn what it actually means, and fix the file — not your books."
      tool={
        <div className="rounded-[20px] border border-brand-border bg-brand-surface shadow-sm p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Test with sample files</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Download a clean file and a broken file, run them through the checkers, and see
            exactly what each report looks like — before you touch your real books.
          </p>
          <div className="mt-4">
            <SampleDownloads />
          </div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
            Then check your own file:{" "}
            <a href="/tools/qbo-checker" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QBO File Checker</a>
            {" "}for structure and balances,{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QBO Duplicate Finder</a>
            {" "}for duplicates. Both are free with no account.
          </p>
        </div>
      }
      currentPath="/tools/qbo-import-errors"
      faqs={FAQS}
      howToName="How to diagnose a rejected QBO file"
      howToSteps={HOWTO}
      privacyLine="Free reference · Sample files only, nothing uploaded"
      content={
        <>
          <h2 className={H2}>How to read a QuickBooks error message</h2>
          <p className={P}>
            Every import error is a statement about a file, not about your books — and the fix is
            almost always in the file. The message names a symptom; the cause sits in one of four
            places: the file's identity (its bank ID), its structure (the OFX tags), its contents
            (dates, amounts, transaction IDs), or its size. QuickBooks Desktop reports most of these
            as OL codes; QuickBooks Online uses plain sentences for the same underlying checks.
          </p>
          <p className={P}>
            Before you change anything, do three things. Copy the exact wording or code — small
            differences point to different causes. Check the file before you check the account: run
            it through a checker and read what is actually inside it. And fix the file rather than
            forcing the import, because a forced import moves the problem into your books, where it
            is ten times harder to remove. The catalogue below works through the messages in the
            order people meet them.
          </p>

          <h2 className={H2M}>Bank identity: "Unable to verify financial institution"</h2>
          <h3 className={H3}>The INTU.BID check</h3>
          <p className={P}>
            Before QuickBooks reads a single transaction, it checks the bank ID inside the file —
            the INTU.BID value — against Intuit's own list of financial institutions. If the ID is
            missing, mistyped, or belongs to a bank Intuit no longer lists, the import stops here,
            even when every transaction in the file is perfect. This is the most common reason a
            file produced by a generic converter is refused. The fix is in the file: regenerate it
            with a valid bank ID for your bank, or repair the ID in place with the{" "}
            <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO fixer</a>.
            Renaming another bank's file does not work — the ID and the account have to agree.
          </p>

          <h2 className={H2M}>Broken structure: OL-222 and "Not a valid Web Connect file"</h2>
          <p className={P}>
            OL-222 is QuickBooks Desktop's code for a file whose OFX structure it cannot parse. A
            QBO file is a text file of nested tags; one broken, unclosed, or missing tag — or a
            download that was cut off halfway — makes the whole file unreadable, so QuickBooks
            refuses it before looking at any transaction. The same refusal catches files that were
            never OFX at all: a CSV saved with a .qbo extension, or a Quicken QFX file renamed to
            .qbo. Re-download the file untouched and check its real size and extension. If a clean
            copy still fails, run it through the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            to find exactly where the structure breaks, then regenerate the file instead of editing
            tags by hand.
          </p>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-spreadsheet.webp" alt="Rows of a bank CSV export with dates, descriptions and amounts — the raw material a QBO file is built from, where most import errors begin" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">Most import errors start as ordinary spreadsheet rows — a flipped sign, a mixed date format, a missing column.</figcaption>
          </figure>

          <h2 className={H2M}>Connection errors: OL-155 and failed downloads</h2>
          <h3 className={H3}>OL-155: the account, not the file</h3>
          <p className={P}>
            OL-155 appears when Desktop cannot complete the online-services request for that
            account — typically because the account's bank connection was deactivated, or the bank
            now directs you to set the connection up again. The file itself is often fine. In
            Desktop, deactivate the account's online services and reactivate them, or import the
            file into a newly created account and merge afterwards.
          </p>
          <h3 className={H3}>"There was a problem with the download"</h3>
          <p className={P}>
            This generic message covers everything QuickBooks could not categorize: an interrupted
            download that truncated the file, a browser that quietly renamed it (look for
            file.qbo.txt), or a temporary failure mid-import. Re-download the file, confirm the
            extension is exactly .qbo and the size matches the source, and import again before
            assuming the file's contents are at fault.
          </p>

          <h2 className={H2M}>Content errors: missing info and oversized files</h2>
          <h3 className={H3}>"Some of the info in the file is missing"</h3>
          <p className={P}>
            QuickBooks Online's verdict on a CSV whose shape it cannot read: a header row it does
            not recognize, numbers typed inside the description column, amounts with currency
            symbols, blank cells in required columns, or two different date formats in one file.
            Fix the shape — three columns (Date, Description, Amount) or four with separate Credit
            and Debit, one date format, plain numbers — or skip the fight and convert the CSV to
            QBO, where the structure is carried inside the file.
          </p>
          <h3 className={H3}>File too large</h3>
          <p className={P}>
            Direct CSV uploads to QuickBooks Online stop at 350 KB, which a single busy year
            easily exceeds. Convert the file to QBO instead, or split the export into monthly
            files and import them in order, checking each one lands before starting the next.
          </p>

          <h2 className={H2M}>After it imports: duplicates and reversed signs</h2>
          <h3 className={H3}>Duplicate transactions detected</h3>
          <p className={P}>
            QuickBooks deduplicates on each transaction's FITID, so a true re-import of the same
            file should add nothing. Duplicates get through when a converter regenerates fresh IDs
            on every export — the same rows arrive wearing new IDs and import a second time. The{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO Duplicate Finder</a>{" "}
            lists both kinds: repeated IDs, and look-alike rows with the same date, amount, and
            payee under different IDs.
          </p>
          <h3 className={H3}>Money in and money out are reversed</h3>
          <p className={P}>
            The import succeeded and every amount is backwards: deposits show as withdrawals. The
            sign convention flipped — the bank exports money out as positive, or debit and credit
            columns were mapped in the wrong order. Delete the imported batch, correct the mapping
            in the file, and re-import; fixing it entry by entry inside QuickBooks takes hours and
            usually misses one.
          </p>

          <h2 className={H2M}>Fix the file, not the books</h2>
          <p className={P}>
            The reliable order of work is always the same. First, check: the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            reads the file's structure, balances, period, and IDs and tells you which of the four
            failure areas you are in. Second, fix: duplicates and IDs in the cleanup checker, bank
            IDs and broken OFX in the{" "}
            <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO fixer</a>,
            shape problems by re-converting from the original export. Third, verify the fixed file
            with the checker again. Only then re-import. Every error in this catalogue is cheaper
            to fix at the file stage than after it has posted to your accounts.
          </p>

          <h2 className={H2M}>Pre-import checklist</h2>
          <p className={P}>
            Sixty seconds against this list prevents nearly every error above:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Check</th>
                  <th className={TH}>What goes wrong otherwise</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Extension is .qbo, format is OFX 1.02</strong></td><td className={TD}>OL-222 / "not a valid Web Connect file"</td></tr>
                <tr><td className={TD}><strong>Bank ID (INTU.BID) is present and matches your bank</strong></td><td className={TD}>"Unable to verify financial institution"</td></tr>
                <tr><td className={TD}><strong>Closing balance matches the statement</strong></td><td className={TD}>Ledger-balance mismatch; reconciliation starts off target</td></tr>
                <tr><td className={TD}><strong>Every date sits inside the statement period</strong></td><td className={TD}>Rows skipped as already imported, or beginning-balance errors</td></tr>
                <tr><td className={TD}><strong>No repeated transaction IDs</strong></td><td className={TD}>Real transactions silently skipped as duplicates</td></tr>
                <tr><td className={TD}><strong>Signs follow the convention: money out negative</strong></td><td className={TD}>Deposits and withdrawals import reversed</td></tr>
                <tr><td className={TD}><strong>File size fits the route (350 KB for direct CSV)</strong></td><td className={TD}>Upload refused before it starts</td></tr>
                <tr><td className={TD}><strong>The right account is selected at import</strong></td><td className={TD}>A checking file posts into savings; balances mismatch</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>The decoder table: file-level problems at a glance</h2>
          <p className={P}>
            The catalogue above covers the messages QuickBooks shows. This table covers the
            problems inside the file itself — the ones a checker finds before QuickBooks has to.
          </p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-5 py-3 font-semibold">Error</th>
                  <th className="px-5 py-3 font-semibold">What it actually means</th>
                  <th className="px-5 py-3 font-semibold">How to fix it</th>
                </tr>
              </thead>
              <tbody>
                {ERRORS.map((e) => (
                  <tr key={e.title} className="border-b border-zinc-100 dark:border-zinc-800 align-top">
                    <td className="px-5 py-3 font-bold text-zinc-900 dark:text-white whitespace-nowrap">{e.title}</td>
                    <td className="px-5 py-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">{e.meaning}</td>
                    <td className="px-5 py-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">{e.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Still stuck after fixing the file? The{" "}
            <a href="/tools/reconciliation-finder" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">Reconciliation Difference Finder</a>{" "}
            compares a statement against a QuickBooks export and shows exactly which entries
            do not line up — and our{" "}
            <a href="/services/quickbooks-cleanup" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QuickBooks cleanup service</a>{" "}
            takes the whole mess off your hands with a free assessment first.
          </p>
        </>
      }
    />
  );
}
