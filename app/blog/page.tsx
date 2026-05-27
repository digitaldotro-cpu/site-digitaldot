import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { BlogGridFilter } from "@/components/blog/blog-grid-filter";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FaqSection } from "@/components/seo/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPosts } from "@/lib/blog";
import { getSiteContent } from "@/lib/site-content";
import { buildRouteMetadata } from "@/lib/seo";
import { buildBlogCollectionSchema, buildBreadcrumbSchema, buildFaqSchema, getFaqGroupsForPath } from "@/lib/structured-data";

const path = "/blog";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return buildRouteMetadata({
    content,
    path,
    fallbackTitle: "Blog Marketing Digital | Digital Dot",
    fallbackDescription: "Articole Digital Dot despre marketing strategic, social media, paid media, SEO și lead generation.",
  });
}

export default async function BlogPage() {
  const [content, posts] = await Promise.all([getSiteContent(), getAllPosts()]);
  const faqGroups = getFaqGroupsForPath(content, path);
  const schemas = [
    buildBlogCollectionSchema(content, posts),
    buildBreadcrumbSchema(content, [
      { name: "Acasă", path: "/" },
      { name: "Blog", path },
    ]),
    ...faqGroups.map(buildFaqSchema),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <Breadcrumbs
        items={[
          { label: "Acasă", href: "/" },
          { label: "Blog", href: "/blog" },
        ]}
      />
      <section className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <Container>
          <header className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
              Resurse
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Blog Marketing Digital
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#c6c6c6]">
              Ghiduri și insight-uri despre strategie, conținut, paid media, SEO și creștere digitală pentru business-uri care vor decizii mai bune.
            </p>
          </header>

          <div className="mt-10">
            <BlogGridFilter posts={posts} />
          </div>
        </Container>
      </section>
      <FaqSection groups={faqGroups} />
    </>
  );
}
