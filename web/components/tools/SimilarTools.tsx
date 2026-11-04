import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSimilarTools } from "@/lib/tools/similar";

/**
 * "Similar tools" cards section — six family-related tool cards for the
 * page identified by `currentPath` (e.g. "/tools/csv-to-qbo"), driven by
 * lib/tools/similar.ts. Shared by ToolPageLayout pages and bespoke tool
 * pages (e.g. /tools/qbo-checker) so every tool page renders it identically.
 */
export function SimilarToolsSection({ currentPath }: { currentPath: string }) {
  const similar = getSimilarTools(currentPath);
  return (
    <section className="py-16 bg-white border-t border-[#E3EDE0]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#E3F2DF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007A33] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
            Similar tools
          </span>
          <h2 className="font-display text-3xl font-bold text-brand-text">Similar tools</h2>
          <p className="text-brand-muted text-sm mt-2">{similar.subline}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {similar.tools.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group flex flex-col rounded-[22px] border border-[#E3EDE0] bg-white p-5 shadow-[0_1px_3px_rgba(11,31,22,0.05)] transition-colors hover:border-[#CBE3C4]"
            >
              <img src={t.img} alt="" width={52} height={52} loading="lazy" className="mb-3 h-[52px] w-[52px] rounded-[14px] bg-[#F2F4EC] object-contain" />
              <span className="font-display text-[15.5px] font-bold text-[#0B1F16]">{t.name}</span>
              <span className="mt-1 flex-1 text-[13px] leading-relaxed text-[#5C6F5B]">{t.desc}</span>
              <span className="mt-3 flex items-center justify-between">
                {t.tag === "free" ? (
                  <span className="inline-block rounded-full bg-[#E4F4E0] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#1E7A12]">
                    100% Free
                  </span>
                ) : t.tag === "pop" ? (
                  <span className="inline-block rounded-full bg-[#FFF3D6] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#8A6100]">
                    Most popular
                  </span>
                ) : (
                  <span />
                )}
                <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2CA01C]">
                  Open tool <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
