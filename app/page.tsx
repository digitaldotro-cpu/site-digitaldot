import { ArrowRight, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceSection } from "@/components/sections/service-section";
import { CtaSection } from "@/components/sections/cta-section";
import { AnimatedSection } from "@/components/ui/animated-section";
import { TestimonialBlock } from "@/components/sections/testimonial-block";

export const metadata = buildMetadata({
  title: "Agenție de Marketing Digital",
  path: "/",
});

const highlightIcons = [LineChart, ShieldCheck, Sparkles];

export default async function HomePage() {
  const content = await getSiteContent();
  const home = content.home;

  return (
    <>
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex rounded-full border border-[#2a3d44] bg-[#111920] px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#66fcf1]">
                {home.hero.eyebrow}
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                {home.hero.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#c6c6c6]">
                {home.hero.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ButtonLink href={home.hero.primaryCtaHref}>
                  {home.hero.primaryCtaLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ButtonLink>
                <ButtonLink href={home.hero.secondaryCtaHref} variant="secondary">
                  {home.hero.secondaryCtaLabel}
                </ButtonLink>
              </div>
            </div>

            <AnimatedSection className="rounded-[2rem] border border-[#2b3c43] bg-[linear-gradient(140deg,#11181d_20%,#162f34_100%)] p-8 sm:p-10">
              <p className="text-sm uppercase tracking-[0.12em] text-[#89d8d3]">
                {home.hero.highlightsTitle}
              </p>
              <ul className="mt-6 space-y-5">
                {home.hero.highlights.map((highlight, index) => {
                  const Icon = highlightIcons[index] ?? Sparkles;

                  return (
                    <li key={highlight.title} className="flex items-start gap-3">
                      <Icon className="mt-1 h-5 w-5 text-[#66fcf1]" />
                      <div>
                        <p className="font-semibold text-white">{highlight.title}</p>
                        <p className="text-sm text-[#c0c6ca]">{highlight.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Servicii principale"
            title={home.primaryServicesTitle}
            description={home.primaryServicesDescription}
          />
          <div className="mt-10 space-y-6">
            {home.primaryServices.map((service) => (
              <ServiceSection
                key={service.title}
                title={service.title}
                description={service.description}
                bullets={service.bullets}
                href={service.href}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Servicii secundare"
            title={home.secondaryServicesTitle}
            description={home.secondaryServicesDescription}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {home.secondaryServices.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.7rem] border border-[#293941] bg-[#10171b] p-7"
              >
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#c4c8cc]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Alte servicii"
            title={home.additionalServicesTitle}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {home.additionalServices.map((service) => (
              <span
                key={service}
                className="rounded-full border border-[#2a3941] bg-[#11181d] px-5 py-2 text-sm text-[#d2d7db]"
              >
                {service}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Încredere"
            title={home.trustTitle}
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {home.testimonials.map((testimonial) => (
              <TestimonialBlock
                key={testimonial.name}
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
              />
            ))}
          </div>
        </Container>
      </section>

      <CtaSection
        title={home.finalCta.title}
        description={home.finalCta.description}
        primaryLabel={home.finalCta.primaryLabel}
        primaryHref={home.finalCta.primaryHref}
        secondaryLabel={home.finalCta.secondaryLabel}
        secondaryHref={home.finalCta.secondaryHref}
      />
    </>
  );
}
