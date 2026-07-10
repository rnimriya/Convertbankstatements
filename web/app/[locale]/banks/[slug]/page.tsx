import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTopBanksForSEO, getBankBySlug } from "@/lib/seo/banks";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, FileText, Lock, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

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

  return {
    title: `Convert ${bankName} Bank Statements to Excel & CSV | ConvertStatement`,
    description: `Easily convert your ${bankName} PDF bank statements into Excel, CSV, OFX, or Google Sheets formats in under 15 seconds. Accurate, private, and secure.`,
    alternates: { canonical: `https://convertstatement.online/${locale}/banks/${slug}` },
  };
}

export default async function BankSeoPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const bankName = getBankBySlug(slug);

  if (!bankName) {
    notFound();
  }

  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `ConvertStatement for ${bankName}`,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "WebBrowser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": `Convert ${bankName} bank statements to Excel, CSV, or OFX instantly.`
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-text antialiased">
      <Navbar />

      <main className="flex-1">
        {/* Simplified Hero for SEO pages */}
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
          </div>
        </div>

        {/* Benefits Section */}
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
                <p className="text-brand-muted">Export to Excel, CSV, Google Sheets, or OFX for seamless import into QuickBooks and Xero.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
    </div>
  );
}
