# Nano Frog \u2014 Production Website

Nanotechnology roof preservation \u2014 *The Alternative to Roof Replacement.*
Next.js (App Router) + TypeScript + Tailwind CSS, Vercel-ready.

> The approved marketing design is preserved **exactly**. The original homepage markup
> was organized into section components that render the identical HTML; the approved
> design system lives verbatim in `styles/globals.css`; the approved animations run from
> `public/site.js`. Tailwind preflight is **disabled** so utilities never alter the design.

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in as needed (works with zero config too)
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

## Structure
```
app/            App Router: layout, homepage, /api routes, sitemap & robots
components/     Section components (approved markup) + components/forms (lead forms)
lib/           leads, validation, email, rateLimit, analytics, seo
content/       cities, faq, articles, services, trustPoints, formOptions
public/        assets (approved), images, site.js, static authority pages
styles/        globals.css (approved design system, verbatim)
types/         shared TypeScript types
docs/          ARCHITECTURE, SEO, ANALYTICS
```

## Key docs
- **DEPLOYMENT.md** \u2014 deploy to Vercel, connect a database & email
- **CONTENT-GUIDE.md** \u2014 where to edit copy, content, and images
- **CLIENT-HANDOFF.md** \u2014 what\u2019s done and what still needs client verification

## Sales platform persistence
The isolated sales platform persists to Supabase (sessions, leads, passports, photos, dashboards). Setup: **docs/SUPABASE.md**. Works without it too — falls back to logging/demo data. The public marketing site does not use Supabase.

## Auth & roles
Rep authentication and RBAC (REP / MANAGER / ADMIN) are implemented for the sales platform via Supabase Auth. Setup: **docs/AUTH.md**. Works without it (demo mode). Public site is unaffected.

## Setup order (full platform)
1. `npm install`
2. Supabase SQL (in order): `schema.sql` → `auth.sql` → `crm.sql` → `org.sql` → `membership.sql`
3. Create the `roof-passports` storage bucket
4. Set env vars (see `.env.example`)
5. Create the first ADMIN (Supabase Auth user + a `reps` row with role ADMIN)
6. `npm run build && npm start`

See **docs/GO-LIVE-CHECKLIST.md** for the complete pre-launch checklist.
