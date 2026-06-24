-- Nano Frog — Org management. Run AFTER schema.sql + auth.sql + crm.sql. Safe to re-run.
create table if not exists lead_assignment_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  previous_rep_id uuid references reps(id) on delete set null,
  new_rep_id uuid references reps(id) on delete set null,
  changed_by_rep_id uuid references reps(id) on delete set null,
  reason text,
  created_at timestamptz default now()
);
create index if not exists idx_assign_lead on lead_assignment_history (lead_id);
create index if not exists idx_assign_changedby on lead_assignment_history (changed_by_rep_id);
alter table lead_assignment_history enable row level security;
