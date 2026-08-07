import { getPostBySlug, getAllPosts, getLocalizedPost } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

/**
 * Individual Blog Article Page
 *
 * WHAT IT IS: Renders a single blog post by slug.
 * WHY IT EXISTS: Each article has its own URL for SEO and sharing.
 */

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} — AccessCheck Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang as Locale);
  const rawPost = getPostBySlug(slug);

  if (!rawPost) notFound();

  const post = getLocalizedPost(rawPost, lang);

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <a href={`/${lang}/blog`} className="text-sm text-primary underline hover:text-primary-hover mb-4 inline-block">
        <span aria-hidden="true">←</span> {dict.blog.backToBlog}
      </a>

      {/* Hero image */}
      <img
        src={post.image}
        alt={post.imageAlt}
        className="w-full h-64 sm:h-80 object-cover rounded-xl mb-6"
      />

      <time className="block text-sm text-muted mb-2" dateTime={post.date}>{post.date}</time>
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

      {/* Render content as simple paragraphs and headings */}
      <div className="prose-content space-y-4">
        {post.content.split("\n\n").map((block: string, i: number) => {
          if (block.startsWith("## ")) {
            return (
              <h2 key={i} className="text-xl font-semibold mt-8 mb-3">
                {block.replace("## ", "")}
              </h2>
            );
          }
          if (block.startsWith("```")) {
            const code = block.replace(/```\w*\n?/g, "");
            return (
              <pre key={i} className="bg-primary/8 rounded-lg p-4 text-sm font-mono overflow-x-auto">
                <code>{code}</code>
              </pre>
            );
          }
          if (block.startsWith("- ") || block.startsWith("1. ")) {
            const items = block.split("\n");
            return (
              <ul key={i} className="list-disc pl-6 space-y-1 text-sm text-muted">
                {items.map((item: string, j: number) => (
                  <li key={j}>{item.replace(/^[-\d]+\.?\s/, "")}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className="text-muted leading-relaxed">
              {block}
            </p>
          );
        })}
      </div>

      {/* CTA at bottom */}
      <div className="mt-12 bg-primary-light rounded-xl p-6 text-center">
        <p className="font-semibold mb-2">{dict.blog.articleCtaTitle}</p>
        <a
          href={`/${lang}`}
          className="inline-block px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
        >
          {dict.blog.articleCtaButton} <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
