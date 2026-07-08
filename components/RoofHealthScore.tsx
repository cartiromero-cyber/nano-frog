export default function RoofHealthScore() {
 return (
 <section className="pad dark" id="score"
 dangerouslySetInnerHTML={{ __html: `
 <div class="nano" style="position:absolute;inset:0;opacity:.4"></div>
 <div class="wrap" style="position:relative;z-index:2">
 <div class="shead center reveal">
 <span class="eyebrow lt" style="justify-content:center">Roof Health Assessment™</span>
 <h2>Your roof, measured — not guessed.</h2>
 <p class="muted">A single, clear number built from the factors that actually determine whether a roof can be preserved. This is what intelligent roof care looks like.</p>
 </div>
 <div class="reveal" style="max-width:760px;margin:46px auto 0">
 <div class="scorecard">
 <div class="sc-top"><span class="sc-brand">Roof Health Assessment™</span><span class="sc-tag">Example only</span></div>
 <div class="gauge-wrap">
 <div class="gauge">
 <svg width="150" height="150" viewBox="0 0 150 150">
 <circle cx="75" cy="75" r="64" fill="none" stroke="rgba(255,255,255.12)" stroke-width="12"/>
 <circle class="gauge-arc" cx="75" cy="75" r="64" fill="none" stroke="var(--score)" stroke-width="12" stroke-linecap="round" stroke-dasharray="402" stroke-dashoffset="402"/>
 </svg>
 <div class="gval"><span class="gnum" data-count="78">0</span><span class="gden">/ 100</span></div>
 </div>
 <div>
 <div class="sc-status">Status</div>
 <div class="sc-statpill">Likely Preservation Candidate</div>
 <div class="sc-note">Example only — official score requires inspection. <a href="/how-we-score" style="color:var(--score);text-decoration:underline">See exactly how we score</a></div>
 </div>
 </div>
 <div class="sc-factors">
 <div class="factor"><span class="fl">Roof age</span><span class="bar"><i data-w="62"></i></span><span class="fv">Moderate</span></div>
 <div class="factor"><span class="fl">Granule condition</span><span class="bar"><i data-w="74"></i></span><span class="fv">Fair</span></div>
 <div class="factor"><span class="fl">Brittleness</span><span class="bar"><i data-w="80"></i></span><span class="fv">Good</span></div>
 <div class="factor"><span class="fl">Leak history</span><span class="bar"><i data-w="88"></i></span><span class="fv">None noted</span></div>
 <div class="factor"><span class="fl">Ventilation</span><span class="bar"><i data-w="70"></i></span><span class="fv">Fair</span></div>
 <div class="factor"><span class="fl">Weather exposure</span><span class="bar"><i data-w="66"></i></span><span class="fv">Moderate</span></div>
 </div>
 </div>
 <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-top:30px">
 <div style="background:rgba(255,255,255,.04);border:1px solid rgba(126,217,87,.45);border-radius:14px;padding:16px 18px"><div style="font-family:var(--disp);font-weight:700;color:var(--score)">PRESERVE</div><p style="font-size:.84rem;color:var(--muted-d);line-height:1.55;margin-top:4px">The roof has protectable life — the score and age gates say so.</p></div>
 <div style="background:rgba(255,255,255,.04);border:1px solid rgba(224,161,46,.5);border-radius:14px;padding:16px 18px"><div style="font-family:var(--disp);font-weight:700;color:#E0A12E">MONITOR</div><p style="font-size:.84rem;color:var(--muted-d);line-height:1.55;margin-top:4px">Not yet clear — re-checked on a schedule, at no pressure.</p></div>
 <div style="background:rgba(255,255,255,.04);border:1px solid rgba(192,83,46,.55);border-radius:14px;padding:16px 18px"><div style="font-family:var(--disp);font-weight:700;color:#C0532E">REPLACE</div><p style="font-size:.84rem;color:var(--muted-d);line-height:1.55;margin-top:4px">The honest answer, in writing — and we don't sell roofs.</p></div>
 </div>
 <p class="center muted" style="text-align:center;margin-top:26px;font-size:.9rem"><b style="color:#fff">No photo, no score.</b> &nbsp;·&nbsp; <b style="color:#fff">Inspectors are never paid on treatment sales.</b> &nbsp;·&nbsp; <b style="color:#fff">You always receive the entire score.</b></p>
 <p class="center muted" style="text-align:center;margin-top:10px;font-size:.86rem">Three verdicts. No fourth category. No hidden recommendations. <a href="/how-we-score" style="color:var(--score);text-decoration:underline">Read the full published standard</a> — whether the recommendation is to preserve or to replace, the score and the report are yours.</p>
 </div>
 </div>
` }}
 />
 );
}
