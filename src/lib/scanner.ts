import { chromium, type Page, type Browser } from "playwright";
import type { ScanResult, ViolationExample, Severity } from "./types";
import * as fs from "fs";
import * as path from "path";

/**
 * Scanner Engine (v2 — improved reliability)
 *
 * Improvements over v1:
 * - Follows redirects and uses the FINAL URL (not what user typed)
 * - Waits for network idle (catches JS-rendered content)
 * - Deduplicates violations across pages (same rule on 5 pages = 1 issue, not 5)
 * - Returns the actual scanned page URLs in the result
 * - Adds best-practice checks for more complete coverage
 */

const IMPACT_TO_SEVERITY: Record<string, Severity> = {
  critical: "critical",
  serious: "serious",
  moderate: "moderate",
  minor: "minor",
};

export async function runScan(url: string): Promise<ScanResult> {
  const startTime = Date.now();
  let browser: Browser | null = null;

  try {
    console.log(`[Scanner] Starting scan for: ${url}`);

    browser = await chromium.launch({ headless: true });
    console.log(`[Scanner] Chromium launched successfully`);

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 720 },
    });
    context.setDefaultTimeout(20000);

    const page = await context.newPage();

    // Navigate and follow all redirects — use networkidle for full JS rendering
    console.log(`[Scanner] Navigating to: ${url}`);
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Get the FINAL URL after all redirects
    const finalUrl = page.url();
    console.log(`[Scanner] Final URL after redirects: ${finalUrl}`);

    // Run axe-core on the main page
    console.log(`[Scanner] Running axe-core on main page...`);
    const mainViolations = await scanPage(page, finalUrl);
    console.log(`[Scanner] Main page: ${mainViolations.length} violation types found`);

    // Track which pages were scanned
    const scannedPages = [finalUrl];
    const allViolations = [...mainViolations];

    // Find and scan internal pages
    const internalUrls = await findInternalLinks(page, finalUrl);
    console.log(`[Scanner] Found ${internalUrls.length} internal links`);

    const pagesToScan = internalUrls.slice(0, 4);
    for (const pageUrl of pagesToScan) {
      try {
        console.log(`[Scanner] Scanning internal page: ${pageUrl}`);
        await page.goto(pageUrl, { waitUntil: "networkidle", timeout: 15000 });
        const pageViolations = await scanPage(page, pageUrl);
        console.log(`[Scanner] Internal page: ${pageViolations.length} violation types`);
        allViolations.push(...pageViolations);
        scannedPages.push(page.url()); // Use final URL after any redirects
      } catch (err) {
        console.log(`[Scanner] Skipping page (error): ${pageUrl} - ${err}`);
        continue;
      }
    }

    await browser.close();
    browser = null;

    // Deduplicate: count unique violations, not repeats across pages
    const dedupedIssues = countDeduplicated(allViolations);
    const totalIssues = dedupedIssues.critical + dedupedIssues.serious + dedupedIssues.moderate + dedupedIssues.minor;
    const score = calculateScore(dedupedIssues, totalIssues);
    const examples = pickExamples(allViolations);

    console.log(`[Scanner] Done! Score: ${score}, Total issues: ${totalIssues} (deduplicated)`);
    console.log(`[Scanner] Breakdown: C=${dedupedIssues.critical} S=${dedupedIssues.serious} M=${dedupedIssues.moderate} m=${dedupedIssues.minor}`);
    console.log(`[Scanner] Pages scanned: ${scannedPages.join(", ")}`);

    return {
      url: finalUrl, // Store the FINAL URL, not what user typed
      score,
      issues: dedupedIssues,
      examples,
      pagesScanned: scannedPages.length,
      scanDuration: Date.now() - startTime,
      scannedPages, // New: list of actual scanned URLs
    };
  } catch (error) {
    if (browser) await browser.close();
    console.error(`[Scanner] FATAL ERROR:`, error);
    throw error;
  }
}

/**
 * Run axe-core on the current page.
 * Includes WCAG 2.1 AA + best-practice rules for comprehensive coverage.
 */
async function scanPage(page: Page, pageUrl: string): Promise<AxeViolation[]> {
  try {
    const axeCorePath = path.resolve(process.cwd(), "node_modules/axe-core/axe.min.js");
    const axeSource = fs.readFileSync(axeCorePath, "utf-8");

    await page.evaluate(axeSource);

    const results = await page.evaluate(() => {
      // @ts-expect-error - axe is injected globally
      return window.axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
        },
      });
    });

    console.log(`[Scanner] axe-core returned ${results.violations.length} violations for ${pageUrl}`);

    return results.violations.map((v: any) => ({
      impact: v.impact || "minor",
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      id: v.id,
      pageUrl,
      nodes: v.nodes.map((n: any) => ({
        html: n.html,
        target: n.target.join(", "),
        failureSummary: n.failureSummary || "",
      })),
    }));
  } catch (error) {
    console.error(`[Scanner] axe-core FAILED on ${pageUrl}:`, error);
    return [];
  }
}

/**
 * Find internal links (same domain) from the page.
 */
async function findInternalLinks(page: Page, baseUrl: string): Promise<string[]> {
  try {
    const baseOrigin = new URL(baseUrl).origin;

    const links = await page.evaluate((origin: string) => {
      const anchors = Array.from(
        document.querySelectorAll("nav a[href], header a[href], main a[href], a[href]")
      );
      const urls: string[] = [];

      for (const a of anchors) {
        const href = (a as HTMLAnchorElement).href;
        if (
          href &&
          href.startsWith(origin) &&
          !href.includes("#") &&
          !href.match(/\.(pdf|jpg|png|gif|svg|zip|css|js|xml|json)$/i) &&
          href !== origin &&
          href !== origin + "/"
        ) {
          urls.push(href);
        }
      }

      return [...new Set(urls)];
    }, baseOrigin);

    return links
      .filter((link) => link !== baseUrl && link !== baseUrl + "/")
      .slice(0, 4);
  } catch (error) {
    console.error(`[Scanner] findInternalLinks failed:`, error);
    return [];
  }
}

/**
 * Count violations with deduplication.
 * Same violation type (e.g. "image-alt") on multiple pages counts
 * total affected elements, but doesn't unfairly multiply the score.
 * Each unique rule counts its nodes across all pages, but capped per rule.
 */
function countDeduplicated(violations: AxeViolation[]) {
  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };

  // Group by rule ID
  const byRule = new Map<string, { impact: string; totalNodes: number }>();

  for (const v of violations) {
    const existing = byRule.get(v.id);
    if (existing) {
      existing.totalNodes += v.nodes.length;
    } else {
      byRule.set(v.id, { impact: v.impact, totalNodes: v.nodes.length });
    }
  }

  // Count: each rule contributes its capped node count
  for (const [, rule] of byRule) {
    const severity = IMPACT_TO_SEVERITY[rule.impact] || "minor";
    // Cap at 10 per rule type — prevents one repeated issue from dominating
    const cappedCount = Math.min(rule.totalNodes, 10);
    counts[severity] += cappedCount;
  }

  return counts;
}

/**
 * Calculate accessibility score (0-100).
 * Exponential curve — drops fast at first, then levels off.
 */
function calculateScore(
  issues: { critical: number; serious: number; moderate: number; minor: number },
  totalIssues: number
): number {
  if (totalIssues === 0) return 100;

  const weightedIssues =
    issues.critical * 4 +
    issues.serious * 2 +
    issues.moderate * 1 +
    issues.minor * 0.5;

  // Curve: 5≈85, 10≈72, 20≈51, 40≈26, 60+≈<15
  const score = Math.round(100 * Math.exp(-weightedIssues / 30));
  return Math.max(5, Math.min(100, score));
}

/**
 * Pick 2-3 most impactful examples for the free report.
 */
function pickExamples(violations: AxeViolation[]): ViolationExample[] {
  if (violations.length === 0) return [];

  const sorted = [...violations].sort((a, b) => {
    const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
    return (order[a.impact as keyof typeof order] ?? 3) - (order[b.impact as keyof typeof order] ?? 3);
  });

  const seen = new Set<string>();
  const examples: ViolationExample[] = [];

  for (const v of sorted) {
    if (seen.has(v.id) || examples.length >= 3) break;
    seen.add(v.id);

    const node = v.nodes[0];
    if (!node) continue;

    examples.push({
      severity: IMPACT_TO_SEVERITY[v.impact] || "minor",
      description: v.help,
      codeBefore: truncateHtml(node.html),
      codeAfter: generateFixSuggestion(v.id, node.html),
      wcagCriterion: v.helpUrl,
    });
  }

  return examples;
}

function generateFixSuggestion(ruleId: string, html: string): string {
  const truncated = truncateHtml(html);

  switch (ruleId) {
    case "image-alt":
      return truncated.replace(/<img/, '<img alt="Descriptive text about this image"');
    case "label":
      return `<label for="field-id">Field label</label>\n${truncated}`;
    case "color-contrast":
      return "Increase text color contrast to at least 4.5:1 ratio";
    case "link-name":
      return truncated.replace(/<a/, '<a aria-label="Descriptive link text"');
    case "button-name":
      return truncated.replace(/<button/, '<button aria-label="Button purpose"');
    case "html-has-lang":
      return '<html lang="en">';
    case "document-title":
      return "<title>Your Page Title</title>";
    case "heading-order":
      return "Use headings in sequential order (h1 → h2 → h3) without skipping levels";
    case "region":
      return "Wrap content in landmark regions (<main>, <nav>, <header>, <footer>)";
    case "landmark-one-main":
      return "Add a <main> element to wrap your primary page content";
    case "page-has-heading-one":
      return "Add an <h1> heading as the main title of the page";
    case "meta-viewport":
      return '<meta name="viewport" content="width=device-width, initial-scale=1"> (without user-scalable=no)';
    case "link-in-text-block":
      return "Make links visually distinct from surrounding text (not just by color)";
    default:
      return `Fix: see WCAG guidelines for rule "${ruleId}"`;
  }
}

function truncateHtml(html: string): string {
  if (html.length <= 120) return html;
  return html.slice(0, 117) + "...";
}

interface AxeViolation {
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  id: string;
  pageUrl?: string;
  nodes: {
    html: string;
    target: string;
    failureSummary: string;
  }[];
}
