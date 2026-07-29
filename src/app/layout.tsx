import "./globals.css";

/**
 * Root Layout
 *
 * Next.js requires <html> and <body> tags in the root layout.
 * The [lang] layout adds the actual lang attribute and content.
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
