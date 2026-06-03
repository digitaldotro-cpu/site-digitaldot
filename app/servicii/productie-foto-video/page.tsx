import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getSiteContent } from "@/lib/site-content";
import { absoluteUrl, buildRouteMetadata, getCanonicalBaseUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema, buildWebPageSchema } from "@/lib/structured-data";

const path = "/servicii/productie-foto-video";

const problems = [
  "materiale foto-video fără strategie",
  "filmări care nu sunt adaptate platformelor",
  "fotografii frumoase, dar greu de folosit comercial",
  "lipsă de conținut vertical pentru Reels și TikTok",
  "lipsă de materiale pentru ads",
  "lipsă de coerență vizuală între postări",
  "conținut care nu susține website-ul sau campaniile",
  "producții făcute fără un plan de distribuție",
];

const systemElements = [
  "direcție vizuală",
  "concept foto-video",
  "planificare cadre",
  "filmări verticale pentru Reels și TikTok",
  "fotografii de brand",
  "fotografii de produs",
  "fotografii de locație",
  "video-uri scurte pentru Social Media",
  "materiale pentru ads",
  "materiale pentru website",
  "editare video",
  "selecție și optimizare conținut",
  "adaptare pentru platforme",
];

const audiences = [
  {
    title: "Restaurante, cafenele și branduri HoReCa",
    description: "Pentru businessuri în care apetitul, atmosfera, produsele și experiența locului trebuie comunicate vizual.",
  },
  {
    title: "Clinici și servicii medicale",
    description: "Pentru branduri care au nevoie de conținut clar, responsabil și orientat spre încredere.",
  },
  {
    title: "Branduri de retail și ecommerce",
    description: "Pentru produse care trebuie prezentate clar, coerent și convingător în Social Media, website și campanii.",
  },
  {
    title: "Branduri în expansiune",
    description: "Pentru companii care au mai multe locații, evenimente, lansări sau campanii de comunicat.",
  },
  {
    title: "Servicii profesionale și B2B",
    description: "Pentru companii care au nevoie să își prezinte echipa, procesele, expertiza și diferențiatorii.",
  },
];

const deliverables = [
  "concept foto-video",
  "planificare sesiune foto-video",
  "shot list",
  "filmare verticală pentru Reels",
  "filmare verticală pentru TikTok",
  "filmare pentru campanii Social Media",
  "fotografii de produs",
  "fotografii de locație",
  "fotografii de echipă",
  "fotografii de atmosferă",
  "video-uri scurte pentru Social Media",
  "materiale pentru Meta Ads",
  "materiale pentru website",
  "editare video",
  "montaj",
  "subtitrări, dacă este cazul",
  "adaptare format 9:16, 1:1, 4:5 sau 16:9",
  "selecție finală materiale",
  "livrare organizată pentru utilizare în campanii și calendar editorial",
];

const processSteps = [
  {
    title: "Stabilim obiectivul",
    description:
      "Începem cu întrebarea esențială: la ce va fi folosit conținutul? Social Media, ads, website, campanie, lansare, eveniment sau prezentare de brand.",
  },
  {
    title: "Definim direcția",
    description: "Stabilim mesajul, tonul vizual, tipurile de cadre și platformele pentru care producem materialele.",
  },
  {
    title: "Planificăm producția",
    description: "Construim un plan clar: locație, produse, oameni, cadre, durată, formate și livrabile.",
  },
  {
    title: "Filmăm și fotografiem",
    description:
      "Realizăm materialele conform direcției stabilite, cu atenție la compoziție, lumină, ritm și utilizarea ulterioară.",
  },
  {
    title: "Edităm și adaptăm",
    description: "Selectăm, edităm și adaptăm materialele pentru formatele necesare: Reels, TikTok, postări, ads sau website.",
  },
  {
    title: "Livrăm organizat",
    description: "Materialele sunt livrate într-o structură clară, pentru a putea fi folosite rapid în calendarul editorial și campanii.",
  },
  {
    title: "Optimizăm în timp",
    description: "Analizăm ce tipuri de conținut performează și ajustăm direcția pentru producțiile viitoare.",
  },
];

const contentTypes = [
  {
    title: "Reels",
    description: "Video-uri scurte, verticale, adaptate pentru Instagram, cu ritm clar și mesaj rapid.",
  },
  {
    title: "TikTok",
    description: "Conținut vertical, nativ platformei, construit pentru atenție, ritm și distribuire.",
  },
  {
    title: "Fotografii de produs",
    description: "Materiale clare pentru prezentarea produselor în Social Media, website și campanii.",
  },
  {
    title: "Fotografii de locație",
    description: "Imagini care transmit atmosfera spațiului și experiența brandului.",
  },
  {
    title: "Video pentru Meta Ads",
    description: "Materiale scurte, orientate spre atenție, mesaj și acțiune.",
  },
  {
    title: "Video de prezentare",
    description: "Clipuri mai structurate pentru website, landing pages sau prezentări comerciale.",
  },
  {
    title: "Conținut pentru Google Business Profile",
    description: "Fotografii și materiale vizuale care susțin prezența locală a brandului.",
  },
  {
    title: "Materiale pentru campanii sezoniere",
    description: "Conținut adaptat pentru lansări, evenimente, promoții sau perioade-cheie din an.",
  },
];

const connectedServices = [
  {
    title: "Strategie de Marketing",
    href: "/servicii/strategie-marketing",
    description: "Pentru direcția care stabilește ce comunicăm și de ce.",
  },
  {
    title: "Social Media Management",
    href: "/servicii/social-media-management",
    description: "Pentru folosirea materialelor în calendar editorial, Reels, TikTok și comunicare constantă.",
  },
  {
    title: "Meta Ads",
    href: "/servicii/meta-ads",
    description: "Pentru campanii plătite care folosesc conținut vizual adaptat platformei.",
  },
  {
    title: "Google Ads",
    href: "/servicii/google-ads",
    description: "Pentru campanii care pot folosi materiale vizuale în Performance Max, YouTube sau landing pages.",
  },
  {
    title: "Website Creation",
    href: "/servicii/website-creation",
    description: "Pentru integrarea conținutului vizual în pagini care susțin conversia.",
  },
  {
    title: "SEO",
    href: "/servicii/seo",
    description: "Pentru structurarea conținutului video și vizual în pagini indexabile și relevante.",
  },
];

const caseStudies = [
  {
    title: "Lunna",
    href: "/case-studies/lunna",
    description: "Conținut vizual, Reels și TikTok pentru un coffee & brunch spot construit în jurul atmosferei.",
  },
  {
    title: "Taco Loco",
    href: "/case-studies/taco-loco",
    description: "Conținut culinar, Social Media și Meta Ads pentru un brand de restaurant.",
  },
  {
    title: "Lumea Perdelelor",
    href: "/case-studies/lumea-perdelelor",
    description: "Conținut vizual pentru lucrări reale, locații multiple și brand expansion.",
  },
  {
    title: "ARTIO Medica",
    href: "/case-studies/artio-medica",
    description: "Conținut medical clar, responsabil și orientat spre încredere.",
  },
  {
    title: "Optik Tataru",
    href: "/case-studies/optik-tataru",
    description: "Conținut social media și campanii pentru un brand de optică medicală.",
  },
];

const faqGroup = {
  id: "productie-foto-video-faq",
  title: "Întrebări frecvente despre producția foto-video",
  assignedPaths: [path],
  items: [
    {
      id: "ce-include-productia-foto-video-social-media",
      question: "Ce include producția foto-video pentru Social Media?",
      answer:
        "Producția foto-video pentru Social Media poate include filmări verticale pentru Reels și TikTok, fotografii de produs, imagini de locație, materiale pentru campanii, video-uri scurte și conținut adaptat platformelor digitale.",
    },
    {
      id: "de-ce-este-important-continutul-video",
      question: "De ce este important conținutul video pentru Social Media?",
      answer:
        "Conținutul video ajută brandurile să transmită mai rapid atmosferă, mesaj, produs și diferențiere. Platforme precum Instagram, TikTok și Facebook favorizează materialele video scurte, mai ales atunci când acestea sunt adaptate publicului și formatului platformei.",
    },
    {
      id: "produceti-reels-tiktok",
      question: "Produceți conținut pentru Reels și TikTok?",
      answer:
        "Da. Digital Dot poate produce conținut vertical pentru Reels și TikTok, de la idee și direcție până la filmare, editare și adaptare pentru publicare.",
    },
    {
      id: "productie-foto-video-meta-ads",
      question: "Producția foto-video poate fi folosită și în campanii Meta Ads?",
      answer:
        "Da. Materialele foto-video pot fi adaptate pentru Meta Ads, inclusiv pentru campanii de awareness, trafic, engagement, retargeting sau conversii urmărite.",
    },
    {
      id: "strategie-inainte-filmare",
      question: "Aveți nevoie de strategie înainte de filmare?",
      answer:
        "Da, în majoritatea cazurilor. O direcție clară ajută la stabilirea mesajului, formatelor, cadrelor și modului în care materialele vor fi folosite în Social Media, website sau campanii.",
    },
    {
      id: "tipuri-business-productie-foto-video",
      question: "Pentru ce tipuri de business este potrivită producția foto-video?",
      answer:
        "Producția foto-video este potrivită pentru HoReCa, clinici medicale, retail, ecommerce, servicii profesionale, branduri locale și companii care au nevoie de conținut vizual constant și coerent.",
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return buildRouteMetadata({
    content,
    path,
    fallbackTitle: "Producție Foto/Video | Digital Dot",
    fallbackDescription:
      "Servicii de producție foto-video pentru branduri care au nevoie de conținut vizual strategic: Reels, TikTok, fotografii de brand, video pentru Social Media, campanii și website.",
    image: "/images/photo-video/camera-rig.svg",
  });
}

export default async function ProductieFotoVideoServicePage() {
  const content = await getSiteContent();
  const canonical = absoluteUrl(path, content);
  const baseUrl = getCanonicalBaseUrl(content);
  const breadcrumbs = [
    { name: "Acasă", path: "/" },
    { name: "Servicii", path: "/#services" },
    { name: "Producție Foto/Video", path },
  ];
  const schemas = [
    buildOrganizationSchema(content),
    buildWebPageSchema(content, path),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: "Producție Foto/Video",
      description:
        "Servicii de producție foto-video pentru branduri care au nevoie de conținut vizual strategic: Reels, TikTok, fotografii de produs, video pentru Social Media, materiale pentru Meta Ads, website și campanii digitale.",
      url: canonical,
      serviceType: "Photo and Video Production / Video Marketing / Digital Content Production",
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
          { label: "Producție Foto/Video", href: path },
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
                  Producție Foto/Video pentru branduri care au nevoie de conținut cu rol, nu doar de imagini frumoase
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
                  Conținutul vizual trebuie să facă mai mult decât să arate bine. Trebuie să susțină mesajul, poziționarea, campaniile și prezența digitală a brandului.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink href="/#contact">Hai să povestim</ButtonLink>
                  <ButtonLink href="/case-studies" variant="ghost">Vezi studiile de caz</ButtonLink>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[#aeb6bb]">
                  Filmăm, fotografiem și structurăm conținutul astfel încât să poată fi folosit în Social Media, campanii plătite, website și comunicare de brand.
                </p>
              </div>
            </Container>
          </header>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/62 py-18 sm:py-24" aria-labelledby="problem-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="problem-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  De ce conținutul vizual nu funcționează când este făcut fără direcție
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Multe branduri investesc în fotografii și video-uri, dar materialele ajung să fie folosite haotic: câteva postări, un Reel, poate o campanie, apoi dispar într-un folder. Problema nu este neapărat calitatea imaginii, ci lipsa unui sistem de utilizare.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Conținutul vizual trebuie gândit în funcție de platforme, obiective și public. Un video pentru TikTok nu are același rol ca un material pentru website. O fotografie de produs nu are aceeași logică precum o imagine de atmosferă. Un Reel nu trebuie filmat la fel ca un testimonial sau un clip de campanie.
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {problems.map((item) => (
                    <li key={item} className="rounded-2xl border border-[#1f2a2d] bg-[#0b0c10]/72 px-4 py-3 text-sm text-[#dadada]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-base leading-relaxed text-[#d8c7a3]">
                  Producția foto-video devine eficientă atunci când este conectată cu strategia de marketing.
                </p>
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="meaning-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="meaning-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  Conținutul vizual trebuie să fie construit pentru utilizare, nu doar pentru portofoliu
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Pentru Digital Dot, producția foto-video este parte din sistemul de marketing. Nu producem materiale doar pentru estetică, ci pentru utilizare concretă: Social Media, Reels, TikTok, Meta Ads, Google Ads, website, landing pages, campanii sezoniere și comunicare de brand.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Un material bun trebuie să aibă un rol clar. Uneori trebuie să prezinte produsul. Alteori trebuie să transmită atmosferă, să explice un serviciu, să arate o locație, să prezinte o echipă sau să susțină o campanie. De aceea, înainte de producție, stabilim ce trebuie comunicat și unde va fi folosit conținutul.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {systemElements.map((item) => (
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
                Pentru cine este potrivită producția foto-video
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Serviciul este potrivit pentru branduri care au nevoie de conținut vizual constant, profesionist și adaptat comunicării digitale.
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
                  Ce include serviciul de producție foto-video
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[#c6c6c6]">
                  Serviciul este adaptat în funcție de obiectivele brandului și de platformele pe care va fi folosit conținutul.
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
                  Scopul este ca materialele produse să poată fi folosite coerent în comunicarea brandului, nu să rămână într-un folder cu nume poetic și utilitate incertă.
                </p>
              </div>
            </Container>
          </section>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="process-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="process-title" className="text-3xl font-semibold text-white sm:text-4xl">
                Cum construim producția foto-video
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

          <section className="py-18 sm:py-24" aria-labelledby="content-types-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="content-types-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                Tipuri de materiale foto-video pe care le putem produce
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Fiecare platformă are propriile reguli. De aceea, conținutul trebuie gândit diferit în funcție de canal și obiectiv.
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {contentTypes.map((item) => (
                  <article key={item.title} className="brand-card p-6">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{item.description}</p>
                  </article>
                ))}
              </div>
            </Container>
          </section>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="connected-services-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="connected-services-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                Producția foto-video funcționează mai bine când este conectată cu strategia
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Conținutul vizual devine mai eficient atunci când este integrat în calendarul editorial, campaniile plătite și website.
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

          <section className="py-18 sm:py-24" aria-labelledby="case-studies-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="case-studies-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                Studii de caz relevante pentru producție foto-video
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Producția foto-video își arată valoarea atunci când devine parte dintr-un sistem de comunicare. Exemplele de mai jos arată cum conținutul vizual poate susține vizibilitatea, interacțiunile și campaniile.
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

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="photo-video-faq-title">
            <Container>
              <div className="mx-auto max-w-4xl">
                <span className="brand-rule mb-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
                  FAQ
                </p>
                <h2 id="photo-video-faq-title" className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Întrebări frecvente despre producția foto-video
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

          <footer className="py-18 sm:py-24" aria-labelledby="photo-video-cta-title">
            <Container>
              <div className="brand-panel p-8 sm:p-10">
                <span className="brand-rule mb-5" />
                <h2 id="photo-video-cta-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                  Ai nevoie de conținut vizual care poate fi folosit, nu doar admirat
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                  Dacă brandul tău are nevoie de materiale foto-video pentru Social Media, Reels, TikTok, campanii sau website, putem construi producția în jurul unei direcții clare.
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
