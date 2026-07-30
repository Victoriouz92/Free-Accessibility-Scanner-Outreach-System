"use client";

import { useState } from "react";

/**
 * ShareButton Component
 *
 * WHAT IT IS: A button that copies the current page URL to the clipboard.
 * WHY IT EXISTS: Lets users share their scan report URL with others.
 * REAL WORLD ANALOGY: The "share" button on social media posts.
 */

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label={copied ? "Link copied to clipboard" : "Copy report URL to clipboard"}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                 border border-border bg-surface hover:bg-primary-light hover:border-primary
                 text-muted hover:text-primary transition-colors cursor-pointer"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Link copied!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share report</span>
        </>
      )}
    </button>
  );
}
