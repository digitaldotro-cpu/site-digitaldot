import type { ComponentType } from "react";
import { BarChart3, Clapperboard, Code2, Search, Share2 } from "lucide-react";

export type SeoServicePage = {
  path: string;
  title: string;
  eyebrow: string;
  description: string;
  heroImage: string;
  icon: ComponentType<{ className?: string }>;
  outcomes: string[];
  process: Array<{ title: string; description: string }>;
  related: Array<{ label: string; href: string }>;
};

export const seoServicePages: SeoServicePage[] = [
  {
    path: "/social-media-management",
    title: "Social Media Management",
    eyebrow: "Conținut. Ritm. Încredere.",
    description:
      "Construim un sistem editorial coerent, cu producție, publicare și optimizare conectate la obiective reale de business.",
    heroImage: "/images/social-media/social-preview.svg",
    icon: Share2,
    outcomes: [
      "Strategie editorială lunară",
      "Calendar de conținut și direcție creativă",
      "Reels, carousels, stories și postări adaptate platformelor",
      "Raportare KPI și optimizare continuă",
    ],
    process: [
      {
        title: "Clarificăm poziționarea",
        description: "Definim mesajele, audiențele și diferențiatorii care trebuie să apară constant în comunicare.",
      },
      {
        title: "Construim sistemul editorial",
        description: "Planificăm teme, formate și frecvență astfel încât social media să susțină funnelul de vânzare.",
      },
      {
        title: "Optimizăm pe date",
        description: "Analizăm reach, engagement, retenție și conversii pentru a regla direcția lună de lună.",
      },
    ],
    related: [
      { label: "Google & Meta Ads", href: "/google-meta-ads" },
      { label: "Producție video", href: "/productie-video" },
      { label: "Case studies", href: "/case-studies" },
    ],
  },
  {
    path: "/google-meta-ads",
    title: "Google Ads & Meta Ads",
    eyebrow: "Paid media cu tracking corect",
    description:
      "Administrăm campanii de performance cu structură clară, date curate și optimizare pentru leaduri sau vânzări măsurabile.",
    heroImage: "/branding/references/ai-buget-marketing-sau-doar-sperante.png",
    icon: BarChart3,
    outcomes: [
      "Setup campanii Google Ads și Meta Ads",
      "GA4, Pixel, CAPI și evenimente de conversie",
      "Structură funnel pentru cold, warm și remarketing",
      "Optimizare bugete, audiențe, creative și landing pages",
    ],
    process: [
      {
        title: "Audităm datele",
        description: "Verificăm conturile, conversiile și istoricul pentru a elimina deciziile bazate pe semnale greșite.",
      },
      {
        title: "Mapăm funnelul",
        description: "Separăm obiectivele de awareness, considerație și conversie pentru mesaje mai curate.",
      },
      {
        title: "Optimizăm disciplinat",
        description: "Testăm ipoteze, urmărim CPA, CPL, ROAS și calitatea leadurilor, apoi ajustăm bugetele.",
      },
    ],
    related: [
      { label: "Website creation", href: "/website-creation" },
      { label: "SEO", href: "/seo" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    path: "/productie-video",
    title: "Producție Foto & Video",
    eyebrow: "Vizualuri pentru funnel",
    description:
      "Creăm active foto și video premium pentru reclame, social media, website și comunicare de brand, cu direcție clară și livrabile modulare.",
    heroImage: "/images/photo-video/camera-rig.svg",
    icon: Clapperboard,
    outcomes: [
      "Concept creativ și scenarii orientate spre conversie",
      "Filmări verticale și orizontale",
      "Cadre pentru ads, social media și website",
      "Post-producție și livrare adaptată pe platforme",
    ],
    process: [
      {
        title: "Definim rolul materialelor",
        description: "Stabilim unde vor fi folosite activele și ce trebuie să convingă fiecare format.",
      },
      {
        title: "Produse, oameni, spații",
        description: "Construim cadre care transmit clar diferența, atmosfera și promisiunea brandului.",
      },
      {
        title: "Livrăm modular",
        description: "Pregătim variante pentru campanii, social media, website și reutilizare în comunicarea curentă.",
      },
    ],
    related: [
      { label: "Social media", href: "/social-media-management" },
      { label: "Google & Meta Ads", href: "/google-meta-ads" },
      { label: "Case studies", href: "/case-studies" },
    ],
  },
  {
    path: "/website-creation",
    title: "Website Creation",
    eyebrow: "Claritate. Conversie. Indexare.",
    description:
      "Construim website-uri, landing pages și experiențe eCommerce care susțin decizia, performanța și indexarea semantică.",
    heroImage: "/images/portfolio/shopify-upgrade.svg",
    icon: Code2,
    outcomes: [
      "Structură UX orientată spre conversie",
      "Pagini de servicii și landing pages scalabile",
      "Tracking, formulare și integrare marketing",
      "SEO tehnic, performanță și arhitectură curată",
    ],
    process: [
      {
        title: "Arhitectură înainte de design",
        description: "Pornim de la obiective, audiențe, servicii și traseul decizional al utilizatorului.",
      },
      {
        title: "Construim pagini clare",
        description: "Fiecare secțiune are rol, ierarhie și conținut indexabil pentru utilizatori și crawleri.",
      },
      {
        title: "Pregătim scalarea",
        description: "Structura permite extindere cu blog, case studies, servicii noi și campanii viitoare.",
      },
    ],
    related: [
      { label: "SEO", href: "/seo" },
      { label: "Google & Meta Ads", href: "/google-meta-ads" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    path: "/seo",
    title: "SEO",
    eyebrow: "Google Search + AI Search",
    description:
      "Optimizăm site-uri pentru crawlabilitate, structură semantică, performanță, conținut indexabil și descoperire în sisteme AI.",
    heroImage: "/branding/references/door-strategy-wide.png",
    icon: Search,
    outcomes: [
      "Audit tehnic și semantic",
      "Metadata, schema, sitemap și robots",
      "Structură de conținut pentru servicii și articole",
      "Optimizare pentru Google, ChatGPT, Gemini, Claude și Perplexity",
    ],
    process: [
      {
        title: "Curățăm baza tehnică",
        description: "Verificăm indexarea, canonicals, sitemap, performanță, headings, linkuri interne și structured data.",
      },
      {
        title: "Clarificăm semantica",
        description: "Organizăm paginile, entitățile, serviciile și întrebările în forme ușor de înțeles.",
      },
      {
        title: "Construim autoritate",
        description: "Pregătim arhitectura pentru articole, categorii, case studies și pagini de servicii specializate.",
      },
    ],
    related: [
      { label: "Website creation", href: "/website-creation" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/#contact" },
    ],
  },
];

export const serviceOverviewLinks = seoServicePages.map((page) => ({
  label: page.title,
  href: page.path,
  description: page.description,
  icon: page.icon,
}));

export const aiReadablePages = [
  { label: "Homepage", href: "/" },
  ...serviceOverviewLinks.map(({ label, href }) => ({ label, href })),
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export function getSeoServicePage(path: string) {
  return seoServicePages.find((page) => page.path === path);
}
