import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts, getFeaturedPost } from "@/lib/blog";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { BlogGridFilter } from "@/components/blog/blog-grid-filter";
import { TagBadge } from "@/components/ui/tag-badge";
import { getCategoryLabel } from "@/data/blog-taxonomy";
import { ButtonLink } from "@/components/ui/button";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = buildMetadata({
  title: "Blog",
  path: "/blog",
  description:
    "Articole practice despre lead generation, social media, paid media și strategie de marketing pentru companii care vor creștere predictibilă.",
});

export default async function BlogPage() {
  const [posts, featured, content] = await Promise.all([
    getAllPosts(),
    getFeaturedPost(),
    getSiteContent(),
  ]);
  const page = content.blogPage;
  const gridPosts = featured ? posts.filter((post) => post.slug !== featured.slug) : posts;

  return (
    <>
      <section className="py-20 sm:py-24">
        <Container>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {page.heroTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[#c7cdd1]">{page.heroDescription}</p>
        </Container>
      </section>

      {featured ? (
        <section className="pb-16">
          <Container>
            <div className="overflow-hidden rounded-[2rem] border border-[#273840] bg-[#10171b]">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[280px]">
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-7 sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
                    {page.featuredBadge}
                  </p>
                  <TagBadge className="mt-4">
                    {getCategoryLabel(featured.category)}
                  </TagBadge>
                  <h2 className="mt-4 text-3xl font-semibold text-white">
                    <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                  </h2>
                  <p className="mt-4 text-[#c2c8cc]">{featured.excerpt}</p>
                  <p className="mt-3 text-xs text-[#9ea6ac]">{featured.readingTime}</p>
                  <ButtonLink href={`/blog/${featured.slug}`} className="mt-6" size="sm">
                    Citește articolul
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-16">
        <Container>
          <BlogGridFilter posts={gridPosts} />
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-[1.8rem] border border-[#273840] bg-[#10171b] p-8 sm:p-10">
            <h2 className="text-3xl font-semibold text-white">{page.newsletterTitle}</h2>
            <p className="mt-4 max-w-2xl text-[#c7cdd1]">{page.newsletterDescription}</p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row" action="#" method="post">
              <input
                type="email"
                required
                placeholder={page.newsletterPlaceholder}
                className="h-12 flex-1 rounded-full border border-[#2c3c44] bg-[#0f1519] px-5 text-sm text-white placeholder:text-[#7f8b92] focus:border-[#66fcf1] focus:outline-none"
              />
              <button
                type="submit"
                className="h-12 rounded-full bg-[#66fcf1] px-6 text-sm font-semibold text-[#0b0c10]"
              >
                {page.newsletterButtonLabel}
              </button>
            </form>
          </div>
        </Container>
      </section>

      <CtaSection
        title={page.finalCta.title}
        description={page.finalCta.description}
        primaryLabel={page.finalCta.primaryLabel}
        primaryHref={page.finalCta.primaryHref}
        secondaryLabel={page.finalCta.secondaryLabel}
        secondaryHref={page.finalCta.secondaryHref}
      />
    </>
  );
}
