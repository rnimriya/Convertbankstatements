"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { usePathname } from "@/i18n/navigation";

/**
 * Public support chat — bottom-right bubble + panel, powered by /api/chat
 * (Gemini, grounded in lib/chat/knowledge.ts). Hidden on dashboard/auth
 * routes where a support bubble would be noise.
 */

const HIDDEN_PREFIXES = ["/dashboard", "/login", "/signup", "/forgot-password", "/reset-password"];

const CHIPS = [
  "What are the prices?",
  "How many pages are free?",
  "My QBO file won't import",
  "Is my data safe?",
  "Do you support password PDFs?",
];

const WELCOME =
  "Hi! I'm the Convert Statement assistant. Ask me anything — pricing, formats, QuickBooks tools, or a file that's giving you trouble.";

interface Msg {
  role: "bot" | "user";
  text: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Minimal, safe rich text: escape everything first, then re-introduce ONLY
 * whitelisted convertstatement.online markdown links, **bold** and breaks.
 */
function renderRich(text: string): string {
  let html = escapeHtml(text);
  html = html.replace(
    /\[([^\]]+)\]\(https:\/\/www\.convertstatement\.online([^)\s]*)\)/g,
    (_m, label: string, path: string) =>
      `<a href="https://www.convertstatement.online${path}" target="_blank" rel="noopener" class="font-bold text-[#007A33] underline decoration-[#007A33]/40 underline-offset-2 hover:decoration-[#007A33]">${label}</a>`
  );
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return html.replace(/\n/g, "<br/>");
}

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: WELCOME }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs, open, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open ]);

  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null;
  }

  async function ask(raw: string) {
    const q = raw.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", text: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const history = next
        .slice(1) // drop the canned welcome — it is not a real assistant turn
        .slice(-10)
        .map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = (await res.json().catch(() => null)) as { reply?: string } | null;
      const reply =
        data?.reply ??
        "Sorry — something went wrong on my side. Please try again, or reach our team from the contact page: https://www.convertstatement.online/contact";
      setMsgs((cur) => [...cur, { role: "bot", text: reply }]);
    } catch {
      setMsgs((cur) => [
        ...cur,
        {
          role: "bot",
          text: "Sorry — I couldn't connect just now. Please check your connection and try again, or reach our team from the contact page: https://www.convertstatement.online/contact",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Bubble */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Chat with us"
          className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 rounded-full bg-[#2CA01C] py-3 pl-4 pr-5 text-[14.5px] font-bold text-white shadow-[0_14px_34px_rgba(0,87,63,0.35)] transition-colors hover:bg-[#007A33]"
        >
          <MessageCircle size={19} />
          Chat with us
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Convert Statement assistant"
          className="fixed bottom-5 right-5 z-[90] flex h-[600px] max-h-[calc(100dvh-40px)] w-[384px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[20px] border border-zinc-200 bg-white shadow-[0_30px_80px_rgba(11,31,22,0.28)] max-[480px]:inset-0 max-[480px]:h-[100dvh] max-[480px]:max-h-none max-[480px]:w-full max-[480px]:max-w-none max-[480px]:rounded-none"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-[linear-gradient(120deg,#2CA01C_0%,#007A33_60%,#00573F_100%)] px-4 py-[15px] text-white">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
              <img src="/logo.svg" alt="" className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-[14.5px] font-extrabold leading-tight">Convert Statement Assistant</p>
              <p className="flex items-center gap-1.5 text-[12px] text-white/85">
                <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#7CFC9A]" />
                Online · replies instantly
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="ml-auto flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div ref={msgsRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-[#FBFCFA] px-3.5 py-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "max-w-[85%] self-end rounded-2xl rounded-br-[5px] bg-[#2CA01C] px-3.5 py-2.5 text-[13.8px] leading-relaxed text-white"
                    : "max-w-[85%] self-start rounded-2xl rounded-bl-[5px] border border-zinc-200 bg-white px-3.5 py-2.5 text-[13.8px] leading-relaxed text-zinc-900"
                }
                dangerouslySetInnerHTML={{ __html: renderRich(m.text) }}
              />
            ))}
            {busy && (
              <div className="max-w-[85%] self-start rounded-2xl rounded-bl-[5px] border border-zinc-200 bg-white px-3.5 py-2.5 text-[13.8px] italic text-zinc-500">
                <span className="animate-pulse">Typing…</span>
              </div>
            )}
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-1.5 bg-[#FBFCFA] px-3.5 pb-1.5 pt-2">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => ask(c)}
                className="rounded-full border border-[#BFE3C6] bg-[#EFF9F0] px-3 py-[7px] text-[12.5px] font-semibold text-[#00573F] transition-colors hover:bg-[#DFF0E2]"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-zinc-200 bg-white px-3 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") ask(input);
              }}
              type="text"
              placeholder="Type your question…"
              maxLength={1200}
              className="min-w-0 flex-1 rounded-full border border-zinc-200 px-4 py-[11px] text-[13.8px] outline-none focus:border-[#2CA01C]"
            />
            <button
              type="button"
              onClick={() => ask(input)}
              disabled={busy}
              aria-label="Send message"
              className="flex h-[41px] w-[41px] shrink-0 items-center justify-center rounded-full bg-[#2CA01C] text-white transition-colors hover:bg-[#007A33] disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="bg-white px-3 pb-2.5 text-center text-[11px] text-zinc-500">
            AI assistant — answers from our site info only. For account help,{" "}
            <a href="/contact" className="font-semibold text-[#007A33]">
              contact us
            </a>
            .
          </p>
        </div>
      )}
    </>
  );
}
