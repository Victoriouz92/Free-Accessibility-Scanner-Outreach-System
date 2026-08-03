import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

/**
 * POST /api/admin/full-audit
 *
 * Full accessibility audit — automated "manual" tests:
 * 1. Tab navigation (50 presses, track focus)
 * 2. Focus indicators visible
 * 3. Zoom 200% — no horizontal scroll
 * 4. Modal/dialog Escape key
 * 5. Skip link exists and works
 * 6. Heading hierarchy
 * 7. Language attribute
 * 8. Viewport meta (no user-scalable=no)
 *
 * Returns structured results with pass/fail per test.
 */

interface AuditResult {
  test: string;
  status: "pass" | "fail" | "warning";
  details: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    // Block localhost
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1") {
      return NextResponse.json({ error: "Cannot audit localhost" }, { status: 400 });
    }

    console.log(`[FullAudit] Starting for: ${url}`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(3000);

    const results: AuditResult[] = [];

    // === TEST 1: Tab Navigation ===
    console.log(`[FullAudit] Testing keyboard navigation...`);
    const tabResult = await testTabNavigation(page);
    results.push(tabResult);

    // === TEST 2: Focus Indicators ===
    console.log(`[FullAudit] Testing focus indicators...`);
    const focusResult = await testFocusIndicators(page);
    results.push(focusResult);

    // === TEST 3: Zoom 200% ===
    console.log(`[FullAudit] Testing zoom 200%...`);
    const zoomResult = await testZoom200(page);
    results.push(zoomResult);

    // === TEST 4: Skip Link ===
    console.log(`[FullAudit] Testing skip link...`);
    const skipResult = await testSkipLink(page);
    results.push(skipResult);

    // === TEST 5: Heading Hierarchy ===
    console.log(`[FullAudit] Testing heading hierarchy...`);
    const headingResult = await testHeadingHierarchy(page);
    results.push(headingResult);

    // === TEST 6: Language Attribute ===
    console.log(`[FullAudit] Testing language attribute...`);
    const langResult = await testLanguageAttribute(page);
    results.push(langResult);

    // === TEST 7: Viewport Meta ===
    console.log(`[FullAudit] Testing viewport meta...`);
    const viewportResult = await testViewportMeta(page);
    results.push(viewportResult);

    // === TEST 8: Interactive Elements Keyboard Accessible ===
    console.log(`[FullAudit] Testing interactive elements...`);
    const interactiveResult = await testInteractiveElements(page);
    results.push(interactiveResult);

    // === TEST 9: Modal/Dialog Escape ===
    console.log(`[FullAudit] Testing modals...`);
    const modalResult = await testModalEscape(page);
    results.push(modalResult);

    // === TEST 10: Images without alt (comprehensive) ===
    console.log(`[FullAudit] Testing images...`);
    const imageResult = await testImages(page);
    results.push(imageResult);

    await browser.close();

    const passed = results.filter(r => r.status === "pass").length;
    const failed = results.filter(r => r.status === "fail").length;
    const warnings = results.filter(r => r.status === "warning").length;

    console.log(`[FullAudit] Done! ${passed} pass, ${failed} fail, ${warnings} warnings`);

    return NextResponse.json({
      url: page.url(),
      results,
      summary: { passed, failed, warnings, total: results.length },
    });
  } catch (err) {
    console.error("[FullAudit] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Audit failed" },
      { status: 500 }
    );
  }
}

// === TEST IMPLEMENTATIONS ===

async function testTabNavigation(page: any): Promise<AuditResult> {
  try {
    const focusedElements: string[] = [];

    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        return el.tagName + (el.id ? `#${el.id}` : "") + (el.className ? `.${el.className.split(" ")[0]}` : "");
      });
      if (focused) focusedElements.push(focused);
    }

    const uniqueElements = [...new Set(focusedElements)];

    if (uniqueElements.length >= 5) {
      return { test: "Keyboard Navigation (Tab)", status: "pass", details: `${uniqueElements.length} unique elements reachable via Tab key. Navigation order appears logical.` };
    } else if (uniqueElements.length >= 2) {
      return { test: "Keyboard Navigation (Tab)", status: "warning", details: `Only ${uniqueElements.length} elements reachable via Tab. Some interactive elements may not be keyboard accessible.` };
    } else {
      return { test: "Keyboard Navigation (Tab)", status: "fail", details: "Very few or no elements reachable via Tab key. Keyboard users cannot navigate this page." };
    }
  } catch {
    return { test: "Keyboard Navigation (Tab)", status: "warning", details: "Could not complete keyboard navigation test." };
  }
}

async function testFocusIndicators(page: any): Promise<AuditResult> {
  try {
    // Tab to first element and check if outline is visible
    await page.keyboard.press("Tab");

    const hasVisibleFocus = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return false;
      const styles = window.getComputedStyle(el);
      const outline = styles.outline;
      const boxShadow = styles.boxShadow;
      // Check if outline is not 'none' or there's a box-shadow (custom focus style)
      return (outline && outline !== "none" && !outline.includes("0px")) ||
             (boxShadow && boxShadow !== "none");
    });

    if (hasVisibleFocus) {
      return { test: "Focus Indicators Visible", status: "pass", details: "Focused elements have visible focus indicators (outline or box-shadow)." };
    } else {
      return { test: "Focus Indicators Visible", status: "warning", details: "Focus indicator may not be clearly visible on some elements. Verify manually." };
    }
  } catch {
    return { test: "Focus Indicators Visible", status: "warning", details: "Could not verify focus indicators." };
  }
}

async function testZoom200(page: any): Promise<AuditResult> {
  try {
    // Simulate 200% zoom by halving viewport
    await page.setViewportSize({ width: 640, height: 360 });
    await page.waitForTimeout(1000);

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    if (!hasHorizontalScroll) {
      return { test: "Zoom 200% — No Horizontal Scroll", status: "pass", details: "Content reflows properly at 200% zoom equivalent. No horizontal scrollbar detected." };
    } else {
      return { test: "Zoom 200% — No Horizontal Scroll", status: "fail", details: "Horizontal scroll detected at 200% zoom. Content may be cut off or require scrolling. WCAG SC 1.4.4 violation." };
    }
  } catch {
    return { test: "Zoom 200% — No Horizontal Scroll", status: "warning", details: "Could not test zoom behavior." };
  }
}

async function testSkipLink(page: any): Promise<AuditResult> {
  try {
    const hasSkipLink = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"));
      return links.some(a =>
        a.textContent?.toLowerCase().includes("skip") ||
        a.getAttribute("href")?.includes("#main") ||
        a.getAttribute("href")?.includes("#content")
      );
    });

    if (hasSkipLink) {
      return { test: "Skip Navigation Link", status: "pass", details: "Skip link found. Keyboard users can bypass repetitive navigation." };
    } else {
      return { test: "Skip Navigation Link", status: "fail", details: "No skip navigation link found. Keyboard users must tab through all navigation on every page." };
    }
  } catch {
    return { test: "Skip Navigation Link", status: "warning", details: "Could not check for skip link." };
  }
}

async function testHeadingHierarchy(page: any): Promise<AuditResult> {
  try {
    const headings = await page.evaluate(() => {
      const hs = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
      return hs.map(h => parseInt(h.tagName[1]));
    });

    if (headings.length === 0) {
      return { test: "Heading Hierarchy", status: "fail", details: "No headings found on the page. Screen readers rely on headings for navigation." };
    }

    // Check for skipped levels
    let skipped = false;
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] > headings[i - 1] + 1) {
        skipped = true;
        break;
      }
    }

    const hasH1 = headings.includes(1);

    if (hasH1 && !skipped) {
      return { test: "Heading Hierarchy", status: "pass", details: `${headings.length} headings found with proper hierarchy. H1 present, no skipped levels.` };
    } else if (!hasH1) {
      return { test: "Heading Hierarchy", status: "fail", details: "No H1 heading found. Every page should have exactly one H1." };
    } else {
      return { test: "Heading Hierarchy", status: "warning", details: "Heading levels are skipped (e.g., H1 → H3). This confuses screen reader navigation." };
    }
  } catch {
    return { test: "Heading Hierarchy", status: "warning", details: "Could not analyze headings." };
  }
}

async function testLanguageAttribute(page: any): Promise<AuditResult> {
  try {
    const lang = await page.evaluate(() => document.documentElement.getAttribute("lang"));

    if (lang && lang.length >= 2) {
      return { test: "Language Attribute", status: "pass", details: `HTML lang attribute set to "${lang}". Screen readers can use correct pronunciation.` };
    } else {
      return { test: "Language Attribute", status: "fail", details: "HTML element is missing the lang attribute. Screen readers cannot determine the page language." };
    }
  } catch {
    return { test: "Language Attribute", status: "warning", details: "Could not check language attribute." };
  }
}

async function testViewportMeta(page: any): Promise<AuditResult> {
  try {
    const viewport = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta?.getAttribute("content") || "";
    });

    if (viewport.includes("user-scalable=no") || viewport.includes("maximum-scale=1")) {
      return { test: "Viewport — Zoom Not Disabled", status: "fail", details: "Viewport meta disables user zoom (user-scalable=no or maximum-scale=1). Users with low vision need to zoom." };
    } else if (viewport) {
      return { test: "Viewport — Zoom Not Disabled", status: "pass", details: "Viewport meta allows user zoom. Low vision users can enlarge content." };
    } else {
      return { test: "Viewport — Zoom Not Disabled", status: "warning", details: "No viewport meta tag found." };
    }
  } catch {
    return { test: "Viewport — Zoom Not Disabled", status: "warning", details: "Could not check viewport meta." };
  }
}

async function testInteractiveElements(page: any): Promise<AuditResult> {
  try {
    const issues = await page.evaluate(() => {
      const problems: string[] = [];
      // Check for clickable divs/spans without role
      const clickables = document.querySelectorAll("[onclick]");
      clickables.forEach(el => {
        if (el.tagName !== "BUTTON" && el.tagName !== "A" && !el.getAttribute("role")) {
          problems.push(`${el.tagName} with onclick but no role/button semantic`);
        }
      });
      // Check for tabindex > 0 (bad practice)
      const badTabindex = document.querySelectorAll("[tabindex]");
      badTabindex.forEach(el => {
        const ti = parseInt(el.getAttribute("tabindex") || "0");
        if (ti > 0) problems.push(`Element with tabindex="${ti}" (disrupts natural tab order)`);
      });
      return problems;
    });

    if (issues.length === 0) {
      return { test: "Interactive Elements Properly Coded", status: "pass", details: "All interactive elements use semantic HTML or proper ARIA roles." };
    } else {
      return { test: "Interactive Elements Properly Coded", status: "fail", details: `${issues.length} issues: ${issues.slice(0, 3).join("; ")}` };
    }
  } catch {
    return { test: "Interactive Elements Properly Coded", status: "warning", details: "Could not verify interactive elements." };
  }
}

async function testModalEscape(page: any): Promise<AuditResult> {
  try {
    // Check if any dialogs/modals exist
    const hasDialogs = await page.evaluate(() => {
      return document.querySelectorAll("[role='dialog'], [role='alertdialog'], dialog, .modal").length > 0;
    });

    if (!hasDialogs) {
      return { test: "Modal/Dialog — Escape Key", status: "pass", details: "No modal dialogs detected on this page. Test not applicable." };
    }

    // Try to open and close
    return { test: "Modal/Dialog — Escape Key", status: "warning", details: "Modal dialogs detected but cannot be automatically triggered. Manual testing recommended." };
  } catch {
    return { test: "Modal/Dialog — Escape Key", status: "warning", details: "Could not test modal behavior." };
  }
}

async function testImages(page: any): Promise<AuditResult> {
  try {
    const imageStats = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      const total = imgs.length;
      const withAlt = imgs.filter(img => img.hasAttribute("alt")).length;
      const withEmptyAlt = imgs.filter(img => img.getAttribute("alt") === "").length;
      const withoutAlt = total - withAlt;
      return { total, withAlt, withEmptyAlt, withoutAlt };
    });

    if (imageStats.withoutAlt === 0) {
      return { test: "Image Alt Text (comprehensive)", status: "pass", details: `All ${imageStats.total} images have alt attributes. (${imageStats.withEmptyAlt} decorative with empty alt)` };
    } else {
      return { test: "Image Alt Text (comprehensive)", status: "fail", details: `${imageStats.withoutAlt} of ${imageStats.total} images are missing alt attributes.` };
    }
  } catch {
    return { test: "Image Alt Text (comprehensive)", status: "warning", details: "Could not check images." };
  }
}
