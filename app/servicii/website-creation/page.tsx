import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getSiteContent } from "@/lib/site-content";
import { absoluteUrl, getCanonicalBaseUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema } from "@/lib/structured-data";

const path = "/servicii/website-creation";

const problems = [
  "pagini fără structură clară",
  "servicii explicate superficial",
  "lipsă CTA-uri",
  "lipsă tracking",
  "lipsă structură SEO",
  "conținut generic",
  "pagini lente",
  "experiență slabă pe mobil",
  "design rupt de poziționarea brandului",
  "website care nu susține Google Ads sau Meta Ads",
  "lipsă internal linking",
  "lipsă sitemap, schema sau metadata corectă",
];

const systemElements = [
  "arhitectură de pagini",
  "structură UX",
  "structură SEO",
  "design adaptat brandului",
  "pagini de servicii",
  "landing pages",
  "CTA-uri clare",
  "formulare",
  "tracking",
  "metadata",
  "sitemap",
  "schema JSON-LD",
  "optimizare mobil",
  "integrare cu campanii Ads",
  "structură pentru scalare",
];

const audiences = [
  {
    title: "Companii care pornesc un brand nou",
    description: "Pentru businessuri care au nevoie de o structură clară de la început: pagini, servicii, mesaje, SEO și conversii.",
  },
  {
    title: "Branduri cu website vechi",
    description: "Pentru companii care au un site depășit vizual, greu de administrat sau slab optimizat pentru mobil și SEO.",
  },
  {
    title: "Companii care rulează campanii plătite",
    description: "Pentru businessuri care investesc în Google Ads sau Meta Ads și au nevoie de pagini care susțin traficul.",
  },
  {
    title: "Servicii locale și profesionale",
    description: "Pentru firme care vor să explice clar ce oferă și să transforme vizitatorii în cereri de contact.",
  },
  {
    title: "Ecommerce și B2B",
    description: "Pentru companii care au nevoie de structură, categorii, pagini comerciale, tracking și optimizare pe termen lung.",
  },
];

const websiteTypes = [
  {
    title: "Website de prezentare",
    description: "Pentru companii care au nevoie să explice clar cine sunt, ce oferă și cum pot fi contactate.",
  },
  {
    title: "Website de servicii",
    description: "Pentru branduri care vând servicii și au nevoie de pagini dedicate, argumente clare, CTA-uri și structură SEO.",
  },
  {
    title: "Landing page",
    description: "Pentru campanii punctuale, lansări, promovare de servicii, lead generation sau trafic din Google Ads și Meta Ads.",
  },
  {
    title: "Website pentru brand local",
    description: "Pentru companii care au nevoie de vizibilitate locală, servicii explicate clar și integrare cu Google Business Profile.",
  },
  {
    title: "Website orientat spre SEO",
    description: "Pentru proiecte care au nevoie de arhitectură de pagini, conținut optimizat, internal linking, sitemap și schema.",
  },
  {
    title: "Website WordPress",
    description: "Pentru companii care au nevoie de un website administrabil, scalabil și ușor de actualizat.",
  },
];

const deliverables = [
  "structură website",
  "arhitectură pagini",
  "wireframe, dacă este cazul",
  "design UI",
  "implementare responsive",
  "pagini de servicii",
  "pagină contact",
  "formulare",
  "CTA-uri",
  "optimizare mobil",
  "structură SEO de bază",
  "metadata",
  "heading hierarchy",
  "sitemap",
  "robots.txt",
  "schema JSON-LD, unde este cazul",
  "integrare tracking",
  "pregătire pentru Google Ads",
  "pregătire pentru Meta Ads",
  "optimizare imagini",
  "optimizare viteză",
  "pagini legale, dacă sunt furnizate textele",
  "integrare blog, dacă este necesar",
  "structură pentru scalare ulterioară",
];

const processSteps = [
  {
    title: "Discuție inițială",
    description: "Începem cu obiectivele businessului, serviciile, publicul, competiția și rolul website-ului în marketing.",
  },
  {
    title: "Structură",
    description: "Stabilim paginile necesare, ordinea informațiilor, CTA-urile și arhitectura de conținut.",
  },
  {
    title: "Direcție vizuală",
    description: "Adaptăm designul la brand, astfel încât website-ul să transmită clar poziționarea companiei.",
  },
  {
    title: "Conținut și SEO",
    description: "Organizăm textele, headingurile, metadata și linkurile interne astfel încât pagina să fie ușor de înțeles pentru utilizatori și motoarele de căutare.",
  },
  {
    title: "Implementare",
    description: "Construim website-ul responsive, optimizat pentru desktop, tabletă și mobil.",
  },
  {
    title: "Tracking și testare",
    description: "Verificăm formulare, CTA-uri, linkuri, tracking, performanță și funcționare tehnică.",
  },
  {
    title: "Lansare și optimizare",
    description: "După publicare, website-ul poate fi conectat cu Google Ads, Meta Ads, SEO, blog și studii de caz.",
  },
];

const trackingItems = [
  "sitemap.xml",
  "robots.txt",
  "canonical",
  "metadata",
  "heading hierarchy",
  "structured data JSON-LD",
  "FAQ Schema, unde este cazul",
  "Open Graph metadata",
  "optimizare imagini",
  "viteză de încărcare",
  "responsive design",
  "tracking formulare",
  "tracking clickuri Call",
  "tracking clickuri WhatsApp",
  "integrare Metricool / Analytics, dacă este cazul",
  "pregătire pentru Google Search Console",
  "pregătire pentru Google Ads",
  "pregătire pentru Meta Pixel / tracking",
];

const connectedServices = [
  {
    title: "Strategie de Marketing",
    href: "/servicii/strategie-marketing",
    description: "Pentru direcția care stabilește ce trebuie să comunice website-ul.",
  },
  {
    title: "SEO",
    href: "/servicii/seo",
    description: "Pentru structură organică, metadata, sitemap, schema și vizibilitate pe termen lung.",
  },
  {
    title: "Google Ads",
    href: "/servicii/google-ads",
    description: "Pentru trafic calificat către pagini de destinație construite corect.",
  },
  {
    title: "Meta Ads",
    href: "/servicii/meta-ads",
    description: "Pentru campanii de awareness, trafic, retargeting și conversii urmărite.",
  },
  {
    title: "Social Media Management",
    href: "/servicii/social-media-management",
    description: "Pentru conținut care susține website-ul și trimite trafic către paginile relevante.",
  },
  {
    title: "Producție Foto/Video",
    href: "/servicii/productie-foto-video",
    description: "Pentru materiale vizuale integrate în website, landing pages și campanii.",
  },
];

const caseStudies = [
  {
    title: "Taco Loco",
    href: "/case-studies/taco-loco",
    description: "Social Media, Meta Ads și website traffic pentru un brand de restaurant, cu 180K+ views website.",
  },
  {
    title: "Cosmetică Hotelieră",
    href: "/case-studies/cosmeticahoteliera",
    description: "Google Ads, Meta Ads și ecommerce B2B HoReCa, cu 166K+ views website și performance marketing conectat cu website-ul.",
  },
  {
    title: "Optik Tataru",
    href: "/case-studies/optik-tataru",
    description: "Social Media, Meta Ads și Google Ads pentru optică medicală, cu 168K+ website views și 99K+ vizitatori website.",
  },
  {
    title: "Blog Digital Dot",
    href: "/blog",
    description: "Articole despre strategie, SEO, Social Media, campanii digitale și rolul website-ului în marketing.",
  },
];

const faqGroup = {
  id: "website-creation-service-faq",
  title: "Întrebări frecvente despre Website Creation",
  assignedPaths: [path],
  items: [
    {
      id: "ce-inseamna-website-creation",
      question: "Ce înseamnă Website Creation?",
      answer:
        "Website Creation înseamnă construirea unui website clar, funcțional și adaptat obiectivelor de marketing. Include structură, design, pagini, CTA-uri, responsive design, SEO de bază, tracking și pregătire pentru campanii.",
    },
    {
      id: "seo-de-la-inceput",
      question: "Un website nou trebuie optimizat SEO de la început?",
      answer:
        "Da. SEO trebuie luat în calcul încă din etapa de structură, nu adăugat la final. Paginile, headingurile, metadata, sitemap-ul, viteza, linkurile interne și schema influențează modul în care website-ul este înțeles de Google.",
    },
    {
      id: "conectare-google-meta-ads",
      question: "Website-ul poate fi conectat cu Google Ads și Meta Ads?",
      answer:
        "Da. Un website bun trebuie să poată susține campanii Google Ads și Meta Ads prin pagini de destinație clare, CTA-uri vizibile, tracking corect și structură orientată spre conversii.",
    },
    {
      id: "website-wordpress",
      question: "Construiți website-uri pe WordPress?",
      answer:
        "Da, Digital Dot poate construi website-uri WordPress, în funcție de obiectivele proiectului și de structura necesară. WordPress este potrivit pentru multe website-uri de prezentare, servicii, blog și pagini optimizate SEO.",
    },
    {
      id: "ce-trebuie-pregatit",
      question: "Ce trebuie pregătit înainte de construirea unui website?",
      answer:
        "Este util să existe informații despre servicii, public țintă, diferențiatori, exemple de website-uri preferate, identitate vizuală, texte existente, fotografii, materiale video și obiectivele principale ale website-ului.",
    },
    {
      id: "optimizare-ulterior",
      question: "Un website poate fi optimizat ulterior?",
      answer:
        "Da, dar este mai eficient să fie construit corect de la început. Optimizările ulterioare pot corecta structura, SEO-ul, viteza, conținutul și trackingul, dar uneori refacerea parțială devine inevitabilă.",
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const canonical = absoluteUrl(path, content);
  const ogImage = absoluteUrl(content.seoSettings.global.defaultOgImage, content);

  return {
    metadataBase: new URL(getCanonicalBaseUrl(content)),
    title: "Website Creation | Digital Dot",
    description:
      "Servicii Website Creation pentru companii care au nevoie de website-uri clare, rapide, optimizate SEO și conectate cu strategia de marketing, Google Ads, Meta Ads și conversii.",
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: "Website Creation | Digital Dot",
      description:
        "Creare website pentru branduri care au nevoie de structură clară, design coerent, SEO, tracking și pagini care susțin campaniile de marketing.",
      url: canonical,
      siteName: "Digital Dot",
      locale: "ro_RO",
      images: [
        {
          url: ogImage,
          alt: "Website Creation | Digital Dot",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Website Creation | Digital Dot",
      description:
        "Creare website pentru branduri care au nevoie de structură clară, design coerent, SEO, tracking și pagini care susțin campaniile de marketing.",
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function WebsiteCreationServicePage() {
  const content = await getSiteContent();
  const canonical = absoluteUrl(path, content);
  const baseUrl = getCanonicalBaseUrl(content);
  const breadcrumbs = [
    { name: "Acasă", path: "/" },
    { name: "Servicii", path: "/#services" },
    { name: "Website Creation", path },
  ];
  const schemas = [
    buildOrganizationSchema(content),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: "Website Creation | Digital Dot",
      description:
        "Servicii Website Creation pentru companii care au nevoie de website-uri clare, rapide, optimizate SEO și conectate cu strategia de marketing, Google Ads, Meta Ads și conversii.",
      isPartOf: {
        "@id": `${baseUrl}/#website`,
      },
      about: {
        "@id": `${baseUrl}/#organization`,
        name: "Digital Dot",
      },
      inLanguage: "ro-RO",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: "Website Creation",
      description:
        "Servicii Website Creation pentru companii care au nevoie de website-uri clare, responsive, optimizate SEO, pregătite pentru tracking, Google Ads, Meta Ads, conținut, conversii și marketing digital.",
      url: canonical,
      serviceType: "Website Creation / Web Design / Website Development / WordPress Website",
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
          { label: "Website Creation", href: path },
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
                  Website Creation pentru companii care au nevoie de un site clar, nu doar de o vitrină frumoasă
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
                  Un website bun nu este doar un design publicat pe internet. Este o structură care explică brandul, susține campaniile, ajută SEO-ul și transformă interesul în acțiuni măsurabile.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink href="/#contact">Hai să povestim</ButtonLink>
                  <ButtonLink href="/case-studies" variant="ghost">Vezi studiile de caz</ButtonLink>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[#aeb6bb]">
                  Construim website-uri care pot susține strategie, trafic, campanii plătite, SEO și conversie.
                </p>
              </div>
            </Container>
          </header>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/62 py-18 sm:py-24" aria-labelledby="problem-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="problem-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  De ce multe website-uri arată bine, dar nu ajută businessul
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Multe companii au website-uri care arată decent, dar nu explică suficient de clar ce oferă, pentru cine sunt serviciile și de ce ar trebui alese. Alte site-uri nu au structură SEO, nu au pagini de servicii clare, nu au tracking, nu au CTA-uri vizibile și nu pot susține campaniile plătite.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Un website fără strategie devine o broșură digitală. Există, dar nu lucrează. Iar un site care nu lucrează pentru marketing este doar o cheltuială cu design plăcut.
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {problems.map((item) => (
                    <li key={item} className="rounded-2xl border border-[#1f2a2d] bg-[#0b0c10]/72 px-4 py-3 text-sm text-[#dadada]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-base leading-relaxed text-[#d8c7a3]">
                  Website-ul trebuie să fie centrul sistemului de marketing, nu un obiect decorativ cu meniu.
                </p>
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="meaning-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="meaning-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  Un website trebuie construit ca infrastructură de marketing
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Pentru Digital Dot, Website Creation înseamnă construcția unui website care leagă brandul, serviciile, conținutul, SEO-ul și campaniile de marketing într-o structură clară. Designul contează, dar nu este suficient. Un site trebuie să explice, să convingă, să ghideze și să poată fi măsurat.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Construim website-uri pornind de la întrebări simple: ce trebuie să înțeleagă vizitatorul, ce acțiune trebuie să facă, ce servicii trebuie prioritizate, ce pagini sunt importante pentru SEO și cum va fi folosit site-ul în campanii.
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
                Pentru cine este potrivit serviciul Website Creation
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Serviciul este potrivit pentru companii care au nevoie de un website capabil să susțină promovarea, nu doar să existe online.
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

          <section className="py-18 sm:py-24" aria-labelledby="website-types-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="website-types-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                Tipuri de website-uri pe care le putem construi
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Nu toate website-urile au același rol. Alegem structura în funcție de obiectivele businessului, etapa brandului și modul în care site-ul va fi folosit în marketing.
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {websiteTypes.map((item) => (
                  <article key={item.title} className="brand-card p-6">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{item.description}</p>
                  </article>
                ))}
              </div>
            </Container>
          </section>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="deliverables-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="deliverables-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  Ce include serviciul Website Creation
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[#c6c6c6]">
                  Serviciul este construit pentru a livra un website clar, funcțional și conectat cu sistemul de marketing.
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
                  Scopul este să livrăm un website care poate fi folosit în marketing, nu doar arătat într-o prezentare.
                </p>
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="process-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="process-title" className="text-3xl font-semibold text-white sm:text-4xl">
                Cum construim website-ul
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

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="tracking-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="tracking-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                Website-ul trebuie să fie pregătit pentru SEO, tracking și campanii
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Un website care nu poate fi măsurat este greu de optimizat. De aceea, structura tehnică și trackingul sunt importante încă din etapa de construcție.
              </p>
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {trackingItems.map((item) => (
                  <div key={item} className="rounded-2xl border border-[#1f2a2d] bg-[#0b0c10]/72 px-4 py-3 text-sm text-[#dadada]">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#d8c7a3]">
                Un website bun trebuie să poată fi citit de oameni, înțeles de Google și măsurat de echipa de marketing. Triplă cerință, pentru că aparent internetul nu era suficient de complicat.
              </p>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="connected-services-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="connected-services-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                Website Creation funcționează mai bine când este conectat cu strategia și promovarea
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Website-ul este centrul sistemului digital. De aceea, trebuie legat de strategie, campanii, conținut și SEO.
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
                Studii de caz relevante pentru website și campanii conectate
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Un website devine mai valoros atunci când este legat de trafic, conținut și campanii măsurabile. Studiile de caz arată cum website-ul poate funcționa ca destinație pentru Google Ads, Meta Ads și Social Media.
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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

          <section className="py-18 sm:py-24" aria-labelledby="website-faq-title">
            <Container>
              <div className="mx-auto max-w-4xl">
                <span className="brand-rule mb-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
                  FAQ
                </p>
                <h2 id="website-faq-title" className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Întrebări frecvente despre Website Creation
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

          <footer className="border-t border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="website-cta-title">
            <Container>
              <div className="brand-panel p-8 sm:p-10">
                <span className="brand-rule mb-5" />
                <h2 id="website-cta-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                  Ai nevoie de un website care susține marketingul, nu doar îl decorează
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                  Dacă website-ul tău nu explică clar ce faci, nu susține campaniile și nu poate fi măsurat corect, problema nu este doar designul. Problema este structura.
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
