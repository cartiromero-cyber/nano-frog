# Supabase Persistence — Sales Platform

Turns the sales platform into a real operational system: sessions, leads, assessments,
Digital Roof Passports™, scores, recommendations, photos/documents, memberships, and rep
activity all persist in Supabase. **The public marketing site does not use Supabase and is
unaffected.** If the env vars below are absent, everything still runs and falls back to
console logging / demo data.

## 1. Create the project
1. Create a project at supabase.com.
2. Project Settings → API: copy the **Project URL**, the **anon** key, and the **service_role** key.

## 2. Create the tables
Open **SQL Editor**, paste the contents of [`supabase/schema.sql`](../supabase/schema.sql), and Run.
It creates 11 tables with UUID primary keys, `created_at` / `updated_at`, indexes (homeowner
email/phone, property address, `rep_id`, `passport_id`, `lead_id`, `session_id`), `updated_at`
triggers, and enables Row Level Security on every table. It is safe to re-run.

Tables: `reps`, `leads`, `sales_sessions`, `roof_assessments`, `roof_passports`,
`roof_health_scores`, `passport_photos`, `passport_documents`, `recommendations`,
`memberships`, `follow_ups`.

## 3. Create the storage bucket
Storage → New bucket → name it **`roof-passports`**.
- For simple public photo URLs, make it **public**.
- For private records, keep it private and switch `getPublicUrl` to a signed URL in
  `app/api/upload/route.ts` (`createSignedUrl`). The bucket name is read from
  `SUPABASE_STORAGE_BUCKET`.

## 4. Environment variables
Add to `.env.local` (local) and to Vercel → Project → Environment Variables (production):
```
NEXT_PUBLIC_SUPABASE_URL=...          # Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...     # anon public key (browser-safe)
SUPABASE_SERVICE_ROLE_KEY=...         # SERVER ONLY — never exposed to the browser
SUPABASE_STORAGE_BUCKET=roof-passports
```

## 5. Local development
```bash
npm install        # installs @supabase/supabase-js
cp .env.example .env.local   # fill in the four values above
npm run dev
```
Test the flow: open `/sales`, complete a presentation, choose a next step (saves a session +
lead + assessment + score + recommendation, and creates a passport). Then visit `/rep` and
`/admin` to see counts, and `/passport?phone=...` (or `?email=` / `?address=` / `?id=`) to load
that record.

## 6. Production (Vercel)
Set the four env vars in Vercel and redeploy. Dashboards use `force-dynamic` so they always
read fresh data. Nothing else changes.

## Security
- **Service role key is server-only.** It lives in `lib/supabase/admin.ts`, which throws if ever
  imported into the browser, and is used exclusively inside `app/api/**` route handlers and
  server components.
- **RLS is enabled on all tables with no public policies**, so anon clients cannot read or list
  homeowner records. All writes/reads go through the service role server-side.
- **Passport lookup requires a specific identifier** (`id`/`phone`/`email`/`address`); there is no
  endpoint that lists all records. Without an identifier, `/passport` and the API return only the
  example record.
- Request bodies are validated, a honeypot field is checked, and basic rate limiting is applied
  on every write route.

## Architecture
- `lib/supabase/{client,server,admin}.ts` — anon browser client, anon server client, service-role admin client.
- `lib/sales/db.ts` — all data access (`upsertLead`, `saveSalesSession`, `createOrUpdatePassport`,
  `lookupPassport`, `attachUpload`, `recordMembershipInterest`, dashboard aggregates). Every
  function returns a graceful fallback when Supabase is not configured.
- Routes: `app/api/sales/session`, `app/api/sales/passport`, `app/api/upload`.
- Dashboards: `app/rep`, `app/admin` (live via `lib/sales/metrics.ts`).

## CRM tables
Run `supabase/crm.sql` after `schema.sql` and `auth.sql`. It adds CRM columns to `leads`
(roof_age, insurance_concern, visible_damage, latest_score, next_follow_up_at, last_contacted_at),
adds `type` + `completed_at` to `follow_ups`, and creates `lead_notes`. Indexes are added for
status, city, due_date, and lead_id.

## Org management tables
Run `supabase/org.sql` after `crm.sql`. It creates `lead_assignment_history` (audit of every reassignment). Rep auth users are created via the service role inside `/api/admin/reps/invite` \u2014 never client-side.

## Membership table
Run `supabase/membership.sql` after `org.sql`. It extends `memberships` with rep_id, start_date, renewal_date, price, notes, enrolled_at, cancelled_at, and Stripe placeholders (stripe_customer_id, stripe_subscription_id, payment_status). No payment processing is implemented.
