import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { buildReportVM } from "@/lib/autopay/report-vm";
import { SAMPLE_TRANSACTIONS } from "@/lib/autopay/sample-statement";
import { AutopayAuditClient } from "./AutopayAuditClient";
import { KhojProCheckout } from "./KhojProCheckout";

const PAGE_URL = "https://www.convertstatement.online/autopay-audit";

export const metadata: Metadata = {
  title: "AutoPay Khoj — Free Subscription & AutoPay Audit | Convert Statement",
  description:
    "Upload a bank statement and find every recurring charge — UPI AutoPay, card mandates, Play Store, App Store and NACH — with the waste flagged and a step-by-step cancel guide for each. Free audit, no bank login, statement never stored.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "AutoPay Khoj — Find every subscription hiding in your statement",
    description:
      "Every recurring charge across UPI, cards, app stores and bank mandates, in one honest report — with the waste flagged and cancel steps for each.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "How is this different from the free NPCI UPI Help portal?",
    a: "The NPCI portal (upihelp.npci.org.in) is genuinely useful — and it only shows UPI mandates. Card subscriptions, Google Play and App Store billing, and NACH debits never appear there. AutoPay Khoj reads your whole statement, so all four routes appear in one list, and it flags which charges look like waste and why.",
  },
  {
    q: "Do you need my bank login or card details?",
    a: "No. Never. You upload a bank statement PDF — the same file you would give your CA. There is no bank login, no card number, and no UPI PIN involved at any step.",
  },
  {
    q: "Is my statement stored?",
    a: "No. Like every ConvertStatement conversion, the file is processed in memory to build your report and is not stored on our servers.",
  },
  {
    q: "My statement is password-protected. What do I do?",
    a: "Remove the password first (most banks let you download an unprotected copy, or you can save a copy from your PDF reader) and upload that. Protected files are not supported yet — the same limit as our statement converter, and we would rather say so plainly than pretend otherwise.",
  },
  {
    q: "Can you cancel a subscription for me in one click?",
    a: "Nobody honestly can. A UPI mandate can only be revoked by you, in your own UPI app, with your PIN — and a service must also be cancelled in the service's own app. Any tool claiming one-click cancellation is misleading you. What we do is give you the exact steps for both halves, per service, so it takes two minutes instead of twenty.",
  },
  {
    q: "How do you decide something is 'waste'?",
    a: "Only with a written reason you can check: paying for two video services at once, a free trial that quietly turned into a paid plan, a price rise you may not have noticed, or a charge running for over a year. We never claim to know whether you use a service — a statement cannot show that. Loan EMIs, investments and insurance are never labelled waste.",
  },
  {
    q: "What does it cost?",
    a: "The audit is free. Khoj Pro (₹99/month or ₹699/year) adds alerts before each debit lands, price-rise alerts and a monthly report — it launches with the full release.",
  },
];

export default function AutopayAuditPage() {
  const sampleVM = buildReportVM(SAMPLE_TRANSACTIONS);
  return (
    <div className="agri-sans min-h-screen bg-white">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#EFF7ED] to-[#F7FAF5] px-6 pt-[124px] pb-14">
          <div className="relative mx-auto max-w-6xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#D8E8D2] bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#007A33]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2CA01C]" />
              AutoPay Khoj · Free audit
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-[#0B1F16] sm:text-4xl">
              Every rupee on autopilot, found.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5c6f63]">
              Subscriptions hide in four different places — UPI AutoPay, card mandates, app stores and bank
              NACH debits — and no single app shows you all of them. AutoPay Khoj reads your bank statement
              and puts every recurring charge in one honest list: what it costs, when it lands next, which
              ones look like waste, and the exact steps to cancel each one.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5c6f63]">
              No bank login. No card details. Your statement is processed to build the report and is never stored.
            </p>
          </div>
        </section>

        {/* Upload + Report */}
        <section className="bg-white px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <AutopayAuditClient sampleVM={sampleVM} />
          </div>
        </section>

        {/* Honesty + Pro */}
        <section className="border-t border-[#D8E8D2] bg-[#EFF7ED] px-6 py-14">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <div className="rounded-[24px] border border-[#D8E8D2] bg-white p-8">
              <h2 className="text-2xl font-bold text-[#0B1F16]">What we will never claim</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#3d5546]">
                <li>
                  <strong>One-click cancellation.</strong> A mandate ends only in your own UPI app or bank,
                  with your PIN. We give you the exact steps for both halves — service and mandate.
                </li>
                <li>
                  <strong>“You don’t use this.”</strong> A statement shows payments, not usage. Our flags
                  always carry a checkable reason, in plain words.
                </li>
                <li>
                  <strong>UPI-only coverage dressed up as everything.</strong> The free NPCI portal already
                  shows UPI mandates. Our job is the full picture: UPI + card + app stores + NACH, plus the
                  waste check.
                </li>
              </ul>
            </div>
            <div className="rounded-[24px] border border-[#D8E8D2] bg-white p-8">
              <h2 className="text-2xl font-bold text-[#0B1F16]">Khoj Pro</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#3d5546]">
                The audit above is free, forever. Khoj Pro adds the part a one-time report cannot do:
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#3d5546]">
                <li>• A WhatsApp alert 3 days and 1 day before every debit lands</li>
                <li>• An alert the moment any subscription raises its price</li>
                <li>• A trial-countdown, so free trials never convert silently</li>
                <li>• A monthly Paisa Report, and cover for up to 4 family members</li>
              </ul>
              <KhojProCheckout />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-[#0B1F16] sm:text-4xl">
              Frequently asked questions
            </h2>
            <FAQAccordion items={FAQS} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
