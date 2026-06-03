import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/blog-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { blogCategories, getCategoryLabel } from "@/data/blog-taxonomy";
import { getPostsByCategory } from "@/lib/blog";
import { buildRouteMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { buildBlogCollectionSchema, buildBreadcrumbSchema } from "@/lib/structured-data";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return blogCategories.map((category) => ({ category: category.key }));
}

function buildCategoryDescription(label: string, description?: string) {
  return `${description || `Articole Digital Dot despre ${label}.`} Citește perspective aplicate despre marketing digital, strategie, SEO, conținut și creștere predictibilă.`;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const content = await getSiteContent();
  const categoryInfo = blogCategories.find((item) => item.key === category);
  const label = categoryInfo?.label || category;

  return buildRouteMetadata({
    content,
    path: `/blog/categorie/${category}`,
    fallbackTitle: `${label} | Categorie Blog Digital Dot`,
    fallbackDescription: buildCategoryDescription(label, categoryInfo?.description),
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const [content, posts] = await Promise.all([getSiteContent(), getPostsByCategory(category)]);
  const categoryInfo = blogCategories.find((item) => item.key === category);

  if (!categoryInfo || posts.length === 0) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          buildBlogCollectionSchema(
            content,
            posts,
            `/blog/categorie/${category}`,
            `${categoryInfo.label} | Blog Digital Dot`,
          ),
          buildBreadcrumbSchema(content, [
            { name: "Acasă", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: categoryInfo.label, path: `/blog/categorie/${category}` },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Acasă", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: categoryInfo.label, href: `/blog/categorie/${category}` },
        ]}
      />
      <section className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <Container>
          <header className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
              Cluster editorial
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              {getCategoryLabel(category)}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#c6c6c6]">
              {categoryInfo.description}
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
