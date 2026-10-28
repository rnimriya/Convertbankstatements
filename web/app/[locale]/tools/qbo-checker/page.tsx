import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QboChecker } from "@/components/tools/QboChecker";

const PAGE_URL = "https://www.convertstatement.online/tools/qbo-checker";

export const metadata: Metadata = {
  title: "Free QBO File Checker — Validate QuickBooks Web Connect Files | Convert Statement",
  description:
    "Upload a .qbo, .ofx or .qfx file and check it before importing into QuickBooks: structure, ledger balance, statement period, duplicate FITIDs and transactions. No account needed to scan, files never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Free QBO File Checker",
    description:
      "Validate a QBO/OFX file before QuickBooks does: balances, duplicates, FITIDs, period dates. Free and private.",
    url: PAGE_URL,
    type: "website",
  },
};

export default function QboCheckerPage() {
  return (
    <div className="agri-sans">
      <Navbar dark />
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-[#071106] px-6 py-16 text-center">
          <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,0.38), rgba(19,84,28,0.28) 55%, transparent 75%)" }} />
          <p className="agri-mono relative inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#B9D6B2] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#64CB48] shrink-0" />
            Free Tool
          </p>
          <h1 className="relative text-3xl sm:text-4xl font-extrabold text-white leading-tight max-w-4xl mx-auto">
            QBO File <span className="agri-serif">Checker</span>
          </h1>
          <p className="relative mt-4 text-lg text-zinc-300 max-w-2xl mx-auto">
            About to import a QBO file into QuickBooks? Check it first. We validate the file&apos;s
            structure, closing balance, statement period, and the duplicate risks QuickBooks
            won&apos;t warn you about until reconciliation breaks.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <QboChecker />

          <div className="mt-14">
            <h2 className="text-2xl font-extrabold text-zinc-900">What this checker looks for</h2>
            <ul className="mt-4 space-y-2.5 text-zinc-600 leading-relaxed">
              <li><strong className="text-zinc-900">Valid OFX structure</strong> — a .qbo file is OFX underneath; if the message set is missing, QuickBooks rejects the import outright.</li>
              <li><strong className="text-zinc-900">Ledger (closing) balance</strong> — reconciliation aims at this number. If it&apos;s missing or dated differently from the statement period, expect a fight at month-end.</li>
              <li><strong className="text-zinc-900">Duplicate FITIDs</strong> — QuickBooks treats a repeated transaction ID as already-imported and can silently skip real transactions.</li>
              <li><strong className="text-zinc-900">Look-alike transactions</strong> — same date, amount, and name appearing twice: sometimes genuine, often a double export.</li>
              <li><strong className="text-zinc-900">Dates outside the period</strong> — transactions dated outside the file&apos;s declared statement period are a common cause of beginning-balance mismatches.</li>
            </ul>
            <p className="mt-5 text-zinc-600 leading-relaxed">
              Files converted with Convert Statement are built to pass every one of these checks —
              the running balances are verified against the statement itself before the QBO is
              generated. <a href="/quickbooks" className="text-[#13541C] font-semibold hover:underline">See how the QuickBooks converter works</a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
