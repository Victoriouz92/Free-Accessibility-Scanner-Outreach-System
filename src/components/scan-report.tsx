"use client";

import { SeverityBadge } from "@/components/severity-badge";
import { ScoreDisplay } from "@/components/score-display";
import { CopyButton } from "@/components/copy-button";
import { ShareButton } from "@/components/share-button";
import { LinkedInShareButton } from "@/components/linkedin-share";
import type { ScanResult } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * ScanReport Component (Free Short Report - translated)
 */

interface Props {
  result: ScanResult;
  scanId: string;
  lang: string;
  dict: Dictionary;
  cached?: boolean;
}

export function ScanReport({ result, scanId, lang, dict, cached }: Props) {
  return (
    <div>
      {/* Score + Summary */}
      <section className="text-center mb-10" aria-labelledby="report-title">
        <h1 id="report-title" className="text-2xl font-bold mb-2">{dict.report.title}</h1>
        <p className="text-muted mb-2">{result.url}</p>
        <div className="flex items-center justify-center flex-wrap gap-2 mb-4">
          <CopyButton text={scanId} label="Scan ID:" />
          <ShareButton />
          <LinkedInShareButton score={result.score} url={result.url} />
          {/* PDF download - all tiers (temp: no paywall for testing) */}
          <div className="relative group">
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
                         bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm"
              aria-label="Download PDF report"
              aria-haspopup="true"
            >
              <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF ▾
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-surface border border-border rounded-lg shadow-lg py-1 w-52 z-50">
              <a href={`/api/report-pdf?scanId=${scanId}&tier=free`} className="block px-4 py-2 text-sm hover:bg-primary-light">Free Summary</a>
              <a href={`/api/report-pdf?scanId=${scanId}&tier=detailed`} className="block px-4 py-2 text-sm hover:bg-primary-light">Detailed Report (€1)</a>
              <a href={`/api/report-pdf?scanId=${scanId}&tier=full`} className="block px-4 py-2 text-sm hover:bg-primary-light">Full + Developer (€3)</a>
            </div>
          </div>
        </div>
        <ScoreDisplay score={result.score} dict={dict.report} />
        {/* Scan metadata */}
        <p className="text-xs text-muted mt-4">
          {result.pagesScanned} pages scanned in {(result.scanDuration / 1000).toFixed(1)}s
          • {new Date().toLocaleDateString()}
        </p>
      </section>

      {/* Cached results notice with re-scan option */}
      {cached && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 text-center" role="note">
          <p className="text-sm text-yellow-800 mb-2">
            <span aria-hidden="true">⏱️</span> {dict.report.cachedNotice}
          </p>
          <button
            onClick={async () => {
              const res = await fetch("/api/scan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: result.url, nocache: true }),
              });
              const data = await res.json();
              if (data.scanId) {
                window.location.href = `/${lang}/scan/${data.scanId}`;
              }
            }}
            className="text-xs font-medium text-primary underline hover:text-primary-hover"
          >
            Force new scan <span aria-hidden="true">→</span>
          </button>
        </div>
      )}

      {/* Issue breakdown by severity */}
      <section className="bg-surface rounded-xl border border-border p-6 mb-8" aria-labelledby="issues-heading">
        <h2 id="issues-heading" className="text-lg font-semibold mb-4">{dict.report.issuesFound}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <SeverityBadge severity="critical" label={dict.severity.critical} />
            <p className="text-2xl font-bold mt-1">{result.issues.critical}</p>
          </div>
          <div className="text-center">
            <SeverityBadge severity="serious" label={dict.severity.serious} />
            <p className="text-2xl font-bold mt-1">{result.issues.serious}</p>
          </div>
          <div className="text-center">
            <SeverityBadge severity="moderate" label={dict.severity.moderate} />
            <p className="text-2xl font-bold mt-1">{result.issues.moderate}</p>
          </div>
          <div className="text-center">
            <SeverityBadge severity="minor" label={dict.severity.minor} />
            <p className="text-2xl font-bold mt-1">{result.issues.minor}</p>
          </div>
        </div>
      </section>

      {/* Example violations with fixes */}
      <section className="bg-surface rounded-xl border border-border p-6 mb-8" aria-labelledby="examples-heading">
        <h2 id="examples-heading" className="text-lg font-semibold mb-4">{dict.report.examplesTitle}</h2>
        <div className="space-y-6">
          {result.examples.map((example, index) => (
            <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <div className="flex items-start gap-2 mb-2">
                <SeverityBadge severity={example.severity} label={dict.severity[example.severity]} />
                <p className="font-medium">{example.description}</p>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="bg-red-50 border border-red-200 rounded p-3 font-mono overflow-x-auto">
                  <span className="text-critical font-semibold">{dict.report.before} </span>
                  <code>{example.codeBefore}</code>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3 font-mono overflow-x-auto">
                  <span className="text-primary font-semibold">{dict.report.fix} </span>
                  <code>{example.codeAfter}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Legal relevance note */}
      <section className="bg-primary-light rounded-xl p-6 mb-10" aria-labelledby="why-heading">
        <h2 id="why-heading" className="text-lg font-semibold mb-2">{dict.report.whyTitle}</h2>
        <p className="text-sm">
          {dict.report.whyText}{" "}
          <a href={`/${lang}/eaa-explained`} className="text-primary underline">
            {dict.report.learnMore}
          </a>
        </p>
        <p className="text-xs text-muted mt-2">{dict.report.disclaimer}</p>
      </section>

      {/* Next steps - two clear paths */}
      <section aria-labelledby="next-steps-heading">
        <h2 id="next-steps-heading" className="sr-only">Next steps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Path 1: Contact form */}
          <div className="bg-surface rounded-xl border-2 border-primary p-6">
            <h3 className="font-bold text-lg mb-2">{dict.report.fixTitle}</h3>
            <p className="text-sm text-muted mb-4">{dict.report.fixDesc}</p>
            <a
              href={`/${lang}/contact?scan=${scanId}`}
              className="inline-block w-full text-center px-6 py-3 rounded-lg bg-primary text-white
                         font-semibold hover:bg-primary-hover transition-colors min-h-[44px]"
            >
              {dict.report.fixButton}
            </a>
          </div>

          {/* Path 2: Paid reports */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="font-bold text-lg mb-2">{dict.report.detailsTitle}</h3>
            <p className="text-sm text-muted mb-4">{dict.report.detailsDesc}</p>
            <div className="space-y-2">
              <a
                href={`/${lang}/report/${scanId}?tier=detailed`}
                className="block w-full text-center px-6 py-2 rounded-lg border border-primary
                           text-primary font-semibold hover:bg-primary-light transition-colors min-h-[44px]"
              >
                {dict.report.detailedReport}
              </a>
              <a
                href={`/${lang}/report/${scanId}?tier=full`}
                className="block w-full text-center px-6 py-2 rounded-lg border border-border
                           text-foreground font-medium hover:border-primary transition-colors min-h-[44px]"
              >
                {dict.report.fullReport}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What we check vs what needs manual review */}
      <section className="mt-12 bg-surface rounded-xl border border-border p-6" aria-labelledby="coverage-heading">
        <h2 id="coverage-heading" className="text-lg font-semibold mb-4">What our scanner checks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm"><span className="text-primary" aria-hidden="true">✓</span> Color contrast (WCAG AA 4.5:1)</div>
          <div className="flex items-center gap-2 text-sm"><span className="text-primary" aria-hidden="true">✓</span> Image alt text</div>
          <div className="flex items-center gap-2 text-sm"><span className="text-primary" aria-hidden="true">✓</span> Form labels and inputs</div>
          <div className="flex items-center gap-2 text-sm"><span className="text-primary" aria-hidden="true">✓</span> Button and link names</div>
          <div className="flex items-center gap-2 text-sm"><span className="text-primary" aria-hidden="true">✓</span> Keyboard navigation structure</div>
          <div className="flex items-center gap-2 text-sm"><span className="text-primary" aria-hidden="true">✓</span> ARIA attributes and roles</div>
          <div className="flex items-center gap-2 text-sm"><span className="text-primary" aria-hidden="true">✓</span> Heading hierarchy</div>
          <div className="flex items-center gap-2 text-sm"><span className="text-primary" aria-hidden="true">✓</span> Landmark regions</div>
          <div className="flex items-center gap-2 text-sm"><span className="text-primary" aria-hidden="true">✓</span> Language attribute</div>
          <div className="flex items-center gap-2 text-sm"><span className="text-primary" aria-hidden="true">✓</span> Flashing/blinking content</div>
        </div>

        <h3 className="text-sm font-semibold mb-3 text-muted">Requires expert manual review:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted"><span aria-hidden="true">○</span> Behavior at 200% browser zoom</div>
          <div className="flex items-center gap-2 text-sm text-muted"><span aria-hidden="true">○</span> Real screen reader experience</div>
          <div className="flex items-center gap-2 text-sm text-muted"><span aria-hidden="true">○</span> PDF document accessibility</div>
          <div className="flex items-center gap-2 text-sm text-muted"><span aria-hidden="true">○</span> Complex widget interaction (modals, datepickers)</div>
          <div className="flex items-center gap-2 text-sm text-muted"><span aria-hidden="true">○</span> Content readability and plain language</div>
          <div className="flex items-center gap-2 text-sm text-muted"><span aria-hidden="true">○</span> Meaningful alt text accuracy</div>
        </div>

        <div className="bg-primary-light rounded-lg p-4">
          <p className="text-sm">
            <strong>Our automated scan covers ~80% of detectable accessibility issues.</strong>{" "}
            For full EAA/WCAG compliance certification, a manual expert audit is recommended.{" "}
            <a href={`/${lang}/contact`} className="text-primary underline font-medium">Request a full audit →</a>
          </p>
        </div>
      </section>
    </div>
  );
}
