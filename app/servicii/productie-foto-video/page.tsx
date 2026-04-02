import Image from "next/image";
import { Check, ChevronRight, CirclePlay, Sparkle } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionShell } from "@/components/photo-video/section-shell";
import { MediaPreviewCard } from "@/components/photo-video/media-preview-card";
import { ProcessStepCard } from "@/components/photo-video/process-step-card";
import { ImpactCaseCard } from "@/components/photo-video/impact-case-card";

export const metadata = buildMetadata({
  title: "Producție Foto & Video",
  path: "/servicii/productie-foto-video",
  description:
    "Producție foto-video premium pentru branduri care vor impact în engagement, conversii și diferențiere vizuală.",
});

const painPoints = [
  {
    title: "Vizualuri generice",
    description:
      "Conținutul nu reflectă poziționarea brandului și nu creează memorabilitate.",
  },
  {
    title: "Lipsă de consistență",
    description:
      "Postările și reclamele arată diferit de la lună la lună, fără direcție clară.",
  },
  {
    title: "Impact redus în conversii",
    description:
      "Se consumă buget pe creative care nu transmit oferta și nu conduc la acțiune.",
  },
];

const processSteps = [
  {
    title: "Strategie",
    description:
      "Definim obiectivul fiecărui material: awareness, lead sau conversie.",
  },
  {
    title: "Pre-producție",
    description:
      "Construim conceptul vizual, scenariul, planul de cadre și calendarul.",
  },
  {
    title: "Filmare & Foto",
    description:
      "Executăm producția cu setup tehnic premium și direcție de brand unitară.",
  },
  {
    title: "Editare & Livrare",
    description:
      "Optimizăm pentru Reels, Ads și website, cu versiuni gata de publicare.",
  },
];

export default function ProductieFotoVideoPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-20 pt-20 sm:pb-24 sm:pt-24">
        <Container className="relative">
          <div className="pointer-events-none absolute -right-12 -top-12 hidden h-72 w-72 rounded-full bg-[#66fcf1]/12 blur-3xl lg:block" />
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <AnimatedSection>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#66fcf1]">
                Producție Foto & Video
              </p>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
                Capturăm esența <span className="text-[#66fcf1]">brandului tău.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#c6c6c6] sm:text-lg">
                Producem conținut foto-video premium care spune povestea corectă,
                susține campaniile de performanță și transformă atenția în cereri
                concrete.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ButtonLink href="/contacteaza-ne">Programează o discuție</ButtonLink>
                <ButtonLink href="/portofoliu" variant="ghost" size="sm">
                  Pregătește brief-ul
                </ButtonLink>
              </div>
            </AnimatedSection>

            <AnimatedSection className="relative h-full">
              <div className="relative mx-auto max-w-[450px] rounded-[2rem] border border-[#264048] bg-[linear-gradient(160deg,#111a1f_0%,#112c33_100%)] p-6 shadow-[0_35px_90px_-45px_rgba(102,252,241,0.5)] sm:p-8">
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-[#2c434c] bg-[#0f161b]">
                  <Image
                    src="/images/photo-video/camera-rig.svg"
                    alt="Rig de filmare premium"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_430px]">
            <AnimatedSection>
              <h2 className="max-w-lg text-3xl font-semibold leading-tight text-white sm:text-4xl">
                De ce conținutul tău actual nu mai funcționează?
              </h2>
              <ul className="mt-7 space-y-4">
                {painPoints.map((item, index) => (
                  <li
                    key={item.title}
                    className="rounded-2xl border border-[#263740] bg-[#10171b] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#2f454d] bg-[#102126] text-[#66fcf1]">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {index + 1}. {item.title}
                        </p>
                        <p className="mt-1 text-sm text-[#adb5bb]">{item.description}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection>
              <div className="relative overflow-hidden rounded-[1.5rem] border border-[#2a3b43] bg-[#0f161b] p-3 shadow-[0_28px_60px_-40px_rgba(102,252,241,0.45)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem]">
                  <Image
                    src="/images/photo-video/camera-rig.svg"
                    alt="Echipament de producție video"
                    fill
                    sizes="(max-width: 1024px) 100vw, 430px"
                    className="object-cover"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="border-y border-[#182228] bg-[#0e1317] py-20 sm:py-24">
        <Container>
          <SectionShell
            eyebrow="Showreel"
            title="Ecosistemul tău vizual."
            description="Construim un pachet complet de materiale: de la cadre de brand la creative orientate pe conversie."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MediaPreviewCard
              title="Spoturi Publicitare & Brand Videos"
              subtitle="video principal pentru awareness și autoritate"
              image="/images/photo-video/sport-video.svg"
              className="md:col-span-2"
            />

            <AnimatedSection className="overflow-hidden rounded-[1.25rem] border border-[#4cd6ce]/50 bg-[linear-gradient(160deg,#66fcf1_0%,#44cfc8_58%,#31a09a_100%)] p-6 text-[#0b0c10]">
              <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em]">
                <Sparkle className="h-3.5 w-3.5" /> Livrabile
              </p>
              <p className="mt-6 text-4xl font-semibold">6-14</p>
              <p className="mt-2 text-sm font-semibold">materiale / sesiune</p>
              <p className="mt-4 text-xs leading-relaxed text-[#133332]">
                Pachet adaptat pentru Reels, Ads, site și newsletter, cu cadre
                reutilizabile pentru mai multe campanii.
              </p>
            </AnimatedSection>

            <MediaPreviewCard
              title="Framing de Produs"
              subtitle="cadre dedicate landing page & ads"
              image="/images/photo-video/product-frame.svg"
            />
            <MediaPreviewCard
              title="Reels & Video Ads"
              subtitle="format scurt optimizat pentru social"
              image="/images/photo-video/reels-pack.svg"
            />
            <MediaPreviewCard
              title="Atmosphere Shots"
              subtitle="diferențiere vizuală premium"
              image="/images/photo-video/atmosphere-still.svg"
            />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionShell
            title="Drumul spre capodoperă"
            description="Procesul nostru este clar și predictibil: știi ce urmează, ce primești și când livrăm."
            className="justify-center text-center"
          />

          <div className="relative mt-10">
            <div className="absolute left-[12.5%] right-[12.5%] top-9 hidden border-t border-dashed border-[#2f434c] lg:block" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, index) => (
                <ProcessStepCard
                  key={step.title}
                  index={index}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container>
          <SectionShell
            title="Impact vizual dovedit."
            action={
              <ButtonLink href="/portofoliu" variant="ghost" size="sm">
                Vezi portofoliu
                <ChevronRight className="ml-1 h-4 w-4" />
              </ButtonLink>
            }
          />

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <ImpactCaseCard
              title="Video Manifest"
              image="/images/photo-video/impact-founder.svg"
            />
            <ImpactCaseCard
              title="Master Urban Minimalist Series"
              image="/images/photo-video/impact-fashion.svg"
            />
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container>
          <AnimatedSection className="mx-auto max-w-3xl rounded-[1.7rem] border border-[#284049] bg-[linear-gradient(150deg,#10181d_0%,#12333a_100%)] px-6 py-9 text-center sm:px-10">
            <h2 className="text-3xl font-semibold text-white">Ești gata să fii văzut?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#c4cbcf] sm:text-base">
              Hai să creăm conținutul care îți poziționează brandul premium,
              susține campaniile și îți aduce leaduri mai bune.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/contacteaza-ne">Programează o discuție</ButtonLink>
              <a
                href="tel:+40742000000"
                className="inline-flex items-center gap-2 rounded-full border border-[#2e444d] px-4 py-2 text-sm font-semibold text-[#c6cdd1] transition-colors hover:text-white"
              >
                <CirclePlay className="h-4 w-4 text-[#66fcf1]" />
                Sau sună direct
              </a>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
