"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Upload, FileText, Loader2, Lock, LogIn, UserPlus, Plus, ChevronDown, Monitor, HardDrive, CloudDownload, Link2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DROPBOX_ENABLED, GOOGLE_ENABLED, pickFromDropbox, pickFromGoogleDrive } from "@/lib/imports/cloud";

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
    <div className="rounded-[20px] border border-brand-border bg-brand-surface shadow-[0_2px_10px_rgba(11,31,22,0.04)] overflow-hidden">
      <div className="p-3">
        <div className="flex flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-brand-border bg-zinc-50/60 dark:bg-zinc-900/50 px-6 py-12 lg:py-16 text-center select-none">
          <div
            className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{ background: "#00573F" }}
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
 * Upload dropzone — Design v6 twin of the homepage converter (UploadCard):
 * white card (rounded-[30px], border #e2e2e2, padding 20, XL shadow) around
 * a dashed zone with the split Choose File button and the source dropdown
 * (Device / Dropbox / Google Drive / URL). Only the copy (title/meta) and
 * accepted types differ per tool. Busy state is static (no spin animation)
 * per site rules.
 */
export function ToolUpload({
  accept,
  busy,
  busyText,
  title,
  meta,
  activeTitle = "Release to upload",
  bare = false,
  onFile,
}: {
  accept: string;
  busy: boolean;
  busyText: string;
  title: string;
  meta: string[];
  activeTitle?: string;
  /** Render only the dashed drop zone (no white card frame) — for embedding inside another card. */
  bare?: boolean;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const dragDepth = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlBusy, setUrlBusy] = useState(false);

  const exts = accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.startsWith("."));
  const pdfOnly = exts.length === 1 && exts[0] === ".pdf";
  const dropHint = title.startsWith("Drop ") ? `Or d${title.slice(1)}` : title;

  const openPicker = () => {
    if (!busy) inputRef.current?.click();
  };

  const feedFile = (f: File) => {
    if (exts.length > 0 && !exts.some((e) => f.name.toLowerCase().endsWith(e))) {
      setNotice(`That file type isn't accepted here — please choose a ${exts.join(", ")} file.`);
      return;
    }
    setNotice(null);
    onFile(f);
  };

  const cloudSoon = (name: string) => {
    setMenuOpen(false);
    setNotice(`${name} import is coming soon — please use From Device for now.`);
  };

  const importCloud = async (source: "drive" | "dropbox") => {
    setMenuOpen(false);
    setNotice(null);
    try {
      const file =
        source === "drive"
          ? await pickFromGoogleDrive({ pdfOnly })
          : await pickFromDropbox(exts.length > 0 ? exts : []);
      if (file) feedFile(file);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Import failed. Please try again.");
    }
  };

  const importFromUrl = async () => {
    const raw = urlInput.trim();
    let parsed: URL;
    try {
      parsed = new URL(raw);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("protocol");
    } catch {
      setUrlError("Please paste a valid link starting with http:// or https://.");
      return;
    }
    setUrlBusy(true);
    setUrlError(null);
    try {
      const res = await fetch(parsed.toString());
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const last = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() ?? "");
      const name = last || "downloaded-file";
      const file = new File([blob], name, { type: blob.type || "application/octet-stream" });
      setUrlModalOpen(false);
      setUrlInput("");
      feedFile(file);
    } catch {
      setUrlError("Could not fetch the file from that link — the site may be blocking downloads. Please download the file yourself and use From Device instead.");
    } finally {
      setUrlBusy(false);
    }
  };

  const menuItem =
    "flex w-full items-center gap-3 border-b border-slate-50 px-5 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50";

  const zone = (
    <div
      role="button"
      tabIndex={0}
      aria-label={title}
      onClick={() => {
        if (!busy) openPicker();
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !busy) {
          e.preventDefault();
          openPicker();
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
        if (f) feedFile(f);
      }}
      className={cn(
        "relative flex min-h-[255px] flex-col items-center justify-center rounded-[20px] p-0 text-center transition-colors select-none",
        busy
          ? "border-[2.5px] border-dashed border-[#CFE0CC] bg-white"
          : "cursor-pointer",
        !busy &&
          (dragActive
            ? "border-[2.5px] border-dashed border-[#2CA01C] bg-[#F2F8EF]"
            : "border-[2.5px] border-dashed border-[#8FCE7E] bg-white hover:bg-[#FBFDFB]"),
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) feedFile(f);
          e.target.value = "";
        }}
      />

      {busy ? (
        /* Busy (static — no motion animation) */
        <div className="flex flex-col items-center gap-3 py-1">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full" style={{ background: "#00573F" }}>
            <Loader2 size={22} className="text-white" strokeWidth={1.8} />
          </div>
          <h2 className="text-lg lg:text-xl font-display font-bold tracking-tight text-brand-text">
            {busyText}
          </h2>
          <p className="text-sm text-brand-muted">This usually takes a few seconds.</p>
        </div>
      ) : (
        /* Idle — split Choose File button + source dropdown (homepage v6) */
        <>
          <div className="relative">
            <div className="inline-flex overflow-hidden rounded-md shadow-[0_10px_15px_-3px_rgba(11,31,22,0.25),0_4px_6px_-4px_rgba(11,31,22,0.2)]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker();
                }}
                className="flex min-w-[240px] items-center justify-center gap-2.5 bg-[#2CA01C] px-12 py-[18px] text-lg font-bold tracking-wide text-white transition-colors hover:bg-[#35B424]"
              >
                <Plus size={24} strokeWidth={2.5} /> Choose File
              </button>
              <button
                type="button"
                aria-label="More ways to add a file"
                aria-expanded={menuOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((o) => !o);
                }}
                className="flex items-center border-l border-white/20 bg-[#007A33] px-4 text-white transition-colors hover:bg-[#006B2C]"
              >
                <ChevronDown size={20} className={cn("transition-transform duration-200", menuOpen && "rotate-180")} />
              </button>
            </div>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />
                <div
                  className="absolute right-0 top-[calc(100%+10px)] z-50 w-[252px] overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-[0_20px_25px_-5px_rgba(11,31,22,0.18),0_8px_10px_-6px_rgba(11,31,22,0.12)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openPicker();
                    }}
                    className={menuItem}
                  >
                    <Monitor size={16} className="shrink-0 text-slate-400" /> From Device
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (DROPBOX_ENABLED) void importCloud("dropbox");
                      else cloudSoon("Dropbox");
                    }}
                    className={menuItem}
                  >
                    <CloudDownload size={16} className="shrink-0 text-slate-400" /> From Dropbox
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (GOOGLE_ENABLED) void importCloud("drive");
                      else cloudSoon("Google Drive");
                    }}
                    className={menuItem}
                  >
                    <HardDrive size={16} className="shrink-0 text-slate-400" /> From Google Drive
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setUrlError(null);
                      setUrlModalOpen(true);
                    }}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Link2 size={16} className="shrink-0 text-slate-400" /> From URL
                  </button>
                </div>
              </>
            )}
          </div>

          <p className="mt-3.5 px-4 text-[13px] font-medium text-slate-500">
            {dragActive ? activeTitle : dropHint}
          </p>
          <div className="mt-1.5 flex items-center gap-2 px-4 text-xs text-slate-400">
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
  );

  const extras = (
    <>
      {notice && <p className="mt-3 text-center text-[11px] font-semibold text-pine-600">{notice}</p>}
      {urlModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={() => setUrlModalOpen(false)}>
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-left shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2CA01C] text-white">
                  <Link2 size={15} />
                </span>
                <h3 className="text-sm font-bold text-slate-900 sm:text-base">Import from Web URL</h3>
              </div>
              <button type="button" aria-label="Close" onClick={() => setUrlModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X size={17} />
              </button>
            </div>
            <form
              className="mt-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void importFromUrl();
              }}
            >
              <div className="space-y-1.5">
                <label htmlFor="cs-tool-url-import" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Enter file link
                </label>
                <input
                  id="cs-tool-url-import"
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/file.ofx"
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2CA01C]"
                />
                {urlError && <p className="text-[11px] font-medium text-rose-500">{urlError}</p>}
              </div>
              <button
                type="submit"
                disabled={urlBusy}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2CA01C] py-3 text-sm font-bold text-white transition-colors hover:bg-[#35B424] disabled:opacity-60"
              >
                {urlBusy ? "Fetching file…" : "Import File"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );

  if (bare)
    return (
      <>
        {zone}
        {extras}
      </>
    );

  return (
    <div className="w-full rounded-[30px] border border-[#e2e2e2] bg-white p-5 shadow-[0_20px_25px_-5px_rgba(11,31,22,0.12),0_8px_10px_-6px_rgba(11,31,22,0.10)]">
      {zone}
      {extras}
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
