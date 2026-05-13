import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { seoServicePages } from "@/data/seo-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [content, posts] = await Promise.all([getSiteContent(), getAllPosts()]);
  const staticRoutes = [
    "",
    "/case-studies",
    "/blog",
    "/politica-confidentialitate",
    "/termeni-si-conditii",
  ];

  const serviceRoutes = seoServicePages.map((page) => page.path);

  const staticEntries = [...staticRoutes, ...serviceRoutes].map((path) => ({
    url: absoluteUrl(path || "/", content),
    lastModified: new Date(),
  }));

  const blogEntries = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`, content),
    lastModified: new Date(post.publishedAt),
  }));

  return [...staticEntries, ...blogEntries];
}
