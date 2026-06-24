import { membershipTiers } from "@/content/membership";
export default function MembershipTiers() {
  return (
    <div className="mem-grid">
      {membershipTiers.map((t) => (
        <div key={t.name} className={"mem-card" + (t.highlighted ? " hi" : "")}>
          {t.highlighted ? <span className="mem-flag">Most popular</span> : null}
          <h4>{t.name}</h4>
          <p className="mem-tag">{t.tagline}</p>
          <div className="mem-cadence">{t.cadence} membership</div>
          <ul>{t.features.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}
