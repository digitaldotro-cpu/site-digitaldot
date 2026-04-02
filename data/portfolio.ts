import type { PortfolioProject } from "@/types/content";

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "ecom-launch-q4",
    title: "Lansare eCommerce Fashion",
    category: "Performance",
    excerpt:
      "Strategie full-funnel pe Meta + Google, cu focus pe ROAS și reducerea costului per conversie.",
    metrics: ["ROAS 4.8x", "CPA -37%", "+212% venit lunar"],
    image: "/images/portfolio/ecom-fashion.svg",
    hasVideo: true,
  },
  {
    slug: "restaurant-local-brand",
    title: "Rebrand & Social Media pentru lanț HoReCa",
    category: "Social Media",
    excerpt:
      "Poziționare premium, calendar editorial video-first și campanii de awareness local.",
    metrics: ["+168% reach", "+94% engagement", "+41% rezervări"],
    image: "/images/portfolio/horeca-brand.svg",
  },
  {
    slug: "clinic-growth-system",
    title: "Sistem de lead generation pentru clinică",
    category: "Branding",
    excerpt:
      "Audit, mesaje diferențiatoare și funnel de programări cu atribuție clară pe surse.",
    metrics: ["+123 leaduri/lună", "CPL -29%", "+62% conversie landing"],
    image: "/images/portfolio/clinic-growth.svg",
  },
  {
    slug: "shopify-conversion-upgrade",
    title: "Optimizare Shopify pentru conversii",
    category: "Web",
    excerpt:
      "Refacere UX, pagini produs orientate spre decizie și integrare tracking complet.",
    metrics: ["CR +32%", "AOV +18%", "Bounce -24%"],
    image: "/images/portfolio/shopify-upgrade.svg",
    hasVideo: true,
  },
];
