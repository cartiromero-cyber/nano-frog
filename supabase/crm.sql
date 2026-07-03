-- Elytra Shield — Rep CRM additions. Run AFTER schema.sql + auth.sql. Safe to re-run.
alter table leads add column if not exists roof_age int;
alter table leads add column if not exists insurance_concern boolean;
alter table leads add column if not exists visible_damage boolean;
alter table leads add column if not exists latest_score int;
alter table leads add column if not exists next_follow_up_at timestamptz;
alter table leads add column if not exists last_contacted_at timestamptz;
create index if not exists idx_leads_status on leads (status);
create index if not exists idx_leads_city on leads (lower(city));
create index if not exists idx_leads_nextfu on leads (next_follow_up_at);

alter table follow_ups add column if not exists type text;
alter table follow_ups add column if not exists completed_at timestamptz;
create index if not exists idx_follow_due on follow_ups (due_date);

create table if not exists lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  rep_id uuid references reps(id) on delete set null,
  note text not null, type text default 'General',
  created_at timestamptz default now()
);
create index if not exists idx_notes_lead on lead_notes (lead_id);
alter table lead_notes enable row level security;
