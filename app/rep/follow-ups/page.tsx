import { redirect } from "next/navigation";
import Shell from "@/components/dashboard/Shell";
import CompleteFollowUp from "@/components/crm/CompleteFollowUp";
import { getCurrentRep } from "@/lib/sales/auth";
import { listFollowUps } from "@/lib/sales/crm";

export const dynamic = "force-dynamic";
const BUCKETS = ["today", "overdue", "upcoming", "completed"];

export default async function FollowUpsPage({ searchParams }: { searchParams: { bucket?: string } }) {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login");
  const bucket = BUCKETS.includes(searchParams.bucket || "") ? searchParams.bucket! : "today";
  const items = await listFollowUps(ctx, bucket);
  const fmt = (s?: string) => (s ? new Date(s).toLocaleDateString() : "—");
  return (
    <Shell title="Follow-ups" area="Field" user={ctx}>
      <div className="crm-tabs">
        {BUCKETS.map((b) => <a key={b} className={"crm-tab" + (b === bucket ? " on" : "")} href={`/rep/follow-ups?bucket=${b}`}>{b[0].toUpperCase() + b.slice(1)}</a>)}
      </div>
      {items.length === 0 ? <p className="dash-empty">Nothing here.</p>
        : <ul className="crm-list big">{items.map((f: any) => (
          <li key={f.id}>
            <div><b>{f.leads?.name || "Lead"}</b><span>{f.type} · due {fmt(f.due_date)} · {f.leads?.city || ""}{f.leads?.phone ? " · " + f.leads.phone : ""}</span>{f.notes ? <em>{f.notes}</em> : null}</div>
            {bucket !== "completed" ? <CompleteFollowUp id={f.id} /> : <span className="crm-done">Done</span>}
          </li>))}</ul>}
    </Shell>
  );
}
