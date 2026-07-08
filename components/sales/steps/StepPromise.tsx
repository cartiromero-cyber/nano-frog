'use client';
import type { StepProps } from "@/types/sales";

const PILLARS = [
  ["Ongoing support", "Someone you can actually call when questions arise."],
  ["Education", "Helping you understand your roof, not just service it."],
  ["Transparency", "Honest guidance before small concerns become big ones."],
  ["Monitoring", "Tracking your roof's condition over time."],
];

export default function StepPromise(_: StepProps) {
  return (
    <div className="s-wrap promise">
      <span className="s-eyebrow">The Elytra Shield Promise</span>
      <h2 className="s-h">Protection doesn't end when the application does.</h2>
      <p className="s-lead">
        When you choose Elytra Shield, you join a protection program built around the long-term care of
        your home — designed to help you understand, monitor, and preserve your roof over time.
      </p>

      <div className="pr-grid">
        {PILLARS.map(([t, d]) => (
          <div className="pr-card" key={t}><b>{t}</b><span>{d}</span></div>
        ))}
      </div>

      {/* F4: the Roof Lifecycle (DOC-5) — shown post-decision as the road ahead */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", margin: "22px 0 6px" }}>
        {[["Year 0", "Assessment"], ["Year 0", "Protection"], ["Year 1", "Complimentary Reassessment"], ["Years 2+", "Continuity Program™"], ["~Year 5", "Preservation Refresh™"]].map(([yr, label], n, arr) => (
          <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 999, padding: "6px 14px", fontSize: ".8rem", color: "rgba(234,242,248,.85)" }}>
              <b style={{ color: "var(--score)" }}>{yr}</b>&nbsp; {label}
            </span>
            {n < arr.length - 1 ? <span style={{ color: "rgba(234,242,248,.4)" }}>→</span> : null}
          </span>
        ))}
      </div>
      <p className="pr-mid">
        Your first annual reassessment is already included — we&rsquo;ll be back next year to re-score
        the roof and update your Passport, no charge. Our goal is simple: to help homeowners make
        informed decisions before small concerns become expensive problems. Real protection isn't just
        a product — it's a commitment. And that's the standard we hold ourselves to on every home we service.
      </p>

      <div className="pr-close">
        <p>Most companies sell a roof service. <b>Elytra Shield sells protection.</b></p>
        <p>Most companies show up when there's already a problem. <b>Elytra Shield helps protect your roof before the problem starts.</b></p>
        <p className="pr-kicker">Because the best roof repair is the one you never have to make.</p>
      </div>
    </div>
  );
}
