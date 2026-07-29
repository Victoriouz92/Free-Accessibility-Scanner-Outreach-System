"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * ContactForm Component (translated)
 */

interface Props {
  lang: string;
  dict: {
    nameLabel: string;
    emailLabel: string;
    companyLabel: string;
    messageLabel: string;
    consentLabel: string;
    consentLinkText: string;
    submitButton: string;
    submitting: string;
    successTitle: string;
    successText: string;
    errorText: string;
  };
}

export function ContactForm({ lang, dict }: Props) {
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scan") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    consent: false,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          scanId,
          consentTimestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-primary-light rounded-xl p-8 text-center" role="alert">
        <h2 className="text-xl font-bold mb-2">{dict.successTitle}</h2>
        <p className="text-muted">{dict.successText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          {dict.nameLabel}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-border bg-surface"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          {dict.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-border bg-surface"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium mb-1">
          {dict.companyLabel}
        </label>
        <input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-border bg-surface"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          {dict.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-border bg-surface resize-y"
        />
      </div>

      {/* Consent checkbox - unchecked by default (GDPR) */}
      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          checked={formData.consent}
          onChange={handleChange}
          className="mt-1 h-5 w-5 rounded border-border"
        />
        <label htmlFor="consent" className="text-sm text-muted">
          {dict.consentLabel}{" "}
          <a href={`/${lang}/privacy`} className="text-primary underline">
            {dict.consentLinkText}
          </a>
          .
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="text-critical text-sm">{dict.errorText}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !formData.consent}
        className="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold
                   hover:bg-primary-hover disabled:opacity-50 transition-colors min-h-[44px]"
      >
        {status === "sending" ? dict.submitting : dict.submitButton}
      </button>
    </form>
  );
}
