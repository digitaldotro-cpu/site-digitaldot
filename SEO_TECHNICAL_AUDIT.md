# SEO Technical Audit - Digital Dot

Data auditului: 2026-06-03  
Mediu verificat: build production local, `next start` pe `localhost:3001`

## 1. Rute verificate

Au fost verificate 31 de rute critice și 68 de pagini HTML rezultate din sitemap și din rutele importante.

Rute principale verificate:
- `/`
- `/servicii/strategie-marketing`
- `/servicii/social-media-management`
- `/servicii/productie-foto-video`
- `/servicii/google-ads`
- `/servicii/meta-ads`
- `/servicii/website-creation`
- `/servicii/seo`
- `/case-studies`
- toate cele 6 pagini individuale de studii de caz
- `/agentie-marketing` și cele 8 pagini regionale
- `/blog` și toate articolele publicate
- `/politica-de-confidentialitate`, `/politica-confidentialitate`
- `/termeni-si-conditii`
- `/robots.txt`, `/sitemap.xml`, `/llms.txt`

Rezultat:
- Nu există 404 pe paginile importante.
- Ruta veche `/servicii/strategie-de-marketing` redirecționează către `/servicii/strategie-marketing`.
- Aliasurile `/servicii/social-media-management`, `/servicii/productie-foto-video`, `/servicii/google-ads`, `/servicii/meta-ads`, `/servicii/website-creation` și `/servicii/seo` funcționează prin redirect către paginile canonice existente.

## 2. Linkuri rupte găsite și reparate

Au fost verificate 54 de linkuri interne crawlable descoperite în paginile auditate.

Rezultat:
- Linkuri interne rupte: 0.
- Nu au fost găsite linkuri către `localhost`.
- Nu au fost găsite linkuri active către slug-ul greșit `/servicii/strategie-de-marketing`, cu excepția rutei de redirect.

Corecturi aplicate:
- `llms.txt` a fost actualizat pentru a include pagina de Strategie de Marketing, contactul și serviciile principale.
- Metadata pentru pagini editoriale de categorie/tag/autor a fost diferențiată pentru a elimina duplicatele și descrierile prea scurte/lungi.
- Meta description pentru `/servicii/strategie-marketing` a fost ajustată la o lungime mai potrivită.

## 3. Canonicaluri verificate

Rezultat:
- Canonical warnings: 0.
- Nu există canonical către `localhost`.
- Nu există canonical către domeniu greșit.
- Nu există canonical către `/servicii/strategie-de-marketing`.
- `/servicii/strategie-marketing` are canonical corect: `https://digitaldot.ro/servicii/strategie-marketing`.

## 4. Sitemap verificat

Sitemap verificat: `/sitemap.xml`

Rezultat:
- Sitemap warnings: 0.
- Include homepage, Strategie de Marketing, studii de caz, pagini regionale, blog, articole și pagini legale publice.
- Nu include URL-uri `localhost`.
- Nu include URL-uri `http://digitaldot.ro`.
- Nu include slug-ul vechi `/servicii/strategie-de-marketing`.

Notă SEO:
Aliasurile de servicii care redirecționează nu au fost păstrate ca URL-uri indexabile în sitemap, pentru a evita URL-uri duplicate sau redirecturi în sitemap. Sitemap-ul păstrează URL-urile canonice/indexabile.

## 5. Robots verificat

Robots verificat: `/robots.txt`

Rezultat:
- Include `Sitemap: https://digitaldot.ro/sitemap.xml`.
- Nu blochează `/`, `/servicii`, `/case-studies`, `/agentie-marketing` sau `/blog`.
- Blochează doar zonele private/admin relevante: `/panou-control`, `/api/admin`.

## 6. llms.txt verificat

Fișier verificat: `/llms.txt`

Rezultat:
- Include Digital Dot ca agenție de marketing.
- Include serviciile principale: Strategie de Marketing, Social Media Management, Producție Foto/Video, Google Ads, Meta Ads, Website Creation, SEO.
- Include studiile de caz reale: Optik Tataru, Lunna, Taco Loco, Cosmetică Hotelieră, Lumea Perdelelor, ARTIO Medica.
- Include pagini regionale, blog, case studies și contact.

## 7. Schema JSON-LD verificată

Au fost parsate scripturile JSON-LD din toate paginile auditate.

Rezultat:
- JSON-LD errors: 0.
- Homepage include schema globală Organization / LocalBusiness / WebSite.
- Pagina `/servicii/strategie-marketing` include WebPage, Service, BreadcrumbList și FAQPage.
- Paginile de studii de caz includ schema de pagină/articol și breadcrumb.
- Paginile regionale includ schema relevantă pentru local/regional.
- Blogul și articolele includ schema editorială.

## 8. Pixel Metricool verificat

Script verificat:
- `https://tracker.metricool.com/resources/be.js`

Hash verificat:
- `4d1e715fbcbcd9f21fc45fb38296a21d`

Rezultat:
- Metricool este prezent pe 68/68 pagini HTML verificate.
- Nu a fost detectată dublare a scriptului în paginile auditate.
- Hash-ul este prezent o singură dată pe pagină.

Observație:
Pixelul este încărcat global din layout. Nu a fost identificată o setare de dashboard pentru activare/dezactivare în auditul codului curent.

## 9. Probleme de performanță observate

Verificare production local, răspuns HTML:
- `/` - 200, aproximativ 159ms
- `/servicii/strategie-marketing` - 200, aproximativ 47ms
- `/case-studies` - 200, aproximativ 38ms
- `/case-studies/optik-tataru` - 200, aproximativ 33ms
- `/blog` - 200, aproximativ 114ms
- `/agentie-marketing/suceava` - 200, aproximativ 33ms

Nu au fost detectate probleme tehnice de răspuns server pe paginile testate.

Limitare:
Core Web Vitals reale precum LCP, CLS și INP trebuie confirmate în Chrome DevTools / Lighthouse / Search Console pe domeniul live, deoarece auditul local nu simulează date reale de utilizator.

## 10. Recomandări următoare

- Rulează Lighthouse pe domeniul live pentru homepage, `/servicii/strategie-marketing`, `/case-studies` și o pagină individuală de studiu de caz.
- Verifică Search Console după deploy pentru indexarea noilor pagini și pentru eventuale canonical-uri raportate de Google.
- Dacă se dorește control din dashboard pentru Metricool, adaugă o setare explicită de activare/dezactivare și hash configurabil.
- Păstrează sitemap-ul doar cu URL-uri canonice/indexabile, nu cu aliasuri care redirecționează.
- Monitorizează în Search Console dacă Google tratează corect aliasurile `/servicii/*` ca redirecturi către paginile canonice.

## Rezumat final

- Pagini importante verificate: 68.
- Rute critice verificate: 31.
- Linkuri interne verificate: 54.
- Linkuri rupte: 0.
- Erori JSON-LD: 0.
- Probleme canonical: 0.
- Probleme H1: 0.
- Probleme sitemap: 0.
- Probleme robots: 0.
- Probleme llms.txt: 0.
- Metricool: prezent și neduplicat pe toate paginile HTML verificate.
- Build: rulează fără erori.
