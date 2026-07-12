'use client';
import { useState } from "react";
import { NURTURE_META, NURTURE_STAGES, type NurtureStage } from "@/lib/nurture";

/** One-tap nurture sends from the lead page (growth-audit #4, manual-first workflow). */
export default function NurtureButtons({ email, name }: { email?: string | null; name?: string | null }) {
  const [state, setState] = useState<Record<string, string>>({});
  if (!email) return <p className="dash-empty">No email on this lead — capture it to enable nurture emails.</p>;

  async function send(stage: NurtureStage) {
    setState((s) => ({ ...s, [stage]: "…" }));
    const r = await fetch("/api/nurture", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, stage }),
    });
    const d = await r.json().catch(() => ({ ok: false, error: "Failed" }));
    setState((s) => ({ ...s, [stage]: d.ok ? `sent ${new Date().toLocaleTimeString()}` : (d.error || "failed") }));
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {NURTURE_STAGES.map((stage) => (
        <div key={stage} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button className="sales-btn ghost" onClick={() => send(stage)} disabled={state[stage] === "…"}>
            {NURTURE_META[stage].label}
          </button>
          <span className="dash-empty" style={{ fontSize: ".78rem" }}>
            send {NURTURE_META[stage].when}{state[stage] ? ` — ${state[stage]}` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
