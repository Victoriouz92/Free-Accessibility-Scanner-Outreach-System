import { chromium, type Page, type Browser } from "playwright";
import type { ScanResult, ViolationExample, Severity } from "./types";
import * as fs from "fs";
import * as path from "path";

/**
 * Scanner Engine
 *
 * WHAT IT IS: The core that actually visits a website and checks for accessibility issues.
 * WHY IT EXISTS: Gives real, unique results per website using axe-core.
 * REAL WORLD ANALOGY: Like sending an inspector to check a building for code violations.
 *
 * How it works:
 * 1. Launches headless Chromium
 * 2. Visits the submitted URL
 * 3. Finds up to 4 internal links
 * 4. Runs axe-core accessibility checks on each page
 * 5. Combines results into a single report
 */

// Map axe-core impact levels to our severity type
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

    // Launch headless browser
    browser = await chromium.launch({ headless: true });
    console.log(`[Scanner] Chromium launched successfully`);
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 720 },
    });

    context.setDefaultTimeout(15000);
    const page = await context.newPage();

    // Visit the main URL — wait for network to be mostly idle
    console.log(`[Scanner] Navigating to: ${url}`);
    await page.goto(url, { waitUntil: "load", timeout: 30000 });

    // Give the page a moment to finish rendering JS
    await page.waitForTimeout(2000);

    // Collect internal page URLs from the navigation (up to 4)
    const internalUrls = await findInternalLinks(page, url);
    console.log(`[Scanner] Found ${internalUrls.length} internal links`);

    // Run axe-core on the main page
    console.log(`[Scanner] Running axe-core on main page...`);
    const mainViolations = await scanPage(page, url);
    console.log(`[Scanner] Main page: ${mainViolations.length} violation types found`);

    const allViolations = [...mainViolations];

    // Scan additional internal pages (up to 4)
    const pagesToScan = internalUrls.slice(0, 4);
    for (const pageUrl of pagesToScan) {
      try {
        console.log(`[Scanner] Scanning internal page: ${pageUrl}`);
        await page.goto(pageUrl, { waitUntil: "load", timeout: 15000 });
        await page.waitForTimeout(1000);
        const pageViolations = await scanPage(page, pageUrl);
        console.log(`[Scanner] Internal page: ${pageViolations.length} violation types`);
        allViolations.push(...pageViolations);
      } catch (err) {
        console.log(`[Scanner] Skipping page (error): ${pageUrl} - ${err}`);
        continue;
      }
    }

    await browser.close();
    browser = null;

    // Process results
    const issues = countBySeverity(allViolations);
    const totalIssues = issues.critical + issues.serious + issues.moderate + issues.minor;
    const score = calculateScore(issues, totalIssues);
    const examples = pickExamples(allViolations);

    console.log(`[Scanner] Done! Score: ${score}, Total issues: ${totalIssues}`);
    console.log(`[Scanner] Breakdown: C=${issues.critical} S=${issues.serious} M=${issues.moderate} m=${issues.minor}`);

    return {
      url,
      score,
      issues,
      examples,
      pagesScanned: 1 + pagesToScan.length,
      scanDuration: Date.now() - startTime,
    };
  } catch (error) {
    if (browser) await browser.close();
    console.error(`[Scanner] FATAL ERROR:`, error);
    throw error;
  }
}

/**
 * Run axe-core on the current page by injecting the script directly.
 * This is more reliable than the @axe-core/playwright wrapper.
 */
async function scanPage(page: Page, pageUrl: string): Promise<AxeViolation[]> {
  try {
    // Read axe-core source and inject it into the page
    const axeCorePath = path.resolve(
      process.cwd(),
      "node_modules/axe-core/axe.min.js"
    );
    const axeSource = fs.readFileSync(axeCorePath, "utf-8");

    // Inject axe-core
    await page.evaluate(axeSource);

    // Run axe analysis
    const results = await page.evaluate(() => {
      // @ts-expect-error - axe is injected globally
      return window.axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
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
 * Find internal links on the page (same domain, from nav or main content).
 * Returns up to 4 unique URLs.
 */
async function findInternalLinks(page: Page, baseUrl: string): Promise<string[]> {
  try {
    const baseOrigin = new URL(baseUrl).origin;

    const links = await page.evaluate((origin: string) => {
      // Look for links in nav, header, and main areas
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

    // Filter out the base URL
    return links
      .filter((link) => link !== baseUrl && link !== baseUrl + "/")
      .slice(0, 4);
  } catch (error) {
    console.error(`[Scanner] findInternalLinks failed:`, error);
    return [];
  }
}

/**
 * Count violations by severity level.
 */
function countBySeverity(violations: AxeViolation[]) {
  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };

  for (const v of violations) {
    const severity = IMPACT_TO_SEVERITY[v.impact] || "minor";
    counts[severity] += v.nodes.length;
  }

  return counts;
}

/**
 * Calculate accessibility score (0-100).
 * Higher = fewer/less severe issues.
 * Uses a logarithmic curve so scores spread more naturally.
 */
function calculateScore(
  issues: { critical: number; serious: number; moderate: number; minor: number },
  totalIssues: number
): number {
  if (totalIssues === 0) return 100;

  // Weighted penalty — but scaled more gently
  const weightedIssues =
    issues.critical * 4 +
    issues.serious * 2 +
    issues.moderate * 1 +
    issues.minor * 0.5;

  // Use a curve: score drops quickly at first, then levels off
  // 5 weighted issues ≈ 75, 15 ≈ 50, 40 ≈ 25, 80+ ≈ ~5
  const score = Math.round(100 * Math.exp(-weightedIssues / 30));
  return Math.max(5, Math.min(100, score));
}

/**
 * Pick 2-3 of the most impactful violations for the free report.
 */
function pickExamples(violations: AxeViolation[]): ViolationExample[] {
  if (violations.length === 0) return [];

  // Sort by severity (worst first)
  const sorted = [...violations].sort((a, b) => {
    const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
    return (order[a.impact as keyof typeof order] ?? 3) - (order[b.impact as keyof typeof order] ?? 3);
  });

  // Pick up to 3 unique violation types
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

/**
 * Generate a simple fix suggestion based on the violation type.
 */
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
    case "list":
      return "Use proper list markup (<ul>/<ol> with <li> children)";
    case "listitem":
      return "Ensure <li> elements are direct children of <ul> or <ol>";
    case "meta-viewport":
      return '<meta name="viewport" content="width=device-width, initial-scale=1"> (without maximum-scale=1 or user-scalable=no)';
    default:
      return `Fix: see WCAG guidelines for rule "${ruleId}"`;
  }
}

/**
 * Truncate long HTML so it fits in the report.
 */
function truncateHtml(html: string): string {
  if (html.length <= 120) return html;
  return html.slice(0, 117) + "...";
}

// Internal type for processed axe-core violations
interface AxeViolation {
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  id: string;
  nodes: {
    html: string;
    target: string;
    failureSummary: string;
  }[];
}
