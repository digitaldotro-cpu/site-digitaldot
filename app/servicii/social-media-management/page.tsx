import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { getSiteContent } from "@/lib/site-content";
import { absoluteUrl, buildRouteMetadata, getCanonicalBaseUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema, buildWebPageSchema } from "@/lib/structured-data";

const path = "/servicii/social-media-management";

const problems = [
  "postări fără obiectiv",
  "conținut vizual fără coerență",
  "lipsă de calendar editorial",
  "mesaje diferite de la o lună la alta",
  "Reels și TikTok făcute fără strategie",
  "campanii care nu sunt susținute de conținut organic",
  "lipsă de analiză a rezultatelor",
  "comunicare ruptă de website, ads și vânzări",
];

const systemElements = [
  "direcție editorială",
  "calendar de conținut",
  "texte pentru postări",
  "idei de Reels și TikTok",
  "conținut foto-video",
  "adaptare pentru fiecare platformă",
  "analiză rezultate",
  "optimizare continuă",
  "integrare cu Meta Ads, Google Ads, website și SEO",
];

const audiences = [
  {
    title: "Branduri locale care vor vizibilitate",
    description: "Pentru companii care au nevoie să fie prezente constant în fața publicului local.",
  },
  {
    title: "Restaurante, cafenele și branduri HoReCa",
    description: "Pentru businessuri în care imaginea, apetitul, atmosfera și recurența contează.",
  },
  {
    title: "Clinici și servicii medicale",
    description: "Pentru branduri care au nevoie de comunicare clară, responsabilă și orientată spre încredere.",
  },
  {
    title: "Ecommerce și branduri B2B",
    description: "Pentru companii care au nevoie să susțină produsele, ofertele și campaniile prin conținut constant.",
  },
  {
    title: "Branduri în expansiune",
    description: "Pentru businessuri care comunică în mai multe orașe, locații sau linii de servicii.",
  },
];

const deliverables = [
  "strategie lunară de conținut",
  "calendar editorial",
  "texte pentru postări",
  "direcție vizuală",
  "propuneri de concepte",
  "planificare campanii de conținut",
  "publicare postări",
  "administrare Facebook",
  "administrare Instagram",
  "administrare TikTok, unde este cazul",
  "administrare LinkedIn, unde este relevant",
  "idei pentru Reels",
  "idei pentru TikTok",
  "coordonare producție foto-video",
  "adaptare conținut pentru fiecare platformă",
  "monitorizare interacțiuni",
  "raportare lunară",
  "recomandări de optimizare",
];

const processSteps = [
  {
    title: "Înțelegem brandul",
    description: "Începem cu obiectivele, serviciile, produsele, publicul și diferențiatorii brandului.",
  },
  {
    title: "Stabilim direcția",
    description: "Definim temele principale de comunicare, tonul, tipurile de conținut și rolul fiecărei platforme.",
  },
  {
    title: "Construim calendarul",
    description: "Planificăm lunar postările, Reels-urile, TikTok-urile și campaniile de conținut.",
  },
  {
    title: "Producem sau coordonăm conținutul",
    description: "Stabilim ce materiale sunt necesare: foto, video, grafică, texte, testimoniale sau conținut educativ.",
  },
  {
    title: "Publicăm și administrăm",
    description: "Publicăm conținutul conform calendarului și menținem prezența activă pe platformele relevante.",
  },
  {
    title: "Analizăm rezultatele",
    description: "Urmărim afișări, reach, interacțiuni, clickuri, creștere comunitate și conținut performant.",
  },
  {
    title: "Optimizăm direcția",
    description: "Ajustăm lunar comunicarea în funcție de rezultate și de obiectivele businessului.",
  },
];

const platforms = [
  {
    title: "Facebook",
    description: "Potrivit pentru comunități locale, servicii, brand awareness, evenimente, oferte și comunicare constantă.",
  },
  {
    title: "Instagram",
    description: "Potrivit pentru branduri vizuale, lifestyle, HoReCa, medical, retail, fashion, beauty și conținut de imagine.",
  },
  {
    title: "TikTok",
    description: "Potrivit pentru branduri care pot comunica prin video scurt, ritm, personalitate, storytelling și conținut ușor de distribuit.",
  },
  {
    title: "LinkedIn",
    description: "Potrivit pentru B2B, servicii profesionale, poziționare, employer branding și comunicare de autoritate.",
  },
  {
    title: "Google Business Profile",
    description: "Poate susține vizibilitatea locală prin postări, imagini, actualizări și informații utile pentru clienți.",
  },
];

const connectedServices = [
  {
    title: "Strategie de Marketing",
    href: "/servicii/strategie-marketing",
    description: "Pentru direcție, poziționare și prioritizarea canalelor.",
  },
  {
    title: "Producție Foto/Video",
    href: "/servicii/productie-foto-video",
    description: "Pentru materiale vizuale care susțin mesajul și diferențiază brandul.",
  },
  {
    title: "Meta Ads",
    href: "/servicii/meta-ads",
    description: "Pentru promovarea conținutului, awareness, trafic și retargeting.",
  },
  {
    title: "Google Ads",
    href: "/servicii/google-ads",
    description: "Pentru captarea cererii active și conectarea cu publicul care caută deja soluții.",
  },
  {
    title: "Website Creation",
    href: "/servicii/website-creation",
    description: "Pentru o destinație clară unde traficul din Social Media poate fi transformat în acțiune.",
  },
  {
    title: "SEO",
    href: "/servicii/seo",
    description: "Pentru vizibilitate organică și conținut care susține căutările relevante.",
  },
];

const caseStudies = [
  {
    title: "Lunna",
    href: "/case-studies/lunna",
    description: "Social Media, Reels și TikTok pentru un brand construit în jurul cafelei, brunch-ului și atmosferei.",
  },
  {
    title: "Lumea Perdelelor",
    href: "/case-studies/lumea-perdelelor",
    description: "Conținut social media scalabil pentru un brand în expansiune la nivel național.",
  },
  {
    title: "ARTIO Medica",
    href: "/case-studies/artio-medica",
    description: "Comunicare medicală clară și responsabilă pentru o clinică medicală.",
  },
  {
    title: "Taco Loco",
    href: "/case-studies/taco-loco",
    description: "Social Media și conținut culinar conectate cu Meta Ads și website traffic.",
  },
  {
    title: "Optik Tataru",
    href: "/case-studies/optik-tataru",
    description: "Social Media, Meta Ads și Google Ads pentru un brand de optică medicală.",
  },
];

const faqGroup = {
  id: "social-media-management-faq",
  title: "Întrebări frecvente despre Social Media Management",
  assignedPaths: [path],
  items: [
    {
      id: "ce-inseamna-social-media-management",
      question: "Ce înseamnă Social Media Management?",
      answer:
        "Social Media Management înseamnă administrarea strategică a prezenței unui brand pe platforme precum Facebook, Instagram, TikTok sau LinkedIn. Include planificare, conținut, publicare, analiză și optimizare.",
    },
    {
      id: "doar-postari",
      question: "Social Media Management înseamnă doar postări?",
      answer:
        "Nu. Postările sunt doar partea vizibilă. Un serviciu complet include strategie, calendar editorial, direcție vizuală, texte, conținut foto-video, analiză și conectarea comunicării cu obiectivele de business.",
    },
    {
      id: "platforme-administrate",
      question: "Pe ce platforme poate administra Digital Dot comunicarea?",
      answer:
        "Digital Dot poate construi comunicare pentru Facebook, Instagram, TikTok, LinkedIn și Google Business Profile, în funcție de publicul și obiectivele fiecărui brand.",
    },
    {
      id: "productie-foto-video",
      question: "Este nevoie de producție foto-video pentru Social Media?",
      answer:
        "În cele mai multe cazuri, da. Conținutul foto-video ajută brandul să comunice mai clar, mai memorabil și mai coerent. Pentru servicii precum HoReCa, medical, retail sau branduri vizuale, producția foto-video este esențială.",
    },
    {
      id: "conectare-meta-ads",
      question: "Social Media Management poate fi conectat cu Meta Ads?",
      answer:
        "Da. Conținutul organic și campaniile Meta Ads funcționează mai bine împreună. Social Media construiește prezență și încredere, iar Meta Ads poate amplifica mesajele relevante către publicuri bine definite.",
    },
    {
      id: "frecventa-postari",
      question: "Cât de des trebuie să posteze un brand?",
      answer:
        "Frecvența depinde de industrie, obiective, resurse și platforme. Important nu este doar numărul de postări, ci coerența comunicării și rolul fiecărui material în strategia generală.",
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return buildRouteMetadata({
    content,
    path,
    fallbackTitle: "Social Media Management | Digital Dot",
    fallbackDescription:
      "Servicii de Social Media Management pentru companii care au nevoie de strategie, conținut constant, Reels, TikTok, Instagram, Facebook și comunicare coerentă orientată spre rezultate.",
  });
}

export default async function SocialMediaManagementServicePage() {
  const content = await getSiteContent();
  const canonical = absoluteUrl(path, content);
  const baseUrl = getCanonicalBaseUrl(content);
  const breadcrumbs = [
    { name: "Acasă", path: "/" },
    { name: "Servicii", path: "/#services" },
    { name: "Social Media Management", path },
  ];
  const schemas = [
    buildOrganizationSchema(content),
    buildWebPageSchema(content, path),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: "Social Media Management",
      description:
        "Servicii de Social Media Management pentru companii care au nevoie de strategie, conținut constant, Reels, TikTok, Instagram, Facebook, administrare pagini social media și comunicare conectată cu obiectivele de business.",
      url: canonical,
      serviceType: "Social Media Management / Digital Marketing",
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
          { label: "Social Media Management", href: path },
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
                  Social Media Management pentru branduri care au nevoie de conținut cu direcție
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
                  Social Media nu înseamnă doar postări publicate la timp. Înseamnă strategie, mesaj, ritm, conținut vizual și o prezență constantă care susține obiectivele reale ale businessului.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink href="/#contact">Hai să povestim</ButtonLink>
                  <ButtonLink href="/case-studies" variant="ghost">Vezi studiile de caz</ButtonLink>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[#aeb6bb]">
                  Fără postări făcute doar ca să bifăm calendarul. Conținutul trebuie să aibă rol, context și direcție.
                </p>
              </div>
            </Container>
          </header>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/62 py-18 sm:py-24" aria-labelledby="problem-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="problem-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  De ce Social Media nu funcționează când este tratat ca simplă activitate
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Multe companii publică frecvent, dar fără o direcție clară. Apar postări, story-uri, reels-uri și campanii punctuale, însă fără o legătură reală între mesaj, public, produs și obiectivele de business.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Problema nu este lipsa activității. Problema este lipsa structurii. Un cont de Social Media poate fi activ și totuși irelevant dacă nu are un mesaj clar, un public definit și un sistem de conținut care susține poziționarea brandului.
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {problems.map((item) => (
                    <li key={item} className="rounded-2xl border border-[#1f2a2d] bg-[#0b0c10]/72 px-4 py-3 text-sm text-[#dadada]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-base leading-relaxed text-[#d8c7a3]">
                  Social Media Management corect nu înseamnă mai mult zgomot. Înseamnă prezență construită cu sens.
                </p>
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="meaning-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="meaning-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  Social Media Management este sistemul de comunicare vizibilă al brandului
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Pentru Digital Dot, Social Media Management nu înseamnă doar administrarea unor pagini. Înseamnă construirea unei prezențe digitale care comunică limpede cine este brandul, ce oferă, de ce contează și cum rămâne relevant în mintea publicului.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Un sistem bun de Social Media leagă strategia, conținutul foto-video, textele, ritmul de publicare, campaniile plătite și analiza rezultatelor. Fiecare postare trebuie să aibă un rol: să educe, să atragă atenția, să prezinte un produs, să construiască încredere, să genereze interacțiune sau să susțină o campanie.
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
                Pentru cine este potrivit Social Media Management
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Serviciul este potrivit pentru branduri care au nevoie de o prezență constantă și coerentă, nu doar de câteva postări publicate când își amintește cineva de pagină.
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
                  Ce include serviciul de Social Media Management
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[#c6c6c6]">
                  Serviciul este construit ca un sistem de comunicare lunară, adaptat brandului, obiectivelor și resurselor disponibile.
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
                  Scopul nu este să publicăm mult. Scopul este să publicăm coerent, constant și cu rol clar în sistemul de marketing.
                </p>
              </div>
            </Container>
          </section>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="process-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="process-title" className="text-3xl font-semibold text-white sm:text-4xl">
                Cum construim Social Media Management-ul
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

          <section className="py-18 sm:py-24" aria-labelledby="platforms-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="platforms-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                Platforme pe care construim prezență social media
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Nu toate brandurile au nevoie de toate platformele. Alegem canalele în funcție de public, obiective și resurse.
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {platforms.map((item) => (
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
                Social Media funcționează mai bine când este conectat cu restul sistemului
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Conținutul social media devine mai valoros atunci când este legat de strategie, producție video, campanii plătite și website.
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
                Studii de caz relevante pentru Social Media Management
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Rezultatele reale arată cel mai bine cum poate funcționa Social Media atunci când este tratat ca sistem de comunicare, nu ca activitate izolată.
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

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="social-faq-title">
            <Container>
              <div className="mx-auto max-w-4xl">
                <span className="brand-rule mb-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
                  FAQ
                </p>
                <h2 id="social-faq-title" className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Întrebări frecvente despre Social Media Management
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

          <footer className="py-18 sm:py-24" aria-labelledby="social-cta-title">
            <Container>
              <div className="brand-panel p-8 sm:p-10">
                <span className="brand-rule mb-5" />
                <h2 id="social-cta-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                  Ai nevoie de Social Media care construiește prezență, nu doar activitate
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                  Dacă paginile tale sunt active, dar nu transmit o direcție clară, problema nu este lipsa postărilor. Problema este lipsa unui sistem de comunicare.
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
