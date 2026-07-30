"use client";

import { SeverityBadge } from "@/components/severity-badge";
import { ScoreDisplay } from "@/components/score-display";
import { CopyButton } from "@/components/copy-button";
import { ShareButton } from "@/components/share-button";
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
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold mb-2">{dict.report.title}</h1>
        <p className="text-muted mb-2">{result.url}</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <CopyButton text={scanId} label="Scan ID:" />
          <ShareButton />
        </div>
        <ScoreDisplay score={result.score} dict={dict.report} />
        {/* Scan metadata */}
        <p className="text-xs text-muted mt-4">
          {result.pagesScanned} pages scanned in {(result.scanDuration / 1000).toFixed(1)}s
          • {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Cached results notice */}
      {cached && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 text-center">
          <p className="text-sm text-yellow-800">
            ⏱️ {dict.report.cachedNotice}
          </p>
        </div>
      )}

      {/* Issue breakdown by severity */}
      <div className="bg-surface rounded-xl border border-border p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">{dict.report.issuesFound}</h2>
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
      </div>

      {/* Example violations with fixes */}
      <div className="bg-surface rounded-xl border border-border p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">{dict.report.examplesTitle}</h2>
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
                  {example.codeBefore}
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3 font-mono overflow-x-auto">
                  <span className="text-primary font-semibold">{dict.report.fix} </span>
                  {example.codeAfter}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal relevance note */}
      <div className="bg-primary-light rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold mb-2">{dict.report.whyTitle}</h2>
        <p className="text-sm">
          {dict.report.whyText}{" "}
          <a href={`/${lang}/eaa-explained`} className="text-primary underline">
            {dict.report.learnMore}
          </a>
        </p>
        <p className="text-xs text-muted mt-2">{dict.report.disclaimer}</p>
      </div>

      {/* Next steps - two clear paths */}
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
    </div>
  );
}
