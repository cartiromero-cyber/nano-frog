import { redirect, notFound } from "next/navigation";
import Shell from "@/components/dashboard/Shell";
import StatusSelect from "@/components/crm/StatusSelect";
import NoteForm from "@/components/crm/NoteForm";
import FollowUpForm from "@/components/crm/FollowUpForm";
import PhotoUpload from "@/components/crm/PhotoUpload";
import GeneratePassport from "@/components/crm/GeneratePassport";
import CompleteFollowUp from "@/components/crm/CompleteFollowUp";
import MembershipPanel from "@/components/sales/MembershipPanel";
import NurtureButtons from "@/components/crm/NurtureButtons";
import { getCurrentRep } from "@/lib/sales/auth";
import { getLeadDetail } from "@/lib/sales/crm";

export const dynamic = "force-dynamic";

export default async function LeadDetail({ params }: { params: { id: string } }) {
  const ctx = await getCurrentRep();
  if (!ctx) redirect("/login");
  const d = await getLeadDetail(ctx, params.id);
  if (!d) notFound();
  const l = d.lead;
  const fmt = (s?: string) => (s ? new Date(s).toLocaleDateString() : "—");
  return (
    <Shell title={l.name || "Lead"} area="Field" user={ctx}>
      <p className="dash-note"><a href="/rep/leads">← Back to leads</a></p>

      <div className="crm-detail">
        <section className="dash-card">
          <h3>Homeowner</h3>
          <div className="crm-kv"><span>Phone</span><b>{l.phone || "—"}</b><span>Email</span><b>{l.email || "—"}</b>
            <span>City</span><b>{l.city || "—"}</b><span>Address</span><b>{l.address || "—"}</b></div>
          <div className="crm-form-row" style={{ marginTop: 12 }}>
            {l.phone ? <a className="sales-btn ghost" href={`tel:${l.phone}`}>Call</a> : null}
            {l.phone ? <a className="sales-btn ghost" href={`sms:${l.phone}`}>Text</a> : null}
            {l.email ? <a className="sales-btn ghost" href={`mailto:${l.email}`}>Email</a> : null}
          </div>
        </section>

        <section className="dash-card">
          <h3>Property / Roof</h3>
          <div className="crm-kv"><span>Roof age</span><b>{l.roof_age != null ? l.roof_age + " yrs" : "—"}</b>
            <span>Latest score</span><b>{l.latest_score ?? "—"}</b>
            <span>Insurance concern</span><b>{l.insurance_concern ? "Yes" : "No"}</b>
            <span>Visible damage</span><b>{l.visible_damage ? "Yes" : "No"}</b></div>
          <div className="crm-form-row" style={{ marginTop: 12 }}>
            <a className="sales-btn solid" href={`/sales?lead=${l.id}`}>Start presentation</a>
            <GeneratePassport lead={l} />
          </div>
        </section>

        <section className="dash-card">
          <h3>Status</h3>
          <StatusSelect leadId={l.id} status={l.status} />
        </section>

        <section className="dash-card">
          <h3>Follow-up tasks</h3>
          {d.followUps.length === 0 ? <p className="dash-empty">None scheduled.</p>
            : <ul className="crm-list">{d.followUps.map((f: any) => (
              <li key={f.id}><div><b>{f.type}</b><span>{fmt(f.due_date)} · {f.status}</span></div>{f.status === "Open" ? <CompleteFollowUp id={f.id} /> : null}</li>))}</ul>}
          <FollowUpForm leadId={l.id} />
        </section>

        <section className="dash-card">
          <h3>Notes</h3>
          <NoteForm leadId={l.id} />
          {d.notes.length === 0 ? <p className="dash-empty">No notes yet.</p>
            : <ul className="crm-timeline">{d.notes.map((n: any) => (
              <li key={n.id}><b>{n.type} · {fmt(n.created_at)}</b>{n.note}</li>))}</ul>}
        </section>

        <section className="dash-card">
          <h3>Presentation & score history</h3>
          {d.sessions.length === 0 ? <p className="dash-empty">No presentations yet.</p>
            : <ul className="crm-list">{d.sessions.map((s: any) => (
              <li key={s.id}><div><b>{s.recommendation_tier || "Session"}</b><span>{fmt(s.created_at)}{s.next_step ? " · " + s.next_step : ""}</span></div></li>))}</ul>}
          {d.scores.length ? <div className="crm-scores">{d.scores.map((sc: any, i: number) => <span key={i}>{sc.score}</span>)}</div> : null}
        </section>

        <section className="dash-card">
          <h3>Recommendations</h3>
          {d.recommendations.length === 0 ? <p className="dash-empty">None yet.</p>
            : <ul className="crm-timeline">{d.recommendations.map((r: any) => <li key={r.id}><b>{fmt(r.created_at)}</b>{r.text}</li>)}</ul>}
        </section>

        <section className="dash-card">
          <h3>Photos</h3>
          <PhotoUpload leadId={l.id} />
          {d.photos.length === 0 ? <p className="dash-empty">No photos yet.</p>
            : <div className="crm-photos">{d.photos.map((p: any) => <img key={p.id} src={p.url} alt={p.caption || ""} />)}</div>}
        </section>

        <section className="dash-card" style={{ gridColumn: "1 / -1" }}>
          <h3>Nurture emails</h3>
          <NurtureButtons email={l.email} name={l.name} />
        </section>

        <section className="dash-card" style={{ gridColumn: "1 / -1" }}>
          <h3>Digital Roof Passport</h3>
          {d.passportId ? <p><a className="sales-btn ghost" href={l.phone ? `/passport?phone=${encodeURIComponent(l.phone)}` : "/passport"}>Open Passport</a></p>
            : <p className="dash-empty">No passport yet — generate one above.</p>}
        </section>

        <section className="dash-card" style={{ gridColumn: "1 / -1" }}>
          <h3>Elytra Continuity Program™</h3>
          <MembershipPanel leadId={l.id} passportId={d.passportId || undefined} existing={d.memberships[0] || null} />
        </section>
      </div>
    </Shell>
  );
}
