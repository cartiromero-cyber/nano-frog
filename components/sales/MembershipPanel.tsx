'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { membershipTiers, PLAN_NAME, PLAN_BLURB, PRICING_NOTE, membershipStatusColor } from "@/content/membership";

export default function MembershipPanel({ passportId, leadId, existing, heading }: {
  passportId?: string; leadId?: string; existing?: any; heading?: string;
}) {
  const router = useRouter();
  const [tier, setTier] = useState(existing?.tier || membershipTiers.find((t) => t.highlighted)?.name || membershipTiers[0].name);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const hasActive = existing && !["Declined", "Cancelled"].includes(existing.status);

  async function record(status: string) {
    setBusy(true); setMsg("");
    const res = await fetch("/api/memberships", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passportId, leadId, tier, status }),
    });
    const d = await res.json(); setBusy(false);
    setMsg(d.ok ? `Recorded: ${tier} — ${status}.` : (d.error || "Failed"));
    router.refresh();
  }
  const fmt = (s?: string) => (s ? new Date(s).toLocaleDateString() : "—");

  if (hasActive) return (
    <div className="mp">
      <div className="mp-current">
        <div><span>Plan</span><b>{PLAN_NAME} · {existing.tier}</b></div>
        <span className="mp-status" style={{ background: membershipStatusColor(existing.status) }}>{existing.status}</span>
      </div>
      <div className="mp-kv">
        <span>Start</span><b>{fmt(existing.start_date)}</b>
        <span>Renewal</span><b>{fmt(existing.renewal_date)}</b>
        <span>Next inspection reminder</span><b>{fmt(existing.renewal_date)}</b>
        <span>Notes</span><b>{existing.notes || "—"}</b>
      </div>
      <div className="mp-actions">
        <button className="sales-btn ghost" disabled={busy} onClick={() => record("Active")}>Mark Active</button>
        <button className="sales-btn ghost" disabled={busy} onClick={() => record("Pending Payment")}>Pending Payment</button>
        <button className="sales-btn ghost" disabled={busy} onClick={() => record("Cancelled")}>Cancel</button>
      </div>
      {msg ? <p className="mp-msg">{msg}</p> : null}
    </div>
  );

  return (
    <div className="mp">
      <div className="mp-head"><b>{heading || "Protect this roof going forward"}</b><p>{PLAN_NAME} — {PLAN_BLURB}</p></div>
      <div className="mp-tiers">
        {membershipTiers.map((t) => (
          <button type="button" key={t.name} className={"mp-tier" + (t.name === tier ? " sel" : "") + (t.highlighted ? " hi" : "")} onClick={() => setTier(t.name)}>
            {t.highlighted ? <span className="mp-flag">Most popular</span> : null}
            <b>{t.name}</b><span className="mp-tag">{t.tagline}</span>
            <ul>{t.features.map((f) => <li key={f}>{f}</li>)}</ul>
            <span className="mp-price">{PRICING_NOTE}</span>
          </button>
        ))}
      </div>
      <div className="mp-actions">
        <button className="sales-btn ghost" disabled={busy} onClick={() => record("Interested")}>Record interest</button>
        <button className="sales-btn solid" disabled={busy} onClick={() => record("Enrolled")}>Enroll {tier}</button>
        <button className="sales-btn ghost" disabled={busy} onClick={() => record("Declined")}>Decline</button>
      </div>
      <p className="mp-note">Enrollment intent only — no payment is processed here. LIFE-1 reminder: the Continuity Program is offered at the year-1 reassessment visit, never on treatment day.</p>
      {msg ? <p className="mp-msg">{msg}</p> : null}
    </div>
  );
}
