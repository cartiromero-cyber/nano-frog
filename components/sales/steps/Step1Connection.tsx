'use client';
import type { StepProps } from "@/types/sales";
import { SALES_ASSETS } from "@/content/sales-assets";
import { useAssetReady } from "@/components/sales/useAsset";

const YEARS = ["< 2 years", "2–5 years", "6–10 years", "10+ years"];

export default function Step1Connection({ session, update }: StepProps) {
  const homeReady = useAssetReady(SALES_ASSETS.homePhoto);
  const c = session.connection;
  const setC = (patch: Partial<typeof c>) => update({ connection: { ...c, ...patch } });
  const setH = (patch: Partial<typeof session.homeowner>) => update({ homeowner: { ...session.homeowner, ...patch } });
  const chip = (active: boolean) => "s-chip" + (active ? " sel" : "");

  return (
    <div className="s-wrap s-grid2">
      <div>
        <span className="s-eyebrow">Let’s start with your home</span>
        <h2 className="s-h">This is more than a roof. It’s where life happens.</h2>
        <p className="s-lead">Before we look at anything technical, help me understand what this home means to you.</p>

        <div style={{ marginTop: 26 }}>
          <div className="s-q">
            <label>Your name</label>
            <input className="s-input" value={session.homeowner.name || ""} onChange={(e) => setH({ name: e.target.value })} placeholder="First name" />
          </div>
          <div className="s-q">
            <label>How long have you lived here?</label>
            <div className="s-choices">
              {YEARS.map((y) => <button key={y} className={chip(c.yearsLived === y)} onClick={() => setC({ yearsLived: y })}>{y}</button>)}
            </div>
          </div>
          <div className="s-q">
            <label>Is this your forever home?</label>
            <div className="s-choices">
              <button className={chip(c.foreverHome === true)} onClick={() => setC({ foreverHome: true })}>Yes</button>
              <button className={chip(c.foreverHome === false)} onClick={() => setC({ foreverHome: false })}>Not sure</button>
            </div>
          </div>
          <div className="s-q">
            <label>Have you replaced a roof before?</label>
            <div className="s-choices">
              <button className={chip(c.replacedBefore === true)} onClick={() => setC({ replacedBefore: true })}>Yes</button>
              <button className={chip(c.replacedBefore === false)} onClick={() => setC({ replacedBefore: false })}>No</button>
            </div>
          </div>
          <div className="s-q">
            <label>Planning to stay another 5–10 years?</label>
            <div className="s-choices">
              <button className={chip(c.stayingLong === true)} onClick={() => setC({ stayingLong: true })}>Yes</button>
              <button className={chip(c.stayingLong === false)} onClick={() => setC({ stayingLong: false })}>Maybe</button>
            </div>
          </div>
        </div>
      </div>

      <div className="s-panel" style={{ display: "grid", placeItems: "center", minHeight: 320, overflow: "hidden" }}>
        {homeReady ? (
          <>
            <img className="asset-cover" src={SALES_ASSETS.homePhoto} alt={session.homeowner.name ? `${session.homeowner.name}'s home` : "Your home"} />
            <div className="asset-shade" />
            {session.homeowner.name ? <div className="asset-cap">{session.homeowner.name}’s home</div> : null}
          </>
        ) : (
        <svg viewBox="0 0 360 300" width="100%" style={{ maxWidth: 420 }} aria-hidden="true">
          <ellipse cx="180" cy="262" rx="150" ry="12" fill="#000" opacity="0.18" />
          <rect x="92" y="158" width="176" height="96" rx="8" fill="#fff" />
          <rect x="110" y="180" width="34" height="34" rx="4" fill="#dce6ee" />
          <rect x="216" y="180" width="34" height="34" rx="4" fill="#dce6ee" />
          <rect x="162" y="206" width="36" height="48" rx="4" fill="#cdd9e3" />
          <polygon points="74,158 180,88 286,158" fill="#45C55A" />
          <polygon points="74,158 180,88 286,158" fill="none" stroke="#bff09a" strokeWidth="1.5" />
          {session.homeowner.name ? (
            <text x="180" y="284" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fill="#eaf2f8">
              {session.homeowner.name}’s home
            </text>
          ) : null}
        </svg>
        )}
      </div>
    </div>
  );
}
