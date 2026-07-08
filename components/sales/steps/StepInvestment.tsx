'use client';
import type { StepProps } from "@/types/sales";
import { recommend } from "@/lib/sales/recommendation";

// P-004 (approved, unblocked by Pricing Model Rev D): the Investment slide.
// One measured price, the full stack, risk reversal — revealed here and only here.
// Bands are Rev D doctrine (Decision Register O-002). Complexity modifier is disclosed verbally
// from the printed price sheet, never improvised.

const BANDS = [
  { key: "A", label: "Band A — up to 1,800 sq ft", price: 2950 },
  { key: "B", label: "Band B — 1,801–2,600 sq ft", price: 3650 },
  { key: "C", label: "Band C — 2,601–3,500 sq ft", price: 4450 },
  { key: "D", label: "Band D — 3,500+ sq ft (measured)", price: 5400 },
];

const STACK = [
  "Roof Health Assessment ($249 value — included free)",
  "Roof Health Score™ + complete photo documentation",
  "Written verdict — preserve · monitor · replace",
  "Full preservation application",
  "Roof Passport™ — your roof's permanent record",
  "Written warranty",
  "Complimentary annual reassessment (year 1)",
  "Preservation Refresh™ eligibility",
];

export default function StepInvestment({ session, update }: StepProps) {
  const tier = recommend(session.score).tier;
  const notCandidate = tier === "Not Recommended";
  const sel = session.investment;
  const pick = (b: (typeof BANDS)[number]) =>
    update({ investment: { band: b.key, price: b.price }, cost: { ...session.cost, preservationCost: b.price } });

  if (notCandidate) return (
    <div className="s-wrap" style={{ textAlign: "center", display: "grid", placeItems: "center", minHeight: 320 }}>
      <div>
        <span className="s-eyebrow">The investment</span>
        <h2 className="s-h">There&rsquo;s nothing to buy today.</h2>
        <p className="s-lead" style={{ margin: "0 auto" }}>
          This roof&rsquo;s verdict is replacement planning — so the honest investment is zero.
          Your report and photos are yours, along with roofer referrals we take nothing for.
        </p>
      </div>
    </div>
  );

  return (
    <div className="s-wrap s-grid2">
      <div>
        <span className="s-eyebrow">The investment</span>
        <h2 className="s-h">One measured price. Everything included.</h2>
        <p className="s-lead">Your roof&rsquo;s size sets the price — not a negotiation, not a salesperson.</p>
        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          {BANDS.map((b) => (
            <button key={b.key} className={"s-chip" + (sel?.band === b.key ? " sel" : "")}
              style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "12px 16px" }}
              onClick={() => pick(b)}>
              <span>{b.label}</span>
              <b>{b.key === "D" ? `from $${b.price.toLocaleString()}` : `$${b.price.toLocaleString()}`}</b>
            </button>
          ))}
        </div>
        <p style={{ fontSize: ".74rem", color: "rgba(234,242,248,.55)", marginTop: 14, maxWidth: "52ch" }}>
          Steep pitch (&gt;8/12), 3+ stories, or difficult access adds a disclosed 10–15% — shown on the
          printed price sheet. Assessment locks this price for 12 months.
        </p>
      </div>
      <div className="s-panel" style={{ alignContent: "start", display: "grid", gap: 8, padding: 26 }}>
        <div style={{ fontFamily: "var(--disp)", fontWeight: 700, color: "#fff", fontSize: "1.05rem", marginBottom: 4 }}>
          Included with your Roof Preservation System™
        </div>
        {STACK.map((s) => (
          <div key={s} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: "rgba(234,242,248,.85)", fontSize: ".92rem" }}>
            <span style={{ color: "var(--score)", fontWeight: 700 }}>✓</span><span>{s}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(255,255,255,.14)", marginTop: 10, paddingTop: 12, color: "rgba(234,242,248,.85)", fontSize: ".9rem" }}>
          <b style={{ color: "#fff" }}>Pay when the work is done</b> — no deposit on residential preservation
          projects. Three-day right to cancel, in writing, before we start.
        </div>
        {sel ? (
          <div style={{ marginTop: 8, textAlign: "center", fontFamily: "var(--disp)", fontWeight: 700, fontSize: "1.6rem", color: "var(--score)" }}>
            {sel.band === "D" ? `from $${sel.price.toLocaleString()}` : `$${sel.price.toLocaleString()}`}
          </div>
        ) : null}
      </div>
    </div>
  );
}
