import Image from "next/image";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import type { SiteContent } from "@/lib/site-content-schema";

type CaseStudy = SiteContent["caseStudies"]["studies"][number];

type CaseStudyDetailProps = {
  study: CaseStudy;
};

export function CaseStudyDetail({ study }: CaseStudyDetailProps) {
  return (
    <article>
      <header className="relative overflow-hidden pb-16 pt-10 sm:pb-20 sm:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(102,252,241,0.13),transparent_38%),radial-gradient(circle_at_84%_10%,rgba(39,104,100,0.22),transparent_40%)]" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="inline-flex rounded-full border border-[#66fcf1]/35 bg-[#66fcf1]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#66fcf1]">
              Studiu de caz
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {study.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#c6c6c6]">
              {study.heroIntro}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href={study.clientWebsite} target="_blank" rel="noopener noreferrer">
                Vizitează website-ul clientului
                <ExternalLink className="ml-2 h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/#contact" variant="ghost">
                Discută cu Digital Dot
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-[2rem] border border-[#276864]/45 bg-[#c6c6c6] p-10 shadow-[0_35px_90px_-55px_rgba(102,252,241,0.75)]">
              <Image
                src={study.heroImage}
                alt={`${study.clientName} logo`}
                width={520}
                height={280}
                priority
                className="relative max-h-40 w-auto max-w-full object-contain"
                style={{
                  ...(study.imageScale ? { transform: `scale(${study.imageScale})` } : {}),
                }}
              />
            </div>
          </div>
        </Container>
      </header>

      <section className="border-y border-[#1a252d] bg-[#0d1217] py-14 sm:py-18" aria-labelledby="metrics-title">
        <Container>
          <h2 id="metrics-title" className="sr-only">Metrics overview</h2>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {study.metrics.map((metric) => (
              <div key={`${metric.value}-${metric.label}`} className="rounded-3xl border border-[#276864]/42 bg-[#10181d] p-6">
                <dt className="text-3xl font-semibold text-[#66fcf1]">{metric.value}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#c6c6c6]">{metric.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-18 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{study.context.title}</h2>
          <p className="text-base leading-8 text-[#c6c6c6]">{study.context.text}</p>
        </Container>
      </section>

      <section className="border-y border-[#1a252d] bg-[#0d1217] py-18 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{study.challenge.title}</h2>
            <p className="mt-5 text-base leading-8 text-[#c6c6c6]">{study.challenge.text}</p>
          </div>
          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {study.challenge.items.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-[#263740] bg-[#10161a] p-4 text-sm text-[#d7e3e2]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#66fcf1]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-18 sm:py-24">
        <Container>
          <div className="max-w-4xl">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{study.intervention.title}</h2>
            <p className="mt-5 text-base leading-8 text-[#c6c6c6]">{study.intervention.text}</p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {study.intervention.items.map((item, index) => (
              <section key={item.title} className="rounded-3xl border border-[#263740] bg-[#10161a] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{item.text}</p>
              </section>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-[#1a252d] bg-[#0d1217] py-18 sm:py-24">
        <Container>
          <div className="max-w-4xl">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{study.results.title}</h2>
            <p className="mt-5 text-base leading-8 text-[#c6c6c6]">{study.results.intro}</p>
          </div>
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {study.results.items.map((item) => (
              <li key={item} className="rounded-2xl border border-[#263740] bg-[#10161a] p-4 text-sm leading-relaxed text-[#d7e3e2]">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {study.highlightCampaign ? (
        <section className="py-18 sm:py-24">
          <Container>
            <div className="rounded-[2rem] border border-[#66fcf1]/30 bg-[linear-gradient(145deg,rgba(16,24,28,0.95),rgba(11,12,16,0.98))] p-8 shadow-[0_35px_80px_-58px_rgba(102,252,241,0.5)] sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66fcf1]">
                Highlight campanie
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{study.highlightCampaign.title}</h2>
              <p className="mt-5 max-w-4xl text-base leading-8 text-[#c6c6c6]">{study.highlightCampaign.text}</p>
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-18 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{study.conclusion.title}</h2>
          <p className="text-base leading-8 text-[#c6c6c6]">{study.conclusion.text}</p>
        </Container>
      </section>

      <footer className="py-18 sm:py-24">
        <Container>
          <div className="rounded-[2rem] border border-[#66fcf1]/30 bg-[linear-gradient(145deg,rgba(16,24,28,0.95),rgba(11,12,16,0.98))] p-8 text-center shadow-[0_35px_80px_-55px_rgba(102,252,241,0.55)] sm:p-12">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{study.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#c6c6c6]">{study.cta.subtitle}</p>
            <ButtonLink href={study.cta.buttonLink} className="mt-8">
              {study.cta.buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </footer>
    </article>
  );
}
