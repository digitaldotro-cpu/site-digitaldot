import { z } from "zod";

const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const socialLinkSchema = z.object({
  platform: z.enum(["instagram", "facebook", "linkedin", "tiktok"]),
  url: z.string().min(1),
  enabled: z.boolean().default(true),
});

const legalLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const footerSchema = z.object({
  logo: z.string().min(1).optional(),
  description: z.string().min(1),
  contactDescription: z.string().min(1),
  socialLinksTitle: z.string().min(1),
  socialLinks: z.array(socialLinkSchema).min(1),
  legalLinksTitle: z.string().min(1),
  legalLinks: z.array(legalLinkSchema).min(1),
  contactTitle: z.string().min(1),
  contactEmail: z.string().min(1),
  contactPhone: z.string().min(1),
  contactLocation: z.string().min(1),
  copyrightTemplate: z.string().min(1),
});

const longFormEntrySchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  highlight: z.boolean().default(false),
});

const serviceItemSchema = z.object({
  id: z.string().min(1),
  enabled: z.boolean().default(true),
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const processStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
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

const sectionKeySchema = z.enum([
  "hero",
  "positioning",
  "authority",
  "services",
  "instagramSection",
  "strategySection",
  "teamSection",
  "process",
  "clientFilter",
  "primaryCta",
  "contact",
  "footer",
]);

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
    navbarCtaHref: z.string().min(1),
    navigation: z.array(navItemSchema).min(1),
    footer: footerSchema,
  }),
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
      entries: z.array(longFormEntrySchema).min(1),
    }),
    authority: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      entries: z.array(longFormEntrySchema).min(1),
    }),
    services: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      items: z.array(serviceItemSchema).min(1),
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
    teamSection: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      subtitle: z.string().min(1),
      members: z.array(teamMemberSchema).min(1),
    }),
    process: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      steps: z.array(processStepSchema).min(1),
    }),
    clientFilter: z.object({
      enabled: z.boolean().default(true),
      title: z.string().min(1),
      worksWithTitle: z.string().min(1),
      worksWith: z.array(filterCriteriaSchema).min(1),
      notForTitle: z.string().min(1),
      notFor: z.array(filterCriteriaSchema).min(1),
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
    footer: z.object({
      enabled: z.boolean().default(true),
    }),
  }),
  cmsPages: z.record(z.string(), cmsPageMetaSchema).optional(),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type LandingSectionKey = z.infer<typeof sectionKeySchema>;
