import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getSiteContent } from "@/lib/site-content";
import { absoluteUrl, getCanonicalBaseUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema } from "@/lib/structured-data";

const path = "/servicii/google-ads";

const problems = [
  "campanii pornite fără research",
  "cuvinte cheie prea largi",
  "lipsă de negative keywords",
  "landing pages slabe",
  "conversii configurate greșit",
  "bugete distribuite fără priorități",
  "lipsă de segmentare",
  "lipsă de interpretare a datelor",
  "campanii Search, Shopping sau Performance Max lăsate să ruleze fără control",
];

const systemElements = [
  "research de cuvinte cheie",
  "analiză intenție de căutare",
  "structură campanii",
  "structură grupuri de anunțuri",
  "campanii Search",
  "campanii Shopping",
  "Performance Max",
  "optimizare buget",
  "tracking conversii",
  "analiză termeni de căutare",
  "negative keywords",
  "optimizare landing pages",
  "raportare și interpretare",
];

const audiences = [
  {
    title: "Ecommerce și magazine online",
    description: "Pentru companii care au nevoie de campanii Shopping, Performance Max și trafic orientat spre produse.",
  },
  {
    title: "Servicii locale",
    description: "Pentru businessuri care vor să apară în fața oamenilor care caută servicii în zona lor.",
  },
  {
    title: "Clinici și servicii medicale",
    description: "Pentru branduri care au nevoie de vizibilitate pe căutări relevante și trafic către pagini de servicii.",
  },
  {
    title: "B2B și servicii profesionale",
    description: "Pentru companii care vând servicii cu valoare mai mare și au nevoie de leaduri calificate.",
  },
  {
    title: "Branduri care au deja website",
    description: "Pentru companii care au o pagină de destinație capabilă să transforme traficul în acțiuni măsurabile.",
  },
];

const campaignTypes = [
  {
    title: "Search Ads",
    description: "Campanii bazate pe intenția de căutare. Potrivite pentru servicii, căutări comerciale și utilizatori care caută activ o soluție.",
  },
  {
    title: "Shopping Ads",
    description: "Campanii pentru ecommerce, orientate spre produse, prețuri, disponibilitate și intenție de cumpărare.",
  },
  {
    title: "Performance Max",
    description: "Campanii automate care pot folosi mai multe rețele Google, dar care au nevoie de structură, feed, obiective și tracking corect.",
  },
  {
    title: "Display Ads",
    description: "Campanii utile pentru awareness, remarketing și vizibilitate, dacă sunt folosite cu o strategie clară.",
  },
  {
    title: "YouTube Ads",
    description: "Campanii video pentru awareness, educare, retargeting sau susținerea unei campanii mai mari.",
  },
  {
    title: "Remarketing",
    description: "Campanii pentru utilizatori care au interacționat deja cu website-ul sau brandul și pot fi readuși în funnel.",
  },
];

const deliverables = [
  "audit cont Google Ads existent",
  "research de cuvinte cheie",
  "analiză competiție",
  "structură campanii",
  "setare campanii Search",
  "setare campanii Shopping, dacă există ecommerce",
  "setare Performance Max, dacă este potrivit",
  "setare campanii de remarketing",
  "structurare anunțuri",
  "negative keywords",
  "verificare tracking conversii",
  "recomandări pentru landing pages",
  "optimizare bugete",
  "monitorizare performanță",
  "raportare lunară",
  "recomandări de optimizare",
  "interpretare date și ajustări",
];

const processSteps = [
  {
    title: "Înțelegem businessul",
    description: "Începem cu serviciile, produsele, marjele, obiectivele, zonele vizate și istoricul de promovare.",
  },
  {
    title: "Analizăm contul și website-ul",
    description: "Verificăm structura actuală, trackingul, paginile de destinație și datele existente.",
  },
  {
    title: "Facem research",
    description: "Analizăm cuvintele cheie, competiția, intenția de căutare și oportunitățile reale.",
  },
  {
    title: "Construim structura",
    description: "Stabilim campaniile, grupurile de anunțuri, bugetele, audiențele și obiectivele de conversie.",
  },
  {
    title: "Lansăm campaniile",
    description: "Pornim campaniile cu o structură clară, fără amestecarea inutilă a obiectivelor.",
  },
  {
    title: "Optimizăm constant",
    description: "Analizăm termenii de căutare, conversiile, costurile, calitatea traficului și performanța pe campanii.",
  },
  {
    title: "Raportăm și ajustăm",
    description: "Raportarea nu înseamnă doar export de cifre. Interpretăm datele și stabilim ce trebuie schimbat.",
  },
];

const connectedServices = [
  {
    title: "Strategie de Marketing",
    href: "/servicii/strategie-marketing",
    description: "Pentru direcția care stabilește ce promovăm, cui și în ce ordine.",
  },
  {
    title: "Website Creation",
    href: "/servicii/website-creation",
    description: "Pentru pagini de destinație capabile să susțină conversiile.",
  },
  {
    title: "SEO",
    href: "/servicii/seo",
    description: "Pentru vizibilitate organică și structură de conținut pe termen lung.",
  },
  {
    title: "Meta Ads",
    href: "/servicii/meta-ads",
    description: "Pentru completarea cererii active din Google cu awareness, retargeting și trafic din social.",
  },
  {
    title: "Social Media Management",
    href: "/servicii/social-media-management",
    description: "Pentru consolidarea prezenței brandului și susținerea mesajelor din campanii.",
  },
  {
    title: "Producție Foto/Video",
    href: "/servicii/productie-foto-video",
    description: "Pentru materiale vizuale folosite în Performance Max, YouTube, landing pages sau campanii integrate.",
  },
];

const caseStudies = [
  {
    title: "Optik Tataru",
    href: "/case-studies/optik-tataru",
    description:
      "Google Ads, Meta Ads și Social Media pentru un brand de optică medicală, cu 3.900+ conversii urmărite în Google Ads și 30K+ clickuri din Google Ads.",
  },
  {
    title: "Cosmetică Hotelieră",
    href: "/case-studies/cosmeticahoteliera",
    description:
      "Google Ads pentru ecommerce B2B HoReCa, cu 3,75M afișări Google Ads, 56K+ clickuri, 1.922+ conversii urmărite și ROAS Google Ads 5,52.",
  },
];

const faqGroup = {
  id: "google-ads-faq",
  title: "Întrebări frecvente despre Google Ads",
  assignedPaths: [path],
  items: [
    {
      id: "ce-este-google-ads",
      question: "Ce este Google Ads?",
      answer:
        "Google Ads este platforma de publicitate Google prin care companiile pot afișa reclame în rezultatele de căutare, Shopping, YouTube, Display și alte rețele Google. Este utilă mai ales pentru captarea cererii active, adică a oamenilor care caută deja produse sau servicii relevante.",
    },
    {
      id: "potrivit-pentru-orice-business",
      question: "Google Ads este potrivit pentru orice business?",
      answer:
        "Google Ads poate fi potrivit pentru multe tipuri de business, dar nu în același mod. Eficiența depinde de cererea existentă, website, buget, competiție, ofertă și trackingul conversiilor.",
    },
    {
      id: "google-ads-vs-meta-ads",
      question: "Care este diferența dintre Google Ads și Meta Ads?",
      answer:
        "Google Ads captează mai ales cererea activă, adică utilizatori care caută deja ceva. Meta Ads este mai puternic pentru awareness, interes, retargeting și promovarea conținutului în Facebook și Instagram. Cele două pot funcționa foarte bine împreună.",
    },
    {
      id: "conversii-urmarite",
      question: "Ce înseamnă conversii urmărite în Google Ads?",
      answer:
        "Conversiile urmărite sunt acțiuni definite în contul de tracking, cum ar fi completarea unui formular, click pe telefon, click pe WhatsApp, achiziție, adăugare în coș sau alte acțiuni relevante pentru business.",
    },
    {
      id: "acces-website",
      question: "Aveți nevoie de acces la website pentru Google Ads?",
      answer:
        "În multe cazuri, da. Pentru rezultate corecte, trebuie verificat trackingul, paginile de destinație și modul în care utilizatorul ajunge de la reclamă la acțiunea dorită.",
    },
    {
      id: "buget-google-ads",
      question: "Cât buget este necesar pentru Google Ads?",
      answer:
        "Bugetul depinde de industrie, competiție, obiective și zona vizată. Important este ca bugetul să fie suficient pentru a genera date relevante, nu doar câteva clickuri izolate.",
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const canonical = absoluteUrl(path, content);
  const ogImage = absoluteUrl(content.seoSettings.global.defaultOgImage, content);

  return {
    metadataBase: new URL(getCanonicalBaseUrl(content)),
    title: "Google Ads | Digital Dot",
    description:
      "Servicii Google Ads pentru companii care au nevoie de trafic calificat, campanii Search, Shopping, Performance Max, conversii urmărite și optimizare constantă a bugetului.",
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: "Google Ads | Digital Dot",
      description:
        "Campanii Google Ads construite strategic: Search, Shopping, Performance Max, trafic calificat, conversii urmărite și optimizare pe baza datelor.",
      url: canonical,
      siteName: "Digital Dot",
      locale: "ro_RO",
      images: [
        {
          url: ogImage,
          alt: "Google Ads | Digital Dot",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Google Ads | Digital Dot",
      description:
        "Campanii Google Ads construite strategic: Search, Shopping, Performance Max, trafic calificat, conversii urmărite și optimizare pe baza datelor.",
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

export default async function GoogleAdsServicePage() {
  const content = await getSiteContent();
  const canonical = absoluteUrl(path, content);
  const baseUrl = getCanonicalBaseUrl(content);
  const breadcrumbs = [
    { name: "Acasă", path: "/" },
    { name: "Servicii", path: "/#services" },
    { name: "Google Ads", path },
  ];
  const schemas = [
    buildOrganizationSchema(content),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: "Google Ads | Digital Dot",
      description:
        "Servicii Google Ads pentru companii care au nevoie de trafic calificat, campanii Search, Shopping, Performance Max, conversii urmărite și optimizare constantă a bugetului.",
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
      name: "Google Ads",
      description:
        "Servicii Google Ads pentru companii care au nevoie de trafic calificat, campanii Search, Shopping, Performance Max, conversii urmărite, optimizare buget și publicitate digitală bazată pe date.",
      url: canonical,
      serviceType: "Google Ads / PPC Advertising / Search Engine Advertising",
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
          { label: "Google Ads", href: path },
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
                  Google Ads pentru companii care au nevoie de trafic calificat, nu doar de clickuri
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
                  Google Ads funcționează atunci când campaniile sunt construite în jurul intenției reale de căutare, al website-ului și al conversiilor urmărite corect. Nu urmărim doar trafic. Urmărim trafic care are sens pentru business.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink href="/#contact">Hai să povestim</ButtonLink>
                  <ButtonLink href="/case-studies" variant="ghost">Vezi studiile de caz</ButtonLink>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[#aeb6bb]">
                  Search, Shopping, Performance Max și campanii orientate spre date, nu spre impresia frumoasă că avem reclame pornite.
                </p>
              </div>
            </Container>
          </header>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/62 py-18 sm:py-24" aria-labelledby="problem-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="problem-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  De ce multe campanii Google Ads consumă buget fără să construiască rezultate clare
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Google Ads poate aduce trafic foarte valoros, dar doar atunci când campaniile sunt legate de intenția utilizatorului, de structura website-ului și de obiectivele reale ale businessului. Fără aceste lucruri, bugetul se consumă rapid, iar rezultatele devin greu de interpretat.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Problema nu este platforma. Problema este, de multe ori, lipsa structurii: campanii amestecate, cuvinte cheie nepotrivite, pagini de destinație slabe, conversii urmărite greșit și optimizări făcute fără o logică clară.
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {problems.map((item) => (
                    <li key={item} className="rounded-2xl border border-[#1f2a2d] bg-[#0b0c10]/72 px-4 py-3 text-sm text-[#dadada]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-base leading-relaxed text-[#d8c7a3]">
                  Google Ads nu trebuie tratat ca un robinet de trafic. Trebuie tratat ca un sistem de captare a cererii active.
                </p>
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="meaning-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="meaning-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  Google Ads înseamnă să conectăm intenția de căutare cu oferta potrivită
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Pentru Digital Dot, Google Ads nu înseamnă doar setarea unor campanii PPC și urmărirea costului per click. Înseamnă să înțelegem ce caută oamenii, ce ofertă are businessul, ce pagină primește traficul și cum măsurăm acțiunile relevante.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  O campanie bună trebuie să lege mai multe elemente: research, structură de cont, mesaje, buget, landing page, tracking, optimizare Google Ads și interpretare. Fără această legătură, datele devin zgomot, iar campaniile par active, dar nu neapărat utile.
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
                Pentru cine este potrivit serviciul Google Ads
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Google Ads este potrivit pentru companii care vor să ajungă în fața oamenilor care caută deja produse, servicii sau soluții relevante. Este un canal puternic pentru cerere activă, dar are nevoie de structură și măsurare corectă.
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

          <section className="py-18 sm:py-24" aria-labelledby="campaign-types-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="campaign-types-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                Tipuri de campanii Google Ads pe care le putem construi
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Alegerea tipului de campanie depinde de obiective, buget, website și stadiul businessului. Nu toate campaniile sunt potrivite pentru orice brand, iar combinația corectă contează mai mult decât bifarea tuturor opțiunilor din platformă.
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {campaignTypes.map((item) => (
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
                  Ce include serviciul Google Ads
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[#c6c6c6]">
                  Serviciul este construit pentru a lega campaniile de obiectivele reale ale businessului și de datele urmărite corect.
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
                  Scopul nu este să avem multe campanii. Scopul este să avem campanii care pot fi înțelese, măsurate și îmbunătățite.
                </p>
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="process-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="process-title" className="text-3xl font-semibold text-white sm:text-4xl">
                Cum construim campaniile Google Ads
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

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="connected-services-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="connected-services-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                Google Ads funcționează mai bine când este conectat cu website-ul și strategia
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Campaniile Google Ads au nevoie de pagini bune, tracking corect și o direcție strategică. Altfel, trimit trafic într-un sistem care nu știe ce să facă mai departe cu el.
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
                Studii de caz relevante pentru Google Ads
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Campaniile Google Ads devin mai clare atunci când sunt analizate prin rezultate reale: trafic, clickuri, conversii urmărite, valoare de conversie și optimizare pe termen lung.
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-2">
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

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="google-ads-faq-title">
            <Container>
              <div className="mx-auto max-w-4xl">
                <span className="brand-rule mb-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
                  FAQ
                </p>
                <h2 id="google-ads-faq-title" className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Întrebări frecvente despre Google Ads
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

          <footer className="py-18 sm:py-24" aria-labelledby="google-ads-cta-title">
            <Container>
              <div className="brand-panel p-8 sm:p-10">
                <span className="brand-rule mb-5" />
                <h2 id="google-ads-cta-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                  Ai nevoie de campanii Google Ads care pot fi înțelese și optimizate
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                  Dacă ai campanii active, dar nu este clar ce aduc, unde se pierde bugetul sau ce merită scalat, primul pas este să construim o structură mai clară.
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
