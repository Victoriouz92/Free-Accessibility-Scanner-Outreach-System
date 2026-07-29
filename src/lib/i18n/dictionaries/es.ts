const es = {
  // Navegación
  nav: {
    home: "AccessCheck",
    privacy: "Política de privacidad",
    imprint: "Aviso legal",
    skipToContent: "Saltar al contenido principal",
  },

  // Página principal
  hero: {
    title: "¿Es accesible tu sitio web?",
    subtitle:
      "La Ley Europea de Accesibilidad entra en vigor pronto. Introduce tu URL para descubrir si tu sitio tiene problemas — gratis, instantáneo, sin registro.",
    placeholder: "Introduce la URL de tu sitio web (ej. example.com)",
    button: "Escanear gratis",
    buttonLoading: "Iniciando escaneo...",
    errorInvalidUrl: "Por favor, introduce una URL válida (ej. example.com)",
    errorGeneric: "Algo salió mal. Por favor, inténtalo de nuevo.",
  },

  // Indicadores de confianza
  trust: {
    fast: "Rápido",
    fastDesc: "Resultados en menos de 30 segundos. Revisamos tu página principal más hasta 4 páginas internas.",
    private: "Privado",
    privateDesc: "Solo escaneamos páginas públicas. Los datos no se comparten con terceros.",
    actionable: "Práctico",
    actionableDesc: "Obtén correcciones concretas de ejemplo que puedes entregar a tu desarrollador inmediatamente.",
  },

  // Progreso del escaneo
  scan: {
    title: "Escaneando tu sitio web...",
    steps: [
      "Conectando con tu sitio web...",
      "Revisando imágenes y multimedia...",
      "Revisando formularios y campos...",
      "Revisando contraste de colores...",
      "Revisando navegación y estructura...",
      "Generando tu informe...",
    ],
    errorTitle: "El escaneo falló",
    tryAgain: "Intentar de nuevo",
  },

  // Informe
  report: {
    title: "Tu informe de accesibilidad",
    issuesFound: "Problemas encontrados",
    examplesTitle: "Ejemplos de problemas encontrados en tu sitio",
    before: "Antes:",
    fix: "Corrección:",
    whyTitle: "Por qué es importante",
    whyText:
      "La Ley Europea de Accesibilidad (EAA) exige que las empresas que venden productos o servicios en línea a consumidores de la UE cumplan con estándares de accesibilidad antes del 28 de junio de 2025. El incumplimiento puede resultar en multas y pérdida de acceso al mercado.",
    learnMore: "Más información sobre la EAA →",
    disclaimer:
      "Aviso: Esta es una evaluación preliminar automatizada, no una certificación legal de cumplimiento. No sustituye una auditoría manual ni asesoramiento legal.",
    scoreGood: "Bueno",
    scoreNeedsWork: "Necesita trabajo",
    scorePoor: "Deficiente",
    fixTitle: "Quiero que me lo arreglen",
    fixDesc: "Ponte en contacto y solucionaremos tus problemas de accesibilidad. Sin compromiso, consulta inicial gratuita.",
    fixButton: "Obtener ayuda ahora",
    detailsTitle: "Necesito todos los detalles",
    detailsDesc: "Obtén cada problema listado con explicaciones claras y prioridades de corrección.",
    detailedReport: "Informe detallado — 1€",
    fullReport: "Informe completo + PDF — 3€",
  },

  // Niveles de severidad
  severity: {
    critical: "Crítico",
    serious: "Grave",
    moderate: "Moderado",
    minor: "Menor",
  },

  // Formulario de contacto
  contact: {
    title: "Hagamos tu sitio web accesible",
    subtitle: "Cuéntanos sobre tu sitio web y tu calendario. Te responderemos en un día laborable con una evaluación inicial gratuita y presupuesto.",
    nameLabel: "Tu nombre",
    emailLabel: "Correo electrónico de trabajo",
    companyLabel: "Nombre de la empresa",
    messageLabel: "Cuéntanos sobre tu sitio web y tu calendario",
    consentLabel: "Acepto ser contactado/a sobre servicios de accesibilidad. Mis datos serán procesados según la",
    consentLinkText: "política de privacidad",
    submitButton: "Enviar mensaje",
    submitting: "Enviando...",
    successTitle: "¡Gracias!",
    successText: "Hemos recibido tu mensaje y te responderemos en un día laborable.",
    errorText: "Algo salió mal. Por favor, inténtalo de nuevo o escríbenos directamente.",
  },

  // Informe de pago
  paidReport: {
    unlockTitle: "Desbloquea tu informe completo",
    unlockDesc: "Pago único de {price}. No necesitas cuenta — acceso instantáneo tras el pago.",
    payButton: "Pagar {price} y desbloquear",
    stripeNote: "Pago seguro a través de Stripe. Los datos de tu tarjeta nunca pasan por nuestros servidores.",
    detailedName: "Informe detallado",
    fullName: "Informe completo + PDF",
    features: {
      violations: "Cada violación con criterio WCAG",
      explanation: "Explicación en lenguaje claro por problema",
      effort: "Esfuerzo estimado de corrección (Rápido / Moderado / Complejo)",
      selectors: "Selectores HTML para desarrolladores",
      pdf: "Informe PDF descargable",
      grouped: "Agrupado por página afectada",
    },
  },

  // Explicación de la EAA
  eaa: {
    title: "La Ley Europea de Accesibilidad — lo que necesitas saber",
    whatTitle: "¿Qué es la EAA?",
    whatText:
      "La Ley Europea de Accesibilidad (EAA) exige que los productos y servicios ofrecidos a consumidores — incluyendo sitios web y tiendas en línea — cumplan estándares específicos de accesibilidad. Esto significa que tu sitio web debe ser utilizable por personas con discapacidades, incluyendo quienes usan lectores de pantalla, navegación por teclado, o tienen deficiencias visuales.",
    whoTitle: "¿A quién afecta?",
    whoText:
      "A cualquier empresa que venda productos o servicios a consumidores (B2C) a través de un sitio web en la UE. Esto incluye tiendas en línea, plataformas de reservas, sitios de servicios y productos digitales. Las microempresas (menos de 10 empleados y menos de 2M€ de facturación anual) pueden estar exentas en algunos casos.",
    deadlineTitle: "¿Cuál es el plazo?",
    deadlineText:
      "La fecha de aplicación de la EAA fue el 28 de junio de 2025. Se espera que las empresas ya cumplan. Los organismos nacionales pueden imponer multas por incumplimiento.",
    standardTitle: "¿Qué estándar debo cumplir?",
    standardText:
      "El estándar técnico referenciado es EN 301 549, que apunta a WCAG 2.1 Nivel AA para contenido web. En términos prácticos, esto significa: descripciones de imágenes, contraste de color suficiente, navegación por teclado, etiquetas de formularios, y más.",
    consequenceTitle: "¿Qué pasa si no cumplo?",
    consequenceText:
      "La aplicación varía según el país. La autoridad responsable puede emitir advertencias, exigir correcciones e imponer multas. Más allá del riesgo legal, los sitios web inaccesibles también excluyen a una parte significativa de clientes potenciales.",
    ctaTitle: "Revisa tu sitio web ahora",
    ctaText: "Nuestro escáner gratuito revisa tu sitio web en busca de los problemas de accesibilidad más comunes en segundos.",
    ctaButton: "Escanea tu sitio web gratis",
    disclaimerText:
      "Aviso: Esta página proporciona información general sobre la Ley Europea de Accesibilidad con fines educativos. No es asesoramiento legal. Consulta con un profesional legal cualificado para asesoramiento específico a tu situación.",
  },

  // Pie de página
  footer: {
    rights: "Todos los derechos reservados.",
  },
};

export default es;
