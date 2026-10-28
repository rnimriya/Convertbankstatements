import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { BUILD_NONCE } from "@/lib/csp-nonce";

const PAGE_URL = "https://www.convertstatement.online/for-bookkeepers";

export const metadata: Metadata = {
  title: "For Bookkeepers — Multi-Client Statement Conversion | Convert Statement",
  description:
    "Built for bookkeepers: one client upload link per client, bulk statement conversion, monthly statement reminders, and QuickBooks-ready QBO exports with balance checks. Volume pricing on enquiry — no separate plan to buy first.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "For Bookkeepers — Multi-Client Statement Conversion",
    description:
      "Client upload portals, bulk conversion, monthly reminders, and balance-checked QBO exports — built for bookkeeping practices.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "How do client upload portals work?",
    a: "From your dashboard you create one upload link per client and share it. The client uploads their PDF statement through that link — no account needed on their side — and the conversion is billed to your account, not theirs. You can deactivate a link any time.",
  },
  {
    q: "Can I remind clients to send their monthly statements?",
    a: "Yes. When you create a portal you can add the client's email address, and from the dashboard you can send that client a reminder email containing their upload link. Reminders are limited to one per portal per day so a client is never spammed by accident.",
  },
  {
    q: "Does bulk conversion handle many clients at once?",
    a: "Yes. Bulk conversion processes many statements in one run and returns a ZIP of converted files, with the same per-file balance checks as a single conversion. QBO, QFX, and OFX exports are on the Pro plan; CSV and Excel are included on every plan.",
  },
  {
    q: "Is there a bookkeeper plan or volume pricing?",
    a: "There is no separate bookkeeper plan to buy: the standard plans on the pricing page apply, and practices converting for many clients can ask about volume pricing through the contact form. Tell us roughly how many clients and statements per month, and we will come back with terms — nothing is charged beyond the plan you already have unless you agree it.",
  },
  {
    q: "How do the QuickBooks tools fit a bookkeeping practice?",
    a: "The same account that converts statements also gets the free QuickBooks tools: the duplicate finder for cleaning a client's books before month-end, the payout converters for Stripe, PayPal, Amazon, and Shopify sellers, and the reconciliation difference finder for the month that will not reconcile. Cleaned QBO downloads are on Pro.",
  },
  {
    q: "Are my clients' statements stored?",
    a: "No. Converted files are processed and delivered without being stored as statement content afterwards. Client upload links carry no client data themselves — they are just a link to an upload form.",
  },
];

export default function ForBookkeepersPage() {
  const nonce = BUILD_NONCE;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main>
        <section className="w-full relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-20 dark:opacity-15 bg-pine-500 dark:bg-pine-600 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-10 pb-12">
            <div className="text-center mb-6 max-w-4xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-surface text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-widest mb-4">
                For bookkeepers
              </span>
              <h1 className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.07] mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                One place for every client's statements
              </h1>
              <p className="text-[0.95rem] text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Stop chasing PDFs over email. Give each client their own upload link, convert
                in bulk, remind the late ones with one click, and hand QuickBooks files that
                already balance.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-[20px] text-sm font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"
                >
                  Open your dashboard
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-[20px] text-sm font-bold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:border-pine-400"
                >
                  Ask about volume pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-brand-bg">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-text mb-10">Built for a practice, not a single user</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "One upload link per client", body: "Create a client portal link from the dashboard and share it. The client uploads their PDF without needing an account, and the conversion bills to you. Deactivate the link when the engagement ends." },
                { title: "Monthly statement reminders", body: "Add the client's email to their portal and send a reminder from the dashboard — the email carries their upload link, so there is nothing for the client to look up. Limited to one reminder per portal per day." },
                { title: "Bulk conversion", body: "Convert a month of statements across clients in one run and download a ZIP of converted files, with the same balance checks as a single conversion." },
                { title: "QuickBooks-ready exports", body: "Every conversion can export QBO with a verified balance chain and unique transaction IDs, so month-end reconciliation starts from files that already agree with the bank." },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-brand-border bg-brand-surface p-6">
                  <h3 className="font-bold text-zinc-900 dark:text-white">{c.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 rounded-[20px] bg-zinc-900 p-8 text-white">
              <h2 className="text-2xl font-bold">Volume pricing, on enquiry</h2>
              <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
                The standard plans on the pricing page cover most practices. If you convert
                for many clients every month, tell us roughly how many clients and statements
                that is, and we will come back with volume terms. Nothing changes on your
                account unless you agree it.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-zinc-900 font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-200">
                  Contact us about volume pricing
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 border border-zinc-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-800">
                  See standard pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-brand-surface border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-text text-center mb-12">Frequently asked questions</h2>
            <FAQAccordion items={FAQS} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
