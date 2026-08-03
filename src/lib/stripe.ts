import Stripe from "stripe";

/**
 * Stripe Client
 *
 * WHAT IT IS: Handles payments for the €1/€3 report tiers.
 * WHY IT EXISTS: Centralizes payment logic in one file.
 *
 * To set up:
 * 1. Create products in Stripe Dashboard for "Detailed Report" (€1) and "Full Report + PDF" (€3)
 * 2. Copy the Price IDs and put them below
 * 3. Add your Stripe keys to .env.local
 */

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" })
  : null;

// Price configuration
// TODO: Replace with your real Stripe Price IDs from the Dashboard
export const REPORT_PRICES = {
  detailed: {
    priceId: process.env.STRIPE_PRICE_DETAILED || "price_detailed_placeholder",
    amount: 100, // €1.00 in cents
    label: "Detailed Report",
  },
  full: {
    priceId: process.env.STRIPE_PRICE_FULL || "price_full_placeholder",
    amount: 300, // €3.00 in cents
    label: "Full Report + PDF",
  },
};
