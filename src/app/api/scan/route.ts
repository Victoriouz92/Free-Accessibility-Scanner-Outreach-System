import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { runScan } from "@/lib/scanner";

/**
 * POST /api/scan
 * Starts a new scan job — or returns a cached result if the same URL
 * was scanned within the last 24 hours.
 */

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

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

    // Normalize URL for caching (remove trailing slash, lowercase)
    const normalizedUrl = url.replace(/\/+$/, "").toLowerCase();

    // Check for a recent completed scan of this URL (within 24h)
    // Also check the base domain in case the stored URL is the post-redirect version
    const cutoff = new Date(Date.now() - CACHE_DURATION_MS).toISOString();
    const { data: cachedScan } = await supabaseAdmin
      .from("scans")
      .select("id, created_at")
      .or(`url.eq.${normalizedUrl},url.ilike.${normalizedUrl}%`)
      .eq("status", "complete")
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (cachedScan) {
      // Return the cached scan — frontend will get results immediately
      console.log(`[Cache] Returning cached scan for ${normalizedUrl} (ID: ${cachedScan.id})`);
      return NextResponse.json({
        scanId: cachedScan.id,
        status: "complete",
        cached: true,
      });
    }

    // No cache — create a new scan
    const { data, error } = await supabaseAdmin
      .from("scans")
      .insert({ url: normalizedUrl, status: "scanning" })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to create scan" }, { status: 500 });
    }

    const scanId = data.id;

    // Run the scan in the background
    runScanAndStore(scanId, normalizedUrl);

    return NextResponse.json({ scanId, status: "scanning", cached: false });
  } catch (err) {
    console.error("Scan API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Runs the scan and stores results in Supabase.
 * Runs in the background — the POST returns immediately.
 */
async function runScanAndStore(scanId: string, url: string) {
  try {
    console.log(`[runScanAndStore] Starting scan ${scanId} for ${url}`);
    const result = await runScan(url);
    console.log(`[runScanAndStore] Scan complete! Score: ${result.score}, Issues: ${JSON.stringify(result.issues)}`);

    const { error: updateError } = await supabaseAdmin
      .from("scans")
      .update({
        status: "complete",
        url: result.url, // Store the FINAL URL (after redirects)
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

    await supabaseAdmin
      .from("scans")
      .update({
        status: "error",
        error_message: err instanceof Error ? err.message : "Scan failed",
      })
      .eq("id", scanId);
  }
}
