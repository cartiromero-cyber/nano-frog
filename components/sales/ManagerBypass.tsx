'use client';
import { useEffect, useState } from "react";

/**
 * ELYTRA MANAGER AUTHORIZATION (owner-directed amendment to O-002 pricing doctrine).
 *
 * Ceremony-first price authority, designed to be PART of the homeowner's experience:
 * full-screen branded takeover → 5-digit manager PIN → authorization chamber showing a
 * TRUE monthly counter ("X of 3 manager-authorized prices remaining") → price entry →
 * AUTHORIZED stamp → the new price flows to the Investment slide, report, and PDF with
 * a printed "manager-authorized pricing adjustment" disclosure.
 *
 * Honesty notes (doctrine-preserving deltas from the raw spec):
 *  - The 3/month limit is REAL and enforced on this device (localStorage, resets each
 *    calendar month). Everything shown to the homeowner is true.
 *  - The adjustment is disclosed on the printed report — rarity is amplified, not hidden.
 *  - The PIN is client-side ceremony, not security: anyone reading source can find it.
 */

const MANAGER_PIN = "07220";
const MONTHLY_LIMIT = 3;
/** Advisory floor: warn (manager-visible) below 20% under band price — margin protection. */
const ADVISORY_FLOOR_PCT = 0.8;

const monthKey = () => {
  const d = new Date();
  return `elytra-mgr-auth-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const usedThisMonth = () => { try { return Number(localStorage.getItem(monthKey()) || 0); } catch { return 0; } };
const recordUse = () => { try { localStorage.setItem(monthKey(), String(usedThisMonth() + 1)); } catch {} };
const monthName = () => new Date().toLocaleString("en-US", { month: "long" });

export default function ManagerBypass({ currentPrice, bandPrice, onApply, onClose }: {
  currentPrice: number; bandPrice: number;
  onApply: (newPrice: number) => void; onClose: () => void;
}) {
  const [stage, setStage] = useState<"pin" | "adjust" | "done">("pin");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [value, setValue] = useState("");
  const [remaining, setRemaining] = useState(MONTHLY_LIMIT);
  useEffect(() => { setRemaining(Math.max(0, MONTHLY_LIMIT - usedThisMonth())); }, []);

  const tryPin = (v: string) => {
    setPin(v); setErr("");
    if (v.length === 5) {
      if (v === MANAGER_PIN) setStage("adjust");
      else { setErr("Authorization not recognized."); setPin(""); }
    }
  };

  const parsed = Math.round(Number(value.replace(/[^0-9.]/g, "")) || 0);
  const belowAdvisory = parsed > 0 && parsed < Math.round(bandPrice * ADVISORY_FLOOR_PCT);
  const valid = parsed > 0 && parsed < currentPrice;

  const authorize = () => {
    if (!valid || remaining <= 0) return;
    recordUse();
    setStage("done");
    setTimeout(() => { onApply(parsed); onClose(); }, 1900);
  };

  return (
    <div className="mb-overlay no-print" role="dialog" aria-label="Elytra Manager Authorization">
      <div className="mb-card">
        <div className="mb-head">
          <img src="/assets/elytra-shield-icon.png" width={40} height={40} alt="" style={{ borderRadius: 9 }} />
          <div>
            <div className="mb-title">ELYTRA MANAGER AUTHORIZATION</div>
            <div className="mb-sub">Pricing authority · rarely used, always documented</div>
          </div>
        </div>

        {stage === "pin" && (
          <>
            <p className="mb-lead">A manager is requesting pricing authority for this home.</p>
            <input
              className="mb-pin" type="password" inputMode="numeric" autoFocus maxLength={5}
              value={pin} placeholder="•••••" aria-label="Manager PIN"
              onChange={(e) => tryPin(e.target.value.replace(/\D/g, ""))}
            />
            {err ? <p className="mb-err">{err}</p> : null}
            <button className="sales-btn ghost" style={{ marginTop: 14 }} onClick={onClose}>Cancel</button>
          </>
        )}

        {stage === "adjust" && (
          <>
            <div className={"mb-remaining" + (remaining <= 0 ? " none" : "")}>
              {remaining > 0
                ? `${remaining} of ${MONTHLY_LIMIT} manager-authorized prices remaining in ${monthName()}`
                : `No manager-authorized prices remaining in ${monthName()}`}
            </div>
            {remaining > 0 ? (
              <>
                <p className="mb-lead">
                  Quoted investment: <b style={{ color: "#fff" }}>${currentPrice.toLocaleString()}</b>
                </p>
                <label className="mb-label">Manager-authorized price</label>
                <input
                  className="mb-price" inputMode="numeric" autoFocus value={value}
                  placeholder={`Below $${currentPrice.toLocaleString()}`}
                  onChange={(e) => setValue(e.target.value)}
                />
                {belowAdvisory ? (
                  <p className="mb-warn">Below the advisory manager floor (20% under band pricing) — margin risk.</p>
                ) : null}
                <button className="sales-btn solid mb-authbtn" disabled={!valid} onClick={authorize}>
                  Authorize ${valid ? parsed.toLocaleString() : "—"} for this home
                </button>
                <p className="mb-fine">The authorization is documented on the homeowner&rsquo;s report.</p>
                <button className="sales-btn ghost" onClick={onClose}>Cancel</button>
              </>
            ) : (
              <>
                <p className="mb-lead">This month&rsquo;s allocation has been used. The quoted price stands.</p>
                <button className="sales-btn solid" onClick={onClose}>Return to presentation</button>
              </>
            )}
          </>
        )}

        {stage === "done" && (
          <div className="mb-stamp-wrap">
            <div className="mb-stamp">AUTHORIZED</div>
            <p className="mb-lead" style={{ marginTop: 14 }}>
              ${parsed.toLocaleString()} — manager-authorized for this home, documented on your report.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
