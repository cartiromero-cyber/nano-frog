'use client';
import type { StepProps } from "@/types/sales";

const PROTECT = [
  ["Our vehicles", "We wax them."],
  ["Our phones", "We case them — for a fraction of a roof's cost."],
  ["Our driveways", "We seal them."],
  ["Our decks", "We stain them."],
  ["Our doors", "We weatherproof them."],
  ["Our paint", "We add protection film."],
];

export default function StepWhyChoose(_: StepProps) {
  return (
    <div className="s-wrap why-choose">
      <span className="s-eyebrow">Why homeowners choose Nano Frog</span>
      <h2 className="s-h">You already protect the things you care about.</h2>
      <p className="s-lead">Most homeowners don't think twice about protecting what matters.</p>

      <div className="wc-grid">
        {PROTECT.map(([t, d]) => (
          <div className="wc-chip" key={t}><b>{t}</b><span>{d}</span></div>
        ))}
      </div>

      <p className="wc-pivot">
        Yet the one thing protecting everything you own — your family, your belongings, your memories,
        and one of the largest investments you'll ever make — is left exposed to years of sun, rain,
        wind, and UV.
      </p>

      <div className="wc-lines">
        <p>Every day the sun breaks down roofing materials.</p>
        <p>Every storm removes a little more protection.</p>
        <p>Every season adds wear.</p>
        <p className="wc-dim">The deterioration is gradual — which is why most homeowners don't notice it until the damage becomes expensive.</p>
      </div>

      <div className="wc-close">
        <p><b>This isn't a treatment. It's proactive protection.</b></p>
        <p>An additional layer designed to help your roof resist weather, moisture, UV, and aging — added <em>before</em> those problems occur.</p>
        <p>More and more homeowners are choosing Nano Frog. Not because they have a problem — because they want to avoid one.</p>
        <p className="wc-kicker">Because protecting your roof today is far less expensive than replacing it tomorrow.</p>
      </div>
    </div>
  );
}
