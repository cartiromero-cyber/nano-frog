# Architecture

## Design preservation
The approved static homepage was migrated **without visual change**:
- **Markup** → one component per section in `components/`, each rendering the original HTML.
- **CSS** → `styles/globals.css` contains the approved design system verbatim, plus the
  section-scoped styles that were inline. Tailwind `preflight` is disabled so utilities can be
  used for new UI (forms) without resetting or altering the approved styles.
- **JS** → the approved animations/interactions run from `public/site.js`, loaded with
  `next/script` (`afterInteractive`) so the server-rendered markup is present first.

This keeps the output pixel-identical while giving a clean, component-based codebase that can be
progressively refactored to idiomatic JSX/Tailwind later, section by section, with no rush.

## Backend
- `app/api/leads/*` and `app/api/contact` → validate → honeypot + rate limit → `saveLead()` → `sendLeadNotification()`.
- `lib/leads.ts` abstracts storage (log/Supabase/Postgres/Airtable) behind `LEAD_STORE`.
- `app/api/upload` validates and is ready to wire to cloud storage.
- No secrets are committed; everything uses environment variables.

## SEO
- `app/sitemap.ts` + `app/robots.ts` generate `sitemap.xml` / `robots.txt`.
- `lib/seo.ts` builds metadata and JSON-LD (LocalBusiness, WebSite, Service, FAQ, Article).
