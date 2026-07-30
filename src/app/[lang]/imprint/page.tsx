import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/**
 * Imprint Page (placeholder - translated header)
 */

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ImprintPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <section className="max-w-3xl mx-auto px-6 py-12" aria-labelledby="imprint-heading">
      <h1 id="imprint-heading" className="text-2xl font-bold mb-6">{dict.nav.imprint}</h1>

      <div className="bg-surface rounded-xl border border-border p-6 text-sm text-muted space-y-4">
        <p>[Company Name]</p>
        <p>[Street Address]<br />[City, Postal Code]<br />[Country]</p>
        <p>Email: [contact@example.com]</p>
        <p>Phone: [+...]</p>
        <p>Managing Director: [Name]</p>
        <p>VAT ID: [...]</p>
      </div>
    </section>
  );
}
