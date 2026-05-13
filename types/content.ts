export type NavItem = {
  label: string;
  href: string;
};

export type ServiceHighlight = {
  title: string;
  description: string;
  bullets: string[];
};

export type PortfolioProject = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  metrics: string[];
  image: string;
  hasVideo?: boolean;
  href?: string;
  layoutVariant?: "hero" | "wide" | "tall" | "standard";
  highlightBadge?: string;
  client?: string;
  industry?: string;
  challenge?: string;
  strategy?: string;
  execution?: string[];
  results?: string[];
  mediaGallery?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  cta?: {
    label: string;
    href: string;
  };
};

export type BlogCategory = {
  key: string;
  label: string;
  description: string;
};

export type BlogTag = {
  key: string;
  label: string;
};

export type BlogFrontmatter = {
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  publishedAt: string;
  authorName: string;
  authorRole: string;
  authorSlug?: string;
  authorBio?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  featured?: boolean;
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
  content: string;
  readingTime: string;
};
