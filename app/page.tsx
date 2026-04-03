import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  Lightbulb,
  Share2,
  Video,
  TrendingUp,
  SearchCheck,
  ShoppingBag,
  AtSign,
  Gauge,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";

export const metadata = buildMetadata({
  title: "Digital Curator Agency",
  path: "/",
});

const serviceIconByTitle: Record<string, ComponentType<{ className?: string }>> = {
  "Social Media Management": Share2,
  "Producție Foto & Video": Video,
  "Strategie de marketing": Lightbulb,
};

const processIconByKey: Record<string, ComponentType<{ className?: string }>> = {
  architecture: Lightbulb,
  movie_filter: Video,
  trending_up: TrendingUp,
};

const complementaryIconByKey: Record<string, ComponentType<{ className?: string }>> = {
  search_check: SearchCheck,
  shopping_bag: ShoppingBag,
  alternate_email: AtSign,
};

export default async function HomePage() {
  const content = await getSiteContent();
  const home = content.home;
  const projects = content.portfolioProjects.slice(0, 2);
  const heroVisual = projects[0]?.image ?? "/images/portfolio/ecom-fashion.svg";
  const testimonial = home.testimonials[0];
  const heroTitleParts = home.hero.title.split("Digital");

  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(39,104,100,0.2)_0%,rgba(18,20,20,0)_68%)]" />
        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-12">
          <AnimatedSection className="space-y-8 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3c4948]/30 bg-[#292a2a] px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-[#62f9ee] shadow-[0_0_14px_#62f9ee]" />
              <span className="text-xs uppercase tracking-[0.18em] text-[#bacac7]">
                {home.hero.eyebrow}
              </span>
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-7xl xl:text-8xl">
              {heroTitleParts.length > 1 ? (
                <>
                  {heroTitleParts[0]}
                  <span className="bg-gradient-to-r from-[#62f9ee] to-[#afeee9] bg-clip-text text-transparent">
                    Digital
                  </span>
                  {heroTitleParts.slice(1).join("Digital")}
                </>
              ) : (
                home.hero.title
              )}
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-[#bacac7]">{home.hero.description}</p>

            <div className="grid gap-3 sm:grid-cols-3">
              {home.hero.highlights.map((highlight) => (
                <div key={highlight.title} className="rounded-xl border border-[#3c4948]/25 bg-[#1a1c1c]/70 p-3">
                  <p className="text-sm font-semibold text-white">{highlight.title}</p>
                  <p className="mt-1 text-xs text-[#bacac7]">{highlight.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <ButtonLink href={home.hero.primaryCtaHref} className="h-14 px-8 text-base">
                {home.hero.primaryCtaLabel}
              </ButtonLink>
              <ButtonLink href={home.hero.secondaryCtaHref} variant="secondary" className="h-14 px-8 text-base">
                {home.hero.secondaryCtaLabel}
              </ButtonLink>
            </div>
          </AnimatedSection>

          <AnimatedSection className="relative lg:col-span-5">
            <div className="mx-auto aspect-square max-w-[420px] rounded-full border-2 border-[#62f9ee]/20 p-8">
              <div className="h-full w-full rounded-full border border-[#62f9ee]/40" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-64 rotate-12 overflow-hidden rounded-2xl border border-[#3c4948]/30 bg-[#1e2020] shadow-2xl">
                <Image
                  src={heroVisual}
                  alt="Digital Dot hero visual"
                  width={600}
                  height={600}
                  className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
                />
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <section className="bg-[#121414] py-28">
        <Container>
          <div className="mb-16 max-w-3xl">
            <span className="mb-4 block text-xs uppercase tracking-[0.2em] text-[#62f9ee]">
              Servicii Nucleu
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {home.primaryServicesTitle}
            </h2>
            <p className="mt-5 text-[#bacac7]">{home.primaryServicesDescription}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {home.primaryServices.map((service, index) => {
              const Icon = serviceIconByTitle[service.title] ?? Gauge;

              return (
                <AnimatedSection
                  key={service.title}
                  className="group rounded-2xl border border-[#3c4948]/20 bg-[#1e2020] p-8 transition-all duration-500 hover:border-[#62f9ee]/25"
                >
                  <span className="mb-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#292a2a] text-[#62f9ee]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                  <p className="mt-4 text-[#bacac7]">{service.description}</p>
                  <div className="mt-8 h-44 overflow-hidden rounded-xl border border-[#3c4948]/20 bg-[#0d0e0f]">
                    <Image
                      src={projects[index]?.image ?? heroVisual}
                      alt={service.title}
                      width={900}
                      height={600}
                      className="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                    />
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-[#0d0e0f] py-24">
        <Container>
          <div className="grid gap-8 md:grid-cols-12">
            <AnimatedSection className="relative min-h-[360px] overflow-hidden rounded-2xl border border-[#3c4948]/20 bg-[#1e2020] p-10 md:col-span-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#93d2cd]">{home.paidAds.eyebrow}</p>
              <h3 className="mt-4 text-4xl font-bold text-white">{home.paidAds.title}</h3>
              <p className="mt-5 max-w-xl text-lg text-[#bacac7]">{home.paidAds.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {home.paidAds.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection className="flex flex-col items-center justify-center rounded-2xl bg-[#62f9ee] p-10 text-center md:col-span-4">
              <p className="text-5xl font-black text-[#003734]">{home.paidAds.statValue}</p>
              <p className="mt-4 font-semibold text-[#003734]/85">{home.paidAds.statDescription}</p>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="bg-[#121414] py-28">
        <Container>
          <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {home.portfolioPreview.title.split(" ")[0]}{" "}
              <span className="text-[#62f9ee]">
                {home.portfolioPreview.title.replace(`${home.portfolioPreview.title.split(" ")[0]} `, "")}
              </span>
            </h2>
            <Link href="/portofoliu" className="inline-flex items-center gap-2 text-sm font-bold text-[#62f9ee] hover:underline">
              {home.portfolioPreview.viewAllLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {projects.map((project, index) => (
              <AnimatedSection key={project.slug} className={index === 1 ? "md:translate-y-14" : ""}>
                <div className="group space-y-6">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#62f9ee] text-[#003734]">
                        <ArrowRight className="h-7 w-7" />
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#bacac7]">{project.category}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      <section className="mt-20 bg-[#0d0e0f] py-28">
        <Container>
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-white">{home.process.title}</h2>
            <p className="mt-5 text-lg text-[#bacac7]">{home.process.description}</p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {home.process.steps.map((step) => {
              const Icon = processIconByKey[step.icon] ?? TrendingUp;

              return (
                <AnimatedSection key={step.title} className="text-center">
                  <span className="mx-auto mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full border border-[#62f9ee]/25 bg-[#1e2020] text-[#62f9ee]">
                    <Icon className="h-10 w-10" />
                  </span>
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  <p className="mt-4 text-[#bacac7]">{step.description}</p>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-[#121414] py-28">
        <Container>
          <h2 className="mb-10 text-3xl font-bold text-white">{home.trustTitle}</h2>
          <AnimatedSection className="relative rounded-2xl bg-[#1a1c1c] p-10 sm:p-14">
            <blockquote className="max-w-4xl text-2xl italic leading-snug text-white sm:text-3xl">
              {testimonial.quote}
            </blockquote>
            <div className="mt-8">
              <p className="font-bold text-white">{testimonial.name}</p>
              <p className="text-sm text-[#bacac7]">{testimonial.role}</p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <section className="bg-[#0d0e0f] py-28">
        <Container>
          <div className="mb-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#3c4948]/30" />
            <h2 className="shrink-0 text-xs uppercase tracking-[0.2em] text-[#bacac7]">
              {home.complementaryServicesTitle}
            </h2>
            <div className="h-px flex-1 bg-[#3c4948]/30" />
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {home.complementaryServices.map((service) => {
              const Icon = complementaryIconByKey[service.icon] ?? Lightbulb;

              return (
                <AnimatedSection key={service.title} className="flex gap-5">
                  <Icon className="mt-1 h-8 w-8 shrink-0 text-[#62f9ee]" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#bacac7]">{service.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-[#121414] py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(39,104,100,0.18)_0%,rgba(18,20,20,0)_72%)]" />
        <Container className="relative z-10 text-center">
          <h2 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            {home.finalCta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#bacac7]">{home.finalCta.description}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <ButtonLink href={home.finalCta.primaryHref} className="h-14 px-10 text-lg">
              {home.finalCta.primaryLabel}
            </ButtonLink>
            <a className="text-lg font-bold text-white transition-colors hover:text-[#62f9ee]" href={`mailto:${content.global.footer.contactEmail}`}>
              {content.global.footer.contactEmail}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
