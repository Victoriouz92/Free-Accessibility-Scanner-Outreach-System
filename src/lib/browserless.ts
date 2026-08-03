/**
 * Browserless HTTP API client (Free plan compatible)
 * Uses /content endpoint to get rendered HTML, then analyzes locally.
 */

const BROWSERLESS_URL = "https://chrome.browserless.io";

function getToken() {
  return process.env.BROWSERLESS_TOKEN || "";
}

/**
 * Get fully rendered page HTML via Browserless /content endpoint
 */
export async function getPageContent(url: string): Promise<string> {
  console.log(`[Browserless] getPageContent called for: ${url} — THIS IS THE NEW CODE`);
  const res = await fetch(`${BROWSERLESS_URL}/content?token=${getToken()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      gotoOptions: { waitUntil: "domcontentloaded", timeout: 20000 },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Browserless failed (${res.status}): ${text.slice(0, 100)}`);
  }
  return res.text();
}

/**
 * Generate PDF from HTML via Browserless /pdf endpoint
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

  if (!res.ok) throw new Error(`PDF generation failed: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Simple HTML-based accessibility analysis (no axe-core, works serverless)
 * Checks the rendered HTML for common WCAG violations.
 */
export function analyzeHtml(html: string, url: string) {
  const violations: any[] = [];

  // 1. Images without alt
  const imgsWithoutAlt = html.match(/<img(?![^>]*alt\s*=)[^>]*>/gi) || [];
  if (imgsWithoutAlt.length > 0) {
    violations.push({
      impact: "critical",
      id: "image-alt",
      description: "Ensures <img> elements have alternate text or a role of none or presentation",
      help: "Images must have alternative text",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.10/image-alt",
      nodes: imgsWithoutAlt.slice(0, 10).map(h => ({ html: h.slice(0, 120), target: "img", failureSummary: "Missing alt attribute" })),
    });
  }

  // 2. Missing lang attribute
  if (!/< html[^>]*lang\s*=/i.test(html)) {
    violations.push({
      impact: "serious",
      id: "html-has-lang",
      description: "Ensures every HTML document has a lang attribute",
      help: "HTML element must have a lang attribute",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.10/html-has-lang",
      nodes: [{ html: "<html>", target: "html", failureSummary: "Missing lang attribute" }],
    });
  }

  // 3. Missing document title
  if (!/<title[^>]*>[^<]+<\/title>/i.test(html)) {
    violations.push({
      impact: "serious",
      id: "document-title",
      description: "Ensures each HTML document contains a non-empty <title> element",
      help: "Documents must have a <title> element",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.10/document-title",
      nodes: [{ html: "<head>", target: "head", failureSummary: "Missing or empty title" }],
    });
  }

  // 4. Inputs without labels
  const inputsRegex = /<input(?![^>]*type\s*=\s*["']hidden["'])[^>]*>/gi;
  const inputs = html.match(inputsRegex) || [];
  const labels = html.match(/<label/gi) || [];
  if (inputs.length > labels.length) {
    const missing = inputs.length - labels.length;
    violations.push({
      impact: "critical",
      id: "label",
      description: "Ensures every form element has a label",
      help: "Form elements must have labels",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.10/label",
      nodes: inputs.slice(0, missing).map(h => ({ html: h.slice(0, 120), target: "input", failureSummary: "No associated label" })),
    });
  }

  // 5. Empty links
  const emptyLinks = html.match(/<a[^>]*>\s*<\/a>/gi) || [];
  if (emptyLinks.length > 0) {
    violations.push({
      impact: "serious",
      id: "link-name",
      description: "Ensures links have discernible text",
      help: "Links must have discernible text",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.10/link-name",
      nodes: emptyLinks.slice(0, 5).map(h => ({ html: h.slice(0, 120), target: "a", failureSummary: "Empty link text" })),
    });
  }

  // 6. Empty buttons  
  const emptyButtons = html.match(/<button[^>]*>\s*<\/button>/gi) || [];
  if (emptyButtons.length > 0) {
    violations.push({
      impact: "serious",
      id: "button-name",
      description: "Ensures buttons have discernible text",
      help: "Buttons must have discernible text",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.10/button-name",
      nodes: emptyButtons.slice(0, 5).map(h => ({ html: h.slice(0, 120), target: "button", failureSummary: "Empty button" })),
    });
  }

  // 7. Iframes without title
  const iframesNoTitle = html.match(/<iframe(?![^>]*title\s*=)[^>]*>/gi) || [];
  if (iframesNoTitle.length > 0) {
    violations.push({
      impact: "serious",
      id: "frame-title",
      description: "Ensures <iframe> elements have an accessible name",
      help: "Frames must have an accessible name",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.10/frame-title",
      nodes: iframesNoTitle.slice(0, 5).map(h => ({ html: h.slice(0, 120), target: "iframe", failureSummary: "Missing title" })),
    });
  }

  // 8. No main landmark
  if (!/<main/i.test(html)) {
    violations.push({
      impact: "moderate",
      id: "landmark-one-main",
      description: "Ensures the document has a main landmark",
      help: "Document should have one main landmark",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.10/landmark-one-main",
      nodes: [{ html: "<body>", target: "body", failureSummary: "No <main> element" }],
    });
  }

  // 9. No h1
  if (!/<h1/i.test(html)) {
    violations.push({
      impact: "moderate",
      id: "page-has-heading-one",
      description: "Ensures the page has at least one h1 heading",
      help: "Page should contain a level-one heading",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.10/page-has-heading-one",
      nodes: [{ html: "<body>", target: "body", failureSummary: "No h1 heading" }],
    });
  }

  return { violations };
}
