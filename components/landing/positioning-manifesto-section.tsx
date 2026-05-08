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
    "border-[#263740]/65 bg-[linear-gradient(145deg,rgba(11,15,19,0.9),rgba(8,11,15,0.96))]",
  glow:
    "border-[#2a444d] bg-[linear-gradient(145deg,rgba(16,24,30,0.95),rgba(10,13,17,0.98))] shadow-[0_0_55px_-35px_rgba(102,252,241,0.5)]",
  glass:
    "border-[#2d474f] bg-[linear-gradient(145deg,rgba(17,25,32,0.84),rgba(9,12,16,0.9))] backdrop-blur-sm",
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
          "rounded-full px-2 py-0.5",
          tone === "headline"
            ? "bg-[#66fcf1]/12 text-[#66fcf1]"
            : "bg-[#66fcf1]/10 text-[#d8fffc]",
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
        <div className="relative overflow-hidden rounded-[2.15rem] border p-7 sm:p-10 lg:p-14">
          <div
            className={cn(
              "pointer-events-none absolute inset-0 opacity-95 transition-opacity duration-700",
              backgroundClass,
            )}
          />

          <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-[#66fcf1]/12 blur-3xl transition-opacity duration-700" />
          <div className="relative space-y-12 sm:space-y-14 lg:space-y-16">
            <AnimatedSection className={cn("max-w-4xl", widthAlignmentClass)}>
              <h2
                className={cn(
                  "text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.015em] text-white sm:text-[2.9rem] lg:text-[3.5rem]",
                  alignmentClass,
                )}
              >
                {renderHighlightedText(section.title, section.highlightedWords, "headline")}
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.05} className={cn("max-w-3xl", widthAlignmentClass)}>
              <p
                className={cn(
                  "text-pretty text-lg leading-[1.85] text-[#cbd4d9] sm:text-[1.2rem]",
                  alignmentClass,
                )}
              >
                {renderHighlightedText(section.introParagraph, section.optionalHighlightedPhrases, "body")}
              </p>
            </AnimatedSection>

            <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
              <div className="space-y-6">
                {section.editorialParagraphs.map((entry, index) => (
                  <AnimatedSection
                    key={entry.id}
                    delay={0.08 + index * 0.05}
                    className="rounded-2xl border border-[#2a3c44]/65 bg-[#0f151a]/75 p-6 sm:p-7"
                  >
                    <p className="text-pretty text-base leading-8 text-[#d0d7db] sm:text-[1.06rem]">
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
                    className="rounded-2xl border border-[#66fcf1]/28 bg-[#66fcf1]/8 p-6"
                  >
                    <p className="text-pretty text-lg leading-relaxed text-[#e8fffd]">“{quote.text}”</p>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            <AnimatedSection delay={0.24} className={cn("space-y-7", widthAlignmentClass)}>
              <p
                className={cn(
                  "max-w-3xl text-pretty text-lg leading-[1.85] text-[#c7cfd4] sm:text-[1.15rem]",
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
                  className="group h-12 border-[#2e434b] bg-[#122029] px-8 text-sm uppercase tracking-[0.09em] text-[#dff9f7] hover:border-[#66fcf1]/70 hover:bg-[#152730]"
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
