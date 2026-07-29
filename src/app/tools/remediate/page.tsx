import { RemediationTool } from "@/components/admin/remediation-tool";

/**
 * Remediation Tool Page
 *
 * WHAT IT IS: Internal tool for fixing accessibility issues on client websites.
 * WHY IT EXISTS: When a client says "fix my site", you use this to:
 *   1. Scan their site for all images missing alt text
 *   2. Auto-generate descriptions using AI vision
 *   3. Review/edit the suggestions
 *   4. Export ready-to-apply code
 *
 * NOT PUBLIC — only accessible by you (the service provider).
 */

export default function RemediatePage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Image Remediation Tool</h2>
        <p className="text-muted">
          Enter a client website URL to find all images missing alt text.
          AI will suggest descriptions that you can review and export.
        </p>
      </div>

      <RemediationTool />
    </div>
  );
}
