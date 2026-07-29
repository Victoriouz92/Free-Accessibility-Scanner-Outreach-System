/**
 * Shared TypeScript types for the AccessCheck app
 */

// Severity levels — aligned with axe-core's impact levels
export type Severity = "critical" | "serious" | "moderate" | "minor";

// An example violation shown in the free report
export interface ViolationExample {
  severity: Severity;
  description: string;    // Plain-language explanation of the issue
  codeBefore: string;     // The problematic code from the scanned page
  codeAfter: string;      // Suggested fix
  wcagCriterion?: string; // e.g. "1.1.1 Non-text Content" (shown in paid report)
}

// The full scan result object
export interface ScanResult {
  url: string;
  score: number; // 0-100
  issues: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  examples: ViolationExample[]; // 2-3 examples for the free report
  pagesScanned: number;
  scanDuration: number; // milliseconds
}

// Scan job status (returned by the polling API)
export interface ScanStatus {
  status: "queued" | "scanning" | "complete" | "error";
  result?: ScanResult;
  error?: string;
}

// Contact form submission
export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
  consentGiven: boolean;
  consentTimestamp: string;
  scanId?: string;
}
