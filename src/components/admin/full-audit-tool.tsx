"use client";

import { useState } from "react";

/**
 * FullAuditTool — runs automated "manual" accessibility tests
 */

interface AuditResult {
  test: string;
  status: "pass" | "fail" | "warning";
  details: string;
}

interface AuditResponse {
  url: string;
  results: AuditResult[];
  summary: { passed: number; failed: number; warnings: number; total: number };
}

export function FullAuditTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AuditResponse | null>(null);
  const [error, setError] = useState("");

  async function handleAudit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setData(null);
    setLoading(true);

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) normalizedUrl = "https://" + normalizedUrl;

    try {
      const res = await fetch("/api/admin/full-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Audit failed");
      }

      setData(await res.json());
    } catch (err: any) {
      setError(err.message || "Audit failed");
    } finally {
      setLoading(false);
    }
  }

  const statusIcon = (s: string) => {
    if (s === "pass") return <span className="text-primary font-bold">✓ PASS</span>;
    if (s === "fail") return <span className="text-critical font-bold">✗ FAIL</span>;
    return <span className="text-moderate font-bold">⚠ CHECK</span>;
  };

  return (
    <div>
      <form onSubmit={handleAudit} className="flex gap-3 mb-8">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Website URL to audit (e.g. example.com)"
          className="flex-1 px-4 py-3 rounded-lg border border-border bg-surface"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="px-6 py-3 rounded-lg bg-primary text-white font-semibold
                     hover:bg-primary-hover disabled:opacity-50 transition-colors"
        >
          {loading ? "Running audit..." : "Run full audit"}
        </button>
      </form>

      {error && (
        <div className="bg-critical/8 border border-critical/25 rounded-lg p-4 mb-6 text-critical text-sm">{error}</div>
      )}

      {data && (
        <div>
          {/* Summary */}
          <div className="bg-surface rounded-xl border border-border p-6 mb-6">
            <h3 className="font-semibold mb-3">Summary — {data.url}</h3>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{data.summary.passed}</p>
                <p className="text-xs text-muted">Passed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-critical">{data.summary.failed}</p>
                <p className="text-xs text-muted">Failed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-moderate">{data.summary.warnings}</p>
                <p className="text-xs text-muted">Needs Review</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3">
            {data.results.map((r, i) => (
              <div
                key={i}
                className={`rounded-lg border p-4 ${
                  r.status === "pass" ? "border-primary/25 bg-primary/8" :
                  r.status === "fail" ? "border-critical/25 bg-critical/8" :
                  "border-moderate/25 bg-moderate/8"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">{r.test}</p>
                    <p className="text-xs text-muted mt-1">{r.details}</p>
                  </div>
                  <div className="text-xs whitespace-nowrap">{statusIcon(r.status)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Manual checklist */}
          <div className="mt-8 bg-surface rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-3">Manual checks (requires human review)</h3>
            <div className="space-y-2 text-sm text-muted">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" /> Screen reader reads content in logical order
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" /> Alt text accurately describes images
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" /> PDF documents have proper tags and reading order
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" /> Content is understandable in plain language
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" /> No content flashes more than 3 times per second
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" /> Error messages are clear and descriptive
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
