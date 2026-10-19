import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QboChecker } from "@/components/tools/QboChecker";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-checker";

export const metadata: Metadata = {
  title: "Free QBO File Checker — Validate QuickBooks Web Connect Files | Convert Statement",
  description:
    "Upload a .qbo, .ofx or .qfx file and check it before importing into QuickBooks: structure, ledger balance, statement period, duplicate FITIDs and transactions. Free with a free account, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Free QBO File Checker",
    description:
      "Validate a QBO/OFX file before QuickBooks does: balances, duplicates, FITIDs, period dates. Free and private.",
    url: PAGE_URL,
    type: "website",
  },
};

export default async function QboCheckerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        <section className="bg-gradient-to-b from-violet-50/60 to-white dark:from-zinc-900 dark:to-zinc-950 border-b border-zinc-100 dark:border-zinc-800 px-6 py-16 text-center">
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-3">
            Free Tool
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight max-w-4xl mx-auto">
            QBO File Checker
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            About to import a QBO file into QuickBooks? Check it first. We validate the file&apos;s
            structure, closing balance, statement period, and the duplicate risks QuickBooks
            won&apos;t warn you about until reconciliation breaks.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <QboChecker />

          <div className="mt-14">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">What this checker looks for</h2>
            <ul className="mt-4 space-y-2.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <li><strong className="text-zinc-900 dark:text-white">Valid OFX structure</strong> — a .qbo file is OFX underneath; if the message set is missing, QuickBooks rejects the import outright.</li>
              <li><strong className="text-zinc-900 dark:text-white">Ledger (closing) balance</strong> — reconciliation aims at this number. If it&apos;s missing or dated differently from the statement period, expect a fight at month-end.</li>
              <li><strong className="text-zinc-900 dark:text-white">Duplicate FITIDs</strong> — QuickBooks treats a repeated transaction ID as already-imported and can silently skip real transactions.</li>
              <li><strong className="text-zinc-900 dark:text-white">Look-alike transactions</strong> — same date, amount, and name appearing twice: sometimes genuine, often a double export.</li>
              <li><strong className="text-zinc-900 dark:text-white">Dates outside the period</strong> — transactions dated outside the file&apos;s declared statement period are a common cause of beginning-balance mismatches.</li>
            </ul>
            <p className="mt-5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Files converted with Convert Statement are built to pass every one of these checks —
              the running balances are verified against the statement itself before the QBO is
              generated. <a href="/quickbooks" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">See how the QuickBooks converter works</a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
