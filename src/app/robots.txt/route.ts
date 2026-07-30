/**
 * robots.txt Route
 *
 * WHAT IT IS: Tells search engines which pages to crawl and which to skip.
 * WHY IT EXISTS: SEO best practice — prevents indexing of API routes and admin pages.
 */

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://accesscheck.eu";

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /tools/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
