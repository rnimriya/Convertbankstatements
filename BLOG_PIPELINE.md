# Daily Blog Pipeline — convertstatement.online

5 fresh, US/Tier-1-targeted blog articles per day. Auto-publish with strict quality gates.
Owner decision (2026-10-08): AUTO-PUBLISH, but every article MUST pass all quality gates.
Zero mistakes tolerance.

## How it works

1. Cron runs daily 06:30 IST.
2. Worker reads `web/data/blog-rotation.json` → takes next 5 banks + today's angle.
3. Worker writes 5 articles → generates 5 images → runs quality gates.
4. Passing articles appended to `web/lib/blog/generated.ts`; images to `web/public/blog/`.
5. `tsc --noEmit` must pass. Commit + push to `main` via SSH deploy key
   (`~/.ssh/convertstatement-deploy`). Vercel auto-deploys.
6. Worker verifies the 5 URLs return 200, then reports.

## Rotation

- `angles` (5): convert-to-excel, convert-to-csv-quickbooks, import-to-xero,
  password-protected-pdf, statements-for-tax-filing
- Each day: 5 consecutive banks from SUPPORTED_BANKS (dedupe by slug via
  `generateBankSlug`), one shared angle per day, angle rotates daily.
- Advance `bankIndex` by 5 and `angleIndex` by 1 after a successful run.
- 516 banks × 5 angles ≈ 517 days of unique content. Never repeat a bank+angle combo.

## Article template (every article MUST follow)

- `id`: `gen-YYYY-MM-DD-NN`
- `slug`: `{bank-slug}-{angle-slug}` (lowercase, hyphens only)
- `title`: 50–60 chars, includes the long-tail keyword, US English
- `excerpt`: 150–160 chars
- `content` (HTML):
  - Intro paragraph with the primary keyword in the first 100 words
  - Minimum 4 `<h2>` sections (how-to steps, tips, use cases)
  - One `<h2>Frequently asked questions</h2>` with 3–5 Q&As
  - Minimum 3 internal links: the bank's `/banks/{slug}` page + 2 related
    `/blog/` or `/guides/` pages (slugs must exist — verify)
  - Closing CTA paragraph linking to `/` or `/pricing`
  - Minimum 800 words of real, specific, useful content
- `tags`: 3–4 relevant tags
- `author`: rotate "David Chen, CPA" / "Sarah Mitchell" / "James Park"
- `featureImage`: `/blog/{slug}.jpg` (must exist in `web/public/blog/`)
- `published`: true, `createdAt`/`updatedAt`: run date ISO

## Quality gates (ALL must pass, no exceptions)

1. Slug unique across SEED_POSTS + GENERATED_POSTS + existing slugs.
2. Title 40–70 chars; excerpt 120–170 chars.
3. ≥800 words; ≥4 `<h2>` headings.
4. No placeholders: no lorem/TODO/[insert]/xxx/dummy text.
5. US English only: reject British spellings (cheque, favourite, behaviour,
   organise, realise, colour, centre, etc.).
6. Primary long-tail keyword appears in title + first 100 words.
7. All internal `/banks/` and `/blog/` links resolve to real pages.
8. Image file exists, valid JPEG/PNG, ≥800px wide, topical (no text/logos).
9. No duplicate of any article published in the last 30 days (compare titles
   + first paragraphs).
10. `npx tsc --noEmit` passes in `web/`.

## On gate failure

- DO NOT publish that article. Save it to `web/data/blog-review/YYYY-MM-DD/`
  (create the dir) with a `REVIEW_NOTES.md` listing failed gates.
- Publish the passing ones. Report failures clearly to the user.
- Never lower the gates to hit the 5/day quota — 3 good articles beat
  5 sloppy ones.

## Push access

Pushes go over HTTPS using the git credential store (`~/.git-credentials`,
mode 600). The stored credential is a fine-grained GitHub PAT scoped to this
repo, supplied by the repo owner for the daily pipeline. Set up once with:

  git config --global credential.helper store
  # then approve the https://x-access-token:<PAT>@github.com credential once,
  # or write the ~/.git-credentials line directly (one line):
  # https://x-access-token:<PAT>@github.com

Then plain `git push origin main` works with no further prompts.
If push fails with 401/403, the token was revoked — commit locally and report
it clearly as the blocker. Never print or log the token.

NOTE (2026-10-08): SSH deploy keys do NOT work from this environment — the
egress proxy blocks SSH to GitHub (verified: ssh.github.com unreachable,
github.com:443 only). Always use HTTPS.
