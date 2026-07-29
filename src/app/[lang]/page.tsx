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
    <>
      {/* Hero section with gradient background */}
      <section className="hero-gradient py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-5 text-foreground">
            {dict.hero.title}
          </h1>
          <p className="text-lg sm:text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            {dict.hero.subtitle}
          </p>

          {/* URL input + scan button */}
          <ScanForm lang={lang} dict={dict.hero} />
        </div>
      </section>

      {/* Trust indicators */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 relative z-10 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-surface rounded-xl p-6 border border-border card-hover shadow-sm">
            <div className="text-2xl mb-3">⚡</div>
            <p className="font-semibold mb-1">{dict.trust.fast}</p>
            <p className="text-sm text-muted">{dict.trust.fastDesc}</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-border card-hover shadow-sm">
            <div className="text-2xl mb-3">🔒</div>
            <p className="font-semibold mb-1">{dict.trust.private}</p>
            <p className="text-sm text-muted">{dict.trust.privateDesc}</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-border card-hover shadow-sm">
            <div className="text-2xl mb-3">✅</div>
            <p className="font-semibold mb-1">{dict.trust.actionable}</p>
            <p className="text-sm text-muted">{dict.trust.actionableDesc}</p>
          </div>
        </div>
      </section>
    </>
  );
}
