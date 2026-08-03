import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/report-pdf?scanId=xxx&tier=free|detailed|full&view=developer|owner
 *
 * On Vercel: returns error (no Playwright available)
 * On localhost: generates PDF via Playwright
 */

export async function GET(request: NextRequest) {
  const scanId = request.nextUrl.searchParams.get("scanId");
  const tier = request.nextUrl.searchParams.get("tier") || "free";
  const view = request.nextUrl.searchParams.get("view") || "developer";

  if (!scanId) {
    return NextResponse.json({ error: "scanId required" }, { status: 400 });
  }

  const { data: scan, error } = await supabaseAdmin
    .from("scans")
    .select("*")
    .eq("id", scanId)
    .single();

  if (error || !scan || scan.status !== "complete") {
    return NextResponse.json({ error: "Scan not found or incomplete" }, { status: 404 });
  }

  // Try to use Playwright (only works on localhost/dedicated server)
  try {
    const { chromium } = await import("playwright-core");
    const browser = await chromium.connectOverCDP(
      `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
    );
    const html = generateReportHtml(scan, tier, view);
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "40px", bottom: "60px", left: "40px", right: "40px" },
      printBackground: true,
    });
    await browser.close();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="accesscheck-report-${scanId.slice(0, 8)}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "PDF generation requires a dedicated server. Not available on serverless hosting." },
      { status: 503 }
    );
  }
}

function generateReportHtml(scan: any, tier: string, view: string): string {
  const score = scan.score ?? 0;
  const issues = { critical: scan.issues_critical ?? 0, serious: scan.issues_serious ?? 0, moderate: scan.issues_moderate ?? 0, minor: scan.issues_minor ?? 0 };
  const total = issues.critical + issues.serious + issues.moderate + issues.minor;
  const examples = scan.examples || [];
  const scoreColor = score >= 80 ? "#1a7a6e" : score >= 50 ? "#b27300" : "#c0392b";
  const scoreLabel = score >= 80 ? "Good" : score >= 50 ? "Needs Work" : "Poor";
  const tierBadge = tier === "full" ? "Full Report + Developer Details" : tier === "detailed" ? "Detailed Report" : "Free Summary Report";

  let examplesHtml = "";
  if (examples.length > 0) {
    examplesHtml = examples.map((ex: any) => `
      <div style="margin-bottom:20px;padding:15px;border:1px solid #e5e5e5;border-radius:8px;">
        <p style="margin:0 0 8px"><strong style="color:${ex.severity === "critical" ? "#c0392b" : "#d35400"}">${ex.severity.toUpperCase()}</strong> — ${ex.description}</p>
        ${view === "developer" ? `<div style="background:#fef2f2;padding:10px;border-radius:4px;font-family:monospace;font-size:12px;margin-bottom:8px">${escapeHtml(ex.codeBefore)}</div><div style="background:#f0fdf4;padding:10px;border-radius:4px;font-family:monospace;font-size:12px">${escapeHtml(ex.codeAfter)}</div>` : `<p style="font-size:13px;color:#525252">This issue prevents some users from accessing your content properly.</p>`}
      </div>`).join("");
  }

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:-apple-system,sans-serif;color:#1a1a2e;line-height:1.6;margin:0;padding:0}.header{background:linear-gradient(135deg,#e8f5f3,#f0fdf4);padding:30px 40px;border-bottom:2px solid #1a7a6e}h1{margin:0;color:#1a7a6e}h2{border-bottom:1px solid #e5e5e5;padding-bottom:8px}.content{padding:30px 40px}.score{font-size:64px;font-weight:bold;color:${scoreColor};text-align:center}.stats{display:flex;gap:20px;justify-content:center;margin:20px 0}.stat{text-align:center;padding:15px;border:1px solid #e5e5e5;border-radius:8px;min-width:80px}.footer{margin-top:40px;padding-top:20px;border-top:1px solid #e5e5e5;font-size:11px;color:#525252;text-align:center}</style></head><body><div class="header"><h1>AccessCheck</h1><p>${tierBadge} — ${scan.url}</p><p style="font-size:12px;color:#888">Generated: ${new Date().toLocaleDateString()} | Scan ID: ${scan.id}</p></div><div class="content"><div style="text-align:center;margin:20px 0 30px"><p class="score">${score}<span style="font-size:28px;color:#525252">/100</span></p><p style="color:${scoreColor};font-weight:600">${scoreLabel}</p><p style="font-size:12px;color:#525252">${scan.pages_scanned||1} pages scanned</p></div><h2>Issues Breakdown</h2><div class="stats"><div class="stat"><div style="font-size:24px;font-weight:bold;color:#c0392b">${issues.critical}</div><div style="font-size:11px">CRITICAL</div></div><div class="stat"><div style="font-size:24px;font-weight:bold;color:#d35400">${issues.serious}</div><div style="font-size:11px">SERIOUS</div></div><div class="stat"><div style="font-size:24px;font-weight:bold;color:#b27300">${issues.moderate}</div><div style="font-size:11px">MODERATE</div></div><div class="stat"><div style="font-size:24px;font-weight:bold;color:#7f8c8d">${issues.minor}</div><div style="font-size:11px">MINOR</div></div></div><p style="text-align:center;font-size:14px;color:#525252">Total: ${total} issues</p>${examplesHtml ? `<h2>Issues Found</h2>${examplesHtml}` : ""}<div style="background:#f9f9f6;padding:15px;border-radius:8px;font-size:11px;color:#666;margin-top:30px"><strong>Disclaimer:</strong> Automated assessment based on WCAG 2.1/2.2 AA. Not a legal certification. Does not cover: 200% zoom behavior, screen reader experience, PDF accessibility.</div><div class="footer"><p>AccessCheck | accesscheck.eu | VV Labs EOOD © 2026</p></div></div></body></html>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
