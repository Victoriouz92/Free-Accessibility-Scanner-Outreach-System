import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { runScan } from "@/lib/scanner";

/**
 * POST /api/scan
 * Starts a new scan job.
 * - Validates the URL
 * - Creates a row in Supabase with status "scanning"
 * - Runs the real axe-core scan
 * - Updates the row with results when complete
 *
 * Note: For now this runs synchronously (scan happens during the request).
 * At scale, you'd move this to a background queue worker.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Create a scan row with status "scanning"
    const { data, error } = await supabaseAdmin
      .from("scans")
      .insert({ url, status: "scanning" })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to create scan" }, { status: 500 });
    }

    const scanId = data.id;

    // Run the actual scan in the background (don't await — let client poll)
    runScanAndStore(scanId, url);

    return NextResponse.json({ scanId, status: "scanning" });
  } catch (err) {
    console.error("Scan API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Runs the scan and stores results in Supabase.
 * This runs in the background — the POST response returns immediately.
 */
async function runScanAndStore(scanId: string, url: string) {
  try {
    console.log(`[runScanAndStore] Starting scan ${scanId} for ${url}`);
    const result = await runScan(url);
    console.log(`[runScanAndStore] Scan complete! Score: ${result.score}, Issues: ${JSON.stringify(result.issues)}`);

    // Store completed results
    const { error: updateError } = await supabaseAdmin
      .from("scans")
      .update({
        status: "complete",
        score: result.score,
        issues_critical: result.issues.critical,
        issues_serious: result.issues.serious,
        issues_moderate: result.issues.moderate,
        issues_minor: result.issues.minor,
        examples: result.examples,
        pages_scanned: result.pagesScanned,
        scan_duration: result.scanDuration,
        completed_at: new Date().toISOString(),
      })
      .eq("id", scanId);

    if (updateError) {
      console.error(`[runScanAndStore] Supabase update failed:`, updateError);
    }
  } catch (err) {
    console.error(`[runScanAndStore] SCAN FAILED for ${url}:`, err);

    // Store the error so the frontend shows it
    await supabaseAdmin
      .from("scans")
      .update({
        status: "error",
        error_message: err instanceof Error ? err.message : "Scan failed — is Chromium installed? Run: npx playwright install chromium",
      })
      .eq("id", scanId);
  }
}
