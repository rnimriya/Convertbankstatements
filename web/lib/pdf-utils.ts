import { createHash } from "crypto";

/**
 * Lightweight PDF page counter — no deps, works in Node.js runtime.
 *
 * Strategy:
 *  1. Count physical /Type /Page objects (ground truth — removing these breaks rendering).
 *  2. Parse /Count N values; take the smallest one that is >= the physical page count.
 *     Using Math.min (not Math.max) makes it hard to inflate via crafted /Count values
 *     embedded in content streams, annotations, or form fields.
 *  3. Fall back to physical page count alone, then to 1 if none found.
 */
export function countPdfPages(buffer: Buffer): number {
  const text = buffer.toString("latin1");

  // Physical page object count (/Type /Page but NOT /Type /Pages dictionaries)
  const pageObjCount = (text.match(/\/Type\s*\/Page(?!s)/g) ?? []).length;

  // Parse all /Count N values; cap at 10 000 to reject absurd planted values
  const countMatches = [...text.matchAll(/\/Count\s+(\d+)/g)];
  if (countMatches.length > 0) {
    const counts = countMatches
      .map(m => parseInt(m[1], 10))
      .filter(n => Number.isFinite(n) && n > 0 && n <= 10_000);

    if (counts.length > 0) {
      if (pageObjCount > 0) {
        // Root /Count must be >= physical page count.
        // Smallest valid /Count is the least inflatable choice.
        const valid = counts.filter(n => n >= pageObjCount);
        if (valid.length > 0) return Math.min(...valid);
      }
      return Math.min(...counts);
    }
  }

  return pageObjCount > 0 ? pageObjCount : 1;
}

export function sha256Hex(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}
