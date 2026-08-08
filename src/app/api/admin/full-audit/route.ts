import { NextRequest, NextResponse } from "next/server";
import { getPageContent } from "@/lib/headless-browser";

interface AuditResult { test: string; status: "pass" | "fail" | "warning"; details: string; }

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === "localhost") return NextResponse.json({ error: "Cannot audit localhost" }, { status: 400 });

    const html = await getPageContent(url);
    const results: AuditResult[] = [];

    results.push({ test: "Language Attribute", status: /lang\s*=\s*["'][a-z]{2}/i.test(html) ? "pass" : "fail", details: /lang\s*=\s*["'][a-z]{2}/i.test(html) ? "HTML lang attribute found" : "Missing lang attribute on <html>" });
    results.push({ test: "Skip Navigation Link", status: /skip|#main/i.test(html) ? "pass" : "fail", details: /skip|#main/i.test(html) ? "Skip link detected" : "No skip navigation link found" });
    results.push({ test: "H1 Heading Present", status: /<h1/i.test(html) ? "pass" : "fail", details: /<h1/i.test(html) ? "H1 heading found" : "No H1 heading — page needs a main title" });
    results.push({ test: "Viewport Allows Zoom", status: /user-scalable\s*=\s*no/i.test(html) ? "fail" : "pass", details: /user-scalable\s*=\s*no/i.test(html) ? "Zoom disabled (user-scalable=no)" : "Users can zoom the page" });
    
    const missingAlt = (html.match(/<img(?![^>]*alt\s*=)/gi) || []).length;
    results.push({ test: "Images Have Alt Text", status: missingAlt === 0 ? "pass" : "fail", details: missingAlt === 0 ? "All images have alt attributes" : `${missingAlt} images missing alt text` });
    
    results.push({ test: "Main Landmark", status: /<main/i.test(html) ? "pass" : "fail", details: /<main/i.test(html) ? "<main> landmark found" : "No <main> element — content lacks landmark structure" });
    results.push({ test: "Form Labels", status: /<input(?![^>]*type\s*=\s*["']hidden)/i.test(html) && !/<label/i.test(html) ? "fail" : "pass", details: "Checking if visible inputs have associated labels" });

    const passed = results.filter(r => r.status === "pass").length;
    const failed = results.filter(r => r.status === "fail").length;

    return NextResponse.json({ url, results, summary: { passed, failed, warnings: 0, total: results.length } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Audit failed" }, { status: 500 });
  }
}
