import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/**
 * Imprint Page
 */

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ImprintPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const isBg = lang === "bg";

  return (
    <section className="max-w-3xl mx-auto px-6 py-12" aria-labelledby="imprint-heading">
      <h1 id="imprint-heading" className="text-2xl font-bold mb-6">{dict.nav.imprint}</h1>

      <div className="bg-surface rounded-xl border border-border p-6 text-sm text-muted space-y-4">
        {isBg ? (
          <>
            <p>VV Labs</p>
            <p>ул. „Казбек“ 30<br />София, 1618<br />България</p>
            <p>Имейл: vvlabseood@gmail.com</p>
            <p>Телефон: +359 886 000 469</p>
            <p>Продуктов разработчик: Виктор Велев</p>
          </>
        ) : (
          <>
            <p>VV Labs</p>
            <p>Kazbek 30 Str.<br />Sofia, 1618<br />Bulgaria</p>
            <p>Email: vvlabseood@gmail.com</p>
            <p>Phone: +359886000469</p>
            <p>Product Developer: Victor Velev</p>
          </>
        )}
      </div>

      <p className="mt-6 text-sm text-muted italic border-t border-border pt-6">
        {isBg
          ? "VV Labs е независим софтуерен проект, изграждащ практични AI инструменти за бизнеса."
          : "VV Labs is an independent software project building practical AI-powered tools for businesses."}
      </p>
    </section>
  );
}
