"use client";

import { useState } from "react";

/**
 * CopyButton Component
 *
 * WHAT IT IS: A text element that copies its value to clipboard when clicked.
 * WHY IT EXISTS: Modern UX for copying scan IDs, URLs, code snippets.
 * REAL WORLD ANALOGY: The little copy icon you see next to API keys or tracking numbers.
 */

interface Props {
  text: string;
  label?: string;
}

export function CopyButton({ text, label }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : `Copy ${label || ""} ${text}`}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono
                 bg-gray-100 text-muted hover:bg-primary-light hover:text-primary
                 transition-colors cursor-pointer group"
    >
      {label && <span className="text-xs font-sans font-medium text-muted">{label}</span>}
      <span className="truncate max-w-[180px]">{text}</span>
      {copied ? (
        <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}
