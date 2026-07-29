/**
 * i18n Configuration
 *
 * WHAT IT IS: Defines which languages our app supports.
 * WHY IT EXISTS: Single source of truth for languages, used by middleware + all pages.
 * REAL WORLD ANALOGY: A menu board listing which languages are available at a help desk.
 */

export const locales = ["en", "bg", "es", "gr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Human-readable names for the language switcher
export const localeNames: Record<Locale, string> = {
  en: "English",
  bg: "Български",
  es: "Español",
  gr: "Ελληνικά",
};

// HTML lang attributes (ISO 639-1 codes)
export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  bg: "bg",
  es: "es",
  gr: "el", // Greek ISO code is "el", even though we use "gr" in URLs
};
