import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { ScanResult } from "@/lib/types";

/**
 * GET /api/scan/[id]
 * Returns the current status of a scan job.
 * - Client polls this every 2 seconds
 * - Returns "scanning" while in progress
 * - Returns "complete" with real results when done
 * - Returns "error" if the scan failed
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Fetch the scan from Supabase
  const { data: scan, error } = await supabaseAdmin
    .from("scans")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !scan) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  // Still in progress
  if (scan.status === "scanning" || scan.status === "queued") {
    return NextResponse.json({ status: "scanning" });
  }

  // Failed
  if (scan.status === "error") {
    return NextResponse.json({
      status: "error",
      error: scan.error_message || "Scan failed",
    });
  }

  // Completed — return full result
  const result: ScanResult = {
    url: scan.url,
    score: scan.score ?? 0,
    issues: {
      critical: scan.issues_critical ?? 0,
      serious: scan.issues_serious ?? 0,
      moderate: scan.issues_moderate ?? 0,
      minor: scan.issues_minor ?? 0,
    },
    examples: scan.examples || [],
    pagesScanned: scan.pages_scanned ?? 1,
    scanDuration: scan.scan_duration ?? 0,
  };

  return NextResponse.json({ status: "complete", result });
}
