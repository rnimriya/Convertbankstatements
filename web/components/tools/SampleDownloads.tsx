"use client";

import { Download } from "lucide-react";
import { SAMPLES, type SampleFile } from "@/lib/tools/samples";
import { downloadTextFile } from "./tool-shared";

/** Download buttons for the sample files. `ids` limits the list; default is all. */
export function SampleDownloads({ ids }: { ids?: string[] }) {
  const list: SampleFile[] = ids
    ? SAMPLES.filter((s) => ids.includes(s.id))
    : SAMPLES;
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((s) => (
        <button
          key={s.id}
          onClick={() => downloadTextFile(s.filename, s.content, s.filename.endsWith(".csv") ? "text/csv" : "text/plain")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:border-teal-400"
        >
          <Download className="h-3.5 w-3.5" /> {s.label}
        </button>
      ))}
    </div>
  );
}
