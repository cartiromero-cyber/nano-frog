# DEPLOYMENT READINESS REPORT — elytra-shield.us

**Date:** July 3, 2026 · **Mode:** audit only — no changes made, nothing committed
**Standard applied:** "the site goes live tomorrow."
**Verdict: NOT READY.** Three Critical findings block launch. All are fixable in under a day.

---

## Severity summary

| Severity | Count | Meaning |
|---|---|---|
| Critical | 3 | Blocks launch — data loss, security exposure, or broken conversion path |
| High | 4 | Fix before launch — trust/brand damage or misconfiguration visible to users |
| Medium | 8 | Fix within first week — quality, compliance, or operational gaps |
| Low | 6 | Backlog — cosmetic or documented-by-design |

---

## CRITICAL

### C1 — Demo-mode auth bypass: the entire CRM is public if Supabase env vars are unset
- `middleware.ts:11` — `if (!url || !anon) return res; // demo mode: no auth configured -> no gate`
- `lib/sales/auth.ts:11` — `getCurrentRep()` returns a **demo ADMIN context** when Supabase is not configured.
- Consequence if deployed as-is: `/admin`, `/rep`, `/sales`, `/assessment`, `/calculator`, `/passport`, `/reports` and every sales API (`/api/leads/[id]/status`, `/api/admin/*`, `/api/memberships`, `/api/upload`, `/api/follow-ups`) are **publicly accessible with ADMIN privileges**. Every route checks `getCurrentRep()`, and in demo mode that check passes.
- Required before launch: set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (+ service role) in production, and verify `/admin` redirects to `/login` when logged out. If Supabase won't be ready, the protected routes must be blocked at the host level instead.

### C2 — Booked leads can be silently lost
- `.env.example:LEAD_STORE=log` (default) — leads are written only to server console (`lib/leads.ts:35 console.log("[LEAD]", …)`). On serverless hosting these logs are ephemeral.
- `RESEND_API_KEY` unset → `sendLeadNotification` and `sendBookingConfirmation` are no-ops (`lib/email.ts:11,…`).
- Consequence: a homeowner books, sees a success screen, and no durable record or notification exists anywhere.
- Required before launch: set `LEAD_STORE` to a real backend (supabase/postgres/airtable) **or** at minimum configure `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL`, then submit one live test lead end-to-end.

### C3 — Header is illegible on /book and /sample-report (introduced with the new pages)
- `styles/globals.css:62` — nav links default to near-white (`rgba(233,241,246,.85)`) and only darken when `header.solid` is toggled by `/site.js` on scroll (`public/site.js:141-142`).
- `/site.js` is loaded **only on the homepage** (`app/page.tsx:37`).
- Consequence: on `/book` (light background from the top) the nav links and logo wordmark are white-on-white — the primary conversion page has an invisible header; on `/sample-report` the header never turns solid on scroll. Honest attribution: this is an interaction between the pre-existing homepage-only script and the two pages added in the last commit.
- Fix options (pending approval, both design-preserving): load `site.js` on the new routes, or render the header with the existing `solid` class on non-home pages. One-line either way.

---

## HIGH

### H1 — Customer-visible placeholder text in the sales flow (Change 006 — proposed, never approved)
- `components/sales/StepOptions.tsx` renders `PRICING_NOTE` = **"Pricing to be finalized with client."** as the visible price of every tier, on an iPad in a homeowner's kitchen.
- `components/sales/MembershipPanel.tsx:66` — same string on the passport/enrollment panel.
- `content/membership.ts:27,37` — **"[VERIFY WITH CLIENT]"** rendered inside customer-facing tier feature lists.

### H2 — Domain identity conflict
- Code defaults to `https://elytrashieldroofing.com` (`app/layout.tsx`, `app/sitemap.ts:6`, `app/robots.ts:3`, `lib/email.ts` from-address) while the project/host is `elytra-shield.us`.
- Consequence: canonicals, sitemap, robots `host`, OG URLs, and the email from-domain all point at whichever domain is NOT deployed. Set `NEXT_PUBLIC_SITE_URL` and pick one canonical domain (301 the other).

### H3 — Fabricated history in the demo passport
- `lib/sales/passport.ts:28-48` — `demoPassport()`: "Sample Homeowner, 123 Maple Street," a 2024–2026 inspection history, "membrane performing as designed," and the **company logo used as roof photos**. Served at `/passport` and `GET /api/sales/passport` whenever auth is unset (see C1) or no record matches.
- Consequence: an honesty-branded company publicly displaying an invented 3-year service record. Gate it, or label it "DEMO" as loudly as the sample report labels "SAMPLE."

### H4 — No phone number configured
- `NEXT_PUBLIC_PHONE` is empty, so click-to-call (header/footer/CTA) correctly renders nothing. The design decision is right (no fake number), but launching a home-services site with no phone anywhere suppresses the highest-converting contact channel. Set the real line before go-live.

---

## MEDIUM

| # | Finding | Location |
|---|---|---|
| M1 | `/login` publicly displays "Auth not configured — the platform runs in demo mode. See docs/AUTH.md" — leaks internal state | `components/sales/LoginForm.tsx:33` |
| M2 | Lead PII (name, phone, address) written to console logs by default — visible to anyone with hosting-dashboard access; retention uncontrolled | `lib/leads.ts:35`, `lib/email.ts:12` |
| M3 | Production build not verified: `tsc --noEmit` passes, but `next build` could not complete in the audit sandbox (memory). Run a full build + click-through before deploy | build pipeline |
| M4 | Founder/credential slots empty — the approved "Why Elytra Shield" section ships without name, photo, license/insurance numbers (marked `TODO(owner)`) | `components/WhyElytraShield.tsx:4,15` |
| M5 | Sales presentation visual assets missing — all 7 files in `content/sales-assets.ts` (home.jpg, membrane-demo.mp4, lab.jpg…) don't exist in `/public/sales-assets/`; procedural SVG fallbacks render, so nothing breaks, but the "hero" membrane demo slide is a placeholder animation | `content/sales-assets.ts`, `public/sales-assets/` |
| M6 | Rate limiting is in-memory per serverless instance (documented) — weak spam protection for the now-live booking form; Upstash env vars unset | `lib/rateLimit.ts:4-7` |
| M7 | Static authority pages (`/learning-center`, `/roof-insurance`, `/roof-health-score`, `/faq` in `/public`) carry their own copies of header/CSS — duplicated chrome will drift from the app (e.g., they won't show the phone number when configured) | `public/*/index.html`, noted in `next.config.js` comment |
| M8 | `LEAD_NOTIFY_EMAIL` / `LEAD_FROM_EMAIL` defaults are sample addresses on the possibly-wrong domain; Resend requires a verified sending domain | `.env.example:24-25`, `lib/email.ts:20` |

---

## LOW

| # | Finding | Location |
|---|---|---|
| L1 | 28 `console.log/error/warn` statements across app/lib — most are intentional env-gated fallbacks; audit before enabling verbose hosting logs | various |
| L2 | Admin dashboard StatCard shows `hint="placeholder"` (internal-only, behind auth once C1 is fixed) | `app/admin/page.tsx:31` |
| L3 | `/reports` page is a stated "foundation view" with explanatory copy — internal-only, acceptable | `app/reports/page.tsx` |
| L4 | `content/cities.ts` is an empty array (city pages intentionally on hold — Batch C not approved) | `content/cities.ts` |
| L5 | Homepage `.reveal` elements are `opacity:0` without JavaScript — no-JS visitors see missing sections (reduced-motion users are handled) | `styles/globals.css:104` |
| L6 | Housekeeping: `tsconfig.tsbuildinfo` committed; `public/sales-sw.disabled.js` leftover; empty `public/images/` dir; `build.out.log` untracked in repo root | repo root |

**Excluded as false positives:** `placeholder=` attributes on CRM/form inputs (legitimate UI hints); the word "sample" on `/sample-report` (deliberate, approved Change 005, clearly labeled); `Step1Connection` input placeholders (rep tool UI).

---

## Broken-asset & link check (passed)
- `/assets/elytra-shield-icon.png`, `/assets/elytra-shield-logo.png` — exist; all `src` references absolute and valid.
- App icons / OG images (`app/icon.png`, `apple-icon.png`, `opengraph-image.png`, `twitter-image.png`) — present.
- All homepage, footer, and Learning Center links resolve to existing routes/static pages (re-verified post-wiring; zero `href="#"` remain).
- `sitemap.ts` lists only public routes; internal tools excluded. `robots.ts` allows all — acceptable once C1 gates internal routes behind `/login`.

## Go-live checklist (in order)
1. Fix C1 — set Supabase env in production; verify `/admin` requires login.
2. Fix C2 — configure lead storage + notification email; run one live test lead.
3. Fix C3 — approve the one-line header fix for `/book` and `/sample-report`.
4. Approve Change 006 (H1) — remove customer-visible placeholder strings.
5. Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PHONE`, verified sending domain (H2/H4/M8).
6. Gate or label the demo passport (H3).
7. Full `next build` + manual click-through of /, /book, /sample-report, one static article, and a form submission (M3).
