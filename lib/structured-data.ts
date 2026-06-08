import type { BlogPost } from "@/types/content";
import type { FaqGroupContent, RegionalPageContent, SiteContent } from "@/lib/site-content-schema";
import { absoluteUrl, getCanonicalBaseUrl, getPageSeo, siteMetadata } from "@/lib/seo";

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function getFaqGroupsForPath(content: SiteContent, path: string) {
  return content.seoSettings.faqGroups.filter((group) => group.assignedPaths.includes(path));
}

export function buildOrganizationSchema(content: SiteContent) {
  const data = content.seoSettings.structuredData;
  const sameAs = data.socialLinks
    .filter((link) => link.enabled !== false)
    .map((link) => link.url);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${getCanonicalBaseUrl(content)}/#organization`,
    name: data.organizationName,
    legalName: data.legalName,
    url: data.websiteUrl,
    logo: absoluteUrl(data.logo, content),
    email: data.email,
    telephone: data.phone,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: data.email,
      telephone: data.phone,
      areaServed: "RO",
      availableLanguage: ["ro", "en"],
    },
    sameAs,
  };
}

export function buildWebSiteSchema(content: SiteContent) {
  const baseUrl = getCanonicalBaseUrl(content);

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: content.seoSettings.global.siteTitle || siteMetadata.siteName,
    alternateName: siteMetadata.siteName,
    url: baseUrl,
    inLanguage: "ro-RO",
    publisher: {
      "@id": `${baseUrl}/#organization`,
      name: siteMetadata.siteName,
    },
  };
}

export function buildWebPageSchema(
  content: SiteContent,
  path: string,
  type: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" = "WebPage",
) {
  const pageSeo = getPageSeo(content, path);
  const url = pageSeo?.canonicalUrl || absoluteUrl(path, content);

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: pageSeo?.seoTitle || content.seoSettings.global.siteTitle,
    description: pageSeo?.seoDescription || content.seoSettings.global.siteDescription,
    isPartOf: {
      "@id": `${getCanonicalBaseUrl(content)}/#website`,
    },
    about: {
      "@id": `${getCanonicalBaseUrl(content)}/#organization`,
      name: siteMetadata.siteName,
    },
    inLanguage: "ro-RO",
  };
}

export function buildLocalBusinessSchema(content: SiteContent) {
  const data = content.seoSettings.structuredData;
  const enabledRegions = content.regionalSeo?.enabled
    ? content.regionalSeo.pages
        .filter((page) => page.enabled !== false)
        .map((page) => ({
          "@type": "AdministrativeArea",
          name: page.countyName === page.cityName ? page.cityName : `${page.cityName}, ${page.countyName}`,
        }))
    : "Romania";

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${getCanonicalBaseUrl(content)}/#localbusiness`,
    name: data.organizationName,
    legalName: data.legalName,
    url: data.websiteUrl,
    image: absoluteUrl(data.logo, content),
    email: data.email,
    telephone: data.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.address.streetAddress || undefined,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion || undefined,
      postalCode: data.address.postalCode || undefined,
      addressCountry: data.address.addressCountry,
    },
    areaServed: enabledRegions,
    priceRange: "$$",
    sameAs: data.socialLinks.filter((link) => link.enabled !== false).map((link) => link.url),
  };
}

export function buildServiceSchema(content: SiteContent, path: string) {
  const service = content.seoSettings.structuredData.services.find((item) => item.url === path);
  const pageSeo = getPageSeo(content, path);

  if (!service) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path, content)}#service`,
    name: service.name,
    description: service.description,
    url: absoluteUrl(service.url, content),
    provider: {
      "@id": `${getCanonicalBaseUrl(content)}/#organization`,
      name: siteMetadata.siteName,
    },
    serviceType: service.name,
    areaServed: "Romania",
    mainEntityOfPage: pageSeo?.canonicalUrl || absoluteUrl(path, content),
  };
}

export function buildServiceItemListSchema(content: SiteContent) {
  const services = content.seoSettings.structuredData.services;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl("/", content)}#services`,
    name: "Servicii Digital Dot",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(service.url, content),
      item: {
        "@type": "Service",
        "@id": `${absoluteUrl(service.url, content)}#service`,
        name: service.name,
        description: service.description,
        provider: {
          "@id": `${getCanonicalBaseUrl(content)}/#organization`,
          name: siteMetadata.siteName,
        },
      },
    })),
  };
}

export function buildRegionalServiceSchemas(content: SiteContent, page: RegionalPageContent) {
  const pageUrl = absoluteUrl(`/agentie-marketing/${page.slug}`, content);

  return page.services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#${service.id}`,
    name: `${service.title} ${page.cityName}`,
    description: service.description,
    url: pageUrl,
    serviceType: service.title,
    areaServed: {
      "@type": "AdministrativeArea",
      name: page.countyName === page.cityName ? page.cityName : `${page.cityName}, ${page.countyName}`,
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType: page.regionalContext.sectors.join(", "),
    },
    provider: {
      "@id": `${getCanonicalBaseUrl(content)}/#organization`,
      name: siteMetadata.siteName,
    },
    mainEntityOfPage: pageUrl,
  }));
}

export function buildRegionalLocalBusinessSchema(content: SiteContent, page: RegionalPageContent) {
  const base = buildLocalBusinessSchema(content);

  return {
    ...base,
    "@id": `${absoluteUrl(`/agentie-marketing/${page.slug}`, content)}#localbusiness`,
    areaServed: {
      "@type": "AdministrativeArea",
      name: page.countyName === page.cityName ? page.cityName : `${page.cityName}, ${page.countyName}`,
    },
    name: `${siteMetadata.siteName} - agenție de marketing ${page.cityName}`,
    url: absoluteUrl(`/agentie-marketing/${page.slug}`, content),
  };
}

export function buildFaqSchema(group: FaqGroupContent) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: group.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(content: SiteContent, items: BreadcrumbItem[]) {
  const currentPath = items.at(-1)?.path || "/";
  const currentUrl = absoluteUrl(currentPath, content);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${currentUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, content),
    })),
  };
}

export function buildArticleSchema(content: SiteContent, post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}`, content);

  return {
    "@context": "https://schema.org",
    "@type": ["Article", "BlogPosting"],
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: absoluteUrl(post.coverImage, content),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.authorName,
      jobTitle: post.authorRole,
      url: absoluteUrl(`/blog/autor/${post.authorSlug}`, content),
    },
    publisher: {
      "@id": `${getCanonicalBaseUrl(content)}/#organization`,
      name: siteMetadata.siteName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(content.seoSettings.structuredData.logo, content),
      },
    },
    mainEntityOfPage: url,
    url,
  };
}

export function buildCaseStudySchema(content: SiteContent, study: SiteContent["caseStudies"]["studies"][number]) {
  const url = absoluteUrl(`/case-studies/${study.slug}`, content);
  const serviceNames = study.servicesInvolved.map((service) => service.label);

  return {
    "@context": "https://schema.org",
    "@type": ["Article", "CaseStudy"],
    "@id": `${url}#case-study`,
    headline: study.title,
    description: study.seoDescription,
    image: absoluteUrl(study.ogImage, content),
    url,
    dateModified: "2026-05-28",
    author: {
      "@id": `${getCanonicalBaseUrl(content)}/#organization`,
      name: siteMetadata.siteName,
    },
    publisher: {
      "@id": `${getCanonicalBaseUrl(content)}/#organization`,
      name: siteMetadata.siteName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(content.seoSettings.structuredData.logo, content),
      },
    },
    about: {
      "@type": "Organization",
      name: study.clientName,
      url: study.clientWebsite,
    },
    keywords: [
      study.category,
      study.audienceType,
      ...serviceNames,
    ].filter(Boolean).join(", "),
    mentions: study.metrics.map((metric) => ({
      "@type": "PropertyValue",
      name: metric.label,
      value: metric.value,
    })),
    mainEntityOfPage: url,
  };
}

export function buildCaseStudyWebPageSchema(content: SiteContent, study: SiteContent["caseStudies"]["studies"][number]) {
  const url = absoluteUrl(`/case-studies/${study.slug}`, content);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: study.seoTitle,
    description: study.seoDescription,
    inLanguage: "ro-RO",
    dateModified: "2026-05-28",
    isPartOf: {
      "@id": `${getCanonicalBaseUrl(content)}/#website`,
    },
    mainEntity: {
      "@id": `${url}#case-study`,
    },
    breadcrumb: {
      "@id": `${url}#breadcrumb`,
    },
  };
}

export function buildCaseStudyServiceSchema(content: SiteContent, study: SiteContent["caseStudies"]["studies"][number]) {
  const url = absoluteUrl(`/case-studies/${study.slug}`, content);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: study.category,
    description: study.excerpt,
    url,
    provider: {
      "@id": `${getCanonicalBaseUrl(content)}/#organization`,
      name: siteMetadata.siteName,
    },
    serviceType: study.category,
    hasOfferCatalog: study.servicesInvolved.length
      ? {
          "@type": "OfferCatalog",
          name: "Servicii implicate",
          itemListElement: study.servicesInvolved.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.label,
              url: absoluteUrl(service.href, content),
            },
          })),
        }
      : undefined,
    audience: {
      "@type": "BusinessAudience",
      audienceType: study.audienceType || study.category,
    },
    mainEntityOfPage: url,
  };
}

export function buildBlogCollectionSchema(content: SiteContent, posts: BlogPost[], path = "/blog", name = "Blog Digital Dot") {
  const pageSeo = getPageSeo(content, path);
  const url = pageSeo?.canonicalUrl || absoluteUrl(path, content);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name,
    description: pageSeo?.seoDescription || content.seoSettings.global.siteDescription,
    url,
    isPartOf: {
      "@id": `${getCanonicalBaseUrl(content)}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blog/${post.slug}`, content),
        item: {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: {
            "@type": "Person",
            name: post.authorName,
            url: absoluteUrl(`/blog/autor/${post.authorSlug}`, content),
          },
        },
      })),
    },
  };
}

export function buildCaseStudyCollectionSchema(content: SiteContent, studies: SiteContent["caseStudies"]["studies"]) {
  const url = absoluteUrl("/case-studies", content);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: content.caseStudies.title,
    description: content.caseStudies.description,
    url,
    isPartOf: {
      "@id": `${getCanonicalBaseUrl(content)}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: studies.map((study, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/case-studies/${study.slug}`, content),
        item: {
          "@type": "CaseStudy",
          headline: study.title,
          description: study.seoDescription,
          image: absoluteUrl(study.ogImage, content),
          about: {
            "@type": "Organization",
            name: study.clientName,
            url: study.clientWebsite,
          },
        },
      })),
    },
  };
}

export function buildAuthorSchema(content: SiteContent, author: { slug: string; name: string; role: string; bio: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${absoluteUrl(`/blog/autor/${author.slug}`, content)}#person`,
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: absoluteUrl(`/blog/autor/${author.slug}`, content),
    worksFor: {
      "@id": `${getCanonicalBaseUrl(content)}/#organization`,
      name: siteMetadata.siteName,
    },
  };
}
