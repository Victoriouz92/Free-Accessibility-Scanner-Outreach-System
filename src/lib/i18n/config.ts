/**
 * i18n Configuration
 *
 * WHAT IT IS: Defines which languages our app supports.
 * WHY IT EXISTS: Single source of truth for languages, used by middleware + all pages.
 * REAL WORLD ANALOGY: A menu board listing which languages are available at a help desk.
 */

export const locales = [
  "en", "de", "fr", "es", "it", "nl", "pl", "pt", "ro", "bg", "gr",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Human-readable names (in their own language) for the dropdown
export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  nl: "Nederlands",
  pl: "Polski",
  pt: "Português",
  ro: "Română",
  bg: "Български",
  gr: "Ελληνικά",
};

// HTML lang attributes (ISO 639-1 codes)
export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  de: "de",
  fr: "fr",
  es: "es",
  it: "it",
  nl: "nl",
  pl: "pl",
  pt: "pt",
  ro: "ro",
  bg: "bg",
  gr: "el", // Greek ISO code is "el", we use "gr" in URLs
};
