"use client";

import { useState } from "react";

/**
 * PaymentButton Component
 *
 * WHAT IT IS: A button that triggers Stripe Checkout when clicked.
 * WHY IT EXISTS: Handles the flow of creating a checkout session and redirecting.
 */

interface Props {
  scanId: string;
  tier: string;
  lang: string;
  label: string;
}

export function PaymentButton({ scanId, tier, lang, label }: Props) {
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId, tier, lang }),
      });

      if (!response.ok) throw new Error("Checkout failed");

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment could not be initiated. Please try again.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-8 py-3 rounded-lg bg-primary text-white font-semibold
                 hover:bg-primary-hover disabled:opacity-50 transition-colors min-h-[44px]"
    >
      {loading ? "Redirecting to payment..." : label}
    </button>
  );
}
