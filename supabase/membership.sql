-- Nano Frog — Roof Assurance Plan(TM) memberships. Run AFTER org.sql. Safe to re-run.
alter table memberships add column if not exists rep_id uuid references reps(id) on delete set null;
alter table memberships add column if not exists start_date date;
alter table memberships add column if not exists renewal_date date;
alter table memberships add column if not exists price numeric;
alter table memberships add column if not exists notes text;
alter table memberships add column if not exists enrolled_at timestamptz;
alter table memberships add column if not exists cancelled_at timestamptz;
-- Stripe placeholders (no processing yet — structure only)
alter table memberships add column if not exists stripe_customer_id text;
alter table memberships add column if not exists stripe_subscription_id text;
alter table memberships add column if not exists payment_status text;
create index if not exists idx_mem_rep on memberships (rep_id);
create index if not exists idx_mem_status on memberships (status);
create index if not exists idx_mem_renewal on memberships (renewal_date);
