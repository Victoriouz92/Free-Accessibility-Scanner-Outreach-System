import { getAllPosts, getLocalizedPost } from "@/lib/blog";
import type { Metadata } from "next";

/**
 * Blog Listing Page
 */

export const metadata: Metadata = {
  title: "AccessCheck Blog — Accessibility Guides & Tips",
  description:
    "Learn about web accessibility, the European Accessibility Act, and how to make your website compliant.",
};

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  const posts = getAllPosts().map((p) => getLocalizedPost(p, lang));

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-muted mb-10">
        Guides and articles about web accessibility, the EAA, and compliance.
      </p>

      <div className="space-y-6">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/${lang}/blog/${post.slug}`}
            className="block bg-surface rounded-xl border border-border overflow-hidden card-hover"
          >
            <img
              src={post.image}
              alt={post.imageAlt}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <time className="text-xs text-muted">{post.date}</time>
              <h2 className="text-lg font-semibold mt-1 mb-2">{post.title}</h2>
              <p className="text-sm text-muted">{post.excerpt}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
