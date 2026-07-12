'use client';
import { useCallback, useEffect, useRef, useState } from "react";
import { newSession, type SalesSession, type StepProps } from "@/types/sales";
import { STEPS } from "@/components/sales/steps";
import RepScript from "@/components/sales/RepScript";
import IntroSplash from "@/components/sales/IntroSplash";

/**
 * PREVIEW-ONLY presentation shell (owner-approved, temporary).
 * Differences from the real Presentation, by requirement:
 *  - No network calls of any kind: the final interactive step ("Let's Protect It",
 *    which posts sessions/passports) is replaced with a static end card.
 *  - Mock placeholder data only; nothing is persisted anywhere (state lives in memory
 *    and disappears on refresh). Photos added on the "Your Roof Today" slide stay in
 *    browser memory only — no upload, no save.
 *  - No service worker registration.
 *  - Visible "PREVIEW ONLY — NOT PRODUCTION" banner.
 * Access gating happens in app/sales-preview/page.tsx (404 in production builds).
 */

function mockSession(): SalesSession {
  const s = newSession();
  s.homeowner = { name: "Preview Homeowner", address: "123 Sample Street, Macon, GA" };
  s.connection = { yearsLived: "6–10 years", foreverHome: true, replacedBefore: false, stayingLong: true };
  return s;
}

function PreviewDecision({ session, update, goNext }: StepProps) {
  // Fully clickable in preview so both outcome branches can be tested —
  // sets the decision locally and advances; NO network calls of any kind.
  const pick = (decision: "approved" | "wait", label: string) => {
    update({ decision, nextStep: label });
    goNext();
  };
  return (
    <div className="s-wrap" style={{ textAlign: "center" }}>
      <span className="s-eyebrow">Where to from here (preview — nothing is saved or sent)</span>
      <h2 className="s-h">Ready when you are.</h2>
      <p className="s-lead" style={{ margin: "0 auto 8px" }}>
        Pick either path to preview its ending — approval plays the celebration; waiting shows the Promise.
      </p>
      <div className="next-grid">
        <button className="next-card rec" onClick={() => pick("approved", "Approve My Preservation System")}>
          <span>Approve My Preservation System<em className="next-rec">Recommended</em></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
        <button className="next-card" onClick={() => pick("wait", "Send Me the Report — I’ll Decide This Week")}>
          <span>Send Me the Report — I’ll Decide This Week</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}

// Swap the step that performs network writes for the offline-safe chooser.
const PREVIEW_STEPS = STEPS.map((s) =>
  s.title === "Let’s Protect It" ? { ...s, Component: PreviewDecision } : s
);

export default function PreviewPresentation() {
  const [intro, setIntro] = useState(true);
  const [i, setI] = useState(0);
  const [session, setSession] = useState<SalesSession>(() => mockSession());
  const [seconds, setSeconds] = useState(0);
  const touchX = useRef<number | null>(null);

  const update = useCallback((patch: Partial<SalesSession>) => setSession((s) => ({ ...s, ...patch })), []);
  const goTo = useCallback((n: number) => setI(() => Math.max(0, Math.min(PREVIEW_STEPS.length - 1, n))), []);
  const goNext = useCallback(() => goTo(i + 1), [i, goTo]);
  const goPrev = useCallback(() => goTo(i - 1), [i, goTo]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (el && el.closest("input,select,textarea,button,[contenteditable]")) return;
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // Same interactive-control swipe guard as the real deck.
  const onTouchStart = (e: React.TouchEvent) => {
    const el = e.target as HTMLElement;
    if (el.closest("input,select,textarea,button,a,[data-noswipe]")) { touchX.current = null; return; }
    touchX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 60) (dx < 0 ? goNext : goPrev)();
    touchX.current = null;
  };

  const Step = PREVIEW_STEPS[i].Component;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  if (intro) return <IntroSplash onDone={() => setIntro(false)} />;

  return (
    <div className="sales-shell" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div style={{ background: "#C0532E", color: "#fff", textAlign: "center", fontFamily: "var(--sans)", fontSize: ".78rem", fontWeight: 700, letterSpacing: ".12em", padding: "6px 10px" }}>
        PREVIEW ONLY — NOT PRODUCTION · no login · mock data · nothing is saved
      </div>
      <header className="sales-bar">
        <div className="sales-brand">
          <img src="/assets/elytra-shield-icon.png" alt="Elytra Shield" width={28} height={28} />
          <span>Elytra Shield</span>
        </div>
        <div className="sales-steplabel">{PREVIEW_STEPS[i].title}</div>
        <div className="sales-timer" aria-label="Presentation time">{mm}:{ss}</div>
      </header>

      <div className="sales-progress" role="tablist" aria-label="Progress">
        {PREVIEW_STEPS.map((s, n) => (
          <button key={s.title} className={"sales-dot" + (n === i ? " on" : n < i ? " done" : "")}
            aria-label={s.title} onClick={() => goTo(n)} />
        ))}
      </div>

      <main className="sales-stage">
        <div className="sales-slide" key={i}>
          <Step session={session} update={update} goNext={goNext} goPrev={goPrev} />
        </div>
      </main>

      <footer className="sales-nav">
        <button className="sales-btn ghost" onClick={goPrev} disabled={i === 0}>← Back</button>
        <div className="sales-count">{i + 1} / {PREVIEW_STEPS.length}</div>
        <button className="sales-btn solid" onClick={goNext} disabled={i === PREVIEW_STEPS.length - 1}>Next →</button>
      </footer>

      <RepScript title={PREVIEW_STEPS[i].title} />
    </div>
  );
}
