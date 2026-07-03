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

      <p className="pr-mid">
        Our goal is simple: to help homeowners make informed decisions before small concerns become
        expensive problems. Real protection isn't just a product — it's a commitment. And that's the
        standard we hold ourselves to on every home we service.
      </p>

      <div className="pr-close">
        <p>Most companies sell a roof service. <b>Elytra Shield sells protection.</b></p>
        <p>Most companies show up when there's already a problem. <b>Elytra Shield helps protect your roof before the problem starts.</b></p>
        <p className="pr-kicker">Because the best roof repair is the one you never have to make.</p>
      </div>
    </div>
  );
}
