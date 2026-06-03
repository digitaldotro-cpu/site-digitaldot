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

  const homeUrl = absoluteUrl("/", content);
  const serviceRoutes = [
    "/servicii/strategie-marketing",
    "/servicii/social-media-management",
    "/servicii/productie-foto-video",
    "/servicii/google-ads",
    "/servicii/meta-ads",
    "/servicii/seo",
    "/servicii/website-creation",
  ];
  const staticRoutes = [
    "/case-studies",
    "/blog",
    "/politica-confidentialitate",
    "/termeni-si-conditii",
  ];
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
  const makeEntry = (
    route: string,
    changeFrequency: SitemapEntry["changeFrequency"],
    priority: SitemapEntry["priority"],
  ): SitemapEntry => ({
    url: absoluteUrl(route, content),
    lastModified: new Date(),
    changeFrequency,
    priority,
  });

  const staticEntries: SitemapEntry[] = [
    {
      url: homeUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...serviceRoutes.map((route) => makeEntry(route, "monthly", 0.9)),
    ...caseStudyRoutes.map((route) => makeEntry(route, "monthly", 0.8)),
    ...regionalRoutes.map((route) => makeEntry(route, "monthly", route === content.regionalSeo.hub.path ? 0.8 : 0.75)),
    ...staticRoutes.map((route) => {
      if (route === "/blog") {
        return makeEntry(route, "weekly", 0.7);
      }

      if (route === "/politica-confidentialitate" || route === "/termeni-si-conditii") {
        return makeEntry(route, "yearly", 0.3);
      }

      return makeEntry(route, "monthly", 0.6);
    }),
  ];

  const blogEntries = posts.map((post): SitemapEntry => ({
    url: absoluteUrl(`/blog/${post.slug}`, content),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const authorEntries = authors.map((author): SitemapEntry => ({
    url: absoluteUrl(`/blog/autor/${author.slug}`, content),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
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

  const entries = [...staticEntries, ...blogEntries, ...authorEntries, ...taxonomyEntries];
  const seen = new Set<string>();

  return entries.filter((entry) => {
    if (seen.has(entry.url)) {
      return false;
    }

    seen.add(entry.url);
    return true;
  });
}
