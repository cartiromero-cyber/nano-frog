'use client';
import type { StepProps } from "@/types/sales";

/**
 * Owner-requested coverage explainer — warranty, year-one, Continuity, and Refresh,
 * explained like you would to a kindergartener. Shown on BOTH decision branches
 * (adaptive framing). Doctrine notes: the warranty is described structurally (no
 * term lengths — the attorney document defines those); the Continuity Program is
 * EXPLAINED here, never pitched — enrollment is offered at the year-one visit
 * (LIFE-1), and the rep script says so out loud.
 */

const CARDS: { title: string; simple: string; detail: string }[] = [
  {
    title: "The Warranty",
    simple: "If we did it wrong, we fix it. Free.",
    detail:
      "Our application is photo-verified and guaranteed in writing. Missed spot? Application problem? We come back and make it right at no charge. What no honest company can warranty: storms breaking things, or a roof simply getting old — and we'll never pretend otherwise.",
  },
  {
    title: "Year One — The Check-Up (included)",
    simple: "Like a dentist visit for your roof. We come back. Free.",
    detail:
      "About a year from now we re-score the roof, take fresh photos, and update your Roof Passport™. If any spot needs more membrane and it traces to our application, the touch-up is on us. If it's something new, you get an honest quote in writing before anything happens.",
  },
  {
    title: "The Continuity Program™ (years 2+)",
    simple: "We keep watch, every year — so nothing sneaks up on you.",
    detail:
      "An optional yearly program — $259/yr — offered at your year-one visit, never today: annual score and photos, Passport updates, a storm review when weather hits, small touch-ups included (up to 2 squares a year), and your pricing stays locked. Stop any time; your report is always yours.",
  },
  {
    title: "Preservation Refresh™ (around year 5)",
    simple: "A fresh coat when it's due — like re-waterproofing good boots.",
    detail:
      "Around year five, protected roofs are due for a refresh application. Stay continuous in the program and you get it at your original price — the price you were quoted today, held for years. Lapse, and it's simply a fresh assessment at then-current pricing.",
  },
];

export default function StepPlainEnglish({ session }: StepProps) {
  const approved = session.decision === "approved";
  return (
    <div className="s-wrap">
      <div style={{ textAlign: "center" }}>
        <span className="s-eyebrow">In plain English</span>
        <h2 className="s-h">{approved ? "What protects you now." : "How the protection works."}</h2>
        <p className="s-lead" style={{ margin: "0 auto" }}>
          No fine print voice, no jargon — here&rsquo;s the whole safety net, the way we&rsquo;d explain
          it to a neighbor{approved ? "." : " — whenever you're ready."}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14, maxWidth: 920, margin: "24px auto 0" }}>
        {CARDS.map((c) => (
          <div key={c.title} className="s-card" style={{ textAlign: "left" }}>
            <b style={{ color: "#fff" }}>{c.title}</b>
            <div style={{ color: "var(--score)", fontFamily: "var(--disp)", fontWeight: 600, margin: "6px 0 8px", fontSize: "1.02rem" }}>
              &ldquo;{c.simple}&rdquo;
            </div>
            <p style={{ color: "rgba(234,242,248,.78)", fontSize: ".92rem", lineHeight: 1.6, margin: 0 }}>{c.detail}</p>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", fontSize: ".78rem", color: "rgba(234,242,248,.55)", marginTop: 18, maxWidth: "62ch", marginLeft: "auto", marginRight: "auto" }}>
        The lifecycle in one breath: <b style={{ color: "rgba(234,242,248,.85)" }}>Assessment → Protection → yearly check-ups → Refresh</b>.
        Nothing here needs a decision today — it&rsquo;s simply what your roof&rsquo;s future looks like, in writing.
      </p>
    </div>
  );
}
