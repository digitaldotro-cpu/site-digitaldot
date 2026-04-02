import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { siteMetadata } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/servicii/social-media-management",
    "/servicii/productie-foto-video",
    "/servicii/strategie-marketing",
    "/portofoliu",
    "/blog",
    "/contacteaza-ne",
  ];

  const posts = await getAllPosts();

  const staticEntries = staticRoutes.map((path) => ({
    url: `${siteMetadata.siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const blogEntries = posts.map((post) => ({
    url: `${siteMetadata.siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  return [...staticEntries, ...blogEntries];
}
