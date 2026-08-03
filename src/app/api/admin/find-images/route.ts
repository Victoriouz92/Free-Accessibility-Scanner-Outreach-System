import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/find-images
 * Dynamic import of playwright to avoid build failures on serverless.
 */

export async function POST(request: NextRequest) {
  try {
    const { url, singlePage } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    const { chromium } = await import("playwright");
    console.log(`[FindImages] Starting scan for: ${url} (singlePage: ${!!singlePage})`);

    const browser = await chromium.connectOverCDP(
      `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
    );
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      viewport: { width: 1366, height: 768 },
      locale: "bg-BG",
      extraHTTPHeaders: {
        "Accept-Language": "bg-BG,bg;q=0.9,en;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Sec-CH-UA": '"Chromium";v="126", "Google Chrome";v="126"',
        "Sec-CH-UA-Platform": '"Windows"',
      },
    });
    context.setDefaultTimeout(20000);
    const page = await context.newPage();

    // Navigate — use networkidle to wait for full JS rendering
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Check if we got redirected
    const finalUrl = page.url();
    if (finalUrl !== url) {
      console.log(`[FindImages] Redirected from ${url} to ${finalUrl}`);
    }

    await page.waitForTimeout(2000);

    // Find images on the main page
    const mainImages = await findImagesOnPage(page, finalUrl);
    const allImages = [...mainImages];

    // Scan internal pages too (unless single page mode)
    let pagesScanned = 1;
    if (!singlePage) {
      const baseOrigin = new URL(finalUrl).origin;
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

      for (const link of internalLinks) {
        try {
          await page.goto(link, { waitUntil: "load", timeout: 15000 });
          await page.waitForTimeout(1000);
          const pageImages = await findImagesOnPage(page, link);
          allImages.push(...pageImages);
          pagesScanned++;
        } catch {
          continue;
        }
      }
    }

    await browser.close();

    // Deduplicate by src URL
    const unique = deduplicateImages(allImages);

    console.log(`[FindImages] Found ${unique.length} images without alt text across ${pagesScanned} pages`);

    return NextResponse.json({ images: unique, pagesScanned });
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
 * Extracts rich context from surrounding HTML to help generate better descriptions.
 */
async function findImagesOnPage(page: any, pageUrl: string) {
  return page.evaluate((currentUrl: string) => {
    const images = Array.from(document.querySelectorAll("img"));
    const results: any[] = [];

    for (const img of images) {
      const alt = img.getAttribute("alt");
      const src = img.src;
      const rawSrc = img.getAttribute("src") || "";

      if (!src && !rawSrc) continue;
      if (src.endsWith(".svg") || rawSrc.endsWith(".svg")) continue;
      if (img.naturalWidth > 0 && img.naturalWidth < 10 && img.naturalHeight < 10) continue;
      if (img.width < 10 && img.height < 10) continue;

      if (alt === null || alt === undefined) {
        const fullSrc = src;
        const displaySrc = src.startsWith("data:") ? src.slice(0, 50) + "..." : src;

        // Build CSS selector
        let selector = "img";
        if (img.id) {
          selector = `#${img.id}`;
        } else if (img.className && img.className.trim()) {
          selector = `img.${img.className.trim().split(/\s+/).join(".")}`;
        } else if (rawSrc && !rawSrc.startsWith("data:")) {
          selector = `img[src="${rawSrc}"]`;
        } else {
          const parent = img.parentElement;
          if (parent) {
            const siblings = Array.from(parent.querySelectorAll("img"));
            const index = siblings.indexOf(img);
            selector = `img:nth-of-type(${index + 1})`;
          }
        }

        // === RICH CONTEXT EXTRACTION ===

        // 1. Check title attribute on the image itself
        const imgTitle = img.getAttribute("title") || "";

        // 2. Check parent <a> for title, aria-label, or text content
        const parentLink = img.closest("a");
        const linkTitle = parentLink?.getAttribute("title") || "";
        const linkAriaLabel = parentLink?.getAttribute("aria-label") || "";
        const linkText = parentLink?.textContent?.trim().slice(0, 80) || "";

        // 3. Check parent figure/caption
        const figure = img.closest("figure");
        const figcaption = figure?.querySelector("figcaption")?.textContent?.trim() || "";

        // 4. Check nearest sibling/adjacent text
        const nextSibling = img.nextElementSibling;
        const siblingText = nextSibling?.textContent?.trim().slice(0, 80) || "";

        // 5. Get parent container text (broader context)
        const container = img.closest("article, section, li, td, div");
        const containerText = container?.textContent?.trim().slice(0, 120) || "";

        // 6. Check data attributes that might hold useful info
        const dataName = img.getAttribute("data-name") || "";
        const dataTitle = img.getAttribute("data-title") || "";
        const dataCaption = img.getAttribute("data-caption") || "";

        // 7. Check if image is in a known pattern (team logo, avatar, etc.)
        const urlPath = (() => {
          try { return new URL(src).pathname; } catch { return ""; }
        })();

        // Combine all hints into a structured context object
        const hints = {
          imgTitle,
          linkTitle,
          linkAriaLabel,
          linkText,
          figcaption,
          siblingText,
          containerText,
          dataName,
          dataTitle,
          dataCaption,
          urlPath,
          classes: img.className || "",
        };

        results.push({
          src: fullSrc,
          displaySrc,
          currentAlt: null,
          context: JSON.stringify(hints),
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
