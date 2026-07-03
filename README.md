# Elytra Shield — Production Website

**Protect What Protects Your Home.** — Advanced roof preservation, the smarter alternative to premature roof replacement.

Next.js (App Router) + TypeScript + Tailwind CSS, Vercel-ready. Brand: deep navy + lime-green, Montserrat display. Tailwind preflight is **disabled** so utilities never alter the design system in `styles/globals.css`.

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in as needed (works with zero config too)
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

## Structure
```
app/         App Router: layout, homepage, /api routes, sitemap & robots
components/  Homepage section components + components/sales (rep CRM) + components/forms
lib/         leads, validation, email, rateLimit, analytics, seo (central brand config)
content/     cities, faq, articles, services, trustPoints, formOptions
public/      assets (logo SVGs), images, site.js, static authority pages
styles/      globals.css (design system), dashboard.css, sales.css
types/       shared TypeScript types
docs/        ARCHITECTURE, AUTH, SUPABASE, SEO, ANALYTICS, SALES, GO-LIVE-CHECKLIST
```

## Brand configuration
All brand values are centralized in **`lib/seo.ts`** (`BUSINESS`): name, URL, phone, email, area served, tagline. Colors and type live in **`styles/globals.css`** (`:root` variables). Logo assets: `public/assets/elytrashield-mark.svg` and `elytrashield-lockup.svg`.

> **Before go-live:** confirm the domain (`elytrashieldroofing.com` — note `elytrashield.com` is held by an unrelated brand), the business phone, and the legal entity. Set `NEXT_PUBLIC_SITE_URL` in Vercel.

## Sales platform & auth
The isolated sales platform (sessions, leads, passports, photos, dashboards) persists to Supabase and supports rep authentication with RBAC (REP / MANAGER / ADMIN). It falls back to demo mode without Supabase; the public marketing site does not depend on it. Setup: **docs/SUPABASE.md** and **docs/AUTH.md**.

## Setup order (full platform)
1. `npm install`
2. Supabase SQL (in order): `schema.sql` → `auth.sql` → `crm.sql` → `org.sql` → `membership.sql`
3. Create the `roof-passports` storage bucket
4. Set env vars (see `.env.example`)
5. Create the first ADMIN (Supabase Auth user + a `reps` row with role ADMIN)
6. `npm run build && npm start`

See **DEPLOYMENT.md** and **docs/GO-LIVE-CHECKLIST.md** for the complete launch process.
