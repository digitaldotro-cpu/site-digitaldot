import Image from "next/image";
import Link from "next/link";
import { ArrowRight, EyeOff, HeartCrack, PhoneCall, Play, Sparkles, Workflow } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";

export const metadata = buildMetadata({
  title: "Producție Foto & Video",
  path: "/servicii/productie-foto-video",
  description:
    "Producție foto-video premium pentru branduri care vor impact în engagement, conversii și diferențiere vizuală.",
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

export default async function ProductieFotoVideoPage() {
  const content = await getSiteContent();
  const page = content.services.photoVideo;
  const projects = content.portfolioProjects.slice(0, 2);
  const heroImage = page.heroImage ?? "/images/photo-video/camera-rig.svg";

  const visibility = {
    hero: page.sectionVisibility?.hero ?? true,
    problems: page.sectionVisibility?.problems ?? true,
    deliverables: page.sectionVisibility?.deliverables ?? true,
    process: page.sectionVisibility?.process ?? true,
    caseStudies: page.sectionVisibility?.caseStudies ?? true,
    finalCta: page.sectionVisibility?.finalCta ?? true,
  };

  const problemTitles = [
    "Invizibilitate vizuală",
    "Lipsă de consistență",
    "Fără conexiune emoțională",
  ];
  const problemIcons = [EyeOff, Workflow, HeartCrack];
  const problems = page.sectionOneItems.slice(0, 3).map((item, index) => ({
    ...splitEditableLine(item, problemTitles[index] ?? `Problemă ${index + 1}`),
    Icon: problemIcons[index] ?? EyeOff,
  }));

  const deliverableMain = splitEditableLine(
    page.sectionTwoItems[0] ?? "Spoturi Publicitare & Brand Videos",
    "Spoturi Publicitare & Brand Videos",
  );
  const deliverableTech = splitEditableLine(
    page.sectionTwoItems[1] ?? "Calitate cinematică",
    "Calitate cinematică",
  );
  const deliverableCards = [
    splitEditableLine(
      page.sectionTwoItems[2] ?? "Fotografie de Produs",
      "Fotografie de Produs",
    ),
    splitEditableLine(
      page.sectionTwoItems[3] ?? "Reels & TikToks",
      "Reels & TikToks",
    ),
    splitEditableLine(
      page.sectionFourItems[0] ?? "Aftermovies",
      "Aftermovies",
    ),
  ];

  const processFallbackTitles = ["Discovery", "Pre-Producție", "Producție", "Post-Producție"];
  const processSteps = page.sectionThreeItems.slice(0, 4).map((item, index) =>
    splitEditableLine(item, processFallbackTitles[index] ?? `Etapa ${index + 1}`),
  );

  const phoneHref = `tel:${content.global.footer.contactPhone.replace(/\s+/g, "")}`;

  return (
    <>
      {visibility.hero ? (
        <section className="relative min-h-[78vh] overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-28">
          <Container className="relative">
            <div className="pointer-events-none absolute -right-24 -top-20 h-96 w-96 rounded-full bg-[#276864]/20 blur-[120px]" />
            <div className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 rounded-full bg-[#66fcf1]/10 blur-[100px]" />
            <AnimatedSection className="relative z-10 max-w-4xl">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#66fcf1]">
                {page.heroBadge}
              </p>
              <h1
                className="font-extrabold leading-[1.04] tracking-tight text-white"
                style={{ fontSize: `${page.heroTitleFontSize ?? 50}px` }}
              >
                {page.heroTitle}
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[#bacac7] sm:text-2xl">
                {page.heroDescription}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink href="/contacteaza-ne" className="h-14 px-8 text-base">
                  {page.heroCtaLabel}
                </ButtonLink>
                <ButtonLink
                  href={page.heroSecondaryCtaHref ?? "/portofoliu"}
                  variant="ghost"
                  className="h-14 border-[#3c4948]/60 px-8 text-base text-white hover:bg-[#1e2020]"
                >
                  {page.heroSecondaryCtaLabel ?? "Vezi showreel"}
                </ButtonLink>
              </div>
            </AnimatedSection>
          </Container>
        </section>
      ) : null}

      {visibility.problems ? (
        <section className="bg-[#0d0e0f] py-24 sm:py-32">
          <Container>
            <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
              <AnimatedSection>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  {page.sectionOneTitle}
                </h2>
                <div className="mt-10 space-y-7">
                  {problems.map((item) => (
                    <article key={`${item.title}-${item.description}`} className="flex items-start gap-5">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1e2020] text-[#66fcf1]">
                        <item.Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <p className="mt-2 text-[#bacac7]">{item.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="group relative">
                  <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#66fcf1]/20 to-transparent blur-2xl transition-opacity group-hover:opacity-100" />
                  <div className="relative overflow-hidden rounded-2xl border border-[#3c4948]/40 bg-[#121414]">
                    <div className="relative aspect-square">
                      <Image
                        src={heroImage}
                        alt="Cadru producție foto video"
                        fill
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </Container>
        </section>
      ) : null}

      {visibility.deliverables ? (
        <section className="py-24 sm:py-32">
          <Container>
            <AnimatedSection className="mb-14">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#66fcf1]">
                {page.heroBadge}
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                {page.sectionTwoTitle}
              </h2>
            </AnimatedSection>

            <div className="grid gap-6 md:grid-cols-3">
              <AnimatedSection className="group relative min-h-[440px] overflow-hidden rounded-2xl border border-[#2a383f] bg-[#1e2020] p-10 md:col-span-2">
                <Image
                  src={projects[0]?.image ?? heroImage}
                  alt={deliverableMain.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="relative z-10 mt-auto max-w-xl">
                  <h3 className="text-3xl font-bold text-white">{deliverableMain.title}</h3>
                  <p className="mt-4 text-lg text-[#bacac7]">{deliverableMain.description}</p>
                </div>
              </AnimatedSection>

              <AnimatedSection className="flex min-h-[440px] flex-col justify-between rounded-2xl bg-[#66fcf1] p-10 text-[#003734]">
                <Sparkles className="h-10 w-10" />
                <div>
                  <h3 className="text-2xl font-bold">{deliverableTech.title}</h3>
                  <p className="mt-4 text-sm font-medium text-[#014a46]">{deliverableTech.description}</p>
                </div>
              </AnimatedSection>

              {deliverableCards.map((card, index) => (
                <AnimatedSection
                  key={`${card.title}-${index}`}
                  className="group overflow-hidden rounded-2xl border border-[#2a383f] bg-[#1e2020]"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={projects[index % 2]?.image ?? heroImage}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-white">{card.title}</h3>
                    <p className="mt-2 text-sm text-[#bacac7]">{card.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {visibility.process ? (
        <section className="relative overflow-hidden bg-[#1a1c1c] py-24 sm:py-32">
          <Container className="relative z-10">
            <AnimatedSection className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {page.sectionThreeTitle}
              </h2>
            </AnimatedSection>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, index) => (
                <AnimatedSection key={`${step.title}-${index}`} className="relative">
                  <span className="pointer-events-none absolute -top-10 left-0 text-7xl font-black text-white/5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <article className="relative">
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#bacac7]">{step.description}</p>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {visibility.caseStudies ? (
        <section className="py-24 sm:py-32">
          <Container>
            <AnimatedSection className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#66fcf1]">
                  Portofoliu Selectat
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  {page.sectionFourTitle}
                </h2>
              </div>
              <Link
                href="/portofoliu"
                className="group inline-flex items-center gap-2 font-bold text-white transition-colors hover:text-[#66fcf1]"
              >
                {page.heroSecondaryCtaLabel ?? "Toate proiectele"}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </AnimatedSection>

            <div className="grid gap-8 md:grid-cols-2">
              {projects.map((project, index) => (
                <AnimatedSection key={project.slug}>
                  <article className="group space-y-5">
                    <div className="relative aspect-video overflow-hidden rounded-2xl">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#66fcf1] text-[#003734]">
                          <Play className="h-8 w-8 fill-current" />
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded bg-[#1e2020] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#66fcf1]">
                          {project.category}
                        </span>
                        {page.sectionFourItems[index + 1] ? (
                          <span className="rounded bg-[#1e2020] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#66fcf1]">
                            {page.sectionFourItems[index + 1]}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="text-2xl font-bold text-white transition-colors group-hover:text-[#66fcf1]">
                        {project.title}
                      </h3>
                    </div>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {visibility.finalCta ? (
        <section className="pb-24 sm:pb-32">
          <Container className="max-w-5xl">
            <AnimatedSection className="relative overflow-hidden rounded-2xl border border-[#3c4948]/30 bg-[linear-gradient(135deg,rgba(39,104,100,0.25)_0%,rgba(30,32,32,0.95)_60%,rgba(18,20,20,0.95)_100%)] px-7 py-12 text-center sm:px-12 sm:py-16">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#66fcf1] to-transparent" />
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">{page.finalCta.title}</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#bacac7]">
                {page.finalCta.description}
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <ButtonLink href={page.finalCta.primaryHref} className="h-14 px-10 text-lg">
                  {page.finalCta.primaryLabel}
                </ButtonLink>
                <a
                  href={phoneHref}
                  className="inline-flex items-center gap-2 font-bold text-white transition-colors hover:text-[#66fcf1]"
                >
                  <PhoneCall className="h-4 w-4" />
                  {content.global.footer.contactPhone}
                </a>
              </div>
            </AnimatedSection>
          </Container>
        </section>
      ) : null}
    </>
  );
}
