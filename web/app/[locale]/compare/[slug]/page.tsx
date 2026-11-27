import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { COMPETITORS, getCompetitorBySlug, getAllCompetitorSlugs } from "@/lib/seo/competitors";
import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { visibleBankCount } from "@/lib/config/bank-region";
import { isIndiaSite } from "@/lib/site-region";
import { IndiaStickyBar } from "@/components/inner-india/IndiaInner";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.convertstatement.online";

// Same fix as banks/[slug]: with next-intl's as-needed locale prefix,
// generateStaticParams alone (missing the locale segment) 500s in production.

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
    alternates: { canonical: `${BASE}/compare/${slug}` },
    openGraph: { title, description, url: `${BASE}/compare/${slug}` },
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
        <Check className="h-5 w-5 text-[#007A33]" />
      ) : (
        <X className="h-5 w-5 text-zinc-300" />
      );
    }
    return <span className="text-sm">{val}</span>;
  };

  return (
    <tr className="border-b border-[#CBE3C4]">
      <td className="py-3 pr-4 text-sm font-medium text-zinc-700">{feature}</td>
      <td className="py-3 px-4 text-center">{renderValue(us)}</td>
      <td className="py-3 pl-4 text-center">{renderValue(them)}</td>
    </tr>
  );
}

export default async function ComparePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const comp = getCompetitorBySlug(slug);
  if (!comp) notFound();
  const IN = isIndiaSite();

  const nonce = BUILD_NONCE;

  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Convert Statement vs ${comp.name}`,
    description: `Side-by-side comparison of Convert Statement and ${comp.name} for bank statement PDF conversion.`,
    url: `${BASE}/compare/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "SoftwareApplication",
          name: "Convert Statement",
          url: BASE,
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
    <div className="agri-sans">
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
      />
      <Navbar dark />
      <main className={IN ? "min-h-screen bg-[#FAFAFC]" : "min-h-screen bg-white"}>
        {/* Hero */}
        <section className={IN
          ? "india-dark-band relative overflow-hidden bg-[#052e22] px-6 pt-14 pb-16 text-center"
          : "relative overflow-hidden bg-[#0B1F16] px-6 pt-[124px] pb-16 text-center"}>
          {!IN && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,0.38), rgba(19,84,28,0.28) 55%, transparent 75%)" }} />
          )}
          <p className={IN
            ? "relative text-[11px] font-bold uppercase tracking-[0.18em] text-[#6ee7b7] mb-3.5"
            : "agri-mono relative inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#B9D6B2] mb-3"}>
            {!IN && <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />}
            Competitor Comparison
          </p>
          <h1 className={IN
            ? "relative font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.15] max-w-3xl mx-auto"
            : "relative text-2xl sm:text-[1.8rem] font-extrabold text-white leading-tight max-w-3xl mx-auto"}>
            Convert Statement vs {IN ? <span className="text-[#34d399]">{comp.name}</span> : <span className="agri-serif">{comp.name}</span>}
          </h1>
          <p className={IN ? "relative mt-4 text-lg text-[#d1fae5] max-w-2xl mx-auto" : "relative mt-4 text-lg text-zinc-300 max-w-2xl mx-auto"}>
            See how Convert Statement compares to {comp.name} on pricing, export formats, speed, and privacy — so you can pick the right tool for your accounting workflow.
          </p>
        </section>

        {/* Comparison Table */}
        <section className={IN ? "mx-auto max-w-7xl px-4 py-16" : "mx-auto max-w-6xl px-6 py-12"}>
          <div className={IN ? "overflow-x-auto bg-white border border-[#e2e8f0] rounded-xl px-5" : "overflow-x-auto"}>
            <table className="w-full">
              <thead>
                <tr className={IN ? "border-b-2 border-[#e2e8f0]" : "border-b-2 border-[#CBE3C4]"}>
                  <th className="py-3 pr-4 text-left text-xs uppercase tracking-wider text-zinc-400">Feature</th>
                  <th className={IN
                    ? "py-3 px-4 text-center text-xs uppercase tracking-wider text-[#047857] font-bold"
                    : "py-3 px-4 text-center text-xs uppercase tracking-wider text-[#007A33] font-bold"}>
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
                <CompareRow feature="Bank coverage" us={process.env.NEXT_PUBLIC_BANKS_REGION === "IN" ? `${visibleBankCount()} Indian banks` : "400+ banks globally"} them={comp.bankCoverage} />
                <CompareRow feature="Processing speed" us="Under 15 seconds" them={comp.speed} />
                <CompareRow feature="Zero-storage privacy" us={true} them={false} />
              </tbody>
            </table>
          </div>
        </section>

        {/* Why Convert Statement Wins */}
        <section className={IN ? "bg-white border-y border-[#e2e8f0] px-4 py-16" : "bg-[#E3F2DF] border-y border-[#CBE3C4] px-6 py-12"}>
          <div className={IN ? "mx-auto max-w-7xl" : "mx-auto max-w-6xl"}>
            <h2 className={IN
              ? "font-display text-3xl sm:text-[38px] font-extrabold tracking-tight leading-[1.15] text-[#0f172a] mb-8"
              : "text-2xl font-bold text-zinc-900 mb-6"}>
              Why teams choose Convert Statement over {comp.name}
            </h2>
            <ul className="space-y-4">
              {comp.weaknesses.map((w, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <Check className="h-5 w-5 text-[#007A33] mt-0.5 shrink-0" />
                  <span className="text-sm text-zinc-600">{w}</span>
                </li>
              ))}
              <li className="flex gap-3 items-start">
                <Check className="h-5 w-5 text-[#007A33] mt-0.5 shrink-0" />
                <span className="text-sm text-zinc-600">
                  Convert Statement processes files in-memory with zero storage — your financial data is never saved on any server.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">
            Ready to switch from {comp.name}?
          </h2>
          <p className="text-zinc-500 mb-6 max-w-lg mx-auto">
            Start with 8 free pages — no credit card required. See why 10,000+ finance professionals prefer Convert Statement.
          </p>
          <Link
            href="/signup"
            className={IN
              ? "inline-flex items-center gap-2 rounded-[10px] bg-[#047857] px-6 py-3 text-sm font-bold text-white"
              : "inline-flex items-center gap-2 rounded-full bg-[#007A33] px-6 py-3 text-sm font-semibold text-white shadow-lg"}
          >
            Try Convert Statement Free <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Other comparisons */}
        <section className={IN ? "border-t border-[#e2e8f0] px-4 py-10" : "border-t border-[#CBE3C4] px-6 py-10"}>
          <div className={IN ? "mx-auto max-w-7xl" : "mx-auto max-w-6xl"}>
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Other comparisons</h3>
            <div className="flex flex-wrap gap-3">
              {COMPETITORS.filter((c) => c.slug !== slug).map((c) => (
                <Link
                  key={c.slug}
                  href={`/compare/${c.slug}`}
                  className={IN
                    ? "rounded-full border border-[#e2e8f0] bg-white px-4 py-1.5 text-sm text-zinc-600 hover:border-[#a7f3d0] hover:text-[#047857]"
                    : "rounded-full border border-[#CBE3C4] px-4 py-1.5 text-sm text-zinc-600 hover:border-[#007A33] hover:text-[#007A33]"}
                >
                  vs {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
        {IN && <IndiaStickyBar />}
      </main>
      <Footer />
    </div>
  );
}
