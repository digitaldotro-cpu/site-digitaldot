import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  AtSign,
  Clapperboard,
  Lightbulb,
  Quote,
  SearchCheck,
  Share2,
  ShoppingBag,
  TrendingUp,
  Video,
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

const serviceIconByIndex: Array<ComponentType<{ className?: string }>> = [Share2, Video, Lightbulb];
const processIconByKey: Record<string, ComponentType<{ className?: string }>> = {
  architecture: Lightbulb,
  movie_filter: Clapperboard,
  trending_up: TrendingUp,
};
const complementaryIconByKey: Record<string, ComponentType<{ className?: string }>> = {
  search_check: SearchCheck,
  shopping_bag: ShoppingBag,
  alternate_email: AtSign,
};

function highlightDigitalWord(title: string) {
  const match = /digital/i.exec(title);
  if (!match) {
    return title;
  }

  const start = match.index;
  const end = start + match[0].length;

  return (
    <>
      {title.slice(0, start)}
      <span className="bg-gradient-to-r from-[#62f9ee] to-[#afeee9] bg-clip-text text-transparent">
        {title.slice(start, end)}
      </span>
      {title.slice(end)}
    </>
  );
}

export default async function HomePage() {
  const content = await getSiteContent();
  const home = content.home;
  const projects = content.portfolioProjects.slice(0, 3);
  const heroVisual = projects[0]?.image ?? "/images/portfolio/ecom-fashion.svg";
  const testimonial = home.testimonials[0];
  const complementaryServices = home.complementaryServices.slice(0, 3);

  return (
    <>
      <section className="relative min-h-screen overflow-hidden pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(39,104,100,0.15)_0%,rgba(18,20,20,0)_70%)]" />
        <Container className="relative z-10 grid min-h-[calc(100vh-5rem)] items-center gap-12 py-10 lg:grid-cols-12">
          <AnimatedSection className="space-y-8 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3c4948]/30 bg-[#292a2a] px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#62f9ee] shadow-[0_0_12px_#62f9ee]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#bacac7]">{home.hero.eyebrow}</span>
            </div>

            <h1 className="text-[50px] font-extrabold leading-[1.1] tracking-tight text-white">
              {highlightDigitalWord(home.hero.title)}
            </h1>

            <p className="max-w-xl text-xl leading-relaxed text-[#bacac7]">{home.hero.description}</p>

            <div className="flex flex-wrap gap-4 pt-2">
              <ButtonLink href={home.hero.primaryCtaHref} className="h-14 px-8 text-lg">
                {home.hero.primaryCtaLabel}
              </ButtonLink>
              <ButtonLink href={home.hero.secondaryCtaHref} variant="ghost" className="h-14 border-[#3c4948]/40 px-8 text-lg text-white hover:bg-white/5">
                {home.hero.secondaryCtaLabel}
              </ButtonLink>
            </div>
          </AnimatedSection>

          <AnimatedSection className="relative lg:col-span-5">
            <div className="mx-auto aspect-square max-w-[420px] animate-[spin_20s_linear_infinite] rounded-full border-2 border-[#62f9ee]/20 p-8">
              <div className="h-full w-full rounded-full border border-[#62f9ee]/40" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-64 rotate-12 overflow-hidden rounded-2xl border border-[#3c4948]/30 bg-[#1e2020] shadow-2xl">
                <Image
                  src={heroVisual}
                  alt="Digital Dot hero visual"
                  width={600}
                  height={600}
                  className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                />
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <section className="bg-[#121414] py-32">
        <Container>
          <div className="mb-24 max-w-3xl">
            <span className="mb-4 block text-sm uppercase tracking-[0.2em] text-[#62f9ee]">Servicii Nucleu</span>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">{home.primaryServicesTitle}</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {home.primaryServices.slice(0, 3).map((service, index) => {
              const Icon = serviceIconByIndex[index] ?? Lightbulb;
              return (
                <AnimatedSection
                  key={service.title}
                  className="group rounded-2xl border border-[#3c4948]/10 bg-[#1e2020] p-8 transition-all duration-500 hover:border-[#62f9ee]/20"
                >
                  <div className="mb-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#292a2a] text-[#62f9ee]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                  <p className="mt-4 leading-relaxed text-[#bacac7]">{service.description}</p>
                  <div className="mt-8 h-48 overflow-hidden rounded-xl bg-[#0d0e0f]">
                    <Image
                      src={projects[index]?.image ?? heroVisual}
                      alt={service.title}
                      width={900}
                      height={600}
                      className="h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <AnimatedSection className="relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-2xl bg-[#1e2020] p-12 md:col-span-8">
              <div className="relative z-10">
                <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#93d2cd]">{home.paidAds.eyebrow}</span>
                <h3 className="mb-6 text-4xl font-bold text-white">{home.paidAds.title}</h3>
                <p className="max-w-md text-lg text-[#bacac7]">{home.paidAds.description}</p>
              </div>
              <div className="relative z-10 mt-8 flex flex-wrap gap-3">
                {home.paidAds.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="pointer-events-none absolute bottom-0 right-0 h-full w-1/2 opacity-20">
                <Image src={projects[2]?.image ?? heroVisual} alt="Paid media visual" fill sizes="33vw" className="object-cover" />
              </div>
            </AnimatedSection>

            <AnimatedSection className="flex flex-col items-center justify-center rounded-2xl bg-[#62f9ee] p-12 text-center md:col-span-4">
              <h4 className="mb-4 text-5xl font-black text-[#003734]">{home.paidAds.statValue}</h4>
              <p className="font-bold text-[#003734]/80">{home.paidAds.statDescription}</p>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="bg-[#121414] py-32">
        <Container>
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-baseline">
            <h2 className="text-5xl font-bold tracking-tight text-white">
              {home.portfolioPreview.title.split(" ")[0]}{" "}
              <span className="text-[#62f9ee]">{home.portfolioPreview.title.replace(`${home.portfolioPreview.title.split(" ")[0]} `, "")}</span>
            </h2>
            <Link href="/portofoliu" className="inline-flex items-center gap-2 font-bold text-[#62f9ee] hover:underline">
              {home.portfolioPreview.viewAllLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {projects.slice(0, 2).map((project, projectIndex) => (
              <AnimatedSection key={project.slug} className={projectIndex === 1 ? "md:translate-y-24" : ""}>
                <div className="group space-y-6">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                    <Image src={project.image} alt={project.title} fill sizes="50vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#62f9ee]/90 text-[#003734]">
                        <Video className="h-9 w-9" />
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">{project.title}</h4>
                    <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[#bacac7]">{project.category}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      <section className="mt-24 bg-[#0d0e0f] py-32">
        <Container>
          <div className="mx-auto mb-24 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-white">{home.process.title}</h2>
            <p className="text-lg text-[#bacac7]">{home.process.description}</p>
          </div>

          <div className="relative grid grid-cols-1 gap-16 md:grid-cols-3">
            <div className="absolute left-0 top-12 hidden h-px w-full bg-gradient-to-r from-transparent via-[#3c4948]/30 to-transparent md:block" />
            {home.process.steps.slice(0, 3).map((step) => {
              const Icon = processIconByKey[step.icon] ?? TrendingUp;
              return (
                <AnimatedSection key={step.title} className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full border border-[#62f9ee]/20 bg-[#1e2020] text-[#62f9ee]">
                    <Icon className="h-10 w-10" />
                  </div>
                  <h4 className="mb-4 text-2xl font-bold text-white">{step.title}</h4>
                  <p className="leading-relaxed text-[#bacac7]">{step.description}</p>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-[#121414] py-32">
        <Container>
          <AnimatedSection className="relative rounded-2xl bg-[#1a1c1c] p-16">
            <Quote className="absolute -top-7 left-10 h-20 w-20 text-[#62f9ee]/20" />
            <div className="relative z-10 max-w-3xl">
              <p className="mb-8 text-3xl italic leading-snug text-white">&quot;{testimonial?.quote}&quot;</p>
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0f1519] text-sm font-bold text-[#66fcf1]">
                  {testimonial?.name
                    ?.split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div>
                  <h5 className="font-bold text-white">{testimonial?.name}</h5>
                  <p className="text-sm text-[#bacac7]">{testimonial?.role}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <section className="bg-[#0d0e0f] py-32">
        <Container>
          <div className="mb-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#3c4948]/30" />
            <h2 className="shrink-0 text-sm uppercase tracking-[0.2em] text-[#bacac7]">{home.complementaryServicesTitle}</h2>
            <div className="h-px flex-1 bg-[#3c4948]/30" />
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {complementaryServices.map((service) => {
              const Icon = complementaryIconByKey[service.icon] ?? Lightbulb;
              return (
                <AnimatedSection key={service.title} className="flex gap-6">
                  <Icon className="mt-1 h-8 w-8 shrink-0 text-[#62f9ee]" />
                  <div>
                    <h4 className="mb-2 text-xl font-bold text-white">{service.title}</h4>
                    <p className="text-sm leading-relaxed text-[#bacac7]">{service.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-[#121414] py-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(39,104,100,0.15)_0%,rgba(18,20,20,0)_70%)] opacity-60" />
        <Container className="relative z-10 text-center">
          <h2 className="mx-auto mb-8 max-w-4xl text-5xl font-extrabold tracking-tight text-white md:text-7xl">{home.finalCta.title}</h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-[#bacac7]">{home.finalCta.description}</p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <ButtonLink href={home.finalCta.primaryHref} className="h-14 w-full px-12 text-xl sm:w-auto">
              {home.finalCta.primaryLabel}
            </ButtonLink>
            <a href={`mailto:${content.global.footer.contactEmail}`} className="text-lg font-bold text-white hover:text-[#62f9ee]">
              {content.global.footer.contactEmail}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
