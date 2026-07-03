# Sales & Conversion Layer

A separate, fully isolated presentation + sales system built **on top of** the public marketing
site. Nothing in the public website is modified. Remove the paths below and the public site is
unchanged.

## Routes
| Route | What it is |
|---|---|
| `/sales` | Guided iPad presentation — the 10-step flow (Apple-Keynote style) |
| `/assessment` | Standalone Roof Health Score tool |
| `/calculator` | Standalone cost-of-waiting calculator |
| `/reports` | Report foundation (reports are generated in `/sales` Step 9) |
| `/rep` | Rep dashboard (leads, presentations, conversion, follow-ups, territory) |
| `/admin` | Admin dashboard (revenue, lead sources, conversion, rep performance) |

## The 10-step flow (`components/sales/steps`)
1. **Your Home** — rapport + emotional ownership (captures connection answers)
2. **Why Roofs Age** — interactive education (UV, moisture, thermal, granule loss, oxidation)
3. **What Is Elytra Shield** — membrane explained, no hype
4. **Roof Health Score** — live interactive scoring → `lib/sales/scoring.ts`
5. **The Cost of Waiting** — replacement vs preservation → `lib/sales/cost.ts`
6. **Membrane Demonstration** — cinematic protection animation (hero asset)
7. **The Chemist’s Story** — origin + human connection
8. **Recommendation** — objective tier → `lib/sales/recommendation.ts`
9. **Your Roof Report** — branded, printable report → `lib/sales/report.ts`
10. **Next Steps** — decision screen → posts to `/api/sales/session`

## Presentation engine (`components/sales/Presentation.tsx`)
Full-screen, iPad-optimized, swipe + arrow-key + tap navigation, progress indicator,
presentation timer, and a session object that flows through every step. Offline-capable via
`public/sales-sw.js` + `public/sales.webmanifest` (add to Home Screen on iPad for full-screen kiosk mode).

## Logic (`lib/sales/`)
`scoring.ts`, `cost.ts`, `recommendation.ts`, `report.ts` are pure, transparent functions — the
same logic powers the presentation and the standalone tools. `store.ts` persists sessions (pluggable,
same env-driven pattern as `lib/leads.ts`; logs by default, no secrets).

## Dashboards
`/rep` and `/admin` are foundation views wired to `lib/sales/metrics.ts`. Replace its placeholder
returns with real aggregates from your store to go live.

## How to remove
Delete: `app/sales`, `app/assessment`, `app/calculator`, `app/reports`, `app/rep`, `app/admin`,
`app/api/sales`, `components/sales`, `components/dashboard`, `lib/sales`, `types/sales.ts`,
`styles/sales.css`, `styles/dashboard.css`, `public/sales-sw.js`, `public/sales.webmanifest`.
The public marketing site is completely untouched.

## Update: Roof Ownership System

### New presentation step (now 11 steps)
**3. The Cost of Delay** — inserted between *Why Roofs Age* and *What Is Elytra Shield*. An interactive
multi-year projection (`lib/sales/future.ts`) charting cumulative spend when maintenance is delayed
(rising repairs + an unavoidable replacement) versus preserving now. A "if you wait N years" slider
lets the homeowner discover the financial consequence themselves. Illustrative, discussion-only.

### Digital Roof Passport™ (`/passport`)
The homeowner's permanent roof record and the foundation for recurring memberships. Stores:
Roof Health Score history, inspection history, photos, preservation history, warranty/documents,
and future recommendations — plus a membership status.

- `lib/sales/passport.ts` — `createPassportFromSession()` (seeds a record at the end of a presentation),
  `demoPassport()` (example record for the preview), `savePassport()` (pluggable storage, logs by default).
- `app/api/sales/passport` — `POST` creates a passport from a session; `GET` returns the example.
- `components/sales/PassportView.tsx` — the record UI (light, print/PDF friendly).
- Step 11 (*Next Steps*) now also starts a passport and links the homeowner to it.

### Membership foundation (`content/membership.ts`)
Three recurring tiers (Essential / Protected / Concierge) rendered on the passport via
`MembershipTiers`. Pricing intentionally omitted until confirmed with the client.

### Removal (additions)
Also delete to remove these features: `app/passport`, `app/api/sales/passport`,
`components/sales/PassportView.tsx`, `components/sales/MembershipTiers.tsx`,
`components/sales/PrintButton.tsx`, `components/sales/steps/StepFutureCost.tsx`,
`lib/sales/future.ts`, `lib/sales/passport.ts`, `content/membership.ts`. The public site is unaffected.

## Update: Rep Operating Center (field CRM)
`/rep` is now a daily cockpit, not just metrics:
- **`/rep`** — today's follow-ups, hot leads, recent presentations, passports/assessments/conversion, quick actions.
- **`/rep/leads`** — searchable, filterable, sortable lead list with status, source, city filters; cards show full homeowner/roof detail and Call/Text/Email/Present/Passport/Details/Status actions; "+ New Lead".
- **`/rep/leads/[id]`** — full lead record: homeowner, property/roof, status, follow-up tasks, notes timeline, presentation & score history, recommendations, photos (upload), passport + membership. Actions to start a presentation, generate/update a passport, add notes, schedule follow-ups, update status.
- **`/rep/follow-ups`** — Today / Overdue / Upcoming / Completed, with one-tap "Mark done".

Data layer: `lib/sales/crm.ts` (every read/write is role-scoped — REP own, MANAGER team, ADMIN all). Constants in `lib/sales/crm-constants.ts`. Follow-ups use the `follow_ups` table; notes use `lead_notes`. Run `supabase/crm.sql` after `schema.sql` + `auth.sql`.

## Update: Org management
Admins/managers manage reps and lead assignment from `/admin/reps` and `/admin/leads` (data layer `lib/sales/org.ts`, role-enforced). See docs/AUTH.md.

## Update: Roof Assurance Plan™ memberships
Membership enrollment is built into the Digital Roof Passport™ (recurring-revenue foundation).
- **Tiers** (`content/membership.ts`): Essential / Protected / Concierge. Careful language — no
  insurance/coverage/roof-life guarantees. Pricing is intentionally blank ("Pricing to be finalized
  with client"); the Protected credit and Concierge VIP items are flagged `[VERIFY WITH CLIENT]`.
- **Where reps enroll:** the `/sales` final step ("Protect This Roof Going Forward"), the
  `/passport` page, and the lead detail page (`/rep/leads/[id]`). Reps select a tier and record
  **Interested / Enroll / Decline** — intent capture only, **no payment is processed**.
- **Statuses:** Interested, Enrolled, Pending Payment, Active, Cancelled, Declined.
- **Dashboards:** `/rep` shows interest/enrolled/renewals/declined; `/admin` shows the full
  membership overview (by status, by rep, by city, upcoming renewals).
- **Data layer:** `lib/sales/membership.ts` (role-scoped — a rep can only enroll on their own
  leads/passports). Run `supabase/membership.sql`.

### Stripe-ready (not built)
The `memberships` table includes `stripe_customer_id`, `stripe_subscription_id`, and
`payment_status` placeholders. No Stripe code is included; checkout can be added later by filling
these on enrollment and adding a webhook — nothing is hardcoded.
