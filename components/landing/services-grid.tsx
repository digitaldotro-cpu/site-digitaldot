import type { ComponentType } from "react";
import Link from "next/link";
import { Clapperboard, Code2, LayoutPanelTop, Lightbulb, Megaphone, Monitor, Search, Share2, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { SiteContent } from "@/lib/site-content-schema";

const iconByName: Record<string, ComponentType<{ className?: string }>> = {
  Lightbulb,
  Share2,
  Clapperboard,
  Megaphone,
  Monitor,
  LayoutPanelTop,
  Code2,
  Search,
  TrendingUp,
};

const hrefByServiceTitle: Record<string, string> = {
  "Social Media Management": "/social-media-management",
  "Producție Foto & Video": "/productie-video",
  "Strategie de Marketing": "/#positioning",
  "Google & Meta Ads": "/google-meta-ads",
  "Website Creation": "/website-creation",
  "Reclame Plătite: Google & Facebook": "/google-meta-ads",
  "Creare Web (WordPress & Shopify)": "/website-creation",
  SEO: "/seo",
};

type ServicesGridProps = {
  section: SiteContent["landing"]["services"];
};

export function ServicesGrid({ section }: ServicesGridProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="services" className="scroll-mt-24 py-18 sm:py-24">
      <Container>
        <AnimatedSection className="max-w-4xl">
          <span className="brand-rule mb-5" />
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
          {section.subtitle ? (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
              {section.subtitle}
            </p>
          ) : null}
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {section.items.filter((item) => item.enabled !== false).map((item, index) => {
            const Icon = iconByName[item.icon] ?? Lightbulb;
            const href = hrefByServiceTitle[item.title];
            return (
              <AnimatedSection
                key={item.id}
                delay={index * 0.04}
                className="brand-card p-6 sm:p-7"
              >
                <article>
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#276864]/55 bg-[#0b0c10]/70 text-[#66fcf1]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {href ? (
                    <Link href={href} className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66fcf1]">
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#dadada] sm:text-base">{item.description}</p>
                </article>
              </AnimatedSection>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
