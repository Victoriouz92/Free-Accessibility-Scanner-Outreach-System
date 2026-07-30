import { getAllPosts, getLocalizedPost } from "@/lib/blog";
import type { Metadata } from "next";

/**
 * Blog Listing Page — grid layout with hover reveal
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
    <section className="max-w-6xl mx-auto px-6 py-12" aria-labelledby="blog-heading">
      <h1 id="blog-heading" className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-muted mb-10">
        Guides and articles about web accessibility, the EAA, and compliance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/${lang}/blog/${post.slug}`}
            aria-label={post.title}
            className="group block bg-surface rounded-xl border border-border overflow-hidden
                       card-hover relative"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={post.image}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover transition-transform duration-300
                           group-hover:scale-105"
              />
              {/* Date badge */}
              <span className="absolute top-3 left-3 bg-white/90 text-xs px-2 py-1 rounded-md font-medium">
                {post.date}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-sm font-semibold leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              {/* Excerpt — hidden by default, revealed on hover */}
              <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-24 group-hover:opacity-100
                              transition-all duration-300 ease-in-out" aria-hidden="true">
                <p className="text-xs text-muted line-clamp-3 mb-2">{post.excerpt}</p>
              </div>

              {/* Read more — visible to screen readers always */}
              <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100
                               transition-opacity duration-300" aria-hidden="true">
                Read more <span aria-hidden="true">→</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
