import { redirect, notFound } from "next/navigation";
import Shell from "@/components/dashboard/Shell";
import RepForm from "@/components/crm/RepForm";
import { getCurrentRep } from "@/lib/sales/auth";
import { getRep, listReps, canAccessAdminOrg } from "@/lib/sales/org";
import { statusColor } from "@/lib/sales/crm-constants";

export const dynamic = "force-dynamic";

export default async function EditRepPage({ params }: { params: { id: string } }) {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login");
  if (!canAccessAdminOrg(ctx)) redirect("/rep");
  const data = await getRep(ctx, params.id);
  if (!data) notFound();
  const all = await listReps(ctx, {});
  const managers = all.filter((r) => r.role === "MANAGER" || r.role === "ADMIN").map((r) => ({ id: r.id, name: r.name }));
  const r = data.rep;
  const readonly = ctx.role === "MANAGER" && r.role === "ADMIN";
  return (
    <Shell title={r.name || "Rep"} area="Management" user={ctx}>
      <p className="dash-note"><a href="/admin/reps">\u2190 Back to reps</a></p>
      <div className="crm-detail">
        <section className="dash-card">
          <h3>Profile</h3>
          {readonly ? <p className="dash-empty">You can view but not edit an admin user.</p>
            : <RepForm mode="edit" rep={r} managers={managers} canSetAdmin={ctx.role === "ADMIN"} />}
        </section>
        <section className="dash-card">
          <h3>Performance</h3>
          <div className="rep-stats big">
            <span>{r.perf?.assignedLeads ?? 0}<i>leads</i></span>
            <span>{r.perf?.presentations ?? 0}<i>presentations</i></span>
            <span>{r.perf?.sold ?? 0}<i>sold</i></span>
            <span>{r.perf?.conversion ?? 0}%<i>conversion</i></span>
            <span>{r.perf?.overdue ?? 0}<i>overdue</i></span>
          </div>
          <p className="dash-note" style={{ marginTop: 10 }}>Role: <b>{r.role}</b> \u00b7 Territory: <b>{r.territory || "\u2014"}</b> \u00b7 {r.active ? "Active" : "Inactive"}</p>
        </section>
        <section className="dash-card" style={{ gridColumn: "1 / -1" }}>
          <h3>Assigned leads</h3>
          {data.leads.length === 0 ? <p className="dash-empty">No leads assigned.</p>
            : <ul className="crm-list">{data.leads.map((l: any) => (
              <li key={l.id}><a href={`/rep/leads/${l.id}`}><b>{l.name || "Lead"}</b><span style={{ color: statusColor(l.status) }}>{l.status}{l.city ? " \u00b7 " + l.city : ""}</span></a></li>))}</ul>}
          <p className="dash-note" style={{ marginTop: 8 }}><a href={`/admin/leads?rep=${r.id}`}>Open in lead manager \u2192</a></p>
        </section>
      </div>
    </Shell>
  );
}
