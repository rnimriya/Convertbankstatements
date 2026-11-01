import { NextRequest, NextResponse } from "next/server";
import { checkChatRateLimit } from "@/lib/rate-limit";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat/knowledge";

/**
 * Public support-chat endpoint. Answers come from Gemini (same key/model
 * family as the OCR pipeline) grounded ONLY in lib/chat/knowledge.ts.
 * Any failure degrades to a friendly fallback message — the widget never
 * shows a raw error to a visitor.
 */

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

/* Retries against transient Gemini free-tier spikes can take a while —
   give the function room beyond the platform default where allowed. */
export const maxDuration = 120;

const FALLBACK_REPLY =
  "Sorry — I'm having a little trouble answering right now. Please try again in a moment, or reach our team from the [Contact page](https://www.convertstatement.online/contact) and we'll help you there.";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function parseMessages(body: unknown): ChatMessage[] | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 12) return null;
  const out: ChatMessage[] = [];
  for (const m of raw) {
    if (typeof m !== "object" || m === null) return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.trim().length === 0) return null;
    out.push({ role, content: content.slice(0, 1200) });
  }
  if (out[out.length - 1].role !== "user") return null;
  return out;
}

async function discoverFlashModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch(`${GEMINI_API_BASE}/models`, {
      headers: { "x-goog-api-key": apiKey },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>;
    };
    const names = (data?.models ?? [])
      .filter((m) => (m?.supportedGenerationMethods ?? []).includes("generateContent"))
      .map((m) => String(m?.name ?? "").replace(/^models\//, ""))
      .filter(
        (n) =>
          n.includes("flash") &&
          !n.includes("image") &&
          !n.includes("tts") &&
          !n.includes("audio") &&
          !n.includes("live")
      );
    names.sort((a, b) => {
      const rank = (n: string) => (n === "gemini-3.8-flash" ? 0 : n.includes("lite") ? 2 : 1);
      return rank(a) - rank(b);
    });
    return names.slice(0, 8);
  } catch {
    return [];
  }
}

async function geminiChat(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  timeoutMs = 30_000
): Promise<string> {
  /* Gemini 3.x models support thinkingLevel — "low" keeps a support chat
     fast (the default thinking depth made short answers take >25s under
     load, verified live 2026-11-01). Older models don't know the field,
     so it is only sent to 3.x / flash-latest. */
  const supportsThinkingLevel = model.startsWith("gemini-3") || model === "gemini-flash-latest";
  const res = await fetch(`${GEMINI_API_BASE}/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: CHAT_SYSTEM_PROMPT }] },
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1200,
        ...(supportsThinkingLevel ? { thinkingConfig: { thinkingLevel: "low" } } : {}),
      },
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  const data = (await res.json().catch(() => null)) as {
    error?: { message?: string; code?: number };
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  } | null;

  if (!res.ok) {
    const err = new Error(
      `Gemini ${res.status}: ${String(data?.error?.message ?? "request failed").slice(0, 160)}`
    ) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p) => (typeof p?.text === "string" ? p.text : "")).join("").trim();
  if (!text) throw new Error("Gemini returned no text");
  return text;
}

export async function POST(req: NextRequest) {
  const limited = await checkChatRateLimit(req);
  if (limited) {
    return NextResponse.json(
      {
        reply:
          "You're sending messages very fast — please wait a minute and try again. For anything urgent, our team is on the [Contact page](https://www.convertstatement.online/contact).",
      },
      { status: 200 }
    );
  }

  let messages: ChatMessage[] | null = null;
  try {
    messages = parseMessages(await req.json());
  } catch {
    messages = null;
  }
  if (!messages) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY not configured");
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }

  /* Attempt plan (live-diagnosed 2026-11-01): gemini-3.8-flash — the OCR
     model — repeatedly timed out at 30s for chat while Google's free tier
     was returning 503 "high demand" spikes, and gemini-2.5-flash is closed
     to this project (404). A support chat does not need the flagship:
     walk DISTINCT models, fastest/least-contended first (flash-latest,
     then Lite models, then 3.8), 18s each, first real answer wins. */
  const primaryModel = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
  const discovered = await discoverFlashModels(apiKey);
  const pool = discovered.length > 0 ? discovered : [primaryModel];
  const ordered: string[] = [];
  const pushUnique = (m?: string) => {
    if (m && m !== "gemini-2.5-flash" && !ordered.includes(m)) ordered.push(m);
  };
  pushUnique(pool.find((m) => m === "gemini-flash-latest"));
  pool.filter((m) => m.includes("lite")).forEach(pushUnique);
  pushUnique(primaryModel);
  pool.forEach(pushUnique);

  for (const model of ordered.slice(0, 3)) {
    try {
      const reply = await geminiChat(apiKey, model, messages, 18_000);
      return NextResponse.json({ reply });
    } catch (err) {
      console.error(`[chat] Gemini failed on ${model}:`, err);
    }
  }
  return NextResponse.json({ reply: FALLBACK_REPLY });
}
