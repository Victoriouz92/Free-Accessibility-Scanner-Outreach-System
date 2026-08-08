const en = {
  // Navigation
  nav: {
    home: "AccessCheck",
    blog: "Blog",
    compare: "Compare",
    statement: "Statement",
    terms: "Terms",
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

  // How it works section
  howItWorks: {
    title: "How it works",
    step1Title: "Enter your URL",
    step1Desc: "Paste your website address above. No signup required.",
    step2Title: "We scan your site",
    step2Desc: "Our scanner checks up to 5 pages against WCAG 2.1 AA criteria in seconds.",
    step3Title: "Get actionable results",
    step3Desc: "See exactly what to fix, with code examples you can hand to your developer.",
  },

  // Who needs this section
  whoNeeds: {
    title: "Who needs this?",
    description: "The European Accessibility Act (EAA) — known in Germany as the BFSG — requires any business selling online to EU consumers to meet accessibility standards. Enforcement is already active since June 2025.",
    shops: "Online shops",
    shopsDesc: "E-commerce sites selling to EU customers",
    services: "Service websites",
    servicesDesc: "Booking platforms, SaaS, digital services",
    banking: "Banking & finance",
    bankingDesc: "Online banking, payment services",
    digital: "Digital products",
    digitalDesc: "Apps, streaming, e-books, ticketing",
  },

  // Social proof
  social: {
    title: "Trusted by businesses across Europe",
    scans: "Scans completed",
    languages: "Languages supported",
    standard: "Standard we test against",
  },

  // Before/After example
  beforeAfter: {
    title: "See what we find",
    subtitle: "Here's a real example of an accessibility issue and its fix:",
    bad: "Inaccessible:",
    good: "Accessible:",
    explanation: "Missing alt text is the #1 accessibility issue. Screen readers need it to describe images to blind users.",
  },

  // What happens next (after contact)
  whatHappens: {
    title: "What happens after you contact us?",
    step1Title: "Contact us",
    step1Desc: "Fill in the contact form or email us. We reply within 1 business day.",
    step2Title: "Get a quote",
    step2Desc: "We send you a clear proposal with scope, price, and timeline — no hidden fees.",
    step3Title: "We fix the issues",
    step3Desc: "Our team resolves all found violations. You get a complete, accessible website.",
    step4Title: "Confirmation",
    step4Desc: "We rescan and send you a before & after report as proof.",
  },

  // Reviews
  reviews: {
    title: "What our clients say",
    review1: "We didn't know our site had so many issues. AccessCheck helped us find and fix them in days.",
    review1Author: "Maria K.",
    review1Role: "Manager, online store",
    review2: "Professional service, fast communication. Now we're confident we meet the requirements.",
    review2Author: "George P.",
    review2Role: "CTO, fintech startup",
    review3: "The scanner is free and shows specific problems with fix examples. Recommended.",
    review3Author: "Ana D.",
    review3Role: "Marketing manager",
  },

  // Proof section (our own score)
  proof: {
    title: "This is what your website should look like",
    subtitle: "Our own website scores 100/100 on accessibility. But the reality for most websites is very different.",
    scoreLabel: "AccessCheck.eu score",
    description: "Every image has alt text. Every form has labels. Every interactive element is keyboard-accessible. Colors meet contrast requirements. Structure follows semantic HTML. This is the standard the European Accessibility Act requires.",
    noIssues: "0 critical issues • 0 serious issues • Full WCAG 2.1 AA compliance",
    realityTitle: "But here is the reality...",
    stat1: "of websites have accessibility errors",
    stat2: "average errors per homepage",
    stat3: "of the world population has a disability",
    source: "Source: WebAIM Million Report 2024 — analysis of 1,000,000 homepages. Most common issues: missing alt text, low contrast, missing form labels.",
    cta: "Check your website now — it takes 30 seconds",
  },

  // Final CTA
  finalCta: {
    title: "Ready to check your website?",
    subtitle: "Free, instant, no signup. Find out if your site meets EU accessibility requirements.",
    button: "Scan your website now →",
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
    cachedNotice: "These results are from a recent scan. New results will be available in 24 hours.",
    viewToggleDev: "Developer",
    viewToggleOwner: "Business Owner",
    // Statement generator CTA
    statementTitle: "Need an accessibility statement too?",
    statementDesc: "The EAA requires one on most sites. We'll pre-fill it with the issues found in this scan.",
    statementButton: "Generate statement →",
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
    developedBy: "Developed by VV Labs",
  },

  // Blog listing page
  blog: {
    heading: "Blog",
    subtitle: "Guides and articles about web accessibility, the EAA, and compliance.",
    readMore: "Read more",
    backToBlog: "Back to blog",
    articleCtaTitle: "Want to check your website?",
    articleCtaButton: "Scan for free",
  },
};

export default en;
