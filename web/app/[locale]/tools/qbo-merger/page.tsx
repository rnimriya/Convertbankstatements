import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { QboMerger } from "@/components/tools/QboMerger";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-merger";

export const metadata: Metadata = {
  title: "QBO File Merger — Combine QBO Files Free | Convert Statement",
  description:
    "Free QBO file merger: combine up to 10 QuickBooks Web Connect (.qbo), OFX or QFX files into one — transactions sorted by date, exact duplicates removed, closing balance carried over. Fully free, no account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QBO File Merger — Combine QBO / OFX / QFX Files into One",
    description:
      "Upload several QBO, OFX or QFX files and download one merged QBO, date-sorted with exact duplicates removed. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What does the QBO merger do?",
    a: "It reads up to 10 QBO, OFX or QFX files, pools every transaction into one list sorted by date, removes exact duplicates, and builds a single new QBO file you can import in one go. It is the opposite of the QBO splitter, which cuts one file into a smaller date range.",
  },
  {
    q: "Which files should I merge together?",
    a: "Files for the same bank account — typically consecutive statement downloads, like January's and February's QBO from the same checking account. The merged file carries one account number, so merging files from different accounts would put one account's transactions under another account's identity in QuickBooks.",
  },
  {
    q: "How are duplicates handled?",
    a: "A row is removed only when another row has the same transaction ID (FITID), the same date, and the same amount — the fingerprint of the overlap you get when two downloads cover some of the same days. Genuine repeat transactions (two identical purchases on the same day carry different FITIDs) are always kept, and rows with no FITID are never removed, because without an ID there is no proof they are duplicates.",
  },
  {
    q: "Where does the merged file's closing balance come from?",
    a: "From the statement with the latest period end in your set — that is the balance the merged period actually closes at. The account number is taken from your files as well. If none of the files carries a closing balance, the merged file has none either; the merger never invents one.",
  },
  {
    q: "Does the order I add the files matter?",
    a: "No. Transactions are sorted by date in the merged file regardless of upload order, the duplicate check looks across the whole pool, and the closing balance is chosen by statement period, not by position in the list.",
  },
  {
    q: "Can I merge credit card QBO files?",
    a: "Yes — credit card downloads use the same format with a credit-card section, and they merge the same way. The same-account rule applies with extra force: merge one card's files together, never two different cards.",
  },
  {
    q: "How many files and transactions can I merge?",
    a: "Up to 10 files at a time, each up to 10 MB. A merged file can hold up to 10,000 transactions — far beyond what a set of bank statement downloads normally contains. If you have more than 10 files, merge them in batches and merge the results.",
  },
  {
    q: "What if the files overlap by a few days?",
    a: "That is the case this tool is built for. Banks often include a few days from the previous period in a new download. The overlapping rows share FITIDs, so the exact-duplicate removal drops the second copy of each and the merged totals stay correct.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your files are parsed in memory to build the merged file and are not stored afterwards. We never sell or share your financial data, and both downloads are fully free with no account.",
  },
];

const HOWTO = [
  { title: "Add your statement files", body: "Drop in the .qbo, .ofx, or .qfx files for one account — up to 10 consecutive downloads." },
  { title: "Merge them", body: "The tool pools every transaction, removes exact duplicates from overlapping downloads, and sorts by date." },
  { title: "Review the summary", body: "Check the per-file counts, the duplicates removed, and the merged period before downloading." },
  { title: "Download the merged QBO", body: "Save the single combined file — fully free — and import it into QuickBooks once instead of file by file." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QboMergerPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QBO File Merger"
      subtitle="Combine up to 10 QuickBooks QBO, OFX, or QFX files into one — transactions pooled and sorted by date, exact duplicates from overlapping downloads removed. Fully free with no account."
      tool={<QboMerger />}
      currentPath="/tools/qbo-merger"
      faqs={FAQS}
      howToName="How to merge QBO files"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why merge QBO files?</h2>
          <p className={P}>
            Banks hand out history in slices. You wanted a year of transactions; the download
            page offered a month at a time, and now twelve QBO files sit in a folder, each
            waiting for its own import, its own review, its own chance to be the one you forgot.
            Or a bookkeeper receives a client's statements as four quarterly files when the
            engagement needs one continuous year. Importing slice by slice works — QuickBooks
            accepts each file — but every seam is a place for overlap, gaps, and doubt.
          </p>
          <p className={P}>
            Merging first turns the pile into a single statement: one file, one import, one
            period to reconcile. The merger pools the transactions from every file, sorts them
            by date, and rebuilds a clean OFX 1.02 QBO around them — the mirror image of the{" "}
            <a href="/tools/qbo-splitter" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO splitter</a>,
            which cuts one file down to a chosen date range.
          </p>

          <h2 className={H2M}>The overlap problem, and how duplicates are removed</h2>
          <p className={P}>
            The risk in any merge is the seam. Bank downloads rarely tile perfectly: February's
            file starts on January 30th, and suddenly three days of transactions exist twice.
            Import both copies and QuickBooks' own FITID protection catches most of it — but
            "most" is doing heavy lifting, and cleaning up afterwards inside QuickBooks is slow.
          </p>
          <p className={P}>
            So the merger dedupes before anything is built, on a strict rule: a row is dropped
            only when another row matches its transaction ID, its date, <em>and</em> its amount.
            All three together are the fingerprint of the same bank transaction downloaded
            twice. Anything weaker — same amount, same day, same shop — is kept, because real
            life is full of identical-looking purchases that are genuinely two transactions.
            Rows whose files carried no FITID are never removed at all. The summary tells you
            exactly how many rows were dropped, so the merge is auditable, not magic.
          </p>

          <h2 className={H2M}>What the merged file carries</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Part of the merged file</th>
                  <th className={TH}>Where it comes from</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Transactions</strong></td><td className={TD}>Every file pooled, exact duplicates removed, sorted by date</td></tr>
                <tr><td className={TD}><strong>Account number</strong></td><td className={TD}>Your files — the first account ID found in the set</td></tr>
                <tr><td className={TD}><strong>Closing (ledger) balance</strong></td><td className={TD}>The statement with the latest period end — the balance the merged period truly closes at</td></tr>
                <tr><td className={TD}><strong>Transaction IDs (FITIDs)</strong></td><td className={TD}>Carried over unchanged, so QuickBooks still recognises transactions it has seen before</td></tr>
                <tr><td className={TD}><strong>Format</strong></td><td className={TD}>Fresh OFX 1.02 Web Connect, whatever mix of OFX versions went in</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className={H2M}>One account at a time — the rule that matters</h2>
          <p className={P}>
            A QBO file is married to one account: its header names the account every transaction
            belongs to. The merged file inherits a single account number, so everything you pool
            must belong to that account. Merging two accounts' downloads would not produce a
            combined statement — it would produce one account's file containing another
            account's transactions, and QuickBooks would file them all under the wrong account.
            Merge per account: checking with checking, each credit card with itself.
          </p>
          <h3 className={H3}>Merging across a bank change</h3>
          <p className={P}>
            If the account moved banks mid-year — an acquisition, a rebrand, a new download
            portal — the two halves are still the same account, but the older files may carry
            the old bank's identity and a different account-number format. Merge those with
            extra care: check the per-file counts and the merged period in the summary, and run
            the result through the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            before importing, so any identity mismatch surfaces before QuickBooks sees the file.
          </p>

          <h2 className={H2M}>After the merge</h2>
          <p className={P}>
            The merged QBO imports exactly like a file from your bank — one Web Connect import
            covers the whole period. Because FITIDs survive the merge, importing it after some
            of the original files were already imported does not double-post: QuickBooks
            recognises the transactions it has. If you need the combined data as a spreadsheet
            instead — for a review pack or a migration — the CSV download holds the same merged,
            deduped rows in the same columns as the{" "}
            <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a>.
            And if a merged file turns out to span more than you need, the{" "}
            <a href="/tools/qbo-splitter" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">splitter</a>{" "}
            trims it back to the exact dates you want.
          </p>
        </>
      }
    />
  );
}
