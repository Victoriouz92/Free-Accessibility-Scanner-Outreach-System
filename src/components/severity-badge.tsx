import type { Severity } from "@/lib/types";

/**
 * SeverityBadge Component (translated label)
 * - Shows severity level with icon + text + color
 * - Never relies on color alone (WCAG requirement)
 */

const SEVERITY_ICONS: Record<Severity, string> = {
  critical: "🔴",
  serious: "🟠",
  moderate: "🟡",
  minor: "⚪",
};

const SEVERITY_CLASSES: Record<Severity, string> = {
  critical: "text-critical",
  serious: "text-serious",
  moderate: "text-moderate",
  minor: "text-minor",
};

interface Props {
  severity: Severity;
  label: string; // Translated label passed from parent
}

export function SeverityBadge({ severity, label }: Props) {
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${SEVERITY_CLASSES[severity]}`}>
      <span aria-hidden="true">{SEVERITY_ICONS[severity]}</span>
      <span>{label}</span>
    </span>
  );
}
