"use client";

import { useEffect, useState } from "react";
import { ScanReport } from "@/components/scan-report";
import type { ScanResult } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * ScanProgress Component
 * - Polls the scan status API every 2 seconds
 * - Shows progress steps (with aria-live for screen readers)
 * - Switches to the report view when scan completes
 */

interface Props {
  scanId: string;
  lang: string;
  dict: Dictionary;
  cached?: boolean;
}

export function ScanProgress({ scanId, lang, dict, cached }: Props) {
  const [status, setStatus] = useState<"scanning" | "complete" | "error">("scanning");
  const [currentStep, setCurrentStep] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const steps = dict.scan.steps;

  useEffect(() => {
    // Smooth percentage counter — ticks up 1% every ~280ms (reaches ~95% in ~26s)
    const percentInterval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 95) return 95; // Cap at 95% until scan actually completes
        // Slow down slightly as it gets higher (feels natural)
        const increment = prev < 60 ? 1 : prev < 80 ? 0.7 : 0.4;
        return Math.min(95, prev + increment);
      });
    }, 280);

    // Step progression (visual steps below the bar)
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 4000);

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/scan/${scanId}`);
        if (!response.ok) throw new Error("Failed to fetch scan status");

        const data = await response.json();

        if (data.status === "complete") {
          setStatus("complete");
          setResult(data.result);
          setPercentage(100);
          clearInterval(pollInterval);
          clearInterval(stepInterval);
          clearInterval(percentInterval);
        } else if (data.status === "error") {
          setStatus("error");
          setErrorMessage(data.error || "Scan failed");
          clearInterval(pollInterval);
          clearInterval(stepInterval);
          clearInterval(percentInterval);
        }
      } catch {
        // Silently retry
      }
    }, 2000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(pollInterval);
      clearInterval(percentInterval);
    };
  }, [scanId, steps.length]);

  if (status === "error") {
    return (
      <div className="text-center py-12" role="alert">
        <h1 className="text-2xl font-bold mb-4">{dict.scan.errorTitle}</h1>
        <p className="text-muted">{errorMessage}</p>
        <a href={`/${lang}`} className="inline-block mt-6 text-primary underline">
          {dict.scan.tryAgain}
        </a>
      </div>
    );
  }

  if (status === "complete" && result) {
    return <ScanReport result={result} scanId={scanId} lang={lang} dict={dict} cached={cached} />;
  }

  const displayPercentage = Math.round(percentage);

  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold mb-8">{dict.scan.title}</h1>

      {/* Smooth percentage progress bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted" id="progress-label">Progress</span>
          <span className="text-sm font-semibold text-primary" aria-hidden="true">{displayPercentage}%</span>
        </div>
        <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden" role="progressbar" aria-valuenow={displayPercentage} aria-valuemin={0} aria-valuemax={100} aria-label="Scan progress" aria-labelledby="progress-label">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-linear"
            style={{ width: `${displayPercentage}%` }}
          />
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {steps[currentStep]}
      </div>

      <div className="max-w-md mx-auto space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left
              ${index <= currentStep ? "" : "text-muted"}`}
          >
            {index < currentStep ? (
              <span className="text-primary" aria-hidden="true">✓</span>
            ) : index === currentStep ? (
              <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            ) : (
              <span className="inline-block w-4 h-4 rounded-full border-2 border-border" aria-hidden="true" />
            )}
            <span className="text-sm">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
