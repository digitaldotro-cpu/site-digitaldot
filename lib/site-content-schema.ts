import { z } from "zod";

const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  enabled: z.boolean().default(true),
});

const socialLinkSchema = z.object({
  platform: z.enum(["instagram", "facebook", "linkedin", "tiktok", "google-business"]),
  url: z.string().min(1),
  enabled: z.boolean().default(true),
});

const legalLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const footerRegionalLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  enabled: z.boolean().default(true),
});

const footerServiceLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  enabled: z.boolean().default(true),
});

const footerResourceLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  enabled: z.boolean().default(true),
});

const footerSchema = z.object({
  logo: z.string().min(1).optional(),
  description: z.string().min(1),
  contactDescription: z.string().min(1),
  socialLinksTitle: z.string().min(1),
  socialLinks: z.array(socialLinkSchema).min(1),
  serviceLinksTitle: z.string().min(1).default("Servicii"),
  serviceLinks: z.array(footerServiceLinkSchema).default([]),
  resourceLinksTitle: z.string().min(1).default("Resurse"),
  resourceLinks: z.array(footerResourceLinkSchema).default([]),
  regionalLinksTitle: z.string().min(1).default("Agenție de Marketing"),
  regionalLinks: z.array(footerRegionalLinkSchema).default([]),
  legalLinksTitle: z.string().min(1),
  legalLinks: z.array(legalLinkSchema).min(1),
  contactTitle: z.string().min(1),
  contactEmail: z.string().min(1),
  contactPhone: z.string().min(1),
  contactLocation: z.string().min(1),
  copyrightTemplate: z.string().min(1),
});

const whatsappButtonSchema = z.object({
  enabled: z.boolean().default(true),
  phoneNumber: z.string().min(1),
  url: z.string().min(1),
  icon: z.string().min(1).default("whatsapp"),
  position: z.enum(["bottom-right", "bottom-left"]).default("bottom-right"),
  openInNewTab: z.boolean().default(true),
  ariaLabel: z.string().min(1),
});

const callButtonSchema = z.object({
  enabled: z.boolean().default(true),
  phoneNumber: z.string().min(1),
  telLink: z.string().min(1),
  icon: z.string().min(1).default("phone"),
  position: z.enum(["bottom-right", "bottom-left"]).default("bottom-left"),
  ariaLabel: z.string().min(1),
});

const scrollBehaviorSchema = z.object({
  hideOnScrollDown: z.boolean().default(true),
  scrollThreshold: z.number().min(0).max(500).default(80),
  transitionDuration: z.number().min(100).max(1000).default(300),
});

const longFormEntrySchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  highlight: z.boolean().default(false),
});

const editorialParagraphSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

const quoteBlockSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

const comparisonColumnSchema = z.object({
  title: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

const serviceItemSchema = z.object({
  id: z.string().min(1),
  enabled: z.boolean().default(true),
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const proofMetricSchema = z.object({
  id: z.string().min(1),
  value: z.string().min(1),
  description: z.string().min(1).optional(),
});

const caseStudyActionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

const portfolioExampleSchema = z.object({
  id: z.string().min(1),
  businessType: z.string().min(1),
  problem: z.string().min(1),
  intervention: z.string().min(1),
  result: z.string().min(1),
});

const caseStudyMetricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const caseStudyServiceLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const caseStudyTextBlockSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(20),
});

const caseStudyListBlockSchema = caseStudyTextBlockSchema.extend({
  items: z.array(z.string().min(1)).default([]),
});

const caseStudyInterventionItemSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(20),
});

const caseStudySchema = z.object({
  slug: z.string().min(1),
  clientName: z.string().min(1),
  category: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(20),
  heroIntro: z.string().min(20),
  clientWebsite: z.string().min(1),
  period: z.string().min(1),
  audienceType: z.string().min(1).optional(),
  heroImage: z.string().min(1),
  ogImage: z.string().min(1),
  imageScale: z.number().min(0.5).max(4).optional(),
  cardMetrics: z.array(caseStudyMetricSchema).min(1),
  metrics: z.array(caseStudyMetricSchema).min(1),
  servicesInvolved: z.array(caseStudyServiceLinkSchema).default([]),
  context: caseStudyTextBlockSchema,
  challenge: caseStudyListBlockSchema,
  intervention: z.object({
    title: z.string().min(1),
    text: z.string().min(20),
    items: z.array(caseStudyInterventionItemSchema).min(1),
  }),
  results: z.object({
    title: z.string().min(1),
    intro: z.string().min(20),
    items: z.array(z.string().min(1)).min(1),
  }),
  highlightCampaign: caseStudyTextBlockSchema.optional(),
  conclusion: caseStudyTextBlockSchema,
  cta: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(20),
    buttonText: z.string().min(1),
    buttonLink: z.string().min(1),
  }),
  seoTitle: z.string().min(3),
  seoDescription: z.string().min(10),
});

const processStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const partnerLogoSchema = z.object({
  id: z.string().min(1),
  enabled: z.boolean().default(true),
  src: z.string().min(1),
  alt: z.string().min(1),
  url: z.string().optional(),
});

const teamSocialPlatformSchema = z.enum(["facebook", "linkedin", "instagram"]);

const teamSocialLinkSchema = z.object({
  platform: teamSocialPlatformSchema,
  url: z.string().min(1),
});

const teamMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  avatar: z.string().optional(),
  avatarLink: z.string().optional(),
  focusChannels: z.array(teamSocialPlatformSchema).min(1),
  socials: z.array(teamSocialLinkSchema).min(1),
});

const filterCriteriaSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

const formFieldSchema = z.object({
  label: z.string().min(1),
  placeholder: z.string().min(1),
});

const serviceOptionSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const legalContentSectionSchema = z.object({
  id: z.string().min(1),
  enabled: z.boolean().default(true),
  title: z.string().min(1),
  body: z.string().min(1),
});

const legalContactLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  enabled: z.boolean().default(true),
});

const legalPageSchema = z.object({
  settings: z.object({
    enabled: z.boolean().default(true),
    seoTitle: z.string().min(3),
    seoDescription: z.string().min(10),
    lastUpdated: z.string().min(1),
  }),
  hero: z.object({
    badge: z.string().min(1),
    title: z.string().min(1),
    paragraph: z.string().min(1),
  }),
  legalContent: z.object({
    title: z.string().min(1),
    showTableOfContents: z.boolean().default(true),
    sections: z.array(legalContentSectionSchema).min(1),
  }),
  contactCard: z.object({
    enabled: z.boolean().default(true),
    title: z.string().min(1),
    email: z.string().min(1),
    companyName: z.string().min(1),
    location: z.string().min(1),
    links: z.array(legalContactLinkSchema).default([]),
  }),
  finalCta: z.object({
    enabled: z.boolean().default(true),
    title: z.string().min(1),
    paragraph: z.string().min(1),
    buttonLabel: z.string().min(1),
    buttonUrl: z.string().min(1),
  }),
});

const robotsSettingsSchema = z.object({
  index: z.boolean().default(true),
  follow: z.boolean().default(true),
  googleBotIndex: z.boolean().default(true),
  googleBotFollow: z.boolean().default(true),
});

const pageSeoSchema = z.object({
  path: z.string().min(1),
  label: z.string().min(1),
  seoTitle: z.string().min(3),
  seoDescription: z.string().min(10),
  ogTitle: z.string().min(3).optional(),
  ogDescription: z.string().min(10).optional(),
  ogImage: z.string().min(1).optional(),
  canonicalUrl: z.string().min(1).optional(),
  robots: robotsSettingsSchema.default({
    index: true,
    follow: true,
    googleBotIndex: true,
    googleBotFollow: true,
  }),
});

const semanticKeywordGroupSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1),
});

const businessAddressSchema = z.object({
  streetAddress: z.string().default(""),
  addressLocality: z.string().min(1),
  addressRegion: z.string().default(""),
  postalCode: z.string().default(""),
  addressCountry: z.string().min(1),
});

const structuredServiceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(10),
  url: z.string().min(1),
});

const faqItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(3),
  answer: z.string().min(10),
});

const faqGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  assignedPaths: z.array(z.string().min(1)).default([]),
  items: z.array(faqItemSchema).min(1),
});

const serviceProblemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(20),
});

const serviceApproachStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(20),
});

const serviceRelatedLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const serviceSeoPageSchema = z.object({
  id: z.string().min(1),
  path: z.string().min(1),
  enabled: z.boolean().default(true),
  title: z.string().min(1),
  eyebrow: z.string().min(1),
  heroImage: z.string().min(1),
  intro: z.string().min(20),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  explanationTitle: z.string().min(1),
  explanationParagraphs: z.array(z.string().min(40)).min(3),
  problemsTitle: z.string().min(1),
  problems: z.array(serviceProblemSchema).min(3),
  approachTitle: z.string().min(1),
  approachIntro: z.string().min(20),
  approachSteps: z.array(serviceApproachStepSchema).min(3),
  authorityTitle: z.string().min(1),
  authorityParagraphs: z.array(z.string().min(40)).min(3),
  relatedTitle: z.string().min(1),
  relatedLinks: z.array(serviceRelatedLinkSchema).default([]),
  cta: z.object({
    title: z.string().min(1),
    description: z.string().min(20),
    primaryLabel: z.string().min(1),
    primaryHref: z.string().min(1),
    secondaryLabel: z.string().min(1),
    secondaryHref: z.string().min(1),
  }),
});

const serviceSeoSchema = z.object({
  enabled: z.boolean().default(true),
  footerTitle: z.string().min(1).default("Servicii"),
  pages: z.array(serviceSeoPageSchema).min(1),
});

const editorialRegistryItemSchema = z.object({
  title: z.string().min(1),
  href: z.string().min(1),
  description: z.string().min(10),
});

const editorialSeoSchema = z.object({
  enabled: z.boolean().default(true),
  blogTitle: z.string().min(1),
  blogDescription: z.string().min(10),
  authors: z.array(z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    role: z.string().min(1),
    bio: z.string().min(10),
  })).default([]),
  topicClusters: z.array(z.object({
    label: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().min(10),
    links: z.array(editorialRegistryItemSchema).default([]),
  })).default([]),
  articleRegistry: z.array(editorialRegistryItemSchema).default([]),
  caseStudyRegistry: z.array(editorialRegistryItemSchema).default([]),
});

const seoSettingsSchema = z.object({
  global: z.object({
    siteTitle: z.string().min(3),
    siteDescription: z.string().min(10),
    defaultOgImage: z.string().min(1),
    defaultKeywords: z.array(z.string().min(1)).default([]),
    canonicalBaseUrl: z.string().min(1),
    robots: robotsSettingsSchema,
  }),
  pages: z.array(pageSeoSchema).min(1),
  aiSeo: z.object({
    llmsTxt: z.string().min(10),
    allowedCrawlers: z.array(z.string().min(1)).min(1),
    semanticKeywordGroups: z.array(semanticKeywordGroupSchema).default([]),
  }),
  structuredData: z.object({
    organizationName: z.string().min(1),
    legalName: z.string().min(1),
    logo: z.string().min(1),
    websiteUrl: z.string().min(1),
    email: z.string().min(1),
    phone: z.string().min(1),
    address: businessAddressSchema,
    socialLinks: z.array(socialLinkSchema).min(1),
    services: z.array(structuredServiceSchema).min(1),
  }),
  faqGroups: z.array(faqGroupSchema).default([]),
});

const regionalServiceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  href: z.string().min(1),
  description: z.string().min(20),
});

const regionalInternalLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const regionalSemanticSummarySchema = z.object({
  title: z.string().min(1),
  points: z.array(z.string().min(1)).min(2),
});

const regionalServiceExpansionItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  futurePath: z.string().min(1),
  context: z.string().min(20),
});

const regionalPageSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  cityName: z.string().min(1),
  countyName: z.string().min(1),
  enabled: z.boolean().default(true),
  seoTitle: z.string().min(3),
  seoDescription: z.string().min(10),
  ogTitle: z.string().min(3),
  ogDescription: z.string().min(10),
  ogImage: z.string().min(1),
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().min(20),
    ctaLabel: z.string().min(1),
    ctaHref: z.string().min(1),
  }),
  positioning: z.object({
    title: z.string().min(1),
    paragraphs: z.array(z.string().min(20)).min(2),
  }),
  regionalContext: z.object({
    title: z.string().min(1),
    paragraphs: z.array(z.string().min(20)).min(2),
    sectors: z.array(z.string().min(1)).min(2),
  }),
  semanticSummary: regionalSemanticSummarySchema.optional(),
  services: z.array(regionalServiceSchema).min(1),
  serviceExpansion: z.object({
    title: z.string().min(1),
    intro: z.string().min(20),
    items: z.array(regionalServiceExpansionItemSchema).min(1),
  }).optional(),
  worksWith: z.object({
    title: z.string().min(1),
    paragraphs: z.array(z.string().min(20)).min(2),
    criteria: z.array(z.string().min(1)).min(2),
  }),
  faqs: z.array(faqItemSchema).min(1),
  cta: z.object({
    title: z.string().min(1),
    description: z.string().min(20),
    primaryLabel: z.string().min(1),
    primaryHref: z.string().min(1),
    secondaryLabel: z.string().min(1),
    secondaryHref: z.string().min(1),
  }),
  internalLinks: z.array(regionalInternalLinkSchema).default([]),
});

const regionalSeoSchema = z.object({
  enabled: z.boolean().default(true),
  footerTitle: z.string().min(1),
  hub: z.object({
    path: z.string().min(1),
    seoTitle: z.string().min(3),
    seoDescription: z.string().min(10),
    ogTitle: z.string().min(3),
    ogDescription: z.string().min(10),
    ogImage: z.string().min(1),
    hero: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      intro: z.string().min(20),
      ctaLabel: z.string().min(1),
      ctaHref: z.string().min(1),
    }),
    overviewTitle: z.string().min(1),
    overviewParagraphs: z.array(z.string().min(20)).min(2),
    serviceTitle: z.string().min(1),
    regionTitle: z.string().min(1),
    cta: z.object({
      title: z.string().min(1),
      description: z.string().min(20),
      primaryLabel: z.string().min(1),
      primaryHref: z.string().min(1),
    }),
  }),
  pages: z.array(regionalPageSchema).min(1),
});

const sectionKeySchema = z.enum([
  "hero",
  "positioning",
  "proofMetrics",
  "miniCaseStudy",
  "proofCta",
  "authority",
  "brandValueSection",
  "services",
  "portfolioExamples",
  "instagramSection",
  "strategySection",
  "teamSection",
  "process",
  "clientFilter",
  "partnersSection",
  "primaryCta",
  "contact",
]);



export const siteContentSchema = z.object({
  global: z.object({
    brandName: z.string().min(1),
    gtmId: z.string().optional(),
    headerLogo: z.string().min(1).optional(),
    favicon: z.string().min(1).optional(),
    navbarCtaLabel: z.string().min(1),
    navbarCtaHref: z.string().min(1),
    navigation: z.array(navItemSchema).min(1),
    scrollBehavior: scrollBehaviorSchema,
    whatsappButton: whatsappButtonSchema,
    callButton: callButtonSchema,
    footer: footerSchema,
  }),
  seoSettings: seoSettingsSchema,
  editorialSeo: editorialSeoSchema,
  serviceSeo: serviceSeoSchema,
  regionalSeo: regionalSeoSchema,
  landing: z.object({
    seoTitle: z.string().min(3),
    seoDescription: z.string().min(10),
    sectionOrder: z.array(sectionKeySchema).min(1),
    hero: z.object({
      enabled: z.boolean().default(true),
      badge: z.string().min(1),
      headlineVariants: z.array(z.string().min(1)).min(1),
      activeHeadlineIndex: z.number().int().min(0).default(0),
      subheadline: z.string().min(1),
      ctaText: z.string().min(1),
      ctaLink: z.string().min(1),
      image: z.string().min(1),
      imagePosition: z.enum(["left", "right"]).default("right"),
      overlayIntensity: z.number().min(0).max(100).default(72),
      imageVisibility: z.boolean().default(true),
      supportingPoints: z.array(z.string().min(1)).min(1),
    }),
    positioning: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      highlightedWords: z.array(z.string().min(1)).default([]),
      introParagraph: z.string().min(1),
      editorialParagraphs: z.array(editorialParagraphSchema).min(1),
      quoteBlocks: z.array(quoteBlockSchema).min(1),
      closingParagraph: z.string().min(1),
      optionalHighlightedPhrases: z.array(z.string().min(1)).default([]),
      comparison: z.object({
        left: comparisonColumnSchema,
        right: comparisonColumnSchema,
      }).optional(),
      layout: z.object({
        spacingPreset: z.enum(["compact", "standard", "cinematic"]).default("cinematic"),
        alignment: z.enum(["left", "center"]).default("left"),
        backgroundVariant: z.enum(["subtle", "glow", "glass"]).default("glow"),
      }),
      cta: z.object({
        enabled: z.boolean().default(true),
        text: z.string().min(1),
        link: z.string().min(1),
      }),
    }),
    proofMetrics: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      subtitle: z.string().min(1),
      metrics: z.array(proofMetricSchema).min(1),
    }),
    miniCaseStudy: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      clientLabel: z.string().min(1),
      clientValue: z.string().min(1),
      problemLabel: z.string().min(1),
      problem: z.string().min(1),
      interventionLabel: z.string().min(1),
      intervention: z.array(caseStudyActionSchema).min(1),
      resultLabel: z.string().min(1),
      result: z.string().min(1),
    }),
    proofCta: z.object({
      enabled: z.boolean().default(true),
      headline: z.string().min(1),
      supportText: z.string().min(1),
      buttonText: z.string().min(1),
      buttonLink: z.string().min(1),
    }),
    authority: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      entries: z.array(longFormEntrySchema).min(1),
    }),
    brandValueSection: z.object({
      enabled: z.boolean().default(true),
      heading: z.string().min(1),
      paragraph: z.string().min(1),
      image: z.string().min(1),
      imageAlt: z.string().min(1),
      imageLink: z.string().min(1),
      openInNewTab: z.boolean().default(true),
      ariaLabel: z.string().min(1),
      hoverGlow: z.boolean().default(true),
    }),
    services: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      subtitle: z.string().min(1).optional(),
      items: z.array(serviceItemSchema).min(1),
    }),
    portfolioExamples: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      subtitle: z.string().min(1),
      examples: z.array(portfolioExampleSchema).default([]),
    }),
    instagramSection: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      description: z.string().min(1),
      image: z.string().min(1),
      ctaText: z.string().min(1),
      ctaLink: z.string().min(1),
    }),
    strategySection: z.object({
      enabled: z.boolean().default(true),
      image: z.string().min(1),
      overlayIntensity: z.number().min(0).max(100).default(50),
      text: z.string().min(1),
      textAlignment: z.enum(["left", "center"]).default("left"),
      paddingBottom: z.number().min(0).max(400).default(120),
    }),
    visualBreak: z.object({
      enabled: z.boolean().default(false),
      image: z.string().min(1).default("/branding/references/door-strategy-wide.png"),
      overlayText: z.string().min(1).default("Strategie clară. Execuție disciplinată. Rezultate măsurabile."),
    }).default({
      enabled: false,
      image: "/branding/references/door-strategy-wide.png",
      overlayText: "Strategie clară. Execuție disciplinată. Rezultate măsurabile.",
    }),
    teamSection: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      subtitle: z.string().min(1),
      members: z.array(teamMemberSchema).min(1),
    }),
    process: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      subtitle: z.string().min(1).optional(),
      steps: z.array(processStepSchema).min(1),
    }),
    clientFilter: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      subtitle: z.string().min(1).optional(),
      introText: z.string().min(1).optional(),
      worksWithTitle: z.string().min(1),
      worksWith: z.array(filterCriteriaSchema).min(1),
      notForTitle: z.string().min(1),
      notFor: z.array(filterCriteriaSchema).min(1),
    }),
    partnersSection: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      subtitle: z.string().min(1),
      logos: z.array(partnerLogoSchema).min(1),
      tickerDirection: z.enum(["rtl", "ltr"]).default("rtl"),
      tickerSpeed: z.number().min(8).max(120).default(36),
      pauseOnHover: z.boolean().default(true),
    }),
    primaryCta: z.object({
      enabled: z.boolean().default(true),
      headline: z.string().min(1),
      supportText: z.string().min(1),
      buttonText: z.string().min(1),
      buttonLink: z.string().min(1),
    }),
    contact: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      description: z.string().min(1),
      fields: z.object({
        name: formFieldSchema,
        email: formFieldSchema,
        phone: formFieldSchema,
        service: formFieldSchema,
        message: formFieldSchema,
      }),
      serviceOptions: z.array(serviceOptionSchema).min(1),
      buttonText: z.string().min(1),
      buttonLoadingText: z.string().min(1),
      successMessage: z.string().min(1),
      errorMessage: z.string().min(1),
      validationMessages: z.object({
        nameMin: z.string().min(1),
        emailInvalid: z.string().min(1),
        phoneMin: z.string().min(1),
        serviceRequired: z.string().min(1),
        messageMin: z.string().min(1),
      }),
    }),
  }),
  caseStudies: z.object({
    enabled: z.boolean().default(true),
    title: z.string().min(1),
    description: z.string().min(10),
    studies: z.array(caseStudySchema).default([]),
  }).default({
    enabled: true,
    title: "Studii de caz reale",
    description: "Rezultate construite prin strategie, conținut, campanii plătite și optimizare constantă.",
    studies: [],
  }),
  privacyPolicy: legalPageSchema,
  termsConditions: legalPageSchema,
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type LandingSectionKey = z.infer<typeof sectionKeySchema>;
export type LegalPageContent = z.infer<typeof legalPageSchema>;
export type FaqGroupContent = z.infer<typeof faqGroupSchema>;
export type ServiceSeoContent = z.infer<typeof serviceSeoSchema>;
export type ServiceSeoPageContent = z.infer<typeof serviceSeoPageSchema>;
export type RegionalSeoContent = z.infer<typeof regionalSeoSchema>;
export type RegionalPageContent = z.infer<typeof regionalPageSchema>;
