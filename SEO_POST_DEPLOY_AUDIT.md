# SEO Post-Deploy Audit - Digital Dot

Data auditului: 2026-06-08  
Mediu verificat: productie live, `https://digitaldot.ro`  
Metoda: requesturi HTTP live, parsare HTML server-rendered, sitemap/robots/llms live, verificare sursa locala pentru `sitemap.ts`, `robots.ts`, `llms.txt` si Metricool.

## 1. Lista paginilor verificate

Pagini principale verificate:
- Homepage: `https://digitaldot.ro/`
- Servicii: `/servicii/strategie-marketing`, `/servicii/social-media-management`, `/servicii/productie-foto-video`, `/servicii/google-ads`, `/servicii/meta-ads`, `/servicii/seo`, `/servicii/website-creation`
- Studii de caz: `/case-studies` si cele 6 studii individuale
- Pagini regionale: `/agentie-marketing` si cele 8 pagini regionale active
- Blog: `/blog`
- Fisiere SEO: `/sitemap.xml`, `/robots.txt`, `/llms.txt`
- URL-uri speciale: `/servicii/strategie-de-marketing`, `/seo`, `/website-creation`, `/google-meta-ads`, `/social-media-management`, `/productie-video`, `/contacteaza-ne`, `/portofoliu`

Sitemap-ul live contine 69 de URL-uri, inclusiv articole de blog, categorii, taguri si autori.

## 2. Status indexabilitate

Toate cele 25 de pagini importante cerute in prompt raspund cu `200`.

Status comun observat:
- Nu sunt blocate in `robots.txt`.
- Nu au `noindex`.
- Au canonical catre propria adresa canonica.
- Sunt incluse in `sitemap.xml`.
- Au linkuri interne catre ele din navigatie, footer, homepage, servicii, blog sau pagini regionale.
- Au cate un singur H1.
- Metricool este prezent o singura data in HTML.

Observatii:
- Unele pagini nu afiseaza meta robots explicit, dar sunt indexabile implicit. Homepage, serviciile si blogul au `index, follow`.
- Homepage are canonical `https://digitaldot.ro`, fara slash final; sitemap-ul foloseste `https://digitaldot.ro/`. Este o diferenta minora de normalizare, nu o problema critica.

## 3. Probleme gasite

Probleme critice:
- `/servicii/strategie-de-marketing` returneaza `301`, dar redirectioneaza catre `https://localhost:3000/servicii/strategie-marketing`. Acest redirect trebuie corectat urgent catre `https://digitaldot.ro/servicii/strategie-marketing`.

Probleme medii:
- Exista aliasuri vechi indexabile cu status `200` si canonical propriu, desi sitemap-ul foloseste noile URL-uri canonice de servicii:
  - `https://digitaldot.ro/seo`
  - `https://digitaldot.ro/website-creation`
  - `https://digitaldot.ro/google-meta-ads`
  - `https://digitaldot.ro/social-media-management`
  - `https://digitaldot.ro/productie-video`
- Footerul si unele pagini regionale inca trimit catre aceste aliasuri vechi in loc de `/servicii/...`.
- Pagina hub regionala `/agentie-marketing` are doar `BreadcrumbList` specific paginii in al doilea JSON-LD; promptul cere si `LocalBusiness / ProfessionalService` si `Service` pentru pagini regionale. Schema globala Organization/LocalBusiness exista, dar hub-ul regional ar fi mai complet cu schema regionala dedicata.

Probleme minore:
- H1 duplicat in sitemap pe cateva pagini editoriale de taxonomie:
  - `Strategie`: `/blog/categorie/strategie` si `/blog/tag/strategie`
  - `Branding`: `/blog/categorie/branding` si `/blog/tag/branding`
  - `Productie Video`: `/blog/categorie/productie-video` si `/blog/tag/productie-video`
- Linkuri interne de navigatie folosesc frecvent hash-uri catre homepage (`/#services`, `/#case-studies`, `/#contact`). Nu sunt linkuri moarte, dar pentru pagini interne se pot prefera URL-uri canonice sau ancore descriptive cand contextul SEO cere claritate.
- Exista imagini PNG/JPG locale mari, intre aproximativ 1.1 MB si 1.8 MB, in special portrete si imagini de referinta. Daca sunt servite in above-the-fold pe mobil, pot afecta LCP.

## 4. Sitemap.xml

Fisier verificat: `https://digitaldot.ro/sitemap.xml`

Rezultat:
- Status `200`, `application/xml`.
- Include homepage, toate serviciile canonice, toate studiile de caz, hub regional, pagini regionale, blog si articolele publicate.
- Include si pagini legale, autori, categorii si taguri de blog.
- Nu include URL-uri 404.
- Nu include URL-uri redirectionate.
- Nu include URL-uri cu `noindex`.
- Nu include duplicate.
- Nu include `/servicii/strategie-de-marketing`.
- Toate URL-urile incep cu `https://digitaldot.ro/`.

URL-uri lipsa din sitemap:
- Niciun URL important cerut in prompt.

URL-uri care trebuie scoase din sitemap:
- Niciun URL problematic detectat.

## 5. Robots.txt

Fisier verificat: `https://digitaldot.ro/robots.txt`

Rezultat:
- Status `200`.
- Include `Sitemap: https://digitaldot.ro/sitemap.xml`.
- Permite `/`.
- Nu blocheaza `/servicii/`, `/case-studies/`, `/agentie-marketing/` sau `/blog/`.
- Blocheaza zone tehnice/private: `/admin/`, `/dashboard/`, `/preview/`, `/api/`, `/private/`, `/panou-control/`.
- Include reguli explicite pentru crawleri AI relevanti: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended si Googlebot.

## 6. llms.txt

Fisier verificat: `https://digitaldot.ro/llms.txt`

Rezultat:
- Status `200`.
- Include descriere Digital Dot.
- Include serviciile principale si linkurile canonice catre paginile de servicii.
- Include studiile de caz si linkurile lor.
- Include pagini regionale, blog si contact.
- Include link catre `https://digitaldot.ro/llms-full.txt`.
- Nu am identificat promisiuni false sau rezultate inventate in afara studiilor de caz publicate.

## 7. Meta title si meta description

Rezultat:
- Paginile importante au title unic si meta description unica.
- Nu exista titluri generice de tip `Home`, `Services` sau `Page`.
- Serviciile au title specific.
- Studiile de caz au title specific cu numele clientului.
- Paginile regionale includ orasul sau judetul relevant.
- Pe toate cele 69 de URL-uri din sitemap nu au fost gasite duplicate de title sau meta description.

URL-uri cu title/meta duplicate:
- Niciunul detectat.

## 8. Heading structure

Rezultat pentru paginile importante:
- Fiecare pagina are un singur H1.
- H1-urile sunt relevante si specifice paginii.
- H2-urile exista si sunt organizate logic pe servicii, studii de caz, regionale si blog.

URL-uri cu H1 lipsa sau multiplu:
- Niciunul detectat in sitemap.

URL-uri cu H1 duplicat:
- Doar taxonomii blog, cu risc minor: `/blog/categorie/strategie` vs `/blog/tag/strategie`, `/blog/categorie/branding` vs `/blog/tag/branding`, `/blog/categorie/productie-video` vs `/blog/tag/productie-video`.

## 9. Internal linking

Rezultat:
- Homepage trimite catre servicii, studii de caz si contact.
- Serviciile trimit catre studii de caz relevante.
- Studiile de caz trimit catre servicii relevante si contact.
- Paginile regionale trimit catre servicii principale, blog, case studies si alte regiuni.
- Blogul trimite catre articole si servicii.
- Footerul include pagini importante.
- Nu au fost gasite linkuri interne rupte in paginile importante verificate.

Problema de coerenta:
- Mai multe linkuri interne trimit catre aliasuri vechi 200 (`/seo`, `/website-creation`, `/google-meta-ads`, `/social-media-management`, `/productie-video`) in loc de URL-urile canonice din sitemap (`/servicii/...`).

## 10. Structured data / Schema JSON-LD

Rezultat:
- JSON-LD parseaza valid pe paginile importante.
- Homepage include `Organization`, `LocalBusiness`, `WebSite`, `WebPage`, `ItemList`.
- Serviciile includ `Service`, `BreadcrumbList`, `FAQPage` si schema de pagina.
- Studiile de caz includ `Article`/`CaseStudy`, `Service` si `BreadcrumbList`.
- Blogul include `CollectionPage`, `BreadcrumbList`, `FAQPage`.
- Paginile regionale individuale includ `LocalBusiness`, mai multe `Service`, `FAQPage`, `BreadcrumbList`.

Probleme schema JSON-LD:
- Hub-ul `/agentie-marketing` are schema specifica de pagina doar ca `BreadcrumbList`; recomand adaugare `ProfessionalService`/`LocalBusiness` si `Service` daca pagina ramane hub regional indexabil.

## 11. 404 si redirecturi

Rezultat:
- Nu au fost gasite 404 in sitemap.
- Nu au fost gasite 404 in linkurile interne crawlable din paginile importante.
- `sitemap.xml` nu include URL-uri redirectionate.

Problema critica:
- `/servicii/strategie-de-marketing` redirectioneaza catre `https://localhost:3000/servicii/strategie-marketing`, nu catre domeniul live.

Redirecturi observate, acceptabile ca intentie dar de revizuit:
- `/contacteaza-ne` returneaza `307` catre `/#contact`.
- `/portofoliu` returneaza `308` catre `/case-studies`.

## 12. Mobile si performance

Verificari tehnice facute:
- Homepage raspunde `200` si livreaza HTML server-rendered.
- Fonturile sunt preloadate ca WOFF2.
- Metricool este incarcat cu `next/script` dupa interactiune, deci nu blocheaza randarea initiala.
- Nu am gasit `transition-all` global sau `will-change` global pe paginile publice.
- `backdrop-blur` exista punctual in componente, nu global.

Riscuri:
- Mai multe imagini locale au peste 1 MB. Recomand conversie WebP/AVIF sau verificare `next/image` pentru imaginile folosite pe mobil.
- Headerul si butoanele flotante trebuie confirmate vizual in Chrome/Lighthouse pe viewport mobil; auditul curent nu a rulat browser automat cu screenshot.
- Core Web Vitals reale trebuie confirmate in PageSpeed Insights/Search Console.

## 13. Tracking Metricool

Script verificat:
- `https://tracker.metricool.com/resources/be.js`

Hash verificat:
- `4d1e715fbcbcd9f21fc45fb38296a21d`

Rezultat:
- Scriptul Metricool este prezent o singura data pe fiecare pagina importanta verificata.
- `be.js` raspunde `200`.
- Hash-ul este prezent in `app/layout.tsx`.
- Scriptul este incarcat global prin `next/script`, cu `strategy="afterInteractive"`.

Limitare:
- Nu a fost rulata o sesiune browser automata pentru Console/Network. Verificarea confirma prezenta scriptului in HTML si disponibilitatea fisierului remote.

## 14. Recomandari de remediere

Prioritate critica:
- Corecteaza redirectul `/servicii/strategie-de-marketing` ca sa trimita 301 catre `https://digitaldot.ro/servicii/strategie-marketing`, nu catre `localhost`.

Prioritate medie:
- Decide daca aliasurile vechi de servicii trebuie pastrate indexabile. Recomandarea SEO este sa fie 301 catre rutele canonice:
  - `/seo` -> `/servicii/seo`
  - `/website-creation` -> `/servicii/website-creation`
  - `/social-media-management` -> `/servicii/social-media-management`
  - `/productie-video` -> `/servicii/productie-foto-video`
  - `/google-meta-ads` -> paginile canonice separate sau catre o pagina dedicata canonica, daca pagina combinata ramane intentionata.
- Actualizeaza linkurile din footer si paginile regionale catre URL-urile canonice `/servicii/...`.
- Completeaza schema pentru `/agentie-marketing` cu tipurile regionale relevante.

Prioritate minora:
- Diferentiaza H1-urile pentru taxonomii blog categorie/tag.
- Optimizeaza imaginile mari folosite in zone vizibile pe mobil.
- Ruleaza Lighthouse pe homepage, un serviciu, un studiu de caz, o pagina regionala si blog.

## 15. Checklist final pentru Google Search Console

- Trimite `https://digitaldot.ro/sitemap.xml`.
- Inspecteaza manual:
  - `https://digitaldot.ro/`
  - `https://digitaldot.ro/servicii/strategie-marketing`
  - `https://digitaldot.ro/case-studies`
  - `https://digitaldot.ro/agentie-marketing/suceava`
  - `https://digitaldot.ro/blog`
- Verifica raportul Pages pentru `Indexed`, `Crawled - currently not indexed`, `Duplicate without user-selected canonical`.
- Verifica daca Google vede canonicalurile `/servicii/...`.
- Dupa corectarea redirectului critic, inspecteaza `/servicii/strategie-de-marketing` si confirma 301 catre domeniul live.
- Monitorizeaza Core Web Vitals mobile.
- Verifica Enhancements / Rich Results pentru schema FAQ, Breadcrumb, Article si Organization.

## 16. Rezumat final

Website-ul este in mare parte pregatit pentru indexare: paginile importante sunt 200, indexabile, canonice, incluse in sitemap, legate intern si au metadata/schema solide.

Blocajul major post-deploy este redirectul catre `localhost` pentru slugul vechi `/servicii/strategie-de-marketing`. Dupa corectarea lui si curatarea aliasurilor vechi 200, site-ul va fi mult mai coerent pentru Google Search Console, crawl Google si AI SEO.
