"use client";

/**
 * AutoPay Khoj — report view (Day 5, 2026-11-11).
 * Pure presentation: the server page runs the detection + waste
 * engines and passes this component a plain view model. Day 6 swaps
 * the sample data source for the real uploaded statement — this
 * component does not change.
 */
import { useState } from "react";
import type { ItemVM, ReportVM } from "@/lib/autopay/report-vm";

export type { ItemVM, ReportVM };

const BAND_STYLE: Record<ItemVM["band"], { dot: string; chip: string; border: string }> = {
  red: { dot: "bg-[#D92D20]", chip: "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]", border: "border-[#FECDCA]" },
  yellow: { dot: "bg-[#DC9300]", chip: "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]", border: "border-[#FEDF89]" },
  green: { dot: "bg-[#2CA01C]", chip: "bg-[#EFF7ED] text-[#007A33] border-[#D8E8D2]", border: "border-[#D8E8D2]" },
};

const BAND_TITLE: Record<ItemVM["band"], string> = {
  red: "Likely waste — act on these first",
  yellow: "Worth a look",
  green: "Looks fine",
};

function ItemCard({ item, defaultOpen = false }: { item: ItemVM; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const s = BAND_STYLE[item.band];
  return (
    <div className={`rounded-[24px] border ${s.border} bg-white p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${s.dot}`} />
            <h3 className="font-bold text-[#0B1F16]">{item.name}</h3>
            {item.essential && (
              <span className="rounded-full border border-[#D8E8D2] bg-[#EFF7ED] px-2 py-0.5 text-[11px] font-bold text-[#007A33]">
                ESSENTIAL
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-[#5c6f63]">
            {item.category} · {item.count} charges since {item.firstDateLabel}
            {item.nextDateLabel ? ` · next expected ${item.nextDateLabel}` : ""}
          </p>
          <p className="mt-1 text-sm text-[#5c6f63]">
            Paid via {item.railLabel}
            {item.railHintLabel ? ` (${item.railHintLabel})` : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold text-[#0B1F16]">{item.typicalAmountLabel}</p>
          <p className="text-sm text-[#5c6f63]">per {item.cycle}</p>
        </div>
      </div>

      {item.signals.length > 0 && (
        <div className="mt-4 space-y-2">
          {item.signals.map((sig) => (
            <p key={sig.id} className={`rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed ${s.chip}`}>
              {sig.detail}
            </p>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2CA01C] px-5 py-2.5 text-sm font-bold text-white"
        aria-expanded={open}
      >
        {open
          ? item.essential
            ? "Hide this"
            : "Hide cancel steps"
          : item.essential
            ? "Read before touching this"
            : "How to cancel this"}
        <span aria-hidden>{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="mt-5 space-y-5 border-t border-[#E4EFE0] pt-5">
          <div className="rounded-xl bg-[#FFFAEB] px-4 py-3 text-sm font-semibold text-[#B54708]">
            Two separate things must be stopped: the service (Part 1) and the money mandate (Part 2).
            Doing only one of them is not enough.
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-[#00573F]">Part 1 — Stop the service</h4>
            {item.guide.serviceSteps ? (
              <>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-[#3d5546]">
                  {item.guide.serviceSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                {item.guide.afterCancel && (
                  <p className="mt-2.5 text-sm text-[#5c6f63]">{item.guide.afterCancel}</p>
                )}
                {item.guide.warning && (
                  <p className="mt-2 rounded-xl bg-[#FEF3F2] px-3.5 py-2.5 text-sm font-semibold text-[#B42318]">
                    {item.guide.warning}
                  </p>
                )}
              </>
            ) : item.essential ? (
              <p className="mt-2 text-sm leading-relaxed text-[#3d5546]">
                This is not a subscription, so there is no in-app cancel button for it. Part 2 explains the
                bank mandate behind it — and why the lender or provider must be spoken to before anything
                about this payment is changed.
              </p>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-[#3d5546]">
                We are still writing the step-by-step guide for this service. Part 2 below stops the money
                either way — and you can also cancel inside the service&apos;s own app or website settings.
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-[#00573F]">Part 2 — Stop the money (mandate)</h4>
            <div className="mt-2 space-y-4">
              {item.guide.railGuides.map((rg) => (
                <div key={rg.title}>
                  <p className="text-sm font-bold text-[#0B1F16]">{rg.title}</p>
                  <ol className="mt-1.5 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-[#3d5546]">
                    {rg.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                  {rg.note && <p className="mt-2 text-sm text-[#5c6f63]">{rg.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BandSection({ band, items }: { band: ItemVM["band"]; items: ItemVM[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-[#0B1F16] sm:text-2xl">
        {BAND_TITLE[band]} <span className="text-[#5c6f63]">({items.length})</span>
      </h2>
      <div className="mt-4 space-y-4">
        {items.map((item, i) => (
          <ItemCard key={item.key} item={item} defaultOpen={band === "red" && i === 0} />
        ))}
      </div>
    </section>
  );
}

export function AutopayReport({ vm }: { vm: ReportVM }) {
  return (
    <div>
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[24px] border border-[#D8E8D2] bg-[#EFF7ED] p-6 sm:p-8">
          <p className="text-sm font-semibold text-[#5c6f63]">Your recurring charges cost</p>
          <p className="mt-1 font-display text-4xl font-bold text-[#0B1F16] sm:text-5xl">{vm.totalMonthlyLabel}</p>
          <p className="mt-1 text-sm text-[#5c6f63]">every month — {vm.totalYearlyLabel} a year</p>
          <p className="mt-3 text-sm text-[#3d5546]">
            {vm.confirmedCount} recurring charges found in this statement ({vm.rangeLabel}).
          </p>
        </div>
        <div className="rounded-[24px] border border-[#FECDCA] bg-[#FEF3F2] p-6 sm:p-8">
          <p className="text-sm font-semibold text-[#B42318]">Possible waste</p>
          <p className="mt-1 font-display text-4xl font-bold text-[#B42318] sm:text-5xl">{vm.possibleWasteMonthlyLabel}</p>
          <p className="mt-1 text-sm text-[#B42318]">every month — {vm.possibleWasteYearlyLabel} a year</p>
          <p className="mt-3 text-sm text-[#7A271A]">
            Only charges with a clear reason (below) are counted here. Nothing is guessed.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {vm.headlineFacts.map((fact, i) => (
          <p key={i} className="text-base leading-relaxed text-[#0B1F16]">
            • {fact}
          </p>
        ))}
      </div>

      <BandSection band="red" items={vm.red} />
      <BandSection band="yellow" items={vm.yellow} />
      <BandSection band="green" items={vm.green} />

      {vm.possible.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#0B1F16] sm:text-2xl">Seen once — check these yourself</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5c6f63]">
            These known services were charged only once in this statement, so we cannot call them subscriptions
            yet. If the charge repeats next month, it is one.
          </p>
          <div className="mt-4 space-y-3">
            {vm.possible.map((p) => (
              <div
                key={p.name}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[24px] border border-[#E4EFE0] bg-white px-6 py-4"
              >
                <p className="font-semibold text-[#0B1F16]">{p.name}</p>
                <p className="text-sm text-[#5c6f63]">
                  {p.amountLabel} · charged {p.lastDateLabel}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
