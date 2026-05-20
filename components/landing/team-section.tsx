import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { TeamMemberCard } from "@/components/landing/team-member-card";
import type { SiteContent } from "@/lib/site-content-schema";

type TeamSectionProps = {
  section: SiteContent["landing"]["teamSection"];
};

export function TeamSection({ section }: TeamSectionProps) {
  if (!section.enabled) {
    return null;
  }

  return (
    <section id="team" className="scroll-mt-24 py-18 sm:py-24">
      <Container>
        <AnimatedSection className="max-w-4xl">
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{section.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#c6c6c6] sm:text-lg">
            {section.subtitle}
          </p>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {section.members.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} delay={index * 0.05} />
          ))}
        </div>
      </Container>
    </section>
  );
}
