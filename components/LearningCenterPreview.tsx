export default function LearningCenterPreview() {
 return (
 <section className="pad" id="learn"
 dangerouslySetInnerHTML={{ __html: `
 <div class="wrap">
 <div class="shead reveal">
 <span class="eyebrow">Learning Center</span>
 <h2>The most helpful roof-preservation resource in your area.</h2>
 <p class="muted">Straight answers about aging roofs — including the questions other companies avoid.</p>
 </div>
 <div class="lcgrid">
 <a class="lcard reveal" href="#"><div class="k">Insurance &amp; Roof Age</div><h3>Roof age &amp; your insurance</h3><p>Why roof age matters, coverage basics, and documentation that helps you prepare.</p><span class="go">Read &rarr;</span></a>
 <a class="lcard reveal" href="#"><div class="k">Roof Qualification</div><h3>Is my roof a candidate?</h3><p>Age, granules, brittleness, and the signs that mean preserve — or replace.</p><span class="go">Read &rarr;</span></a>
 <a class="lcard reveal" href="#"><div class="k">Scam / Skeptic Questions</div><h3>Is roof preservation a scam?</h3><p>An honest look at what preservation can and can't do — no hype.</p><span class="go">Read &rarr;</span></a>
 <a class="lcard reveal" href="#"><div class="k">Cost &amp; Savings</div><h3>Preservation vs. replacement cost</h3><p>How the math works, what affects price, and when it's worth it.</p><span class="go">Read &rarr;</span></a>
 <a class="lcard reveal" href="#"><div class="k">Technology</div><h3>Nano vs. oil vs. coatings</h3><p>How advanced preservation differs — and what to ask any provider.</p><span class="go">Read &rarr;</span></a>
 <a class="lcard reveal" href="#"><div class="k">Commercial</div><h3>Restore, don't replace</h3><p>Roof asset management for building owners — extend life, defer capital.</p><span class="go">Read &rarr;</span></a>
 </div>
 </div>
` }}
 />
 );
}
