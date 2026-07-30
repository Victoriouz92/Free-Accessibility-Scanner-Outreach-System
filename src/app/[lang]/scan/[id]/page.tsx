import { ScanProgress } from "@/components/scan-progress";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/**
 * Scan Results Page (translated)
 */

interface Props {
  params: Promise<{ lang: string; id: string }>;
  searchParams: Promise<{ cached?: string }>;
}

export default async function ScanPage({ params, searchParams }: Props) {
  const { lang, id } = await params;
  const { cached } = await searchParams;
  const dict = await getDictionary(lang as Locale);

  return (
    <section className="max-w-3xl mx-auto px-6 py-12" aria-label="Scan results">
      <ScanProgress scanId={id} lang={lang} dict={dict} cached={cached === "1"} />
    </section>
  );
}
