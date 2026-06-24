'use client';
import type { StepProps } from "@/types/sales";
import { membershipTiers, PLAN_NAME, PRICING_NOTE } from "@/content/membership";

export default function StepOptions(_: StepProps) {
  return (
    <div className="s-wrap">
      <span className="s-eyebrow">Your options</span>
      <h2 className="s-h">Choose the protection that fits your home.</h2>
      <p className="s-lead">{PLAN_NAME} — every option keeps your roof documented, monitored, and protected.</p>
      <div className="opt-grid">
        {membershipTiers.map((t) => (
          <div key={t.name} className={"opt-card" + (t.highlighted ? " hi" : "")}>
            {t.highlighted ? <span className="opt-flag">Most chosen</span> : null}
            <b>{t.name}</b><span className="opt-tag">{t.tagline}</span>
            <ul>{t.features.map((f) => <li key={f}>{f}</li>)}</ul>
            <span className="opt-price">{PRICING_NOTE}</span>
          </div>
        ))}
      </div>
      <p className="opt-note">Pick the one that feels right — your specialist confirms the details on-site.</p>
    </div>
  );
}
