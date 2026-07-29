import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/contact
 * Handles contact form submissions.
 * - Validates required fields
 * - Stores in Supabase "contacts" table with consent record
 *
 * TODO: Send notification email to internal inbox
 * TODO: Send confirmation email to visitor
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message, consent, consentTimestamp, scanId } = body;

    // Validate required fields
    if (!name || !email || !consent) {
      return NextResponse.json(
        { error: "Name, email, and consent are required" },
        { status: 400 }
      );
    }

    // The exact consent text the user agreed to
    const consentText =
      "I agree to be contacted about accessibility services. My data will be processed as described in the privacy policy.";

    // Store in Supabase
    const { error } = await supabaseAdmin.from("contacts").insert({
      name,
      email,
      company: company || null,
      message: message || null,
      scan_id: scanId || null,
      consent_given: true,
      consent_text: consentText,
      consent_timestamp: consentTimestamp,
    });

    if (error) {
      console.error("Supabase contact insert error:", error);
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
    }

    // TODO: Send notification email to team
    // TODO: Send confirmation email to visitor

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
