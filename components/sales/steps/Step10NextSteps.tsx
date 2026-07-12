'use client';
import { useState } from "react";
import type { StepProps } from "@/types/sales";
import { recommend } from "@/lib/sales/recommendation";

// F1 + P-005 (approved): the close. One recommended action + one honest fallback —
// four deferral buttons and the at-close membership panel are gone (LIFE-1: recurring
// service is offered at the year-1 reassessment, never on treatment day).
// LANG-1: "assessment," never "inspection," in offer language.

export default function Step10NextSteps({ session, update, goNext }: StepProps) {
  const [busy, setBusy] = useState(false);
  const tier = recommend(session.score).tier;
  const notCandidate = tier === "Not Recommended";

  const primary = notCandidate ? "Get My Written Report & Referrals" : "Approve My Preservation System";
  const fallback = "Send Me the Report — I’ll Decide This Week";
  const h = session.homeowner;
  const missing = [!h.name && "name", !h.phone && "phone", !h.address && "address"].filter(Boolean);

  // Decision made → log it, start the Passport, then advance into the outcome branch
  // (celebration or promise) automatically. The finale slide handles delivery.
  async function choose(opt: string) {
    setBusy(true);
    update({ nextStep: opt });
    try {
      await fetch("/api/sales/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...session, nextStep: opt }) });
      await fetch("/api/sales/passport", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(session) });
    } catch {}
    setBusy(false);
    goNext();
  }

  return (
    <div className="s-wrap" style={{ textAlign: "center" }}>
      <span className="s-eyebrow">Where to from here</span>
      <h2 className="s-h">{notCandidate ? "Your report is the deliverable." : "Ready when you are."}</h2>
      <p className="s-lead" style={{ margin: "0 auto 8px" }}>
        {notCandidate
          ? "The honest verdict is replacement planning — your documented report and our no-fee roofer referrals are yours."
          : "Approve today and we schedule the application — you pay only when the work is done and you’ve seen every photo."}
      </p>
      <div className="next-grid">
        <button className="next-card rec" disabled={busy} onClick={() => choose(primary)}>
          <span>{primary}<em className="next-rec">Recommended</em></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
        <button className="next-card" disabled={busy} onClick={() => choose(fallback)}>
          <span>{fallback}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>
      <p style={{ fontSize: ".74rem", color: "rgba(234,242,248,.55)", marginTop: 16 }}>
        Either way, the report is yours — and your quoted price is locked for 12 months.
      </p>
      {missing.length ? (
        <p className="no-print" style={{ fontSize: ".76rem", color: "#E0A12E", marginTop: 10 }}>
          ⚠ Rep: lead record incomplete — missing {missing.join(", ")}. Capture on slide 1 before logging this visit.
        </p>
      ) : null}
    </div>
  );
}
