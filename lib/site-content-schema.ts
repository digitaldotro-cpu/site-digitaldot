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

const servicePageSchema = z.object({
  heroBadge: z.string().min(1),
  heroTitle: z.string().min(1),
  heroDescription: z.string().min(1),
  heroCtaLabel: z.string().min(1),
  sectionOneTitle: z.string().min(1),
  sectionOneItems: z.array(z.string().min(1)).min(1),
  sectionTwoTitle: z.string().min(1),
  sectionTwoItems: z.array(z.string().min(1)).min(1),
  sectionThreeTitle: z.string().min(1),
  sectionThreeItems: z.array(z.string().min(1)).min(1),
  sectionFourTitle: z.string().min(1),
  sectionFourItems: z.array(z.string().min(1)).min(1),
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
});

export const siteContentSchema = z.object({
  global: z.object({
    brandName: z.string().min(1),
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
    additionalServicesTitle: z.string().min(1),
    additionalServices: z.array(z.string().min(1)).min(1),
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
    heroTitle: z.string().min(1),
    heroDescription: z.string().min(1),
    heroCtaLabel: z.string().min(1),
    filterTitle: z.string().min(1),
    filterDescription: z.string().min(1),
    caseStudiesTitle: z.string().min(1),
    caseStudiesDescription: z.string().min(1),
    videoBlockTitle: z.string().min(1),
    videoBlockDescription: z.string().min(1),
    finalCta: ctaSchema,
  }),
  portfolioProjects: z.array(portfolioProjectSchema).min(1),
  blogPage: z.object({
    heroTitle: z.string().min(1),
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
});

export type SiteContent = z.infer<typeof siteContentSchema>;
