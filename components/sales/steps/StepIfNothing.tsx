'use client';
import type { StepProps } from "@/types/sales";

// Owner-requested bridge slide (approved): between the honest verdict and the preservation
// opportunity. Three neutral realities — no fear tactics, no scare language. Prevents the
// "great, I need nothing" mental checkout after a NO verdict.

const REALITIES: [string, string][] = [
  ["Normal aging continues", "Sun, moisture, and temperature keep working on the shingles every day — at the same gradual pace as before."],
  ["Future repair risk increases", "As shingles dry and stiffen, small issues become more likely and more expensive to address."],
  ["Replacement eventually becomes necessary", "Every roof reaches the end of its serviceable life. Doing nothing simply lets that date arrive on its own schedule."],
];

export default function StepIfNothing(_: StepProps) {
  return (
    <div className="s-wrap">
      <span className="s-eyebrow">The honest baseline</span>
      <h2 className="s-h">What happens if we do nothing?</h2>
      <p className="s-lead">Doing nothing is a real option — here is what it looks like, plainly.</p>
      <div style={{ display: "grid", gap: 12, marginTop: 22, maxWidth: 720 }}>
        {REALITIES.map(([t, d], n) => (
          <div key={t} className="s-card" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontFamily: "var(--disp)", fontWeight: 600, color: "var(--score)", fontSize: "1.1rem", lineHeight: 1.4 }}>{n + 1}</span>
            <div>
              <b style={{ color: "#fff" }}>{t}</b>
              <div style={{ color: "rgba(234,242,248,.78)", fontSize: ".95rem", marginTop: 2 }}>{d}</div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: "rgba(234,242,248,.75)", marginTop: 20, maxWidth: "56ch" }}>
        No emergency — just a timeline. The only question is whether it runs on its own schedule,
        or whether we slow it down.
      </p>
    </div>
  );
}
