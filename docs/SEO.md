# SEO Foundation

- **Metadata / Open Graph** — `app/layout.tsx` (site-wide) + `buildMetadata()` in `lib/seo.ts` (per page).
- **sitemap.xml** — `app/sitemap.ts` (homepage + authority + content-driven city/article URLs).
- **robots.txt** — `app/robots.ts`.
- **Structured data** — `lib/seo.ts`: `localBusinessSchema`, `websiteSchema`, `serviceSchema`,
  `faqSchema`, `articleSchema`. LocalBusiness + WebSite are injected site-wide in the layout.
- **Local-SEO ready** — add cities to `content/cities.ts`; they flow into the sitemap and are
  ready for generated city pages.

Verify business name, phone, address, and service area in `lib/seo.ts` before launch (see CLIENT-HANDOFF.md).
