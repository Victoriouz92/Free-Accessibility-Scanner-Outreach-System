"use client";

import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";

/**
 * LanguageSwitcher Component
 *
 * WHAT IT IS: A dropdown/button group that lets users switch between languages.
 * WHY IT EXISTS: Users need to pick their preferred language from the header.
 * REAL WORLD ANALOGY: Those little flag buttons you see on hotel websites.
 */

interface Props {
  currentLang: string;
}

export function LanguageSwitcher({ currentLang }: Props) {
  const pathname = usePathname();

  // Replace the current lang prefix with the new one
  function getLocalizedPath(newLang: string) {
    // pathname is like "/en/contact" — replace first segment
    const segments = pathname.split("/");
    segments[1] = newLang;
    return segments.join("/");
  }

  return (
    <nav aria-label="Language selection" className="flex gap-1">
      {locales.map((locale) => (
        <a
          key={locale}
          href={getLocalizedPath(locale)}
          lang={locale === "gr" ? "el" : locale}
          aria-current={locale === currentLang ? "page" : undefined}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors min-h-[44px] min-w-[44px]
                      flex items-center justify-center
            ${
              locale === currentLang
                ? "bg-primary text-white"
                : "text-muted hover:text-primary hover:bg-primary-light"
            }`}
        >
          {getShortLabel(locale)}
        </a>
      ))}
    </nav>
  );
}

// Short labels for the buttons (2-3 chars)
function getShortLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: "EN",
    bg: "BG",
    es: "ES",
    gr: "GR",
  };
  return labels[locale];
}
