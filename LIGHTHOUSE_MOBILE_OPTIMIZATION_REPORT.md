# Lighthouse Mobile Optimization Report - Digital Dot

Data optimizarii: 2026-06-08  
Mediu validare: production local, `next start`, `http://localhost:3000`  
Instrumente: Lighthouse 13.3.0 via Chrome headless mobile, requesturi HTTP locale, `npm run lint`, `npm run build`.

## 1. Paginile analizate

- Homepage: `https://digitaldot.ro/`
- Strategie de Marketing: `https://digitaldot.ro/servicii/strategie-marketing`
- Case Studies: `https://digitaldot.ro/case-studies`
- Studiu de caz Optik Tataru: `https://digitaldot.ro/case-studies/optik-tataru`
- Agentie Marketing Suceava: `https://digitaldot.ro/agentie-marketing/suceava`

## 2. Scoruri initiale PageSpeed

Rapoartele PageSpeed live au fost furnizate ca URL-uri, dar nu au putut fi extrase automat in mediu:
- UI-ul `pagespeed.web.dev` nu expune datele complet in browser text.
- API-ul PageSpeed Insights a raspuns cu `429 RESOURCE_EXHAUSTED`, quota zilnica 0 pentru proiectul public folosit de mediu.

Din acest motiv, scorurile initiale live nu sunt disponibile in raport. Validarea post-optimizare a fost facuta cu Lighthouse mobile local pe build production.

## 3. Probleme Lighthouse identificate

Probleme recurente confirmate local:
- `Reduce unused JavaScript` pe toate cele 5 pagini.
- Homepage are cel mai mare cost JS: aproximativ 82 KiB unused JS, TBT 270 ms.
- Homepage are LCP mai ridicat decat paginile interioare: 3.8 s local mobile.
- Paginile interioare au CLS stabil: `0`.
- Paginile interioare au TBT bun: 60-190 ms.

Riscuri identificate in cod:
- Componente publice statice marcate inutil cu `"use client"`.
- Metricool era incarcat `afterInteractive`, deci intra mai devreme in fereastra de hidratare.
- Navbarul calcula sectiuni active pe scroll pentru homepage si putea adauga lucru inutil pe mobil.
- Sectiuni mari below-the-fold de pe homepage erau randate normal, desi pot fi amanate de browser cu `content-visibility`.
- Imaginile de echipa sunt below-the-fold si trebuie livrate lazy/async.

## 4. Optimizari aplicate

JavaScript / TBT / INP:
- Metricool a fost pastrat, dar mutat pe `strategy="lazyOnload"` in `app/layout.tsx`.
- Navbarul nu mai porneste observarea sectiunilor active pe mobil; pastreaza comportamentul pe desktop.
- Listenerul de resize din navbar foloseste optiuni pasive.
- Au fost convertite in server components mai multe componente statice care aveau `"use client"` inutil:
  - `components/strategy/bento-deliverables.tsx`
  - `components/strategy/case-study-grid.tsx`
  - `components/strategy/problem-grid.tsx`
  - `components/strategy/process-timeline.tsx`
  - `components/social-media/deliverable-card.tsx`
  - `components/social-media/problem-card.tsx`
  - `components/social-media/result-card.tsx`
  - `components/photo-video/impact-case-card.tsx`
  - `components/photo-video/media-preview-card.tsx`
  - `components/photo-video/process-step-card.tsx`
  - `components/portfolio/case-highlight-grid.tsx`
  - `components/portfolio/social-proof-strip.tsx`
  - `components/portfolio/video-showcase.tsx`

LCP / rendering:
- S-a adaugat clasa CSS `content-visibility-auto` pentru sectiuni homepage below-the-fold: portofoliu/case studies, echipa, parteneri.
- Efectele orbitale decorative `.brand-orbit::before/after` sunt dezactivate pe mobil pentru a reduce paint work.
- Hover transform pe `.brand-card` este dezactivat pe mobil.

Imagini:
- Avatarurile de echipa folosesc explicit `loading="lazy"` si `decoding="async"`.
- Nu s-a schimbat hero-ul, deoarece pe mobil este text-first si nu se incarca imagine hero mare above-the-fold.

SEO / schema / tracking:
- Nu au fost modificate metadata, canonical, sitemap, robots.txt, llms.txt sau schema JSON-LD.
- Metricool ramane prezent global si neduplicat.

## 5. Scoruri post-optimizare locale

| Pagina | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Homepage | 82 | 100 | 96 | 100 | 2.0 s | 3.8 s | 270 ms | 0 | 2.3 s |
| Strategie Marketing | 91 | 100 | 100 | 100 | 1.4 s | 3.4 s | 80 ms | 0 | 1.4 s |
| Case Studies | 91 | 100 | 100 | 100 | 1.4 s | 3.4 s | 60 ms | 0 | 1.4 s |
| Optik Tataru | 90 | 100 | 100 | 100 | 1.4 s | 3.3 s | 190 ms | 0 | 1.4 s |
| Agentie Marketing Suceava | 91 | 100 | 100 | 100 | 1.4 s | 3.4 s | 60 ms | 0 | 1.4 s |

## 6. Probleme ramase

- Homepage ramane pagina cea mai grea, cu `Reduce unused JavaScript` estimat la 82 KiB.
- LCP local mobile ramane peste pragul ideal de 2.5 s pe toate paginile, desi CLS este stabil.
- Lighthouse local nu poate reproduce perfect PageSpeed live, deoarece hostingul, reteaua, cache-ul si throttlingul difera.
- Nu s-a rulat verificare browser vizuala cu screenshot in aceasta sesiune; validarea a fost HTTP + Lighthouse headless.

## 7. Recomandari pentru urmatorul ciclu

- Rulare PageSpeed live dupa deploy pentru cele 5 URL-uri si comparare cu linkurile initiale.
- Daca homepage ramane sub tinta, urmatoarea optimizare ar trebui sa izoleze `AppShell/Navbar` intr-un client island mai mic sau sa dezactiveze hide-on-scroll pe mobil.
- Analiza chunk-urilor Next dupa deploy pentru cele doua fisiere raportate ca unused JS.
- Conversie WebP/AVIF pentru imaginile mari din `public/branding/team` si `public/branding/references`, mai ales daca sunt afisate in homepage.
- Verificare Chrome DevTools pe mobil pentru first scroll jank si eventuale long tasks reale.

## 8. Impact estimat

- LCP: impact pozitiv moderat pe homepage prin reducerea paint/render pentru sectiuni below-the-fold; impact direct limitat pe paginile interioare, unde LCP este text/layout.
- CLS: stabil, validat `0` pe toate cele 5 rulari locale.
- INP/TBT: impact pozitiv prin mai putine client components, Metricool incarcat mai tarziu si mai putin scroll work pe mobil.
- JavaScript execution: impact pozitiv prin eliminarea unor boundaries client inutile si amanarea Metricool.

## 9. Verificare SEO

Validare locala dupa build:
- Cele 5 pagini raspund `200`.
- Canonicalurile raman neschimbate.
- Fiecare pagina are un singur H1.
- `sitemap.xml`, `robots.txt` si `llms.txt` raspund `200`.
- SEO Lighthouse local este `100` pe toate cele 5 pagini.

## 10. Verificare schema JSON-LD

Validare locala:
- Fiecare dintre cele 5 pagini are 2 scripturi JSON-LD.
- Toate scripturile JSON-LD parseaza valid.
- Nu au fost facute modificari in schema.

## 11. Verificare Metricool

- Scriptul Metricool ramane prezent o singura data in HTML pe cele 5 pagini.
- Hash-ul ramane `4d1e715fbcbcd9f21fc45fb38296a21d`.
- Incarcarea este acum mai tarzie, prin `next/script` cu `strategy="lazyOnload"`.
- Trackingul nu a fost eliminat si nu este duplicat.

## 12. Validare finala

Comenzi rulate:
- `npm run lint` - trecut.
- `npm run build` - trecut.
- `next start` - pornit local pe `http://localhost:3000`.
- Lighthouse mobile local pentru cele 5 pagini - rulat.
- Verificare HTTP/canonical/H1/JSON-LD/Metricool pentru cele 5 pagini - trecut.
- Verificare `sitemap.xml`, `robots.txt`, `llms.txt` - trecut.

Rezultat: optimizarile reduc JavaScript-ul public inutil, intarzie trackingul noncritic, pastreaza SEO si stabilizeaza CLS fara modificari de design, text, sluguri sau structura SEO.
