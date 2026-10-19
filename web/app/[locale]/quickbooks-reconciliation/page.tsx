// Alias route: the QuickBooks landing page also lives at
// /quickbooks-reconciliation so the URL can be shared as-is (the browser
// stays on this slug). It renders the exact same page component; the shared
// metadata keeps the canonical URL pointed at /quickbooks for SEO.
export { default, metadata } from "../quickbooks/page";
