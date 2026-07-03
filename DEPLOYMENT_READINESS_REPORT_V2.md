# DEPLOYMENT READINESS REPORT — V2

**Date:** July 3, 2026 · **Follows:** V1 report + approved fix list (P1: C1, C2, C3 · P2: H1, H2, H3)
**Committed locally only. Nothing pushed. Nothing deployed. Awaiting your approval.**
**Design Preservation Mandate honored:** zero color, typography, or layout changes in any fix.

---

## Verdict

**READY, pending 4 environment values you must set in the hosting dashboard.**
Every code-level blocker from V1 is resolved and verified as far as this environment allows.
The remaining work is configuration, not code — listed in "Your 4 required inputs" below.

---

## Fix status (approved items)

| ID | V1 Finding | Status | What was done |
|---|---|---|---|
| C1 | Demo-admin access — CRM public when Supabase unset | **FIXED** | `middleware.ts` now redirects ALL protected routes (`/admin`, `/sales`, `/rep`, `/reports`, `/assessment`, `/calculator`, `/passport`, `/account`) to `/login` even when Supabase is not configured. `getCurrentRep()` no longer returns a demo ADMIN — it returns null, so every API (`/api/sales/*`, `/api/admin/*`, `/api/leads/[id]/*`, `/api/upload`, `/api/memberships`, `/api/follow-ups`) denies unauthenticated calls. The two sales APIs that previously tolerated null auth (`POST /api/sales/session`, `POST /api/sales/passport`) now return 401. No UI created; no design touched. |
| C2 | Leads could exist only in ephemeral logs | **FIXED (code) — needs env** | `lib/leads.ts` now has a real Supabase insert into the existing `leads` table, a working Airtable branch, and loud `[LEAD:ERROR] … NOT stored durably` / `[LEAD:WARNING]` messages on every non-durable path. A failed insert still returns the lead so the notification email fires — no silent loss path remains in code. `.env.example` now defaults `LEAD_STORE=supabase`. **Verified:** 5/5 unit tests pass (valid payload, address required, bad-email rejection, loud log-mode warning, loud store-failure error). |
| C3 | Header invisible on /book and /sample-report | **FIXED** | Header accepts a `solid` prop rendering the pre-existing `header.solid` style (identical to the homepage's scrolled state — no new CSS). `/book` and `/sample-report` use it; homepage behavior unchanged. |
| H1 | "Pricing to be finalized with client" / "[VERIFY WITH CLIENT]" shown to customers | **FIXED** | All customer-visible instances replaced with the approved line "Pricing is determined after your Roof Health Assessment." — `content/membership.ts` (PRICING_NOTE + both tier features), `components/sales/MembershipPanel.tsx`. Repo-wide grep confirms zero customer-visible placeholders remain. |
| H2 | Domain conflict (elytrashieldroofing.com in code) | **FIXED — one confirmation needed** | All defaults now `https://elytrashield.us`: `app/layout.tsx` (metadataBase), `app/sitemap.ts`, `app/robots.ts`, `lib/seo.ts` (schema.org), `lib/email.ts` (from-address), `.env.example`. ⚠️ **Confirm spelling:** you wrote `elytrashield.us` (no hyphen); the project folder is `elytra-shield.us` (hyphen). Code uses your written version; if the registered domain is hyphenated, correct it via `NEXT_PUBLIC_SITE_URL` — one env var, no code change. |
| H3 | Fabricated demo passport served publicly | **FIXED** | `/passport` no longer renders `demoPassport()` — real records only, plain "No Roof Passport found" otherwise (route is also login-gated by C1). `GET /api/sales/passport` now requires a lookup key and returns only real records (400/404 otherwise). The fabricated 3-year history is unreachable. |

**Bonus fix within approved scope (H2/H4 identity):** `lib/seo.ts` was emitting a **fictional phone number** (`+1-478-555-0146`) in public schema.org markup on every page — missed in V1. Now config-driven: the telephone field is omitted from structured data until `NEXT_PUBLIC_PHONE` is set. No fake data ships.

---

## Verification performed

- `tsc --noEmit` — clean, zero errors across all changed files.
- Lead-path unit tests — **5/5 passed** (validation rules, both failure-mode warnings, lead object integrity).
- Repo-wide greps — zero remaining: demo-admin fallback, `demoPassport` usages in routes, customer-visible placeholder strings, `elytrashieldroofing.com` references (outside internal demo data in the on-hold CRM layer), fictional phone numbers.
- **Not verifiable in this sandbox:** full `next build` and a live end-to-end lead submission. The sandbox is ARM Linux without network access to fetch Next's SWC binary (node_modules was installed on macOS). Both must be run on your machine or CI — steps 5–6 below.

---

## Your 4 required inputs (the launch now blocks only on these)

1. **Supabase production env** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (and run `supabase/schema.sql` + `auth.sql` + `crm.sql` if not already). Without these, internal tools stay locked (safe) but leads can't reach the database.
2. **`LEAD_STORE=supabase`** + **`RESEND_API_KEY`** + **`LEAD_NOTIFY_EMAIL`** — with the sending domain verified in Resend.
3. **`NEXT_PUBLIC_SITE_URL`** — confirm hyphen question above.
4. **`NEXT_PUBLIC_PHONE`** — the moment you choose the number (H4, approved-pending-number), click-to-call appears in header, footer, CTA, and schema automatically.

## Pre-launch runbook (after env is set)

5. `npm run build` locally/CI — confirm clean production build.
6. Submit one real test lead on `/book` → verify the row in Supabase `leads` + both emails arrive.
7. Log out → confirm `/admin` and `/rep` redirect to `/login`.
8. Click-through: `/`, `/book`, `/sample-report`, one learning-center article, phone tap on mobile.

## Still open (intentionally held per your instruction)

- **M4** Founder section content (headshot, story, PM experience, inspection philosophy) — slots ready, flagged as a conversion asset to build soon.
- **M5** Sales-presentation photo/video assets — before running ads.
- **M1** `/login` "demo mode" helper note — now slightly stale wording (there is no demo mode); one-line fix awaiting approval.
- M6–M8, L1–L6 from V1 — unchanged, severity unchanged.

*Report produced after implementation; all changes committed locally on top of `8236a59`. Push/deploy awaits your word.*
