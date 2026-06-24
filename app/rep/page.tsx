import { redirect } from "next/navigation";
import Shell from "@/components/dashboard/Shell";
import StatCard from "@/components/dashboard/StatCard";
import CompleteFollowUp from "@/components/crm/CompleteFollowUp";
import { getCurrentRep } from "@/lib/sales/auth";
import { repCockpit } from "@/lib/sales/crm";
import { membershipMetricsRep } from "@/lib/sales/membership";
import { statusColor } from "@/lib/sales/crm-constants";

export const dynamic = "force-dynamic";

export default async function RepHome() {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login");
  const c = await repCockpit(ctx);
  const mem = await membershipMetricsRep(ctx);
  return (
    <Shell title={ctx.role === "REP" ? "My Day" : ctx.role === "MANAGER" ? "Team Cockpit" : "Activity Cockpit"} area="Field" user={ctx}>
      <div className="crm-quick">
        <a className="sales-btn solid" href="/rep/leads">All Leads</a>
        <a className="sales-btn ghost" href="/sales">Start Presentation</a>
        <a className="sales-btn ghost" href="/passport">Search Passport</a>
        <a className="sales-btn ghost" href="/rep/follow-ups">Follow-ups</a>
      </div>

      <div className="stat-grid" style={{ marginTop: 18 }}>
        <StatCard label="Passports created" value={String(c.passports)} />
        <StatCard label="Assessments scheduled" value={String(c.assess)} />
        <StatCard label="Membership interest" value={String(mem.interested)} />
        <StatCard label="Enrolled members" value={String(mem.enrolled)} />
        <StatCard label="Renewals soon" value={String(mem.renewals)} />
        <StatCard label="Declined" value={String(mem.declined)} />
        <StatCard label="Conversion" value={c.conversion + "%"} />
        <StatCard label="Today's follow-ups" value={String(c.todays.length)} />
      </div>

      <div className="dash-2col" style={{ marginTop: 20 }}>
        <section className="dash-card">
          <h3>Today’s follow-ups</h3>
          {c.todays.length === 0 ? <p className="dash-empty">Nothing due today. <a href="/rep/follow-ups">See all</a></p>
            : <ul className="crm-list">{c.todays.map((f: any) => (
              <li key={f.id}><div><b>{f.leads?.name || "Lead"}</b><span>{f.type} · {f.leads?.city || ""}</span></div><CompleteFollowUp id={f.id} /></li>))}</ul>}
        </section>
        <section className="dash-card">
          <h3>Hot leads</h3>
          {c.hot.length === 0 ? <p className="dash-empty">No leads yet.</p>
            : <ul className="crm-list">{c.hot.map((l: any) => (
              <li key={l.id}><a href={`/rep/leads/${l.id}`}><b>{l.name || "Lead"}</b><span style={{ color: statusColor(l.status) }}>{l.status}{l.latest_score ? " · Score " + l.latest_score : ""}</span></a></li>))}</ul>}
        </section>
      </div>

      <section className="dash-card" style={{ marginTop: 18 }}>
        <h3>Recent presentations</h3>
        {c.recent.length === 0 ? <p className="dash-empty">No presentations yet.</p>
          : <ul className="crm-list">{c.recent.map((s: any) => (
            <li key={s.id}><div><b>{s.leads?.name || "Homeowner"}</b><span>{s.recommendation_tier || "—"} · {new Date(s.created_at).toLocaleDateString()}</span></div></li>))}</ul>}
      </section>
    </Shell>
  );
}
