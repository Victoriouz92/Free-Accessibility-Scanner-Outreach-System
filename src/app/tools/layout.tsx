/**
 * Admin Layout
 *
 * WHAT IT IS: Wrapper for all admin/internal pages.
 * WHY IT EXISTS: Separates internal tools from the public-facing scanner.
 * 
 * TODO: Add real authentication (for now, admin pages are just unlinked)
 */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <nav className="flex items-center justify-between mb-8 pb-4 border-b border-border">
        <h1 className="text-xl font-bold text-primary">AccessCheck Admin</h1>
        <a href="/" className="text-sm text-muted hover:text-primary underline">
          ← Back to public site
        </a>
      </nav>
      {children}
    </div>
  );
}
