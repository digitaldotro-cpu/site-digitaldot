import { z } from "zod";

const elementStyleSchema = z.object({
  fontSize: z.number().min(10).max(120),
  fontWeight: z.number().min(100).max(900),
  textAlign: z.enum(["left", "center", "right"]),
  color: z.string().min(3),
  backgroundColor: z.string().min(3),
  padding: z.number().min(0).max(200),
  margin: z.number().min(0).max(200),
  borderRadius: z.number().min(0).max(999),
});

const textElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("text"),
  label: z.string().min(1),
  content: z.string().min(1),
  style: elementStyleSchema,
});

const mediaElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("media"),
  label: z.string().min(1),
  mediaId: z.string().min(1),
  caption: z.string().optional(),
  style: elementStyleSchema,
});

const buttonElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("button"),
  label: z.string().min(1),
  content: z.string().min(1),
  href: z.string().min(1),
  style: elementStyleSchema,
});

const ctaElementSchema = z.object({
  id: z.string().min(1),
  type: z.literal("cta"),
  label: z.string().min(1),
  content: z.string().min(1),
  subcontent: z.string().min(1),
  buttonLabel: z.string().min(1),
  buttonHref: z.string().min(1),
  style: elementStyleSchema,
});

const sectionElementSchema = z.discriminatedUnion("type", [
  textElementSchema,
  mediaElementSchema,
  buttonElementSchema,
  ctaElementSchema,
]);

const pageSectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["hero", "text-image", "gallery", "cta", "testimonials", "blog-preview"]),
  elements: z.array(sectionElementSchema).min(1),
  settings: z.object({
    backgroundColor: z.string().min(3),
    paddingY: z.number().min(0).max(240),
    borderRadius: z.number().min(0).max(120),
    visible: z.boolean().default(true),
  }),
});

const pageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  seoTitle: z.string().min(3),
  seoDescription: z.string().min(10),
  status: z.enum(["draft", "published"]),
  sections: z.array(pageSectionSchema).min(1),
});

const mediaItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["image", "video"]),
  url: z.string().min(1),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().min(1),
  provider: z.enum(["local", "cloudinary"]).optional(),
  publicId: z.string().optional(),
});

const blogPostSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  content: z.string().min(10),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  published: z.boolean(),
  updatedAt: z.string().min(1),
  coverMediaId: z.string().optional(),
});

export const cmsDataSchema = z.object({
  pages: z.array(pageSchema).min(1),
  media: z.array(mediaItemSchema),
  blog: z.array(blogPostSchema),
  settings: z.object({
    siteTitle: z.string().min(1),
    primaryColor: z.string().min(3),
  }),
});

export type CmsDataInput = z.infer<typeof cmsDataSchema>;
