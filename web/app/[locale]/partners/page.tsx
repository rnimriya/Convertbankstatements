import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { BUILD_NONCE } from "@/lib/csp-nonce";

const PAGE_URL = "https://www.convertstatement.online/partners";

export const metadata: Metadata = {
  title: "Partners & Affiliates — 40% Recurring Commission | Convert Statement",
  description:
    "Partner with ConvertStatement: earn 40% recurring commission on paid plans you refer, for as long as the referred customer stays subscribed. For accounting and bookkeeping blogs, newsletters, communities, YouTube channels, and firms. Apply via the contact page.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Partner with ConvertStatement — 40% Recurring Commission",
    description:
      "Recommend the bank statement converter and free QuickBooks tools to your audience, and earn 40% recurring on paid plans you refer.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "What commission do partners earn?",
    a: "The program rate is 40% of the paid plan a referred customer subscribes to. It is recurring: you keep earning 40% on that customer's subscription for as long as they stay subscribed. The paid plans are Basic at $5/month, Pro at $20/month, and Business at $75/month. There is no commission on the free plan, because there is no payment to share.",
  },
  {
    q: "When does the commission stop?",
    a: "When the referred customer cancels or otherwise stops being subscribed, the recurring commission on that customer stops with their subscription. Commission is tied to a live, paying subscription — not to the initial signup alone.",
  },
  {
    q: "How do I apply to become a partner?",
    a: "Apply through the contact page and tell us about your audience: what you publish or run, who reads or watches it, and roughly how large it is. Applications are reviewed manually, and the full program terms are confirmed when your application is approved.",
  },
  {
    q: "Does it cost anything to join?",
    a: "No. Joining the partner program is free. You do not need to buy a ConvertStatement plan to apply or to be a partner.",
  },
  {
    q: "I already use ConvertStatement. Can I join?",
    a: "Yes. Existing users can apply through the contact page like anyone else. Every account already has a Referrals area in the dashboard, which is where your personal referral link lives once you are set up as a partner.",
  },
  {
    q: "How and when are commissions paid, and who do I contact with questions?",
    a: "Payout details — method, schedule, and any minimum threshold — are part of the full program terms, which are confirmed in writing when your application is approved; we do not publish figures we have not confirmed with you first. For any question before or after applying, contact us through the contact page.",
  },
];

export default function PartnersPage() {
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
    <div className="agri-sans min-h-screen bg-white">
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#EFF7ED] to-[#F7FAF5] px-6 pt-[124px] pb-16">
          <div className="relative mx-auto max-w-6xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#D8E8D2] bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#007A33]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
              Partners &amp; affiliates
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold text-[#0B1F16] sm:text-4xl max-w-3xl leading-tight">
              Partner with ConvertStatement
            </h1>
            <p className="mt-4 text-base text-[#5c6f63] max-w-2xl leading-relaxed">
              If your readers, viewers, members, or clients wrestle with bank statement PDFs
              and QuickBooks files, you already have the audience for this. Recommend
              ConvertStatement, and earn a recurring share of every paid plan you refer.
            </p>
            <p className="mt-3 text-sm text-[#5c6f63] max-w-2xl leading-relaxed">
              Built for accounting &amp; bookkeeping blogs, newsletters, communities,
              YouTube channels, and firms who recommend tools to their clients.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold bg-[#2CA01C] text-white"
              >
                Apply via our contact page
              </Link>
              <Link
                href="/for-bookkeepers"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold border border-[#D8E8D2] bg-white text-[#00573F]"
              >
                See ConvertStatement for bookkeepers
              </Link>
            </div>
          </div>
        </section>

        {/* The offer */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-8 sm:p-10">
              <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
                <div>
                  <p className="font-display text-6xl font-bold text-[#007A33] leading-none">40%</p>
                  <p className="mt-2 text-sm font-semibold text-[#0B1F16]">recurring commission</p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0B1F16]">The offer, plainly</h2>
                  <p className="mt-3 text-sm text-[#3d5546] leading-relaxed max-w-2xl">
                    You earn 40% of the paid plan each customer you refer subscribes to —
                    Basic ($5/month), Pro ($20/month), or Business ($75/month) — and the
                    commission recurs for as long as that customer stays subscribed. When
                    they cancel, the commission on that customer stops. There is no
                    commission on the free plan (8 pages free, no payment to share).
                  </p>
                  <p className="mt-3 text-sm text-[#3d5546] leading-relaxed max-w-2xl">
                    Full program terms — including payout details and tracking — are
                    confirmed in writing when your application is approved.
                  </p>
                </div>
              </div>
            </div>

            {/* Who it's for */}
            <h2 className="mt-20 text-3xl sm:text-4xl font-bold text-[#0B1F16] mb-10">Who it&apos;s for</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Content creators & blogs",
                  body: "You write or record about accounting, bookkeeping, QuickBooks, or running a small business — blog posts, newsletters, tutorials, or YouTube videos. ConvertStatement gives you a working tool to demonstrate, not just describe: convert a statement live, or walk through a free QuickBooks checker.",
                },
                {
                  title: "Communities & groups",
                  body: "You run a forum, group, Slack, Discord, or member community for accountants, bookkeepers, or business owners. Your members hit statement-conversion and QBO problems regularly — a referral link gives them a free way in (8 pages free, plus free tools) and earns for the community when they upgrade.",
                },
                {
                  title: "Accounting & bookkeeping firms",
                  body: "You already tell clients which tools to use. Recommend the converter and the free QuickBooks tools you rely on, and earn recurring commission on the clients who take a paid plan. If you convert statements for clients yourself, see the for-bookkeepers page as well.",
                },
              ].map((c) => (
                <div key={c.title} className="rounded-[24px] border border-[#D8E8D2] bg-white p-6">
                  <h3 className="font-bold text-[#0B1F16]">{c.title}</h3>
                  <p className="mt-2 text-sm text-[#5c6f63] leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-[#EFF7ED] border-y border-[#D8E8D2]">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F16] mb-10">How it works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Apply via the contact page",
                  body: "Send us a message through the contact page and tell us about your audience — what you publish or run, who it reaches, and where you would share ConvertStatement. Applications are reviewed manually; there is no automatic approval.",
                },
                {
                  step: "2",
                  title: "Get your referral link",
                  body: "Once approved, your personal referral link is available in the Referrals area of your ConvertStatement dashboard — sign in, open Dashboard → Referrals, and copy your link. Share it wherever your audience is: posts, videos, newsletters, or client emails.",
                },
                {
                  step: "3",
                  title: "Earn 40% recurring",
                  body: "When someone you referred takes a paid plan, you earn 40% of that plan, recurring for as long as they stay subscribed. If they cancel, the commission on that customer stops.",
                },
              ].map((s) => (
                <div key={s.step} className="rounded-[24px] border border-[#D8E8D2] bg-white p-6">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#2CA01C] text-white text-sm font-bold">
                    {s.step}
                  </span>
                  <h3 className="mt-4 font-bold text-[#0B1F16]">{s.title}</h3>
                  <p className="mt-2 text-sm text-[#5c6f63] leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you can promote */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F16] mb-4">What you can promote</h2>
            <p className="text-sm text-[#5c6f63] leading-relaxed max-w-2xl mb-10">
              Real, working tools your audience can try free before anyone pays anything —
              that is what makes a recommendation easy to stand behind.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-[24px] border border-[#D8E8D2] bg-white p-6">
                <h3 className="font-bold text-[#0B1F16]">The statement converter</h3>
                <p className="mt-2 text-sm text-[#5c6f63] leading-relaxed">
                  Bank statement PDF to Excel, CSV, and QuickBooks-ready QBO — with balance
                  checks on every conversion. Everyone starts with 8 pages free, no credit
                  card required, then paid plans at $5, $20, and $75 a month.
                </p>
                <Link href="/" className="mt-4 inline-block text-sm font-semibold text-[#007A33] underline underline-offset-4">
                  Try the converter
                </Link>
              </div>
              <div className="rounded-[24px] border border-[#D8E8D2] bg-white p-6">
                <h3 className="font-bold text-[#0B1F16]">The free QuickBooks tools</h3>
                <p className="mt-2 text-sm text-[#5c6f63] leading-relaxed">
                  Genuinely free tools that solve one painful job each — good material for
                  tutorials and resource pages. Examples: the{" "}
                  <Link href="/tools/free-qbo-cleanup-checker" className="font-semibold text-[#007A33] underline underline-offset-4">free QBO cleanup checker</Link>,{" "}
                  <Link href="/tools/free-stripe-to-quickbooks" className="font-semibold text-[#007A33] underline underline-offset-4">Stripe to QuickBooks</Link>, and{" "}
                  <Link href="/tools/free-paypal-to-quickbooks" className="font-semibold text-[#007A33] underline underline-offset-4">PayPal to QuickBooks</Link>.
                </p>
                <Link href="/tools" className="mt-4 inline-block text-sm font-semibold text-[#007A33] underline underline-offset-4">
                  Browse all tools
                </Link>
              </div>
              <div className="rounded-[24px] border border-[#D8E8D2] bg-white p-6">
                <h3 className="font-bold text-[#0B1F16]">The Bulk QuickBooks Suite</h3>
                <p className="mt-2 text-sm text-[#5c6f63] leading-relaxed">
                  Six free, file-based tools for heavier QuickBooks work:{" "}
                  <Link href="/tools/bulk-import-quickbooks" className="font-semibold text-[#007A33] underline underline-offset-4">bulk import</Link>,{" "}
                  <Link href="/tools/bulk-export-quickbooks" className="font-semibold text-[#007A33] underline underline-offset-4">bulk export</Link>,{" "}
                  <Link href="/tools/bulk-deleter-quickbooks" className="font-semibold text-[#007A33] underline underline-offset-4">bulk deleter</Link>,{" "}
                  <Link href="/tools/qbo-file-editor" className="font-semibold text-[#007A33] underline underline-offset-4">QBO file editor</Link>,{" "}
                  <Link href="/tools/qbo-merger" className="font-semibold text-[#007A33] underline underline-offset-4">QBO merger</Link>, and{" "}
                  <Link href="/tools/iif-to-excel" className="font-semibold text-[#007A33] underline underline-offset-4">IIF to Excel</Link> — no signup needed.
                </p>
                <Link href="/tools/bulk-import-quickbooks" className="mt-4 inline-block text-sm font-semibold text-[#007A33] underline underline-offset-4">
                  Start with bulk import
                </Link>
              </div>
            </div>

            {/* Final CTA */}
            <div className="mt-16 rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-8">
              <h2 className="text-2xl font-bold text-[#0B1F16]">Ready to partner?</h2>
              <p className="mt-2 text-sm text-[#3d5546] max-w-2xl leading-relaxed">
                Tell us about your audience through the contact page. Applications are
                reviewed manually, joining is free, and the full program terms are
                confirmed when your application is approved.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-[#2CA01C] text-white font-semibold px-5 py-2.5 rounded-full text-sm">
                  Apply via our contact page
                </Link>
                <Link href="/for-bookkeepers" className="inline-flex items-center gap-2 border border-[#D8E8D2] bg-white text-[#00573F] font-semibold px-5 py-2.5 rounded-full text-sm">
                  ConvertStatement for bookkeepers
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-[#EFF7ED] border-t border-[#D8E8D2]">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F16] text-center mb-12">Frequently asked questions</h2>
            <FAQAccordion items={FAQS} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
