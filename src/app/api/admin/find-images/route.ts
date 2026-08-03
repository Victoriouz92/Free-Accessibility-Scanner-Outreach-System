import { NextRequest, NextResponse } from "next/server";
import { getPageContent } from "@/lib/browserless";

export async function POST(request: NextRequest) {
  try {
    const { url, singlePage } = await request.json();
    if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

    // Get rendered HTML via Browserless
    const html = await getPageContent(url);

    // Parse images without alt from the HTML (simple regex approach for serverless)
    const imgRegex = /<img[^>]*>/gi;
    const images: any[] = [];
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
      const tag = match[0];
      // Skip if has alt attribute
      if (/alt\s*=/i.test(tag)) continue;
      // Skip SVGs
      if (/\.svg/i.test(tag)) continue;

      // Extract src
      const srcMatch = tag.match(/src\s*=\s*["']([^"']+)["']/i);
      if (!srcMatch) continue;
      const src = srcMatch[1];
      if (src.startsWith("data:") && src.length < 100) continue; // skip tiny data URIs

      images.push({
        src,
        displaySrc: src.startsWith("data:") ? src.slice(0, 50) + "..." : src,
        currentAlt: null,
        context: "",
        selector: `img[src="${src.slice(0, 80)}"]`,
        pageUrl: url,
      });
    }

    // Deduplicate
    const unique = images.filter((img, i, arr) => arr.findIndex(x => x.src === img.src) === i);

    return NextResponse.json({ images: unique, pagesScanned: 1 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Scan failed" }, { status: 500 });
  }
}
