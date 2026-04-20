import Image from "next/image";
import Link from "next/link";
import { ArrowRight, EyeOff, MessageCircle, Palette, TrendingDown } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ButtonLink } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Social Media Management",
  path: "/servicii/social-media-management",
  description:
    "Social Media Management premium: strategie, producție, publicare și optimizare pentru engagement, leaduri și poziționare clară.",
});

function splitEditableLine(value: string, fallbackTitle: string) {
  const [first, ...rest] = value.split("|").map((item) => item.trim()).filter(Boolean);

  if (first && rest.length > 0) {
    return {
      title: first,
      description: rest.join(" | "),
    };
  }

  return {
    title: fallbackTitle,
    description: value,
  };
}

export default async function SocialMediaPage() {
  const content = await getSiteContent();
  const page = content.services.socialMedia;
  const projects = content.portfolioProjects.slice(0, 2);
  const heroImage = page.heroImage ?? "/images/social-media/hero-phone.svg";
  const testimonial = content.home.testimonials[0];

  const visibility = {
    hero: page.sectionVisibility?.hero ?? true,
    problems: page.sectionVisibility?.problems ?? true,
    deliverables: page.sectionVisibility?.deliverables ?? true,
    process: page.sectionVisibility?.process ?? true,
    caseStudies: page.sectionVisibility?.caseStudies ?? true,
    finalCta: page.sectionVisibility?.finalCta ?? true,
  };

  const problemTitles = ["Invizibilitate Strategică", "Engagement Scăzut", "Haos Operațional"];
  const problemIcons = [EyeOff, TrendingDown, MessageCircle];
  const problems = page.sectionOneItems.slice(0, 3).map((item, index) => ({
    ...splitEditableLine(item, problemTitles[index] ?? `Provocare ${index + 1}`),
    Icon: problemIcons[index] ?? EyeOff,
  }));

  const deliverableBig = splitEditableLine(
    page.sectionTwoItems[0] ?? "Strategie de Conținut",
    "Strategie de Conținut",
  );
  const deliverableVisualIdentity = splitEditableLine(
    page.sectionTwoItems[1] ?? "Visual Identity",
    "Visual Identity",
  );
  const deliverableProduct = splitEditableLine(
    page.sectionTwoItems[2] ?? "Product Photography",
    "Product Photography",
  );
  const deliverableCommunity = splitEditableLine(
    page.sectionTwoItems[3] ?? "Community Care",
    "Community Care",
  );
  const deliverablePaid = splitEditableLine(
    page.sectionTwoItems[4] ?? "Paid Media",
    "Paid Media",
  );

  const processFallbacks = [
    "Audit & Discovery",
    "Visual Blueprinting",
    "Agile Execution",
  ];
  const processItems = page.sectionThreeItems.slice(0, 3).map((item, index) =>
    splitEditableLine(item, processFallbacks[index] ?? `Etapa ${index + 1}`),
  );

  const caseDescriptions = page.sectionFourItems;

  return (
    <>
      {visibility.hero ? (
        <section className="relative min-h-[78vh] overflow-hidden pb-20 pt-24 sm:pb-28 sm:pt-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-[420px] w-[420px] rounded-full bg-[#276864]/10 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 h-[360px] w-[360px] rounded-full bg-[#66fcf1]/5 blur-[100px]" />
          </div>

          <Container className="relative z-10 grid items-center gap-14 lg:grid-cols-2">
            <AnimatedSection className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#3c4948]/40 bg-[#1a1c1c] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#66fcf1] shadow-[0_0_10px_#66fcf1]" />
                <span className="text-xs uppercase tracking-[0.18em] text-[#bacac7]">
                  {page.heroBadge}
                </span>
              </div>

              <h1 className="text-[50px] font-extrabold leading-[0.96] tracking-tight text-white">
                {page.heroTitle}
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-[#bacac7] sm:text-xl">
                {page.heroDescription}
              </p>

              <div className="flex flex-wrap gap-4">
                <ButtonLink href="/contacteaza-ne" className="h-14 px-10 text-base">
                  {page.heroCtaLabel}
                </ButtonLink>
                <ButtonLink
                  href={page.heroSecondaryCtaHref ?? "/portofoliu"}
                  variant="ghost"
                  className="h-14 border-[#3c4948]/50 px-10 text-base text-white hover:bg-white/5"
                >
                  {page.heroSecondaryCtaLabel ?? "Vezi Portofoliu"}
                </ButtonLink>
              </div>
            </AnimatedSection>

            <AnimatedSection className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-[#3c4948]/30 bg-[#1e2020] shadow-[0_0_48px_rgba(0,55,52,0.08)]">
                <div className="relative aspect-square">
                  <Image
                    src={heroImage}
                    alt="Social media hero"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {testimonial ? (
                <div className="absolute -bottom-5 -left-5 max-w-[250px] rounded-2xl border border-[#3c4948]/30 bg-[#292a2a] p-5 shadow-xl">
                  <p className="text-sm italic text-[#bacac7]">&quot;{testimonial.quote}&quot;</p>
                  <p className="mt-3 text-xs font-bold text-[#66fcf1]">
                    {testimonial.name}, {testimonial.role}
                  </p>
                </div>
              ) : null}
            </AnimatedSection>
          </Container>
        </section>
      ) : null}

      {visibility.problems ? (
        <section className="bg-[#0d0e0f] py-24 sm:py-32">
          <Container>
            <AnimatedSection className="mb-16">
              <p className="text-xs uppercase tracking-[0.2em] text-[#66fcf1]">{page.heroBadge}</p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {page.sectionOneTitle}
              </h2>
            </AnimatedSection>

            <div className="grid gap-6 md:grid-cols-3">
              {problems.map((problem, index) => (
                <AnimatedSection
                  key={`${problem.title}-${index}`}
                  className="rounded-2xl bg-[#1a1c1c] p-8 transition-colors hover:bg-[#1e2020]"
                  delay={index * 0.05}
                >
                  <problem.Icon className="mb-5 h-8 w-8 text-[#66fcf1]" />
                  <h3 className="text-2xl font-bold text-white">{problem.title}</h3>
                  <p className="mt-4 leading-relaxed text-[#bacac7]">{problem.description}</p>
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {visibility.deliverables ? (
        <section className="py-24 sm:py-32">
          <Container>
            <AnimatedSection className="mb-16 text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{page.sectionTwoTitle}</h2>
            </AnimatedSection>

            <div className="grid auto-rows-[220px] gap-5 md:grid-cols-12">
              <AnimatedSection className="group relative overflow-hidden rounded-2xl border border-[#3c4948]/20 bg-[#333535] md:col-span-8 md:row-span-2">
                <Image
                  src={projects[0]?.image ?? heroImage}
                  alt={deliverableBig.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#121414] to-transparent p-8">
                  <h3 className="text-3xl font-bold text-white">{deliverableBig.title}</h3>
                  <p className="mt-2 max-w-md text-[#bacac7]">{deliverableBig.description}</p>
                </div>
              </AnimatedSection>

              <AnimatedSection className="flex flex-col justify-between rounded-2xl border border-[#66fcf1]/20 bg-[#01504c]/25 p-7 md:col-span-4">
                <Palette className="h-8 w-8 text-[#66fcf1]" />
                <div>
                  <h3 className="text-xl font-bold text-white">{deliverableVisualIdentity.title}</h3>
                  <p className="mt-2 text-sm text-[#bacac7]">{deliverableVisualIdentity.description}</p>
                </div>
              </AnimatedSection>

              <AnimatedSection className="group relative overflow-hidden rounded-2xl border border-[#3c4948]/20 bg-[#333535] md:col-span-4 md:row-span-2">
                <Image
                  src={projects[1]?.image ?? heroImage}
                  alt={deliverableProduct.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#121414]/90 to-transparent p-7">
                  <h3 className="text-2xl font-bold text-white">{deliverableProduct.title}</h3>
                  <p className="mt-2 text-sm text-[#bacac7]">{deliverableProduct.description}</p>
                </div>
              </AnimatedSection>

              <AnimatedSection className="flex items-center gap-5 rounded-2xl bg-[#1a1c1c] p-7 md:col-span-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#66fcf1]/10">
                  <MessageCircle className="h-5 w-5 text-[#66fcf1]" />
                </span>
                <div>
                  <h3 className="font-bold text-white">{deliverableCommunity.title}</h3>
                  <p className="mt-1 text-xs text-[#bacac7]">{deliverableCommunity.description}</p>
                </div>
              </AnimatedSection>

              <AnimatedSection className="flex items-center gap-5 rounded-2xl bg-[#1a1c1c] p-7 md:col-span-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#66fcf1]/10">
                  <ArrowRight className="h-5 w-5 text-[#66fcf1]" />
                </span>
                <div>
                  <h3 className="font-bold text-white">{deliverablePaid.title}</h3>
                  <p className="mt-1 text-xs text-[#bacac7]">{deliverablePaid.description}</p>
                </div>
              </AnimatedSection>
            </div>
          </Container>
        </section>
      ) : null}

      {visibility.process ? (
        <section className="bg-[#1a1c1c]/50 py-24 sm:py-32">
          <Container>
            <AnimatedSection className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.2em] text-[#66fcf1]">{page.heroBadge}</p>
                <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {page.sectionThreeTitle}
                </h2>
              </div>
            </AnimatedSection>

            <div className="space-y-3">
              {processItems.map((item, index) => (
                <AnimatedSection
                  key={`${item.title}-${index}`}
                  className="group flex flex-col items-center gap-6 rounded-2xl p-7 transition-all hover:bg-[#292a2a] md:flex-row md:p-9"
                  delay={index * 0.04}
                >
                  <span className="text-5xl font-black text-[#3c4948] transition-colors group-hover:text-[#66fcf1]/40 md:text-6xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-[#bacac7]">{item.description}</p>
                  </div>
                  <ArrowRight className="hidden h-5 w-5 text-[#66fcf1] opacity-0 transition-opacity group-hover:opacity-100 md:block" />
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {visibility.caseStudies ? (
        <section className="py-24 sm:py-32">
          <Container>
            <AnimatedSection className="mb-12">
              <h2 className="text-4xl font-bold tracking-tight text-white">{page.sectionFourTitle}</h2>
            </AnimatedSection>

            <div className="grid gap-10 md:grid-cols-2">
              {projects.map((project, index) => (
                <AnimatedSection key={project.slug}>
                  <article className="group cursor-pointer">
                    <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-[#66fcf1]/10 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                        <p className="mt-1 text-[#bacac7]">
                          {caseDescriptions[index] ?? project.excerpt}
                        </p>
                      </div>
                      <span className="rounded-full border border-[#3c4948]/40 px-4 py-1 text-[10px] uppercase tracking-[0.12em] text-[#bacac7]">
                        {project.category}
                      </span>
                    </div>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {visibility.finalCta ? (
        <section className="mb-20 pb-4 sm:mb-24">
          <Container>
            <AnimatedSection className="relative overflow-hidden rounded-2xl border border-[#3c4948]/20 bg-gradient-to-br from-[#292a2a] to-[#0d0e0f] px-8 py-14 text-center sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 bg-[#66fcf1]/5 blur-[110px]" />
              <h2 className="relative z-10 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                {page.finalCta.title}
              </h2>
              <p className="relative z-10 mx-auto mt-6 max-w-2xl text-lg text-[#bacac7]">
                {page.finalCta.description}
              </p>
              <div className="relative z-10 mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <ButtonLink href={page.finalCta.primaryHref} className="h-14 px-10 text-lg">
                  {page.finalCta.primaryLabel}
                </ButtonLink>
                <ButtonLink
                  href={page.finalCta.secondaryHref ?? "/contacteaza-ne"}
                  variant="ghost"
                  className="h-14 border-[#3c4948]/50 px-10 text-lg text-white hover:bg-white/5"
                >
                  {page.finalCta.secondaryLabel ?? "Vezi Prețuri"}
                </ButtonLink>
              </div>
            </AnimatedSection>
          </Container>
        </section>
      ) : null}

      <section className="pb-8">
        <Container className="text-right">
          <Link
            href="/portofoliu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#66fcf1] hover:underline"
          >
            Vezi toate studiile de caz
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </section>
    </>
  );
}
