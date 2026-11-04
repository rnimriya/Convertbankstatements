import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { QboSplitter } from "@/components/tools/QboSplitter";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-splitter";

export const metadata: Metadata = {
  title: "QBO File Splitter — Free Trim a QBO to a Date Range | Convert Statement",
  description:
    "Free QBO file splitter: upload a QBO, OFX, or QFX file, choose a date range, and download a trimmed QBO containing only those transactions, with the closing balance adjusted to the last kept transaction. Fully free, no account needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "QBO File Splitter — Trim a QBO File to a Date Range",
    description:
      "Upload a QBO file, pick the dates you want to keep, and download a smaller QBO free — no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "Why would I split or trim a QBO file?",
    a: "Common reasons: importing one month at a time from a multi-month file, re-importing a short period after a problem without touching the rest of the file, or sharing only one period's transactions. Trimming to the dates you need keeps the import limited to exactly that range.",
  },
  {
    q: "What happens to the closing balance in the trimmed file?",
    a: "When the original file carries a closing (ledger) balance, the tool rebuilds running balances from it and sets the trimmed file's closing balance to the balance after the last kept transaction. That keeps the balance chain consistent, so reconciliation in QuickBooks starts from the right target for the kept period.",
  },
  {
    q: "What if my file has no closing balance?",
    a: "Then there is no real balance to carry over. The trimmed file carries a zero ledger balance instead, and the tool tells you this before you download. You can still import the transactions — you will simply set the reconciliation target in QuickBooks yourself, from your bank statement.",
  },
  {
    q: "Are the start and end dates inclusive?",
    a: "Yes. Transactions dated exactly on the start date or exactly on the end date are kept. The tool shows live counts of how many transactions are kept, how many are dropped before the range, and how many are dropped after it, so you can check the range before downloading.",
  },
  {
    q: "Which file types can I split?",
    a: "QBO, OFX, and QFX files — they are all OFX format underneath. The download is always a QBO file containing only the transactions inside your chosen date range, keeping each transaction's original date, name, amount, and transaction ID.",
  },
  {
    q: "Do the split files keep the same transaction IDs?",
    a: "Yes. Every kept transaction retains its original FITID, unchanged. That stability matters: if you import two chunks and their ranges ever overlap, QuickBooks can recognize the shared transactions instead of posting them twice — and re-importing the same chunk is recognized as already imported.",
  },
  {
    q: "Can I split one file into several chunks in a single pass?",
    a: "Each pass produces one trimmed file for one date range, so splitting a year into months means running the months you need one at a time. The kept and dropped counts update live as you set the dates, which makes repeating the process for the next range quick.",
  },
  {
    q: "Should I split by calendar months or by statement periods?",
    a: "Statement periods are safer. Split on the same dates your bank statement uses, and the closing balance of each chunk lines up with a statement you can check against. Calendar months work too, but a chunk that cuts across two statements is harder to reconcile later.",
  },
  {
    q: "Will QuickBooks accept a trimmed file like a normal bank download?",
    a: "Yes. The trimmed file is rebuilt as a standard QBO with the kept period, the kept transactions, and a closing balance that matches them, so QuickBooks imports it through the same bank-feed or Web Connect route as a file your bank issued — it does not look hand-edited.",
  },
  {
    q: "Is this tool really free, and is my file stored?",
    a: "Yes — the trimmed QBO download is fully free, with no account and no Pro plan required. Your file is processed in memory and is not stored afterwards. We never sell or share your financial data.",
  },
];

const HOWTO = [
  { title: "Upload your QBO file", body: "Drop in a QBO, OFX, or QFX file. The tool reads its statement period, transaction count, and closing balance." },
  { title: "Choose the date range", body: "Set the start and end dates to keep. Both dates are inclusive, and the kept and dropped counts update as you change them." },
  { title: "Check the counts", body: "Confirm the number of transactions kept matches the period you intended before downloading." },
  { title: "Download and import", body: "Download the trimmed QBO free and import it into QuickBooks through the usual bank-feed or Web Connect import." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const H3 = "text-lg font-bold text-zinc-900 dark:text-white mt-8";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";
const TH = "border border-[#E3EDE0] bg-[#EFF7ED] px-3 py-2 text-left font-semibold text-zinc-900";
const TD = "border border-[#E3EDE0] px-3 py-2 text-zinc-600 dark:text-zinc-300 align-top";

export default function QboSplitterPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="QBO File Splitter"
      subtitle="Trim a QBO file to just the dates you need: upload it, choose a date range, and download a smaller QBO free — no account needed."
      tool={<QboSplitter />}
      currentPath="/tools/qbo-splitter"
      faqs={FAQS}
      howToName="How to split a QBO file"
      howToSteps={HOWTO}
      privacyLine="Fully free, no account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>Why a big QBO file becomes a problem</h2>
          <p className={P}>
            Banks happily hand you a year of transactions in a single download, and that
            generosity creates its own work. Importing twelve months at once means reviewing
            twelve months at once — one questionable row stalls the whole batch. If a single
            week later turns out to be wrong, fixing it means re-importing the year. And when
            an accountant asks for just the second quarter, the file sends them everything,
            including periods that are none of their concern. The transactions are fine; the
            container is simply the wrong size for the job in front of you.
          </p>
          <p className={P}>
            Splitting the file solves the sizing problem — but only if it is done as a
            rebuild, not an edit. Deleting rows in a text editor leaves the file's period and
            closing balance describing the original, longer span, so reconciliation starts
            from a target that no longer matches what is inside. This splitter rebuilds the
            file around the dates you keep, and the balance is rebuilt with it.
          </p>

          <h2 className={H2M}>What splitting actually does to the file</h2>
          <p className={P}>
            Four parts of the file are involved. The statement period is rewritten to your
            range. The transaction list is filtered to that range — nothing outside it
            survives. The closing balance is recomputed from the original file's running
            balances, landing on the balance as of the last kept transaction. And everything
            else — the bank and account identity in the header, and each kept transaction's
            date, name, amount, and ID — is carried over untouched:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className={TH}>Part of the file</th>
                  <th className={TH}>In the original</th>
                  <th className={TH}>In the trimmed file</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className={TD}><strong>Statement period</strong></td><td className={TD}>The whole download — say, Jan 1 to Jun 30</td><td className={TD}>Exactly the range you chose</td></tr>
                <tr><td className={TD}><strong>Transactions</strong></td><td className={TD}>All of them</td><td className={TD}>Only those inside the range, IDs unchanged</td></tr>
                <tr><td className={TD}><strong>Closing balance</strong></td><td className={TD}>The balance at the end of the full period</td><td className={TD}>Recomputed — the balance after the last kept transaction</td></tr>
                <tr><td className={TD}><strong>Bank and account header</strong></td><td className={TD}>Your bank's identity block</td><td className={TD}>Carried over unchanged</td></tr>
              </tbody>
            </table>
          </div>
          <figure className="mt-6 flex flex-col gap-5 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <img src="/tools/csv-to-qbo-review.webp" alt="A bookkeeper reviewing one trimmed statement period at a time instead of a full year of transactions" className="w-full shrink-0 rounded-[16px] sm:w-[400px]" loading="lazy" />
            <figcaption className="text-sm leading-relaxed text-[#33502F]">One period per import keeps the review — and the reconciliation — manageable.</figcaption>
          </figure>

          <h2 className={H2M}>How to split a file, step by step</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600 dark:text-zinc-300 marker:font-bold marker:text-[#007A33]">
            <li><strong className="text-zinc-900 dark:text-white">Upload the file.</strong> Drop in a QBO, OFX or QFX file; the tool reads its statement period, transaction count, and closing balance.</li>
            <li><strong className="text-zinc-900 dark:text-white">Set the range.</strong> Choose the start and end dates to keep. Both are inclusive, and the counts update as you change them.</li>
            <li><strong className="text-zinc-900 dark:text-white">Check the three counts.</strong> Kept, dropped before, and dropped after should add up to the original file's transaction count.</li>
            <li><strong className="text-zinc-900 dark:text-white">Download and import.</strong> The trimmed QBO is fully free, and imports through the same bank-feed or Web Connect route as the original.</li>
          </ol>

          <h2 className={H2M}>Choosing a range that reconciles</h2>
          <p className={P}>
            The best range is the one your future self can check. Split on statement
            boundaries — the same start and end dates printed on a bank statement — and the
            chunk's closing balance has a document to be compared against. Keep ranges whole:
            the splitter works in whole days, and both boundary dates are fully included, so
            there is no such thing as half a day in a chunk. If you are cutting a file into a
            series of chunks, make them tile: one chunk ends April 30, the next begins May 1,
            with neither a gap nor an overlap. And write the boundaries down — a note in the
            file name, like "2026-Q2-only.qbo", prevents the classic mix-up of importing the
            same chunk twice under two names.
          </p>
          <p className={P}>
            Keep a simple log as you go: the original file's name, each chunk's range, and the
            date you imported it. Three lines in a notebook or a spreadsheet. Months later,
            when a reconciliation question points at a specific week, the log tells you which
            chunk carried it and what its neighbors were — turning an afternoon of file
            archaeology into a thirty-second lookup. Every bookkeeper who imports in pieces
            eventually wishes they had started the log with the first chunk.
          </p>

          <h2 className={H2M}>A worked example: six months trimmed to two</h2>
          <p className={P}>
            Take a sample file covering January 1 to June 30 with six transactions and a
            closing balance of $1,525.00, and keep only March 1 to April 30:
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr><th className={TH}>Range</th><th className={TH}>Transactions</th><th className={TH}>Outcome</th></tr>
              </thead>
              <tbody>
                <tr><td className={TD}>Jan 1 – Feb 28</td><td className={TD}>2</td><td className={TD}>Dropped — before the range</td></tr>
                <tr><td className={TD}>Mar 1 – Apr 30</td><td className={TD}>2</td><td className={TD}>Kept — these become the trimmed file</td></tr>
                <tr><td className={TD}>May 1 – Jun 30</td><td className={TD}>2</td><td className={TD}>Dropped — after the range</td></tr>
              </tbody>
            </table>
          </div>
          <p className={P}>
            The trimmed file's closing balance is $1,350.00 — not the original $1,525.00.
            That is deliberate: $1,350.00 is the running balance as of the last kept
            transaction on April 30, recomputed from the original file's own balance chain.
            QuickBooks reconciles the chunk against $1,350.00, which is exactly what the
            April statement shows. The two kept transactions retain their original IDs, so
            nothing about them can be mistaken for new activity. (Sample data, shown for
            illustration.)
          </p>

          <h2 className={H2M}>Why not just download the range from your bank instead?</h2>
          <p className={P}>
            Sometimes you can — and when the bank offers exactly the range you need, its own
            download is the shortest path. But bank download screens are rigid in ways that
            regularly fail the real task. Many offer only preset ranges — last month, last
            quarter, year to date — and your reconciliation problem rarely respects those
            boundaries. Some cap a download at a fixed number of days, forcing the stitch-it-
            yourself problem splitting exists to avoid. And a large share of splitting work
            never starts at a bank at all: the file came from a client, from another
            bookkeeping system, or from your own archive, in a period shape nobody chose.
            Splitting works on the file you actually have, whatever range it covers and
            wherever it came from, and it produces chunks whose balances were recomputed for
            the range — something a stitched-together set of bank downloads cannot promise,
            because each separate download closes its own balance at its own end date.
            One file, one balance chain, cut cleanly — that is the whole idea.
          </p>

          <h2 className={H2M}>When a split goes wrong</h2>
          <h3 className={H3}>Splitting in the middle of a day</h3>
          <p className={P}>
            A date range cannot express "the morning of the 15th." Every transaction dated on
            a boundary day is kept, in full. If a single day genuinely needs to be divided,
            that division has to happen inside QuickBooks after import — the file format
            simply has no finer grain than a day, and pretending otherwise produces chunks
            whose balances cannot be checked against anything.
          </p>
          <h3 className={H3}>Overlapping chunks and duplicates</h3>
          <p className={P}>
            The classic duplicate factory: chunk one runs through April 30, chunk two starts
            April 15 "to be safe," and two weeks of transactions arrive twice. Kept
            transactions retain their original IDs, which gives QuickBooks a fighting chance
            to recognize the repeats — but not every import path checks IDs the same way, and
            relying on rescue is worse than tiling the ranges properly: end one chunk on the
            day the next begins minus one, and let the boundary be boring.
          </p>
          <h3 className={H3}>The closing balance looks wrong</h3>
          <p className={P}>
            Two innocent causes explain most surprises. If the original file carried no
            closing balance at all, there was nothing to rebuild from, so the trimmed file
            carries a zero ledger balance and the tool says so before you download — set the
            reconciliation target from your statement instead. And if the balance is simply
            not the month-end figure you expected, check the range: the balance always
            reflects the last kept transaction, so a range ending April 28 closes at April
            28's balance, not April's.
          </p>

          <h2 className={H2M}>Verify the chunk before it goes in</h2>
          <p className={P}>
            A trimmed file earns one extra minute of scrutiny because it is, by construction,
            a file your bank never issued. The arithmetic check is the one from the steps
            above: kept plus dropped-before plus dropped-after equals the original count. For
            the structural check, run the chunk through the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>,
            which verifies its balance chain the same way QuickBooks will experience it. And
            if earlier imports may already have overlapped, the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO Duplicate Finder</a>{" "}
            shows repeated transaction IDs before they reach your books.
          </p>
          <p className={P}>
            One last spot-check costs nothing: compare the chunk's first and last transactions
            against the statement for that period. The first kept row should be the first
            transaction on or after your start date, and the last kept row the final one on or
            before your end date. If either end disagrees, the range was set one day off —
            far cheaper to catch here than after the import.
          </p>

          <h2 className={H2M}>Splitting files every month? Make it a system</h2>
          <p className={P}>
            Splitting is usually a symptom of a healthy habit — importing in reviewable
            pieces instead of swallowing a year at once. When it becomes the monthly routine,
            a free account keeps the original files and every chunk cut from them in one
            searchable history, so the question "which file did April come from?" answers
            itself. The dashboard adds bulk conversion when several clients' statements land
            together, and client portals let each client upload through their own link rather
            than emailing files you then have to trim. The splitter itself stays fully free
            either way.
          </p>
          <p className={P}>
            Want to read a chunk before importing it? The{" "}
            <a href="/tools/qbo-to-csv" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO to CSV converter</a>{" "}
            lays any QBO out as a spreadsheet — the fastest way to confirm a trimmed file
            holds exactly the transactions you meant to keep, with the first and last rows
            checked against the statement dates before anything is imported into the books.
          </p>
        </>
      }
    />
  );
}
