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
];

export function getCategoryLabel(key: string) {
  return blogCategories.find((item) => item.key === key)?.label ?? key;
}

export function getTagLabel(key: string) {
  return blogTags.find((item) => item.key === key)?.label ?? key;
}
