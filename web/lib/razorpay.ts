import Razorpay from "razorpay";
import crypto from "crypto";


export const BASIC_AMOUNT_CENTS = 500;        // $5/month
export const BASIC_ANNUAL_CENTS = 4800;       // $48/year (≈ $4/mo)
export const PRO_AMOUNT_CENTS = 2000;         // $20/month
export const BIZ_AMOUNT_CENTS = 7500;         // $75/month
// Annual = monthly × 12 × 0.80 (20% discount), billed in one charge
export const PRO_ANNUAL_CENTS = 19200;        // $192/year ($16/mo equiv)
export const BIZ_ANNUAL_CENTS = 72000;        // $720/year ($60/mo equiv)

export function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  // BUG-05: Reject immediately if secret is not configured.
  // Defaulting to "" would make HMAC predictable — any attacker knowing the payload
  // can forge a valid signature, enabling fake subscription activations for free.
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[razorpay] RAZORPAY_WEBHOOK_SECRET not configured — rejecting all webhooks");
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signature, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyPaymentSignature(params: {
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  
  let body = "";
  if (params.razorpay_subscription_id) {
    body = `${params.razorpay_payment_id}|${params.razorpay_subscription_id}`;
  } else if (params.razorpay_order_id) {
    body = `${params.razorpay_order_id}|${params.razorpay_payment_id}`;
  } else {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(params.razorpay_signature, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
