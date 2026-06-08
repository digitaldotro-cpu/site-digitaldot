import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { buildRouteMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { BlogPostLayout } from "@/components/blog/blog-post-layout";
import { mdxComponents } from "@/components/blog/mdx-components";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post, content] = await Promise.all([getPostBySlug(slug), getSiteContent()]);

  if (!post) {
    return {
      title: "Articol negăsit | Digital Dot",
    };
  }

  return buildRouteMetadata({
    content,
    path: `/blog/${post.slug}`,
    fallbackTitle: post.seoTitle || `${post.title} | Digital Dot`,
    fallbackDescription: post.seoDescription || post.excerpt,
    fallbackOgTitle: post.ogTitle,
    fallbackOgDescription: post.ogDescription,
    type: "article",
    publishedTime: post.publishedAt,
    image: post.coverImage,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [content, relatedPosts] = await Promise.all([
    getSiteContent(),
    getRelatedPosts(post.slug, 3),
  ]);
  const articleFaqGroup = post.faqs?.length
    ? {
        id: `${post.slug}-faq`,
        title: `FAQ ${post.title}`,
        assignedPaths: [`/blog/${post.slug}`],
        items: post.faqs.map((item, index) => ({
          id: `${post.slug}-faq-${index + 1}`,
          question: item.question,
          answer: item.answer,
        })),
      }
    : null;

  return (
    <>
      <JsonLd
        data={[
          buildArticleSchema(content, post),
          articleFaqGroup ? buildFaqSchema(articleFaqGroup) : null,
          buildBreadcrumbSchema(content, [
            { name: "Acasă", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ].filter(Boolean) as Array<Record<string, unknown>>}
      />
      <BlogPostLayout post={post} relatedPosts={relatedPosts}>
        <MDXRemote source={post.content} components={mdxComponents} />
      </BlogPostLayout>
    </>
  );
}
