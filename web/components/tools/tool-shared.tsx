"use client";

import { useRef } from "react";
import Link from "next/link";
import { Upload, Loader2, Lock, LogIn } from "lucide-react";

export const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function downloadTextFile(name: string, text: string, mime = "text/plain") {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** POST a JSON body and save the binary response as a file. Throws on non-OK. */
export async function downloadFromApi(url: string, body: unknown, fileName: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const err = new Error((data?.error as string) ?? "Download failed.") as Error & {
      gate?: string;
      status?: number;
    };
    err.gate = data?.gate;
    err.status = res.status;
    throw err;
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
  return res.headers.get("X-Removed-Duplicates");
}

/** POST a File via FormData and save the binary response as a file. */
export async function downloadFileFromApi(url: string, file: File, fileName: string) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(url, { method: "POST", body: fd });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const err = new Error((data?.error as string) ?? "Download failed.") as Error & {
      gate?: string;
      status?: number;
    };
    err.gate = data?.gate;
    err.status = res.status;
    throw err;
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
  return res.headers.get("X-Removed-Duplicates");
}

export function ToolUpload({
  accept,
  busy,
  busyText,
  title,
  hint,
  onFile,
}: {
  accept: string;
  busy: boolean;
  busyText: string;
  title: string;
  hint: string;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className="rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 px-6 py-10 text-center cursor-pointer hover:border-violet-400 transition-colors"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
      {busy ? (
        <Loader2 className="h-9 w-9 mx-auto text-violet-600 animate-spin" />
      ) : (
        <Upload className="h-9 w-9 mx-auto text-violet-600" />
      )}
      <p className="mt-3 font-semibold text-zinc-900 dark:text-white">
        {busy ? busyText : title}
      </p>
      <p className="mt-1 text-sm text-zinc-400">{hint}</p>
    </div>
  );
}

export function QboGateNotice({ gate }: { gate: string | null }) {
  return (
    <div className="rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 px-5 py-4">
      <p className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
        <Lock className="h-4 w-4 text-violet-600" /> QBO download is a Pro feature
      </p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        {gate === "login"
          ? "Sign in to your Convert Statement account to continue — QBO downloads are included on the Pro plan."
          : "Your current plan doesn't include QBO downloads. Upgrade to Pro ($20/month) to unlock one-click QBO files."}{" "}
        The report and CSV download above are free and yours to keep.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {gate === "login" ? (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-violet-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-violet-700"
          >
            <LogIn className="h-4 w-4" /> Sign in
          </Link>
        ) : (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-violet-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-violet-700"
          >
            See Pro plans
          </Link>
        )}
      </div>
    </div>
  );
}
