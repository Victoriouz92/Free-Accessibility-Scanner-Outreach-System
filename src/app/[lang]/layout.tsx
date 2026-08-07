import type { Metadata } from "next";
import { locales, localeHtmlLang, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LanguageSwitcher } from "@/components/language-switcher";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { VVLabsLogo } from "@/components/vv-labs-logo";

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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://accesscheck.eu";

  return {
    title: `AccessCheck — ${dict.hero.title}`,
    description: dict.hero.subtitle,
    openGraph: {
      title: `AccessCheck — ${dict.hero.title}`,
      description: dict.hero.subtitle,
      url: `${baseUrl}/${lang}`,
      siteName: "AccessCheck",
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `AccessCheck — ${dict.hero.title}`,
      description: dict.hero.subtitle,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
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

      <header className="sticky top-0 z-40 glass px-6 py-3.5">
        <nav
          aria-label="Main navigation"
          className="max-w-5xl mx-auto flex items-center justify-between"
        >
          <a href={`/${lang}`} className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-sm" aria-hidden="true">✓</span>
            {dict.nav.home}
          </a>
          <div className="flex items-center gap-1">
            <a href={`/${lang}/blog`} className="px-3 py-2 text-sm font-medium text-muted hover:text-primary transition-colors hidden sm:inline">
              Blog
            </a>
            <a href={`/${lang}/compare`} className="px-3 py-2 text-sm font-medium text-muted hover:text-primary transition-colors hidden sm:inline">
              Compare
            </a>
            <a href={`/${lang}/statement-generator`} className="px-3 py-2 text-sm font-medium text-muted hover:text-primary transition-colors hidden lg:inline">
              Statement
            </a>
            <DarkModeToggle />
            <LanguageSwitcher currentLang={lang} />
          </div>
        </nav>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border px-6 py-10 text-sm text-muted">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <p>
              &copy; {new Date().getFullYear()} AccessCheck. {dict.footer.rights}
            </p>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
              <a href={`/${lang}/blog`} className="hover:text-primary transition-colors">
                Blog
              </a>
              <a href={`/${lang}/terms`} className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href={`/${lang}/privacy`} className="hover:text-primary transition-colors">
                {dict.nav.privacy}
              </a>
              <a href={`/${lang}/imprint`} className="hover:text-primary transition-colors">
                {dict.nav.imprint}
              </a>
            </nav>
          </div>
          <p className="flex items-center justify-center gap-1.5 text-xs text-center text-muted border-t border-border pt-6">
            <VVLabsLogo className="h-4 w-4" />
            Developed by VV Labs © 2026
          </p>
        </div>
      </footer>
    </>
  );
}
