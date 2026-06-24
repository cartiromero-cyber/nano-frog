'use client';
import { useCallback, useEffect, useRef, useState } from "react";
import { newSession, type SalesSession } from "@/types/sales";
import { STEPS } from "@/components/sales/steps";
import RepScript from "@/components/sales/RepScript";

export default function Presentation() {
  const [i, setI] = useState(0);
  const [session, setSession] = useState<SalesSession>(() => newSession());
  const [seconds, setSeconds] = useState(0);
  const touchX = useRef<number | null>(null);

  const update = useCallback((patch: Partial<SalesSession>) => setSession((s) => ({ ...s, ...patch })), []);
  const goTo = useCallback((n: number) => setI(() => Math.max(0, Math.min(STEPS.length - 1, n))), []);
  const goNext = useCallback(() => goTo(i + 1), [i, goTo]);
  const goPrev = useCallback(() => goTo(i - 1), [i, goTo]);

  // presentation timer
  useEffect(() => {
    const t = setInterval(() => setSeconds((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // offline shell (best-effort; safe if unsupported)
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sales-sw.js").catch(() => {});
  }, []);

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.changedTouches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 60) (dx < 0 ? goNext : goPrev)();
    touchX.current = null;
  };

  const Step = STEPS[i].Component;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const isStart = i === 0;

  return (
    <div className="sales-shell" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <header className="sales-bar">
        <div className="sales-brand">
          <img src="/assets/nanofrog-mark.png" alt="Nano Frog" width={28} height={28} />
          <span>Nano Frog</span>
        </div>
        <div className="sales-steplabel">{STEPS[i].title}</div>
        <div className="sales-timer" aria-label="Presentation time">{mm}:{ss}</div>
      </header>

      <div className="sales-progress" role="tablist" aria-label="Progress">
        {STEPS.map((s, n) => (
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
        <button className="sales-btn ghost" onClick={goPrev} disabled={isStart}>← Back</button>
        <div className="sales-count">{i + 1} / {STEPS.length}</div>
        <button className="sales-btn solid" onClick={goNext} disabled={i === STEPS.length - 1}>Next →</button>
      </footer>

      <RepScript title={STEPS[i].title} />
    </div>
  );
}
