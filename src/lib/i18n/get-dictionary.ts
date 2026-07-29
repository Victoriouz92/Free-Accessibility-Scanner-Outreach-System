import type { Locale } from "./config";

/**
 * getDictionary
 *
 * WHAT IT IS: Loads the correct translation file based on the current language.
 * WHY IT EXISTS: Each page calls this to get translated strings instead of hardcoded English.
 * REAL WORLD ANALOGY: Like picking the right phrasebook from a shelf before talking to someone.
 */

const dictionaries = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  bg: () => import("./dictionaries/bg").then((m) => m.default),
  es: () => import("./dictionaries/es").then((m) => m.default),
  gr: () => import("./dictionaries/gr").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  const loader = dictionaries[locale] || dictionaries.en;
  return loader();
}

// Type for the dictionary object (inferred from the English dictionary)
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
