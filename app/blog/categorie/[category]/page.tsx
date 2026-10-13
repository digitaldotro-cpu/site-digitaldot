import Link from "next/link";
import { categorySeo } from "@/data/blog-category-seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/blog-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { blogCategories } from "@/data/blog-taxonomy";
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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const content = await getSiteContent();
  const categoryInfo = blogCategories.find((item) => item.key === category);
  const seo = categorySeo[category];
  if (!categoryInfo || !seo) notFound();

  return buildRouteMetadata({
    content,
    path: `/blog/categorie/${category}`,
    fallbackTitle: seo.title,
    fallbackDescription: seo.description,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const [content, posts] = await Promise.all([getSiteContent(), getPostsByCategory(category)]);
  const categoryInfo = blogCategories.find((item) => item.key === category);

  const seo = categorySeo[category];

  if (!categoryInfo || !seo || posts.length === 0) {
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
              {seo.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#c6c6c6]">
              {seo.intro}
            </p>
          </header>
          <nav aria-label="Servicii asociate categoriei" className="mt-8">
            <h2 className="text-xl font-semibold text-white">Servicii asociate</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {seo.services.map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className="inline-block rounded-full border border-[#276864] px-4 py-2 text-sm text-[#66fcf1] transition-colors hover:bg-[#276864] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#66fcf1]">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
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
