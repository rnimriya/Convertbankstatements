import type { Transaction } from "@/types/billing";

const MERCHANTS = [
  "AMAZON.IN", "FLIPKART INTERNET", "MYNTRA DESIGNS", "SWIGGY ORDER",
  "ZOMATO LIMITED", "OLA CABS", "UBER INDIA", "OLA ELECTRIC",
  "RELIANCE JIO", "AIRTEL MOBILE", "BSNL RECHARGE", "VODAFONE IDEA",
  "HDFC LIFE INS", "LIC PREMIUM", "BAJAJ ALLIANZ", "STAR HEALTH INS",
  "DMART RETAIL", "BIGBASKET.COM", "GROFERS NOW", "BLINKIT ORDER",
  "IRCTC TICKET", "MAKE MY TRIP", "GOIBIBO FLIGHT", "RED BUS TICKET",
  "PAYTM MERCHANT", "PHONEPE TRANSFER", "GOOGLEPAY UPI", "BHIM UPI",
  "NETFLIX INDIA", "HOTSTAR DISNEY", "SONY LIV", "AMAZON PRIME",
  "ELECTRICITY BILL MSEDCL", "MAHANAGAR GAS", "INDANE GAS",
  "MUNICIPAL TAX AUTO", "PROPERTY TAX", "WATER BILL",
  "SIP MUTUAL FUND", "NSE BROKERAGE", "ZERODHA KITE", "GROWW APP",
  "EMI HDFC HOME LOAN", "EMI ICICI CAR", "CREDIT CARD BILL PAYMENT",
  "SALARY CREDIT NEFT", "FREELANCE TRANSFER NEFT", "RENT CREDIT",
  "ATM WDL STATE BANK", "CASH WDL", "CHEQUE CLEARING",
  "CANTEEN CHARGES", "PETROL BPCL", "PETROL HPCL", "HP GAS",
];

const CATEGORY_MAP: [string, string][] = [
  ["AMAZON", "Shopping"], ["FLIPKART", "Shopping"], ["MYNTRA", "Shopping"],
  ["SWIGGY", "Food & Dining"], ["ZOMATO", "Food & Dining"],
  ["OLA", "Transport"], ["UBER", "Transport"], ["IRCTC", "Transport"],
  ["MAKE MY TRIP", "Travel"], ["GOIBIBO", "Travel"], ["RED BUS", "Travel"],
  ["NETFLIX", "Entertainment"], ["HOTSTAR", "Entertainment"], ["SONY LIV", "Entertainment"],
  ["AMAZON PRIME", "Entertainment"],
  ["DMART", "Groceries"], ["BIGBASKET", "Groceries"], ["BLINKIT", "Groceries"],
  ["JIO", "Utilities"], ["AIRTEL", "Utilities"], ["BSNL", "Utilities"],
  ["ELECTRICITY", "Utilities"], ["GAS", "Utilities"], ["WATER BILL", "Utilities"],
  ["LIC", "Insurance"], ["HDFC LIFE", "Insurance"], ["BAJAJ", "Insurance"],
  ["STAR HEALTH", "Insurance"],
  ["MUTUAL FUND", "Investments"], ["ZERODHA", "Investments"], ["GROWW", "Investments"],
  ["SIP", "Investments"],
  ["EMI", "Loan EMI"], ["HOME LOAN", "Loan EMI"], ["CAR", "Loan EMI"],
  ["SALARY", "Income"], ["FREELANCE", "Income"], ["RENT CREDIT", "Income"],
  ["ATM", "Cash"], ["PETROL", "Fuel"], ["HPCL", "Fuel"], ["BPCL", "Fuel"],
];

function getCategory(desc: string): string {
  const upper = desc.toUpperCase();
  for (const [key, cat] of CATEGORY_MAP) {
    if (upper.includes(key)) return cat;
  }
  return "Others";
}

function randomINRAmount(isCredit: boolean): number {
  if (isCredit) {
    const credits = [45000, 60000, 25000, 15000, 8500, 3200];
    return credits[Math.floor(Math.random() * credits.length)];
  }
  // Debits: ₹50 – ₹12000
  return -(Math.floor(Math.random() * 120 + 5) * 100);
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function generateMockTransactions(pageCount: number): Transaction[] {
  const count = Math.min(pageCount * 22, 500);
  const transactions: Transaction[] = [];

  const start = new Date();
  start.setMonth(start.getMonth() - Math.ceil(pageCount / 3));
  let balance = 50000 + Math.random() * 100000; // Starting with ₹50k–₹1.5L

  const interval = (Date.now() - start.getTime()) / count;

  for (let i = 0; i < count; i++) {
    const date = new Date(start.getTime() + i * interval);
    const isCredit = Math.random() < 0.12;
    const description = isCredit
      ? ["SALARY CREDIT NEFT", "FREELANCE TRANSFER NEFT", "UPI CREDIT"][Math.floor(Math.random() * 3)]
      : MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
    const amount = randomINRAmount(isCredit);
    balance += amount;

    transactions.push({
      date: formatDate(date),
      description,
      amount: Math.round(amount * 100) / 100,
      balance: Math.round(balance * 100) / 100,
      category: getCategory(description),
      reference: `UPI${String(i + 100000).padStart(12, "0")}`,
    });
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

export function transactionsToCSV(transactions: Transaction[]): string {
  const header = "Date,Description,Amount (INR),Balance (INR),Category,Reference\n";
  const rows = transactions
    .map((t) =>
      [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`,
        t.amount.toFixed(2),
        t.balance?.toFixed(2) ?? "",
        t.category ?? "",
        t.reference ?? "",
      ].join(",")
    )
    .join("\n");
  return header + rows;
}
