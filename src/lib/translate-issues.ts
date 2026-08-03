/**
 * Translates technical accessibility violations into business-friendly language.
 *
 * Developer view: shows code, selectors, WCAG refs
 * Business Owner view: shows plain language impact, no code
 */

import type { ViolationExample } from "./types";

export interface OwnerFriendlyIssue {
  severity: string;
  title: string;
  impact: string;
  whoIsAffected: string;
  businessRisk: string;
  fixEffort: string;
}

/**
 * Translate a technical violation into business owner language
 */
export function translateForOwner(example: ViolationExample): OwnerFriendlyIssue {
  const description = example.description.toLowerCase();

  // Map common rule descriptions to owner-friendly explanations
  if (description.includes("alt") && description.includes("image")) {
    return {
      severity: example.severity,
      title: "Images cannot be understood by visually impaired visitors",
      impact: "Blind users relying on screen readers hear 'image' without any description. They miss critical content and cannot interact with image-based buttons.",
      whoIsAffected: "Blind users, low-vision users, users with slow internet (images don't load)",
      businessRisk: "Potential EAA fine + loss of ~15% of potential customers who use assistive technology",
      fixEffort: "Quick fix (1-2 hours)",
    };
  }

  if (description.includes("contrast") || description.includes("color")) {
    return {
      severity: example.severity,
      title: "Some text is too hard to read",
      impact: "Text doesn't stand out enough from the background. Users with low vision, elderly users, or anyone in bright sunlight cannot read your content comfortably.",
      whoIsAffected: "Low-vision users, elderly, everyone using phones outdoors",
      businessRisk: "Higher bounce rate, lost conversions, EAA non-compliance",
      fixEffort: "Quick fix (under 1 hour)",
    };
  }

  if (description.includes("label") || description.includes("form")) {
    return {
      severity: example.severity,
      title: "Form fields cannot be identified by screen readers",
      impact: "When a visitor using a screen reader reaches your form, they hear 'text input' without knowing what to type — is it email? Phone? Name? They cannot complete your form.",
      whoIsAffected: "Blind users, motor-impaired users using voice control",
      businessRisk: "Lost leads, abandoned forms, direct EAA violation",
      fixEffort: "Quick fix (1-2 hours)",
    };
  }

  if (description.includes("keyboard") || description.includes("focus") || description.includes("tab")) {
    return {
      severity: example.severity,
      title: "Some parts of your site cannot be used without a mouse",
      impact: "Users who cannot use a mouse (motor disabilities, broken arm, power users) are unable to navigate parts of your website or complete key actions.",
      whoIsAffected: "Motor-impaired users, keyboard-only users, power users",
      businessRisk: "Blocked conversions, legal risk under EAA",
      fixEffort: "Moderate effort (2-4 hours)",
    };
  }

  if (description.includes("heading") || description.includes("hierarchy")) {
    return {
      severity: example.severity,
      title: "Page structure is confusing for screen reader users",
      impact: "Screen readers use headings like a table of contents. When the structure is broken, blind users cannot navigate or find information efficiently.",
      whoIsAffected: "Blind users, search engines (affects SEO too)",
      businessRisk: "Poor user experience, lower SEO rankings, EAA non-compliance",
      fixEffort: "Quick fix (under 1 hour)",
    };
  }

  if (description.includes("link") || description.includes("button")) {
    return {
      severity: example.severity,
      title: "Some links or buttons have unclear purpose",
      impact: "Screen readers announce links/buttons by their text. If the text is vague ('click here') or missing, users don't know where the link leads or what the button does.",
      whoIsAffected: "Blind users, cognitive disability users",
      businessRisk: "Confusion, reduced engagement, accessibility violation",
      fixEffort: "Quick fix (under 1 hour)",
    };
  }

  if (description.includes("frame") || description.includes("iframe")) {
    return {
      severity: example.severity,
      title: "Embedded content (iframes) has no description",
      impact: "Screen readers announce embedded content without context. Users don't know if it's an ad, a video, a map, or a form — they may skip important content.",
      whoIsAffected: "Blind users, screen reader users",
      businessRisk: "EAA non-compliance, poor user experience",
      fixEffort: "Quick fix (add title attribute)",
    };
  }

  if (description.includes("aria")) {
    return {
      severity: example.severity,
      title: "Assistive technology receives incorrect information",
      impact: "Your site sends wrong signals to screen readers, causing confusion. Users may think a button is a link, or miss interactive elements entirely.",
      whoIsAffected: "All assistive technology users",
      businessRisk: "Unreliable experience for disabled users, EAA violation",
      fixEffort: "Moderate effort (requires developer)",
    };
  }

  // Generic fallback
  return {
    severity: example.severity,
    title: "Accessibility barrier detected",
    impact: `An issue was found that prevents some users from fully using your website: ${example.description}`,
    whoIsAffected: "Users with disabilities, elderly users, mobile users",
    businessRisk: "Potential EAA fine, loss of customers",
    fixEffort: "Varies — contact us for assessment",
  };
}
