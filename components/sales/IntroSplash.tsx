'use client';
import { useEffect, useState } from "react";

/**
 * Owner-requested opening: the homepage shield/molecule animation as a full-screen
 * company intro for the sales presentation. Fades in → molecule forms → shield draws
 * and seals around it → wordmark signs → fades into slide 1.
 *
 * Self-contained (the deck never loads site.js): pure CSS keyframes in sales.css,
 * same geometry and palette as the homepage original. Tap/click/key skips instantly;
 * prefers-reduced-motion skips the animation entirely.
 */

const R_OUT = 132, R_MID = 70;
const OCT = Array.from({ length: 8 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 8 - Math.PI / 2;
  return [170 + R_OUT * Math.cos(a), 170 + R_OUT * Math.sin(a)] as const;
});
const SQ: readonly (readonly [number, number])[] = [[219.5, 120.5], [219.5, 219.5], [120.5, 219.5], [120.5, 120.5]];
const C: readonly [number, number] = [170, 170];

type Edge = readonly [readonly [number, number], readonly [number, number]];
const EDGES: Edge[] = [
  ...OCT.map((p, i) => [p, OCT[(i + 1) % 8]] as Edge),          // outer ring
  ...SQ.map((p, i) => [p, SQ[(i + 1) % 4]] as Edge),            // inner square
  ...SQ.map((p) => [p, C] as Edge),                              // square → center
  ...OCT.map((p, i) => [p, SQ[Math.floor(i / 2)]] as Edge),      // diagonals (matches homepage)
  [OCT[0], C], [OCT[2], C], [OCT[4], C], [OCT[6], C],            // cardinal spokes
];
const len = ([a, b]: Edge) => Math.hypot(a[0] - b[0], a[1] - b[1]);

const SHIELD_D = "M170 6 C122 -10 52 -18 -16 -12 C-26 88 -18 178 4 238 C30 310 96 364 170 396 C244 364 310 310 336 238 C358 178 366 88 356 -12 C288 -18 218 -10 170 6 Z";

export default function IntroSplash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    if (typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches) { onDone(); return; }
    const t1 = setTimeout(() => setPhase("out"), 6100);   // full play, then dissolve
    const t2 = setTimeout(onDone, 6950);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => { setPhase("out"); setTimeout(onDone, 350); };

  return (
    <div className={"intro-overlay" + (phase === "out" ? " out" : "")} onClick={skip}
      onKeyDown={skip} role="button" tabIndex={0} aria-label="Elytra Shield — tap to skip intro">
      <div style={{ textAlign: "center" }}>
        <svg className="io-net" viewBox="-45 -50 430 480" aria-hidden="true">
          <defs>
            <linearGradient id="ioShieldG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7ED957" /><stop offset="1" stopColor="#39B54A" />
            </linearGradient>
          </defs>
          <g>
            {EDGES.map((e, i) => (
              <line key={i} className="io-edge"
                x1={e[0][0]} y1={e[0][1]} x2={e[1][0]} y2={e[1][1]}
                style={{ ["--len" as string]: `${len(e).toFixed(1)}px`, ["--d" as string]: `${(0.5 + i * 0.045).toFixed(3)}s` }} />
            ))}
          </g>
          <g>
            {[...OCT, ...SQ, C].map((p, i) => (
              <circle key={`h${i}`} className="io-halo" cx={p[0]} cy={p[1]} r={i === 12 ? 14 : i > 7 ? 11 : 12}
                style={{ ["--d" as string]: `${(1.6 + i * 0.05).toFixed(2)}s` }} />
            ))}
            {[...OCT, ...SQ, C].map((p, i) => (
              <circle key={`n${i}`} className="io-node" cx={p[0]} cy={p[1]} r={i === 12 ? 11 : i > 7 ? 8 : 9}
                style={{ ["--d" as string]: `${(0.35 + i * 0.05).toFixed(2)}s` }} />
            ))}
          </g>
          <path className="io-shield" pathLength={1} d={SHIELD_D} />
        </svg>
        <div className="io-wm">
          <div className="io-wm-name">ELYTRA&nbsp;SHIELD</div>
          <div className="io-wm-sub">R O O F&nbsp;&nbsp;P R E S E R V A T I O N</div>
        </div>
        <div className="io-skip no-print">tap anywhere to begin</div>
      </div>
    </div>
  );
}
