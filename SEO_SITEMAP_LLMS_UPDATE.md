# SEO Sitemap / Robots / LLMs Update

Data actualizării: 2026-06-03

## 1. URL-uri adăugate / confirmate în sitemap

Sitemap-ul este generat dinamic din `app/sitemap.ts` și include acum explicit rutele canonice importante:

- `https://digitaldot.ro/`
- `https://digitaldot.ro/servicii/strategie-marketing`
- `https://digitaldot.ro/servicii/social-media-management`
- `https://digitaldot.ro/servicii/productie-foto-video`
- `https://digitaldot.ro/servicii/google-ads`
- `https://digitaldot.ro/servicii/meta-ads`
- `https://digitaldot.ro/servicii/seo`
- `https://digitaldot.ro/servicii/website-creation`
- `https://digitaldot.ro/case-studies`
- toate studiile de caz active
- paginile regionale active
- `https://digitaldot.ro/blog`
- articolele de blog existente
- paginile publice legale existente

## 2. URL-uri eliminate din sitemap

Au fost eliminate din sursa sitemap-ului rutele legacy sau duplicate care intrau automat prin setările SEO vechi:

- `https://digitaldot.ro/social-media-management`
- `https://digitaldot.ro/google-meta-ads`
- `https://digitaldot.ro/productie-video`
- `https://digitaldot.ro/website-creation`
- `https://digitaldot.ro/seo`
- `https://digitaldot.ro/servicii/strategie-de-marketing`
- `https://digitaldot.ro/contacteaza-ne`

Nu se includ URL-uri cu hash, localhost, parametri, admin sau preview.

## 3. Modificări robots.txt

`app/robots.ts` permite indexarea paginilor publice și include sitemap-ul canonic:

- `Sitemap: https://digitaldot.ro/sitemap.xml`

Rutele publice importante nu sunt blocate:

- `/`
- `/servicii/`
- `/case-studies/`
- `/agentie-marketing/`
- `/blog/`

Zonele interne blocate:

- `/admin/`
- `/dashboard/`
- `/preview/`
- `/api/`
- `/private/`
- `/panou-control/`

## 4. Modificări llms.txt

`app/llms.txt/route.ts` generează acum un rezumat clar pentru motoare AI, cu:

- identitatea Digital Dot
- serviciile principale canonice
- studiile de caz reale
- paginile regionale
- blogul
- contactul prin homepage `#contact`
- link către `llms-full.txt`

## 5. Verificare slug Strategie de Marketing

Ruta corectă rămâne:

- `https://digitaldot.ro/servicii/strategie-marketing`

Ruta veche:

- `https://digitaldot.ro/servicii/strategie-de-marketing`

a fost schimbată din `permanentRedirect` Next.js în route handler cu redirect explicit `301` către ruta canonică.

## 6. Probleme găsite

- Sitemap-ul putea include rute legacy / duplicate din configurările SEO vechi.
- Ruta veche `/servicii/strategie-de-marketing` folosea redirect permanent Next.js `308`, nu `301`.
- `llms.txt` folosea conținut mai vechi care nu lista toate noile pagini canonice de servicii.
- `robots.txt` era funcțional, dar incomplet față de lista recomandată de rute interne.
- `/contacteaza-ne` este redirect temporar către `/#contact`, deci nu trebuie inclus în sitemap.

## 7. Probleme reparate

- Sitemap-ul este construit din rute canonice explicite pentru servicii, case studies, regiuni, blog, contact și legal.
- URL-urile legacy de servicii nu mai intră automat în sitemap.
- Redirectul vechi de strategie răspunde explicit cu `301`.
- `llms.txt` listează serviciile noi canonice și studiile de caz reale.
- `robots.txt` păstrează accesul pentru paginile publice importante și blochează zonele interne.
- `/contacteaza-ne` a fost exclus din sitemap deoarece contactul este secțiune pe homepage, nu pagină indexabilă separată.

## 8. Recomandări pentru următorul pas SEO

- Actualizarea linkurilor interne din blog care încă trimit spre rutele legacy, de exemplu `/seo`, `/website-creation`, `/google-meta-ads` sau `/social-media-management`.
- Actualizarea conținutului extins din `llms-full.txt` / sursa CMS pentru a prefera noile rute `/servicii/...`.
- Verificare post-deploy în Google Search Console pentru indexare, sitemap procesat și eventuale redirecturi vechi descoperite.
