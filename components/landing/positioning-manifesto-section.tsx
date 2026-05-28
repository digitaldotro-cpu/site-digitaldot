import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/lib/site-content-schema";

type PositioningManifestoSectionProps = {
  section: SiteContent["landing"]["positioning"];
};

const spacingClassMap: Record<SiteContent["landing"]["positioning"]["layout"]["spacingPreset"], string> = {
  compact: "py-16 sm:py-20",
  standard: "py-18 sm:py-24",
  cinematic: "py-22 sm:py-30",
};

const backgroundClassMap: Record<SiteContent["landing"]["positioning"]["layout"]["backgroundVariant"], string> = {
  subtle:
    "border-[#276864]/30 bg-[linear-gradient(145deg,rgba(16,20,24,0.9),rgba(11,12,16,0.98))]",
  glow:
    "border-[#276864]/34 bg-[linear-gradient(145deg,rgba(16,20,24,0.92),rgba(11,12,16,0.98))]",
  glass:
    "border-[#276864]/30 bg-[linear-gradient(145deg,rgba(16,20,24,0.78),rgba(11,12,16,0.92))] backdrop-blur-sm",
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderHighlightedText(text: string, phrases: string[], tone: "headline" | "body") {
  const cleaned = phrases.map((item) => item.trim()).filter(Boolean);

  if (cleaned.length === 0) {
    return text;
  }

  const matcher = new RegExp(`(${cleaned.map((phrase) => escapeRegExp(phrase)).join("|")})`, "gi");
  const parts = text.split(matcher);

  return parts.map((part, index) => {
    const highlighted = cleaned.some((phrase) => part.toLowerCase() === phrase.toLowerCase());

    if (!highlighted) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <span
        key={`${part}-${index}`}
        className={cn(
          tone === "headline"
            ? "text-[#d8c7a3]"
            : "rounded-full bg-[#276864]/10 px-2 py-0.5 text-[#d8c7a3]",
        )}
      >
        {part}
      </span>
    );
  });
}

export function PositioningManifestoSection({ section }: PositioningManifestoSectionProps) {
  if (!section.enabled) {
    return null;
  }

  const alignmentClass = section.layout.alignment === "center" ? "text-center" : "text-left";
  const widthAlignmentClass = section.layout.alignment === "center" ? "mx-auto" : "";
  const spacingClass = spacingClassMap[section.layout.spacingPreset];
  const backgroundClass = backgroundClassMap[section.layout.backgroundVariant];
  const paragraphHighlights = [...section.highlightedWords, ...section.optionalHighlightedPhrases];

  return (
    <section id="positioning" className={cn("scroll-mt-24", spacingClass)}>
      <Container className="max-w-6xl">
        <div className="brand-orbit relative overflow-hidden rounded-[22px] border p-7 sm:p-10 lg:p-14">
          <div
            className={cn(
              "pointer-events-none absolute inset-0 opacity-95 transition-opacity duration-700",
              backgroundClass,
            )}
          />

          <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-[#276864]/7 transition-opacity duration-700" />
          <div className="relative space-y-10 sm:space-y-12 lg:space-y-14">
            <AnimatedSection className={cn("max-w-4xl", widthAlignmentClass)}>
              <h2
                className={cn(
                  "text-balance text-[2rem] font-semibold leading-[1.08] text-white sm:text-[2.9rem] lg:text-[3.5rem]",
                  alignmentClass,
                )}
              >
                {renderHighlightedText(section.title, section.highlightedWords, "headline")}
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.05} className={cn("max-w-3xl", widthAlignmentClass)}>
              <p
                className={cn(
                  "text-pretty text-lg leading-[1.85] text-[#dadada] sm:text-[1.2rem]",
                  alignmentClass,
                )}
              >
                {renderHighlightedText(section.introParagraph, section.optionalHighlightedPhrases, "body")}
              </p>
            </AnimatedSection>

            {section.comparison ? (
              <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr]">
                <AnimatedSection delay={0.08} className="brand-card p-6 sm:p-7">
                  <h3 className="text-xl font-semibold text-white">{section.comparison.left.title}</h3>
                  <ul className="mt-5 space-y-3 text-[#dadada]">
                    {section.comparison.left.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d8c7a3]/80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </AnimatedSection>

                <AnimatedSection delay={0.12} className="relative hidden items-center px-1 lg:flex">
                  <div className="flex h-full min-h-64 w-14 items-center justify-center">
                    <div className="h-px w-full bg-gradient-to-r from-[#c6c6c6]/20 via-[#276864] to-[#276864]" />
                    <ArrowRight className="absolute h-5 w-5 rounded-full border border-[#276864]/35 bg-[#0b0c10] p-1 text-[#d8c7a3]" />
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.16} className="brand-card border-[#276864]/45 p-6 sm:p-7">
                  <h3 className="text-xl font-semibold text-[#e8fffd]">{section.comparison.right.title}</h3>
                  <ul className="mt-5 space-y-3 text-[#d9fffc]">
                    {section.comparison.right.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#276864]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </AnimatedSection>
              </div>
            ) : (
              <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
                <div className="space-y-6">
                  {section.editorialParagraphs.map((entry, index) => (
                    <AnimatedSection
                      key={entry.id}
                      delay={0.08 + index * 0.05}
                      className="rounded-xl border border-[#1f2a2d] bg-[#101418]/78 p-6 sm:p-7"
                    >
                      <p className="text-pretty text-base leading-8 text-[#dadada] sm:text-[1.06rem]">
                        {renderHighlightedText(entry.text, paragraphHighlights, "body")}
                      </p>
                    </AnimatedSection>
                  ))}
                </div>

                <div className="space-y-5">
                  {section.quoteBlocks.map((quote, index) => (
                    <AnimatedSection
                      key={quote.id}
                      delay={0.16 + index * 0.06}
                      className="rounded-xl border border-[#276864]/50 bg-[#0b0c10]/52 p-6"
                    >
                      <p className="text-pretty text-lg leading-relaxed text-[#e8fffd]">“{quote.text}”</p>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            )}

            <AnimatedSection delay={0.24} className={cn("space-y-7", widthAlignmentClass)}>
              <p
                className={cn(
                  "max-w-3xl text-pretty text-lg leading-[1.85] text-[#dadada] sm:text-[1.15rem]",
                  alignmentClass,
                )}
              >
                {renderHighlightedText(section.closingParagraph, paragraphHighlights, "body")}
              </p>

              {section.cta.enabled ? (
                <ButtonLink
                  href={section.cta.link}
                  size="lg"
                  variant="secondary"
                  className="group h-12 border-[#2e434b] bg-[#122029] px-8 text-sm uppercase tracking-[0.09em] text-[#dff9f7] hover:border-[#276864]/70 hover:bg-[#152730]"
                >
                  {section.cta.text}
                  <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </ButtonLink>
              ) : null}
            </AnimatedSection>
          </div>
        </div>
      </Container>
    </section>
  );
}
