export type TextAlign = "left" | "center" | "right";

export type ElementStyle = {
  fontSize: number;
  fontWeight: number;
  textAlign: TextAlign;
  color: string;
  backgroundColor: string;
  padding: number;
  margin: number;
  borderRadius: number;
};

export type TextElement = {
  id: string;
  type: "text";
  label: string;
  content: string;
  style: ElementStyle;
};

export type MediaElement = {
  id: string;
  type: "media";
  label: string;
  mediaId: string;
  caption?: string;
  style: ElementStyle;
};

export type ButtonElement = {
  id: string;
  type: "button";
  label: string;
  content: string;
  href: string;
  style: ElementStyle;
};

export type CtaElement = {
  id: string;
  type: "cta";
  label: string;
  content: string;
  subcontent: string;
  buttonLabel: string;
  buttonHref: string;
  style: ElementStyle;
};

export type SectionElement = TextElement | MediaElement | ButtonElement | CtaElement;

export type SectionType =
  | "hero"
  | "text-image"
  | "gallery"
  | "cta"
  | "testimonials"
  | "blog-preview";

export type PageSection = {
  id: string;
  name: string;
  type: SectionType;
  elements: SectionElement[];
  settings: {
    backgroundColor: string;
    paddingY: number;
    borderRadius: number;
    visible: boolean;
  };
};

export type CmsPage = {
  id: string;
  name: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
  sections: PageSection[];
};

export type MediaItem = {
  id: string;
  name: string;
  type: "image" | "video";
  url: string;
  tags: string[];
  createdAt: string;
  provider?: "local" | "cloudinary";
  publicId?: string;
};

export type BlogPostItem = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  updatedAt: string;
  coverMediaId?: string;
};

export type CmsData = {
  pages: CmsPage[];
  media: MediaItem[];
  blog: BlogPostItem[];
  settings: {
    siteTitle: string;
    primaryColor: string;
  };
};
