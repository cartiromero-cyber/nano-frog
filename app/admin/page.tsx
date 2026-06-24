import { redirect } from "next/navigation";
import Shell from "@/components/dashboard/Shell";
import StatCard from "@/components/dashboard/StatCard";
import { getAdminMetrics } from "@/lib/sales/metrics";
import { adminActivity } from "@/lib/sales/crm";
import { membershipMetricsAdmin } from "@/lib/sales/membership";
import { getCurrentRep } from "@/lib/sales/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login");
  if (ctx.role !== "ADMIN") redirect("/rep");
  const m = await getAdminMetrics();
  const a = await adminActivity();
  const mem = await membershipMetricsAdmin();
  const memCount = (s: string) => mem ? (mem.byStatus.find((x) => x.status === s)?.count ?? 0) : 0;
  return (
    <Shell title="Admin Dashboard" area="Operations" user={ctx}>
      <div className="crm-quick" style={{ marginBottom: 16 }}>
        <a className="sales-btn solid" href="/admin/reps">Manage Reps</a>
        <a className="sales-btn ghost" href="/admin/leads">Lead Manager</a>
      </div>
      <div className="stat-grid">
        <StatCard label="Total Leads" value={String(m.leads)} />
        <StatCard label="Presentations" value={String(m.presentations)} />
        <StatCard label="Assessment Requests" value={String(m.assessments)} />
        <StatCard label="Conversion Rate" value={m.conversionRate + "%"} />
        <StatCard label="Overdue Follow-ups" value={String(a?.overdue ?? 0)} />
        <StatCard label="Revenue" value={"$" + m.revenue.toLocaleString()} hint="placeholder" />
      </div>

      <div className="dash-2col">
        <section className="dash-card">
          <h3>Leads by status</h3>
          {a ? <table className="dash-table"><tbody>{a.statusCounts.map((s) => <tr key={s.status}><td>{s.status}</td><td>{s.count}</td></tr>)}</tbody></table>
            : <p className="dash-empty">Connect Supabase to see activity.</p>}
        </section>
        <section className="dash-card">
          <h3>City / territory</h3>
          {m.cities.length === 0 ? <p className="dash-empty">No data yet.</p>
            : <table className="dash-table"><tbody>{m.cities.map((c) => <tr key={c.city}><td>{c.city}</td><td>{c.count}</td></tr>)}</tbody></table>}
        </section>
      </div>

      <section className="dash-card">
        <h3>Rep activity & conversion</h3>
        {a && a.repActivity.length ? (
          <table className="dash-table">
            <thead><tr><th>Rep</th><th>Territory</th><th>Presentations</th><th>Sold</th><th>Open follow-ups</th><th>Conversion</th></tr></thead>
            <tbody>{a.repActivity.map((r) => <tr key={r.name}><td>{r.name}</td><td>{r.territory || "—"}</td><td>{r.presentations}</td><td>{r.sold}</td><td>{r.openFollowUps}</td><td>{r.conversion}%</td></tr>)}</tbody>
          </table>
        ) : <p className="dash-empty">No rep activity yet.</p>}
      </section>

      <h2 className="dash-h" style={{ fontSize: "1.3rem", marginTop: 26 }}>Roof Assurance Plan™ memberships</h2>
      <div className="stat-grid">
        <StatCard label="Interested" value={String(memCount("Interested"))} />
        <StatCard label="Enrolled" value={String(memCount("Enrolled"))} />
        <StatCard label="Active" value={String(memCount("Active"))} />
        <StatCard label="Pending Payment" value={String(memCount("Pending Payment"))} />
        <StatCard label="Cancelled" value={String(memCount("Cancelled"))} />
        <StatCard label="Renewals (60d)" value={String(mem?.upcomingRenewals ?? 0)} />
      </div>
      <div className="dash-2col">
        <section className="dash-card">
          <h3>Memberships by rep</h3>
          {mem && mem.byRep.length ? <table className="dash-table"><thead><tr><th>Rep</th><th>Enrolled</th><th>Interested</th></tr></thead>
            <tbody>{mem.byRep.map((r) => <tr key={r.name}><td>{r.name}</td><td>{r.enrolled}</td><td>{r.interested}</td></tr>)}</tbody></table>
            : <p className="dash-empty">No membership data yet.</p>}
        </section>
        <section className="dash-card">
          <h3>Memberships by city</h3>
          {mem && mem.byCity.length ? <table className="dash-table"><tbody>{mem.byCity.map((c) => <tr key={c.city}><td>{c.city}</td><td>{c.count}</td></tr>)}</tbody></table>
            : <p className="dash-empty">No membership data yet.</p>}
        </section>
      </div>

      <p className="dash-note">{m.live ? "Live data from Supabase." : "Supabase not connected — demo mode. See docs/AUTH.md."}</p>
    </Shell>
  );
}
