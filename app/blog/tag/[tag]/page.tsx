import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/blog-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { blogTags, getTagLabel } from "@/data/blog-taxonomy";
import { getPostsByTag } from "@/lib/blog";
import { buildRouteMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { buildBlogCollectionSchema, buildBreadcrumbSchema } from "@/lib/structured-data";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return blogTags.map((tag) => ({ tag: tag.key }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const content = await getSiteContent();

  return buildRouteMetadata({
    content,
    path: `/blog/tag/${tag}`,
    fallbackTitle: `${getTagLabel(tag)} | Blog Digital Dot`,
    fallbackDescription: `Articole Digital Dot despre ${getTagLabel(tag)}, strategie de marketing, SEO, AI SEO și creștere digitală.`,
  });
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const [content, posts] = await Promise.all([getSiteContent(), getPostsByTag(tag)]);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          buildBlogCollectionSchema(
            content,
            posts,
            `/blog/tag/${tag}`,
            `${getTagLabel(tag)} | Blog Digital Dot`,
          ),
          buildBreadcrumbSchema(content, [
            { name: "Acasă", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: getTagLabel(tag), path: `/blog/tag/${tag}` },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Acasă", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: getTagLabel(tag), href: `/blog/tag/${tag}` },
        ]}
      />
      <section className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <Container>
          <header className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
              Subiect semantic
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              {getTagLabel(tag)}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#c6c6c6]">
              Articole conectate prin aceeași temă editorială, pentru o arhitectură de cunoaștere mai clară.
            </p>
          </header>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
