import type { RoofPassport } from "@/types/sales";
import MembershipPanel from "@/components/sales/MembershipPanel";
import PrintButton from "@/components/sales/PrintButton";

function fmt(d: string) { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }

export default function PassportView({ p }: { p: RoofPassport }) {
  const latest = p.scoreHistory[p.scoreHistory.length - 1];
  return (
    <div className="pass">
      <header className="pass-bar">
        <div className="pass-brand"><img src="/assets/elytra-shield-icon.png" width={30} height={30} alt="" /> Digital Roof Passport™</div>
        <PrintButton />
      </header>
      <main className="pass-main">
        <section className="pass-hero">
          <div>
            <div className="pass-owner">{p.property.owner || "Homeowner"}</div>
            <div className="pass-addr">{[p.property.address, p.property.city].filter(Boolean).join(", ") || "—"}</div>
            <div className="pass-id">Record #{p.id} · since {fmt(p.createdAt)}</div>
          </div>
          <div className="pass-score">
            <div className="pass-score-num">{latest ? latest.score : "—"}</div>
            <div className="pass-score-sub">Roof Health Assessment™{latest ? " · " + latest.band : ""}</div>
          </div>
        </section>

        <div className="pass-cols">
          <section className="pass-card">
            <h3>Roof Health Score history</h3>
            <div className="pass-spark">
              {p.scoreHistory.map((s) => (
                <div key={s.date} className="pass-bar"><i style={{ height: s.score + "%" }} /><b>{s.score}</b><span>{fmt(s.date)}</span></div>
              ))}
            </div>
          </section>

          <section className="pass-card">
            <h3>Inspection history</h3>
            <ul className="pass-timeline">
              {p.inspections.map((x, i) => <li key={i}><b>{fmt(x.date)}</b>{x.summary}{x.inspector ? <em> — {x.inspector}</em> : null}</li>)}
            </ul>
          </section>

          <section className="pass-card">
            <h3>Photos</h3>
            {p.photos.length ? (
              <div className="pass-photos">{p.photos.map((ph, i) => <figure key={i}><img src={ph.url} alt={ph.caption || ""} /><figcaption>{ph.caption} · {fmt(ph.date)}</figcaption></figure>)}</div>
            ) : <p className="pass-empty">No photos yet.</p>}
          </section>

          <section className="pass-card">
            <h3>Preservation history</h3>
            {p.preservation.length ? (
              <ul className="pass-timeline">{p.preservation.map((x, i) => <li key={i}><b>{fmt(x.date)}</b>{x.treatment}{x.notes ? <em> — {x.notes}</em> : null}</li>)}</ul>
            ) : <p className="pass-empty">No treatments on record yet.</p>}
          </section>

          <section className="pass-card">
            <h3>Warranty & documents</h3>
            {p.warranties.length ? (
              <ul className="pass-docs">{p.warranties.map((x, i) => <li key={i}><span>{x.name}</span><em>{fmt(x.issued)}{x.expires ? " – " + fmt(x.expires) : ""}</em></li>)}</ul>
            ) : <p className="pass-empty">No documents stored yet.</p>}
          </section>

          <section className="pass-card">
            <h3>Future recommendations</h3>
            <ul className="pass-timeline">
              {p.recommendations.map((x, i) => <li key={i}><b>{fmt(x.date)}</b>{x.text}{x.priority ? <em className={"prio " + x.priority}> {x.priority}</em> : null}</li>)}
            </ul>
          </section>
        </div>

        <section className="pass-membership">
          <div className="pass-mem-head">
            <h3>Roof Assurance Plan™</h3>
            <p>Keep this roof documented, monitored, and protected year after year.</p>
          </div>
          <MembershipPanel
            passportId={p.id}
            existing={p.membership && p.membership.status === "active"
              ? { tier: p.membership.tier, status: "Active", start_date: p.membership.since, renewal_date: p.membership.renews }
              : null}
          />
        </section>

        <p className="pass-foot">A Digital Roof Passport™ is a maintained record of your roof. Scores and recommendations are confirmed on-site; preservation is for eligible roofs.</p>
      </main>
    </div>
  );
}
