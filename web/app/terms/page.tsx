import Link from "next/link";
import { FileText, ScrollText } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
 title: "Terms of Service — Convert Statement",
 description: "Terms and conditions governing use of the Convert Statement bank statement conversion service.",
};

const SECTIONS = [
 {
 id: "acceptance",
 title: "1. Acceptance of Terms",
 content: `By creating an account or using the Convert Statement service ("Service") at convertstatement.online, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.

These Terms constitute a legally binding agreement between you and Convert Statement ("Company", "we", "us", or "our"). These Terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of courts in India.

We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance.`,
 },
 {
 id: "service-description",
 title: "2. Description of Service",
 content: `Convert Statement provides a software-as-a-service (SaaS) platform that:

- Accepts PDF bank statements uploaded by users
- Extracts transaction data (dates, descriptions, amounts, balances) from those PDFs
- Returns the extracted data in structured formats including CSV, Excel (.xlsx), OFX, and QFX
- Optionally exports data to Google Sheets via the Google Sheets API

The Service supports statements from major Indian banks including SBI, HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, and 25+ others. Results may vary depending on PDF quality and bank format.

**Important:** The Service is a data conversion tool only. It does not provide financial advice, accounting services, or tax advice. Always verify extracted data against your original bank statement before relying on it for financial or tax purposes.`,
 },
 {
 id: "accounts",
 title: "3. User Accounts",
 content: `**Registration**
To use the Service beyond the free tier, you must create an account with a valid email address and password. You are responsible for maintaining the confidentiality of your account credentials.

**Accurate Information**
You agree to provide accurate, current, and complete information during registration and to keep your account information updated.

**Account Security**
You are responsible for all activity that occurs under your account. Notify us immediately at support@convertstatement.online if you suspect unauthorised access.

**One Account Per User**
Creating multiple accounts to circumvent plan limits or free tier restrictions is prohibited and may result in immediate termination of all associated accounts.

**Account Termination**
We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or remain inactive for more than 24 months.`,
 },
 {
 id: "acceptable-use",
 title: "4. Acceptable Use",
 content: `You agree to use the Service only for lawful purposes. You must not:

- Upload PDFs that do not belong to you or for which you do not have authorisation
- Upload PDFs containing malicious code, macros, or exploits
- Attempt to reverse-engineer, decompile, or extract the source code of the Service
- Use automated scripts, bots, or scrapers to bulk-upload documents
- Attempt to gain unauthorised access to our systems or other users' accounts
- Resell or sublicense access to the Service without our written permission
- Use the Service to process documents for a third party without their explicit consent
- Upload content that violates any applicable law or regulation

Violation of these restrictions may result in immediate account termination without refund.`,
 },
 {
 id: "billing",
 title: "5. Billing & Payments",
 content: `**Free Tier**
Every registered account receives 8 pages of processing completely free. No payment method is required to access the free tier.

**Pay-As-You-Go (₹49 per document)**
After exhausting your free pages, you may pay ₹49 per document. Payment is processed through Razorpay before the document is converted. All prices are in Indian Rupees (INR) and are exclusive of applicable taxes.

**Pro Plan (₹399/month)**
Provides 200 pages of processing per billing month. Billed monthly in advance. Pages do not roll over to the next month.

**Business Plan (₹999/month)**
Provides 500 pages of processing per billing month. Billed monthly in advance. Pages do not roll over to the next month.

**Payment Methods**
We accept UPI, Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, and Wallets through Razorpay. All transactions are subject to Razorpay's payment terms.

**GST**
Applicable Goods and Services Tax (GST) will be added to all subscription and pay-as-you-go payments as required by Indian law.

**Refunds**
Pay-as-you-go payments are non-refundable once a document has been processed. For subscription plans, refunds are available within 7 days of the initial subscription if no documents have been processed. Contact billing@convertstatement.online to request a refund.

**Subscription Cancellation**
You may cancel your subscription at any time. Your plan remains active until the end of the current billing period, after which you will revert to the free tier.`,
 },
 {
 id: "data-ownership",
 title: "6. Your Data & Intellectual Property",
 content: `**Your Content**
You retain full ownership of all bank statements you upload and all transaction data extracted from them. By uploading a document, you grant us a limited, temporary, non-exclusive license to process that document solely for the purpose of providing the conversion service to you.

**No Data Retention**
We do not claim any ownership over your financial data. Your PDFs and extracted transaction data are not stored on our servers after processing is complete.

**Our IP**
The Convert Statement platform, software, algorithms, branding, and user interface are owned by us and are protected by intellectual property laws. You may not copy, reproduce, or create derivative works from any part of our platform.`,
 },
 {
 id: "accuracy",
 title: "7. Accuracy Disclaimer",
 content: `While we strive for high accuracy in transaction extraction, the quality of results depends on factors outside our control, including:

- The quality and formatting of the original PDF
- Whether the PDF is text-based or scanned (image-only)
- Whether the PDF is password-protected
- The specific formatting used by your bank

**You are solely responsible for verifying the accuracy of all extracted data before using it for accounting, tax filing, loan applications, audits, or any other financial or legal purpose.**

We make no warranty that extracted data will be complete, accurate, or free from errors. We recommend always cross-referencing extracted data with your original bank statement.`,
 },
 {
 id: "limitation",
 title: "8. Limitation of Liability",
 content: `To the maximum extent permitted by applicable law:

- The Service is provided "as is" and "as available" without warranties of any kind, express or implied
- We do not warrant that the Service will be uninterrupted, error-free, or free of viruses
- We will not be liable for any indirect, incidental, special, consequential, or punitive damages
- We will not be liable for any financial loss, business loss, or data loss arising from use of the Service
- Our total cumulative liability to you shall not exceed the amount you paid us in the 3 months preceding the claim

Nothing in these Terms limits liability for fraud, death or personal injury caused by negligence, or any other liability that cannot be excluded under applicable law.`,
 },
 {
 id: "indemnification",
 title: "9. Indemnification",
 content: `You agree to defend, indemnify, and hold harmless Convert Statement and its officers, directors, employees, and agents from any claims, damages, costs, or expenses (including reasonable legal fees) arising from:

- Your use or misuse of the Service
- Your violation of these Terms
- Your violation of any third-party rights
- Any data you upload that infringes any law or third-party right`,
 },
 {
 id: "termination",
 title: "10. Termination",
 content: `**By You**
You may close your account at any time by contacting support@convertstatement.online. Upon closure, your account data will be deleted within 30 days, except for billing records which are retained as required by law.

**By Us**
We may suspend or terminate your account immediately if you breach these Terms, engage in fraudulent activity, or if we are required to do so by law. We will provide notice unless prohibited by law or where notice would cause harm.

**Effect of Termination**
Upon termination, your right to use the Service ceases immediately. Any outstanding subscription credits will be forfeited. Provisions that by their nature should survive termination shall survive, including Sections 6, 7, 8, 9, and 11.`,
 },
 {
 id: "governing-law",
 title: "11. Governing Law & Disputes",
 content: `These Terms are governed by and construed in accordance with the laws of India, without regard to conflict of law provisions.

**Dispute Resolution**
We encourage you to contact us first at support@convertstatement.online to resolve any dispute informally. If a dispute cannot be resolved informally within 30 days, it shall be submitted to binding arbitration under the Arbitration and Conciliation Act, 1996, conducted in English in India.

**Jurisdiction**
For matters not subject to arbitration, you submit to the exclusive jurisdiction of courts located in India.`,
 },
 {
 id: "general",
 title: "12. General Provisions",
 content: `**Entire Agreement**
These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the Service.

**Severability**
If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force.

**No Waiver**
Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.

**Assignment**
You may not assign your rights or obligations under these Terms without our prior written consent. We may assign our rights without restriction.

**Contact**
For questions about these Terms, contact us at legal@convertstatement.online.`,
 },
];

export default function TermsPage() {
 return (
 <div className="min-h-screen bg-white">
 {/* Navbar */}
 <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
 <div className="mx-auto flex max-w-5xl items-center justify-between px-6 h-16">
 <Link href="/" className="flex items-center gap-2.5">
 <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
 <span className="hidden sm:inline font-bold text-slate-900 font-display text-[17px]">Convert Statement</span>
 </Link>
 <div className="flex items-center gap-3">
 <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Sign in</Link>
 <Link href="/signup" className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
 Get started free
 </Link>
 </div>
 </div>
 </nav>

 {/* Header */}
 <div className="border-b border-slate-100 bg-slate-50 px-6 py-10">
 <div className="mx-auto max-w-3xl">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10">
 <ScrollText className="h-5 w-5 text-navy" />
 </div>
 <div>
 <h1 className="text-2xl font-extrabold text-slate-900 ">Terms of Service</h1>
 <p className="text-xs text-slate-400 mt-0.5">Last updated: June 2026 · Effective immediately</p>
 </div>
 </div>
 <p className="mt-4 text-sm leading-relaxed text-slate-500">
 These Terms govern your use of Convert Statement. Please read them carefully. Key points: your data is never stored after processing, payments are processed securely via Razorpay, and you retain full ownership of all your financial documents and extracted data.
 </p>

 {/* Quick summary */}
 <div className="mt-5 grid gap-3 sm:grid-cols-3">
 {[
 { label: "Your data", value: "Never stored after processing" },
 { label: "Refunds", value: "7 days for subscriptions" },
 { label: "Jurisdiction", value: "Laws of India" },
 ].map(({ label, value }) => (
 <div key={label} className="rounded-xl border border-slate-200 bg-white bg-slate-50 px-4 py-3">
 <p className="text-xs text-slate-400 ">{label}</p>
 <p className="mt-0.5 text-sm font-semibold text-slate-700 ">{value}</p>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Content */}
 <div className="mx-auto max-w-3xl px-6 py-12">
 {/* Table of contents */}
 <div className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 bg-slate-50 p-5">
 <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 ">Contents</p>
 <div className="grid gap-1 sm:grid-cols-2">
 {SECTIONS.map(({ id, title }) => (
 <a
 key={id}
 href={`#${id}`}
 className="text-sm text-navy hover:underline underline-offset-2"
 >
 {title}
 </a>
 ))}
 </div>
 </div>

 {/* Sections */}
 <div className="space-y-10">
 {SECTIONS.map(({ id, title, content }) => (
 <section key={id} id={id} className="scroll-mt-20">
 <h2 className="mb-3 text-lg font-bold text-slate-900 ">{title}</h2>
 <div className="space-y-3">
 {content.split("\n\n").map((para, i) => {
 const lines = para.split("\n");
 const isHeading = lines[0].startsWith("**") && lines[0].endsWith("**") && lines.length > 1;

 if (isHeading) {
 return (
 <div key={i}>
 <p className="mb-1 text-sm font-semibold text-slate-800 ">
 {lines[0].replace(/\*\*/g, "")}
 </p>
 {lines.slice(1).map((line, j) => {
 const parts = line.split(/(\*\*[^*]+\*\*)/g);
 return (
 <p key={j} className="text-sm leading-relaxed text-slate-600 ">
 {parts.map((part, k) =>
 part.startsWith("**") ? (
 <strong key={k} className="font-semibold text-slate-800 ">
 {part.replace(/\*\*/g, "")}
 </strong>
 ) : part
 )}
 </p>
 );
 })}
 </div>
 );
 }

 const parts = para.split(/(\*\*[^*]+\*\*)/g);
 return (
 <p key={i} className="text-sm leading-relaxed text-slate-600 ">
 {parts.map((part, j) =>
 part.startsWith("**") ? (
 <strong key={j} className="font-semibold text-slate-800 ">
 {part.replace(/\*\*/g, "")}
 </strong>
 ) : part
 )}
 </p>
 );
 })}
 </div>
 </section>
 ))}
 </div>

 {/* Bottom note */}
 <div className="mt-12 rounded-2xl border border-navy/20 bg-navy/5 p-5 text-sm text-navy">
 <p className="font-semibold">Questions about these Terms?</p>
 <p className="mt-1 text-navy ">
 Email us at{" "}
 <a href="mailto:legal@convertstatement.online" className="underline hover:no-underline">
 legal@convertstatement.online
 </a>{" "}
 and we&apos;ll respond within 2 business days.
 </p>
 </div>

 <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400 ">
 <Link href="/privacy" className="hover:text-slate-600 hover:text-slate-900 underline underline-offset-2">Privacy Policy</Link>
 <Link href="/" className="hover:text-slate-600">← Back to home</Link>
 </div>
 </div>

 <Footer />
 </div>
 );
}
