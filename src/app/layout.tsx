import "./globals.css";

/**
 * Root Layout — provides html/body shell.
 * Note: lang attribute is set to "en" as default. The actual language
 * is communicated via content-language header and hreflang meta tags.
 * Next.js App Router doesn't support dynamic html attributes from nested layouts.
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
