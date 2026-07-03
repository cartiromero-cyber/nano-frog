-- Elytra Shield — Auth + RBAC additions. Run AFTER supabase/schema.sql. Safe to re-run.

-- reps become user profiles linked to Supabase Auth users
alter table reps add column if not exists user_id uuid unique;
alter table reps add column if not exists role text not null default 'REP';
alter table reps add column if not exists manager_id uuid references reps(id) on delete set null;
alter table reps add column if not exists last_login_at timestamptz;
-- (territory + active already exist from schema.sql)
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'reps_role_check') then
    alter table reps add constraint reps_role_check check (role in ('REP','MANAGER','ADMIN'));
  end if;
end $$;
create index if not exists idx_reps_user on reps (user_id);
create index if not exists idx_reps_role on reps (role);
create index if not exists idx_reps_manager on reps (manager_id);

-- ownership columns for scoping
alter table sales_sessions add column if not exists user_id uuid;
alter table roof_passports add column if not exists rep_id uuid references reps(id) on delete set null;
create index if not exists idx_pass_rep on roof_passports (rep_id);

-- Helper: link the currently-signed-in auth user to a rep row (run once per rep)
-- 1) Create the user in Supabase Auth (Dashboard -> Authentication -> Add user).
-- 2) Insert their profile:
--    insert into reps (user_id, name, email, role, territory)
--    values ('<auth-user-uuid>', 'Jane Rep', 'jane@elytrashield.com', 'REP', 'Macon');

-- ── Defense-in-depth RLS policies (authenticated) ───────────────────────────
-- Server code uses the service role (bypasses RLS) and is the authoritative filter.
-- These optional policies scope any *authenticated client* reads by role.
-- A rep sees their own rep row; managers see their team; admins see all.
drop policy if exists reps_self_read on reps;
create policy reps_self_read on reps for select to authenticated using (
  user_id = auth.uid()
  or exists (select 1 from reps me where me.user_id = auth.uid() and me.role = 'ADMIN')
  or manager_id in (select id from reps me where me.user_id = auth.uid() and me.role = 'MANAGER')
);

-- Leads / sessions / passports: visible to the owning rep, their manager, or an admin.
drop policy if exists leads_scoped_read on leads;
create policy leads_scoped_read on leads for select to authenticated using (
  rep_id in (select id from reps where user_id = auth.uid())
  or exists (select 1 from reps me where me.user_id = auth.uid() and me.role = 'ADMIN')
  or rep_id in (select id from reps where manager_id in (select id from reps me where me.user_id = auth.uid() and me.role = 'MANAGER'))
);
-- (Repeat the same pattern for sales_sessions / roof_passports / follow_ups as needed.)
