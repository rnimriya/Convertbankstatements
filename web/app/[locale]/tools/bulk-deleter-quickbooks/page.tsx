import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { BulkDeleter } from "@/components/tools/BulkDeleter";

const PAGE_URL = "https://www.convertstatement.online/tools/bulk-deleter-quickbooks";

export const metadata: Metadata = {
  title: "Bulk QBO Deleter — Remove Transactions from a QBO File Before Import | Convert Statement",
  description:
    "Free bulk deleter for QBO, OFX and QFX files: tick the transactions you do not want — or select every duplicate in one click — and download a cleaned QBO that imports without them. Fully free, no account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Bulk QBO Deleter — Clean a QBO File Before Import",
    description:
      "Remove duplicate or unwanted transactions from a QBO, OFX or QFX file and download the cleaned file. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What does this deleter actually delete?",
    a: "It removes transactions from a QBO, OFX or QFX file you have not imported yet, and gives you back a cleaned QBO containing the rest. It works on the file only — it never connects to QuickBooks, and it cannot see or change anything inside your QuickBooks company.",
  },
  {
    q: "Can it delete transactions that are already inside QuickBooks?",
    a: "No — and no file tool can. Once transactions are imported, they live in your QuickBooks company data, and removing them has to happen inside QuickBooks itself (delete or void, one by one or through QuickBooks' own batch actions where your plan offers them). This tool exists for the step before that: clean the file first, and the unwanted transactions never get in.",
  },
  {
    q: "How does 'Select duplicates' decide what is a duplicate?",
    a: "It uses the same test as this site's QBO checker: two transactions count as duplicates when the date, the amount and the description all match. The first occurrence is always kept and the later copies are ticked for removal. Review the ticked rows before downloading — two genuinely identical purchases on the same day will also match, and only you can tell those apart.",
  },
  {
    q: "Will removing transactions break the file's balance?",
    a: "The cleaned file is rebuilt with the transactions you kept, and it preserves your original file's closing (ledger) balance and bank identity, so QuickBooks reconciliation still has its target. Be aware that removing real transactions means the kept activity will no longer add up to that closing balance — that difference is exactly the total of what you removed, which is the honest outcome when the removed rows were duplicates or errors.",
  },
  {
    q: "What happens to the transactions I keep?",
    a: "Nothing. Kept transactions retain their original dates, amounts, descriptions and transaction IDs (FITIDs), so QuickBooks duplicate detection behaves exactly as it would have with the original file. If the same cleaned file is imported twice, QuickBooks still recognises the transactions as already imported.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory — once to list its transactions, once to build the cleaned download — and is not stored afterwards. Your original file on your own computer is never modified. We never sell or share your financial data, and the tool is free with no account.",
  },
];

const HOWTO = [
  { title: "Upload the file you plan to import", body: "Drop in the .qbo, .ofx or .qfx file — the tool lists every transaction it contains, with the statement period and totals." },
  { title: "Select what should not be imported", body: "Tick rows by hand, or click Select duplicates to tick every repeated transaction (same date, amount and description) in one go, keeping the first copy of each." },
  { title: "Review the selection", body: "Ticked rows are highlighted and the counter shows how many of the total will be removed. Unticking any row keeps it." },
  { title: "Download the cleaned QBO", body: "Import the cleaned file into QuickBooks instead of the original — the removed transactions never reach your books. Fully free." },
];

const H2 = "text-2xl font-extrabold text-zinc-900 dark:text-white";
const H2M = "text-2xl font-extrabold text-zinc-900 dark:text-white mt-12";
const P = "mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed";

export default function BulkDeleterQuickBooksPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="Bulk QBO Deleter — Clean a File Before Import"
      subtitle="Tick the transactions you do not want — or select every duplicate in one click — and download a cleaned QBO that imports without them. Fully free, no account."
      tool={<BulkDeleter />}
      currentPath="/tools/bulk-deleter-quickbooks"
      faqs={FAQS}
      howToName="How to remove transactions from a QBO file"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className={H2}>The cheapest place to delete a transaction is before it imports</h2>
          <p className={P}>
            Every bookkeeper knows the two ways a bad transaction gets into QuickBooks. The
            first is a duplicated download: the bank lets you pull overlapping date ranges,
            you import both files, and a week of activity lands twice. The second is the file
            that simply contains things the books should never see — personal spending on a
            business card download, test transactions, a payroll run that belongs in a
            different system. Once those rows are inside QuickBooks, removing them means
            opening each one and deleting or voiding it by hand, then repairing whatever it
            touched.
          </p>
          <p className={P}>
            This deleter moves the cleanup one step earlier, to the file itself. Upload the
            QBO, OFX or QFX file you were about to import, tick the transactions that should
            not go in, and download a cleaned QBO holding only the rest. QuickBooks never
            sees the removed rows — no duplicates to hunt, no voids cluttering the audit
            trail, no reconciliation differences to explain at month-end.
          </p>

          <h2 className={H2M}>What this tool is — and what it honestly is not</h2>
          <p className={P}>
            This is a file tool, and its limits follow from that. It edits a Web Connect file
            sitting on your computer; it does not connect to your QuickBooks account, and it
            cannot delete, void or change any transaction that has already been imported into
            a QuickBooks company. Tools that promise one-click deletion inside QuickBooks are
            connected apps that you authorise against your company file — a different product
            with a different trust decision. If your duplicates are already inside
            QuickBooks, they have to be removed inside QuickBooks.
          </p>
          <p className={P}>
            What the file-level approach does cover is the moment most duplicates are born:
            the import itself. QuickBooks skips a transaction whose FITID it has already
            seen, which quietly handles a straight re-import of the same file — but it does
            nothing about two different downloads of the same activity, where the same
            purchase appears with two different IDs. Those are exactly the duplicates the{" "}
            <a href="/tools/qbo-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Checker</a>{" "}
            flags and this deleter removes: same date, same amount, same description, caught
            before either copy reaches the books.
          </p>

          <h2 className={H2M}>How to clean a file without cleaning out real transactions</h2>
          <p className={P}>
            Start with Select duplicates and then read what it ticked. The automatic test —
            same date, amount and description — is deliberately strict, but it cannot know
            that a client genuinely bought two identical coffees for two different staff on
            the same morning. Identical rows at a round amount from a café or a fuel station
            deserve a second look; identical rows for a monthly subscription or a bank fee
            almost never do. The counter above the list always shows how many of the total
            are marked, and the safest habit is removing a selection you have read, not a
            selection you trust blindly.
          </p>
          <p className={P}>
            Two protections are built into the download. First, the cleaned file preserves
            your original file&apos;s closing balance and bank identity, so the import and
            the reconciliation that follows behave normally. Second, kept transactions keep
            their original transaction IDs, so importing the cleaned file cannot resurrect
            duplicates later. And your original file is never touched — if you change your
            mind, it is still on your computer exactly as the bank issued it. To split one
            file into smaller period-based pieces instead, use the{" "}
            <a href="/tools/qbo-splitter" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO File Splitter</a>;
            to repair a file QuickBooks rejects outright, use the{" "}
            <a href="/tools/ofx-to-qbo" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">OFX to QBO fixer</a>.
          </p>

          <h2 className={H2M}>Cleaning the file, step by step</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 1 — Upload the file you were about to import.</strong>{" "}
            Drop in one .qbo, .ofx or .qfx file (up to 10 MB). The tool lists every transaction
            it contains, with the statement period, the money-in and money-out totals, and the
            closing balance — the same numbers QuickBooks would have worked from.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 2 — Choose what should not be imported.</strong>{" "}
            Tick rows by hand, or click Select duplicates to tick every repeated transaction in
            one go. The automatic test is the strict one: same date, same amount and same
            description, with the first copy always kept.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 3 — Review the selection before you trust it.</strong>{" "}
            Ticked rows are highlighted and a counter shows how many of the total will be
            removed. Read the ticked list — that review is the difference between a cleaned
            file and a smaller wrong file.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Step 4 — Download the cleaned QBO and import that instead.</strong>{" "}
            The download is rebuilt as a clean Web Connect file holding only the kept rows.
            Import it into QuickBooks the normal way; the removed transactions never reach
            your books, and your original file stays untouched on your computer if you ever
            need it.
          </p>

          <h2 className={H2M}>Three ways to deal with duplicates, honestly compared</h2>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Delete inside QuickBooks after import.</strong>{" "}
            This is the only route that works once transactions are already in the company —
            but it is one-by-one work in most plans, it leaves voids and deletions in the audit
            trail, and a reconciled duplicate takes the reconciliation difference with it when
            it goes.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Use a connected in-company deleter app.</strong>{" "}
            Apps in that category authorize against your live QuickBooks company and batch-delete
            transactions that are already posted. That is a genuinely different capability from
            this page — and a genuinely different trust decision, because the app can act inside
            your live books. If your duplicates are already imported and there are hundreds of
            them, that category exists for a reason.
          </p>
          <p className={P}>
            <strong className="text-zinc-900 dark:text-white">Clean the file before import (this page).</strong>{" "}
            No connection, no authorization, nothing posted anywhere: the unwanted rows are
            removed from the file, so there is nothing to delete later and no audit-trail
            debris. Its limit is the mirror of its strength — it can only help before the
            import happens. Spotting duplicates inside the file first is the job of the{" "}
            <a href="/tools/free-qbo-cleanup-checker" className="font-semibold text-pine-600 hover:underline dark:text-pine-400">QBO Duplicate Finder</a>,
            which grades them by transaction ID before you remove anything.
          </p>
        </>
      }
    />
  );
}
