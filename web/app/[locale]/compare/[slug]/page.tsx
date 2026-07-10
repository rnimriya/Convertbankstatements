import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { headers } from "next/headers";
import { COMPETITORS, getCompetitorBySlug, getAllCompetitorSlugs } from "@/lib/seo/competitors";
import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export function generateStaticParams() {
  return getAllCompetitorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const comp = getCompetitorBySlug(slug);
  if (!comp) return { title: "Comparison not found" };
  const title = `Convert Statement vs ${comp.name} — Best Bank Statement Converter (2025)`;
  const description = `Compare Convert Statement and ${comp.name} side by side. See which bank statement PDF converter offers better pricing, more export formats, and faster processing for CPAs and finance teams.`;
  return {
    title,
    description,
    alternates: { canonical: `https://convertstatement.online/compare/${slug}` },
    openGraph: { title, description, url: `https://convertstatement.online/compare/${slug}` },
  };
}

interface RowProps {
  feature: string;
  us: string | boolean;
  them: string | boolean;
}

function CompareRow({ feature, us, them }: RowProps) {
  const renderValue = (val: string | boolean) => {
    if (typeof val === "boolean") {
      return val ? (
        <Check className="h-5 w-5 text-emerald-500" />
      ) : (
        <X className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
      );
    }
    return <span className="text-sm">{val}</span>;
  };

  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800">
      <td className="py-3 pr-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{feature}</td>
      <td className="py-3 px-4 text-center">{renderValue(us)}</td>
      <td className="py-3 pl-4 text-center">{renderValue(them)}</td>
    </tr>
  );
}

export default async function ComparePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const comp = getCompetitorBySlug(slug);
  if (!comp) notFound();

  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Convert Statement vs ${comp.name}`,
    description: `Side-by-side comparison of Convert Statement and ${comp.name} for bank statement PDF conversion.`,
    url: `https://convertstatement.online/compare/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "SoftwareApplication",
          name: "Convert Statement",
          url: "https://convertstatement.online",
          applicationCategory: "FinanceApplication",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@type": "SoftwareApplication",
          name: comp.name,
          url: comp.url,
          applicationCategory: "FinanceApplication",
        },
      ],
    },
  };

  return (
    <>
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        {/* Hero */}
        <section className="border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-b from-violet-50/60 to-white dark:from-zinc-900 dark:to-zinc-950 px-6 py-16 text-center">
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-3">
            Competitor Comparison
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight max-w-3xl mx-auto">
            Convert Statement vs {comp.name}
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            See how Convert Statement compares to {comp.name} on pricing, export formats, speed, and privacy — so you can pick the right tool for your accounting workflow.
          </p>
        </section>

        {/* Comparison Table */}
        <section className="mx-auto max-w-3xl px-6 py-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-zinc-200 dark:border-zinc-700">
                  <th className="py-3 pr-4 text-left text-xs uppercase tracking-wider text-zinc-400">Feature</th>
                  <th className="py-3 px-4 text-center text-xs uppercase tracking-wider text-violet-600 dark:text-violet-400 font-bold">
                    Convert Statement
                  </th>
                  <th className="py-3 pl-4 text-center text-xs uppercase tracking-wider text-zinc-400">
                    {comp.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                <CompareRow feature="Free pages" us="8 pages forever" them={comp.freePages} />
                <CompareRow feature="Paid plans start at" us="$5/mo (Basic)" them={comp.paidStartsAt} />
                <CompareRow feature="CSV export" us={true} them={comp.outputFormats.some((f) => f.toLowerCase().includes("csv"))} />
                <CompareRow feature="Excel export" us={true} them={comp.outputFormats.some((f) => f.toLowerCase().includes("excel") || f.toLowerCase().includes("xls"))} />
                <CompareRow feature="OFX / QFX export" us={true} them={comp.hasOFX} />
                <CompareRow feature="Google Sheets" us={true} them={comp.hasGoogleSheets} />
                <CompareRow feature="JSON export" us={false} them={comp.outputFormats.some((f) => f.toLowerCase().includes("json"))} />
                <CompareRow feature="API access" us={true} them={comp.hasAPI} />
                <CompareRow feature="Bulk processing" us={true} them={comp.hasBulkProcessing} />
                <CompareRow feature="Bank coverage" us="400+ banks globally" them={comp.bankCoverage} />
                <CompareRow feature="Processing speed" us="Under 15 seconds" them={comp.speed} />
                <CompareRow feature="Zero-storage privacy" us={true} them={false} />
              </tbody>
            </table>
          </div>
        </section>

        {/* Why Convert Statement Wins */}
        <section className="bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-100 dark:border-zinc-800 px-6 py-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              Why teams choose Convert Statement over {comp.name}
            </h2>
            <ul className="space-y-4">
              {comp.weaknesses.map((w, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <Check className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{w}</span>
                </li>
              ))}
              <li className="flex gap-3 items-start">
                <Check className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Convert Statement processes files in-memory with zero storage — your financial data is never saved on any server.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
            Ready to switch from {comp.name}?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-lg mx-auto">
            Start with 8 free pages — no credit card required. See why 10,000+ finance professionals prefer Convert Statement.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-violet-700 transition-colors"
          >
            Try Convert Statement Free <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Other comparisons */}
        <section className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-10">
          <div className="mx-auto max-w-3xl">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Other comparisons</h3>
            <div className="flex flex-wrap gap-3">
              {COMPETITORS.filter((c) => c.slug !== slug).map((c) => (
                <Link
                  key={c.slug}
                  href={`/compare/${c.slug}`}
                  className="rounded-full border border-zinc-200 dark:border-zinc-700 px-4 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  vs {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
