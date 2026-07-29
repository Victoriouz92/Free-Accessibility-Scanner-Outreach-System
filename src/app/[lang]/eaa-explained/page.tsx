import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/**
 * EAA Explainer Page (translated)
 */

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function EaaExplainedPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">{dict.eaa.title}</h1>

      <div className="space-y-8 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold mb-2">{dict.eaa.whatTitle}</h2>
          <p className="text-muted">{dict.eaa.whatText}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">{dict.eaa.whoTitle}</h2>
          <p className="text-muted">{dict.eaa.whoText}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">{dict.eaa.deadlineTitle}</h2>
          <p className="text-muted">{dict.eaa.deadlineText}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">{dict.eaa.standardTitle}</h2>
          <p className="text-muted">{dict.eaa.standardText}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">{dict.eaa.consequenceTitle}</h2>
          <p className="text-muted">{dict.eaa.consequenceText}</p>
        </div>

        {/* CTA */}
        <div className="bg-primary-light rounded-xl p-6 mt-8">
          <h2 className="text-lg font-semibold mb-2">{dict.eaa.ctaTitle}</h2>
          <p className="text-muted mb-4">{dict.eaa.ctaText}</p>
          <a
            href={`/${lang}`}
            className="inline-block px-6 py-3 rounded-lg bg-primary text-white font-semibold
                       hover:bg-primary-hover transition-colors"
          >
            {dict.eaa.ctaButton}
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted border-t border-border pt-4">
          {dict.eaa.disclaimerText}
        </p>
      </div>
    </section>
  );
}
