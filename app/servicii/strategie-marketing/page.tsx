import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { getSiteContent } from "@/lib/site-content";
import { absoluteUrl, buildRouteMetadata, getCanonicalBaseUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema, buildWebPageSchema } from "@/lib/structured-data";

const path = "/servicii/strategie-marketing";

const problems = [
  "reclame pornite fără poziționare clară",
  "conținut publicat doar pentru activitate",
  "website care nu susține campaniile",
  "bugete împărțite fără priorități",
  "lipsă de diferențiere față de competiție",
  "lipsă de măsurare și interpretare corectă",
  "canale care funcționează izolat",
];

const strategyElements = [
  "poziționare clară",
  "public țintă definit",
  "avatar de client",
  "analiză competițională",
  "structură de mesaje",
  "prioritizare canale",
  "calendar de acțiune",
  "logică de măsurare",
  "legătură între conținut, ads, website și SEO",
];

const audiences = [
  {
    title: "Companii care investesc deja în marketing",
    description: "Ai bugete în Social Media, Google Ads sau Meta Ads, dar nu este clar ce rol are fiecare canal.",
  },
  {
    title: "Branduri care vor poziționare mai clară",
    description: "Ai produse sau servicii bune, dar mesajul nu diferențiază suficient compania de competiție.",
  },
  {
    title: "Business-uri care vor scalare",
    description: "Vrei să crești, dar ai nevoie de priorități, structură și o strategie de execuție realistă.",
  },
  {
    title: "Companii care lansează servicii sau produse noi",
    description: "Ai nevoie de o strategie înainte să investești în campanii, conținut și media buying.",
  },
  {
    title: "Echipe care au nevoie de claritate",
    description: "Marketingul intern, vânzările și managementul au nevoie de aceeași direcție.",
  },
];

const deliverables = [
  "audit de marketing existent",
  "analiză website și funnel",
  "analiză Social Media",
  "analiză campanii plătite, dacă există",
  "analiză competițională",
  "definire public țintă",
  "definire avatar de client",
  "poziționare de brand",
  "mesaj principal și mesaje secundare",
  "recomandări de canale",
  "prioritizare bugete",
  "direcție de conținut",
  "direcție pentru Google Ads",
  "direcție pentru Meta Ads",
  "direcție pentru SEO",
  "recomandări pentru website",
  "plan de acțiune pe termen scurt și mediu",
];

const processSteps = [
  {
    title: "Discuție inițială",
    description: "Începem cu o discuție despre business, obiective, blocaje, servicii, clienți și istoricul de marketing.",
  },
  {
    title: "Research",
    description: "Analizăm piața, competiția, publicul, canalele actuale, website-ul și comunicarea existentă.",
  },
  {
    title: "Diagnostic",
    description: "Identificăm ce funcționează, ce nu funcționează și unde se pierde eficiența.",
  },
  {
    title: "Poziționare",
    description: "Clarificăm diferențiatorii, mesajele și direcția de comunicare.",
  },
  {
    title: "Plan strategic",
    description: "Construim o direcție aplicabilă pentru conținut, campanii, website, SEO și canale plătite.",
  },
  {
    title: "Prioritizare",
    description: "Stabilim ce trebuie făcut prima dată, ce poate aștepta și ce nu merită buget în etapa actuală.",
  },
  {
    title: "Execuție sau transfer",
    description: "Strategia poate fi implementată de Digital Dot sau poate fi folosită ca direcție pentru echipa internă.",
  },
];

const connectedServices = [
  {
    title: "Social Media Management",
    href: "/servicii/social-media-management",
    description: "Pentru conținut coerent, calendar editorial și comunicare constantă.",
  },
  {
    title: "Producție Foto/Video",
    href: "/servicii/productie-foto-video",
    description: "Pentru materiale vizuale care susțin mesajul, nu doar arată bine.",
  },
  {
    title: "Google Ads",
    href: "/servicii/google-ads",
    description: "Pentru captarea cererii active și campanii orientate spre intenție.",
  },
  {
    title: "Meta Ads",
    href: "/servicii/meta-ads",
    description: "Pentru awareness, trafic, retargeting și campanii orientate spre publicuri relevante.",
  },
  {
    title: "Website Creation",
    href: "/servicii/website-creation",
    description: "Pentru un website capabil să susțină campaniile și conversiile.",
  },
  {
    title: "SEO",
    href: "/servicii/seo",
    description: "Pentru vizibilitate organică și structură pe termen lung.",
  },
];

const caseStudies = [
  {
    title: "Optik Tataru",
    href: "/case-studies/optik-tataru",
    description: "Social Media, Meta Ads și Google Ads pentru un brand de optică medicală.",
  },
  {
    title: "Lunna",
    href: "/case-studies/lunna",
    description: "Social Media, Reels și TikTok pentru un coffee & brunch spot.",
  },
  {
    title: "Taco Loco",
    href: "/case-studies/taco-loco",
    description: "Social Media, Meta Ads și website traffic pentru restaurant marketing.",
  },
  {
    title: "Cosmetică Hotelieră",
    href: "/case-studies/cosmeticahoteliera",
    description: "Google Ads, Meta Ads și ecommerce B2B pentru HoReCa.",
  },
  {
    title: "Lumea Perdelelor",
    href: "/case-studies/lumea-perdelelor",
    description: "Social Media și conținut video pentru un brand în expansiune.",
  },
  {
    title: "ARTIO Medica",
    href: "/case-studies/artio-medica",
    description: "Comunicare social media pentru clinică medicală.",
  },
];

const faqGroup = {
  id: "strategie-marketing-faq",
  title: "Întrebări frecvente despre strategia de marketing",
  assignedPaths: [path],
  items: [
    {
      id: "ce-este-strategia-de-marketing",
      question: "Ce este o strategie de marketing?",
      answer:
        "O strategie de marketing este direcția care stabilește cum comunică, promovează și vinde o companie. Ea definește publicul țintă, poziționarea, mesajele, canalele, prioritățile și modul în care sunt măsurate rezultatele.",
    },
    {
      id: "strategie-inainte-de-reclame",
      question: "De ce are nevoie o companie de strategie înainte de reclame?",
      answer:
        "Fără strategie, reclamele sunt doar bugete distribuite pe platforme. Strategia stabilește ce mesaj trebuie comunicat, cui, prin ce canal și cu ce obiectiv, astfel încât campaniile să nu funcționeze izolat.",
    },
    {
      id: "include-google-ads-meta-ads",
      question: "Strategia de marketing include și Google Ads sau Meta Ads?",
      answer:
        "Strategia poate include direcții pentru Google Ads, Meta Ads, Social Media, SEO, website și conținut. Scopul este să stabilească rolul fiecărui canal în sistemul de marketing.",
    },
    {
      id: "durata-strategie-marketing",
      question: "Cât durează realizarea unei strategii de marketing?",
      answer:
        "Durata depinde de complexitatea businessului, numărul de servicii, nivelul de research și canalele analizate. În general, strategia trebuie construită suficient de atent încât să poată fi aplicată concret, nu doar prezentată teoretic.",
    },
    {
      id: "implementare-digital-dot",
      question: "Digital Dot poate implementa strategia după finalizare?",
      answer:
        "Da. Strategia poate fi implementată de Digital Dot prin servicii precum Social Media Management, Producție Foto/Video, Google Ads, Meta Ads, Website Creation și SEO.",
    },
    {
      id: "strategie-firme-locale",
      question: "Strategia de marketing este potrivită și pentru firme locale?",
      answer:
        "Da. O strategie de marketing este utilă și pentru firme locale, mai ales atunci când acestea vor să atragă clienți mai clar, să comunice diferențiat și să folosească mai eficient bugetele de promovare.",
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return buildRouteMetadata({
    content,
    path,
    fallbackTitle: "Strategie de Marketing | Digital Dot",
    fallbackDescription:
      "Construim strategii de marketing clare pentru companii care au nevoie de poziționare, direcție, structură și campanii conectate. Strategie, conținut, ads și website într-un sistem coerent.",
  });
}

export default async function StrategyMarketingPage() {
  const content = await getSiteContent();
  const canonical = absoluteUrl(path, content);
  const baseUrl = getCanonicalBaseUrl(content);
  const breadcrumbs = [
    { name: "Acasă", path: "/" },
    { name: "Servicii", path: "/#services" },
    { name: "Strategie de Marketing", path },
  ];
  const schemas = [
    buildOrganizationSchema(content),
    buildWebPageSchema(content, path),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: "Strategie de Marketing",
      description:
        "Strategie de marketing pentru companii care au nevoie de poziționare, direcție, structură și campanii conectate prin Social Media, Google Ads, Meta Ads, SEO și website.",
      url: canonical,
      serviceType: "Marketing Strategy / Digital Marketing Strategy",
      areaServed: "România",
      provider: {
        "@id": `${baseUrl}/#organization`,
        name: "Digital Dot",
      },
      mainEntityOfPage: canonical,
    },
    buildBreadcrumbSchema(content, breadcrumbs),
    buildFaqSchema(faqGroup),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <Breadcrumbs
        items={[
          { label: "Acasă", href: "/" },
          { label: "Servicii", href: "/#services" },
          { label: "Strategie de Marketing", href: path },
        ]}
      />
      <main>
        <article>
          <header className="py-18 sm:py-24">
            <Container>
              <div className="brand-panel p-8 sm:p-10">
                <span className="brand-rule mb-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
                  Serviciu principal Digital Dot
                </p>
                <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Strategie de Marketing pentru companii care au nevoie de direcție, nu doar de campanii
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
                  Marketingul nu începe cu reclame, postări sau bugete distribuite la întâmplare. Începe cu o direcție clară: cine ești, cui te adresezi, de ce ar trebui să fii ales și cum conectezi canalele potrivite într-un sistem coerent.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink href="/#contact">Hai să povestim</ButtonLink>
                  <ButtonLink href="/case-studies" variant="ghost">Vezi studiile de caz</ButtonLink>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[#aeb6bb]">
                  Fără promisiuni spectaculoase. Doar claritate, structură și execuție măsurabilă.
                </p>
              </div>
            </Container>
          </header>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/62 py-18 sm:py-24" aria-labelledby="problem-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="problem-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  De ce multe campanii nu funcționează
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Majoritatea companiilor nu au o problemă de postări, reclame sau platforme. Au o problemă de direcție. Se investește în Social Media, Google Ads, Meta Ads, website-uri și conținut, dar fără o strategie care să lege toate aceste elemente între ele.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Când marketingul nu are structură, apar simptome clare: bugete risipite, mesaje inconsistente, conținut fără scop, campanii care nu comunică între ele și decizii luate reactiv.
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {problems.map((item) => (
                    <li key={item} className="rounded-2xl border border-[#1f2a2d] bg-[#0b0c10]/72 px-4 py-3 text-sm text-[#dadada]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-base leading-relaxed text-[#d8c7a3]">
                  Strategia de marketing corectează exact această dezordine. Nu adaugă zgomot. Pune ordine în sistem.
                </p>
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="strategy-meaning-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="strategy-meaning-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  Strategia este sistemul care leagă toate deciziile de marketing
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Pentru Digital Dot, strategia de marketing nu este un document frumos care rămâne uitat într-un folder. Este arhitectura după care sunt luate deciziile: ce comunicăm, cui comunicăm, prin ce canale, cu ce bugete, în ce ordine și cu ce obiective.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  O strategie bună stabilește direcția înaintea execuției. Fără această etapă, campaniile pot arăta bine, dar funcționează fragmentat. Cu strategie, fiecare element are un rol: Social Media construiește prezență, Google Ads captează cerere, Meta Ads generează atenție și trafic, website-ul transformă interesul în acțiune, iar SEO consolidează vizibilitatea pe termen lung.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {strategyElements.map((item) => (
                    <div key={item} className="rounded-2xl border border-[#276864]/25 bg-[#101418] px-4 py-3 text-sm text-[#dadada]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </section>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="audience-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="audience-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                Pentru cine este potrivită o strategie de marketing
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Serviciul este potrivit pentru companii care au depășit etapa improvizației și au nevoie de un sistem mai clar de promovare. Este util mai ales atunci când există deja buget de marketing, dar rezultatele sunt greu de interpretat sau canalele nu lucrează împreună.
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {audiences.map((item) => (
                  <article key={item.title} className="brand-card p-6">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{item.description}</p>
                  </article>
                ))}
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="deliverables-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="deliverables-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  Ce include strategia de marketing
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[#c6c6c6]">
                  Strategia de marketing Digital Dot este construită ca un sistem aplicabil, nu ca o prezentare decorativă. Scopul este să ai o direcție clară pentru deciziile de promovare și pentru execuția ulterioară.
                </p>
              </div>
              <div className="lg:col-span-8">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {deliverables.map((item) => (
                    <li key={item} className="rounded-2xl border border-[#1f2a2d] bg-[#101418] px-4 py-3 text-sm text-[#dadada]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base leading-relaxed text-[#d8c7a3]">
                  Rezultatul trebuie să fie simplu: să știi ce ai de făcut, de ce faci acel lucru și cum măsori dacă funcționează.
                </p>
              </div>
            </Container>
          </section>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="process-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="process-title" className="text-3xl font-semibold text-white sm:text-4xl">
                Cum construim strategia
              </h2>
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {processSteps.map((item, index) => (
                  <article key={item.title} className="rounded-3xl border border-[#1f2a2d] bg-[#0b0c10]/70 p-6">
                    <p className="text-sm font-semibold text-[#d8c7a3]">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{item.description}</p>
                  </article>
                ))}
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="connected-services-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="connected-services-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                Strategia conectează toate serviciile de marketing
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                O strategie eficientă nu stă izolată. Ea stabilește cum trebuie să lucreze împreună celelalte canale.
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {connectedServices.map((item) => (
                  <Link key={item.href} href={item.href} className="brand-card block p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c7a3]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c10]">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{item.description}</p>
                  </Link>
                ))}
              </div>
            </Container>
          </section>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="case-studies-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="case-studies-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                Strategia se vede cel mai clar în rezultate
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Studiile de caz Digital Dot arată cum strategia, conținutul, campaniile plătite și website-ul pot lucra împreună. Nu fiecare proiect folosește aceleași canale, dar fiecare are nevoie de o direcție clară.
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {caseStudies.map((item) => (
                  <Link key={item.href} href={item.href} className="brand-card block p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c7a3]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c10]">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{item.description}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-8">
                <ButtonLink href="/case-studies" variant="ghost">Vezi toate studiile de caz</ButtonLink>
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="strategy-faq-title">
            <Container>
              <div className="mx-auto max-w-4xl">
                <span className="brand-rule mb-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
                  FAQ
                </p>
                <h2 id="strategy-faq-title" className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Întrebări frecvente despre strategia de marketing
                </h2>
                <div className="mt-8 divide-y divide-[#1f2a2d] overflow-hidden rounded-[1.35rem] border border-[#1f2a2d] bg-[#101418]">
                  {faqGroup.items.map((item) => (
                    <details key={item.id} className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-white transition-colors hover:text-[#d8c7a3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#276864] [&::-webkit-details-marker]:hidden">
                        <span>{item.question}</span>
                        <span aria-hidden className="text-[#d8c7a3] transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="px-5 pb-5 text-sm leading-relaxed text-[#c6c6c6]">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </Container>
          </section>

          <footer className="pb-18 sm:pb-24" aria-labelledby="strategy-cta-title">
            <Container>
              <div className="brand-panel p-8 sm:p-10">
                <span className="brand-rule mb-5" />
                <h2 id="strategy-cta-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                  Ai nevoie de o strategie înainte de încă o campanie
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                  Dacă marketingul tău pare activ, dar nu suficient de clar, probabil nu ai nevoie de mai mult zgomot. Ai nevoie de direcție, priorități și un sistem care leagă deciziile între ele.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink href="/#contact">Hai să povestim</ButtonLink>
                  <ButtonLink href="/case-studies" variant="ghost">Vezi studiile de caz</ButtonLink>
                </div>
              </div>
            </Container>
          </footer>
        </article>
      </main>
    </>
  );
}
