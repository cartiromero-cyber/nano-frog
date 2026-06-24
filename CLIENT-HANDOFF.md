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

## Sales platform (Supabase)
- Persistence is implemented for the sales platform (see docs/SUPABASE.md). Run `supabase/schema.sql`, create the `roof-passports` storage bucket, and set the 4 Supabase env vars.
- **Needs client decision:** membership pricing/tiers, rep accounts/assignment, and whether passport photos should be public or private (signed URLs).

## Auth (Supabase)
- Role-based access (REP/MANAGER/ADMIN) is live for the sales platform \u2014 see docs/AUTH.md. Run `supabase/auth.sql` and create rep accounts in Supabase Auth.
- **Needs client decision:** who the admins/managers are, territory assignments, and rep onboarding process.

## Rep CRM
- `/rep` is a daily field cockpit with leads, lead detail, notes, follow-ups, and status management (see docs/SALES.md). Run `supabase/crm.sql`.
- All CRM data is role-scoped (REP own / MANAGER team / ADMIN all), enforced server-side.

## Admin org management
- `/admin/reps` (create/invite reps, set roles, assign managers/territories, activate/deactivate) and `/admin/leads` (assign/reassign/bulk-assign) \u2014 see docs/AUTH.md. Run `supabase/org.sql`.
- **Needs client decision:** who the first ADMIN is (create that account in Supabase Auth + a `reps` row with role ADMIN), territory naming, and the invite email flow (temporary password is shown once in-app today).

## Memberships
- Reps enroll homeowners into the Roof Assurance Plan™ from `/sales` (final step), `/passport`, and lead detail. Intent only — no payments. Run `supabase/membership.sql`.
- **Needs client decision:** final tier pricing, the "credit toward future treatment" and "VIP service" placeholders, and whether/when to add Stripe checkout.

## Pre-launch
A complete QA + launch checklist (local build, Supabase, auth, first admin, Vercel, domain, forms,
rep/admin tests, client verification, launch day) is in **docs/GO-LIVE-CHECKLIST.md**. The items
marked **[client]** there are exactly what still needs your confirmation before launch.
