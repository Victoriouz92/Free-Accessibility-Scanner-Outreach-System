import { FullAuditTool } from "@/components/admin/full-audit-tool";

/**
 * Full Accessibility Audit Page
 */
export default function AuditPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Full Accessibility Audit</h2>
        <p className="text-muted">
          Automated &quot;manual&quot; tests — keyboard navigation, zoom, focus indicators,
          skip links, and more. Generates a comprehensive report you can deliver to clients.
        </p>
      </div>
      <FullAuditTool />
    </div>
  );
}
