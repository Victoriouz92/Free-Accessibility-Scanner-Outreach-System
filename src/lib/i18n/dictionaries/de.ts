const de = {
  nav: {
    home: "AccessCheck",
    privacy: "Datenschutz",
    imprint: "Impressum",
    skipToContent: "Zum Hauptinhalt springen",
  },

  hero: {
    title: "Ist Ihre Website barrierefrei?",
    subtitle:
      "Das Barrierefreiheitsstärkungsgesetz (BFSG) gilt jetzt. Geben Sie Ihre URL ein, um herauszufinden, ob Ihre Website Probleme hat — kostenlos, sofort, ohne Anmeldung.",
    placeholder: "Website-URL eingeben (z.B. beispiel.de)",
    button: "Kostenlos prüfen",
    buttonLoading: "Scan wird gestartet...",
    errorInvalidUrl: "Bitte geben Sie eine gültige URL ein (z.B. beispiel.de)",
    errorGeneric: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
  },

  trust: {
    fast: "Schnell",
    fastDesc: "Ergebnisse in unter 30 Sekunden. Wir prüfen Ihre Startseite plus bis zu 4 Unterseiten.",
    private: "Privat",
    privateDesc: "Wir scannen nur öffentliche Seiten. Keine Daten werden an Dritte weitergegeben.",
    actionable: "Umsetzbar",
    actionableDesc: "Erhalten Sie konkrete Lösungsbeispiele, die Sie sofort an Ihren Entwickler weitergeben können.",
  },

  scan: {
    title: "Ihre Website wird geprüft...",
    steps: [
      "Verbindung zu Ihrer Website...",
      "Prüfung von Bildern und Medien...",
      "Prüfung von Formularen und Eingabefeldern...",
      "Prüfung von Farbkontrasten...",
      "Prüfung von Navigation und Struktur...",
      "Ihr Bericht wird erstellt...",
    ],
    errorTitle: "Scan fehlgeschlagen",
    tryAgain: "Erneut versuchen",
  },

  report: {
    title: "Ihr Barrierefreiheits-Bericht",
    issuesFound: "Gefundene Probleme",
    examplesTitle: "Beispielprobleme auf Ihrer Website",
    before: "Vorher:",
    fix: "Lösung:",
    whyTitle: "Warum das wichtig ist",
    whyText:
      "Das Barrierefreiheitsstärkungsgesetz (BFSG) verpflichtet Unternehmen, die Produkte oder Dienstleistungen online an Verbraucher in der EU verkaufen, Barrierefreiheitsstandards einzuhalten. Bei Nichteinhaltung drohen Bußgelder und Marktbeschränkungen.",
    learnMore: "Mehr über das BFSG erfahren →",
    disclaimer:
      "Hinweis: Dies ist eine automatisierte Vorabprüfung, keine rechtliche Zertifizierung. Sie ersetzt kein manuelles Audit und keine Rechtsberatung.",
    scoreGood: "Gut",
    scoreNeedsWork: "Verbesserungsbedarf",
    scorePoor: "Mangelhaft",
    fixTitle: "Ich möchte das beheben lassen",
    fixDesc: "Kontaktieren Sie uns und wir beheben Ihre Barrierefreiheitsprobleme. Unverbindlich, kostenlose Erstberatung.",
    fixButton: "Jetzt Hilfe erhalten",
    detailsTitle: "Ich brauche alle Details",
    detailsDesc: "Erhalten Sie jedes Problem mit verständlichen Erklärungen und Prioritäten.",
    detailedReport: "Detaillierter Bericht — 1€",
    fullReport: "Vollständiger Bericht + PDF — 3€",
    cachedNotice: "Diese Ergebnisse stammen von einem kürzlichen Scan. Neue Ergebnisse sind in 24 Stunden verfügbar.",
  },

  severity: {
    critical: "Kritisch",
    serious: "Schwerwiegend",
    moderate: "Mittel",
    minor: "Gering",
  },

  contact: {
    title: "Lassen Sie uns Ihre Website barrierefrei machen",
    subtitle: "Erzählen Sie uns von Ihrer Website und Ihrem Zeitplan. Wir melden uns innerhalb eines Werktages mit einer kostenlosen Ersteinschätzung.",
    nameLabel: "Ihr Name",
    emailLabel: "Geschäftliche E-Mail",
    companyLabel: "Firmenname",
    messageLabel: "Erzählen Sie uns von Ihrer Website und Ihrem Zeitplan",
    consentLabel: "Ich stimme zu, bezüglich Barrierefreiheits-Dienstleistungen kontaktiert zu werden. Meine Daten werden gemäß der",
    consentLinkText: "Datenschutzerklärung",
    submitButton: "Nachricht senden",
    submitting: "Wird gesendet...",
    successTitle: "Vielen Dank!",
    successText: "Wir haben Ihre Nachricht erhalten und melden uns innerhalb eines Werktages.",
    errorText: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt.",
  },

  paidReport: {
    unlockTitle: "Vollständigen Bericht freischalten",
    unlockDesc: "Einmalige Zahlung von {price}. Kein Konto nötig — sofortiger Zugang nach Zahlung.",
    payButton: "{price} zahlen und freischalten",
    stripeNote: "Sichere Zahlung über Stripe. Ihre Kartendaten erreichen nie unsere Server.",
    detailedName: "Detaillierter Bericht",
    fullName: "Vollständiger Bericht + PDF",
    features: {
      violations: "Jeder Verstoß mit WCAG-Kriterium",
      explanation: "Verständliche Erklärung pro Problem",
      effort: "Geschätzter Aufwand (Schnell / Mittel / Komplex)",
      selectors: "HTML-Selektoren für Entwickler",
      pdf: "PDF-Bericht zum Download",
      grouped: "Gruppiert nach betroffener Seite",
    },
  },

  eaa: {
    title: "Das Barrierefreiheitsstärkungsgesetz — was Sie wissen müssen",
    whatTitle: "Was ist das BFSG?",
    whatText:
      "Das Barrierefreiheitsstärkungsgesetz (BFSG) setzt die europäische Richtlinie über die Barrierefreiheitsanforderungen (EAA) in Deutschland um. Es verlangt, dass Produkte und Dienstleistungen für Verbraucher — einschließlich Websites und Online-Shops — bestimmte Barrierefreiheitsstandards erfüllen.",
    whoTitle: "Wen betrifft es?",
    whoText:
      "Jedes Unternehmen, das Produkte oder Dienstleistungen an Verbraucher (B2C) über eine Website in der EU verkauft. Dazu gehören Online-Shops, Buchungsplattformen, Service-Websites und digitale Produkte. Kleinstunternehmen (weniger als 10 Mitarbeiter und unter 2 Mio. € Jahresumsatz) können in einigen Fällen ausgenommen sein.",
    deadlineTitle: "Was ist die Frist?",
    deadlineText:
      "Das BFSG gilt seit dem 28. Juni 2025. Unternehmen müssen bereits konform sein. Die zuständigen Behörden können Bußgelder verhängen.",
    standardTitle: "Welchen Standard muss ich erfüllen?",
    standardText:
      "Der technische Standard ist EN 301 549, der auf WCAG 2.1 Level AA verweist. Praktisch bedeutet das: korrekte Bildbeschreibungen, ausreichender Farbkontrast, Tastaturnavigation, Formular-Labels und mehr.",
    consequenceTitle: "Was passiert bei Nichteinhaltung?",
    consequenceText:
      "Die zuständige Behörde kann Verwarnungen aussprechen, Korrekturen verlangen und Bußgelder verhängen. Über das rechtliche Risiko hinaus schließen nicht barrierefreie Websites auch einen erheblichen Teil potenzieller Kunden aus.",
    ctaTitle: "Prüfen Sie Ihre Website jetzt",
    ctaText: "Unser kostenloser Scanner prüft Ihre Website auf die häufigsten Barrierefreiheitsprobleme in Sekunden.",
    ctaButton: "Website kostenlos prüfen",
    disclaimerText:
      "Hinweis: Diese Seite bietet allgemeine Informationen über das BFSG zu Bildungszwecken. Dies ist keine Rechtsberatung. Konsultieren Sie einen qualifizierten Rechtsanwalt für Ihren speziellen Fall.",
  },

  footer: {
    rights: "Alle Rechte vorbehalten.",
  },
};

export default de;
