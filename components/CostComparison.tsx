export default function CostComparison() {
  return (
    <section className="pad mist" id="cost"
      dangerouslySetInnerHTML={{ __html: `
  <div class="wrap ins">
    <div class="reveal">
      <span class="eyebrow">Preservation vs. replacement</span>
      <h2 style="margin:16px 0 14px">A fraction of the cost — when your roof qualifies.</h2>
      <p class="muted">Preservation is typically a small share of what a full replacement costs. The exact numbers depend on your roof's size, age, condition, and access — which is why an inspection comes first.</p>
      <p class="muted" style="margin-top:12px;font-size:.9rem">Figures shown are illustrative only. <span class="flag">[VERIFY WITH CLIENT — pricing & ranges]</span></p>
      <a class="btn btn-g" href="#assess" style="margin-top:18px">Get my estimate
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    </div>
    <div class="reveal">
      <div class="calc">
        <div style="font-family:var(--disp);font-weight:600;color:var(--ink);margin-bottom:6px">Cost comparison</div>
        <div class="muted" style="font-size:.82rem;margin-bottom:8px">Illustrative — estimate only, inspection required</div>
        <div class="bars" id="calcBars">
          <div class="barwrap"><div class="bcol repl" data-h="116" style="height:0"></div><div class="blab">Replacement</div></div>
          <div class="barwrap"><div class="bcol pres" data-h="29" style="height:0"></div><div class="blab">Preservation</div></div>
        </div>
        <div class="crow"><span class="muted">Roof size, age, condition</span><span class="v">Inputs</span></div>
        <div class="crow"><span class="muted">Slope &amp; access</span><span class="v">Inputs</span></div>
        <div class="crow"><span class="muted">Your estimate</span><span class="v" style="color:var(--green)">After inspection</span></div>
      </div>
    </div>
  </div>
` }}
    />
  );
}
