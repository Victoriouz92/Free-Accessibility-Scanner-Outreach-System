import { ScanForm } from "@/components/scan-form";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/**
 * Landing Page (translated)
 */

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <section className="max-w-3xl mx-auto px-6 py-16 sm:py-24 text-center">
      {/* Hero */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
        {dict.hero.title}
      </h1>
      <p className="text-lg text-muted mb-10 max-w-xl mx-auto">
        {dict.hero.subtitle}
      </p>

      {/* URL input + scan button */}
      <ScanForm lang={lang} dict={dict.hero} />

      {/* Trust indicators */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
        <div className="bg-surface rounded-xl p-5 border border-border">
          <p className="font-semibold mb-1">⚡ {dict.trust.fast}</p>
          <p className="text-sm text-muted">{dict.trust.fastDesc}</p>
        </div>
        <div className="bg-surface rounded-xl p-5 border border-border">
          <p className="font-semibold mb-1">🔒 {dict.trust.private}</p>
          <p className="text-sm text-muted">{dict.trust.privateDesc}</p>
        </div>
        <div className="bg-surface rounded-xl p-5 border border-border">
          <p className="font-semibold mb-1">✅ {dict.trust.actionable}</p>
          <p className="text-sm text-muted">{dict.trust.actionableDesc}</p>
        </div>
      </div>
    </section>
  );
}
