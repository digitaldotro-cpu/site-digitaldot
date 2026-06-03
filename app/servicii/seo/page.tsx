import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getSiteContent } from "@/lib/site-content";
import { absoluteUrl, getCanonicalBaseUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema } from "@/lib/structured-data";

const path = "/servicii/seo";

const problems = [
  "pagini de servicii incomplete",
  "meta title și meta description generice",
  "heading hierarchy incorectă",
  "canonicaluri lipsă sau greșite",
  "sitemap incomplet",
  "robots.txt configurat greșit",
  "lipsă structured data",
  "lipsă FAQ Schema",
  "internal linking slab",
  "blog fără legătură cu serviciile",
  "pagini regionale duplicate",
  "conținut scris pentru keyworduri, nu pentru utilizator",
];

const seoElements = [
  "structură clară de pagini",
  "pagini de servicii complete",
  "studii de caz relevante",
  "internal linking",
  "metadata unică",
  "breadcrumb",
  "sitemap",
  "robots.txt",
  "llms.txt",
  "structured data",
  "FAQ Schema",
  "content strategy",
  "optimizare locală",
  "optimizare pentru Google și AI search",
];

const audiences = [
  {
    title: "Companii cu website existent",
    description: "Pentru businessuri care au deja un website, dar nu primesc suficient trafic organic sau nu apar relevant în căutări.",
  },
  {
    title: "Branduri care investesc în conținut",
    description: "Pentru companii care vor blog, pagini de servicii, studii de caz și conținut care poate fi indexat și înțeles corect.",
  },
  {
    title: "Businessuri locale",
    description: "Pentru firme care vor vizibilitate în orașe sau regiuni relevante: Suceava, Iași, București, Cluj-Napoca și alte zone targetate.",
  },
  {
    title: "Ecommerce și B2B",
    description: "Pentru branduri care au nevoie de structură pe categorii, produse, servicii, intenție de căutare și trafic calificat.",
  },
  {
    title: "Companii care vor AI SEO",
    description: "Pentru branduri care vor să fie mai ușor de înțeles de motoare AI precum ChatGPT, Gemini, Perplexity și alte sisteme de răspuns.",
  },
];

const deliverables = [
  "audit SEO tehnic",
  "analiză structură website",
  "analiză pagini de servicii",
  "analiză metadata",
  "analiză H1/H2/H3",
  "analiză sitemap",
  "analiză robots.txt",
  "analiză canonical",
  "analiză internal linking",
  "analiză conținut existent",
  "strategie de keyworduri",
  "optimizare pagini de servicii",
  "optimizare pagini regionale",
  "optimizare studii de caz",
  "optimizare blog",
  "FAQ + FAQ Schema",
  "structured data JSON-LD",
  "llms.txt pentru AI SEO",
  "recomandări content strategy",
  "raportare și prioritizare",
];

const technicalItems = [
  "status pages",
  "404-uri",
  "redirecturi",
  "canonical",
  "sitemap.xml",
  "robots.txt",
  "indexability",
  "heading structure",
  "metadata",
  "schema JSON-LD",
  "performanță",
  "Core Web Vitals",
  "responsive",
  "imagini",
  "linkuri interne",
  "crawlability",
  "erori în console",
  "duplicate content",
  "pagini orfane",
];

const aiSeoItems = [
  "llms.txt",
  "structură semantică",
  "Organization Schema",
  "Service Schema",
  "FAQ Schema",
  "BreadcrumbList",
  "studii de caz clare",
  "pagini de servicii complete",
  "internal linking coerent",
  "texte explicite despre cine este Digital Dot",
  "relație clară între servicii, rezultate și industrii",
];

const processSteps = [
  {
    title: "Audit inițial",
    description: "Verificăm structura website-ului, rutele, indexarea, sitemap-ul, metadata, schema, linkurile interne și conținutul existent.",
  },
  {
    title: "Diagnostic SEO",
    description: "Identificăm problemele care blochează vizibilitatea: pagini incomplete, conținut duplicat, linkuri rupte, canonicaluri greșite sau lipsă de structură.",
  },
  {
    title: "Strategie de keyworduri",
    description: "Stabilim ce căutări sunt relevante pentru business și cum trebuie distribuite între paginile de servicii, blog, studii de caz și pagini regionale.",
  },
  {
    title: "Optimizare tehnică",
    description: "Corectăm problemele de indexare, structură, sitemap, robots, schema și performanță.",
  },
  {
    title: "Optimizare conținut",
    description: "Completăm și optimizăm paginile importante cu texte clare, headinguri corecte, linkuri interne și FAQ.",
  },
  {
    title: "AI SEO",
    description: "Structurăm informațiile importante pentru motoarele AI prin llms.txt, schema și claritate semantică.",
  },
  {
    title: "Monitorizare",
    description: "Urmărim indexarea, traficul organic, pozițiile relevante, paginile performante și conversiile generate organic.",
  },
];

const connectedServices = [
  {
    title: "Strategie de Marketing",
    href: "/servicii/strategie-marketing",
    description: "Pentru direcția care stabilește ce servicii, mesaje și pagini merită prioritizate.",
  },
  {
    title: "Website Creation",
    href: "/servicii/website-creation",
    description: "Pentru un website construit cu structură, performanță și pagini clare.",
  },
  {
    title: "Social Media Management",
    href: "/servicii/social-media-management",
    description: "Pentru conținut care susține vizibilitatea brandului și poate alimenta idei de blog, studii de caz și comunicare.",
  },
  {
    title: "Producție Foto/Video",
    href: "/servicii/productie-foto-video",
    description: "Pentru materiale vizuale optimizate, conținut video și suport pentru pagini relevante.",
  },
  {
    title: "Google Ads",
    href: "/servicii/google-ads",
    description: "Pentru date despre intenție, keyworduri și pagini care pot fi optimizate organic.",
  },
  {
    title: "Meta Ads",
    href: "/servicii/meta-ads",
    description: "Pentru campanii și mesaje care pot susține awareness, retargeting și conținut relevant.",
  },
];

const relevantContent = [
  {
    title: "Studii de caz",
    href: "/case-studies",
    description: "Hub-ul cu proiecte reale, servicii implicate și contexte utile pentru autoritatea organică.",
  },
  {
    title: "Optik Tataru",
    href: "/case-studies/optik-tataru",
    description: "Studiu de caz pentru optică medicală, Social Media, Meta Ads și Google Ads.",
  },
  {
    title: "Cosmetică Hotelieră",
    href: "/case-studies/cosmeticahoteliera",
    description: "Studiu de caz pentru ecommerce B2B HoReCa, Google Ads, Meta Ads și performance marketing.",
  },
  {
    title: "ARTIO Medica",
    href: "/case-studies/artio-medica",
    description: "Studiu de caz pentru comunicare medicală și Social Media pentru clinică.",
  },
  {
    title: "Lumea Perdelelor",
    href: "/case-studies/lumea-perdelelor",
    description: "Studiu de caz pentru brand expansion, Social Media, Reels și TikTok.",
  },
  {
    title: "Blog Digital Dot",
    href: "/blog",
    description: "Articole de marketing, strategie, SEO, Social Media și campanii digitale.",
  },
];

const regionalLinks = [
  {
    title: "Agenție de Marketing Suceava",
    href: "/agentie-marketing/suceava",
    description: "Context regional pentru SEO local, servicii și vizibilitate organică în Suceava.",
  },
  {
    title: "Agenție de Marketing Iași",
    href: "/agentie-marketing/iasi",
    description: "Pagină regională relevantă pentru companii care vizează piața din Iași.",
  },
  {
    title: "Agenție de Marketing București",
    href: "/agentie-marketing/bucuresti",
    description: "Structură regională pentru servicii de marketing digital și SEO local în București.",
  },
  {
    title: "Agenție de Marketing Cluj-Napoca",
    href: "/agentie-marketing/cluj-napoca",
    description: "Exemplu de pagină regională conectată cu serviciile și arhitectura SEO a website-ului.",
  },
];

const faqGroup = {
  id: "seo-faq",
  title: "Întrebări frecvente despre SEO",
  assignedPaths: [path],
  items: [
    {
      id: "ce-este-seo",
      question: "Ce este SEO?",
      answer:
        "SEO înseamnă optimizarea website-ului pentru motoarele de căutare. Include structură tehnică, conținut relevant, metadata, linkuri interne, sitemap, schema, performanță și autoritate organică.",
    },
    {
      id: "cat-dureaza-seo",
      question: "Cât durează până apar rezultate SEO?",
      answer:
        "SEO este un proces pe termen mediu și lung. Primele îmbunătățiri pot apărea după indexarea modificărilor, dar rezultatele consistente depind de competiție, conținut, autoritate, structură și ritmul de optimizare.",
    },
    {
      id: "seo-vs-google-ads",
      question: "Care este diferența dintre SEO și Google Ads?",
      answer:
        "Google Ads aduce trafic plătit cât timp rulează campaniile. SEO construiește vizibilitate organică pe termen lung. Cele două pot funcționa împreună: Google Ads oferă date rapide, iar SEO consolidează prezența organică.",
    },
    {
      id: "ce-este-ai-seo",
      question: "Ce este AI SEO?",
      answer:
        "AI SEO este optimizarea website-ului pentru motoare AI și sisteme care interpretează conținutul. Include claritate semantică, date structurate, llms.txt, FAQ, pagini explicite și o arhitectură internă ușor de înțeles.",
    },
    {
      id: "seo-tehnic",
      question: "SEO include și partea tehnică?",
      answer:
        "Da. SEO tehnic include indexare, sitemap, robots.txt, canonical, structured data, performanță, mobile usability, linkuri interne și corectarea erorilor care pot afecta crawlability.",
    },
    {
      id: "blog-important-seo",
      question: "Este blogul important pentru SEO?",
      answer:
        "Da, dacă este construit strategic. Blogul ajută la acoperirea unor întrebări, teme și căutări pe care paginile de servicii nu le pot acoperi complet. Totuși, articolele trebuie legate intern de servicii și studii de caz.",
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const canonical = absoluteUrl(path, content);
  const ogImage = absoluteUrl(content.seoSettings.global.defaultOgImage, content);

  return {
    metadataBase: new URL(getCanonicalBaseUrl(content)),
    title: "SEO | Digital Dot",
    description:
      "Servicii SEO și AI SEO pentru companii care au nevoie de vizibilitate organică, structură tehnică, conținut optimizat, internal linking, sitemap, schema și creștere pe termen lung.",
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: "SEO | Digital Dot",
      description:
        "SEO și AI SEO pentru branduri care vor vizibilitate organică, structură tehnică, conținut relevant, internal linking, schema, sitemap și optimizare pentru Google și AI search.",
      url: canonical,
      siteName: "Digital Dot",
      locale: "ro_RO",
      images: [
        {
          url: ogImage,
          alt: "SEO | Digital Dot",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "SEO | Digital Dot",
      description:
        "SEO și AI SEO pentru branduri care vor vizibilitate organică, structură tehnică, conținut relevant, internal linking, schema, sitemap și optimizare pentru Google și AI search.",
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

export default async function SeoServicePage() {
  const content = await getSiteContent();
  const canonical = absoluteUrl(path, content);
  const baseUrl = getCanonicalBaseUrl(content);
  const breadcrumbs = [
    { name: "Acasă", path: "/" },
    { name: "Servicii", path: "/#services" },
    { name: "SEO", path },
  ];
  const schemas = [
    buildOrganizationSchema(content),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: "SEO | Digital Dot",
      description:
        "Servicii SEO și AI SEO pentru companii care au nevoie de vizibilitate organică, structură tehnică, conținut optimizat, internal linking, sitemap, schema și creștere pe termen lung.",
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
      name: "SEO",
      description:
        "Servicii SEO și AI SEO pentru companii care au nevoie de vizibilitate organică, optimizare tehnică, content strategy, internal linking, sitemap, schema JSON-LD, llms.txt și structură clară pentru Google și motoare AI.",
      url: canonical,
      serviceType: "SEO / Search Engine Optimization / AI SEO / Technical SEO",
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
          { label: "SEO", href: path },
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
                  SEO pentru companii care vor vizibilitate organică, nu doar trafic întâmplător
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#dadada] sm:text-lg">
                  SEO nu înseamnă să repetăm aceleași cuvinte cheie până obosește pagina. Înseamnă structură tehnică, conținut relevant, linkuri interne, date structurate și o arhitectură clară pe care Google și motoarele AI o pot înțelege.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink href="/#contact">Hai să povestim</ButtonLink>
                  <ButtonLink href="/case-studies" variant="ghost">Vezi studiile de caz</ButtonLink>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[#aeb6bb]">
                  SEO construit pe structură, conținut, autoritate și claritate semantică, nu pe trucuri ieftine.
                </p>
              </div>
            </Container>
          </header>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/62 py-18 sm:py-24" aria-labelledby="problem-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="problem-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  De ce multe site-uri nu cresc organic
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Multe site-uri au pagini, servicii, blog și texte, dar nu au o structură SEO clară. Google vede conținut fragmentat, pagini slab legate între ele, titluri duplicate, sitemap incomplet, lipsă de schema, conținut generic și semnale insuficiente de autoritate.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Problema nu este doar lipsa articolelor. Problema este lipsa unui sistem SEO: pagini comerciale clare, conținut util, linkuri interne, structură tehnică și o logică semantică între servicii, studii de caz, blog și regiuni.
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {problems.map((item) => (
                    <li key={item} className="rounded-2xl border border-[#1f2a2d] bg-[#0b0c10]/72 px-4 py-3 text-sm text-[#dadada]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-base leading-relaxed text-[#d8c7a3]">
                  SEO eficient nu înseamnă doar optimizare. Înseamnă ordine, relevanță și autoritate construită în timp.
                </p>
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="meaning-title">
            <Container className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="brand-rule mb-5" />
                <h2 id="meaning-title" className="text-3xl font-semibold text-white sm:text-4xl">
                  SEO este infrastructura organică a website-ului
                </h2>
              </div>
              <div className="space-y-5 lg:col-span-8">
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Pentru Digital Dot, SEO nu este o listă de bifat la finalul proiectului. Este infrastructura prin care website-ul devine mai clar pentru motoarele de căutare, pentru utilizatori și pentru sistemele AI care interpretează conținutul.
                </p>
                <p className="text-base leading-relaxed text-[#c6c6c6]">
                  Un website optimizat SEO trebuie să răspundă limpede la câteva întrebări: cine este brandul, ce servicii oferă, pentru cine sunt aceste servicii, ce rezultate există, ce pagini sunt importante și cum sunt legate între ele.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {seoElements.map((item) => (
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
                Pentru cine este potrivit serviciul SEO
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Serviciul este potrivit pentru companii care vor să construiască vizibilitate organică pe termen lung, nu doar trafic temporar din campanii plătite.
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
                  Ce include serviciul SEO
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[#c6c6c6]">
                  Serviciul SEO Digital Dot este construit în jurul structurii, conținutului și autorității. Nu este o intervenție superficială pe câteva titluri, ci o optimizare a felului în care website-ul comunică cu utilizatorii și cu motoarele de căutare.
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
                  Scopul este ca website-ul să fie mai clar, mai indexabil și mai relevant pentru căutările care contează.
                </p>
              </div>
            </Container>
          </section>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="technical-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="technical-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                SEO tehnic: fundația pe care se construiește vizibilitatea
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Dacă website-ul are probleme tehnice, conținutul bun poate fi greu de descoperit, greu de indexat sau prost interpretat. De aceea, SEO tehnic este primul strat al optimizării.
              </p>
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {technicalItems.map((item) => (
                  <div key={item} className="rounded-2xl border border-[#1f2a2d] bg-[#0b0c10]/72 px-4 py-3 text-sm text-[#dadada]">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#d8c7a3]">
                SEO tehnic nu este partea spectaculoasă, evident. Tocmai de aceea contează. Nimeni nu aplaudă fundația, dar toată casa stă pe ea.
              </p>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="ai-seo-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="ai-seo-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                AI SEO: optimizare pentru motoarele care interpretează, nu doar indexează
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Căutarea se schimbă. Oamenii nu mai folosesc doar Google clasic, ci și motoare AI, asistenți conversaționali și sisteme care extrag răspunsuri din surse clare. Pentru aceste sisteme, website-ul trebuie să fie ușor de înțeles ca entitate.
              </p>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                AI SEO înseamnă să clarificăm identitatea brandului, serviciile, paginile importante, studiile de caz, zonele acoperite și relația dintre toate acestea.
              </p>
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {aiSeoItems.map((item) => (
                  <div key={item} className="rounded-2xl border border-[#276864]/25 bg-[#101418] px-4 py-3 text-sm text-[#dadada]">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#d8c7a3]">
                AI SEO nu înlocuiește SEO clasic. Îl completează. Iar un site neclar pentru Google va fi și mai neclar pentru AI, pentru că nici algoritmii nu au răbdare infinită cu ambiguitatea umană.
              </p>
            </Container>
          </section>

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="process-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="process-title" className="text-3xl font-semibold text-white sm:text-4xl">
                Cum construim optimizarea SEO
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
                SEO funcționează mai bine când este conectat cu strategia și website-ul
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                SEO nu funcționează izolat. Are nevoie de structură, conținut, website bun, strategie și dovezi reale.
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

          <section className="border-y border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="proof-title">
            <Container>
              <span className="brand-rule mb-5" />
              <h2 id="proof-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                SEO are nevoie de dovezi, nu doar de afirmații
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                Studiile de caz sunt importante pentru SEO pentru că oferă conținut real, rezultate măsurabile, servicii implicate și contexte specifice de industrie. Ele ajută website-ul să demonstreze expertiză, nu doar să o declare.
              </p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {relevantContent.map((item) => (
                  <Link key={item.href} href={item.href} className="brand-card block p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c7a3]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c10]">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{item.description}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-8">
                <ButtonLink href="/case-studies" variant="ghost">Vezi toate studiile de caz</ButtonLink>
              </div>

              <h3 className="mt-14 max-w-3xl text-2xl font-semibold text-white">
                Pagini regionale conectate cu SEO local
              </h3>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {regionalLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-2xl border border-[#1f2a2d] bg-[#0b0c10]/70 p-5 transition-colors hover:border-[#276864] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c7a3]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c10]">
                    <h4 className="text-base font-semibold text-white">{item.title}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-[#c6c6c6]">{item.description}</p>
                  </Link>
                ))}
              </div>
            </Container>
          </section>

          <section className="py-18 sm:py-24" aria-labelledby="seo-faq-title">
            <Container>
              <div className="mx-auto max-w-4xl">
                <span className="brand-rule mb-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8c7a3]">
                  FAQ
                </p>
                <h2 id="seo-faq-title" className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Întrebări frecvente despre SEO
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

          <footer className="border-t border-[#1f2a2d] bg-[#101418]/64 py-18 sm:py-24" aria-labelledby="seo-cta-title">
            <Container>
              <div className="brand-panel p-8 sm:p-10">
                <span className="brand-rule mb-5" />
                <h2 id="seo-cta-title" className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
                  Ai nevoie de SEO construit ca infrastructură, nu ca listă de bifat
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c6c6c6]">
                  Dacă website-ul tău există, dar nu este clar pentru Google, AI search sau utilizatori, problema nu este doar traficul. Problema este structura. Putem construi o direcție SEO clară, tehnică și aplicabilă.
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
