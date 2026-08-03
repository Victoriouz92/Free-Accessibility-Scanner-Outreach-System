import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url, singlePage } = await request.json();
    if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

    const { chromium } = await import("playwright");
    const bro = await chromium.connectOverCDP(`wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`);
    const context = await bro.newContext({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0", viewport: { width: 1366, height: 768 } });
    context.setDefaultTimeout(20000);
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    const finalUrl = page.url();
    await page.waitForTimeout(2000);

    const mainImages = await findImages(page, finalUrl);
    const allImages = [...mainImages];
    let pagesScanned = 1;

    if (!singlePage) {
      const baseOrigin = new URL(finalUrl).origin;
      const links: string[] = await page.evaluate((origin: string) => {
        return [...new Set(Array.from(document.querySelectorAll("a[href]")).map(a => (a as HTMLAnchorElement).href).filter(h => h.startsWith(origin) && !h.includes("#") && !h.match(/\.(pdf|jpg|png|gif|svg|zip)$/i)))].slice(0, 5);
      }, baseOrigin);
      for (const link of links) {
        try {
          await page.goto(link, { waitUntil: "load", timeout: 15000 });
          await page.waitForTimeout(1000);
          allImages.push(...await findImages(page, link));
          pagesScanned++;
        } catch { continue; }
      }
    }

    await bro.close();
    const unique = allImages.filter((img, i, arr) => arr.findIndex(x => x.src === img.src) === i);
    return NextResponse.json({ images: unique, pagesScanned });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Scan failed" }, { status: 500 });
  }
}

async function findImages(page: any, pageUrl: string) {
  return page.evaluate((currentUrl: string) => {
    return Array.from(document.querySelectorAll("img")).filter(img => {
      const alt = img.getAttribute("alt");
      const src = img.src;
      if (!src || src.endsWith(".svg")) return false;
      if (img.width < 10 && img.height < 10) return false;
      return alt === null || alt === undefined;
    }).map(img => ({
      src: img.src,
      displaySrc: img.src.startsWith("data:") ? img.src.slice(0, 50) + "..." : img.src,
      currentAlt: null,
      context: JSON.stringify({ linkText: img.closest("a")?.textContent?.trim().slice(0, 80) || "", imgTitle: img.getAttribute("title") || "" }),
      selector: img.id ? `#${img.id}` : `img[src="${img.getAttribute("src")}"]`,
      pageUrl: currentUrl,
    }));
  }, pageUrl);
}
