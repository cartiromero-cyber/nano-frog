'use client';
import { useState } from "react";
import type { StepProps } from "@/types/sales";
import { recommend } from "@/lib/sales/recommendation";
import ManagerBypass from "@/components/sales/ManagerBypass";

// P-004 (approved) + pricing-audit upgrade: one measured price, the full stack, risk reversal.
//
// Rep pricing panel (discreet "⋯" toggle, .no-print):
//   approximate metrics (home sq ft, pitch, height/access) → suggested band + suggested
//   complexity modifier → final price. Discretion is BOUNDED by locked doctrine O-002:
//   floor = band price (no discounts, ever), ceiling = band + 15% disclosed complexity
//   modifier. Suggested and final prices are both stored on the session for the record.

const BANDS = [
  { key: "A", label: "Band A — up to 1,800 sq ft", max: 1800, price: 2950 },
  { key: "B", label: "Band B — 1,801–2,600 sq ft", max: 2600, price: 3650 },
  { key: "C", label: "Band C — 2,601–3,500 sq ft", max: 3500, price: 4450 },
  { key: "D", label: "Band D — 3,500+ sq ft (measured)", max: Infinity, price: 5400 },
];
const MODIFIERS = [0, 10, 15] as const; // disclosed complexity modifier, % (O-002)

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

const bandFor = (sqft?: number) => (sqft ? BANDS.find((b) => sqft <= b.max)! : undefined);
const round25 = (n: number) => Math.round(n / 25) * 25;
const money = (n: number) => `$${n.toLocaleString()}`;

export default function StepInvestment({ session, update }: StepProps) {
  const tier = recommend(session.score).tier;
  const notCandidate = tier === "Not Recommended";
  const [panel, setPanel] = useState(false);
  const [bypass, setBypass] = useState(false);
  const sel = session.investment;
  const m = session.metrics || {};

  const suggestedBand = bandFor(m.homeSqFt);
  const suggestedMod = Math.min(15, (m.steepPitch ? 10 : 0) + (m.tallOrComplex ? 5 : 0));
  const suggestedPrice = suggestedBand ? round25(suggestedBand.price * (1 + suggestedMod / 100)) : undefined;

  const setMetrics = (patch: Partial<typeof m>) => update({ metrics: { ...m, ...patch } });
  const apply = (bandKey: string, modPct: number) => {
    const band = BANDS.find((b) => b.key === bandKey)!;
    const pct = Math.max(0, Math.min(15, modPct)); // O-002 bounds: no discounts, cap +15%
    const price = round25(band.price * (1 + pct / 100));
    update({
      investment: { band: band.key, price, suggested: suggestedPrice, modifierPct: pct },
      cost: { ...session.cost, preservationCost: price },
    });
  };

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
    <div className="s-wrap s-grid2" style={{ position: "relative" }}>
      <div>
        <span className="s-eyebrow">The investment</span>
        <h2 className="s-h">One measured price. Everything included.</h2>
        <p className="s-lead">Your roof&rsquo;s size sets the price — not a negotiation, not a salesperson.</p>
        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          {BANDS.map((b) => (
            <button key={b.key} className={"s-chip" + (sel?.band === b.key ? " sel" : "")}
              style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "12px 16px" }}
              onClick={() => apply(b.key, sel?.band === b.key ? sel?.modifierPct || 0 : suggestedBand?.key === b.key ? suggestedMod : 0)}>
              <span>{b.label}</span>
              <b>{b.key === "D" ? `from ${money(b.price)}` : money(b.price)}</b>
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
            {sel.band === "D" && !sel.modifierPct && !sel.managerAdjust ? `from ${money(sel.price)}` : money(sel.price)}
            {sel.managerAdjust ? (
              <div style={{ fontSize: ".7rem", fontWeight: 600, color: "#E0A12E" }}>
                ★ manager-authorized for this home (was {money(sel.managerAdjust.from)})
              </div>
            ) : sel.modifierPct ? (
              <div style={{ fontSize: ".7rem", fontWeight: 500, color: "rgba(234,242,248,.6)" }}>includes disclosed +{sel.modifierPct}% complexity modifier</div>
            ) : null}
          </div>
        ) : null}
        {sel && !sel.managerAdjust ? (
          <button className="mb-open no-print" onClick={() => setBypass(true)}>
            ◈ Elytra Manager Authorization
          </button>
        ) : null}
      </div>
      {bypass && sel ? (
        <ManagerBypass
          currentPrice={sel.price}
          bandPrice={BANDS.find((b) => b.key === sel.band)?.price || sel.price}
          onClose={() => setBypass(false)}
          onApply={(newPrice) =>
            update({
              investment: { ...sel, price: newPrice, managerAdjust: { from: sel.price } },
              cost: { ...session.cost, preservationCost: newPrice },
            })
          }
        />
      ) : null}

      {/* ── Rep pricing panel — discreet, never printed ─────────────────────────── */}
      <button aria-label="Pricing worksheet" className="no-print"
        onClick={() => setPanel((p) => !p)}
        style={{ position: "absolute", bottom: 2, right: 2, background: "none", border: "none", color: "rgba(234,242,248,.28)", fontSize: "1.1rem", cursor: "pointer", padding: 6 }}>⋯</button>
      {panel ? (
        <div className="no-print" style={{ position: "absolute", bottom: 34, right: 0, width: 320, background: "#101d2c", border: "1px solid rgba(255,255,255,.16)", borderRadius: 12, padding: 16, zIndex: 5, boxShadow: "0 18px 40px -18px rgba(0,0,0,.7)" }}>
          <div style={{ fontSize: ".72rem", letterSpacing: ".12em", color: "rgba(234,242,248,.55)", marginBottom: 10 }}>REP PRICING WORKSHEET</div>
          <label style={{ fontSize: ".78rem", color: "rgba(234,242,248,.75)" }}>Approx. home size: <b style={{ color: "#fff" }}>{m.homeSqFt ? `${m.homeSqFt.toLocaleString()} sq ft` : "—"}</b></label>
          <input className="s-range" type="range" min={800} max={5000} step={100} value={m.homeSqFt || 2000}
            onChange={(e) => setMetrics({ homeSqFt: Number(e.target.value) })} />
          <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
            <button className={"s-chip" + (m.steepPitch ? " sel" : "")} onClick={() => setMetrics({ steepPitch: !m.steepPitch })}>Steep &gt;8/12</button>
            <button className={"s-chip" + (m.tallOrComplex ? " sel" : "")} onClick={() => setMetrics({ tallOrComplex: !m.tallOrComplex })}>3+ stories / access</button>
          </div>
          {suggestedBand ? (
            <div style={{ fontSize: ".82rem", color: "rgba(234,242,248,.85)", margin: "10px 0" }}>
              Suggested: <b style={{ color: "var(--score)" }}>Band {suggestedBand.key} · {money(suggestedPrice!)}</b>
              {suggestedMod ? <span style={{ color: "rgba(234,242,248,.6)" }}> (incl. +{suggestedMod}%)</span> : null}
            </div>
          ) : <div style={{ fontSize: ".78rem", color: "rgba(234,242,248,.5)", margin: "10px 0" }}>Set home size for a suggestion.</div>}
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: ".74rem", color: "rgba(234,242,248,.6)" }}>Modifier:</span>
            {MODIFIERS.map((p) => (
              <button key={p} className={"s-chip" + ((sel?.modifierPct || 0) === p && sel ? " sel" : "")}
                onClick={() => apply(sel?.band || suggestedBand?.key || "B", p)}>{p === 0 ? "None" : `+${p}%`}</button>
            ))}
          </div>
          {suggestedBand ? (
            <button className="sales-btn solid" style={{ width: "100%", marginTop: 10 }}
              onClick={() => { apply(suggestedBand.key, suggestedMod); setPanel(false); }}>
              Apply suggestion
            </button>
          ) : null}
          <p style={{ fontSize: ".68rem", color: "rgba(234,242,248,.45)", marginTop: 8, lineHeight: 1.5 }}>
            Bounds are doctrine (O-002): floor is the band price — no discounts, ever; ceiling is the
            disclosed +15% modifier. Suggested and final prices are both saved to the record.
          </p>
        </div>
      ) : null}
    </div>
  );
}
