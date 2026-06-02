import { createHash } from "crypto";

/**
 * Lightweight PDF page counter — no deps, works in Node.js edge runtime.
 * Reads PDF metadata without rendering any page.
 */
export function countPdfPages(buffer: Buffer): number {
  const text = buffer.toString("latin1");

  // Strategy 1: /Count N in the Pages dictionary (most reliable)
  const countMatches = [...text.matchAll(/\/Count\s+(\d+)/g)];
  if (countMatches.length > 0) {
    const counts = countMatches.map((m) => parseInt(m[1], 10));
    return Math.max(...counts);
  }

  // Strategy 2: count individual /Type /Page objects (fallback)
  const pageMatches = text.match(/\/Type\s*\/Page(?!s)/g);
  if (pageMatches) return pageMatches.length;

  return 1;
}

export function sha256Hex(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}
