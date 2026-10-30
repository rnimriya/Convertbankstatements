import type { Metadata } from "next";
import { ToolPageLayout, type ToolFaq } from "@/components/tools/ToolPageLayout";
import { OfxFixer } from "@/components/tools/OfxFixer";

const PAGE_URL = "https://www.convertstatement.online/tools/ofx-to-qbo";

export const metadata: Metadata = {
  title: "OFX / QFX to QBO Converter + QBO Fixer — Free | Convert Statement",
  description:
    "Free OFX/QFX to QBO converter and QBO fixer: rebuild a broken OFX, QFX or QBO file as a clean OFX 1.02 QBO — header normalized, dates fixed, missing and duplicate transaction IDs regenerated. Fully free, no account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OFX / QFX to QBO Converter + QBO Fixer",
    description:
      "Upload a broken OFX, QFX or QBO file and download a repaired QBO that QuickBooks accepts. Fully free, no account needed.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS: ToolFaq[] = [
  {
    q: "What does this fixer actually repair?",
    a: "Three things that commonly make QuickBooks reject or mis-import a file: the header is normalized to OFX 1.02 (the version QuickBooks Web Connect expects), short date values are expanded to full timestamps, and transactions with a missing or duplicated FITID — the ID QuickBooks uses for duplicate detection — get a new unique ID generated from the transaction itself. The result report lists every fix and its count.",
  },
  {
    q: "What is INTU.BID, and does this tool change it?",
    a: "INTU.BID identifies your bank to QuickBooks. This tool preserves the INTU.BID already in your file and never guesses a bank's ID. If your file has none and QuickBooks says your bank is not supported, you can type one in — copy it from a working QBO file downloaded from your own bank (open that file in a text editor and search for INTU.BID).",
  },
  {
    q: "My bank only gives me OFX or QFX files. Can QuickBooks use them?",
    a: "QuickBooks imports Web Connect (.qbo) files, and a QBO is OFX 1.02 underneath. This tool rebuilds your OFX or QFX transactions as a proper .qbo file with the header, currency, and structure QuickBooks expects, so you can import it through the normal bank-feed import.",
  },
  {
    q: "Will the fixed file create duplicates if I import it twice?",
    a: "No. Kept FITIDs stay as they were, and regenerated FITIDs are derived deterministically from each transaction's date, description, and amount — re-running the fixer on the same file produces the same IDs, so QuickBooks recognizes a re-import as already imported.",
  },
  {
    q: "Does fixing the file change my transactions?",
    a: "Dates, descriptions, and amounts are carried over exactly as parsed from your file. Only the file structure, the timestamp format, and broken transaction IDs change. The report shows what the checker found in the original file before any fix, so you can compare.",
  },
  {
    q: "Is my data uploaded or stored?",
    a: "Your file is processed in memory to build the fixed QBO and is not stored afterwards. We never sell or share your financial data, and the download is fully free with no account.",
  },
];

const HOWTO = [
  { title: "Export from your bank", body: "Download the OFX, QFX, or QBO file your bank or accounting software gave you — even one QuickBooks already rejected." },
  { title: "Upload it here", body: "Drop the file in, optionally adding an INTU.BID and bank name if you have them from a working bank-downloaded QBO." },
  { title: "Review the report", body: "See what was wrong with the original file and exactly which fixes were applied, with counts." },
  { title: "Download and import", body: "Save the fixed .qbo — fully free — and import it into QuickBooks through the bank-feed import." },
];

export default function OfxToQboPage() {
  return (
    <ToolPageLayout
      fullyFree
      eyebrow="Free Tool"
      title="OFX to QBO Converter and QBO Fixer"
      subtitle="Rebuild a broken OFX, QFX, or QBO file as a clean QBO QuickBooks accepts: header normalized to OFX 1.02, dates fixed, and missing or duplicate transaction IDs regenerated."
      tool={<OfxFixer />}
      currentPath="/tools/ofx-to-qbo"
      faqs={FAQS}
      howToName="How to convert and fix an OFX file for QuickBooks"
      howToSteps={HOWTO}
      privacyLine="No account needed · Processed in memory, never stored"
      content={
        <>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Why QuickBooks rejects files that look fine</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            An OFX file can open perfectly in a text editor and still fail in QuickBooks. The
            usual causes are structural: the file is OFX 2.x XML while QuickBooks Web Connect
            expects OFX 1.02, dates are written as short 8-digit values instead of full
            timestamps, or transaction IDs (FITIDs) are missing or repeated — and a repeated
            FITID makes QuickBooks silently skip a real transaction as if it were a duplicate.
            This fixer rebuilds the file as a clean OFX 1.02 QBO and reports every change it
            made, with counts, before you download.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">The INTU.BID promise</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Some fixers stamp a made-up bank ID into your file. That can point QuickBooks at
            the wrong bank, so this tool never does it: it <strong className="text-zinc-900 dark:text-white">preserves
            your file's INTU.BID exactly as it is, and never guesses a bank's ID</strong>. If your file
            has no INTU.BID at all, the field is left unset — and if QuickBooks tells you your
            bank is not supported, you can type one in above, copied from a working QBO file
            downloaded from your own bank.
          </p>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-12">What this tool handles</h2>
          <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <li><strong className="text-zinc-900 dark:text-white">Header normalization</strong> — OFX 2.x XML and other versions are rebuilt as OFX 1.02, the Web Connect format.</li>
            <li><strong className="text-zinc-900 dark:text-white">Date repair</strong> — short DTPOSTED values become full 14-digit timestamps.</li>
            <li><strong className="text-zinc-900 dark:text-white">FITID repair</strong> — missing IDs are generated and repeated IDs are regenerated, deterministically, so a re-import cannot duplicate your books.</li>
            <li><strong className="text-zinc-900 dark:text-white">A before-and-after report</strong> — the problems found in your original file and the fixes applied, side by side.</li>
          </ul>
          <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Not sure what is wrong with your file? The{" "}
            <a href="/tools/qbo-checker" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QBO File Checker</a>{" "}
            reports its problems without changing anything, and the{" "}
            <a href="/tools/qbo-import-errors" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QBO import-error decoder</a>{" "}
            explains the exact message QuickBooks showed you. To go the other way — from a QBO
            into a spreadsheet — use the{" "}
            <a href="/tools/qbo-to-csv" className="text-pine-600 dark:text-pine-400 font-semibold hover:underline">QBO to CSV converter</a>.
          </p>
        </>
      }
    />
  );
}
