import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/blog-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { getAllAuthors } from "@/lib/blog";
import { absoluteUrl, buildRouteMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { buildAuthorSchema, buildBlogCollectionSchema, buildBreadcrumbSchema } from "@/lib/structured-data";

type AuthorPageProps = {
  params: Promise<{ author: string }>;
};

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((author) => ({ author: author.slug }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { author: authorSlug } = await params;
  const [authors, content] = await Promise.all([getAllAuthors(), getSiteContent()]);
  const author = authors.find((item) => item.slug === authorSlug);

  if (!author) {
    return { title: "Autor negăsit | Digital Dot" };
  }

  return buildRouteMetadata({
    content,
    path: `/blog/autor/${author.slug}`,
    fallbackTitle: `${author.name} | Autor Digital Dot`,
    fallbackDescription: `${author.name} publică articole Digital Dot despre strategie de marketing, poziționare, SEO, Social Media Management și creștere predictibilă.`,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { author: authorSlug } = await params;
  const [authors, content] = await Promise.all([getAllAuthors(), getSiteContent()]);
  const author = authors.find((item) => item.slug === authorSlug);

  if (!author) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          buildAuthorSchema(content, author),
          buildBlogCollectionSchema(
            content,
            author.posts,
            `/blog/autor/${author.slug}`,
            `${author.name} | Articole Digital Dot`,
          ),
          buildBreadcrumbSchema(content, [
            { name: "Acasă", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: author.name, path: `/blog/autor/${author.slug}` },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Acasă", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: author.name, href: `/blog/autor/${author.slug}` },
        ]}
      />
      <section className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <Container>
          <header className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
              Autor Digital Dot
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{author.name}</h1>
            <p className="mt-3 text-lg text-[#c6c6c6]">{author.role}</p>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">{author.bio}</p>
            <p className="mt-4 text-sm text-[#9ea7ad]">{absoluteUrl(`/blog/autor/${author.slug}`, content)}</p>
          </header>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {author.posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
