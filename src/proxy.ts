import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./lib/i18n/config";

/**
 * Middleware
 *
 * WHAT IT IS: Code that runs before every page request.
 * WHY IT EXISTS: Redirects users to their preferred language URL (e.g. /en/, /bg/)
 *               if they visit a path without a language prefix.
 * REAL WORLD ANALOGY: A receptionist who greets you and directs you to the right
 *                     language desk based on what you speak.
 */

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the URL already has a valid locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // No locale in URL — detect preferred language from browser
  const acceptLanguage = request.headers.get("Accept-Language") || "";
  const detectedLocale = detectLocale(acceptLanguage);

  // Redirect to the detected locale
  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;
  return NextResponse.redirect(url);
}

/**
 * Detect the best locale from the Accept-Language header.
 * Falls back to English if no match is found.
 */
function detectLocale(acceptLanguage: string): string {
  // Map browser language codes to our locale keys
  const langMap: Record<string, string> = {
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
    el: "gr", // Greek browser code "el" maps to our "gr" URL prefix
    gr: "gr",
  };

  // Parse Accept-Language header (e.g. "bg,en-US;q=0.9,en;q=0.8")
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, quality] = lang.trim().split(";q=");
      return {
        code: code.split("-")[0].toLowerCase(), // "en-US" → "en"
        quality: quality ? parseFloat(quality) : 1,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find the first matching locale
  for (const lang of languages) {
    if (langMap[lang.code]) {
      return langMap[lang.code];
    }
  }

  return defaultLocale;
}

export const config = {
  // Match all paths except static files and API
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
