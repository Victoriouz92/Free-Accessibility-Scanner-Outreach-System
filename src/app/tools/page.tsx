/**
 * Admin Dashboard
 *
 * WHAT IT IS: Landing page for internal tools.
 * WHY IT EXISTS: Central hub for your remediation service workflow.
 */

export default function AdminPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tools</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Image Remediation Tool */}
        <a
          href="/tools/remediate"
          className="bg-surface rounded-xl border border-border p-6 hover:border-primary
                     transition-colors group"
        >
          <p className="text-2xl mb-2">🖼️</p>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary">
            Image Remediation
          </h3>
          <p className="text-sm text-muted">
            Find images without alt text on a client site. Generate AI
            descriptions and export ready-to-apply code.
          </p>
        </a>

        {/* Full Audit Tool */}
        <a
          href="/tools/audit"
          className="bg-surface rounded-xl border border-border p-6 hover:border-primary
                     transition-colors group"
        >
          <p className="text-2xl mb-2">🔍</p>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary">
            Full Accessibility Audit
          </h3>
          <p className="text-sm text-muted">
            Automated manual tests — keyboard nav, zoom, focus, skip links.
            Generate comprehensive audit report for clients.
          </p>
        </a>

        {/* Contact Submissions (future) */}
        <div className="bg-surface rounded-xl border border-border p-6 opacity-50">
          <p className="text-2xl mb-2">📬</p>
          <h3 className="font-bold text-lg mb-1">Contact Submissions</h3>
          <p className="text-sm text-muted">
            View and manage incoming contact form submissions. Coming soon.
          </p>
        </div>

        {/* Scan History (future) */}
        <div className="bg-surface rounded-xl border border-border p-6 opacity-50">
          <p className="text-2xl mb-2">📊</p>
          <h3 className="font-bold text-lg mb-1">Scan History</h3>
          <p className="text-sm text-muted">
            Browse all scans, view results, identify prospects. Coming soon.
          </p>
        </div>

        {/* Outreach Drafts (future - Part B) */}
        <div className="bg-surface rounded-xl border border-border p-6 opacity-50">
          <p className="text-2xl mb-2">✉️</p>
          <h3 className="font-bold text-lg mb-1">Outreach Drafts</h3>
          <p className="text-sm text-muted">
            Generate personalized outreach messages from scan results. Coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
