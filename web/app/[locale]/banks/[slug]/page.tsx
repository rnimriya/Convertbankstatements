import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTopBanksForSEO, getBankBySlug } from "@/lib/seo/banks";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, FileText, Lock, Zap, Upload, Settings2, Download, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { headers } from "next/headers";

// The [locale] segment is handled by next-intl middleware (localePrefix: as-needed),
// so this page must render dynamically like the blog/guide pages — a
// generateStaticParams without the locale segment 500s in production.
export const dynamic = "force-dynamic";

// Only render the top 50 banks at build time.
export async function generateStaticParams() {
  const banks = getTopBanksForSEO(50);
  return banks.map((bank) => ({
    slug: bank.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const bankName = getBankBySlug(slug);

  if (!bankName) {
    return { title: "Bank Not Found" };
  }

  const title = `Convert ${bankName} Bank Statements to Excel & CSV | ConvertStatement`;
  const description = `Convert your ${bankName} PDF bank statement to Excel, CSV, OFX or Google Sheets in under 15 seconds. Free for your first 8 pages — no manual typing, 99.4% accuracy.`;
  return {
    title,
    description,
    alternates: { canonical: `https://convertstatement.online/${locale}/banks/${slug}` },
    openGraph: { title, description, url: `https://convertstatement.online/banks/${slug}` },
  };
}

export default async function BankSeoPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const bankName = getBankBySlug(slug);

  if (!bankName) {
    notFound();
  }

  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const steps = [
    {
      icon: <Upload size={22} className="text-amber-500" />,
      title: `Upload your ${bankName} PDF`,
      body: `Drag & drop your ${bankName} statement — password-protected files work too. Just enter the PDF password at upload.`,
    },
    {
      icon: <Settings2 size={22} className="text-purple-500" />,
      title: "Choose your format",
      body: "Pick Excel, CSV, OFX/QBO for QuickBooks, Xero & Tally, or push straight to Google Sheets.",
    },
    {
      icon: <Download size={22} className="text-indigo-500" />,
      title: "Download in seconds",
      body: "Your file is ready in under 15 seconds — clean columns, correct dates, every transaction captured.",
    },
  ];

  const faqs = [
    {
      q: `Can I convert a password-protected ${bankName} statement?`,
      a: `Yes. Upload your ${bankName} PDF and enter the document password when prompted. We never store your password, and the file is deleted immediately after conversion.`,
    },
    {
      q: `Which formats can I export my ${bankName} statement to?`,
      a: `Excel (.xlsx), CSV, OFX/QBO for QuickBooks, Xero and Tally, plus direct export to Google Sheets. Every format is optimized for its target — dates, amounts and references stay clean.`,
    },
    {
      q: `How do I import my ${bankName} statement into Tally or QuickBooks?`,
      a: `Convert your ${bankName} PDF to OFX or QBO on Convert Statement, then import the file through your accounting software's bank-feed import. The whole round-trip takes about two minutes.`,
    },
    {
      q: `Is my ${bankName} statement data stored on your servers?`,
      a: `No. Files are processed in memory and deleted immediately after conversion. Nothing is written to disk or kept in a database, and we follow GDPR and CCPA data-protection standards.`,
    },
    {
      q: `How much does it cost to convert ${bankName} statements?`,
      a: `Your first 8 pages are free — no credit card required. After that, pay $1 per document or pick a monthly plan starting at $5 for 25 pages.`,
    },
  ];

  const relatedBanks = getTopBanksForSEO(50)
    .filter((b) => b.slug !== slug)
    .slice(0, 6);

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `ConvertStatement for ${bankName}`,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "WebBrowser",
    "url": `https://convertstatement.online/banks/${slug}`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": `Convert ${bankName} bank statements to Excel, CSV, or OFX instantly.`
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to convert ${bankName} bank statements to Excel`,
    "description": `Convert your ${bankName} PDF bank statement to Excel, CSV or OFX in three quick steps.`,
    "totalTime": "PT1M",
    "step": steps.map((s, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": s.title,
      "text": s.body,
    })),
  };

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-text antialiased">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <h1 className="text-4xl sm:text-6xl font-black text-brand-text tracking-tight mb-8">
              Convert <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-purple-500">{bankName}</span> Statements to Excel
            </h1>
            <p className="text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed mb-10">
              Upload your {bankName} PDF bank statements and instantly convert them to CSV, Excel, OFX for Tally, or Google Sheets. Zero manual data entry required.
            </p>

            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-brand-text text-brand-bg px-8 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-brand-accent/20 hover:scale-105 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-200"
            >
              Start Converting Free <Zap size={16} className="text-brand-accent" />
            </Link>
            <p className="mt-4 text-sm text-brand-muted">8 pages free · No credit card required</p>
          </div>
        </div>

        {/* How it works */}
        <div className="py-20 bg-brand-bg">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold">How to convert {bankName} statements in 3 steps</h2>
              <p className="text-brand-muted mt-3">From PDF to spreadsheet in under a minute.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((s, i) => (
                <div key={i} className="bg-brand-surface p-8 rounded-3xl border border-brand-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center">
                      {s.icon}
                    </div>
                    <span className="text-sm font-bold text-brand-muted">Step {i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="py-24 bg-brand-surface border-y border-brand-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Why use ConvertStatement for {bankName}?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-brand-bg p-8 rounded-3xl border border-brand-border">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="text-amber-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-brand-muted">Convert multi-page {bankName} PDFs into structured spreadsheets in under 15 seconds.</p>
              </div>

              <div className="bg-brand-bg p-8 rounded-3xl border border-brand-border">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Lock className="text-purple-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">100% Private</h3>
                <p className="text-brand-muted">We never store your {bankName} financial data. Files are processed entirely in memory.</p>
              </div>

              <div className="bg-brand-bg p-8 rounded-3xl border border-brand-border">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="text-indigo-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Multiple Formats</h3>
                <p className="text-brand-muted">Export to Excel, CSV, Google Sheets, or OFX for seamless import into QuickBooks, Xero and Tally.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="py-24 bg-brand-bg">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">{bankName} conversion FAQs</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <details key={i} className="group bg-brand-surface border border-brand-border rounded-2xl px-6 py-5">
                  <summary className="flex items-center justify-between cursor-pointer font-semibold list-none">
                    {f.q}
                    <ChevronDown size={18} className="text-brand-muted shrink-0 ml-4 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-3 text-brand-muted text-sm leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Related banks — internal linking */}
        <div className="py-20 bg-brand-surface border-t border-brand-border">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold">Convert statements from other banks</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedBanks.map((b) => (
                <Link
                  key={b.slug}
                  href={`/banks/${b.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-bg border border-brand-border text-sm font-medium hover:border-brand-accent transition-colors"
                >
                  <CheckCircle2 size={15} className="text-brand-secondary" />
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-24 bg-brand-bg">
          <div className="text-center max-w-2xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">Stop typing {bankName} transactions manually</h2>
            <p className="text-brand-muted mb-8">Join 10,000+ finance professionals converting statements in seconds.</p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-brand-text text-brand-bg px-8 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-brand-accent/20 hover:scale-105 transition-all duration-200"
            >
              Convert free — 8 pages <Zap size={16} className="text-brand-accent" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
    </div>
  );
}
