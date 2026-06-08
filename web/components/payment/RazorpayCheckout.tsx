"use client";

import { useState } from "react";
import { Loader2, IndianRupee } from "lucide-react";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface Props {
  plan: "payg" | "pro" | "business";
  label: string;
  amountINR: number;
  userEmail?: string;
  fileName?: string;
  pageCount?: number;
  onSuccess: (plan: string) => void;
  onError?: (msg: string) => void;
  className?: string;
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayCheckout({
  plan, label, amountINR, userEmail, fileName, pageCount, onSuccess, onError, className,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Payment system could not load. Check your internet connection.");

      // Create order on server
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, fileName, pageCount }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error ?? "Order creation failed.");

      // Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: "INR",
        name: "ConvertStatement",
        description: plan === "payg" ? "Pay-per-document processing" : `${label} Plan`,
        order_id: order.orderId,
        prefill: { email: userEmail },
        theme: { color: "#0284c7" },
        modal: {
          ondismiss: () => setLoading(false),
        },
        handler: async (response: RazorpayResponse) => {
          // Verify payment on server
          const verRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, plan }),
          });
          const verData = await verRes.json();
          if (!verRes.ok) throw new Error(verData.error ?? "Payment verification failed.");
          onSuccess(plan);
          setLoading(false);
        },
      });
      rzp.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed.";
      onError?.(msg);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <IndianRupee className="h-4 w-4" />
      )}
      {loading ? "Opening payment…" : label}
    </button>
  );
}
