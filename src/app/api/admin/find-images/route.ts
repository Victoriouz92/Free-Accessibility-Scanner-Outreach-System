import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

/**
 * POST /api/admin/find-images
 *
 * WHAT IT IS: Scans a website and finds ALL images that are missing alt text.
 * WHY IT EXISTS: First step of the remediation workflow — discover the problems.
 *
 * Returns: array of { src, currentAlt, context, selector, pageUrl }
 */

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    console.log(`[FindImages] Starting scan for: ${url}`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 720 },
    });
    context.setDefaultTimeout(15000);
    const page = await context.newPage();

    // Visit main page
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(2000);

    // Find images on the main page
    const mainImages = await findImagesOnPage(page, url);

    // Find internal links and scan them too
    const baseOrigin = new URL(url).origin;
    const internalLinks = await page.evaluate((origin: string) => {
      const anchors = Array.from(document.querySelectorAll("a[href]"));
      const urls: string[] = [];
      for (const a of anchors) {
        const href = (a as HTMLAnchorElement).href;
        if (href.startsWith(origin) && !href.includes("#") && !href.match(/\.(pdf|jpg|png|gif|svg|zip)$/i)) {
          urls.push(href);
        }
      }
      return [...new Set(urls)].slice(0, 5);
    }, baseOrigin);

    // Scan internal pages (up to 5)
    const allImages = [...mainImages];
    for (const link of internalLinks) {
      try {
        await page.goto(link, { waitUntil: "load", timeout: 15000 });
        await page.waitForTimeout(1000);
        const pageImages = await findImagesOnPage(page, link);
        allImages.push(...pageImages);
      } catch {
        continue;
      }
    }

    await browser.close();

    // Deduplicate by src URL
    const unique = deduplicateImages(allImages);

    console.log(`[FindImages] Found ${unique.length} images without alt text across ${1 + internalLinks.length} pages`);

    return NextResponse.json({ images: unique, pagesScanned: 1 + internalLinks.length });
  } catch (err) {
    console.error("[FindImages] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Scan failed" },
      { status: 500 }
    );
  }
}

/**
 * Find all images on the current page that are missing meaningful alt text.
 */
async function findImagesOnPage(page: any, pageUrl: string) {
  return page.evaluate((currentUrl: string) => {
    const images = Array.from(document.querySelectorAll("img"));
    const results: any[] = [];

    for (const img of images) {
      const alt = img.getAttribute("alt");
      const src = img.src;

      // Skip tiny images (likely icons/spacers), data URIs, and SVGs
      if (!src || src.startsWith("data:") || src.endsWith(".svg")) continue;
      if (img.width < 30 && img.height < 30) continue;

      // Missing alt or empty alt on non-decorative image
      if (alt === null || alt === undefined) {
        // Build a CSS selector for this image
        let selector = "img";
        if (img.id) selector = `#${img.id}`;
        else if (img.className) selector = `img.${img.className.split(" ").join(".")}`;
        else selector = `img[src="${img.getAttribute("src")}"]`;

        // Get some context (parent element's text)
        const parent = img.closest("figure, article, section, div");
        const contextText = parent?.textContent?.trim().slice(0, 100) || "";

        results.push({
          src,
          currentAlt: null,
          context: contextText,
          selector,
          pageUrl: currentUrl,
        });
      }
    }

    return results;
  }, pageUrl);
}

/**
 * Remove duplicate images (same src appearing on multiple pages).
 */
function deduplicateImages(images: any[]) {
  const seen = new Set<string>();
  return images.filter((img) => {
    if (seen.has(img.src)) return false;
    seen.add(img.src);
    return true;
  });
}
