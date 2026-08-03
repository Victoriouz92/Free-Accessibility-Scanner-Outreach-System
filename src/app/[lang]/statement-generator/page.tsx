"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

/**
 * Accessibility Statement Generator
 * Free tool — user fills in details, gets a ready-to-publish statement.
 * Attracts organic traffic, builds trust, collects soft leads.
 */

export default function StatementGeneratorPage() {
  const params = useParams();
  const lang = params.lang as string;

  const [form, setForm] = useState({
    companyName: "",
    websiteUrl: "",
    contactEmail: "",
    standard: "WCAG 2.1 AA",
    lastAudit: "",
    knownIssues: "",
  });
  const [generated, setGenerated] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function generate(e: React.FormEvent) {
    e.preventDefault();

    const statement = `Accessibility Statement

${form.companyName} is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.

Website: ${form.websiteUrl}

Conformance Standard
We aim to conform to ${form.standard} (Web Content Accessibility Guidelines). This standard defines requirements for designers and developers to improve accessibility for people with disabilities.

${form.lastAudit ? `Last Assessment
Our most recent accessibility assessment was conducted on ${form.lastAudit}.` : ""}

${form.knownIssues ? `Known Issues
We are aware of the following accessibility limitations:
${form.knownIssues}

We are actively working to resolve these issues.` : ""}

Feedback
We welcome your feedback on the accessibility of ${form.companyName}. If you encounter any barriers, please contact us:

Email: ${form.contactEmail}

We aim to respond to accessibility feedback within 5 business days.

This statement was last updated on ${new Date().toLocaleDateString()}.

---
Generated with AccessCheck (accesscheck.eu)`;

    setGenerated(statement);
  }

  function copyStatement() {
    navigator.clipboard.writeText(generated);
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Accessibility Statement Generator</h1>
      <p className="text-muted mb-8">
        Create a free accessibility statement for your website. Required by the European Accessibility Act for most businesses.
      </p>

      {!generated ? (
        <form onSubmit={generate} className="space-y-5">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company name</label>
            <input id="companyName" name="companyName" type="text" required value={form.companyName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border bg-surface" />
          </div>
          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium mb-1">Website URL</label>
            <input id="websiteUrl" name="websiteUrl" type="text" required value={form.websiteUrl} onChange={handleChange} placeholder="https://example.com" className="w-full px-4 py-3 rounded-lg border border-border bg-surface" />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">Accessibility contact email</label>
            <input id="contactEmail" name="contactEmail" type="email" required value={form.contactEmail} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border bg-surface" />
          </div>
          <div>
            <label htmlFor="standard" className="block text-sm font-medium mb-1">Target standard</label>
            <select id="standard" name="standard" value={form.standard} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border bg-surface">
              <option>WCAG 2.1 AA</option>
              <option>WCAG 2.2 AA</option>
              <option>EN 301 549</option>
            </select>
          </div>
          <div>
            <label htmlFor="lastAudit" className="block text-sm font-medium mb-1">Date of last audit (optional)</label>
            <input id="lastAudit" name="lastAudit" type="date" value={form.lastAudit} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border bg-surface" />
          </div>
          <div>
            <label htmlFor="knownIssues" className="block text-sm font-medium mb-1">Known issues (optional)</label>
            <textarea id="knownIssues" name="knownIssues" rows={3} value={form.knownIssues} onChange={handleChange} placeholder="e.g. Some PDF documents are not fully accessible" className="w-full px-4 py-3 rounded-lg border border-border bg-surface resize-y" />
          </div>
          <button type="submit" className="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors">
            Generate Statement
          </button>
        </form>
      ) : (
        <div>
          <div className="bg-surface rounded-xl border border-border p-6 mb-4">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{generated}</pre>
          </div>
          <div className="flex gap-3">
            <button onClick={copyStatement} className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors">
              Copy to clipboard
            </button>
            <button onClick={() => setGenerated("")} className="px-6 py-3 rounded-lg border border-border font-medium hover:border-primary transition-colors">
              Edit details
            </button>
          </div>
          <div className="mt-6 bg-primary-light rounded-lg p-4 text-sm">
            <p className="font-semibold mb-1">Next step: Verify your site</p>
            <p className="text-muted">
              A statement is great, but does your website actually meet the standard?{" "}
              <a href={`/${lang}`} className="text-primary underline">Scan your website for free</a> to find out.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
