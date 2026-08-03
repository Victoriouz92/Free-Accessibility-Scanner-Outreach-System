/**
 * Browserless HTTP API client
 * Uses REST endpoints instead of Playwright WebSocket — works on Vercel serverless.
 */

const BROWSERLESS_URL = "https://chrome.browserless.io";

function getToken() {
  return process.env.BROWSERLESS_TOKEN || "";
}

/**
 * Get page HTML content after JS rendering
 */
export async function getPageContent(url: string): Promise<string> {
  const res = await fetch(`${BROWSERLESS_URL}/content?token=${getToken()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      waitForTimeout: 3000,
      gotoOptions: { waitUntil: "domcontentloaded", timeout: 25000 },
    }),
  });

  if (!res.ok) throw new Error(`Browserless content failed: ${res.status}`);
  return res.text();
}

/**
 * Run a function in the browser and get result
 */
export async function runFunction(url: string, fn: string): Promise<any> {
  const res = await fetch(`${BROWSERLESS_URL}/function?token=${getToken()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: fn,
      context: { url },
    }),
  });

  if (!res.ok) throw new Error(`Browserless function failed: ${res.status}`);
  return res.json();
}

/**
 * Generate PDF from HTML
 */
export async function generatePdf(html: string): Promise<Buffer> {
  const res = await fetch(`${BROWSERLESS_URL}/pdf?token=${getToken()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      html,
      options: {
        format: "A4",
        margin: { top: "40px", bottom: "60px", left: "40px", right: "40px" },
        printBackground: true,
      },
    }),
  });

  if (!res.ok) throw new Error(`Browserless PDF failed: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Run axe-core on a URL via Browserless
 */
export async function runAxeScan(url: string) {
  const axeSource = await getAxeSource();

  const code = `
    module.exports = async ({ page }) => {
      await page.goto("${url}", { waitUntil: "domcontentloaded", timeout: 25000 });
      await page.waitForTimeout(3000);
      await page.evaluate(${JSON.stringify(axeSource)});
      const results = await page.evaluate(() => {
        return window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa", "best-practice"] }
        });
      });
      return { data: results, type: "application/json" };
    };
  `;

  const res = await fetch(`${BROWSERLESS_URL}/function?token=${getToken()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) throw new Error(`Browserless axe scan failed: ${res.status}`);
  return res.json();
}

async function getAxeSource(): Promise<string> {
  // Fetch axe-core from CDN
  const res = await fetch("https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js");
  return res.text();
}
