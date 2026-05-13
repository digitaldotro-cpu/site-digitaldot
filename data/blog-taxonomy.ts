import type { BlogCategory, BlogTag } from "@/types/content";

export const blogCategories: BlogCategory[] = [
  {
    key: "lead-generation",
    label: "Lead Generation",
    description: "Tactici pentru atragerea lead-urilor calificate.",
  },
  {
    key: "social-media",
    label: "Social Media",
    description: "Strategii pentru conținut și creștere organică.",
  },
  {
    key: "paid-media",
    label: "Paid Media",
    description: "Optimizare pentru reclame Google și Meta.",
  },
  {
    key: "strategie",
    label: "Strategie",
    description: "Cadre de lucru pentru decizii de marketing mai bune.",
  },
  {
    key: "branding",
    label: "Branding",
    description: "Poziționare, consistență și arhitectură de brand.",
  },
  {
    key: "seo-ai",
    label: "SEO & AI",
    description: "Vizibilitate organică, AI SEO și structură semantică.",
  },
  {
    key: "productie-video",
    label: "Producție Video",
    description: "Percepție de brand, storytelling și active video.",
  },
];

export const blogTags: BlogTag[] = [
  { key: "funnel", label: "Funnel" },
  { key: "content", label: "Content" },
  { key: "meta-ads", label: "Meta Ads" },
  { key: "google-ads", label: "Google Ads" },
  { key: "kpi", label: "KPI" },
  { key: "strategie", label: "Strategie" },
  { key: "audit", label: "Audit" },
  { key: "leaduri", label: "Leaduri" },
  { key: "branding", label: "Branding" },
  { key: "pozitionare", label: "Poziționare" },
  { key: "productie-video", label: "Producție Video" },
  { key: "seo", label: "SEO" },
  { key: "ai-seo", label: "AI SEO" },
  { key: "website-creation", label: "Website Creation" },
  { key: "strategie-marketing", label: "Strategie de marketing" },
  { key: "brand-infrastructure", label: "Brand Infrastructure" },
];

export function getCategoryLabel(key: string) {
  return blogCategories.find((item) => item.key === key)?.label ?? key;
}

export function getTagLabel(key: string) {
  return blogTags.find((item) => item.key === key)?.label ?? key;
}
