import type { ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { Wrench } from "lucide-react";

export interface ToolFaq {
  q: string;
  a: string;
}

const FREE_TOOLS = [
  { href: "/tools/qbo-cleanup-checker", label: "QBO Duplicate Finder" },
  { href: "/tools/stripe-to-quickbooks", label: "Stripe → QuickBooks Converter" },
  { href: "/tools/paypal-to-quickbooks", label: "PayPal → QuickBooks Converter" },
  { href: "/tools/receipt-to-quickbooks", label: "Receipt → QuickBooks Tool" },
  { href: "/tools/qbo-checker", label: "QBO File Checker" },
];

/**
 * Shared layout for the free QuickBooks tools — same design system as the
 * /quickbooks and guide pages: violet eyebrow hero, content + sidebar with
 * the "Ready to convert?" box, FAQ accordion, final CTA. No animations.
 */
export async function ToolPageLayout({
  eyebrow,
  title,
  subtitle,
  tool,
  content,
  faqs,
  howToName,
  howToSteps,
  currentPath,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  tool: ReactNode;
  content: ReactNode;
  faqs: ToolFaq[];
  howToName: string;
  howToSteps: { title: string; body: string }[];
  currentPath: string;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howToName,
    step: howToSteps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };

  return (
    <>
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        <section className="bg-gradient-to-b from-violet-50/60 to-white dark:from-zinc-900 dark:to-zinc-950 border-b border-zinc-100 dark:border-zinc-800 px-6 py-16 text-center">
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-3">
            {eyebrow}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight max-w-4xl mx-auto">
            {title}
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {tool}
            <div className="mt-12">{content}</div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="p-6 rounded-2xl bg-violet-600 text-white">
              <h3 className="font-bold mb-2">Ready to convert?</h3>
              <p className="text-violet-100 text-sm mb-4">
                Your first 8 pages are free — CSV and Excel included, no credit card required.
              </p>
              <Link href="/signup" className="block w-full text-center bg-white text-violet-900 font-semibold py-2 rounded-lg hover:bg-zinc-50 transition-colors">
                Start Free Trial
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-violet-500" /> Free QuickBooks tools
              </h3>
              <div className="flex flex-col gap-3">
                {FREE_TOOLS.filter((t) => t.href !== currentPath).map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-700 bg-zinc-50 dark:bg-zinc-900/50 transition-colors"
                  >
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-sm">
                      {t.label}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white text-center mb-8">
            Frequently asked questions
          </h2>
          <FAQAccordion items={faqs} />
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="p-8 rounded-2xl bg-violet-600 text-white text-center">
            <h2 className="text-2xl font-extrabold">Bringing statements into QuickBooks?</h2>
            <p className="text-violet-100 mt-3 max-w-lg mx-auto">
              Convert any PDF bank statement into a balance-checked QBO or CSV file in minutes.
              The first 8 pages are on us.
            </p>
            <Link
              href="/quickbooks"
              className="mt-6 inline-block bg-white text-violet-900 font-semibold px-8 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              See the QuickBooks converter
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
