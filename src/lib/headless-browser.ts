import type { Browser, Page } from "playwright-core";

/**
 * Headless Browser — self-hosted, no third-party subscription
 *
 * Runs on a normal persistent container (Railway/Render/a VPS), not
 * serverless — so we just use Playwright's own managed Chromium directly.
 * No slim-binary workaround needed; the Dockerfile installs it once at
 * build time and it's reused warm across every request.
 */

async function launchBrowser(): Promise<Browser> {
  const { chromium } = await import("playwright-core");
  return chromium.launch({ headless: true });
}

async function withPage<T>(url: string, fn: (page: Page) => Promise<T>): Promise<T> {
  const browser = await launchBrowser();
  try {
    // @axe-core/playwright requires a page from an explicit context — the
    // browser.newPage() shorthand's implicit context isn't enough and fails
    // with "Please use browser.newContext()".
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
      return await fn(page);
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

/**
 * Get fully rendered page HTML (used by the admin regex-based tools)
 */
export async function getPageContent(url: string): Promise<string> {
  return withPage(url, (page) => page.content());
}

/**
 * Run a real axe-core accessibility scan against the live, rendered page.
 * Returns the same shape axe-core normally returns: { violations: [...] }
 */
export async function runAxeScan(url: string): Promise<{ violations: any[] }> {
  return withPage(url, async (page) => {
    const { AxeBuilder } = await import("@axe-core/playwright");
    const results = await new AxeBuilder({ page }).analyze();
    return { violations: results.violations };
  });
}

/**
 * Generate a PDF from an HTML string (report PDFs)
 */
export async function generatePdf(html: string): Promise<Buffer> {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      margin: { top: "40px", bottom: "60px", left: "40px", right: "40px" },
      printBackground: true,
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
