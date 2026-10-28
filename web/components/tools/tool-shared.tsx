"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Upload, FileText, Loader2, Lock, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Server marks anonymous tool-API calls with this code — the wall shows instead of a raw error. */
export const SIGNUP_REQUIRED_CODE = "SIGNUP_REQUIRED";

/**
 * Tool auth state. `authed === null` while /api/auth/me is checked (render the
 * tool normally so logged-in users never see a flash of the wall). Anonymous
 * visitors get the auth wall. Fail-open on network error — the server still
 * gates every request.
 */
export function useToolAuth() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (live) setAuthed(!!d?.user);
      })
      .catch(() => {
        if (live) setAuthed(true);
      });
    return () => {
      live = false;
    };
  }, []);
  return { authed, forceWall: () => setAuthed(false) };
}

/**
 * Auth wall shown to anonymous visitors — same card look as the dropzone
 * (rounded-[20px] card + dashed inner zone), no animations.
 */
export function ToolAuthWall({ path }: { path: string }) {
  const signup = `/signup?redirectTo=${encodeURIComponent(path)}`;
  const login = `/login?redirectTo=${encodeURIComponent(path)}`;
  return (
    <div className="rounded-[20px] border border-brand-border bg-brand-surface shadow-sm overflow-hidden">
      <div className="p-3">
        <div className="flex flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-brand-border bg-zinc-50/60 dark:bg-zinc-900/50 px-6 py-12 lg:py-16 text-center select-none">
          <div
            className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{ background: "#164234" }}
          >
            <Lock size={36} className="text-white" strokeWidth={1.6} />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-brand-text">
            Create a free account to use this tool
          </h2>
          <p className="mt-2 text-sm text-brand-muted max-w-md">
            It takes under a minute. The tool stays free with your account — CSV
            exports included.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={signup}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-white px-6 py-2.5 font-semibold text-white dark:text-zinc-900 transition-colors"
            >
              <UserPlus size={16} /> Sign up free
            </Link>
            <Link
              href={login}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-2.5 font-semibold text-zinc-900 dark:text-white transition-colors"
            >
              <LogIn size={16} /> Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      code?: string;
      status?: number;
    };
    err.gate = data?.gate;
    err.code = data?.code;
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
      code?: string;
      status?: number;
    };
    err.gate = data?.gate;
    err.code = data?.code;
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

/**
 * Upload dropzone — exact twin of the homepage converter card's drop zone
 * (UploadCard): same rounded-[20px] card, same dashed border, same icon block,
 * same heading/"or browse files" text layout, same drag-over state.
 * Only the copy (title/meta) and accepted types differ per tool.
 * Busy state is static (no spin animation) per site rules.
 */
export function ToolUpload({
  accept,
  busy,
  busyText,
  title,
  meta,
  activeTitle = "Release to upload",
  onFile,
}: {
  accept: string;
  busy: boolean;
  busyText: string;
  title: string;
  meta: string[];
  activeTitle?: string;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const dragDepth = useRef(0);

  return (
    <div className="rounded-[20px] border border-brand-border bg-brand-surface shadow-sm overflow-hidden">

      {/* ── Drop zone ── */}
      <div className="p-3">
        <div
          role="button"
          tabIndex={0}
          aria-label={title}
          onClick={() => {
            if (!busy) inputRef.current?.click();
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !busy) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            if (busy) return;
            dragDepth.current += 1;
            setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (dragDepth.current === 0) setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            dragDepth.current = 0;
            setDragActive(false);
            if (busy) return;
            const f = e.dataTransfer.files?.[0];
            if (f) onFile(f);
          }}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-[10px] border-2 border-dashed px-6 py-16 lg:py-20 text-center transition-colors select-none",
            busy ? "border-zinc-200" : "cursor-pointer",
            !busy &&
              (dragActive
                ? "border-zinc-900 dark:border-zinc-100 bg-brand-surface"
                : "border-brand-border bg-zinc-50/60 dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-brand-surface/80")
          )}
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
            /* Busy (static — no motion animation) */
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl" style={{ background: "#164234" }}>
                <Loader2 size={36} className="text-white" strokeWidth={1.6} />
              </div>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-brand-text">
                {busyText}
              </h2>
              <p className="mt-1 text-base text-brand-muted">This usually takes a few seconds.</p>
            </div>
          ) : (
            /* Idle */
            <>
              <div
                className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300"
                style={{
                  background: dragActive ? "#072b18" : "#164234",
                  transform: dragActive ? "scale(1.06)" : "scale(1)",
                }}
              >
                {dragActive ? (
                  <FileText size={36} className="text-white" strokeWidth={1.6} />
                ) : (
                  <Upload size={36} className="text-white" strokeWidth={1.6} />
                )}
              </div>

              <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-brand-text">
                {dragActive ? activeTitle : title}
              </h2>
              <p className="mt-1 text-base text-brand-muted">
                or <span className="font-bold text-brand-text underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2">browse files</span>
              </p>

              <div className="mt-3 flex items-center gap-2 text-sm text-brand-muted">
                {meta.map((m, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="h-1 w-1 rounded-full bg-zinc-300" />}
                    <span>{m}</span>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function QboGateNotice({ gate }: { gate: string | null }) {
  return (
    <div className="rounded-2xl border border-pine-200 dark:border-pine-800 bg-pine-50 dark:bg-pine-900/20 px-5 py-4">
      <p className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
        <Lock className="h-4 w-4 text-pine-600" /> QBO download is a Pro feature
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
            className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-pine-700 transition-colors"
          >
            <LogIn className="h-4 w-4" /> Sign in
          </Link>
        ) : (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-pine-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-pine-700 transition-colors"
          >
            See Pro plans
          </Link>
        )}
      </div>
    </div>
  );
}
