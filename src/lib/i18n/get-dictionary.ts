import type { Locale } from "./config";

/**
 * getDictionary
 *
 * WHAT IT IS: Loads the correct translation file based on the current language.
 * WHY IT EXISTS: Each page calls this to get translated strings.
 * REAL WORLD ANALOGY: Picking the right phrasebook from a shelf.
 */

const dictionaries = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  de: () => import("./dictionaries/de").then((m) => m.default),
  fr: () => import("./dictionaries/fr").then((m) => m.default),
  es: () => import("./dictionaries/es").then((m) => m.default),
  it: () => import("./dictionaries/it").then((m) => m.default),
  nl: () => import("./dictionaries/nl").then((m) => m.default),
  pl: () => import("./dictionaries/pl").then((m) => m.default),
  pt: () => import("./dictionaries/pt").then((m) => m.default),
  ro: () => import("./dictionaries/ro").then((m) => m.default),
  bg: () => import("./dictionaries/bg").then((m) => m.default),
  gr: () => import("./dictionaries/gr").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  const loader = dictionaries[locale] || dictionaries.en;
  return loader();
}

// Type for the dictionary object (inferred from the English dictionary)
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
