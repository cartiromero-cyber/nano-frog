# Client Handoff

This is a production-grade Next.js project that preserves the approved Nano Frog design.

## What\u2019s included
- Approved homepage, organized into section components (identical visual output)
- Backend foundation: lead API routes (assessment, insurance review, contact), photo upload,
  validation, spam honeypot + rate limiting, email-notification hook, pluggable lead storage
- Content system (cities, FAQ, articles, services, trust points, form options)
- SEO: metadata, Open Graph, `sitemap.xml`, `robots.txt`, LocalBusiness / Service / FAQ / Article schema
- Analytics hooks for GA4, Microsoft Clarity, Meta Pixel (see docs/ANALYTICS.md)
- Documentation for running, deploying, and maintaining the site

## \u26a0\ufe0f Needs client verification before launch
These were intentionally left as safe placeholders:
- **Business details** \u2014 legal name, phone, address, hours (`lib/seo.ts` \u2192 `BUSINESS`)
- **Service area** \u2014 currently "Georgia"
- **Pricing / cost ranges** \u2014 no specific prices are published
- **Warranty, lifespan, and durability claims** \u2014 keep careful, verifiable language
- **Insurance language** \u2014 do not promise coverage outcomes
- **Reviews / ratings / number of roofs treated** \u2014 add only real, documented figures
- **Founder / chemist story** (Science section) \u2014 confirm names, credentials, and any test claims

## Recommended next steps
1. Connect a database + email provider (DEPLOYMENT.md).
2. Confirm the placeholders above and update copy/`content/`.
3. Add GA4 + Search Console + Clarity IDs.
4. Build out the local-SEO city pages from `content/cities.ts`.
