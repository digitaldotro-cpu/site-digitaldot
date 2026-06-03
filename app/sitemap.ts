import type { MetadataRoute } from "next";
import { getAllAuthors, getAllPosts } from "@/lib/blog";
import { blogCategories, blogTags } from "@/data/blog-taxonomy";
import { absoluteUrl } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";

type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [content, posts, authors] = await Promise.all([
    getSiteContent(),
    getAllPosts(),
    getAllAuthors(),
  ]);

  const indexedSeoRoutes = content.seoSettings.pages
    .filter((page) => page.robots.index && page.robots.googleBotIndex)
    .map((page) => page.canonicalUrl || page.path);

  const staticRoutes = [
    "/servicii/strategie-marketing",
    "/servicii/social-media-management",
    "/servicii/productie-foto-video",
    "/servicii/google-ads",
    "/case-studies",
    "/blog",
    "/politica-confidentialitate",
    "/termeni-si-conditii",
  ];

  const serviceRoutes = content.serviceSeo.enabled
    ? content.serviceSeo.pages
        .filter((page) => page.enabled !== false)
        .map((page) => page.path)
    : [];
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

  const homeUrl = absoluteUrl("/", content);
  const staticUrls = [
    ...new Set([
      homeUrl,
      ...indexedSeoRoutes,
      ...staticRoutes,
      ...serviceRoutes,
      ...regionalRoutes,
      ...caseStudyRoutes,
    ].map((route) => absoluteUrl(route, content))),
  ];

  const staticEntries = staticUrls.map((url): SitemapEntry => ({
    url,
    lastModified: new Date(),
    changeFrequency: url === homeUrl ? "weekly" : "monthly",
    priority: url === homeUrl ? 1 : 0.8,
  }));

  const blogEntries = posts.map((post): SitemapEntry => ({
    url: absoluteUrl(`/blog/${post.slug}`, content),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const authorEntries = authors.map((author): SitemapEntry => ({
    url: absoluteUrl(`/blog/autor/${author.slug}`, content),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const taxonomyEntries = [
    ...blogCategories.map((category) => `/blog/categorie/${category.key}`),
    ...blogTags.map((tag) => `/blog/tag/${tag.key}`),
  ].map((route): SitemapEntry => ({
    url: absoluteUrl(route, content),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticEntries, ...blogEntries, ...authorEntries, ...taxonomyEntries];
}
