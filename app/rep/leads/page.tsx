import { redirect } from "next/navigation";
import Shell from "@/components/dashboard/Shell";
import FilterBar from "@/components/crm/FilterBar";
import NewLeadForm from "@/components/crm/NewLeadForm";
import StatusSelect from "@/components/crm/StatusSelect";
import { getCurrentRep } from "@/lib/sales/auth";
import { listLeads } from "@/lib/sales/crm";
import { statusColor } from "@/lib/sales/crm-constants";

export const dynamic = "force-dynamic";

export default async function LeadsPage({ searchParams }: { searchParams: { [k: string]: string | undefined } }) {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login");
  const leads = await listLeads(ctx, {
    q: searchParams.q, status: searchParams.status, source: searchParams.source, city: searchParams.city, sort: searchParams.sort,
  });
  return (
    <Shell title="Leads" area="Field" user={ctx}>
      <div className="crm-leadbar"><FilterBar /><NewLeadForm /></div>
      <p className="dash-note" style={{ margin: "10px 0" }}>{leads.length} lead{leads.length === 1 ? "" : "s"}</p>
      {leads.length === 0 ? <p className="dash-empty">No leads match. Add one with “+ New Lead”.</p> : (
        <div className="crm-cards">
          {leads.map((l) => (
            <div className="crm-card" key={l.id}>
              <div className="crm-card-top">
                <a href={`/rep/leads/${l.id}`} className="crm-name">{l.name || "Unnamed lead"}</a>
                <span className="crm-badge" style={{ background: statusColor(l.status || "New") }}>{l.status || "New"}</span>
              </div>
              <div className="crm-meta">
                {l.city ? <span>{l.city}</span> : null}{l.address ? <span>{l.address}</span> : null}
                {l.roof_age != null ? <span>Roof {l.roof_age} yrs</span> : null}
                {l.latest_score != null ? <span>Score {l.latest_score}</span> : null}
                {l.insurance_concern ? <span className="crm-tag">Insurance</span> : null}
                {l.visible_damage ? <span className="crm-tag">Damage</span> : null}
                <span className="crm-src">{l.source}</span>
              </div>
              <div className="crm-actions">
                {l.phone ? <a href={`tel:${l.phone}`}>Call</a> : null}
                {l.phone ? <a href={`sms:${l.phone}`}>Text</a> : null}
                {l.email ? <a href={`mailto:${l.email}`}>Email</a> : null}
                <a href={`/sales?lead=${l.id}`}>Present</a>
                <a href={l.phone ? `/passport?phone=${encodeURIComponent(l.phone)}` : `/passport`}>Passport</a>
                <a href={`/rep/leads/${l.id}`}>Details</a>
              </div>
              <StatusSelect leadId={l.id} status={l.status} />
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}
