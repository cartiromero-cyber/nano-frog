import { redirect } from "next/navigation";
import Shell from "@/components/dashboard/Shell";
import { getCurrentRep } from "@/lib/sales/auth";
import { listReps, canAccessAdminOrg } from "@/lib/sales/org";

export const dynamic = "force-dynamic";

export default async function RepsPage({ searchParams }: { searchParams: { q?: string; role?: string; active?: string } }) {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login");
  if (!canAccessAdminOrg(ctx)) redirect("/rep");
  const reps = await listReps(ctx, { q: searchParams.q, role: searchParams.role, active: searchParams.active });
  return (
    <Shell title="Reps" area="Management" user={ctx}>
      <div className="crm-leadbar">
        <form className="crm-filters" action="/admin/reps">
          <input className="crm-search" name="q" placeholder="Search name, email, territory, role" defaultValue={searchParams.q || ""} />
          <select name="role" defaultValue={searchParams.role || ""}><option value="">All roles</option><option>REP</option><option>MANAGER</option><option>ADMIN</option></select>
          <select name="active" defaultValue={searchParams.active || ""}><option value="">All</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
          <button className="sales-btn ghost">Search</button>
        </form>
        {ctx.role === "ADMIN" ? <a className="sales-btn solid" href="/admin/reps/new">+ New Rep</a> : null}
      </div>
      <div className="rep-cards">
        {reps.map((r) => (
          <a className="rep-card" key={r.id} href={`/admin/reps/${r.id}`}>
            <div className="rep-card-top"><b>{r.name}</b><span className={"rep-badge " + (r.active ? "on" : "off")}>{r.active ? r.role : "Inactive"}</span></div>
            <div className="rep-sub">{r.email}{r.territory ? " \u00b7 " + r.territory : ""}</div>
            <div className="rep-stats">
              <span>{r.perf?.assignedLeads ?? 0}<i>leads</i></span>
              <span>{r.perf?.presentations ?? 0}<i>pres.</i></span>
              <span>{r.perf?.sold ?? 0}<i>sold</i></span>
              <span>{r.perf?.conversion ?? 0}%<i>conv.</i></span>
              <span>{r.perf?.overdue ?? 0}<i>overdue</i></span>
            </div>
          </a>
        ))}
        {reps.length === 0 ? <p className="dash-empty">No reps found.</p> : null}
      </div>
    </Shell>
  );
}
