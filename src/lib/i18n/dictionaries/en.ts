const en = {
  // Navigation
  nav: {
    home: "AccessCheck",
    privacy: "Privacy Policy",
    imprint: "Imprint",
    skipToContent: "Skip to main content",
  },

  // Landing page
  hero: {
    title: "Is your website accessible?",
    subtitle:
      "The European Accessibility Act takes effect soon. Enter your URL below to find out if your site has issues — free, instant, no signup.",
    placeholder: "Enter your website URL (e.g. example.com)",
    button: "Scan for free",
    buttonLoading: "Starting scan...",
    errorInvalidUrl: "Please enter a valid website URL (e.g. example.com)",
    errorGeneric: "Something went wrong. Please try again.",
  },

  // Trust indicators on landing page
  trust: {
    fast: "Fast",
    fastDesc: "Results in under 30 seconds. We check your homepage plus up to 4 internal pages.",
    private: "Private",
    privateDesc: "We only scan public pages. No data is shared with third parties.",
    actionable: "Actionable",
    actionableDesc: "Get concrete example fixes you can hand to your developer right away.",
  },

  // Scan progress
  scan: {
    title: "Scanning your website...",
    steps: [
      "Connecting to your website...",
      "Checking images and media...",
      "Checking forms and inputs...",
      "Checking color contrast...",
      "Checking navigation and structure...",
      "Generating your report...",
    ],
    errorTitle: "Scan failed",
    tryAgain: "Try again",
  },

  // Report
  report: {
    title: "Your Accessibility Report",
    issuesFound: "Issues found",
    examplesTitle: "Example issues we found on your site",
    before: "Before:",
    fix: "Fix:",
    whyTitle: "Why this matters",
    whyText:
      "The European Accessibility Act (EAA) requires businesses selling products or services online to EU consumers to meet accessibility standards by June 28, 2025. Non-compliance may result in fines and loss of market access.",
    learnMore: "Learn more about the EAA →",
    disclaimer:
      "Disclaimer: This is an automated preliminary assessment, not a legal compliance certification. It does not replace a manual audit or legal advice.",
    // Score labels
    scoreGood: "Good",
    scoreNeedsWork: "Needs work",
    scorePoor: "Poor",
    // Next steps
    fixTitle: "I want this fixed for me",
    fixDesc: "Get in touch and we will fix your accessibility issues. No obligation, free initial consultation.",
    fixButton: "Get help now",
    detailsTitle: "I need the full details",
    detailsDesc: "Get every issue listed with plain-language explanations and fix priorities.",
    detailedReport: "Detailed report — €1",
    fullReport: "Full report + PDF — €3",
  },

  // Severity labels
  severity: {
    critical: "Critical",
    serious: "Serious",
    moderate: "Moderate",
    minor: "Minor",
  },

  // Contact form
  contact: {
    title: "Let's make your website accessible",
    subtitle: "Tell us about your website and timeline. We'll get back to you within one business day with a free initial assessment and quote.",
    nameLabel: "Your name",
    emailLabel: "Work email",
    companyLabel: "Company name",
    messageLabel: "Tell us about your website and timeline",
    consentLabel: "I agree to be contacted about accessibility services. My data will be processed as described in the",
    consentLinkText: "privacy policy",
    submitButton: "Send message",
    submitting: "Sending...",
    successTitle: "Thank you!",
    successText: "We've received your message and will get back to you within one business day.",
    errorText: "Something went wrong. Please try again or email us directly.",
  },

  // Paid report page
  paidReport: {
    unlockTitle: "Unlock your full report",
    unlockDesc: "One-time payment of {price}. No account needed — instant access after payment.",
    payButton: "Pay {price} and unlock",
    stripeNote: "Secure payment via Stripe. Your card details never touch our servers.",
    detailedName: "Detailed Report",
    fullName: "Full Report + PDF",
    features: {
      violations: "Every violation with WCAG criterion",
      explanation: "Plain-language explanation per issue",
      effort: "Estimated fix effort (Quick / Moderate / Complex)",
      selectors: "HTML element selectors for developers",
      pdf: "Downloadable PDF report",
      grouped: "Grouped by affected page",
    },
  },

  // EAA explainer
  eaa: {
    title: "The European Accessibility Act — what you need to know",
    whatTitle: "What is the EAA?",
    whatText:
      "The European Accessibility Act (EAA), implemented in Germany as the Barrierefreiheitsstärkungsgesetz (BFSG), requires that products and services offered to consumers — including websites and online shops — meet specific accessibility standards. This means your website needs to be usable by people with disabilities, including those who use screen readers, keyboard navigation, or have visual impairments.",
    whoTitle: "Who does this affect?",
    whoText:
      "Any business that sells products or services to consumers (B2C) via a website within the EU. This includes online shops, booking platforms, service websites, and digital products. Very small businesses (micro-enterprises with fewer than 10 employees and under €2M annual revenue) may be exempt in some cases, but this varies by member state.",
    deadlineTitle: "What's the deadline?",
    deadlineText:
      "The EAA enforcement date was June 28, 2025. Businesses are expected to already be compliant. National enforcement bodies can issue fines for non-compliance.",
    standardTitle: "What standard do I need to meet?",
    standardText:
      "The technical standard referenced is EN 301 549, which points to WCAG 2.1 Level AA for web content. In practical terms, this means your website needs: proper image descriptions, sufficient color contrast, keyboard navigation, form labels, and more.",
    consequenceTitle: "What happens if I don't comply?",
    consequenceText:
      "Enforcement varies by country. In Germany, the responsible authority can issue warnings, require corrections, and impose fines. Beyond legal risk, inaccessible websites also exclude a significant portion of potential customers.",
    ctaTitle: "Check your website now",
    ctaText: "Our free scanner checks your website against the most common accessibility issues in seconds.",
    ctaButton: "Scan your website for free",
    disclaimerText:
      "Disclaimer: This page provides general information about the European Accessibility Act for educational purposes. It is not legal advice and should not be relied upon as such. Consult a qualified legal professional for advice specific to your situation.",
  },

  // Footer
  footer: {
    rights: "All rights reserved.",
  },
};

export default en;
