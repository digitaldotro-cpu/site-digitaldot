import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getSiteContent } from "@/lib/site-content";
import { absoluteUrl, getCanonicalBaseUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema } from "@/lib/structured-data";

const path = "/servicii/meta-ads";

const problems = [
  "campanii pornite fără obiectiv clar",
  "reclame fără mesaj diferențiator",
  "creativ vizual care nu atrage atenția",
  "audiențe alese fără logică",
  "lipsă de retargeting",
  "tracking configurat greșit",
  "landing pages slabe",
  "bugete distribuite fără priorități",
  "campanii care nu sunt conectate cu Social Media organic",
  "raportare bazată doar pe cifre superficiale",
];

const systemElements = [
  "structură de campanii",
  "obiective clare",
  "audiențe relevante",
  "creativ adaptat platformei",
  "texte pentru reclame",
  "campanii Facebook Ads",
  "campanii Instagram Ads",
  "campanii de awareness",
  "campanii de trafic",
  "campanii de engagement",
  "retargeting",
  "conversii urmărite",
  "raportare și optimizare",
];

const audiences = [
  {
    title: "Restaurante, cafenele și branduri HoReCa",
    description: "Pentru businessuri care au nevoie de vizibilitate locală, conținut apetisant, trafic și campanii sezoniere.",
  },
  {
    title: "Ecommerce și magazine online",
    description: "Pentru branduri care au nevoie de promovare produse, catalog, retargeting și conversii urmărite.",
  },
  {
    title: "Clinici și servicii medicale",
    description: "Pentru branduri care au nevoie de comunicare responsabilă, awareness local și promovarea serviciilor relevante.",
  },
  {
    title: "Branduri locale",
    description: "Pentru companii care vor să ajungă constant la publicul dintr-o zonă geografică specifică.",
  },
  {
    title: "Servicii B2B și profesionale",
    description: "Pentru companii care au nevoie de awareness, lead generation, retargeting și susținerea mesajelor comerciale.",
  },
];

const campaignTypes = [
  {
    title: "Awareness",
    description: "Campanii pentru vizibilitate, recunoaștere de brand și expunere în fața publicurilor relevante.",
  },
  {
    title: "Traffic",
    description: "Campanii pentru trimiterea utilizatorilor către website, landing page, articol, meniu, ofertă sau pagină de serviciu.",
  },
  {
    title: "Engagement",
    description: "Campanii pentru interacțiuni, reacții, comentarii, distribuiri și validarea unor mesaje sau materiale.",
  },
  {
    title: "Lead Generation",
    description: "Campanii pentru colectarea de contacte, cereri sau formulare, acolo unde obiectivul și oferta permit acest lucru.",
  },
  {
    title: "Sales / Conversions",
    description: "Campanii orientate spre conversii urmărite, achiziții, adăugări în coș, formulare sau alte acțiuni relevante.",
  },
  {
    title: "Retargeting",
    description: "Campanii pentru utilizatorii care au interacționat deja cu website-ul, paginile social media, materialele video sau reclamele anterioare.",
  },
  {
    title: "Catalog Ads",
    description: "Campanii utile pentru ecommerce și branduri cu produse, atunci când feed-ul și trackingul sunt configurate corect.",
  },
];

const deliverables = [
  "audit cont Meta Ads existent",
  "verificare Business Manager",
  "verificare Pixel / Conversions API, dacă există",
  "analiză website și landing pages",
  "structură campanii",
  "setare campanii Facebook Ads",
  "setare campanii Instagram Ads",
  "configurare audiențe",
  "retargeting",
  "texte pentru reclame",
  "recomandări creative",
  "recomandări video / imagini pentru ads",
  "testare A/B, unde este relevant",
  "optimizare bugete",
  "monitorizare performanță",
  "raportare lunară",
  "interpretare date",
  "recomandări de optimizare",
];

const processSteps = [
  {
    title: "Înțelegem businessul",
    description: "Începem cu obiectivele, produsele, serviciile, publicul, zonele vizate și istoricul de promovare.",
  },
  {
    title: "Verificăm infrastructura",
    description: "Analizăm Business Manager, Pixel, tracking, website, landing pages și conturile existente.",
  },
  {
    title: "Stabilim obiectivele",
    description: "Alegem obiectivele potrivite: awareness, trafic, engagement, lead generation, conversii urmărite sau retargeting.",
  },
  {
    title: "Construim audiențele",
    description: "Definim publicurile în funcție de interese, comportamente, locații, date existente și interacțiuni anterioare.",
  },
  {
    title: "Pregătim creativul",
    description: "Stabilim mesajele și formatele vizuale potrivite: imagini, video-uri, Reels, carusele sau materiale statice.",
  },
  {
    title: "Lansăm campaniile",
    description: "Pornim campaniile cu structură clară, buget controlat și obiective măsurabile.",
  },
  {
    title: "Optimizăm constant",
    description: "Analizăm costurile, rezultatele, frecvența, creativul, audiențele și conversiile urmărite.",
  },
  {
    title: "Raportăm și ajustăm",
    description: "Raportarea explică ce s-a întâmplat, ce merită păstrat și ce trebuie schimbat.",
  },
];

const connectedServices = [
  {
    title: "Strategie de Marketing",
    href: "/servicii/strategie-marketing",
    description: "Pentru direcția care stabilește ce promovăm, cui și cu ce mesaj.",
  },
  {
    title: "Social Media Management",
    href: "/servicii/social-media-management",
    description: "Pentru conținut organic care susține campaniile plătite și prezența constantă a brandului.",
  },
  {
    title: "Producție Foto/Video",
    href: "/servicii/productie-foto-video",
    description: "Pentru materiale vizuale adaptate Facebook, Instagram, Reels și campaniilor plătite.",
  },
  {
    title: "Website Creation",
    href: "/servicii/website-creation",
    description: "Pentru pagini capabile să transforme traficul din reclame în acțiuni măsurabile.",
  },
  {
    title: "Google Ads",
    href: "/servicii/google-ads",
    description: "Pentru completarea campaniilor Meta Ads cu cererea activă din Google.",
  },
  {
    title: "SEO",
    href: "/servicii/seo",
    description: "Pentru vizibilitate organică și structură de conținut pe termen lung.",
  },
];

const caseStudies = [
  {
    title: "Taco Loco",
    href: "/case-studies/taco-loco",
    description:
      "Meta Ads, Social Media și website traffic pentru restaurant marketing, cu 2,91M+ afișări Meta Ads, 24,89K clickuri și ROAS 13,30.",
  },
  {
    title: "Optik Tataru",
    href: "/case-studies/optik-tataru",
    description:
      "Meta Ads, Google Ads și Social Media pentru un brand de optică medicală, cu 2,46M afișări Meta Ads și 119K+ clickuri.",
  },
  {
    title: "Cosmetică Hotelieră",
    href: "/case-studies/cosmeticahoteliera",
    description:
      "Meta Ads și Google Ads pentru ecommerce B2B HoReCa, cu ROAS Meta Ads 12,19 și campanii orientate spre conversii urmărite.",
  },
];

const faqGroup = {
  id: "meta-ads-faq",
  title: "Întrebări frecvente despre Meta Ads",
  assignedPaths: [path],
  items: [
    {
      id: "ce-sunt-meta-ads",
      question: "Ce sunt Meta Ads?",
      answer:
        "Meta Ads sunt reclamele difuzate prin platforma Meta, în principal pe Facebook și Instagram. Ele pot fi folosite pentru awareness, trafic, engagement, lead generation, retargeting sau conversii urmărite.",
    },
    {
      id: "meta-ads-vs-google-ads",
      question: "Care este diferența dintre Meta Ads și Google Ads?",
      answer:
        "Meta Ads este potrivit pentru a ajunge la publicuri relevante în Facebook și Instagram, inclusiv prin awareness, interes și retargeting. Google Ads este mai orientat spre cerere activă, adică oameni care caută deja produse sau servicii. Cele două canale pot funcționa foarte bine împreună.",
    },
    {
      id: "fara-continut-bun",
      question: "Meta Ads funcționează fără conținut bun?",
      answer:
        "Funcționează tehnic, dar rareori eficient. Creativul vizual, mesajul și oferta au un impact major asupra rezultatelor. Reclamele Meta Ads au nevoie de imagini, video-uri și texte adaptate platformei.",
    },
    {
      id: "retargeting-meta-ads",
      question: "Ce este retargetingul în Meta Ads?",
      answer:
        "Retargetingul este promovarea către utilizatori care au interacționat deja cu brandul: au vizitat website-ul, au văzut un video, au interacționat cu pagina sau au intrat în contact cu reclamele anterioare.",
    },
    {
      id: "pixel-meta",
      question: "Aveți nevoie de Pixel Meta pentru campanii?",
      answer:
        "Da, pentru campanii orientate spre conversii urmărite este important ca Pixelul Meta și, unde este cazul, Conversions API să fie configurate corect. Fără tracking, optimizarea campaniilor este limitată.",
    },
    {
      id: "buget-meta-ads",
      question: "Ce buget este necesar pentru Meta Ads?",
      answer:
        "Bugetul depinde de obiectiv, industrie, competiție, audiență și durata campaniei. Important este ca bugetul să permită testare și colectare de date relevante, nu doar afișări izolate.",
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const canonical = absoluteUrl(path, content);
  const ogImage = absoluteUrl(content.seoSettings.global.defaultOgImage, content);

  return {
    metadataBase: new URL(getCanonicalBaseUrl(content)),
    title: "Meta Ads | Digital Dot",
    description:
      "Servicii Meta Ads pentru companii care au nevoie de campanii Facebook și Instagram, awareness, trafic, retargeting, conversii urmărite și optimizare constantă.",
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: "Meta Ads | Digital Dot",
      description:
        "Campanii Meta Ads construite strategic pentru Facebook și Instagram: awareness, trafic, retargeting, conversii urmărite și promovare conectată cu obiectivele de business.",
      url: canonical,
      siteName: "Digital Dot",
      locale: "ro_RO",
      images: [
        {
          url: ogImage,
          alt: "Meta Ads | Digital Dot",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Meta Ads | Digital Dot",
      description:
        "Campanii Meta Ads construite strategic pentru Facebook și Instagram: awareness, trafic, retargeting, conversii urmărite și promovare conectată cu obiectivele de business.",
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

export default async function MetaAdsServicePage() {
  const content = await getSiteContent();
  const canonical = absoluteUrl(path, content);
  const baseUrl = getCanonicalBaseUrl(content);
  const breadcrumbs = [
    { name: "Acasă", path: "/" },
    { name: "Servicii", path: "/#services" },
    { name: "Meta Ads", path },
  ];
  const schemas = [
    buildOrganizationSchema(content),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: "Meta Ads | Digital Dot",
      description:
        "Servicii Meta Ads pentru companii care au nevoie de campanii Facebook și Instagram, awareness, trafic, retargeting, conversii urmărite și optimizare constantă.",
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
      name: "Meta Ads",
      description:
        "Servicii Meta Ads pentru companii care au nevoie de campanii Facebook Ads și Instagram Ads, awareness, trafic, retargeting, conversii urmărite, optimizare buget și promovare digitală bazată pe date.",
      url: canonical,
      serviceType: "Meta Ads / Facebook Ads / Instagram Ads / Social Media Advertising",
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
          { label: "Meta Ads", href: path },
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
                  Meta Ads pentru companii care vor campanii clare, nu doar reclame pornite
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
                  Meta Ads poate construi awareness, trafic, retargeting și conversii urmărite, dar doar atunci când campaniile sunt conectate cu mesajul, creativul, publicul și website-ul. Nu urmărim doar afișări. Urmărim campanii care au un rol clar în sistemul de marketing.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink href="/#contact">Hai să povestim</ButtonLink>
                  <ButtonLink href="/case-studies" variant="ghost">Vezi studiile de caz</ButtonLink>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[#aeb6bb]">
                  Facebook Ads și Instagram Ads construite cu structură, creativ relevant și optimizare constantă.
                </p>
              </div>
            </Container>
          </header>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/62 py-18 sm:py-24" aria-labelledby="problem-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="problem-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  De ce multe campanii Meta Ads consumă buget fără direcție
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Meta Ads poate aduce vizibilitate, trafic și interacțiuni valoroase, dar platforma nu repară lipsa de strategie. Dacă mesajul este slab, creativul nu spune nimic, audiențele sunt alese la întâmplare sau website-ul nu susține conversia, bugetul se consumă fără o direcție clară.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Problema nu este că Facebook sau Instagram nu mai funcționează. Problema este, de multe ori, că reclamele sunt tratate ca acțiuni izolate, nu ca parte dintr-un sistem de marketing.
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {problems.map((item) => (
                    <li key={item} className="rounded-2xl border border-[#1f2a2d] bg-[#0b0c10]/72 px-4 py-3 text-sm text-[#dadada]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-base leading-relaxed text-[#d8c7a3]">
                  Meta Ads nu trebuie să fie o ruletă cu buget. Trebuie să fie un sistem de testare, promovare și optimizare.
                </p>
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="meaning-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="meaning-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  Meta Ads înseamnă să conectăm publicul, mesajul și creativul potrivit
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Pentru Digital Dot, Meta Ads nu înseamnă doar setarea unor reclame în Facebook Ads Manager. Înseamnă să înțelegem cui vorbim, ce vrem să obținem, ce mesaj folosim, ce material vizual susține campania și cum măsurăm acțiunile relevante.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  O campanie Meta Ads bună are nevoie de strategie, conținut, audiențe, obiective corecte, tracking și optimizare. Fără aceste elemente, platforma livrează reclame Meta Ads, dar nu neapărat rezultate relevante pentru business.
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
                Pentru cine este potrivit serviciul Meta Ads
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Meta Ads este potrivit pentru companii care vor să ajungă în fața unor publicuri relevante prin Facebook și Instagram, fie pentru vizibilitate, fie pentru trafic, retargeting sau conversii urmărite.
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
                Tipuri de campanii Meta Ads pe care le putem construi
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Alegerea campaniei depinde de obiectivul real al businessului. Nu orice brand are nevoie de toate tipurile de campanii, iar eficiența vine din combinația potrivită dintre obiectiv, creativ, public și buget.
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
                  Ce include serviciul Meta Ads
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[#c6c6c6]">
                  Serviciul este construit pentru a conecta obiectivele de business cu structura campaniilor, creativul și datele urmărite.
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
                  Scopul nu este să pornim reclame. Scopul este să construim campanii care pot fi urmărite, interpretate și îmbunătățite.
                </p>
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="process-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="process-title" className="text-3xl font-semibold text-white sm:text-4xl">
                Cum construim campaniile Meta Ads
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
                Meta Ads funcționează mai bine când este conectat cu mesajul și conținutul
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Campaniile Meta Ads au nevoie de conținut bun, strategie, website funcțional și tracking. Fără aceste lucruri, campaniile pot genera cifre, dar nu neapărat progres real.
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
                Studii de caz relevante pentru Meta Ads
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Meta Ads devine mai relevant atunci când este analizat prin rezultate reale: afișări, reach, clickuri, interacțiuni, conversii urmărite și ROAS, acolo unde datele îl confirmă.
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

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="meta-ads-faq-title">
            <Container>
              <div className="mx-auto max-w-4xl">
                <span className="brand-rule mb-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
                  FAQ
                </p>
                <h2 id="meta-ads-faq-title" className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Întrebări frecvente despre Meta Ads
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

          <footer className="py-18 sm:py-24" aria-labelledby="meta-ads-cta-title">
            <Container>
              <div className="brand-panel p-8 sm:p-10">
                <span className="brand-rule mb-5" />
                <h2 id="meta-ads-cta-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                  Ai nevoie de Meta Ads care susțin un sistem, nu doar afișări
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                  Dacă ai reclame active, dar nu este clar ce rol au în marketingul tău, primul pas este să verificăm structura, mesajul, creativul și trackingul.
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
