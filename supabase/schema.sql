-- Elytra Shield Sales Platform — Supabase schema
-- Run in Supabase: SQL Editor -> paste -> Run. Safe to re-run (IF NOT EXISTS).
create extension if not exists "pgcrypto";

-- updated_at trigger helper
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

-- 1. reps
create table if not exists reps (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text unique, phone text, territory text,
  active boolean default true,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

-- 2. leads
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text, email text, phone text, address text, city text,
  source text default 'sales-platform', status text default 'new',
  rep_id uuid references reps(id) on delete set null,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_leads_email on leads (lower(email));
create index if not exists idx_leads_phone on leads (phone);
create index if not exists idx_leads_address on leads (lower(address));
create index if not exists idx_leads_rep on leads (rep_id);

-- 3. sales_sessions
create table if not exists sales_sessions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  rep_id uuid references reps(id) on delete set null,
  connection jsonb default '{}'::jsonb,
  score_inputs jsonb default '{}'::jsonb,
  cost_inputs jsonb default '{}'::jsonb,
  recommendation text, recommendation_tier text,
  next_step text, territory text, duration_seconds int,
  created_at timestamptz default now()
);
create index if not exists idx_sessions_lead on sales_sessions (lead_id);
create index if not exists idx_sessions_rep on sales_sessions (rep_id);

-- 4. roof_assessments
create table if not exists roof_assessments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  session_id uuid references sales_sessions(id) on delete set null,
  roof_age int, roof_type text, score int, condition_summary text,
  created_at timestamptz default now()
);
create index if not exists idx_assess_lead on roof_assessments (lead_id);
create index if not exists idx_assess_session on roof_assessments (session_id);

-- 5. roof_passports
create table if not exists roof_passports (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  owner_name text, phone text, email text, address text, city text,
  roof_age int, roof_type text, latest_score int, condition_summary text, recommendation text,
  membership_status text default 'none',
  inspections jsonb default '[]'::jsonb, preservation jsonb default '[]'::jsonb,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_pass_email on roof_passports (lower(email));
create index if not exists idx_pass_phone on roof_passports (phone);
create index if not exists idx_pass_address on roof_passports (lower(address));
create index if not exists idx_pass_lead on roof_passports (lead_id);

-- 6. roof_health_scores
create table if not exists roof_health_scores (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid references roof_passports(id) on delete cascade,
  session_id uuid references sales_sessions(id) on delete set null,
  score int not null, band text, created_at timestamptz default now()
);
create index if not exists idx_scores_passport on roof_health_scores (passport_id);
create index if not exists idx_scores_session on roof_health_scores (session_id);

-- 7. passport_photos
create table if not exists passport_photos (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid references roof_passports(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  session_id uuid references sales_sessions(id) on delete set null,
  assessment_id uuid references roof_assessments(id) on delete set null,
  path text, url text, file_type text, caption text, uploaded_by text,
  created_at timestamptz default now()
);
create index if not exists idx_photos_passport on passport_photos (passport_id);
create index if not exists idx_photos_lead on passport_photos (lead_id);

-- 8. passport_documents
create table if not exists passport_documents (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid references roof_passports(id) on delete cascade,
  name text, path text, url text, file_type text, uploaded_by text,
  issued date, expires date, created_at timestamptz default now()
);
create index if not exists idx_docs_passport on passport_documents (passport_id);

-- 9. recommendations
create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid references roof_passports(id) on delete cascade,
  session_id uuid references sales_sessions(id) on delete set null,
  text text not null, priority text, category text,
  created_at timestamptz default now()
);
create index if not exists idx_recs_passport on recommendations (passport_id);
create index if not exists idx_recs_session on recommendations (session_id);

-- 10. memberships
create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid references roof_passports(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  tier text, status text default 'interest', interest boolean default true,
  since date, renews date,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_mem_passport on memberships (passport_id);
create index if not exists idx_mem_lead on memberships (lead_id);

-- 11. follow_ups
create table if not exists follow_ups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  rep_id uuid references reps(id) on delete set null,
  due_date date, status text default 'open', notes text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_follow_lead on follow_ups (lead_id);
create index if not exists idx_follow_rep on follow_ups (rep_id);

-- updated_at triggers
do $$ declare t text; begin
  foreach t in array array['reps','leads','roof_passports','memberships','follow_ups'] loop
    execute format('drop trigger if exists trg_%1$s_updated on %1$s;', t);
    execute format('create trigger trg_%1$s_updated before update on %1$s for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- ── Row Level Security ───────────────────────────────────────────────
-- Enable RLS on every table. We do NOT add public/anon policies: all reads/writes
-- happen server-side with the SERVICE ROLE key, which bypasses RLS. This means
-- homeowner records are never publicly listable. Add scoped policies later if you
-- introduce authenticated reps/admins via Supabase Auth.
do $$ declare t text; begin
  foreach t in array array['reps','leads','sales_sessions','roof_assessments','roof_passports',
    'roof_health_scores','passport_photos','passport_documents','recommendations','memberships','follow_ups'] loop
    execute format('alter table %s enable row level security;', t);
  end loop;
end $$;
