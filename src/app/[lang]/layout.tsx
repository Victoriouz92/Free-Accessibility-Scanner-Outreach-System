import type { Metadata } from "next";
import { locales, localeHtmlLang, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LanguageSwitcher } from "@/components/language-switcher";

/**
 * Language-aware Layout
 *
 * WHAT IT IS: Adds translated header, footer, and navigation around page content.
 * WHY IT EXISTS: Every page needs translated nav and correct HTML lang attribute.
 *
 * Note: Does NOT render <html>/<body> — the root layout handles that.
 * Instead it sets the lang attribute via metadata and wraps content.
 */

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return {
    title: `AccessCheck — ${dict.hero.title}`,
    description: dict.hero.subtitle,
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      {/* Skip link */}
      <a href="#main-content" className="skip-link">
        {dict.nav.skipToContent}
      </a>

      <header className="border-b border-border px-6 py-4">
        <nav
          aria-label="Main navigation"
          className="max-w-5xl mx-auto flex items-center justify-between"
        >
          <a href={`/${lang}`} className="text-xl font-bold text-primary">
            {dict.nav.home}
          </a>
          <LanguageSwitcher currentLang={lang} />
        </nav>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border px-6 py-8 text-sm text-muted">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between gap-4">
          <p>
            &copy; {new Date().getFullYear()} AccessCheck. {dict.footer.rights}
          </p>
          <nav aria-label="Footer navigation" className="flex gap-4">
            <a href={`/${lang}/privacy`} className="hover:text-primary underline">
              {dict.nav.privacy}
            </a>
            <a href={`/${lang}/imprint`} className="hover:text-primary underline">
              {dict.nav.imprint}
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
