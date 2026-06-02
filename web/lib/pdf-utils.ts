/**
 * Lightweight PDF page counter that works in the Next.js Edge/Node runtime.
 * Reads PDF metadata without rendering or requiring pdfjs-dist.
 */
export function countPdfPages(buffer: Buffer): number {
  const text = buffer.toString("latin1");

  // Strategy 1: /Count N in the Pages dictionary (most reliable)
  const countMatches = [...text.matchAll(/\/Count\s+(\d+)/g)];
  if (countMatches.length > 0) {
    // Take the largest /Count value — that's the root Pages node
    const counts = countMatches.map((m) => parseInt(m[1], 10));
    return Math.max(...counts);
  }

  // Strategy 2: count individual /Type /Page objects (fallback)
  const pageMatches = text.match(/\/Type\s*\/Page(?!s)/g);
  if (pageMatches) return pageMatches.length;

  return 1;
}

export function sha256Hex(buffer: Buffer): string {
  const { createHash } = require("crypto") as typeof import("crypto");
  return createHash("sha256").update(buffer).digest("hex");
}
