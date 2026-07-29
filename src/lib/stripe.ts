/**
 * Stripe Client
 *
 * WHAT IT IS: A helper to create Stripe payment sessions for the €1/€3 report tiers.
 * WHY IT EXISTS: Keeps payment logic in one place, separate from page components.
 * REAL WORLD ANALOGY: Like a cashier desk — all payments go through one point.
 *
 * TODO: Install stripe when ready to connect:
 *   npm install stripe
 *
 * Then uncomment the code below and fill in your .env.local values.
 */

// import Stripe from "stripe";

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-12-18.acacia",
// });

// Price IDs for the two report tiers
// TODO: Create these products in your Stripe Dashboard
// export const PRICES = {
//   detailed: "price_xxx", // €1 detailed report
//   full: "price_xxx",     // €3 full report + PDF
// };

export {};
