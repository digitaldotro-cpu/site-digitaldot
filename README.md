# Digital Dot Website

Website premium, multi-page, construit cu Next.js App Router pentru agenția de marketing digital **Digital Dot**.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- React Hook Form + Zod + @hookform/resolvers
- MDX blog system (`gray-matter`, `next-mdx-remote`, `reading-time`)

## Funcționalități livrate

- Homepage de conversie cu servicii principale, servicii secundare, capabilități extinse și CTA-uri
- Pagini dedicate pentru:
  - Social Media Management
  - Producție Foto & Video
  - Strategie de marketing
- Portofoliu cu grid filtrabil și carduri reutilizabile
- Blog complet:
  - listing cu featured article
  - filtru pe categorii
  - carduri reutilizabile
  - pagini dinamice `/blog/[slug]` din MDX
  - tag-uri, categorie, reading time, related articles
- Contact page cu formular validat client + server
- SEO-ready metadata pe pagini, plus `sitemap.xml` și `robots.txt`
- Panou CMS complet la `/panou-control`:
  - editor pagini cu secțiuni și elemente
  - media library cu upload/replace/delete
  - blog manager (create/edit/publish/unpublish)
  - autosave + publish + undo/redo
  - autentificare de sesiune admin

## Structură proiect

```txt
app/
  api/contact/route.ts
  blog/
    [slug]/page.tsx
    page.tsx
  contacteaza-ne/page.tsx
  portofoliu/page.tsx
  servicii/
    social-media-management/page.tsx
    productie-foto-video/page.tsx
    strategie-marketing/page.tsx
  layout.tsx
  page.tsx
  robots.ts
  sitemap.ts

components/
  blog/
  forms/
  layout/
  portfolio/
  sections/
  ui/

content/blog/
  *.mdx

data/
  blog-taxonomy.ts
  navigation.ts
  portfolio.ts
  services.ts

lib/
  blog.ts
  seo.ts
  utils.ts
  validation/contact.ts

public/images/
  blog/
  portfolio/
```

## Local Development

```bash
npm install
npm run dev
```

Deschide `http://localhost:3000`.

Pentru rulare pe portul 3001:

```bash
npm run dev -- -p 3001
```

## Validare

```bash
npm run lint
npm run test:storage
npm run check:security-env
npm run build
```

## Deployment Notes

- Fluxul versionat în acest repository rulează aplicația pe un server Node.js gestionat prin PM2.
- `DIGITALDOT_DATA_ROOT` este potrivit pentru acest server cu filesystem persistent. Pe platforme cu filesystem efemer, inclusiv deploy-uri serverless, conținutul și media trebuie mutate într-o bază de date/object storage sau într-un provider media extern.
- Variabile utile pentru producție:
  - `NEXT_PUBLIC_SITE_URL` (opțional, dacă vrei URL configurabil)
  - `ADMIN_DASHBOARD_USER` (utilizatorul pentru autentificarea în CMS, opțional)
  - `ADMIN_DASHBOARD_KEY` (obligatoriu, parolă CMS)
  - `ADMIN_SESSION_SECRET` (obligatoriu, semnare cookie sesiune admin)
  - `ADMIN_LOGIN_RATE_LIMIT_MAX` (opțional, default: `10`)
  - `ADMIN_LOGIN_RATE_LIMIT_WINDOW_SEC` (opțional, default: `300`)
  - `ADMIN_UPLOAD_MAX_BYTES` (opțional, default: `5242880` = 5MB)
  - `CLOUDINARY_CLOUD_NAME` (opțional, activează upload media Cloudinary)
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `CLOUDINARY_FOLDER` (opțional, default: `digital-dot`)
- Formularul de contact trimite email prin Brevo API (`POST /api/contact`):
  - `BREVO_API_KEY`
  - `CONTACT_TO_EMAIL` (default: `digitaldot.ro@gmail.com`)
  - `CONTACT_FROM_EMAIL` (default: `digitaldot.ro@gmail.com`)
  - `CONTACT_RATE_LIMIT_MAX` (opțional, default: `8`)
  - `CONTACT_RATE_LIMIT_WINDOW_SEC` (opțional, default: `300`)
- Blog-ul se extinde prin adăugare de fișiere `.mdx` în `content/blog/`.

## Panou De Control

- URL: `/panou-control`
- API CMS salvează în `content/site-content.json`
- Date de logare:
  - utilizator: valoarea din `ADMIN_DASHBOARD_USER` (dacă variabila nu este setată, se validează doar parola)
  - parolă: valoarea din `ADMIN_DASHBOARD_KEY`
- `ADMIN_DASHBOARD_KEY` și `ADMIN_SESSION_SECRET` sunt obligatorii pentru autentificare
- Cookie-ul de sesiune admin este `httpOnly`, `sameSite=lax`, TTL implicit `8h` (`getSessionMaxAge`)
- Media upload:
  - upload local în `public/uploads/*`
  - sunt acceptate doar imagini (`png`, `jpg`, `jpeg`, `webp`, `svg`)
  - limita implicită per fișier este 5MB (`ADMIN_UPLOAD_MAX_BYTES`)

### Persistența datelor dashboardului

- Fără configurare suplimentară, aplicația păstrează compatibilitatea cu structura actuală:
  - conținut: `content/site-content.json` și `content/cms-data.json`
  - loguri: `content/logs/*`
  - uploaduri: `public/uploads/*`
- În producție, setează `DIGITALDOT_DATA_ROOT` la un director absolut, aflat în afara checkout-ului Git. Aplicația va folosi:
  - `<DIGITALDOT_DATA_ROOT>/content/site-content.json`
  - `<DIGITALDOT_DATA_ROOT>/content/cms-data.json`
  - `<DIGITALDOT_DATA_ROOT>/content/logs/*`
  - `<DIGITALDOT_DATA_ROOT>/public/uploads/*`
- Fișierele din `uploads/*` sunt servite în continuare la URL-urile existente `/uploads/*`.
- Salvarea fișierelor JSON folosește înlocuire atomică, pentru a nu lăsa conținut trunchiat dacă o scriere este întreruptă.
- Directorul persistent trebuie creat și populat din datele curente înainte de activarea variabilei. Dacă fișierele de conținut lipsesc, aplicația se oprește cu eroare în loc să pornească pe conținut gol.
- `DIGITALDOT_DATA_ROOT` trebuie să aibă aceeași valoare atât în mediul în care rulează build-ul, cât și în procesul PM2 care servește site-ul.
- `content/logs/*` conține date din formularele de contact și trebuie protejat prin permisiuni restrictive, backup securizat și o politică de retenție.
- Nu activa `DIGITALDOT_DATA_ROOT` în producție înainte de backup, copierea datelor și verificarea permisiunilor utilizatorului care rulează aplicația.
- Procedura completă, inclusiv oprirea scrierilor și rollbackul, este în [`docs/DASHBOARD_STORAGE_MIGRATION.md`](docs/DASHBOARD_STORAGE_MIGRATION.md).

## Licență

Proiect intern Digital Dot.
