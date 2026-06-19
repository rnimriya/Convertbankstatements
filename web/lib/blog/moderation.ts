/**
 * Comment content moderation.
 *
 * Uses leo-profanity (English word list) extended with common
 * Hindi/Hinglish and other Indian-language transliterations.
 *
 * Applied server-side only — cannot be bypassed by the client.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const filter = require("leo-profanity");

/* ── Hindi / Hinglish / Indian transliterations ─────────────────── */
const HINDI_WORDS: string[] = [
  // common Hindi abuses (romanised)
  "madarchod", "maderchod", "madarcho", "mc",
  "behenchod", "bhencho", "bc",
  "chutiya", "chutiye", "chutiyapa",
  "bhosdi", "bhosdike", "bhosdiwale",
  "gaandu", "gandu", "gandu",
  "harami", "haraami",
  "kamina", "kameena",
  "randi", "raand",
  "saala", "saale", "saali",
  "bhen ke", "maa ki", "teri maa",
  "teri bhen", "teri behan",
  "lund", "lauda", "lavda",
  "chut", "bur",
  "bakrichod", "gadha", "ullu",
  "hijra", "hijda",
  // Hinglish combos
  "maa ke", "baap ke",
  "sala", "sali",
  // Telugu / Tamil / Kannada common abuses (romanised)
  "puku", "dengey", "dengu",
  "poda", "podi", "pooda",
  "thayoli", "thevdiya",
  "naaye", "naayi",
  "sooliye", "soolie",
  "koodhi",
  // Punjabi
  "bhain di", "teri bhain",
  "bhen di", "maa di",
  "kutti", "kutha",
  // common chat abbreviations for abuse
  "stfu", "gtfo",
];

/* ── Initialise filter once ──────────────────────────────────────── */
filter.add(HINDI_WORDS);

/* ── Normalise tricks: replace common leet-speak substitutions ───── */
function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/\$/g, "s")
    .replace(/@/g, "a")
    .replace(/!/g, "i")
    // collapse repeated characters: "fuuuck" → "fuck"
    .replace(/(.)\1{2,}/g, "$1$1")
    // strip non-alphanumeric except spaces
    .replace(/[^a-z0-9\s]/g, " ");
}

/* ── Public API ──────────────────────────────────────────────────── */
export interface ModerationResult {
  ok: boolean;
  reason?: string;
}

export function moderateComment(text: string): ModerationResult {
  if (!text || !text.trim()) {
    return { ok: false, reason: "Comment cannot be empty." };
  }

  const normalised = normalise(text);

  if (filter.check(normalised)) {
    return {
      ok: false,
      reason: "Your comment contains inappropriate language. Please keep the discussion respectful.",
    };
  }

  return { ok: true };
}
