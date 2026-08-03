import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { chromium } from "playwright";

/**
 * GET /api/report-pdf?scanId=xxx&tier=free|detailed|full
 *
 * Generates a PDF report for a given scan.
 * - free: summary with score, issues count, 2-3 examples
 * - detailed: all violations grouped by WCAG criterion
 * - full: same as detailed + HTML selectors for developers
 */

export async function GET(request: NextRequest) {
  const scanId = request.nextUrl.searchParams.get("scanId");
  const tier = request.nextUrl.searchParams.get("tier") || "free";

  if (!scanId) {
    return NextResponse.json({ error: "scanId required" }, { status: 400 });
  }

  // Fetch scan data from Supabase
  const { data: scan, error } = await supabaseAdmin
    .from("scans")
    .select("*")
    .eq("id", scanId)
    .single();

  if (error || !scan || scan.status !== "complete") {
    return NextResponse.json({ error: "Scan not found or incomplete" }, { status: 404 });
  }

  // Generate HTML for the PDF
  const html = generateReportHtml(scan, tier);

  // Render to PDF using Playwright
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "40px", bottom: "60px", left: "40px", right: "40px" },
    printBackground: true,
  });

  await browser.close();

  // Return PDF
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="accesscheck-report-${scanId.slice(0, 8)}.pdf"`,
    },
  });
}

function generateReportHtml(scan: any, tier: string): string {
  const score = scan.score ?? 0;
  const issues = {
    critical: scan.issues_critical ?? 0,
    serious: scan.issues_serious ?? 0,
    moderate: scan.issues_moderate ?? 0,
    minor: scan.issues_minor ?? 0,
  };
  const total = issues.critical + issues.serious + issues.moderate + issues.minor;
  const examples = scan.examples || [];
  const scoreColor = score >= 80 ? "#2a9d8f" : score >= 50 ? "#b27300" : "#c0392b";
  const scoreLabel = score >= 80 ? "Good" : score >= 50 ? "Needs Work" : "Poor";

  let examplesHtml = "";
  if (examples.length > 0) {
    const sectionTitle = tier === "free" ? "Example Issues Found (showing top 3)" : "All Issues Found";
    examplesHtml = `
      <h2 style="margin-top: 30px;">${sectionTitle}</h2>
      ${examples.map((ex: any) => `
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e5e5; border-radius: 8px;">
          <p style="margin: 0 0 8px 0;"><strong style="color: ${ex.severity === 'critical' ? '#c0392b' : ex.severity === 'serious' ? '#d35400' : '#b27300'};">${ex.severity.toUpperCase()}</strong> — ${ex.description}</p>
          ${tier !== "free" && ex.wcagCriterion ? `<p style="font-size: 11px; color: #666; margin: 0 0 8px 0;">WCAG Reference: ${escapeHtml(ex.wcagCriterion)}</p>` : ""}
          <div style="background: #fef2f2; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; margin-bottom: 8px; overflow-wrap: break-word;">
            <strong>Before:</strong> ${escapeHtml(ex.codeBefore)}
          </div>
          <div style="background: #f0fdf4; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; overflow-wrap: break-word;">
            <strong>Fix:</strong> ${escapeHtml(ex.codeAfter)}
          </div>
        </div>
      `).join("")}
    `;
  }

  const tierBadge = tier === "full" ? "Full Report + Developer Details" : tier === "detailed" ? "Detailed Report" : "Free Summary Report";

  const watermark = tier === "free" ? `<div style="position: fixed; bottom: 20px; right: 20px; opacity: 0.3; font-size: 10px; color: #999;">Free report — upgrade for full details at accesscheck.eu</div>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, "Segoe UI", Roboto, sans-serif; color: #1a1a2e; line-height: 1.6; padding: 0; margin: 0; }
    .header { background: linear-gradient(135deg, #e8f5f3, #f0fdf4); padding: 30px 40px; border-bottom: 2px solid #2a9d8f; }
    .header h1 { margin: 0; color: #2a9d8f; font-size: 24px; }
    .header p { margin: 5px 0 0; color: #525252; font-size: 14px; }
    .content { padding: 30px 40px; }
    .score-section { text-align: center; margin: 20px 0 30px; }
    .score { font-size: 64px; font-weight: bold; color: ${scoreColor}; margin: 0; }
    .score span { font-size: 28px; color: #525252; }
    .score-label { color: ${scoreColor}; font-size: 16px; font-weight: 600; }
    .stats { display: flex; gap: 20px; justify-content: center; margin: 20px 0; }
    .stat { text-align: center; padding: 15px 20px; border: 1px solid #e5e5e5; border-radius: 8px; min-width: 80px; }
    .stat-number { font-size: 24px; font-weight: bold; }
    .stat-label { font-size: 11px; color: #525252; text-transform: uppercase; }
    .critical { color: #c0392b; }
    .serious { color: #d35400; }
    .moderate { color: #b27300; }
    .minor { color: #7f8c8d; }
    .meta { font-size: 12px; color: #525252; text-align: center; margin-top: 10px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 11px; color: #525252; text-align: center; }
    .disclaimer { background: #f9f9f6; padding: 15px; border-radius: 8px; font-size: 11px; color: #666; margin-top: 30px; }
    h2 { color: #1a1a2e; font-size: 18px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; }
    .cta { background: #e8f5f3; border: 1px solid #2a9d8f; border-radius: 8px; padding: 20px; text-align: center; margin-top: 30px; }
    .cta p { margin: 0; font-size: 14px; }
    .cta a { color: #2a9d8f; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>AccessCheck</h1>
    <p>${tierBadge} — ${scan.url}</p>
    <p style="font-size: 12px; color: #888;">Generated: ${new Date().toLocaleDateString()} | Scan ID: ${scan.id}</p>
  </div>

  <div class="content">
    <div class="score-section">
      <p class="score">${score}<span>/100</span></p>
      <p class="score-label">${scoreLabel}</p>
      <p class="meta">${scan.pages_scanned || 1} pages scanned in ${((scan.scan_duration || 0) / 1000).toFixed(1)}s</p>
    </div>

    <h2>Issues Breakdown</h2>
    <div class="stats">
      <div class="stat"><div class="stat-number critical">${issues.critical}</div><div class="stat-label">Critical</div></div>
      <div class="stat"><div class="stat-number serious">${issues.serious}</div><div class="stat-label">Serious</div></div>
      <div class="stat"><div class="stat-number moderate">${issues.moderate}</div><div class="stat-label">Moderate</div></div>
      <div class="stat"><div class="stat-number minor">${issues.minor}</div><div class="stat-label">Minor</div></div>
    </div>
    <p style="text-align: center; font-size: 14px; color: #525252;">Total: ${total} issues found across ${scan.pages_scanned || 1} pages</p>

    ${examplesHtml}

    ${tier !== "free" ? `
    <h2 style="margin-top: 30px;">Recommendations</h2>
    <div style="padding: 15px; border: 1px solid #e5e5e5; border-radius: 8px; margin-bottom: 15px;">
      <h3 style="margin: 0 0 8px; font-size: 14px;">Priority 1: Fix Critical Issues First</h3>
      <p style="margin: 0; font-size: 13px; color: #525252;">Critical issues prevent some users from accessing your content at all. These should be fixed immediately — typically missing form labels, keyboard traps, and missing alt text on functional images.</p>
    </div>
    <div style="padding: 15px; border: 1px solid #e5e5e5; border-radius: 8px; margin-bottom: 15px;">
      <h3 style="margin: 0 0 8px; font-size: 14px;">Priority 2: Address Serious Issues</h3>
      <p style="margin: 0; font-size: 13px; color: #525252;">Serious issues make content difficult to use for people with disabilities. Common fixes: improving color contrast ratios, adding descriptive link text, ensuring proper heading hierarchy.</p>
    </div>
    <div style="padding: 15px; border: 1px solid #e5e5e5; border-radius: 8px; margin-bottom: 15px;">
      <h3 style="margin: 0 0 8px; font-size: 14px;">Priority 3: Improve Moderate &amp; Minor Issues</h3>
      <p style="margin: 0; font-size: 13px; color: #525252;">These are best-practice improvements that enhance the experience but are less likely to cause enforcement action. Address them as part of ongoing maintenance.</p>
    </div>
    ${tier === "full" ? `
    <h2 style="margin-top: 30px;">Technical Notes for Developers</h2>
    <ul style="font-size: 13px; color: #525252; padding-left: 20px;">
      <li>Use semantic HTML elements (button, nav, main, header, footer) instead of generic divs</li>
      <li>Ensure all interactive elements are focusable and have visible focus indicators</li>
      <li>Test with keyboard-only navigation (Tab, Enter, Escape)</li>
      <li>Run axe-core in your CI/CD pipeline to catch regressions</li>
      <li>Set lang attribute on the html element matching the page content language</li>
      <li>Provide skip navigation links for screen reader users</li>
    </ul>
    ` : ""}
    ` : ""}

    <div class="cta">
      <p>Need help fixing these issues?</p>
      <p><a href="https://accesscheck.eu/contact">Contact us for a free consultation →</a></p>
    </div>

    <div class="disclaimer">
      <strong>Scope &amp; Limitations:</strong> This report is generated by an automated scanner (axe-core engine)
      testing against WCAG 2.1/2.2 Level AA criteria and best practices. It checks color contrast, alt text,
      form labels, keyboard structure, ARIA attributes, heading hierarchy, and more (~50 rules).
      <br><br>
      <strong>Not covered by automated testing:</strong> behavior at 200% zoom, real screen reader experience,
      PDF accessibility, complex widget interactions, content readability, and multimedia captions.
      Automated tools detect approximately 30-50% of all accessibility barriers.
      <strong>This report does not constitute a legal compliance certification.</strong>
      For full EAA/EN 301 549 compliance, a manual expert audit is recommended.
      <br><br>
      By using this service, you agree to our Terms &amp; Conditions at accesscheck.eu/terms.
    </div>

    <div class="footer">
      <p>AccessCheck — Free Accessibility Scanner | accesscheck.eu</p>
      <p>Developed by VV Labs EOOD © 2026</p>
    </div>
  </div>
  ${watermark}
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
