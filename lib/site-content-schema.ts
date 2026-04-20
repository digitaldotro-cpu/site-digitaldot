import { z } from "zod";

const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const ctaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  primaryLabel: z.string().min(1),
  primaryHref: z.string().min(1),
  secondaryLabel: z.string().optional(),
  secondaryHref: z.string().optional(),
});

const heroHighlightSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const serviceHighlightSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  href: z.string().min(1),
});

const testimonialSchema = z.object({
  quote: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
});

const paidAdsSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  statValue: z.string().min(1),
  statDescription: z.string().min(1),
});

const homeProcessStepSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const complementaryServiceSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const problemCardSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const deliverableCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  variant: z.enum(["large", "small", "accent"]).default("small"),
});

const processStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const caseStudySchema = z.object({
  category: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  href: z.string().min(1),
});

const servicePageSchema = z.object({
  heroBadge: z.string().min(1),
  heroTitle: z.string().min(1),
  heroTitleFontSize: z.number().min(10).max(120).optional(),
  heroDescription: z.string().min(1),
  heroCtaLabel: z.string().min(1),
  heroSecondaryCtaLabel: z.string().min(1).optional(),
  heroSecondaryCtaHref: z.string().min(1).optional(),
  heroImage: z.string().min(1).optional(),
  sectionOneTitle: z.string().min(1),
  sectionOneItems: z.array(z.string().min(1)).min(1),
  sectionTwoTitle: z.string().min(1),
  sectionTwoItems: z.array(z.string().min(1)).min(1),
  sectionThreeTitle: z.string().min(1),
  sectionThreeItems: z.array(z.string().min(1)).min(1),
  sectionFourTitle: z.string().min(1),
  sectionFourItems: z.array(z.string().min(1)).min(1),
  problemsIntro: z.string().min(1).optional(),
  problems: z.array(problemCardSchema).optional(),
  deliverablesIntro: z.string().min(1).optional(),
  deliverables: z.array(deliverableCardSchema).optional(),
  processIntro: z.string().min(1).optional(),
  processSteps: z.array(processStepSchema).optional(),
  caseStudiesTitle: z.string().min(1).optional(),
  caseStudiesIntro: z.string().min(1).optional(),
  caseStudies: z.array(caseStudySchema).optional(),
  sectionVisibility: z
    .object({
      hero: z.boolean().default(true),
      problems: z.boolean().default(true),
      deliverables: z.boolean().default(true),
      process: z.boolean().default(true),
      caseStudies: z.boolean().default(true),
      finalCta: z.boolean().default(true),
    })
    .optional(),
  finalCta: ctaSchema,
});

const portfolioProjectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  excerpt: z.string().min(1),
  metrics: z.array(z.string().min(1)).min(1),
  image: z.string().min(1),
  hasVideo: z.boolean().optional(),
  href: z.string().min(1).optional(),
  layoutVariant: z.enum(["hero", "wide", "tall", "standard"]).optional(),
  highlightBadge: z.string().min(1).optional(),
});

const portfolioFilterSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  categories: z.array(z.string().min(1)).min(1),
});

const portfolioVideoItemSchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  image: z.string().min(1),
  href: z.string().min(1).optional(),
});

const portfolioCaseHighlightSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  context: z.string().min(1),
  approach: z.string().min(1),
  metric: z.string().min(1),
});

const portfolioLogoSchema = z.object({
  name: z.string().min(1),
  image: z.string().min(1),
  href: z.string().min(1).optional(),
});

const cmsPageMetaSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  seoTitle: z.string().min(3),
  seoDescription: z.string().min(10),
});

export const siteContentSchema = z.object({
  global: z.object({
    brandName: z.string().min(1),
    headerLogo: z.string().min(1).optional(),
    favicon: z.string().min(1).optional(),
    navbarCtaLabel: z.string().min(1),
    navigation: z.array(navItemSchema).min(1),
    footer: z.object({
      description: z.string().min(1),
      quickLinksTitle: z.string().min(1),
      quickLinks: z.array(navItemSchema).min(1),
      contactTitle: z.string().min(1),
      contactEmail: z.string().min(1),
      contactPhone: z.string().min(1),
      contactLocation: z.string().min(1),
      copyrightTemplate: z.string().min(1),
    }),
  }),
  home: z.object({
    hero: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      titleFontSize: z.number().min(10).max(120).optional(),
      description: z.string().min(1),
      primaryCtaLabel: z.string().min(1),
      primaryCtaHref: z.string().min(1),
      secondaryCtaLabel: z.string().min(1),
      secondaryCtaHref: z.string().min(1),
      highlightsTitle: z.string().min(1),
      highlights: z.array(heroHighlightSchema).min(1),
    }),
    primaryServicesTitle: z.string().min(1),
    primaryServicesDescription: z.string().min(1),
    primaryServices: z.array(serviceHighlightSchema).min(1),
    secondaryServicesTitle: z.string().min(1),
    secondaryServicesDescription: z.string().min(1),
    secondaryServices: z.array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    ),
    paidAds: paidAdsSchema,
    portfolioPreview: z.object({
      title: z.string().min(1),
      viewAllLabel: z.string().min(1),
    }),
    process: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      steps: z.array(homeProcessStepSchema).min(1),
    }),
    additionalServicesTitle: z.string().min(1),
    additionalServices: z.array(z.string().min(1)).min(1),
    complementaryServicesTitle: z.string().min(1),
    complementaryServices: z.array(complementaryServiceSchema).min(1),
    trustTitle: z.string().min(1),
    testimonials: z.array(testimonialSchema).min(1),
    finalCta: ctaSchema,
  }),
  services: z.object({
    socialMedia: servicePageSchema,
    photoVideo: servicePageSchema,
    strategy: servicePageSchema,
  }),
  portfolioPage: z.object({
    heroBadge: z.string().min(1).optional(),
    heroTitle: z.string().min(1),
    heroTitleFontSize: z.number().min(10).max(120).optional(),
    heroDescription: z.string().min(1),
    heroCtaLabel: z.string().min(1),
    heroCtaHref: z.string().min(1).optional(),
    filterTitle: z.string().min(1),
    filterDescription: z.string().min(1),
    filters: z.array(portfolioFilterSchema).optional(),
    defaultFilter: z.string().min(1).optional(),
    projectsTitle: z.string().min(1).optional(),
    projectsDescription: z.string().min(1).optional(),
    caseStudiesTitle: z.string().min(1),
    caseStudiesDescription: z.string().min(1),
    videoBlockTitle: z.string().min(1),
    videoBlockDescription: z.string().min(1),
    videoShowcaseCtaLabel: z.string().min(1).optional(),
    videoShowcaseCtaHref: z.string().min(1).optional(),
    featuredVideo: portfolioVideoItemSchema.optional(),
    videoItems: z.array(portfolioVideoItemSchema).optional(),
    caseHighlightsTitle: z.string().min(1).optional(),
    caseHighlightsIntro: z.string().min(1).optional(),
    caseHighlights: z.array(portfolioCaseHighlightSchema).optional(),
    socialProofTitle: z.string().min(1).optional(),
    socialProofIntro: z.string().min(1).optional(),
    socialProofLogos: z.array(portfolioLogoSchema).optional(),
    sectionVisibility: z
      .object({
        hero: z.boolean().default(true),
        filters: z.boolean().default(true),
        projects: z.boolean().default(true),
        videoShowcase: z.boolean().default(true),
        caseHighlights: z.boolean().default(true),
        socialProof: z.boolean().default(true),
        finalCta: z.boolean().default(true),
      })
      .optional(),
    finalCta: ctaSchema,
  }),
  portfolioProjects: z.array(portfolioProjectSchema).min(1),
  blogPage: z.object({
    heroTitle: z.string().min(1),
    heroTitleFontSize: z.number().min(10).max(120).optional(),
    heroDescription: z.string().min(1),
    featuredBadge: z.string().min(1),
    newsletterTitle: z.string().min(1),
    newsletterDescription: z.string().min(1),
    newsletterPlaceholder: z.string().min(1),
    newsletterButtonLabel: z.string().min(1),
    finalCta: ctaSchema,
  }),
  contactPage: z.object({
    heroTitle: z.string().min(1),
    heroTitleFontSize: z.number().min(10).max(120).optional(),
    heroDescription: z.string().min(1),
    formTitle: z.string().min(1),
    formDescription: z.string().min(1),
    contactTitle: z.string().min(1),
    contactEmail: z.string().min(1),
    contactPhone: z.string().min(1),
    contactLocation: z.string().min(1),
    trustTitle: z.string().min(1),
    trustItems: z.array(z.string().min(1)).min(1),
    finalCta: ctaSchema,
  }),
  cmsPages: z.record(z.string(), cmsPageMetaSchema).optional(),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
