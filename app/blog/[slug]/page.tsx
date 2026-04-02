import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { siteMetadata } from "@/lib/seo";
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
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Articol negăsit | Digital Dot",
    };
  }

  const fullUrl = `${siteMetadata.siteUrl}/blog/${post.slug}`;
  const coverUrl = new URL(post.coverImage, siteMetadata.siteUrl).toString();

  return {
    title: `${post.title} | Digital Dot`,
    description: post.excerpt,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: fullUrl,
      type: "article",
      publishedTime: post.publishedAt,
      images: [
        {
          url: coverUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [coverUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug, 3);

  return (
    <BlogPostLayout post={post} relatedPosts={relatedPosts}>
      <MDXRemote source={post.content} components={mdxComponents} />
    </BlogPostLayout>
  );
}
