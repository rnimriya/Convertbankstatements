"use client";

import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import type { Transaction } from "@/types/billing";

interface Props {
  transactions: Transaction[];
}

export function AnalyticsDashboard({ transactions }: Props) {
  const { totalIn, totalOut, netChange } = useMemo(() => {
    let inflow = 0;
    let outflow = 0;

    for (const t of transactions) {
      if (typeof t.amount === "number" && !isNaN(t.amount)) {
        if (t.amount > 0) {
          inflow += t.amount;
        } else {
          outflow += Math.abs(t.amount);
        }
      }
    }

    return {
      totalIn: inflow,
      totalOut: outflow,
      netChange: inflow - outflow,
    };
  }, [transactions]);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="mt-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-violet-500" />
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Pre-Export Analytics (Beta)</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Inflows */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 mb-1">
            <ArrowUpRight className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Total Inflows</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 truncate">
            {formatCurrency(totalIn)}
          </div>
        </div>

        {/* Total Outflows */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-500 mb-1">
            <ArrowDownRight className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Total Outflows</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 truncate">
            {formatCurrency(totalOut)}
          </div>
        </div>

        {/* Net Change */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Net Change</span>
          </div>
          <div className={`text-2xl font-bold truncate ${netChange >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}>
            {netChange >= 0 ? "+" : ""}{formatCurrency(netChange)}
          </div>
        </div>
      </div>
    </div>
  );
}
