import { redirect } from "next/navigation";
import Shell from "@/components/dashboard/Shell";
import AssignSelect from "@/components/crm/AssignSelect";
import BulkAssignBar from "@/components/crm/BulkAssignBar";
import StatusSelect from "@/components/crm/StatusSelect";
import { getCurrentRep } from "@/lib/sales/auth";
import { listAdminLeads } from "@/lib/sales/org";
import { statusColor, LEAD_STATUSES } from "@/lib/sales/crm-constants";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({ searchParams }: { searchParams: { status?: string; rep?: string; city?: string; source?: string; unassigned?: string } }) {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login");
  if (ctx.role === "REP") redirect("/rep");
  const { leads, reps } = await listAdminLeads(ctx, {
    status: searchParams.status, rep: searchParams.rep, city: searchParams.city, source: searchParams.source, unassigned: searchParams.unassigned === "1",
  });
  return (
    <Shell title="Lead Manager" area="Management" user={ctx}>
      <form className="crm-filters" action="/admin/leads" style={{ marginBottom: 12 }}>
        <select name="status" defaultValue={searchParams.status || ""}><option value="">All statuses</option>{LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select name="rep" defaultValue={searchParams.rep || ""}><option value="">All reps</option>{(reps as any[]).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
        <input className="crm-city" name="city" placeholder="City" defaultValue={searchParams.city || ""} />
        <label className="bulk-check"><input type="checkbox" name="unassigned" value="1" defaultChecked={searchParams.unassigned === "1"} /> Unassigned</label>
        <button className="sales-btn ghost">Filter</button>
      </form>

      <BulkAssignBar reps={reps as any[]} />

      <p className="dash-note" style={{ margin: "10px 0" }}>{leads.length} lead{leads.length === 1 ? "" : "s"}</p>
      <div className="crm-cards">
        {(leads as any[]).map((l) => (
          <div className="crm-card" key={l.id}>
            <div className="crm-card-top"><a className="crm-name" href={`/rep/leads/${l.id}`}>{l.name || "Unnamed"}</a>
              <span className="crm-badge" style={{ background: statusColor(l.status || "New") }}>{l.status || "New"}</span></div>
            <div className="crm-meta">{l.city ? <span>{l.city}</span> : null}{l.latest_score != null ? <span>Score {l.latest_score}</span> : null}
              <span className="crm-src">{l.source}</span><span className={"rep-owner" + (l.rep_id ? "" : " un")}>{l.rep_name || "Unassigned"}</span></div>
            <div className="crm-form-row">
              <AssignSelect leadId={l.id} current={l.rep_id} reps={reps as any[]} />
              <StatusSelect leadId={l.id} status={l.status} />
            </div>
          </div>
        ))}
        {leads.length === 0 ? <p className="dash-empty">No leads match.</p> : null}
      </div>
    </Shell>
  );
}
