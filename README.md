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
npm run build
```

## Deployment Notes

- Recomandat: Vercel (deploy direct din repository)
- Variabile utile pentru producție:
  - `NEXT_PUBLIC_SITE_URL` (opțional, dacă vrei URL configurabil)
  - `ADMIN_DASHBOARD_KEY` (parola pentru autentificarea în CMS)
  - `ADMIN_SESSION_SECRET` (recomandat, semnare cookie sesiune admin)
  - `CLOUDINARY_CLOUD_NAME` (opțional, activează upload media Cloudinary)
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `CLOUDINARY_FOLDER` (opțional, default: `digital-dot`)
- Formularul de contact trimite email prin SMTP (`POST /api/contact`):
  - `SMTP_HOST` (default recomandat: `smtp.gmail.com`)
  - `SMTP_PORT` (default recomandat: `465`)
  - `SMTP_SECURE` (`true` pentru 465)
  - `SMTP_USER` (`digitaldot.ro@gmail.com`)
  - `SMTP_PASS` (Gmail App Password, nu parola contului)
  - `CONTACT_TO_EMAIL` (default: `digitaldot.ro@gmail.com`)
  - `CONTACT_FROM_EMAIL` (default: `SMTP_USER`)
- Blog-ul se extinde prin adăugare de fișiere `.mdx` în `content/blog/`.

## Panou De Control

- URL: `/panou-control`
- API CMS salvează în `content/cms-data.json`
- Dacă `ADMIN_DASHBOARD_KEY` este setat, dashboard-ul cere autentificare
- Media upload:
  - cu Cloudinary configurat: upload server-side în Cloudinary
  - fără Cloudinary: fallback local (Data URL în JSON) pentru dezvoltare

## Licență

Proiect intern Digital Dot.
