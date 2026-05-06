import type { ComponentType } from "react";
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

type ServicesGridProps = {
  section: SiteContent["landing"]["services"];
};

export function ServicesGrid({ section }: ServicesGridProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="services" className="py-18 sm:py-24">
      <Container>
        <AnimatedSection>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {section.items.filter((item) => item.enabled !== false).map((item, index) => {
            const Icon = iconByName[item.icon] ?? Lightbulb;
            return (
              <AnimatedSection
                key={item.id}
                delay={index * 0.04}
                className="rounded-3xl border border-[#276864]/40 bg-[#0f1418]/80 p-7 backdrop-blur-sm transition duration-300 hover:border-[#66fcf1]/55 hover:shadow-[0_0_30px_-18px_rgba(102,252,241,0.85)]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#66fcf1]/40 bg-[#66fcf1]/8 text-[#66fcf1]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6] sm:text-base">{item.description}</p>
              </AnimatedSection>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
