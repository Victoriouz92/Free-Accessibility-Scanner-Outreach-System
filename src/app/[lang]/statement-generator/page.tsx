"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

/**
 * Accessibility Statement Generator
 * Free tool — user fills in details, gets a ready-to-publish statement.
 * Attracts organic traffic, builds trust, collects soft leads.
 */

const t = {
  en: {
    heading: "Accessibility Statement Generator",
    subtitle: "Create a free accessibility statement for your website. Required by the European Accessibility Act for most businesses.",
    companyName: "Company name",
    websiteUrl: "Website URL",
    contactEmail: "Accessibility contact email",
    targetStandard: "Target standard",
    lastAudit: "Date of last audit (optional)",
    knownIssues: "Known issues (optional)",
    knownIssuesPlaceholder: "e.g. Some PDF documents are not fully accessible",
    generateButton: "Generate Statement",
    copyButton: "Copy to clipboard",
    editButton: "Edit details",
    nextStepTitle: "Next step: Verify your site",
    nextStepText: "A statement is great, but does your website actually meet the standard?",
    nextStepLink: "Scan your website for free",
    statement: {
      title: "Accessibility Statement",
      committed: (company: string) =>
        `${company} is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.`,
      website: "Website",
      conformanceTitle: "Conformance Standard",
      conformanceText: (standard: string) =>
        `We aim to conform to ${standard} (Web Content Accessibility Guidelines). This standard defines requirements for designers and developers to improve accessibility for people with disabilities.`,
      lastAssessmentTitle: "Last Assessment",
      lastAssessmentText: (date: string) => `Our most recent accessibility assessment was conducted on ${date}.`,
      knownIssuesTitle: "Known Issues",
      knownIssuesIntro: "We are aware of the following accessibility limitations:",
      knownIssuesOutro: "We are actively working to resolve these issues.",
      feedbackTitle: "Feedback",
      feedbackText: (company: string) =>
        `We welcome your feedback on the accessibility of ${company}. If you encounter any barriers, please contact us:`,
      email: "Email",
      responseTime: "We aim to respond to accessibility feedback within 5 business days.",
      lastUpdated: (date: string) => `This statement was last updated on ${date}.`,
      generatedWith: "Generated with AccessCheck (accesscheck.eu)",
    },
  },
  bg: {
    heading: "Генератор на декларация за достъпност",
    subtitle: "Създайте безплатна декларация за достъпност за вашия уебсайт. Изисква се от Европейския акт за достъпност за повечето бизнеси.",
    companyName: "Име на фирмата",
    websiteUrl: "URL адрес на уебсайта",
    contactEmail: "Имейл за контакт относно достъпността",
    targetStandard: "Целеви стандарт",
    lastAudit: "Дата на последен одит (незадължително)",
    knownIssues: "Известни проблеми (незадължително)",
    knownIssuesPlaceholder: "напр. Някои PDF документи не са напълно достъпни",
    generateButton: "Генерирай декларация",
    copyButton: "Копирай в клипборда",
    editButton: "Редактирай данните",
    nextStepTitle: "Следваща стъпка: Проверете сайта си",
    nextStepText: "Декларацията е чудесна, но вашият уебсайт наистина ли отговаря на стандарта?",
    nextStepLink: "Сканирайте уебсайта си безплатно",
    statement: {
      title: "Декларация за достъпност",
      committed: (company: string) =>
        `${company} се ангажира да гарантира цифрова достъпност за хора с увреждания. Ние непрекъснато подобряваме потребителското изживяване за всички и прилагаме съответните стандарти за достъпност.`,
      website: "Уебсайт",
      conformanceTitle: "Стандарт за съответствие",
      conformanceText: (standard: string) =>
        `Стремим се да отговаряме на ${standard} (Насоки за достъпност на уеб съдържанието). Този стандарт определя изискванията за дизайнери и разработчици за подобряване на достъпността за хора с увреждания.`,
      lastAssessmentTitle: "Последна оценка",
      lastAssessmentText: (date: string) => `Последната ни оценка на достъпността беше извършена на ${date}.`,
      knownIssuesTitle: "Известни проблеми",
      knownIssuesIntro: "Наясно сме със следните ограничения по отношение на достъпността:",
      knownIssuesOutro: "Активно работим за отстраняването на тези проблеми.",
      feedbackTitle: "Обратна връзка",
      feedbackText: (company: string) =>
        `Приветстваме вашата обратна връзка относно достъпността на ${company}. Ако срещнете бариери, моля свържете се с нас:`,
      email: "Имейл",
      responseTime: "Стремим се да отговаряме на обратна връзка относно достъпността в рамките на 5 работни дни.",
      lastUpdated: (date: string) => `Тази декларация беше последно актуализирана на ${date}.`,
      generatedWith: "Генерирано с AccessCheck (accesscheck.eu)",
    },
  },
};

export default function StatementGeneratorPage() {
  const params = useParams();
  const lang = params.lang as string;
  const dict = lang === "bg" ? t.bg : t.en;
  const locale = lang === "bg" ? "bg-BG" : "en-US";

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
    const s = dict.statement;

    const statement = `${s.title}

${s.committed(form.companyName)}

${s.website}: ${form.websiteUrl}

${s.conformanceTitle}
${s.conformanceText(form.standard)}

${form.lastAudit ? `${s.lastAssessmentTitle}\n${s.lastAssessmentText(form.lastAudit)}` : ""}

${form.knownIssues ? `${s.knownIssuesTitle}\n${s.knownIssuesIntro}\n${form.knownIssues}\n\n${s.knownIssuesOutro}` : ""}

${s.feedbackTitle}
${s.feedbackText(form.companyName)}

${s.email}: ${form.contactEmail}

${s.responseTime}

${s.lastUpdated(new Date().toLocaleDateString(locale))}

---
${s.generatedWith}`;

    setGenerated(statement);
  }

  function copyStatement() {
    navigator.clipboard.writeText(generated);
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">{dict.heading}</h1>
      <p className="text-muted mb-8">
        {dict.subtitle}
      </p>

      {!generated ? (
        <form onSubmit={generate} className="space-y-5">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium mb-1">{dict.companyName}</label>
            <input id="companyName" name="companyName" type="text" required value={form.companyName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border bg-surface" />
          </div>
          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium mb-1">{dict.websiteUrl}</label>
            <input id="websiteUrl" name="websiteUrl" type="text" required value={form.websiteUrl} onChange={handleChange} placeholder="https://example.com" className="w-full px-4 py-3 rounded-lg border border-border bg-surface" />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">{dict.contactEmail}</label>
            <input id="contactEmail" name="contactEmail" type="email" required value={form.contactEmail} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border bg-surface" />
          </div>
          <div>
            <label htmlFor="standard" className="block text-sm font-medium mb-1">{dict.targetStandard}</label>
            <select id="standard" name="standard" value={form.standard} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border bg-surface">
              <option>WCAG 2.1 AA</option>
              <option>WCAG 2.2 AA</option>
              <option>EN 301 549</option>
            </select>
          </div>
          <div>
            <label htmlFor="lastAudit" className="block text-sm font-medium mb-1">{dict.lastAudit}</label>
            <input id="lastAudit" name="lastAudit" type="date" value={form.lastAudit} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border bg-surface" />
          </div>
          <div>
            <label htmlFor="knownIssues" className="block text-sm font-medium mb-1">{dict.knownIssues}</label>
            <textarea id="knownIssues" name="knownIssues" rows={3} value={form.knownIssues} onChange={handleChange} placeholder={dict.knownIssuesPlaceholder} className="w-full px-4 py-3 rounded-lg border border-border bg-surface resize-y" />
          </div>
          <button type="submit" className="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors">
            {dict.generateButton}
          </button>
        </form>
      ) : (
        <div>
          <div className="bg-surface rounded-xl border border-border p-6 mb-4">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{generated}</pre>
          </div>
          <div className="flex gap-3">
            <button onClick={copyStatement} className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors">
              {dict.copyButton}
            </button>
            <button onClick={() => setGenerated("")} className="px-6 py-3 rounded-lg border border-border font-medium hover:border-primary transition-colors">
              {dict.editButton}
            </button>
          </div>
          <div className="mt-6 bg-primary-light rounded-lg p-4 text-sm">
            <p className="font-semibold mb-1">{dict.nextStepTitle}</p>
            <p className="text-muted">
              {dict.nextStepText}{" "}
              <a href={`/${lang}`} className="text-primary underline">{dict.nextStepLink}</a>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
