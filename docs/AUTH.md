# Authentication & Role-Based Access

Supabase Auth (email/password) + roles, scoped entirely to the sales platform. The public
marketing site is unaffected. When Supabase env vars are absent, the platform runs in **demo
mode**: no login is required and dashboards show a "Demo Admin" badge with zeroed data.

## Roles
| Role | Can do |
|---|---|
| **REP** | Use `/sales`; create leads, sessions, passports; **see only their own** leads/sessions/passports/follow-ups. |
| **MANAGER** | See their **team** (reps where `manager_id` = them) and team metrics. |
| **ADMIN** | Full access to everything, including `/admin`. |

## Protected routes
`/sales`, `/assessment`, `/calculator`, `/reports`, `/rep`, `/admin`, `/passport`, `/account`.
- Unauthenticated → redirected to `/login?next=…` by `middleware.ts`.
- `/admin` is ADMIN-only (REP/MANAGER are redirected to `/rep` by the page's server-side check).
- Role gating and data scoping are enforced **server-side** (never client-only).

## Setup
1. Run `supabase/schema.sql`, then `supabase/auth.sql` (adds `user_id`, `role`, `manager_id`,
   `last_login_at`, ownership columns, indexes, and example RLS policies).
2. Set env vars (`.env.local` + Vercel):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
   `SUPABASE_STORAGE_BUCKET`, `NEXT_PUBLIC_SITE_URL`.
3. `npm install` (adds `@supabase/ssr`), `npm run dev`.

## Create reps / assign roles
1. Supabase → **Authentication → Add user** (email + password). Copy the user's UUID.
2. Insert their profile and role:
   ```sql
   insert into reps (user_id, name, email, role, territory, active)
   values ('<auth-user-uuid>', 'Jane Rep', 'jane@elytrashield.com', 'REP', 'Macon', true);
   ```
3. For a manager, set `role = 'MANAGER'`; assign reps to them with `update reps set manager_id = '<manager-rep-id>' where id = '<rep-id>';`
4. For an admin, set `role = 'ADMIN'`.

A rep signs in at `/login`. On success, `last_login_at` is updated and they land on `/rep`.

## How scoping works
`lib/sales/auth.ts` → `getCurrentRep()` resolves the signed-in rep (role, territory, team).
`getScope()` returns the allowed `rep_id` set (own / team / all). `lib/sales/db.ts` aggregates
filter by that set. Writes (`/api/sales/session`, `/api/sales/passport`) attach `rep_id` /
`user_id` so every lead, session, and passport links back to the rep.

## Security notes
- **Service role key stays server-only** (`lib/supabase/admin.ts` throws if loaded in the browser).
  The browser only ever uses the anon key via `@supabase/ssr`.
- RLS is enabled on all tables; example authenticated policies in `auth.sql` scope reads by role.
  Server reads use the service role and apply the role filter in code — the authoritative gate.
- No endpoint lists all homeowner records; passport lookup requires a specific identifier.
- Rate limiting + honeypot remain on all write routes.

## Local vs production
- **Local:** put the four env vars in `.env.local`. Without them, demo mode is active.
- **Production (Vercel):** set the env vars in Project Settings; dashboards are `force-dynamic`
  so they always read fresh, role-scoped data. Add your domain to Supabase Auth → URL config.

## Later: magic links
The login form is email/password today. To add magic links, call
`supabase.auth.signInWithOtp({ email })` in `LoginForm` and add a callback route — no schema change.

## CRM ownership & scoping
Every CRM read/write goes through `lib/sales/crm.ts`, which calls `getScope()` and filters by
`rep_id`: a REP sees only their own leads/notes/follow-ups, a MANAGER sees their team's, an ADMIN
sees all. Lead-level mutations (status, notes, follow-ups, photos) verify the lead is in the
caller's scope server-side before writing — client filters are never trusted.

## Admin rep management (no SQL)
Admins manage the team from `/admin/reps` (and managers see their team there, read-mostly):
- **`/admin/reps/new`** creates a rep. With "Create login" checked, it makes a Supabase Auth user
  server-side (service role) and returns a one-time temporary password to hand off; the rep signs
  in at `/login` and changes it. Unchecked creates a profile only (link a login later).
- **`/admin/reps/[id]`** edits name/phone/role/territory/manager/active. Managers can edit their own
  team's non-admin reps and cannot promote anyone to ADMIN; only admins can edit admins or set ADMIN.
- **Deactivate** a rep by unchecking "Active" (they remain in the org for history but are filtered out
  of assignable lists). **Recover access:** reset the user's password in Supabase → Authentication.

## Lead assignment
`/admin/leads` lists all leads (admin) or team + unassigned leads (manager) with per-lead
**Assign/Reassign** and **Bulk assign** (by city, optionally unassigned-only). Assignment updates
`lead.rep_id`, moves that lead's `follow_ups.rep_id`, and records a row in `lead_assignment_history`
(previous rep, new rep, who changed it, reason). All enforced server-side: a MANAGER can only assign
to/within their team; a REP cannot assign at all.

## Membership scoping
Membership reads/writes go through `lib/sales/membership.ts`, which verifies the membership's lead/passport belongs to the caller's scope (REP own / MANAGER team / ADMIN all) before any write.
