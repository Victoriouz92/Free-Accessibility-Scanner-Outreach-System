import { locales } from "@/lib/i18n/config";
import { getAllPosts } from "@/lib/blog";

/**
 * sitemap.xml Route
 *
 * WHAT IT IS: Generates a dynamic XML sitemap listing all public pages.
 * WHY IT EXISTS: Helps search engines discover and index all pages efficiently.
 */

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://accesscheck.eu";
  const posts = getAllPosts();

  // Static pages that exist under each language
  const staticPages = ["", "/blog", "/contact", "/eaa-explained", "/privacy", "/imprint"];

  const urls: string[] = [];

  // Generate URLs for every locale + static page combination
  for (const locale of locales) {
    for (const page of staticPages) {
      urls.push(`${baseUrl}/${locale}${page}`);
    }
    // Blog article pages
    for (const post of posts) {
      urls.push(`${baseUrl}/${locale}/blog/${post.slug}`);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
