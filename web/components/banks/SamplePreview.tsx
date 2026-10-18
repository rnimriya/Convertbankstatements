import { ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * Sample before/after preview for bank pages. The numbers are a small,
 * internally-consistent SAMPLE (opening + rows = closing), clearly labeled,
 * so visitors can see the shape of the output without signing up.
 */
const ROWS = [
  { date: "Jan 03", desc: "Payroll — ACME LLC", category: "Payroll", amount: 3200.0, balance: 5650.0 },
  { date: "Jan 05", desc: "Shell Oil Fuel", category: "Fuel", amount: -62.4, balance: 5587.6 },
  { date: "Jan 09", desc: "AWS Cloud Services", category: "Software", amount: -148.99, balance: 5438.61 },
  { date: "Jan 12", desc: "Office Depot Supplies", category: "Office", amount: -86.25, balance: 5352.36 },
  { date: "Jan 15", desc: "Transfer to Savings", category: "Transfer", amount: -500.0, balance: 4852.36 },
];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function SamplePreview({ bankName }: { bankName: string }) {
  return (
    <div className="py-20 bg-brand-bg border-t border-brand-border">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">See what the conversion looks like</h2>
          <p className="text-brand-muted mt-3">
            A sample {bankName} statement (left) and the file you download (right). Sample data —
            your statement converts the same way.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
          {/* Before: statement excerpt */}
          <div className="rounded-3xl border border-brand-border bg-brand-surface p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-4">
              {bankName} statement PDF · excerpt
            </p>
            <div className="space-y-3 text-sm">
              <p className="flex justify-between border-b border-brand-border pb-2">
                <span className="text-brand-muted">Opening balance</span>
                <span className="font-semibold">{money(2450)}</span>
              </p>
              {ROWS.map((r) => (
                <p key={r.desc} className="flex justify-between gap-3">
                  <span className="text-brand-muted">
                    {r.date} · {r.desc}
                  </span>
                  <span className={r.amount < 0 ? "" : "text-emerald-600 dark:text-emerald-400 font-medium"}>
                    {money(r.amount)}
                  </span>
                </p>
              ))}
              <p className="flex justify-between border-t border-brand-border pt-2">
                <span className="text-brand-muted">Closing balance</span>
                <span className="font-semibold">{money(4852.36)}</span>
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
              <ArrowRight size={18} />
            </span>
          </div>

          {/* After: converted output */}
          <div className="rounded-3xl border border-brand-border bg-brand-surface p-6 overflow-x-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-4">
              Converted CSV / Excel / QBO
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-brand-muted border-b border-brand-border">
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">Description</th>
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold text-right">Amount</th>
                  <th className="pb-2 font-semibold text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.desc} className="border-b border-brand-border/60 last:border-0">
                    <td className="py-2 whitespace-nowrap">{r.date}</td>
                    <td className="py-2">{r.desc}</td>
                    <td className="py-2 text-brand-muted">{r.category}</td>
                    <td className="py-2 text-right whitespace-nowrap">{money(r.amount)}</td>
                    <td className="py-2 text-right whitespace-nowrap">{money(r.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={16} /> Balance verified — opening {money(2450)} → closing {money(4852.36)}
            </p>
          </div>
        </div>

        {/* Product demo video (real screens of the live product) */}
        <div className="mt-12 max-w-3xl mx-auto">
          <p className="text-center text-sm font-bold uppercase tracking-wider text-brand-muted mb-4">
            Watch it happen — 16 seconds
          </p>
          <video
            controls
            preload="none"
            poster="/demo/convert-demo-poster.jpg"
            className="w-full rounded-3xl border border-brand-border shadow-lg"
          >
            <source src="/demo/convert-demo.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
