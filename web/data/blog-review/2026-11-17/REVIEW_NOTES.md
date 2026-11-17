# Review — 2026-11-17

## quickbooks-online-pricing — FAILED gate 1 (slug duplicate), NOT published
- Slug `quickbooks-online-pricing` already exists in GENERATED_POSTS: id `gen-2026-11-07-01`,
  title "QuickBooks Online Pricing: Plans and Costs for 2026", published 2026-11-07 (commit f8abe00).
- The new draft is a near-duplicate of that live article (same prices, same Aug 2026 facts).
- Root cause: the run's pre-write dedupe grep used pattern `"slug": "..."` (quoted key) while
  generated.ts uses unquoted keys (`slug: "..."`), so the existing slug was missed. The gates
  script's regex is authoritative — it caught the duplicate. Lesson: always dedupe with the
  gates.py regex, never the quoted-key grep.
- Per spec, a failed trending slot is NOT backfilled the same day. Today's mix is 2 trending + 2 bank.
- NOTE: convert.py overwrote the live post's 3 images (/blog/quickbooks-online-pricing*.webp)
  with newly generated on-topic images (same filenames, same topic) before the duplicate was
  caught. The live article's images remain valid and on-topic; no restore needed.
- Do NOT re-publish this slug. A future pricing refresh must update the 2026-11-07 article
  in place instead of creating a new post.
