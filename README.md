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
- Panou de control conținut la `/panou-control` (editează și salvează `content/site-content.json`)

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

## Validare

```bash
npm run lint
npm run build
```

## Deployment Notes

- Recomandat: Vercel (deploy direct din repository)
- Variabile utile pentru producție:
  - `NEXT_PUBLIC_SITE_URL` (opțional, dacă vrei URL configurabil)
  - `ADMIN_DASHBOARD_KEY` (opțional, protejează API-ul panoului de control)
- Formularul de contact este pregătit pentru integrare cu:
  - email provider (Resend, SendGrid etc.)
  - CRM/webhook (HubSpot, Pipedrive, Make, Zapier)
- Blog-ul se extinde prin adăugare de fișiere `.mdx` în `content/blog/`.

## Panou De Control

- URL: `/panou-control`
- Editarea din UI salvează direct în `content/site-content.json`
- Dacă setezi `ADMIN_DASHBOARD_KEY`, introdu cheia în panou pentru salvare/reîncărcare

## Licență

Proiect intern Digital Dot.
