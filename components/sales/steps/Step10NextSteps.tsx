'use client';
import { useState } from "react";
import type { StepProps } from "@/types/sales";
import MembershipPanel from "@/components/sales/MembershipPanel";
import { recommend } from "@/lib/sales/recommendation";

const OPTIONS = ["Schedule Inspection", "Request Assessment", "Speak With Specialist", "Get Roof Health Report"];

export default function Step10NextSteps({ session, update }: StepProps) {
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [passportId, setPassportId] = useState<string | null>(null);
  const tier = recommend(session.score).tier;
  const recommended = tier === "Not Recommended" ? "Speak With Specialist" : "Schedule Inspection";

  async function choose(opt: string) {
    setBusy(true);
    update({ nextStep: opt });
    try {
      await fetch("/api/sales/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...session, nextStep: opt }) });
      const pr = await fetch("/api/sales/passport", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(session) });
      const pd = await pr.json().catch(() => null);
      if (pd && pd.id) setPassportId(pd.id);
    } catch {}
    setBusy(false); setDone(opt);
  }

  if (done) return (
    <div className="s-wrap" style={{ textAlign: "center", display: "grid", placeItems: "center", minHeight: 360 }}>
      <div>
        <div className="done-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
        </div>
        <h2 className="s-h" style={{ marginTop: 16 }}>You’re all set.</h2>
        <p className="s-lead" style={{ margin: "0 auto" }}>We’ve logged your request: <b style={{ color: "#fff" }}>{done}</b>.</p>
        <div className="passport-started">
          <b>Digital Roof Passport™ started</b>
          <span>Your roof now has a permanent record — scores, inspections, photos, and warranties, all in one place.</span>
          <a className="sales-btn solid" href="/passport" style={{ marginTop: 12, display: "inline-block" }}>View the Passport{passportId ? "" : " preview"} →</a>
        </div>
        <div style={{ textAlign: "left", marginTop: 26, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
          <MembershipPanel passportId={passportId || undefined} leadId={undefined} heading="Protect This Roof Going Forward" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="s-wrap" style={{ textAlign: "center" }}>
      <span className="s-eyebrow">Where to from here</span>
      <h2 className="s-h">Choose your next step.</h2>
      <p className="s-lead" style={{ margin: "0 auto 8px" }}>No pressure — every option keeps your roof documented and your plan clear.</p>
      <div className="next-grid">
        {OPTIONS.map((o) => (
          <button key={o} className={"next-card" + (o === recommended ? " rec" : "")} disabled={busy} onClick={() => choose(o)}>
            <span>{o}{o === recommended ? <em className="next-rec">Recommended</em> : null}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        ))}
      </div>
    </div>
  );
}
