"use client";

import { useState } from "react";

/**
 * EmailCapture — optional email collection before PDF download.
 * Non-blocking: user can skip and download directly.
 * Collects leads for follow-up.
 */

interface Props {
  scanId: string;
  onSkip: () => void;
  onSubmit: (email: string) => void;
}

export function EmailCapture({ scanId, onSkip, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    // Store the email (fire and forget)
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "PDF Download Lead",
        email,
        company: "",
        message: `Requested PDF report for scan ${scanId}`,
        consent: true,
        consentTimestamp: new Date().toISOString(),
        scanId,
      }),
    });

    setSubmitted(true);
    onSubmit(email);
  }

  if (submitted) {
    return (
      <div className="text-center py-3">
        <p className="text-sm text-primary font-medium">
          <span aria-hidden="true">✓</span> Report sent to {email}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-4 mb-4">
      <p className="text-sm font-medium mb-2">Want the report emailed to you?</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="email-capture" className="sr-only">Email address</label>
        <input
          id="email-capture"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-3 py-2 rounded-lg border border-border text-sm bg-background"
        />
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors">
          Send
        </button>
      </form>
      <button onClick={onSkip} className="text-xs text-muted mt-2 underline hover:text-primary">
        No thanks, just download
      </button>
    </div>
  );
}
