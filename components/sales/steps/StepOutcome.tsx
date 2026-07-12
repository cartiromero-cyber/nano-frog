'use client';
import type { StepProps } from "@/types/sales";
import StepPromise from "./StepPromise";

/**
 * Owner-requested decision branch. Reads the choice made on "Let's Protect It":
 *  - APPROVED  → dramatic celebration: the shield draws itself around THEIR home,
 *    seals with the glow, and the receive-list solidifies the decision.
 *  - WAIT / other → the Promise slide (protection doesn't end with application) —
 *    reassurance, zero guilt, price-lock reminder.
 * Animation reuses the intro-splash CSS keyframes with faster slide-scale delays (cel-*).
 */

const SHIELD_D = "M170 6 C122 -10 52 -18 -16 -12 C-26 88 -18 178 4 238 C30 310 96 364 170 396 C244 364 310 310 336 238 C358 178 366 88 356 -12 C288 -18 218 -10 170 6 Z";
// simple home silhouette centered in the shield (roof + body + door), viewBox units
const HOME_D = "M60 190 L170 100 L280 190 M85 172 L85 300 L255 300 L255 172 M150 300 L150 240 L190 240 L190 300";

const RECEIVE: [string, string][] = [
  ["Application day, scheduled", "One visit, no tear-off — we pick the day together before we leave."],
  ["The walk-the-roof review", "Every completion photo, reviewed with you — before you pay a dollar."],
  ["Written warranty", "Our application, guaranteed in plain English — if we missed anything, we fix it free."],
  ["Roof Passport™", "Your roof's permanent record — score, photos, and documents that stay with the home."],
  ["Year-one check-up, included", "We come back in about a year, re-score the roof, and update your Passport. No charge."],
  ["Touch-up coverage at that visit", "If any spot needs more membrane, application-related touch-ups are on us — anything new is quoted honestly first."],
];

export default function StepOutcome({ session }: StepProps) {
  const approved = session.decision === "approved";
  if (!approved) return <StepPromise session={session} update={() => {}} goNext={() => {}} goPrev={() => {}} />;

  const family = (session.homeowner.name || "").trim().split(" ").slice(-1)[0];
  return (
    <div className="s-wrap" style={{ textAlign: "center" }}>
      <div className="cel-stage" aria-hidden="true">
        <svg viewBox="-45 -50 430 480" className="cel-svg">
          <defs>
            <linearGradient id="celShieldG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7ED957" /><stop offset="1" stopColor="#39B54A" />
            </linearGradient>
          </defs>
          <path className="cel-home" pathLength={1} d={HOME_D} />
          <path className="cel-shield" pathLength={1} d={SHIELD_D} />
        </svg>
      </div>
      <h2 className="s-h cel-fade" style={{ ["--cd" as string]: "2.2s", fontSize: "clamp(1.8rem,4.5vw,2.6rem)" }}>
        {family ? `The ${family} home. ` : "Your home. "}<em style={{ color: "var(--score)", fontStyle: "normal" }}>Protected.</em>
      </h2>
      <p className="s-lead cel-fade" style={{ ["--cd" as string]: "2.5s", margin: "0 auto" }}>
        You just did what most homeowners never get the chance to do — protected the roof you already
        paid for, with the evidence in your hands. Here&rsquo;s what&rsquo;s now in motion:
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12, maxWidth: 860, margin: "22px auto 0", textAlign: "left" }}>
        {RECEIVE.map(([t, d], n) => (
          <div key={t} className="s-card cel-fade" style={{ ["--cd" as string]: `${2.8 + n * 0.18}s` }}>
            <b style={{ color: "#fff" }}>✓ {t}</b>
            <div style={{ color: "rgba(234,242,248,.78)", fontSize: ".92rem", marginTop: 4 }}>{d}</div>
          </div>
        ))}
      </div>
      <p className="cel-fade" style={{ ["--cd" as string]: "3.6s", fontSize: ".8rem", color: "rgba(234,242,248,.6)", marginTop: 18 }}>
        Pay when the work is done — after you&rsquo;ve seen every photo. Your price is locked either way.
      </p>
    </div>
  );
}
