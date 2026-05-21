import type { MetadataRoute } from "next";
import { getAllAuthors, getAllPosts } from "@/lib/blog";
import { blogCategories, blogTags } from "@/data/blog-taxonomy";
import { absoluteUrl } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [content, posts, authors] = await Promise.all([getSiteContent(), getAllPosts(), getAllAuthors()]);
  const staticRoutes = [
    "",
    "/case-studies",
    "/blog",
    "/politica-confidentialitate",
    "/termeni-si-conditii",
  ];

  const serviceRoutes = content.serviceSeo.pages
    .filter((page) => page.enabled !== false)
    .map((page) => page.path);
  const regionalRoutes = content.regionalSeo.enabled
    ? [
        content.regionalSeo.hub.path,
        ...content.regionalSeo.pages
          .filter((page) => page.enabled !== false)
          .map((page) => `/agentie-marketing/${page.slug}`),
      ]
    : [];
  const caseStudyRoutes = content.caseStudies.enabled
    ? content.caseStudies.studies.map((study) => `/case-studies/${study.slug}`)
    : [];

  const staticEntries = [...staticRoutes, ...serviceRoutes, ...regionalRoutes, ...caseStudyRoutes].map((path) => ({
    url: absoluteUrl(path || "/", content),
    lastModified: new Date(),
  }));

  const blogEntries = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`, content),
    lastModified: new Date(post.publishedAt),
  }));

  const authorEntries = authors.map((author) => ({
    url: absoluteUrl(`/blog/autor/${author.slug}`, content),
    lastModified: new Date(),
  }));

  const taxonomyEntries = [
    ...blogCategories.map((category) => `/blog/categorie/${category.key}`),
    ...blogTags.map((tag) => `/blog/tag/${tag.key}`),
  ].map((route) => ({
    url: absoluteUrl(route, content),
    lastModified: new Date(),
  }));

  return [...staticEntries, ...blogEntries, ...authorEntries, ...taxonomyEntries];
}
