export default function Hero() {
 return (
 <section className="hero"
 dangerouslySetInnerHTML={{ __html: `
 <div class="nano"></div>
 <canvas id="nanocanvas"></canvas>
 <div class="wrap">
 <div class="hgrid">
 <div>
 <span class="eyebrow lt">Roof Preservation · Roof Health Assessment</span>
 <h1>Protect What Protects <em>Your Home.</em></h1>
 <p class="sub">Advanced roof preservation designed to extend the life of aging roofing systems and help homeowners avoid premature, expensive replacement.</p>
 <div class="cta-row">
 <a class="btn btn-g btn-pulse" href="/book">Schedule Free Roof Health Assessment
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
 <a class="btn btn-o" href="/sample-report">View Sample Assessment</a>
 </div>
 <div class="htrust">
 <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Inspection first</span>
 <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> We'll tell you if you need a new roof</span>
 <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Documented Roof Health Report</span>
 </div>
 </div>
 <div class="reveal">
 <div class="scorecard" id="heroScore">
 <div class="sc-top"><span class="sc-brand">Roof Health Assessment™</span><span class="sc-tag">Example</span></div>
 <div class="gauge-wrap">
 <div class="gauge">
 <svg width="150" height="150" viewBox="0 0 150 150">
 <circle cx="75" cy="75" r="64" fill="none" stroke="rgba(255,255,255.12)" stroke-width="12"/>
 <circle class="gauge-arc" cx="75" cy="75" r="64" fill="none" stroke="var(--score)" stroke-width="12" stroke-linecap="round" stroke-dasharray="402" stroke-dashoffset="402"/>
 </svg>
 <div class="gval"><span class="gnum" data-count="78">0</span><span class="gden">/ 100</span></div>
 </div>
 <div>
 <div class="sc-statpill">Likely Preservation Candidate</div>
 <div class="sc-note">Example only — official score requires inspection.</div>
 </div>
 </div>
 <div class="sc-factors" id="heroFactors">
 <div class="factor"><span class="fl">Roof age</span><span class="bar"><i data-w="62"></i></span><span class="fv">Moderate</span></div>
 <div class="factor"><span class="fl">Granule condition</span><span class="bar"><i data-w="74"></i></span><span class="fv">Fair</span></div>
 <div class="factor"><span class="fl">Flexibility</span><span class="bar"><i data-w="80"></i></span><span class="fv">Good</span></div>
 <div class="factor"><span class="fl">Leak history</span><span class="bar"><i data-w="88"></i></span><span class="fv">None noted</span></div>
 <div class="factor"><span class="fl">Ventilation</span><span class="bar"><i data-w="70"></i></span><span class="fv">Fair</span></div>
 </div>
 </div>
 </div>
 </div>
 </div>
` }}
 />
 );
}
