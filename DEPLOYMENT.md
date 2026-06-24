# Deployment

## Vercel (recommended)
1. Push this repo to GitHub.
2. In Vercel: **New Project → Import** the repo. Framework auto-detects as Next.js.
3. Add environment variables from `.env.example` (Project → Settings → Environment Variables).
4. Deploy. `vercel.json` enables clean URLs for the static authority pages in `/public`.

## Environment variables
See `.env.example`. Nothing is required to boot — lead storage defaults to console logging
and email is skipped until configured. **Never commit `.env.local`.**

## Connect lead storage (`LEAD_STORE`)
Implement the matching branch in `lib/leads.ts`:
- **Supabase** — `npm i @supabase/supabase-js`; set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`; create a `leads` table.
- **Neon / Postgres** — `npm i @neondatabase/serverless`; set `DATABASE_URL`.
- **Airtable** — set `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE`.

## Email notifications
`lib/email.ts` uses Resend by default. Set `RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL`
(or swap for SendGrid/Postmark). Skipped automatically when unset.

## File uploads
`/api/upload` validates type/size. To persist photos, configure `UPLOAD_PROVIDER`
(Supabase Storage or S3) and complete the TODO in `app/api/upload/route.ts`.

## Spam protection
`lib/rateLimit.ts` is in-memory. For multi-instance production, swap for Upstash
Ratelimit (`UPSTASH_REDIS_REST_URL` / `_TOKEN`). A honeypot field is already wired in all forms.

## Full platform deploy order
Run the five SQL files in order (`schema → auth → crm → org → membership`), create the
`roof-passports` bucket, set the Supabase + site env vars, create the first ADMIN by SQL, then
deploy to Vercel. Dashboards are `force-dynamic`. Full step-by-step: **docs/GO-LIVE-CHECKLIST.md**.
