import type { CmsData, CmsPage, PageSection, SectionElement } from "@/types/cms";
import type { SiteContent } from "@/lib/site-content-schema";

type ServicePageContent = SiteContent["services"]["socialMedia"];
type StrategyPageContent = SiteContent["services"]["strategy"];
type PortfolioPageContent = SiteContent["portfolioPage"];
type BlogPageContent = SiteContent["blogPage"];
type ContactPageContent = SiteContent["contactPage"];
type GlobalContent = SiteContent["global"];
type CmsPageDraft = Omit<CmsPage, "seoTitle" | "seoDescription">;

function normalizePageSlug(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "/";
  }
  if (trimmed === "/") {
    return "/";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function defaultSeoDescription(pageName: string) {
  return `Informații despre ${pageName} în ecosistemul Digital Dot.`;
}

function style(partial?: Partial<SectionElement["style"]>) {
  return {
    fontSize: 18,
    fontWeight: 500,
    textAlign: "left" as const,
    color: "#ffffff",
    backgroundColor: "transparent",
    padding: 0,
    margin: 0,
    borderRadius: 0,
    ...partial,
  };
}

function textElement(
  id: string,
  label: string,
  content: string,
  partialStyle?: Partial<SectionElement["style"]>,
): SectionElement {
  return {
    id,
    type: "text",
    label,
    content,
    style: style(partialStyle),
  };
}

function buttonElement(
  id: string,
  label: string,
  content: string,
  href: string,
  partialStyle?: Partial<SectionElement["style"]>,
): SectionElement {
  return {
    id,
    type: "button",
    label,
    content,
    href,
    style: style(partialStyle),
  };
}

function mediaElement(
  id: string,
  label: string,
  mediaId: string,
  caption = "",
  partialStyle?: Partial<SectionElement["style"]>,
): SectionElement {
  return {
    id,
    type: "media",
    label,
    mediaId,
    caption,
    style: style(partialStyle),
  };
}

function ctaElement(
  id: string,
  content: string,
  subcontent: string,
  buttonLabel: string,
  buttonHref: string,
): SectionElement {
  return {
    id,
    type: "cta",
    label: "CTA",
    content,
    subcontent,
    buttonLabel,
    buttonHref,
    style: style({ textAlign: "center", fontSize: 34, fontWeight: 700, padding: 22, borderRadius: 26 }),
  };
}

function section(
  id: string,
  name: string,
  type: PageSection["type"],
  elements: SectionElement[],
  visible = true,
): PageSection {
  return {
    id,
    name,
    type,
    elements,
    settings: {
      backgroundColor: "#0f171c",
      paddingY: 56,
      borderRadius: 24,
      visible,
    },
  };
}

function findPage(data: CmsData, pageId: string) {
  return data.pages.find((page) => page.id === pageId);
}

function findSection(data: CmsData, pageId: string, sectionId: string) {
  return findPage(data, pageId)?.sections.find((item) => item.id === sectionId);
}

function findText(data: CmsData, pageId: string, sectionId: string, elementId: string) {
  const element = findSection(data, pageId, sectionId)?.elements.find((item) => item.id === elementId);
  if (!element || element.type !== "text") {
    return undefined;
  }
  return element.content;
}

function findButton(data: CmsData, pageId: string, sectionId: string, elementId: string) {
  const element = findSection(data, pageId, sectionId)?.elements.find((item) => item.id === elementId);
  if (!element || element.type !== "button") {
    return undefined;
  }
  return element;
}

function findMedia(data: CmsData, pageId: string, sectionId: string, elementId: string) {
  const element = findSection(data, pageId, sectionId)?.elements.find((item) => item.id === elementId);
  if (!element || element.type !== "media") {
    return undefined;
  }
  return element;
}

function findCta(data: CmsData, pageId: string, sectionId: string, elementId: string) {
  const element = findSection(data, pageId, sectionId)?.elements.find((item) => item.id === elementId);
  if (!element || element.type !== "cta") {
    return undefined;
  }
  return element;
}

function findIndexedTexts(
  data: CmsData,
  pageId: string,
  sectionId: string,
  prefix: string,
): string[] {
  const elements = findSection(data, pageId, sectionId)?.elements ?? [];

  return elements
    .filter((item): item is Extract<SectionElement, { type: "text" }> => item.type === "text")
    .filter((item) => item.id.startsWith(prefix))
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
    .map((item) => item.content)
    .filter(Boolean);
}

function findSectionElements(data: CmsData, pageId: string, sectionId: string) {
  return findSection(data, pageId, sectionId)?.elements ?? [];
}

function findSectionVisibility(data: CmsData, pageId: string, sectionId: string, fallback = true) {
  return findSection(data, pageId, sectionId)?.settings.visible ?? fallback;
}

function findMediaUrlById(data: CmsData, mediaId: string | undefined) {
  if (!mediaId) {
    return undefined;
  }
  return data.media.find((item) => item.id === mediaId)?.url;
}

function pickItems(nextItems: string[], fallback: string[]) {
  return nextItems.length > 0 ? nextItems : fallback;
}

function parseMultiline(text: string | undefined, fallback: string[]) {
  if (!text) {
    return fallback;
  }

  const items = text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

function parseIndexedPairs(
  data: CmsData,
  pageId: string,
  sectionId: string,
  leftPrefix: string,
  rightPrefix: string,
) {
  const left = findIndexedTexts(data, pageId, sectionId, leftPrefix);
  const right = findIndexedTexts(data, pageId, sectionId, rightPrefix);
  const max = Math.max(left.length, right.length);

  return Array.from({ length: max })
    .map((_, index) => ({
      left: left[index]?.trim(),
      right: right[index]?.trim(),
    }))
    .filter((item) => item.left || item.right);
}

function normalizeStrategyProblems(source: StrategyPageContent) {
  return (
    source.problems ??
    source.sectionOneItems.map((item, index) => ({
      icon: ["Target", "Gauge", "BarChart3"][index] ?? "Lightbulb",
      title: `Problemă ${index + 1}`,
      description: item,
    }))
  );
}

function normalizeStrategyDeliverables(source: StrategyPageContent) {
  return (
    source.deliverables ??
    source.sectionTwoItems.map((item, index) => ({
      title: item,
      description: "Deliverable strategic pentru execuție și optimizare.",
      variant: (index === 0 ? "large" : index === 2 ? "accent" : "small") as
        | "large"
        | "small"
        | "accent",
    }))
  );
}

function normalizeStrategyProcess(source: StrategyPageContent) {
  return (
    source.processSteps ??
    source.sectionThreeItems.map((item, index) => ({
      title: `Etapa ${index + 1}`,
      description: item,
    }))
  );
}

function normalizeStrategyCaseStudies(source: StrategyPageContent) {
  return (
    source.caseStudies ??
    source.sectionFourItems.map((item, index) => ({
      category: "Case Study",
      title: `Proiect ${index + 1}`,
      description: item,
      image: "/images/portfolio/ecom-fashion.svg",
      href: "/portofoliu",
    }))
  );
}

function serviceHeroMediaId(pageId: "social" | "photo-video") {
  return pageId === "social" ? "media-social-hero" : "media-photo-hero";
}

function servicePageToCmsPage(
  id: "social" | "photo-video",
  name: string,
  slug: string,
  source: ServicePageContent,
): CmsPageDraft {
  return {
    id,
    name,
    slug,
    status: "published",
    sections: [
      section(
        `${id}-hero`,
        "Hero",
        "hero",
        [
          textElement(`${id}-hero-badge`, "Badge", source.heroBadge, { fontSize: 12, color: "#66fcf1" }),
          textElement(`${id}-hero-title`, "Title", source.heroTitle, { fontSize: 50, fontWeight: 800 }),
          textElement(`${id}-hero-description`, "Description", source.heroDescription, {
            fontSize: 22,
            color: "#c6c6c6",
          }),
          buttonElement(`${id}-hero-cta`, "CTA", source.heroCtaLabel, "/contacteaza-ne", {
            backgroundColor: "#66fcf1",
            color: "#0b0c10",
            textAlign: "center",
            padding: 14,
            borderRadius: 999,
            fontWeight: 700,
          }),
          buttonElement(
            `${id}-hero-cta-secondary`,
            "CTA secundar",
            source.heroSecondaryCtaLabel ?? "Vezi portofoliu",
            source.heroSecondaryCtaHref ?? "/portofoliu",
            {
              backgroundColor: "#10181d",
              color: "#ffffff",
              textAlign: "center",
              padding: 14,
              borderRadius: 999,
              fontWeight: 600,
            },
          ),
          mediaElement(
            `${id}-hero-media`,
            "Imagine Hero",
            serviceHeroMediaId(id),
            "Visual hero",
            { borderRadius: 26 },
          ),
        ],
        source.sectionVisibility?.hero ?? true,
      ),
      section(
        `${id}-one`,
        "Section One",
        "text-image",
        [
          textElement(`${id}-one-title`, "Title", source.sectionOneTitle, { fontSize: 34, fontWeight: 700 }),
          ...source.sectionOneItems.map((item, index) =>
            textElement(`${id}-one-item-${index}`, `Item ${index + 1}`, item, { color: "#c6c6c6" }),
          ),
        ],
        source.sectionVisibility?.problems ?? true,
      ),
      section(
        `${id}-two`,
        "Section Two",
        "gallery",
        [
          textElement(`${id}-two-title`, "Title", source.sectionTwoTitle, { fontSize: 34, fontWeight: 700 }),
          ...source.sectionTwoItems.map((item, index) =>
            textElement(`${id}-two-item-${index}`, `Item ${index + 1}`, item, { color: "#c6c6c6" }),
          ),
        ],
        source.sectionVisibility?.deliverables ?? true,
      ),
      section(
        `${id}-three`,
        "Section Three",
        "text-image",
        [
          textElement(`${id}-three-title`, "Title", source.sectionThreeTitle, { fontSize: 34, fontWeight: 700 }),
          ...source.sectionThreeItems.map((item, index) =>
            textElement(`${id}-three-item-${index}`, `Item ${index + 1}`, item, { color: "#c6c6c6" }),
          ),
        ],
        source.sectionVisibility?.process ?? true,
      ),
      section(
        `${id}-four`,
        "Section Four",
        "text-image",
        [
          textElement(`${id}-four-title`, "Title", source.sectionFourTitle, { fontSize: 34, fontWeight: 700 }),
          ...source.sectionFourItems.map((item, index) =>
            textElement(`${id}-four-item-${index}`, `Item ${index + 1}`, item, { color: "#c6c6c6" }),
          ),
        ],
        source.sectionVisibility?.caseStudies ?? true,
      ),
      section(
        `${id}-cta`,
        "Final CTA",
        "cta",
        [
          ctaElement(
            `${id}-cta-main`,
            source.finalCta.title,
            source.finalCta.description,
            source.finalCta.primaryLabel,
            source.finalCta.primaryHref,
          ),
        ],
        source.sectionVisibility?.finalCta ?? true,
      ),
    ],
  };
}

function globalPageToCmsPage(source: GlobalContent): CmsPageDraft {
  return {
    id: "global",
    name: "Global (Navbar + Footer)",
    slug: "/",
    status: "published",
    sections: [
      section("global-navbar", "Navbar", "text-image", [
        textElement("global-brand-name", "Nume brand", source.brandName, { fontSize: 30, fontWeight: 700 }),
        textElement("global-navbar-cta-label", "Label CTA Navbar", source.navbarCtaLabel),
        ...source.navigation.flatMap((item, index) => [
          textElement(`global-nav-label-${index}`, `Link ${index + 1} - label`, item.label),
          textElement(`global-nav-href-${index}`, `Link ${index + 1} - href`, item.href, { color: "#c6c6c6" }),
        ]),
      ]),
      section("global-footer", "Footer", "text-image", [
        textElement("global-footer-description", "Descriere", source.footer.description),
        textElement("global-footer-quick-title", "Titlu Quick Links", source.footer.quickLinksTitle),
        ...source.footer.quickLinks.flatMap((item, index) => [
          textElement(`global-footer-link-label-${index}`, `Footer link ${index + 1} - label`, item.label),
          textElement(
            `global-footer-link-href-${index}`,
            `Footer link ${index + 1} - href`,
            item.href,
            { color: "#c6c6c6" },
          ),
        ]),
        textElement("global-footer-contact-title", "Titlu Contact", source.footer.contactTitle),
        textElement("global-footer-contact-email", "Email", source.footer.contactEmail),
        textElement("global-footer-contact-phone", "Telefon", source.footer.contactPhone),
        textElement("global-footer-contact-location", "Locație", source.footer.contactLocation),
        textElement("global-footer-copyright", "Copyright template", source.footer.copyrightTemplate, {
          color: "#c6c6c6",
        }),
      ]),
    ],
  };
}

function getPortfolioFilters(page: PortfolioPageContent) {
  return (
    page.filters ?? [
      { label: "Toate", value: "toate", categories: ["*"] },
      { label: "Social Media", value: "social-media", categories: ["Social Media"] },
      { label: "Video Production", value: "video-production", categories: ["Branding", "Web"] },
      { label: "Ads / Strategy", value: "ads-strategy", categories: ["Performance", "Branding"] },
    ]
  );
}

function getPortfolioFeaturedVideo(
  page: PortfolioPageContent,
  projects: SiteContent["portfolioProjects"],
) {
  return (
    page.featuredVideo ?? {
      label: "Featured Video",
      title: page.videoBlockTitle,
      description: page.videoBlockDescription,
      image: projects[0]?.image ?? "/images/portfolio/ecom-fashion.svg",
      href: "/contacteaza-ne",
    }
  );
}

function getPortfolioVideoItems(
  page: PortfolioPageContent,
  projects: SiteContent["portfolioProjects"],
) {
  return (
    page.videoItems ??
    projects.slice(0, 3).map((project, index) => ({
      label: `Video ${index + 1}`,
      title: project.title,
      description: project.excerpt,
      image: project.image,
      href: project.href ?? "/portofoliu",
    }))
  );
}

function getPortfolioCaseHighlights(
  page: PortfolioPageContent,
  projects: SiteContent["portfolioProjects"],
) {
  return (
    page.caseHighlights ??
    projects.slice(0, 3).map((project, index) => ({
      icon: ["Target", "ChartLine", "Sparkles"][index] ?? "Target",
      title: project.title,
      context: project.excerpt,
      approach: "Am combinat strategie, producție și optimizare continuă.",
      metric: project.metrics[0] ?? "KPI disponibil la request",
    }))
  );
}

function getPortfolioSocialProof(
  page: PortfolioPageContent,
  projects: SiteContent["portfolioProjects"],
) {
  return (
    page.socialProofLogos ??
    projects.slice(0, 4).map((project) => ({
      name: project.title,
      image: project.image,
      href: project.href ?? "/portofoliu",
    }))
  );
}

function portfolioPageToCmsPage(
  page: PortfolioPageContent,
  projects: SiteContent["portfolioProjects"],
): CmsPageDraft {
  const filters = getPortfolioFilters(page);
  const featuredVideo = getPortfolioFeaturedVideo(page, projects);
  const videoItems = getPortfolioVideoItems(page, projects);
  const caseHighlights = getPortfolioCaseHighlights(page, projects);
  const socialProof = getPortfolioSocialProof(page, projects);

  return {
    id: "portfolio",
    name: "Portofoliu",
    slug: "/portofoliu",
    status: "published",
    sections: [
      section(
        "portfolio-hero",
        "Hero",
        "hero",
        [
          textElement("portfolio-hero-badge", "Badge", page.heroBadge ?? "Portofoliu Curat", {
            fontSize: 12,
            color: "#66fcf1",
          }),
          textElement("portfolio-hero-title", "Titlu", page.heroTitle, { fontSize: 50, fontWeight: 800 }),
          textElement("portfolio-hero-description", "Descriere", page.heroDescription, { color: "#c6c6c6" }),
          buttonElement("portfolio-hero-cta", "CTA", page.heroCtaLabel, page.heroCtaHref ?? "/contacteaza-ne", {
            backgroundColor: "#66fcf1",
            color: "#0b0c10",
            textAlign: "center",
            padding: 14,
            borderRadius: 999,
            fontWeight: 700,
          }),
        ],
        page.sectionVisibility?.hero ?? true,
      ),
      section(
        "portfolio-filter",
        "Filter Section",
        "text-image",
        [
          textElement("portfolio-filter-title", "Titlu", page.filterTitle, { fontSize: 34, fontWeight: 700 }),
          textElement("portfolio-filter-description", "Descriere", page.filterDescription, { color: "#c6c6c6" }),
          textElement("portfolio-filter-default", "Default filter", page.defaultFilter ?? "toate", {
            fontSize: 12,
            color: "#66fcf1",
          }),
          ...filters.flatMap((item, index) => [
            textElement(`portfolio-filter-${index}-label`, `Filter ${index + 1} - label`, item.label),
            textElement(`portfolio-filter-${index}-value`, `Filter ${index + 1} - value`, item.value, {
              fontSize: 12,
              color: "#66fcf1",
            }),
            textElement(
              `portfolio-filter-${index}-categories`,
              `Filter ${index + 1} - categories`,
              item.categories.join("\n"),
              { color: "#c6c6c6" },
            ),
          ]),
        ],
        page.sectionVisibility?.filters ?? true,
      ),
      section(
        "portfolio-projects",
        "Project Grid",
        "gallery",
        [
          textElement("portfolio-projects-title", "Titlu secțiune", page.projectsTitle ?? "Proiecte", {
            fontSize: 34,
            fontWeight: 700,
          }),
          textElement(
            "portfolio-projects-description",
            "Descriere secțiune",
            page.projectsDescription ?? "Selecție proiecte relevante pentru rezultate business.",
            { color: "#c6c6c6" },
          ),
          ...projects.flatMap((project, index) => [
            textElement(`portfolio-project-${index}-slug`, `Project ${index + 1} - slug`, project.slug, {
              fontSize: 12,
              color: "#66fcf1",
            }),
            textElement(`portfolio-project-${index}-title`, `Project ${index + 1} - title`, project.title, {
              fontSize: 24,
              fontWeight: 700,
            }),
            textElement(`portfolio-project-${index}-category`, `Project ${index + 1} - category`, project.category),
            textElement(
              `portfolio-project-${index}-excerpt`,
              `Project ${index + 1} - excerpt`,
              project.excerpt,
              { color: "#c6c6c6" },
            ),
            textElement(
              `portfolio-project-${index}-metrics`,
              `Project ${index + 1} - metrics`,
              project.metrics.join("\n"),
              { color: "#c6c6c6" },
            ),
            textElement(
              `portfolio-project-${index}-has-video`,
              `Project ${index + 1} - hasVideo`,
              project.hasVideo ? "true" : "false",
              { fontSize: 12, color: "#66fcf1" },
            ),
            textElement(
              `portfolio-project-${index}-href`,
              `Project ${index + 1} - href`,
              project.href ?? "/portofoliu",
              { color: "#c6c6c6" },
            ),
            textElement(
              `portfolio-project-${index}-layout`,
              `Project ${index + 1} - layout`,
              project.layoutVariant ?? "standard",
              { fontSize: 12, color: "#66fcf1" },
            ),
            textElement(
              `portfolio-project-${index}-badge`,
              `Project ${index + 1} - badge`,
              project.highlightBadge ?? "Featured",
              { fontSize: 12, color: "#66fcf1" },
            ),
            mediaElement(
              `portfolio-project-${index}-media`,
              `Project ${index + 1} - image`,
              `media-portfolio-${index}`,
              project.title,
              { borderRadius: 20 },
            ),
          ]),
        ],
        page.sectionVisibility?.projects ?? true,
      ),
      section(
        "portfolio-video-showcase",
        "Video Showcase",
        "gallery",
        [
          textElement("portfolio-video-title", "Titlu", page.videoBlockTitle, { fontSize: 34, fontWeight: 700 }),
          textElement("portfolio-video-description", "Descriere", page.videoBlockDescription, { color: "#c6c6c6" }),
          buttonElement(
            "portfolio-video-cta",
            "CTA video",
            page.videoShowcaseCtaLabel ?? "Vezi toate proiectele",
            page.videoShowcaseCtaHref ?? "/portofoliu",
            { color: "#66fcf1", fontWeight: 700 },
          ),
          textElement("portfolio-video-featured-label", "Featured - label", featuredVideo.label, {
            fontSize: 12,
            color: "#66fcf1",
          }),
          textElement("portfolio-video-featured-title", "Featured - title", featuredVideo.title, {
            fontSize: 24,
            fontWeight: 700,
          }),
          textElement(
            "portfolio-video-featured-description",
            "Featured - description",
            featuredVideo.description ?? "",
            { color: "#c6c6c6" },
          ),
          buttonElement(
            "portfolio-video-featured-link",
            "Featured - link",
            "Deschide proiect",
            featuredVideo.href ?? "/portofoliu",
            { color: "#66fcf1", fontWeight: 700 },
          ),
          mediaElement(
            "portfolio-video-featured-media",
            "Featured - image",
            "media-portfolio-video-featured",
            featuredVideo.title,
            { borderRadius: 20 },
          ),
          ...videoItems.flatMap((item, index) => [
            textElement(`portfolio-video-item-${index}-label`, `Video item ${index + 1} - label`, item.label, {
              fontSize: 12,
              color: "#66fcf1",
            }),
            textElement(`portfolio-video-item-${index}-title`, `Video item ${index + 1} - title`, item.title, {
              fontWeight: 700,
            }),
            textElement(
              `portfolio-video-item-${index}-description`,
              `Video item ${index + 1} - description`,
              item.description ?? "",
              { color: "#c6c6c6" },
            ),
            buttonElement(
              `portfolio-video-item-${index}-link`,
              `Video item ${index + 1} - link`,
              "Vezi",
              item.href ?? "/portofoliu",
              { color: "#66fcf1", fontWeight: 700 },
            ),
            mediaElement(
              `portfolio-video-item-${index}-media`,
              `Video item ${index + 1} - image`,
              `media-portfolio-video-item-${index}`,
              item.title,
              { borderRadius: 20 },
            ),
          ]),
        ],
        page.sectionVisibility?.videoShowcase ?? true,
      ),
      section(
        "portfolio-case-highlights",
        "Case Highlights",
        "text-image",
        [
          textElement(
            "portfolio-case-title",
            "Titlu",
            page.caseHighlightsTitle ?? page.caseStudiesTitle,
            { fontSize: 34, fontWeight: 700 },
          ),
          textElement(
            "portfolio-case-description",
            "Descriere",
            page.caseHighlightsIntro ?? page.caseStudiesDescription,
            { color: "#c6c6c6" },
          ),
          ...caseHighlights.flatMap((item, index) => [
            textElement(`portfolio-case-${index}-icon`, `Case ${index + 1} - icon`, item.icon, {
              fontSize: 12,
              color: "#66fcf1",
            }),
            textElement(`portfolio-case-${index}-title`, `Case ${index + 1} - title`, item.title, {
              fontWeight: 700,
            }),
            textElement(`portfolio-case-${index}-context`, `Case ${index + 1} - context`, item.context, {
              color: "#c6c6c6",
            }),
            textElement(`portfolio-case-${index}-approach`, `Case ${index + 1} - approach`, item.approach, {
              color: "#c6c6c6",
            }),
            textElement(`portfolio-case-${index}-metric`, `Case ${index + 1} - metric`, item.metric, {
              color: "#66fcf1",
            }),
          ]),
        ],
        page.sectionVisibility?.caseHighlights ?? true,
      ),
      section(
        "portfolio-social-proof",
        "Social Proof",
        "gallery",
        [
          textElement("portfolio-social-title", "Titlu", page.socialProofTitle ?? "Social proof", {
            fontSize: 30,
            fontWeight: 700,
          }),
          textElement(
            "portfolio-social-description",
            "Descriere",
            page.socialProofIntro ?? "Branduri partenere.",
            { color: "#c6c6c6" },
          ),
          ...socialProof.flatMap((item, index) => [
            textElement(`portfolio-logo-${index}-name`, `Logo ${index + 1} - name`, item.name),
            textElement(`portfolio-logo-${index}-href`, `Logo ${index + 1} - href`, item.href ?? "/portofoliu", {
              color: "#c6c6c6",
            }),
            mediaElement(
              `portfolio-logo-${index}-media`,
              `Logo ${index + 1} - image`,
              `media-portfolio-logo-${index}`,
              item.name,
              { borderRadius: 14 },
            ),
          ]),
        ],
        page.sectionVisibility?.socialProof ?? true,
      ),
      section(
        "portfolio-cta",
        "Final CTA",
        "cta",
        [
          ctaElement(
            "portfolio-cta-main",
            page.finalCta.title,
            page.finalCta.description,
            page.finalCta.primaryLabel,
            page.finalCta.primaryHref,
          ),
        ],
        page.sectionVisibility?.finalCta ?? true,
      ),
    ],
  };
}

function blogPageToCmsPage(page: BlogPageContent): CmsPageDraft {
  return {
    id: "blog-page",
    name: "Blog Page",
    slug: "/blog",
    status: "published",
    sections: [
      section("blog-hero", "Hero", "hero", [
        textElement("blog-hero-title", "Titlu", page.heroTitle, { fontSize: 50, fontWeight: 800 }),
        textElement("blog-hero-description", "Descriere", page.heroDescription, { color: "#c6c6c6" }),
      ]),
      section("blog-featured", "Featured", "text-image", [
        textElement("blog-featured-badge", "Featured Badge", page.featuredBadge),
      ]),
      section("blog-newsletter", "Newsletter", "text-image", [
        textElement("blog-newsletter-title", "Titlu", page.newsletterTitle, { fontSize: 34, fontWeight: 700 }),
        textElement("blog-newsletter-description", "Descriere", page.newsletterDescription, { color: "#c6c6c6" }),
        textElement("blog-newsletter-placeholder", "Placeholder", page.newsletterPlaceholder),
        buttonElement("blog-newsletter-button", "Buton", page.newsletterButtonLabel, "#", {
          backgroundColor: "#66fcf1",
          color: "#0b0c10",
          textAlign: "center",
          padding: 12,
          borderRadius: 999,
          fontWeight: 700,
        }),
      ]),
      section("blog-cta", "Final CTA", "cta", [
        ctaElement(
          "blog-cta-main",
          page.finalCta.title,
          page.finalCta.description,
          page.finalCta.primaryLabel,
          page.finalCta.primaryHref,
        ),
      ]),
    ],
  };
}

function contactPageToCmsPage(page: ContactPageContent): CmsPageDraft {
  return {
    id: "contact",
    name: "Contact",
    slug: "/contacteaza-ne",
    status: "published",
    sections: [
      section("contact-hero", "Hero", "hero", [
        textElement("contact-hero-title", "Titlu", page.heroTitle, { fontSize: 50, fontWeight: 800 }),
        textElement("contact-hero-description", "Descriere", page.heroDescription, { color: "#c6c6c6" }),
      ]),
      section("contact-form", "Form Block", "text-image", [
        textElement("contact-form-title", "Titlu", page.formTitle, { fontSize: 30, fontWeight: 700 }),
        textElement("contact-form-description", "Descriere", page.formDescription, { color: "#c6c6c6" }),
      ]),
      section("contact-details", "Contact Details", "text-image", [
        textElement("contact-details-title", "Titlu", page.contactTitle, { fontSize: 30, fontWeight: 700 }),
        textElement("contact-details-email", "Email", page.contactEmail),
        textElement("contact-details-phone", "Telefon", page.contactPhone),
        textElement("contact-details-location", "Locație", page.contactLocation),
      ]),
      section("contact-trust", "Trust", "text-image", [
        textElement("contact-trust-title", "Titlu", page.trustTitle, { fontSize: 30, fontWeight: 700 }),
        ...page.trustItems.map((item, index) =>
          textElement(`contact-trust-item-${index}`, `Trust item ${index + 1}`, item, { color: "#c6c6c6" }),
        ),
      ]),
      section("contact-cta", "Final CTA", "cta", [
        ctaElement(
          "contact-cta-main",
          page.finalCta.title,
          page.finalCta.description,
          page.finalCta.primaryLabel,
          page.finalCta.primaryHref,
        ),
      ]),
    ],
  };
}

function strategyServicePageToCmsPage(source: StrategyPageContent): CmsPageDraft {
  const problems = normalizeStrategyProblems(source);
  const deliverables = normalizeStrategyDeliverables(source);
  const processSteps = normalizeStrategyProcess(source);
  const caseStudies = normalizeStrategyCaseStudies(source);

  return {
    id: "strategy",
    name: "Strategie de marketing",
    slug: "/servicii/strategie-marketing",
    status: "published",
    sections: [
      section(
        "strategy-hero",
        "Hero",
        "hero",
        [
          textElement("strategy-hero-badge", "Badge", source.heroBadge, { fontSize: 12, color: "#66fcf1" }),
          textElement("strategy-hero-title", "Titlu", source.heroTitle, { fontSize: 50, fontWeight: 800 }),
          textElement("strategy-hero-description", "Descriere", source.heroDescription, {
            fontSize: 22,
            color: "#c6c6c6",
          }),
          buttonElement("strategy-hero-primary", "CTA principal", source.heroCtaLabel, "/contacteaza-ne", {
            backgroundColor: "#66fcf1",
            color: "#0b0c10",
            textAlign: "center",
            padding: 14,
            borderRadius: 999,
            fontWeight: 700,
          }),
          buttonElement(
            "strategy-hero-secondary",
            "CTA secundar",
            source.heroSecondaryCtaLabel ?? "Vezi portofoliu",
            source.heroSecondaryCtaHref ?? "/portofoliu",
            {
              backgroundColor: "#10181d",
              color: "#ffffff",
              textAlign: "center",
              padding: 14,
              borderRadius: 999,
              fontWeight: 600,
            },
          ),
          mediaElement(
            "strategy-hero-media",
            "Imagine Hero",
            "media-strategy-hero",
            "Vizual strategie",
            { borderRadius: 28 },
          ),
        ],
        source.sectionVisibility?.hero ?? true,
      ),
      section(
        "strategy-problems",
        "Probleme",
        "gallery",
        [
          textElement("strategy-problems-title", "Titlu secțiune", source.sectionOneTitle, {
            fontSize: 36,
            fontWeight: 700,
          }),
          textElement(
            "strategy-problems-intro",
            "Intro secțiune",
            source.problemsIntro ??
              "Unde se pierde potențialul? Identificăm blocajele critice din mesaj, funnel și execuție.",
            { color: "#c6c6c6" },
          ),
          ...problems.flatMap((item, index) => [
            textElement(`strategy-problem-${index}-icon`, `Problemă ${index + 1} - icon`, item.icon, {
              fontSize: 14,
              color: "#66fcf1",
            }),
            textElement(`strategy-problem-${index}-title`, `Problemă ${index + 1} - titlu`, item.title, {
              fontSize: 24,
              fontWeight: 700,
            }),
            textElement(
              `strategy-problem-${index}-description`,
              `Problemă ${index + 1} - descriere`,
              item.description,
              { color: "#c6c6c6" },
            ),
          ]),
        ],
        source.sectionVisibility?.problems ?? true,
      ),
      section(
        "strategy-deliverables",
        "Deliverables",
        "gallery",
        [
          textElement("strategy-deliverables-title", "Titlu secțiune", source.sectionTwoTitle, {
            fontSize: 36,
            fontWeight: 700,
          }),
          textElement(
            "strategy-deliverables-intro",
            "Intro secțiune",
            source.deliverablesIntro ??
              "Un sistem strategic aplicat, orientat pe decizie și impact în business.",
            { color: "#c6c6c6" },
          ),
          ...deliverables.flatMap((item, index) => [
            textElement(`strategy-deliverable-${index}-title`, `Card ${index + 1} - titlu`, item.title, {
              fontSize: 24,
              fontWeight: 700,
            }),
            textElement(
              `strategy-deliverable-${index}-description`,
              `Card ${index + 1} - descriere`,
              item.description,
              { color: "#c6c6c6" },
            ),
            textElement(
              `strategy-deliverable-${index}-variant`,
              `Card ${index + 1} - variant`,
              item.variant,
              { fontSize: 12, color: "#66fcf1" },
            ),
          ]),
        ],
        source.sectionVisibility?.deliverables ?? true,
      ),
      section(
        "strategy-process",
        "Proces",
        "text-image",
        [
          textElement("strategy-process-title", "Titlu secțiune", source.sectionThreeTitle, {
            fontSize: 36,
            fontWeight: 700,
          }),
          textElement(
            "strategy-process-intro",
            "Intro secțiune",
            source.processIntro ??
              "Metodologia noastră menține focusul pe priorități și pe rezultate măsurabile.",
            { color: "#c6c6c6" },
          ),
          ...processSteps.flatMap((item, index) => [
            textElement(`strategy-process-step-${index}-title`, `Pas ${index + 1} - titlu`, item.title, {
              fontSize: 20,
              fontWeight: 700,
            }),
            textElement(
              `strategy-process-step-${index}-description`,
              `Pas ${index + 1} - descriere`,
              item.description,
              { color: "#c6c6c6" },
            ),
          ]),
        ],
        source.sectionVisibility?.process ?? true,
      ),
      section(
        "strategy-cases",
        "Case Studies",
        "gallery",
        [
          textElement("strategy-cases-title", "Titlu secțiune", source.caseStudiesTitle ?? source.sectionFourTitle, {
            fontSize: 36,
            fontWeight: 700,
          }),
          textElement(
            "strategy-cases-intro",
            "Intro secțiune",
            source.caseStudiesIntro ??
              "Rezultatele confirmă direcția strategică: mai mult control, eficiență și conversii.",
            { color: "#c6c6c6" },
          ),
          ...caseStudies.flatMap((item, index) => [
            textElement(`strategy-case-${index}-category`, `Proiect ${index + 1} - categorie`, item.category, {
              fontSize: 12,
              color: "#66fcf1",
            }),
            textElement(`strategy-case-${index}-title`, `Proiect ${index + 1} - titlu`, item.title, {
              fontSize: 24,
              fontWeight: 700,
            }),
            textElement(
              `strategy-case-${index}-description`,
              `Proiect ${index + 1} - descriere`,
              item.description,
              { color: "#c6c6c6" },
            ),
            buttonElement(
              `strategy-case-${index}-link`,
              `Proiect ${index + 1} - link`,
              "Detalii proiect",
              item.href,
              {
                color: "#66fcf1",
                fontWeight: 700,
              },
            ),
            mediaElement(
              `strategy-case-${index}-media`,
              `Proiect ${index + 1} - imagine`,
              `media-strategy-case-${index}`,
              item.title,
              { borderRadius: 24 },
            ),
          ]),
        ],
        source.sectionVisibility?.caseStudies ?? true,
      ),
      section(
        "strategy-cta",
        "Final CTA",
        "cta",
        [
          ctaElement(
            "strategy-cta-main",
            source.finalCta.title,
            source.finalCta.description,
            source.finalCta.primaryLabel,
            source.finalCta.primaryHref,
          ),
        ],
        source.sectionVisibility?.finalCta ?? true,
      ),
    ],
  };
}

export function siteContentToCmsData(site: SiteContent): CmsData {
  const homeServicesElements = site.home.primaryServices.flatMap((service, index) => [
    textElement(`home-primary-title-${index}`, `Serviciu ${index + 1} - Titlu`, service.title, {
      fontSize: 24,
      fontWeight: 700,
    }),
    textElement(`home-primary-desc-${index}`, `Serviciu ${index + 1} - Descriere`, service.description, {
      color: "#c6c6c6",
    }),
    textElement(`home-primary-bullets-${index}`, `Serviciu ${index + 1} - Bullets`, service.bullets.join("\n"), {
      color: "#9ab2bb",
    }),
  ]);

  const rawPages: CmsPageDraft[] = [
    {
      id: "home",
      name: "Homepage",
      slug: "/",
      status: "published",
      sections: [
        section("home-hero", "Hero", "hero", [
          textElement("home-hero-eyebrow", "Eyebrow", site.home.hero.eyebrow, {
            fontSize: 12,
            color: "#66fcf1",
          }),
          textElement("home-hero-title", "Titlu", site.home.hero.title, {
            fontSize: 50,
            fontWeight: 800,
            textAlign: "center",
          }),
          textElement("home-hero-description", "Descriere", site.home.hero.description, {
            fontSize: 24,
            textAlign: "center",
            color: "#c6c6c6",
          }),
          buttonElement(
            "home-hero-primary",
            "Primary CTA",
            site.home.hero.primaryCtaLabel,
            site.home.hero.primaryCtaHref,
            {
              backgroundColor: "#66fcf1",
              color: "#0b0c10",
              textAlign: "center",
              padding: 14,
              borderRadius: 999,
              fontWeight: 700,
            },
          ),
          buttonElement(
            "home-hero-secondary",
            "Secondary CTA",
            site.home.hero.secondaryCtaLabel,
            site.home.hero.secondaryCtaHref,
            {
              backgroundColor: "#11181d",
              color: "#ffffff",
              textAlign: "center",
              padding: 14,
              borderRadius: 999,
              fontWeight: 600,
            },
          ),
          textElement("home-hero-highlights-title", "Highlights Title", site.home.hero.highlightsTitle, {
            color: "#c6c6c6",
          }),
          ...site.home.hero.highlights.flatMap((item, index) => [
            textElement(`home-hero-highlight-title-${index}`, `Highlight ${index + 1} - Titlu`, item.title, {
              fontWeight: 700,
            }),
            textElement(
              `home-hero-highlight-desc-${index}`,
              `Highlight ${index + 1} - Descriere`,
              item.description,
              { color: "#c6c6c6" },
            ),
          ]),
        ]),
        section("home-primary-services", "Servicii principale", "gallery", [
          textElement("home-primary-services-title", "Titlu", site.home.primaryServicesTitle, {
            fontSize: 38,
            fontWeight: 700,
          }),
          textElement("home-primary-services-description", "Descriere", site.home.primaryServicesDescription, {
            color: "#c6c6c6",
          }),
          ...homeServicesElements,
        ]),
        section("home-secondary-services", "Servicii secundare", "text-image", [
          textElement("home-secondary-services-title", "Titlu", site.home.secondaryServicesTitle, {
            fontSize: 34,
            fontWeight: 700,
          }),
          textElement("home-secondary-services-description", "Descriere", site.home.secondaryServicesDescription, {
            color: "#c6c6c6",
          }),
          ...site.home.secondaryServices.flatMap((item, index) => [
            textElement(
              `home-secondary-service-title-${index}`,
              `Serviciu secundar ${index + 1} - Titlu`,
              item.title,
              {
                fontSize: 24,
                fontWeight: 700,
              },
            ),
            textElement(
              `home-secondary-service-desc-${index}`,
              `Serviciu secundar ${index + 1} - Descriere`,
              item.description,
              { color: "#c6c6c6" },
            ),
          ]),
        ]),
        section("home-paid-ads", "Paid Ads & Tracking", "text-image", [
          textElement("home-paid-ads-eyebrow", "Eyebrow", site.home.paidAds.eyebrow, {
            fontSize: 12,
            color: "#66fcf1",
          }),
          textElement("home-paid-ads-title", "Titlu", site.home.paidAds.title, {
            fontSize: 34,
            fontWeight: 700,
          }),
          textElement("home-paid-ads-description", "Descriere", site.home.paidAds.description, {
            color: "#c6c6c6",
          }),
          textElement("home-paid-ads-tags", "Tags", site.home.paidAds.tags.join("\n"), {
            color: "#c6c6c6",
          }),
          textElement("home-paid-ads-stat-value", "Stat Value", site.home.paidAds.statValue, {
            fontSize: 44,
            fontWeight: 800,
            color: "#66fcf1",
          }),
          textElement("home-paid-ads-stat-description", "Stat Description", site.home.paidAds.statDescription, {
            color: "#c6c6c6",
          }),
        ]),
        section("home-portfolio-preview", "Portfolio Preview", "text-image", [
          textElement("home-portfolio-preview-title", "Titlu", site.home.portfolioPreview.title, {
            fontSize: 42,
            fontWeight: 700,
          }),
          buttonElement(
            "home-portfolio-preview-link",
            "View All Label",
            site.home.portfolioPreview.viewAllLabel,
            "/portofoliu",
            { color: "#66fcf1", fontWeight: 700 },
          ),
        ]),
        section("home-process", "Proces", "text-image", [
          textElement("home-process-title", "Titlu", site.home.process.title, {
            fontSize: 34,
            fontWeight: 700,
          }),
          textElement("home-process-description", "Descriere", site.home.process.description, {
            color: "#c6c6c6",
          }),
          ...site.home.process.steps.flatMap((item, index) => [
            textElement(`home-process-step-${index}-icon`, `Pas ${index + 1} - icon`, item.icon, {
              color: "#66fcf1",
              fontSize: 12,
            }),
            textElement(`home-process-step-${index}-title`, `Pas ${index + 1} - titlu`, item.title, {
              fontWeight: 700,
            }),
            textElement(
              `home-process-step-${index}-description`,
              `Pas ${index + 1} - descriere`,
              item.description,
              { color: "#c6c6c6" },
            ),
          ]),
        ]),
        section("home-additional-services", "Alte servicii", "text-image", [
          textElement("home-additional-services-title", "Titlu", site.home.additionalServicesTitle, {
            fontSize: 34,
            fontWeight: 700,
          }),
          ...site.home.additionalServices.map((item, index) =>
            textElement(`home-additional-service-${index}`, `Serviciu ${index + 1}`, item, {
              color: "#c6c6c6",
            }),
          ),
          textElement(
            "home-complementary-services-title",
            "Complementary Title",
            site.home.complementaryServicesTitle,
            { fontSize: 30, fontWeight: 700 },
          ),
          ...site.home.complementaryServices.flatMap((item, index) => [
            textElement(`home-complementary-service-${index}-icon`, `Complementary ${index + 1} - icon`, item.icon, {
              color: "#66fcf1",
              fontSize: 12,
            }),
            textElement(
              `home-complementary-service-${index}-title`,
              `Complementary ${index + 1} - title`,
              item.title,
              { fontWeight: 700 },
            ),
            textElement(
              `home-complementary-service-${index}-description`,
              `Complementary ${index + 1} - description`,
              item.description,
              { color: "#c6c6c6" },
            ),
          ]),
        ]),
        section("home-trust", "Trust", "testimonials", [
          textElement("home-trust-title", "Titlu", site.home.trustTitle, {
            fontSize: 34,
            fontWeight: 700,
          }),
          ...site.home.testimonials.flatMap((item, index) => [
            textElement(`home-testimonial-${index}-quote`, `Testimonial ${index + 1} - quote`, item.quote),
            textElement(`home-testimonial-${index}-name`, `Testimonial ${index + 1} - name`, item.name),
            textElement(
              `home-testimonial-${index}-role`,
              `Testimonial ${index + 1} - role`,
              item.role,
              { color: "#c6c6c6" },
            ),
          ]),
        ]),
        section("home-cta", "Final CTA", "cta", [
          ctaElement(
            "home-cta-main",
            site.home.finalCta.title,
            site.home.finalCta.description,
            site.home.finalCta.primaryLabel,
            site.home.finalCta.primaryHref,
          ),
        ]),
      ],
    },
    servicePageToCmsPage(
      "social",
      "Social Media Management",
      "/servicii/social-media-management",
      site.services.socialMedia,
    ),
    servicePageToCmsPage(
      "photo-video",
      "Producție Foto & Video",
      "/servicii/productie-foto-video",
      site.services.photoVideo,
    ),
    strategyServicePageToCmsPage(site.services.strategy),
    globalPageToCmsPage(site.global),
    portfolioPageToCmsPage(site.portfolioPage, site.portfolioProjects),
    blogPageToCmsPage(site.blogPage),
    contactPageToCmsPage(site.contactPage),
  ];

  const pages: CmsPage[] = rawPages.map((page) => {
    const persistedMeta = site.cmsPages?.[page.id];
    const name = persistedMeta?.name?.trim() || page.name;
    const slug = normalizePageSlug(persistedMeta?.slug ?? page.slug);
    const seoTitle = persistedMeta?.seoTitle?.trim() || `${name} | ${site.global.brandName}`;
    const seoDescription = persistedMeta?.seoDescription?.trim() || defaultSeoDescription(name);

    return {
      ...page,
      name,
      slug,
      seoTitle,
      seoDescription,
    };
  });

  const strategyCaseStudies = normalizeStrategyCaseStudies(site.services.strategy);
  const portfolioFeaturedVideo = getPortfolioFeaturedVideo(site.portfolioPage, site.portfolioProjects);
  const portfolioVideoItems = getPortfolioVideoItems(site.portfolioPage, site.portfolioProjects);
  const portfolioSocialProof = getPortfolioSocialProof(site.portfolioPage, site.portfolioProjects);

  const media: CmsData["media"] = [
    {
      id: "media-social-hero",
      name: "Social Hero",
      type: "image",
      url: "/images/social-media/hero-phone.svg",
      tags: ["social", "hero"],
      createdAt: new Date().toISOString(),
      provider: "local",
    },
    {
      id: "media-photo-hero",
      name: "Photo Hero",
      type: "image",
      url: "/images/photo-video/camera-rig.svg",
      tags: ["photo-video", "hero"],
      createdAt: new Date().toISOString(),
      provider: "local",
    },
    {
      id: "media-strategy-hero",
      name: "Strategy Hero",
      type: "image",
      url: site.services.strategy.heroImage ?? "/images/social-media/team-production.svg",
      tags: ["strategy", "hero"],
      createdAt: new Date().toISOString(),
      provider: "local",
    },
    ...strategyCaseStudies.map((item, index) => ({
      id: `media-strategy-case-${index}`,
      name: `Strategy Case ${index + 1}`,
      type: "image" as const,
      url: item.image,
      tags: ["strategy", "case-study"],
      createdAt: new Date().toISOString(),
      provider: "local" as const,
    })),
    ...site.portfolioProjects.map((project, index) => ({
      id: `media-portfolio-${index}`,
      name: project.title,
      type: "image" as const,
      url: project.image,
      tags: ["portfolio", project.category.toLowerCase()],
      createdAt: new Date().toISOString(),
      provider: "local" as const,
    })),
    {
      id: "media-portfolio-video-featured",
      name: portfolioFeaturedVideo.title,
      type: "image",
      url: portfolioFeaturedVideo.image,
      tags: ["portfolio", "video", "featured"],
      createdAt: new Date().toISOString(),
      provider: "local",
    },
    ...portfolioVideoItems.map((item, index) => ({
      id: `media-portfolio-video-item-${index}`,
      name: item.title,
      type: "image" as const,
      url: item.image,
      tags: ["portfolio", "video"],
      createdAt: new Date().toISOString(),
      provider: "local" as const,
    })),
    ...portfolioSocialProof.map((item, index) => ({
      id: `media-portfolio-logo-${index}`,
      name: item.name,
      type: "image" as const,
      url: item.image,
      tags: ["portfolio", "logo"],
      createdAt: new Date().toISOString(),
      provider: "local" as const,
    })),
  ];

  return {
    pages,
    media,
    blog: [],
    settings: {
      siteTitle: site.global.brandName,
      primaryColor: "#66fcf1",
    },
  };
}

function updateServicePageFromCms(
  data: CmsData,
  pageId: "social" | "photo-video",
  current: ServicePageContent,
) {
  const cta = findCta(data, pageId, `${pageId}-cta`, `${pageId}-cta-main`);
  const heroSecondary = findButton(data, pageId, `${pageId}-hero`, `${pageId}-hero-cta-secondary`);
  const heroMedia = findMedia(data, pageId, `${pageId}-hero`, `${pageId}-hero-media`);
  const heroMediaUrl = findMediaUrlById(data, heroMedia?.mediaId);

  return {
    ...current,
    heroBadge: findText(data, pageId, `${pageId}-hero`, `${pageId}-hero-badge`) ?? current.heroBadge,
    heroTitle: findText(data, pageId, `${pageId}-hero`, `${pageId}-hero-title`) ?? current.heroTitle,
    heroDescription:
      findText(data, pageId, `${pageId}-hero`, `${pageId}-hero-description`) ?? current.heroDescription,
    heroCtaLabel:
      findButton(data, pageId, `${pageId}-hero`, `${pageId}-hero-cta`)?.content ?? current.heroCtaLabel,
    heroSecondaryCtaLabel: heroSecondary?.content ?? current.heroSecondaryCtaLabel,
    heroSecondaryCtaHref: heroSecondary?.href ?? current.heroSecondaryCtaHref,
    heroImage: heroMediaUrl ?? current.heroImage,
    sectionOneTitle:
      findText(data, pageId, `${pageId}-one`, `${pageId}-one-title`) ?? current.sectionOneTitle,
    sectionOneItems:
      pickItems(
        findIndexedTexts(data, pageId, `${pageId}-one`, `${pageId}-one-item-`),
        current.sectionOneItems,
      ),
    sectionTwoTitle:
      findText(data, pageId, `${pageId}-two`, `${pageId}-two-title`) ?? current.sectionTwoTitle,
    sectionTwoItems:
      pickItems(
        findIndexedTexts(data, pageId, `${pageId}-two`, `${pageId}-two-item-`),
        current.sectionTwoItems,
      ),
    sectionThreeTitle:
      findText(data, pageId, `${pageId}-three`, `${pageId}-three-title`) ?? current.sectionThreeTitle,
    sectionThreeItems:
      pickItems(
        findIndexedTexts(data, pageId, `${pageId}-three`, `${pageId}-three-item-`),
        current.sectionThreeItems,
      ),
    sectionFourTitle:
      findText(data, pageId, `${pageId}-four`, `${pageId}-four-title`) ?? current.sectionFourTitle,
    sectionFourItems:
      pickItems(
        findIndexedTexts(data, pageId, `${pageId}-four`, `${pageId}-four-item-`),
        current.sectionFourItems,
      ),
    sectionVisibility: {
      hero: findSectionVisibility(data, pageId, `${pageId}-hero`, current.sectionVisibility?.hero ?? true),
      problems: findSectionVisibility(
        data,
        pageId,
        `${pageId}-one`,
        current.sectionVisibility?.problems ?? true,
      ),
      deliverables: findSectionVisibility(
        data,
        pageId,
        `${pageId}-two`,
        current.sectionVisibility?.deliverables ?? true,
      ),
      process: findSectionVisibility(
        data,
        pageId,
        `${pageId}-three`,
        current.sectionVisibility?.process ?? true,
      ),
      caseStudies: findSectionVisibility(
        data,
        pageId,
        `${pageId}-four`,
        current.sectionVisibility?.caseStudies ?? true,
      ),
      finalCta: findSectionVisibility(
        data,
        pageId,
        `${pageId}-cta`,
        current.sectionVisibility?.finalCta ?? true,
      ),
    },
    finalCta: {
      ...current.finalCta,
      title: cta?.content ?? current.finalCta.title,
      description: cta?.subcontent ?? current.finalCta.description,
      primaryLabel: cta?.buttonLabel ?? current.finalCta.primaryLabel,
      primaryHref: cta?.buttonHref ?? current.finalCta.primaryHref,
    },
  };
}

function updateStrategyPageFromCms(data: CmsData, current: StrategyPageContent) {
  const heroPrimary = findButton(data, "strategy", "strategy-hero", "strategy-hero-primary");
  const heroSecondary = findButton(data, "strategy", "strategy-hero", "strategy-hero-secondary");
  const heroMedia = findMedia(data, "strategy", "strategy-hero", "strategy-hero-media");
  const heroMediaUrl = findMediaUrlById(data, heroMedia?.mediaId);

  const fallbackProblems = normalizeStrategyProblems(current);
  const fallbackDeliverables = normalizeStrategyDeliverables(current);
  const fallbackProcess = normalizeStrategyProcess(current);
  const fallbackCaseStudies = normalizeStrategyCaseStudies(current);

  const problemsElements = findSectionElements(data, "strategy", "strategy-problems");
  const problemsByIndex = new Map<number, { icon?: string; title?: string; description?: string }>();
  for (const element of problemsElements) {
    if (element.type !== "text") {
      continue;
    }
    const match = /^strategy-problem-(\d+)-(icon|title|description)$/.exec(element.id);
    if (!match) {
      continue;
    }
    const index = Number(match[1]);
    const key = match[2] as "icon" | "title" | "description";
    const currentRecord = problemsByIndex.get(index) ?? {};
    currentRecord[key] = element.content.trim();
    problemsByIndex.set(index, currentRecord);
  }
  const parsedProblems = Array.from(problemsByIndex.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, item]) => ({
      icon: item.icon || "Lightbulb",
      title: item.title || `Problemă ${index + 1}`,
      description: item.description || "Descriere problemă",
    }));
  const nextProblems = parsedProblems.length > 0 ? parsedProblems : fallbackProblems;

  const deliverablesElements = findSectionElements(data, "strategy", "strategy-deliverables");
  const deliverablesByIndex = new Map<number, { title?: string; description?: string; variant?: string }>();
  for (const element of deliverablesElements) {
    if (element.type !== "text") {
      continue;
    }
    const match = /^strategy-deliverable-(\d+)-(title|description|variant)$/.exec(element.id);
    if (!match) {
      continue;
    }
    const index = Number(match[1]);
    const key = match[2] as "title" | "description" | "variant";
    const currentRecord = deliverablesByIndex.get(index) ?? {};
    currentRecord[key] = element.content.trim();
    deliverablesByIndex.set(index, currentRecord);
  }
  const parsedDeliverables = Array.from(deliverablesByIndex.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, item]) => {
      const variant =
        item.variant === "large" || item.variant === "small" || item.variant === "accent"
          ? item.variant
          : "small";
      return {
        title: item.title || `Deliverable ${index + 1}`,
        description: item.description || "Descriere deliverable.",
        variant,
      } as const;
    });
  const nextDeliverables = parsedDeliverables.length > 0 ? parsedDeliverables : fallbackDeliverables;

  const processElements = findSectionElements(data, "strategy", "strategy-process");
  const processByIndex = new Map<number, { title?: string; description?: string }>();
  for (const element of processElements) {
    if (element.type !== "text") {
      continue;
    }
    const match = /^strategy-process-step-(\d+)-(title|description)$/.exec(element.id);
    if (!match) {
      continue;
    }
    const index = Number(match[1]);
    const key = match[2] as "title" | "description";
    const currentRecord = processByIndex.get(index) ?? {};
    currentRecord[key] = element.content.trim();
    processByIndex.set(index, currentRecord);
  }
  const parsedProcess = Array.from(processByIndex.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, item]) => ({
      title: item.title || `Etapa ${index + 1}`,
      description: item.description || "Descriere etapă.",
    }));
  const nextProcess = parsedProcess.length > 0 ? parsedProcess : fallbackProcess;

  const caseElements = findSectionElements(data, "strategy", "strategy-cases");
  const caseByIndex = new Map<number, { category?: string; title?: string; description?: string; href?: string; mediaId?: string }>();
  for (const element of caseElements) {
    if (element.type === "text") {
      const textMatch = /^strategy-case-(\d+)-(category|title|description)$/.exec(element.id);
      if (!textMatch) {
        continue;
      }
      const index = Number(textMatch[1]);
      const key = textMatch[2] as "category" | "title" | "description";
      const currentRecord = caseByIndex.get(index) ?? {};
      currentRecord[key] = element.content.trim();
      caseByIndex.set(index, currentRecord);
      continue;
    }

    if (element.type === "button") {
      const buttonMatch = /^strategy-case-(\d+)-link$/.exec(element.id);
      if (!buttonMatch) {
        continue;
      }
      const index = Number(buttonMatch[1]);
      const currentRecord = caseByIndex.get(index) ?? {};
      currentRecord.href = element.href;
      caseByIndex.set(index, currentRecord);
      continue;
    }

    if (element.type === "media") {
      const mediaMatch = /^strategy-case-(\d+)-media$/.exec(element.id);
      if (!mediaMatch) {
        continue;
      }
      const index = Number(mediaMatch[1]);
      const currentRecord = caseByIndex.get(index) ?? {};
      currentRecord.mediaId = element.mediaId;
      caseByIndex.set(index, currentRecord);
    }
  }

  const parsedCases = Array.from(caseByIndex.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, item]) => ({
      category: item.category || "Case Study",
      title: item.title || `Proiect ${index + 1}`,
      description: item.description || "Descriere proiect.",
      image:
        findMediaUrlById(data, item.mediaId) ||
        fallbackCaseStudies[index]?.image ||
        "/images/portfolio/ecom-fashion.svg",
      href: item.href || fallbackCaseStudies[index]?.href || "/portofoliu",
    }));
  const nextCaseStudies = parsedCases.length > 0 ? parsedCases : fallbackCaseStudies;

  const cta = findCta(data, "strategy", "strategy-cta", "strategy-cta-main");

  return {
    ...current,
    heroBadge: findText(data, "strategy", "strategy-hero", "strategy-hero-badge") ?? current.heroBadge,
    heroTitle: findText(data, "strategy", "strategy-hero", "strategy-hero-title") ?? current.heroTitle,
    heroDescription:
      findText(data, "strategy", "strategy-hero", "strategy-hero-description") ?? current.heroDescription,
    heroCtaLabel: heroPrimary?.content ?? current.heroCtaLabel,
    heroSecondaryCtaLabel: heroSecondary?.content ?? current.heroSecondaryCtaLabel,
    heroSecondaryCtaHref: heroSecondary?.href ?? current.heroSecondaryCtaHref,
    heroImage: heroMediaUrl ?? current.heroImage,
    sectionOneTitle:
      findText(data, "strategy", "strategy-problems", "strategy-problems-title") ?? current.sectionOneTitle,
    sectionOneItems: pickItems(
      nextProblems.map((item) => item.description),
      current.sectionOneItems,
    ),
    problemsIntro:
      findText(data, "strategy", "strategy-problems", "strategy-problems-intro") ?? current.problemsIntro,
    problems: nextProblems,
    sectionTwoTitle:
      findText(data, "strategy", "strategy-deliverables", "strategy-deliverables-title") ??
      current.sectionTwoTitle,
    sectionTwoItems: pickItems(
      nextDeliverables.map((item) => item.title),
      current.sectionTwoItems,
    ),
    deliverablesIntro:
      findText(data, "strategy", "strategy-deliverables", "strategy-deliverables-intro") ??
      current.deliverablesIntro,
    deliverables: nextDeliverables,
    sectionThreeTitle:
      findText(data, "strategy", "strategy-process", "strategy-process-title") ?? current.sectionThreeTitle,
    sectionThreeItems: pickItems(
      nextProcess.map((item) => item.description),
      current.sectionThreeItems,
    ),
    processIntro:
      findText(data, "strategy", "strategy-process", "strategy-process-intro") ?? current.processIntro,
    processSteps: nextProcess,
    caseStudiesTitle:
      findText(data, "strategy", "strategy-cases", "strategy-cases-title") ?? current.caseStudiesTitle,
    caseStudiesIntro:
      findText(data, "strategy", "strategy-cases", "strategy-cases-intro") ?? current.caseStudiesIntro,
    caseStudies: nextCaseStudies,
    sectionVisibility: {
      hero: findSectionVisibility(
        data,
        "strategy",
        "strategy-hero",
        current.sectionVisibility?.hero ?? true,
      ),
      problems: findSectionVisibility(
        data,
        "strategy",
        "strategy-problems",
        current.sectionVisibility?.problems ?? true,
      ),
      deliverables: findSectionVisibility(
        data,
        "strategy",
        "strategy-deliverables",
        current.sectionVisibility?.deliverables ?? true,
      ),
      process: findSectionVisibility(
        data,
        "strategy",
        "strategy-process",
        current.sectionVisibility?.process ?? true,
      ),
      caseStudies: findSectionVisibility(
        data,
        "strategy",
        "strategy-cases",
        current.sectionVisibility?.caseStudies ?? true,
      ),
      finalCta: findSectionVisibility(
        data,
        "strategy",
        "strategy-cta",
        current.sectionVisibility?.finalCta ?? true,
      ),
    },
    finalCta: {
      ...current.finalCta,
      title: cta?.content ?? current.finalCta.title,
      description: cta?.subcontent ?? current.finalCta.description,
      primaryLabel: cta?.buttonLabel ?? current.finalCta.primaryLabel,
      primaryHref: cta?.buttonHref ?? current.finalCta.primaryHref,
    },
  };
}

function updateGlobalFromCms(data: CmsData, current: GlobalContent) {
  const navPairs = parseIndexedPairs(data, "global", "global-navbar", "global-nav-label-", "global-nav-href-");
  const footerPairs = parseIndexedPairs(
    data,
    "global",
    "global-footer",
    "global-footer-link-label-",
    "global-footer-link-href-",
  );

  return {
    ...current,
    brandName: findText(data, "global", "global-navbar", "global-brand-name") ?? current.brandName,
    navbarCtaLabel:
      findText(data, "global", "global-navbar", "global-navbar-cta-label") ?? current.navbarCtaLabel,
    navigation:
      navPairs.length > 0
        ? navPairs.map((item, index) => ({
            label: item.left || `Link ${index + 1}`,
            href: item.right || "/",
          }))
        : current.navigation,
    footer: {
      ...current.footer,
      description:
        findText(data, "global", "global-footer", "global-footer-description") ?? current.footer.description,
      quickLinksTitle:
        findText(data, "global", "global-footer", "global-footer-quick-title") ??
        current.footer.quickLinksTitle,
      quickLinks:
        footerPairs.length > 0
          ? footerPairs.map((item, index) => ({
              label: item.left || `Footer link ${index + 1}`,
              href: item.right || "/",
            }))
          : current.footer.quickLinks,
      contactTitle:
        findText(data, "global", "global-footer", "global-footer-contact-title") ??
        current.footer.contactTitle,
      contactEmail:
        findText(data, "global", "global-footer", "global-footer-contact-email") ??
        current.footer.contactEmail,
      contactPhone:
        findText(data, "global", "global-footer", "global-footer-contact-phone") ??
        current.footer.contactPhone,
      contactLocation:
        findText(data, "global", "global-footer", "global-footer-contact-location") ??
        current.footer.contactLocation,
      copyrightTemplate:
        findText(data, "global", "global-footer", "global-footer-copyright") ??
        current.footer.copyrightTemplate,
    },
  };
}

function updatePortfolioFromCms(
  data: CmsData,
  currentPage: PortfolioPageContent,
  currentProjects: SiteContent["portfolioProjects"],
) {
  const cta = findCta(data, "portfolio", "portfolio-cta", "portfolio-cta-main");
  const projectElements = findSectionElements(data, "portfolio", "portfolio-projects");
  const fallbackFilters = getPortfolioFilters(currentPage);
  const fallbackFeaturedVideo = getPortfolioFeaturedVideo(currentPage, currentProjects);
  const fallbackVideoItems = getPortfolioVideoItems(currentPage, currentProjects);
  const fallbackCaseHighlights = getPortfolioCaseHighlights(currentPage, currentProjects);
  const fallbackSocialProof = getPortfolioSocialProof(currentPage, currentProjects);
  const projectsByIndex = new Map<
    number,
    {
      slug?: string;
      title?: string;
      category?: string;
      excerpt?: string;
      metrics?: string;
      hasVideo?: string;
      href?: string;
      layout?: string;
      badge?: string;
      mediaId?: string;
    }
  >();

  for (const element of projectElements) {
    if (element.type === "text") {
      const match =
        /^portfolio-project-(\d+)-(slug|title|category|excerpt|metrics|has-video|href|layout|badge)$/.exec(
          element.id,
        );
      if (!match) {
        continue;
      }
      const index = Number(match[1]);
      const key = match[2] as
        | "slug"
        | "title"
        | "category"
        | "excerpt"
        | "metrics"
        | "has-video"
        | "href"
        | "layout"
        | "badge";
      const currentRecord = projectsByIndex.get(index) ?? {};
      if (key === "has-video" || key === "layout" || key === "badge" || key === "href") {
        if (key === "layout") {
          currentRecord.layout = element.content.trim();
        } else if (key === "badge") {
          currentRecord.badge = element.content.trim();
        } else if (key === "href") {
          currentRecord.href = element.content.trim();
        } else {
        currentRecord.hasVideo = element.content.trim();
        }
      } else {
        currentRecord[key] = element.content.trim();
      }
      projectsByIndex.set(index, currentRecord);
      continue;
    }

    if (element.type === "media") {
      const match = /^portfolio-project-(\d+)-media$/.exec(element.id);
      if (!match) {
        continue;
      }
      const index = Number(match[1]);
      const currentRecord = projectsByIndex.get(index) ?? {};
      currentRecord.mediaId = element.mediaId;
      projectsByIndex.set(index, currentRecord);
    }
  }

  const nextProjects = Array.from(projectsByIndex.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, item]) => {
      const fallback = currentProjects[index];
      return {
        slug: item.slug || fallback?.slug || `project-${index + 1}`,
        title: item.title || fallback?.title || `Project ${index + 1}`,
        category: item.category || fallback?.category || "General",
        excerpt: item.excerpt || fallback?.excerpt || "Descriere proiect.",
        metrics: parseMultiline(item.metrics, fallback?.metrics ?? ["Metric 1"]),
        image: findMediaUrlById(data, item.mediaId) || fallback?.image || "/images/portfolio/ecom-fashion.svg",
        hasVideo: item.hasVideo ? item.hasVideo.toLowerCase() === "true" : (fallback?.hasVideo ?? false),
        href: item.href || fallback?.href || "/portofoliu",
        layoutVariant:
          item.layout === "hero" || item.layout === "wide" || item.layout === "tall" || item.layout === "standard"
            ? item.layout
            : (fallback?.layoutVariant ?? "standard"),
        highlightBadge: item.badge || fallback?.highlightBadge || "Featured",
      };
    });

  const filterElements = findSectionElements(data, "portfolio", "portfolio-filter");
  const filtersByIndex = new Map<number, { label?: string; value?: string; categories?: string }>();
  for (const element of filterElements) {
    if (element.type !== "text") {
      continue;
    }
    const match = /^portfolio-filter-(\d+)-(label|value|categories)$/.exec(element.id);
    if (!match) {
      continue;
    }
    const index = Number(match[1]);
    const key = match[2] as "label" | "value" | "categories";
    const record = filtersByIndex.get(index) ?? {};
    record[key] = element.content.trim();
    filtersByIndex.set(index, record);
  }

  const nextFilters = Array.from(filtersByIndex.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, item]) => {
      const fallback = fallbackFilters[index];
      return {
        label: item.label || fallback?.label || `Filtru ${index + 1}`,
        value: item.value || fallback?.value || `filtru-${index + 1}`,
        categories: parseMultiline(item.categories, fallback?.categories ?? ["*"]),
      };
    });

  const videoTitle =
    findText(data, "portfolio", "portfolio-video-showcase", "portfolio-video-title") ?? currentPage.videoBlockTitle;
  const videoDescription =
    findText(data, "portfolio", "portfolio-video-showcase", "portfolio-video-description") ??
    currentPage.videoBlockDescription;
  const videoCta = findButton(data, "portfolio", "portfolio-video-showcase", "portfolio-video-cta");
  const featuredVideoLink = findButton(
    data,
    "portfolio",
    "portfolio-video-showcase",
    "portfolio-video-featured-link",
  );
  const featuredVideoMedia = findMedia(
    data,
    "portfolio",
    "portfolio-video-showcase",
    "portfolio-video-featured-media",
  );

  const videoElements = findSectionElements(data, "portfolio", "portfolio-video-showcase");
  const videoItemsByIndex = new Map<
    number,
    { label?: string; title?: string; description?: string; href?: string; mediaId?: string }
  >();
  for (const element of videoElements) {
    if (element.type === "text") {
      const textMatch = /^portfolio-video-item-(\d+)-(label|title|description)$/.exec(element.id);
      if (!textMatch) {
        continue;
      }
      const index = Number(textMatch[1]);
      const key = textMatch[2] as "label" | "title" | "description";
      const record = videoItemsByIndex.get(index) ?? {};
      record[key] = element.content.trim();
      videoItemsByIndex.set(index, record);
      continue;
    }

    if (element.type === "button") {
      const buttonMatch = /^portfolio-video-item-(\d+)-link$/.exec(element.id);
      if (!buttonMatch) {
        continue;
      }
      const index = Number(buttonMatch[1]);
      const record = videoItemsByIndex.get(index) ?? {};
      record.href = element.href;
      videoItemsByIndex.set(index, record);
      continue;
    }

    if (element.type === "media") {
      const mediaMatch = /^portfolio-video-item-(\d+)-media$/.exec(element.id);
      if (!mediaMatch) {
        continue;
      }
      const index = Number(mediaMatch[1]);
      const record = videoItemsByIndex.get(index) ?? {};
      record.mediaId = element.mediaId;
      videoItemsByIndex.set(index, record);
    }
  }

  const nextVideoItems = Array.from(videoItemsByIndex.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, item]) => {
      const fallback = fallbackVideoItems[index];
      return {
        label: item.label || fallback?.label || `Video ${index + 1}`,
        title: item.title || fallback?.title || `Item ${index + 1}`,
        description: item.description || fallback?.description || "Descriere video.",
        href: item.href || fallback?.href || "/portofoliu",
        image:
          findMediaUrlById(data, item.mediaId) ||
          fallback?.image ||
          "/images/photo-video/sport-video.svg",
      };
    });

  const caseElements = findSectionElements(data, "portfolio", "portfolio-case-highlights");
  const caseByIndex = new Map<number, { icon?: string; title?: string; context?: string; approach?: string; metric?: string }>();
  for (const element of caseElements) {
    if (element.type !== "text") {
      continue;
    }
    const match = /^portfolio-case-(\d+)-(icon|title|context|approach|metric)$/.exec(element.id);
    if (!match) {
      continue;
    }
    const index = Number(match[1]);
    const key = match[2] as "icon" | "title" | "context" | "approach" | "metric";
    const record = caseByIndex.get(index) ?? {};
    record[key] = element.content.trim();
    caseByIndex.set(index, record);
  }

  const nextCaseHighlights = Array.from(caseByIndex.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, item]) => {
      const fallback = fallbackCaseHighlights[index];
      return {
        icon: item.icon || fallback?.icon || "Target",
        title: item.title || fallback?.title || `Case ${index + 1}`,
        context: item.context || fallback?.context || "Context proiect.",
        approach: item.approach || fallback?.approach || "Abordare implementată.",
        metric: item.metric || fallback?.metric || "KPI principal",
      };
    });

  const socialElements = findSectionElements(data, "portfolio", "portfolio-social-proof");
  const logosByIndex = new Map<number, { name?: string; href?: string; mediaId?: string }>();
  for (const element of socialElements) {
    if (element.type === "text") {
      const textMatch = /^portfolio-logo-(\d+)-(name|href)$/.exec(element.id);
      if (!textMatch) {
        continue;
      }
      const index = Number(textMatch[1]);
      const key = textMatch[2] as "name" | "href";
      const record = logosByIndex.get(index) ?? {};
      record[key] = element.content.trim();
      logosByIndex.set(index, record);
      continue;
    }

    if (element.type === "media") {
      const mediaMatch = /^portfolio-logo-(\d+)-media$/.exec(element.id);
      if (!mediaMatch) {
        continue;
      }
      const index = Number(mediaMatch[1]);
      const record = logosByIndex.get(index) ?? {};
      record.mediaId = element.mediaId;
      logosByIndex.set(index, record);
    }
  }

  const nextSocialProof = Array.from(logosByIndex.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, item]) => {
      const fallback = fallbackSocialProof[index];
      return {
        name: item.name || fallback?.name || `Partner ${index + 1}`,
        href: item.href || fallback?.href || "/portofoliu",
        image:
          findMediaUrlById(data, item.mediaId) ||
          fallback?.image ||
          "/images/portfolio/ecom-fashion.svg",
      };
    });

  return {
    page: {
      ...currentPage,
      heroBadge:
        findText(data, "portfolio", "portfolio-hero", "portfolio-hero-badge") ??
        currentPage.heroBadge,
      heroTitle: findText(data, "portfolio", "portfolio-hero", "portfolio-hero-title") ?? currentPage.heroTitle,
      heroDescription:
        findText(data, "portfolio", "portfolio-hero", "portfolio-hero-description") ??
        currentPage.heroDescription,
      heroCtaLabel: findButton(data, "portfolio", "portfolio-hero", "portfolio-hero-cta")?.content ?? currentPage.heroCtaLabel,
      heroCtaHref: findButton(data, "portfolio", "portfolio-hero", "portfolio-hero-cta")?.href ?? currentPage.heroCtaHref,
      filterTitle:
        findText(data, "portfolio", "portfolio-filter", "portfolio-filter-title") ?? currentPage.filterTitle,
      filterDescription:
        findText(data, "portfolio", "portfolio-filter", "portfolio-filter-description") ??
        currentPage.filterDescription,
      filters: nextFilters.length > 0 ? nextFilters : fallbackFilters,
      defaultFilter:
        findText(data, "portfolio", "portfolio-filter", "portfolio-filter-default") ??
        currentPage.defaultFilter,
      projectsTitle:
        findText(data, "portfolio", "portfolio-projects", "portfolio-projects-title") ??
        currentPage.projectsTitle,
      projectsDescription:
        findText(data, "portfolio", "portfolio-projects", "portfolio-projects-description") ??
        currentPage.projectsDescription,
      caseStudiesTitle:
        findText(data, "portfolio", "portfolio-case-highlights", "portfolio-case-title") ??
        currentPage.caseStudiesTitle,
      caseStudiesDescription:
        findText(data, "portfolio", "portfolio-case-highlights", "portfolio-case-description") ??
        currentPage.caseStudiesDescription,
      videoBlockTitle: videoTitle,
      videoBlockDescription: videoDescription,
      videoShowcaseCtaLabel: videoCta?.content ?? currentPage.videoShowcaseCtaLabel,
      videoShowcaseCtaHref: videoCta?.href ?? currentPage.videoShowcaseCtaHref,
      featuredVideo: {
        label:
          findText(data, "portfolio", "portfolio-video-showcase", "portfolio-video-featured-label") ??
          fallbackFeaturedVideo.label,
        title:
          findText(data, "portfolio", "portfolio-video-showcase", "portfolio-video-featured-title") ??
          fallbackFeaturedVideo.title,
        description:
          findText(
            data,
            "portfolio",
            "portfolio-video-showcase",
            "portfolio-video-featured-description",
          ) ?? fallbackFeaturedVideo.description,
        href: featuredVideoLink?.href ?? fallbackFeaturedVideo.href,
        image:
          findMediaUrlById(data, featuredVideoMedia?.mediaId) ||
          fallbackFeaturedVideo.image,
      },
      videoItems: nextVideoItems.length > 0 ? nextVideoItems : fallbackVideoItems,
      caseHighlightsTitle:
        findText(data, "portfolio", "portfolio-case-highlights", "portfolio-case-title") ??
        currentPage.caseHighlightsTitle,
      caseHighlightsIntro:
        findText(data, "portfolio", "portfolio-case-highlights", "portfolio-case-description") ??
        currentPage.caseHighlightsIntro,
      caseHighlights: nextCaseHighlights.length > 0 ? nextCaseHighlights : fallbackCaseHighlights,
      socialProofTitle:
        findText(data, "portfolio", "portfolio-social-proof", "portfolio-social-title") ??
        currentPage.socialProofTitle,
      socialProofIntro:
        findText(data, "portfolio", "portfolio-social-proof", "portfolio-social-description") ??
        currentPage.socialProofIntro,
      socialProofLogos: nextSocialProof.length > 0 ? nextSocialProof : fallbackSocialProof,
      sectionVisibility: {
        hero: findSectionVisibility(data, "portfolio", "portfolio-hero", currentPage.sectionVisibility?.hero ?? true),
        filters: findSectionVisibility(
          data,
          "portfolio",
          "portfolio-filter",
          currentPage.sectionVisibility?.filters ?? true,
        ),
        projects: findSectionVisibility(
          data,
          "portfolio",
          "portfolio-projects",
          currentPage.sectionVisibility?.projects ?? true,
        ),
        videoShowcase: findSectionVisibility(
          data,
          "portfolio",
          "portfolio-video-showcase",
          currentPage.sectionVisibility?.videoShowcase ?? true,
        ),
        caseHighlights: findSectionVisibility(
          data,
          "portfolio",
          "portfolio-case-highlights",
          currentPage.sectionVisibility?.caseHighlights ?? true,
        ),
        socialProof: findSectionVisibility(
          data,
          "portfolio",
          "portfolio-social-proof",
          currentPage.sectionVisibility?.socialProof ?? true,
        ),
        finalCta: findSectionVisibility(
          data,
          "portfolio",
          "portfolio-cta",
          currentPage.sectionVisibility?.finalCta ?? true,
        ),
      },
      finalCta: {
        ...currentPage.finalCta,
        title: cta?.content ?? currentPage.finalCta.title,
        description: cta?.subcontent ?? currentPage.finalCta.description,
        primaryLabel: cta?.buttonLabel ?? currentPage.finalCta.primaryLabel,
        primaryHref: cta?.buttonHref ?? currentPage.finalCta.primaryHref,
      },
    },
    projects: nextProjects.length > 0 ? nextProjects : currentProjects,
  };
}

function updateBlogPageFromCms(data: CmsData, current: BlogPageContent) {
  const cta = findCta(data, "blog-page", "blog-cta", "blog-cta-main");

  return {
    ...current,
    heroTitle: findText(data, "blog-page", "blog-hero", "blog-hero-title") ?? current.heroTitle,
    heroDescription:
      findText(data, "blog-page", "blog-hero", "blog-hero-description") ?? current.heroDescription,
    featuredBadge:
      findText(data, "blog-page", "blog-featured", "blog-featured-badge") ?? current.featuredBadge,
    newsletterTitle:
      findText(data, "blog-page", "blog-newsletter", "blog-newsletter-title") ?? current.newsletterTitle,
    newsletterDescription:
      findText(data, "blog-page", "blog-newsletter", "blog-newsletter-description") ??
      current.newsletterDescription,
    newsletterPlaceholder:
      findText(data, "blog-page", "blog-newsletter", "blog-newsletter-placeholder") ??
      current.newsletterPlaceholder,
    newsletterButtonLabel:
      findButton(data, "blog-page", "blog-newsletter", "blog-newsletter-button")?.content ??
      current.newsletterButtonLabel,
    finalCta: {
      ...current.finalCta,
      title: cta?.content ?? current.finalCta.title,
      description: cta?.subcontent ?? current.finalCta.description,
      primaryLabel: cta?.buttonLabel ?? current.finalCta.primaryLabel,
      primaryHref: cta?.buttonHref ?? current.finalCta.primaryHref,
    },
  };
}

function updateContactPageFromCms(data: CmsData, current: ContactPageContent) {
  const cta = findCta(data, "contact", "contact-cta", "contact-cta-main");

  return {
    ...current,
    heroTitle: findText(data, "contact", "contact-hero", "contact-hero-title") ?? current.heroTitle,
    heroDescription:
      findText(data, "contact", "contact-hero", "contact-hero-description") ?? current.heroDescription,
    formTitle: findText(data, "contact", "contact-form", "contact-form-title") ?? current.formTitle,
    formDescription:
      findText(data, "contact", "contact-form", "contact-form-description") ?? current.formDescription,
    contactTitle:
      findText(data, "contact", "contact-details", "contact-details-title") ?? current.contactTitle,
    contactEmail:
      findText(data, "contact", "contact-details", "contact-details-email") ?? current.contactEmail,
    contactPhone:
      findText(data, "contact", "contact-details", "contact-details-phone") ?? current.contactPhone,
    contactLocation:
      findText(data, "contact", "contact-details", "contact-details-location") ?? current.contactLocation,
    trustTitle: findText(data, "contact", "contact-trust", "contact-trust-title") ?? current.trustTitle,
    trustItems: pickItems(
      findIndexedTexts(data, "contact", "contact-trust", "contact-trust-item-"),
      current.trustItems,
    ),
    finalCta: {
      ...current.finalCta,
      title: cta?.content ?? current.finalCta.title,
      description: cta?.subcontent ?? current.finalCta.description,
      primaryLabel: cta?.buttonLabel ?? current.finalCta.primaryLabel,
      primaryHref: cta?.buttonHref ?? current.finalCta.primaryHref,
    },
  };
}

export function applyCmsToSiteContent(data: CmsData, current: SiteContent): SiteContent {
  const homeCta = findCta(data, "home", "home-cta", "home-cta-main");

  const nextHomePrimaryServices = current.home.primaryServices.map((service, index) => ({
    ...service,
    title:
      findText(data, "home", "home-primary-services", `home-primary-title-${index}`) ?? service.title,
    description:
      findText(data, "home", "home-primary-services", `home-primary-desc-${index}`) ?? service.description,
    bullets: parseMultiline(
      findText(data, "home", "home-primary-services", `home-primary-bullets-${index}`),
      service.bullets,
    ),
  }));

  const nextSecondaryServices = current.home.secondaryServices.map((item, index) => ({
    title:
      findText(data, "home", "home-secondary-services", `home-secondary-service-title-${index}`) ?? item.title,
    description:
      findText(data, "home", "home-secondary-services", `home-secondary-service-desc-${index}`) ?? item.description,
  }));

  const heroHighlightPairs = parseIndexedPairs(
    data,
    "home",
    "home-hero",
    "home-hero-highlight-title-",
    "home-hero-highlight-desc-",
  );
  const nextHeroHighlights =
    heroHighlightPairs.length > 0
      ? heroHighlightPairs.map((item, index) => ({
          title: item.left || `Highlight ${index + 1}`,
          description: item.right || "Descriere highlight.",
        }))
      : current.home.hero.highlights;

  const nextPaidAdsTags = parseMultiline(
    findText(data, "home", "home-paid-ads", "home-paid-ads-tags"),
    current.home.paidAds.tags,
  );

  const processElements = findSectionElements(data, "home", "home-process");
  const processByIndex = new Map<number, { icon?: string; title?: string; description?: string }>();
  for (const element of processElements) {
    if (element.type !== "text") {
      continue;
    }
    const match = /^home-process-step-(\d+)-(icon|title|description)$/.exec(element.id);
    if (!match) {
      continue;
    }
    const index = Number(match[1]);
    const key = match[2] as "icon" | "title" | "description";
    const currentRecord = processByIndex.get(index) ?? {};
    currentRecord[key] = element.content.trim();
    processByIndex.set(index, currentRecord);
  }
  const parsedProcessSteps = Array.from(processByIndex.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, item]) => ({
      icon: item.icon || "architecture",
      title: item.title || `Pas ${index + 1}`,
      description: item.description || "Descriere pas de proces.",
    }));
  const nextProcessSteps =
    parsedProcessSteps.length > 0 ? parsedProcessSteps : current.home.process.steps;

  const nextAdditionalServices = pickItems(
    findIndexedTexts(data, "home", "home-additional-services", "home-additional-service-"),
    current.home.additionalServices,
  );

  const complementaryElements = findSectionElements(data, "home", "home-additional-services");
  const complementaryByIndex = new Map<number, { icon?: string; title?: string; description?: string }>();
  for (const element of complementaryElements) {
    if (element.type !== "text") {
      continue;
    }
    const match = /^home-complementary-service-(\d+)-(icon|title|description)$/.exec(element.id);
    if (!match) {
      continue;
    }
    const index = Number(match[1]);
    const key = match[2] as "icon" | "title" | "description";
    const currentRecord = complementaryByIndex.get(index) ?? {};
    currentRecord[key] = element.content.trim();
    complementaryByIndex.set(index, currentRecord);
  }
  const parsedComplementaryServices = Array.from(complementaryByIndex.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, item]) => ({
      icon: item.icon || "label",
      title: item.title || `Serviciu ${index + 1}`,
      description: item.description || "Descriere serviciu complementar.",
    }));
  const nextComplementaryServices =
    parsedComplementaryServices.length > 0
      ? parsedComplementaryServices
      : current.home.complementaryServices;

  const nextTestimonials = current.home.testimonials.map((item, index) => ({
    quote: findText(data, "home", "home-trust", `home-testimonial-${index}-quote`) ?? item.quote,
    name: findText(data, "home", "home-trust", `home-testimonial-${index}-name`) ?? item.name,
    role: findText(data, "home", "home-trust", `home-testimonial-${index}-role`) ?? item.role,
  }));

  const updatedGlobal = updateGlobalFromCms(data, current.global);
  const updatedPortfolio = updatePortfolioFromCms(data, current.portfolioPage, current.portfolioProjects);
  const updatedBlogPage = updateBlogPageFromCms(data, current.blogPage);
  const updatedContactPage = updateContactPageFromCms(data, current.contactPage);
  const nextCmsPages = data.pages.reduce<NonNullable<SiteContent["cmsPages"]>>((acc, page) => {
    const name = page.name.trim() || page.id;
    acc[page.id] = {
      name,
      slug: normalizePageSlug(page.slug),
      seoTitle: page.seoTitle.trim() || `${name} | ${updatedGlobal.brandName}`,
      seoDescription: page.seoDescription.trim() || defaultSeoDescription(name),
    };
    return acc;
  }, {});

  return {
    ...current,
    global: {
      ...updatedGlobal,
      brandName: data.settings.siteTitle || updatedGlobal.brandName,
    },
    home: {
      ...current.home,
      hero: {
        ...current.home.hero,
        eyebrow: findText(data, "home", "home-hero", "home-hero-eyebrow") ?? current.home.hero.eyebrow,
        title: findText(data, "home", "home-hero", "home-hero-title") ?? current.home.hero.title,
        description:
          findText(data, "home", "home-hero", "home-hero-description") ?? current.home.hero.description,
        primaryCtaLabel:
          findButton(data, "home", "home-hero", "home-hero-primary")?.content ??
          current.home.hero.primaryCtaLabel,
        primaryCtaHref:
          findButton(data, "home", "home-hero", "home-hero-primary")?.href ??
          current.home.hero.primaryCtaHref,
        secondaryCtaLabel:
          findButton(data, "home", "home-hero", "home-hero-secondary")?.content ??
          current.home.hero.secondaryCtaLabel,
        secondaryCtaHref:
          findButton(data, "home", "home-hero", "home-hero-secondary")?.href ??
          current.home.hero.secondaryCtaHref,
        highlightsTitle:
          findText(data, "home", "home-hero", "home-hero-highlights-title") ??
          current.home.hero.highlightsTitle,
        highlights: nextHeroHighlights,
      },
      primaryServicesTitle:
        findText(data, "home", "home-primary-services", "home-primary-services-title") ??
        current.home.primaryServicesTitle,
      primaryServicesDescription:
        findText(data, "home", "home-primary-services", "home-primary-services-description") ??
        current.home.primaryServicesDescription,
      primaryServices: nextHomePrimaryServices,
      secondaryServicesTitle:
        findText(data, "home", "home-secondary-services", "home-secondary-services-title") ??
        current.home.secondaryServicesTitle,
      secondaryServicesDescription:
        findText(data, "home", "home-secondary-services", "home-secondary-services-description") ??
        current.home.secondaryServicesDescription,
      secondaryServices: nextSecondaryServices,
      paidAds: {
        ...current.home.paidAds,
        eyebrow:
          findText(data, "home", "home-paid-ads", "home-paid-ads-eyebrow") ??
          current.home.paidAds.eyebrow,
        title:
          findText(data, "home", "home-paid-ads", "home-paid-ads-title") ??
          current.home.paidAds.title,
        description:
          findText(data, "home", "home-paid-ads", "home-paid-ads-description") ??
          current.home.paidAds.description,
        tags: nextPaidAdsTags,
        statValue:
          findText(data, "home", "home-paid-ads", "home-paid-ads-stat-value") ??
          current.home.paidAds.statValue,
        statDescription:
          findText(data, "home", "home-paid-ads", "home-paid-ads-stat-description") ??
          current.home.paidAds.statDescription,
      },
      portfolioPreview: {
        ...current.home.portfolioPreview,
        title:
          findText(data, "home", "home-portfolio-preview", "home-portfolio-preview-title") ??
          current.home.portfolioPreview.title,
        viewAllLabel:
          findButton(data, "home", "home-portfolio-preview", "home-portfolio-preview-link")?.content ??
          current.home.portfolioPreview.viewAllLabel,
      },
      process: {
        ...current.home.process,
        title:
          findText(data, "home", "home-process", "home-process-title") ??
          current.home.process.title,
        description:
          findText(data, "home", "home-process", "home-process-description") ??
          current.home.process.description,
        steps: nextProcessSteps,
      },
      additionalServicesTitle:
        findText(data, "home", "home-additional-services", "home-additional-services-title") ??
        current.home.additionalServicesTitle,
      additionalServices: nextAdditionalServices,
      complementaryServicesTitle:
        findText(data, "home", "home-additional-services", "home-complementary-services-title") ??
        current.home.complementaryServicesTitle,
      complementaryServices: nextComplementaryServices,
      trustTitle: findText(data, "home", "home-trust", "home-trust-title") ?? current.home.trustTitle,
      testimonials: nextTestimonials,
      finalCta: {
        ...current.home.finalCta,
        title: homeCta?.content ?? current.home.finalCta.title,
        description: homeCta?.subcontent ?? current.home.finalCta.description,
        primaryLabel: homeCta?.buttonLabel ?? current.home.finalCta.primaryLabel,
        primaryHref: homeCta?.buttonHref ?? current.home.finalCta.primaryHref,
      },
    },
    services: {
      ...current.services,
      socialMedia: updateServicePageFromCms(data, "social", current.services.socialMedia),
      photoVideo: updateServicePageFromCms(data, "photo-video", current.services.photoVideo),
      strategy: updateStrategyPageFromCms(data, current.services.strategy),
    },
    portfolioPage: updatedPortfolio.page,
    portfolioProjects: updatedPortfolio.projects,
    blogPage: updatedBlogPage,
    contactPage: updatedContactPage,
    cmsPages: nextCmsPages,
  };
}
