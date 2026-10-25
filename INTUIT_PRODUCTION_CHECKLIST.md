# Intuit Production Readiness Checklist — QuickBooks Direct Push

Status: **SANDBOX ONLY today. Direct Push stays "(Coming Soon)" on pricing
until Intuit production approval is granted. Nothing in this file changes
pricing copy or claims a live push.**

## Where things stand
- Intuit app "ConvertStatement" exists on the developer account, sandbox keys
  are configured in Vercel (`QB_CLIENT_ID` / `QB_CLIENT_SECRET` /
  `QB_REDIRECT_URI` / `QB_ENVIRONMENT=sandbox`).
- Redirect URI (must match the Intuit app profile exactly):
  `https://convertstatement.online/api/quickbooks/callback`
- The in-app push flow (`/api/quickbooks/push`, Dashboard → Settings →
  QuickBooks) works against the sandbox today.

## Before submitting for production review
- [ ] Intuit app profile complete: app name, description, logo, and support
      contact match the live site's branding and support email.
- [ ] Redirect URI in the Intuit app profile is exactly the production URI
      above (no localhost, no staging host).
- [ ] Live privacy policy URL: `https://www.convertstatement.online/privacy`
- [ ] Live terms of service URL: `https://www.convertstatement.online/terms`
- [ ] Scopes requested are the minimum the push needs (accounting access for
      the connected company only) — review the OAuth scope list in
      `web/lib/quickbooks.ts` and drop anything unused before submission.
- [ ] Production keys are stored in Vercel (Prod environment only), never in
      code, chat, or this file. Rotate the sandbox keys if they were ever
      pasted anywhere outside the secure store.
- [ ] App Assessment Questionnaire: answer Intuit's security questions
      (data handling, retention, encryption in transit/at rest, breach
      process). Note for the answers: user files are processed in memory and
      not stored; only converted-file metadata needed for billing/history is
      retained — verify the exact retention claims against the current code
      before submitting, do not copy them from memory.
- [ ] End-to-end sandbox test after any scope change: connect a sandbox
      company, push a small statement, verify the transactions land in the
      sandbox QuickBooks company with correct dates, amounts, and accounts.

## On approval
- [ ] Swap `QB_ENVIRONMENT` to production in Vercel Prod (keep sandbox keys
      for Preview/dev).
- [ ] Re-test the push against a real (non-sandbox) company with a small file.
- [ ] Only then: remove "(Coming Soon)" from the Direct Push pricing line,
      and announce the feature. Until that point, pricing keeps "(Coming Soon)".
- [ ] Add a short "How Direct Push works" note to `/quickbooks` once live:
      connect once, pick the bank account, push — with the same balance-check
      guarantees as the file exports.

## Deliberately NOT in scope here
- No pricing changes, no new paid plan, no Razorpay changes.
- No claim on any page that live push exists before approval.
