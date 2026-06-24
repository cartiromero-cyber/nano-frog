# Nano Frog — Go-Live Checklist

Work top to bottom. Anything marked **[client]** needs the client's confirmation before launch.

---

## 1. Local build
- [ ] `node -v` is 18.18+ (20 LTS recommended)
- [ ] `npm install` (installs `next`, `react`, `@supabase/supabase-js`, `@supabase/ssr`, Tailwind)
- [ ] `npm run lint` — fix any lint errors
- [ ] `npm run build` — must complete with **no errors**
- [ ] `npm run start` and click through `/`, `/sales`, `/login`
> The app runs in **demo mode** with no Supabase env vars (login not required, dashboards show zeros/demo). That's expected before step 2.

## 2. Supabase
- [ ] Create a Supabase project; copy **Project URL**, **anon** key, **service_role** key
- [ ] SQL editor — run in this order: `supabase/schema.sql` → `auth.sql` → `crm.sql` → `org.sql` → `membership.sql`
- [ ] Storage — create a bucket named **`roof-passports`** (public for simple photo URLs, or private + switch `/api/upload` to signed URLs)
- [ ] Confirm tables exist: reps, leads, sales_sessions, roof_assessments, roof_passports, roof_health_scores, passport_photos, passport_documents, recommendations, memberships, follow_ups, lead_assignment_history, lead_notes
- [ ] Confirm RLS is enabled on every table (no public policies)

## 3. Environment variables (`.env.local` and Vercel)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (server-only — never exposed)
- [ ] `SUPABASE_STORAGE_BUCKET=roof-passports`
- [ ] `NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN`
- [ ] (optional) `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` for lead emails
- [ ] (optional) `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_CLARITY_ID`

## 4. First admin (one-time, by SQL)
- [ ] Supabase → Authentication → Add user (email + password). Copy the user UUID.
- [ ] SQL: `insert into reps (user_id, name, email, role, territory, active) values ('<uuid>', 'Owner Name', 'owner@nanofrog.com', 'ADMIN', 'Georgia', true);`
- [ ] Sign in at `/login` → you should land on `/rep` and see admin nav
> After this, all further reps/managers/admins are created from `/admin/reps/new` — no more SQL.

## 5. Vercel
- [ ] Push repo to GitHub
- [ ] Import into Vercel (auto-detects Next.js)
- [ ] Add all env vars from step 3
- [ ] Deploy; confirm `/` and `/login` load

## 6. Domain
- [ ] Point domain at Vercel
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the live domain and redeploy
- [ ] Supabase → Authentication → URL Configuration: add the live domain
- [ ] Verify `https://DOMAIN/sitemap.xml` and `/robots.txt` resolve

## 7. Forms
- [ ] Public lead forms post and return a success message
- [ ] If `RESEND_API_KEY` set, a notification email arrives
- [ ] Honeypot: submitting with the hidden `company` field filled is silently dropped
- [ ] Rate limit: rapid repeated posts return 429

## 8. Rep test (sign in as a REP)
- [ ] `/rep` shows the rep's own data only
- [ ] `/rep/leads` lists only their leads; search/filter/sort work
- [ ] Open a lead → add note, schedule follow-up, update status, upload photo
- [ ] Start a presentation → finish → score, recommendation, passport created
- [ ] Record membership interest / enroll on the passport or lead
- [ ] `/rep/follow-ups` shows Today/Overdue/Upcoming/Completed; "Mark done" works
- [ ] REP visiting `/admin` is redirected to `/rep`

## 9. Admin / manager test
- [ ] `/admin` shows global metrics + membership overview
- [ ] `/admin/reps` lists reps; `/admin/reps/new` creates a rep (temp password shown once)
- [ ] `/admin/reps/[id]` edits a rep; deactivate works
- [ ] `/admin/leads` assigns + bulk-assigns; reassignment logs to `lead_assignment_history`
- [ ] MANAGER sees only their team; cannot edit ADMIN users; cannot assign outside team

## 10. Client verification **[client]**
- [ ] Business name, phone, address, hours (`lib/seo.ts → BUSINESS`)
- [ ] Service area (currently "Georgia")
- [ ] Roof replacement cost ranges / any pricing shown
- [ ] Roof Assurance Plan™ tier **pricing** + the "credit toward future treatment" and "VIP service" items
- [ ] Warranty / lifespan / durability claims wording
- [ ] Founder / chemist story (Science section) names and any test claims
- [ ] Reviews / ratings / number of roofs treated (real, documented only)
- [ ] Roof-photo storage: public bucket vs private + signed URLs

## 11. Launch day
- [ ] Final `npm run build` green on the deploy
- [ ] Smoke-test the full flow on the live domain (homepage → assessment → rep login → present → passport → membership → admin)
- [ ] Confirm no `[VERIFY]`/internal notes render on any public page
- [ ] Confirm service-role key is only in server env (not in any `NEXT_PUBLIC_` var)
- [ ] Hand off the first admin credentials securely; rotate the temp password
