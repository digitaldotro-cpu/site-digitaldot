import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { TagBadge } from "@/components/ui/tag-badge";
import { Container } from "@/components/ui/container";
import { BlogCard } from "@/components/blog/blog-card";
import { getCategoryLabel, getTagLabel } from "@/data/blog-taxonomy";
import type { BlogPost } from "@/types/content";

type BlogPostLayoutProps = {
  post: BlogPost;
  relatedPosts: BlogPost[];
  children: React.ReactNode;
};

export function BlogPostLayout({
  post,
  relatedPosts,
  children,
}: BlogPostLayoutProps) {
  return (
    <>
      <article>
        <Container className="pt-16 sm:pt-20">
          <header className="mx-auto max-w-4xl">
            <TagBadge>{getCategoryLabel(post.category)}</TagBadge>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg text-[#c7cbcf]">{post.excerpt}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#9ea7ad]">
              <span>
                {new Date(post.publishedAt).toLocaleDateString("ro-RO", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>•</span>
              <span>{post.readingTime}</span>
              <span>•</span>
              <span>{post.authorName}</span>
            </div>
          </header>

          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[1.8rem] border border-[#263740]">
            <div className="relative aspect-[16/8]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag}>{getTagLabel(tag)}</TagBadge>
            ))}
          </div>

          <div className="article-content mx-auto mt-10 max-w-4xl">{children}</div>

          <div className="mx-auto mt-12 max-w-4xl rounded-[1.6rem] border border-[#273840] bg-[#11181d] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66fcf1]">
              Autor
            </p>
            <p className="mt-3 text-lg font-semibold text-white">{post.authorName}</p>
            <p className="text-sm text-[#b8bec2]">{post.authorRole}</p>
          </div>
        </Container>
      </article>

      <section className="mt-16 border-t border-[#1e2a31] py-16">
        <Container>
          <h2 className="text-2xl font-semibold text-white">Articole similare</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <BlogCard key={related.slug} post={related} />
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="rounded-[2rem] border border-[#2a3b43] bg-[linear-gradient(130deg,#11181d_0%,#17353a_100%)] p-8 text-center sm:p-10">
            <h2 className="text-3xl font-semibold text-white">
              Vrei să aplici aceste tactici în business-ul tău?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#cbd1d5]">
              Discutăm obiectivele tale și construim un plan de marketing orientat
              spre creștere reală.
            </p>
            <ButtonLink href="/contacteaza-ne" className="mt-8">
              Programează o discuție
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
