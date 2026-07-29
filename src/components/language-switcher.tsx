"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";

/**
 * LanguageSwitcher Component
 *
 * WHAT IT IS: A dropdown menu that lets users switch between 11 languages.
 * WHY IT EXISTS: Too many languages for buttons — a dropdown keeps the header clean.
 * REAL WORLD ANALOGY: The language selector on airline booking sites.
 */

interface Props {
  currentLang: string;
}

export function LanguageSwitcher({ currentLang }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function getLocalizedPath(newLang: string) {
    const segments = pathname.split("/");
    segments[1] = newLang;
    return segments.join("/");
  }

  const currentName = localeNames[currentLang as Locale] || "English";

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium
                   text-muted hover:text-primary hover:bg-primary-light transition-colors
                   min-h-[44px]"
      >
        <span className="hidden sm:inline">{currentName}</span>
        <span className="sm:hidden">{currentLang.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Available languages"
          className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border
                     rounded-xl shadow-lg py-1 z-50 max-h-80 overflow-y-auto"
        >
          {locales.map((locale) => (
            <li key={locale} role="option" aria-selected={locale === currentLang}>
              <a
                href={getLocalizedPath(locale)}
                lang={locale === "gr" ? "el" : locale}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-sm transition-colors
                  ${locale === currentLang
                    ? "bg-primary-light text-primary font-medium"
                    : "text-foreground hover:bg-primary-light hover:text-primary"
                  }`}
              >
                {localeNames[locale]}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
