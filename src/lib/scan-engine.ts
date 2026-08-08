import type { ScanResult, ViolationExample, Severity } from "./types";
import { runAxeScan } from "./headless-browser";

/**
 * Scanner Engine — runs real axe-core against a live headless browser page
 * (self-hosted, no third-party scanning API)
 */

const IMPACT_TO_SEVERITY: Record<string, Severity> = {
  critical: "critical", serious: "serious", moderate: "moderate", minor: "minor",
};

export async function runScan(url: string): Promise<ScanResult> {
  const startTime = Date.now();

  // Block localhost
  const parsedUrl = new URL(url);
  if (parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1") {
    throw new Error("Cannot scan localhost");
  }

  console.log(`[Scanner] Starting scan for: ${url}`);

  // Run real axe-core against the live, rendered page
  const axeResults = await runAxeScan(url);
  const violations = axeResults.violations || [];

  console.log(`[Scanner] axe-core found ${violations.length} violation types`);

  // Process violations
  const allViolations: AxeViolation[] = violations.map((v: any) => ({
    impact: v.impact || "minor",
    description: v.description,
    help: v.help,
    helpUrl: v.helpUrl,
    id: v.id,
    nodes: (v.nodes || []).map((n: any) => ({
      html: n.html || "",
      target: Array.isArray(n.target) ? n.target.join(", ") : (n.target || ""),
      failureSummary: n.failureSummary || "",
    })),
  }));

  const issues = countDeduplicated(allViolations);
  const totalIssues = issues.critical + issues.serious + issues.moderate + issues.minor;
  const score = calculateScore(issues, totalIssues);
  const examples = pickExamples(allViolations);

  console.log(`[Scanner] Done! Score: ${score}, Total: ${totalIssues}`);

  return {
    url,
    score,
    issues,
    examples,
    pagesScanned: 1,
    scanDuration: Date.now() - startTime,
  };
}

function countDeduplicated(violations: AxeViolation[]) {
  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  const byRule = new Map<string, { impact: string; totalNodes: number }>();
  for (const v of violations) {
    const existing = byRule.get(v.id);
    if (existing) existing.totalNodes += v.nodes.length;
    else byRule.set(v.id, { impact: v.impact, totalNodes: v.nodes.length });
  }
  for (const [, rule] of byRule) {
    const severity = IMPACT_TO_SEVERITY[rule.impact] || "minor";
    counts[severity] += Math.min(rule.totalNodes, 10);
  }
  return counts;
}

function calculateScore(issues: any, totalIssues: number): number {
  if (!totalIssues || totalIssues === 0) return 100;
  const weighted = (issues.critical || 0) * 4 + (issues.serious || 0) * 2 + (issues.moderate || 0) * 1 + (issues.minor || 0) * 0.5;
  const score = Math.round(100 * Math.exp(-weighted / 30));
  return isNaN(score) ? 50 : Math.max(5, Math.min(100, score));
}

function pickExamples(violations: AxeViolation[]): ViolationExample[] {
  const sorted = [...violations].sort((a, b) => {
    const order: Record<string, number> = { critical: 0, serious: 1, moderate: 2, minor: 3 };
    return (order[a.impact] ?? 3) - (order[b.impact] ?? 3);
  });
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
      codeBefore: (node.html || "").slice(0, 120),
      codeAfter: generateFix(v.id, node.html),
      wcagCriterion: v.helpUrl,
    });
  }
  return examples;
}

function generateFix(ruleId: string, html: string): string {
  const t = (html || "").slice(0, 120);
  switch (ruleId) {
    case "image-alt": return t.replace(/<img/, '<img alt="Descriptive text"');
    case "label": return `<label for="field">Label</label> ${t}`;
    case "color-contrast": return "Increase contrast to at least 4.5:1 ratio";
    case "link-name": return t.replace(/<a/, '<a aria-label="Link purpose"');
    case "button-name": return t.replace(/<button/, '<button aria-label="Action"');
    case "frame-title": return t.replace(/<iframe/, '<iframe title="Content description"');
    case "html-has-lang": return '<html lang="en">';
    default: return `Fix: add proper accessibility attributes for "${ruleId}"`;
  }
}

interface AxeViolation {
  impact: string; description: string; help: string; helpUrl: string; id: string;
  nodes: { html: string; target: string; failureSummary: string }[];
}
