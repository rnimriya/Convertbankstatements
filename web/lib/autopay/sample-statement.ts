/**
 * AutoPay Khoj — SAMPLE statement transactions.
 *
 * A fictional demo statement used ONLY so the /autopay-audit report
 * page can be seen and checked before the real upload wiring (Day 6)
 * feeds it live data. The page labels this as a sample everywhere it
 * matters. None of these charges belong to a real person.
 */
import type { Transaction } from "@/types/billing";

function t(date: string, description: string, amount: number): Transaction {
  return { date, description, amount, balance: 0, category: amount < 0 ? "debit" : "credit", reference: "" };
}

export const SAMPLE_IS_SAMPLE = true;

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  t("2026-08-01", "SALARY ACME PVT LTD", 85000),
  t("2026-09-01", "SALARY ACME PVT LTD", 85000),
  t("2026-10-01", "SALARY ACME PVT LTD", 85000),
  // Netflix — UPI, monthly
  t("2026-07-15", "UPI/NETFLIX/NA/Netflix subscription", -499),
  t("2026-08-15", "UPI/NETFLIX/NA/Netflix subscription", -499),
  t("2026-09-15", "UPI/NETFLIX/NA/Netflix subscription", -499),
  t("2026-10-15", "UPI/NETFLIX/NA/Netflix subscription", -499),
  // Mutual fund SIP — NACH
  t("2026-05-10", "NACH/CAMS MUTUAL FUND SIP/INVESTMENT", -5000),
  t("2026-06-10", "NACH/CAMS MUTUAL FUND SIP/INVESTMENT", -5000),
  t("2026-07-10", "NACH/CAMS MUTUAL FUND SIP/INVESTMENT", -5000),
  t("2026-08-10", "NACH/CAMS MUTUAL FUND SIP/INVESTMENT", -5000),
  t("2026-09-10", "NACH/CAMS MUTUAL FUND SIP/INVESTMENT", -5000),
  t("2026-10-10", "NACH/CAMS MUTUAL FUND SIP/INVESTMENT", -5000),
  // Spotify — price rose 119 → 139
  t("2026-06-12", "MANDATE/SPOTIFY INDIA PVT LTD", -119),
  t("2026-07-12", "MANDATE/SPOTIFY INDIA PVT LTD", -119),
  t("2026-08-12", "MANDATE/SPOTIFY INDIA PVT LTD", -119),
  t("2026-09-12", "MANDATE/SPOTIFY INDIA PVT LTD", -139),
  t("2026-10-12", "MANDATE/SPOTIFY INDIA PVT LTD", -139),
  // Unknown gym — NACH, no dictionary match
  t("2026-08-05", "ACH/XYZ FITNESS CLUB MEMBERSHIP", -1500),
  t("2026-09-05", "ACH/XYZ FITNESS CLUB MEMBERSHIP", -1500),
  t("2026-10-05", "ACH/XYZ FITNESS CLUB MEMBERSHIP", -1500),
  // Loan EMI — NACH (essential, never waste)
  t("2026-06-20", "NACH/HDFC BANK LOAN EMI A/C 9912", -12500),
  t("2026-07-20", "NACH/HDFC BANK LOAN EMI A/C 9912", -12500),
  t("2026-08-20", "NACH/HDFC BANK LOAN EMI A/C 9912", -12500),
  t("2026-09-20", "NACH/HDFC BANK LOAN EMI A/C 9912", -12500),
  t("2026-10-20", "NACH/HDFC BANK LOAN EMI A/C 9912", -12500),
  // Amazon Prime — yearly
  t("2025-10-02", "AMZN PRIME MEMBERSHIP FEE", -1499),
  t("2026-10-02", "AMZN PRIME MEMBERSHIP FEE", -1499),
  // Google One — ₹1 trial that converted
  t("2026-07-03", "UPI/GOOGLE ONE STORAGE", -1),
  t("2026-08-03", "UPI/GOOGLE ONE STORAGE", -130),
  t("2026-09-03", "UPI/GOOGLE ONE STORAGE", -130),
  t("2026-10-03", "UPI/GOOGLE ONE STORAGE", -130),
  // Everyday spending that must NOT be flagged
  t("2026-10-02", "UPI/SWIGGY/ORDER 8812", -430),
  t("2026-10-06", "UPI/SWIGGY/ORDER 9031", -620),
  t("2026-10-11", "UPI/SWIGGY/ORDER 9550", -285),
  t("2026-10-19", "UPI/SWIGGY/ORDER 9902", -510),
  t("2026-10-21", "ATM WDL SELF", -2000),
  // Seen once — lands in the "check these" list
  t("2026-10-08", "OPENAI CHATGPT SUBSCRIPTION USD", -1699),
];
