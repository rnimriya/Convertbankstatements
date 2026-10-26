# Review notes — 2026-10-26

## HELD, NOT PUBLISHED: amex-card-australia-import-to-xero (gen-2026-10-26-01)

- FAILED GATE 8 (image files exist): inline image 2 (/blog/amex-card-australia-import-to-xero-inline-2.webp) does not exist.
- Cause: the media generation call for that inline image failed at generation time; the tool returned an error and no image file was produced. The request was not retried, per the generation failure instruction.
- All other gates passed for this article: title 55 chars, excerpt 154 chars, 1365 words, 6 H2s, no placeholders, no British spellings, all internal links resolve, slug unique, feature image and inline image 1 exist (WebP, feature 1600px, inline 1200px).
- Action needed before publishing: supply a replacement inline-2 image for this slug (a new, unique photorealistic scene matching the GST/cleanup section) and re-run the gates. Do NOT re-publish by reusing the feature image or another post image.
- Rotation note: bankIndex was advanced past all four attempted banks (89 -> 93) so the next run does not re-attempt the three published AMEX slugs; this held article must be published manually, not via the next daily rotation.

## Published 2026-10-26 (4 posts)

- amex-card-canada-import-to-xero
- amex-card-france-import-to-xero
- amex-card-uk-import-to-xero
- duplicate-payments-in-quickbooks-online (QuickBooks keyword post, keyword: duplicate payments in quickbooks online)

## PUBLISHED 2026-10-26 (manual fix)

- amex-card-australia-import-to-xero published via commit 207939d: replacement inline-2 image generated (1200px WebP q80, 37KB), gate 8 re-passed, live URL 200 with inline-2 present.
