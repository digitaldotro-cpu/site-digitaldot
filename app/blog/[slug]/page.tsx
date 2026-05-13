import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { buildRouteMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
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
    fallbackTitle: `${post.title} | Digital Dot`,
    fallbackDescription: post.excerpt,
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

  return (
    <>
      <JsonLd
        data={[
          buildArticleSchema(content, post),
          buildBreadcrumbSchema(content, [
            { name: "Acasă", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <BlogPostLayout post={post} relatedPosts={relatedPosts}>
        <MDXRemote source={post.content} components={mdxComponents} />
      </BlogPostLayout>
    </>
  );
}
