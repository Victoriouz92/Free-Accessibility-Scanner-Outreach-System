import type { Locale } from "./config";
import enDict from "./dictionaries/en";

/**
 * getDictionary
 *
 * WHAT IT IS: Loads the correct translation file based on the current language.
 * WHY IT EXISTS: Each page calls this to get translated strings.
 *
 * IMPORTANT: Merges with English as fallback — so if a language is missing
 * some keys, the English version shows instead of blank/undefined.
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

/**
 * Deep merge: fills in missing keys from English dictionary
 */
function deepMerge(base: any, override: any): any {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (
      typeof override[key] === "object" &&
      override[key] !== null &&
      !Array.isArray(override[key]) &&
      typeof base[key] === "object"
    ) {
      result[key] = deepMerge(base[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

export async function getDictionary(locale: Locale) {
  const loader = dictionaries[locale] || dictionaries.en;
  const localDict = await loader();

  // If not English, merge with English as fallback for missing keys
  if (locale !== "en") {
    return deepMerge(enDict, localDict);
  }

  return localDict;
}

// Type for the dictionary object (inferred from the English dictionary)
export type Dictionary = typeof enDict;
