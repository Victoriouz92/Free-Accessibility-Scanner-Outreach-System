"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ScanForm Component
 * - Single URL input + submit button
 * - Validates the URL before submitting
 * - Redirects to /[lang]/scan/[id] to show progress
 */

interface Props {
  lang: string;
  dict: {
    placeholder: string;
    button: string;
    buttonLoading: string;
    errorInvalidUrl: string;
    errorGeneric: string;
  };
}

export function ScanForm({ lang, dict }: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Basic URL validation
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      setError(dict.errorInvalidUrl);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      if (!response.ok) throw new Error("Failed to start scan");

      const data = await response.json();
      router.push(`/${lang}/scan/${data.scanId}`);
    } catch {
      setError(dict.errorGeneric);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="url-input" className="sr-only">
          Website URL
        </label>
        <input
          id="url-input"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={dict.placeholder}
          className="flex-1 px-4 py-3 rounded-lg border border-border bg-surface text-base
                     placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
          aria-describedby={error ? "url-error" : undefined}
          aria-invalid={error ? "true" : undefined}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="px-6 py-3 rounded-lg bg-primary text-white font-semibold text-base
                     hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors min-h-[44px]"
        >
          {loading ? dict.buttonLoading : dict.button}
        </button>
      </div>

      {error && (
        <p id="url-error" role="alert" className="text-critical text-sm mt-2 text-left">
          {error}
        </p>
      )}
    </form>
  );
}
