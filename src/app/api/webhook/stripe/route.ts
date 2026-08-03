import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/webhook/stripe
 *
 * WHAT IT IS: Receives payment confirmations from Stripe.
 * WHY IT EXISTS: After a customer pays, Stripe calls this URL to confirm
 *               the payment went through. We then unlock the report.
 *
 * Setup in Stripe Dashboard:
 * 1. Go to Developers → Webhooks
 * 2. Add endpoint: https://your-domain.com/api/webhook/stripe
 * 3. Listen for: checkout.session.completed
 * 4. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET in .env.local
 */

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify the webhook came from Stripe (not spoofed)
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err) {
      console.error("[Webhook] Signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { scanId, tier } = session.metadata || {};

      if (scanId && tier) {
        // Record the payment in Supabase
        await supabaseAdmin.from("payments").insert({
          scan_id: scanId,
          tier,
          amount_cents: tier === "full" ? 300 : 100,
          currency: "eur",
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent,
          status: "paid",
          email: session.customer_details?.email || null,
          paid_at: new Date().toISOString(),
        });

        console.log(`[Webhook] Payment confirmed: ${tier} report for scan ${scanId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Webhook] Error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
