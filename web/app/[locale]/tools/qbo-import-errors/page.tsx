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
    a: "QuickBooks identifies every imported transaction by its FITID (financial institution transaction ID). When two rows share one FITID, QuickBooks treats the second as already imported and skips it — or rejects the file. Run the file through the QBO Duplicate Finder: it lists every repeated ID, and the cleaned QBO download (Pro) drops the exact duplicates and regenerates missing IDs.",
  },
  {
    q: "What does a ledger-balance mismatch mean?",
    a: "The file's closing balance (LEDGERBAL) does not agree with the transactions inside it, or with the balance QuickBooks already has for that account. Check the statement's closing balance against the file's last balance, and make sure you are importing into the right account — a file for checking imported into savings produces exactly this error.",
  },
  {
    q: "My file imports but the transactions are missing. What happened?",
    a: "Two usual causes: the statement period (DTSTART–DTEND) in the file covers dates QuickBooks already imported, so the rows were silently skipped as duplicates; or the transactions were imported into the wrong account. Check the account first, then the period, then run the cleanup checker to see whether the FITIDs were already used.",
  },
  {
    q: "What if QuickBooks says the file is not a valid Web Connect file?",
    a: "QuickBooks only accepts OFX 1.02 files with a .qbo extension and USD currency for US accounts. A file saved as .ofx, a QFX (Quicken) file renamed to .qbo, or a file with a non-USD currency tag will be refused. Re-export as QBO from a converter that targets QuickBooks, and check the extension before importing.",
  },
  {
    q: "Can I fix a broken QBO by editing it in a text editor?",
    a: "For small, well-understood problems — yes: a duplicated FITID can be changed to a unique one, and a wrong closing balance can be corrected to the statement's closing balance. But editing OFX by hand is error-prone: one broken tag corrupts the whole file. For anything beyond one or two rows, use the cleanup checker and its cleaned download instead, then verify with the QBO checker before importing.",
  },
  {
    q: "Is my data uploaded or stored when I use the checkers linked here?",
    a: "No. Files are processed in memory and are not stored afterwards. We never sell or share your financial data.",
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

export default function QboImportErrorsPage() {
  return (
    <ToolPageLayout
      eyebrow="Free Reference"
      title="QBO Import Errors, Explained"
      subtitle="QuickBooks rejected your file? Find the error below, learn what it actually means, and fix the file — not your books."
      tool={
        <div className="rounded-3xl border border-brand-border bg-brand-surface shadow-sm p-6">
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
            <a href="/tools/qbo-checker" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">QBO File Checker</a>
            {" "}for structure and balances,{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">QBO Duplicate Finder</a>
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
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">The decoder table</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            QuickBooks error messages describe the file, not your books — and the fix is
            almost always in the file. Work through the table from the top: fix the file,
            verify it with a checker, and only then re-import.
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
            <a href="/tools/reconciliation-finder" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Reconciliation Difference Finder</a>{" "}
            compares a statement against a QuickBooks export and shows exactly which entries
            do not line up — and our{" "}
            <a href="/services/quickbooks-cleanup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">QuickBooks cleanup service</a>{" "}
            takes the whole mess off your hands with a free assessment first.
          </p>
        </>
      }
    />
  );
}
