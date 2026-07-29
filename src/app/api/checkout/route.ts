import { NextRequest, NextResponse } from "next/server";
import { stripe, REPORT_PRICES } from "@/lib/stripe";

/**
 * POST /api/checkout
 *
 * WHAT IT IS: Creates a Stripe Checkout session for report purchases.
 * WHY IT EXISTS: When user clicks "Pay €1" or "Pay €3", this creates the payment page.
 *
 * Body: { scanId: string, tier: "detailed" | "full", lang: string }
 * Returns: { url: string } — the Stripe Checkout URL to redirect to
 */

export async function POST(request: NextRequest) {
  try {
    const { scanId, tier, lang } = await request.json();

    if (!scanId || !tier) {
      return NextResponse.json({ error: "scanId and tier are required" }, { status: 400 });
    }

    const priceConfig = REPORT_PRICES[tier as keyof typeof REPORT_PRICES];
    if (!priceConfig) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceConfig.priceId,
          quantity: 1,
        },
      ],
      // Where to redirect after payment
      success_url: `${appUrl}/${lang || "en"}/report/${scanId}?tier=${tier}&paid=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${lang || "en"}/report/${scanId}?tier=${tier}`,
      // Store metadata so we can identify this payment later
      metadata: {
        scanId,
        tier,
      },
      // Auto-collect tax (EU VAT via Stripe Tax)
      // automatic_tax: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[Checkout] Error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
