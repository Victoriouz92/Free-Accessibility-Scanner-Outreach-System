"use client";

import { useState } from "react";

/**
 * ViewToggle — Developer vs Business Owner view selector
 *
 * Changes how the report displays issues:
 * - Developer: code snippets, selectors, WCAG criteria
 * - Business Owner: plain language, business risk, no code
 */

export type ViewMode = "developer" | "owner";

interface Props {
  onChange: (mode: ViewMode) => void;
  defaultMode?: ViewMode;
}

export function ViewToggle({ onChange, defaultMode = "owner" }: Props) {
  const [mode, setMode] = useState<ViewMode>(defaultMode);

  function handleChange(newMode: ViewMode) {
    setMode(newMode);
    onChange(newMode);
  }

  return (
    <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-lg p-1 mb-6" role="radiogroup" aria-label="Report view mode">
      <button
        role="radio"
        aria-checked={mode === "owner"}
        onClick={() => handleChange("owner")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          mode === "owner"
            ? "bg-white text-foreground shadow-sm"
            : "text-muted hover:text-foreground"
        }`}
      >
        <span aria-hidden="true">👔</span> Business Owner
      </button>
      <button
        role="radio"
        aria-checked={mode === "developer"}
        onClick={() => handleChange("developer")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          mode === "developer"
            ? "bg-white text-foreground shadow-sm"
            : "text-muted hover:text-foreground"
        }`}
      >
        <span aria-hidden="true">💻</span> Developer
      </button>
    </div>
  );
}
