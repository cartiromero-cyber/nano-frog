export default function QualifySection() {
 return (
 <section className="pad" id="qualify"
 dangerouslySetInnerHTML={{ __html: `
 <div class="wrap qsplit">
 <div class="reveal">
 <span class="eyebrow">Honest by design</span>
 <h2 style="margin:16px 0 14px">Not every roof qualifies — and that's the point.</h2>
 <p class="muted">Preservation only works on roofs that are good candidates. Our inspection is built to find out honestly — not to sell you a treatment you don't need.</p>
 <ul class="qcheck">
 <li><span class="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span><div><b>Good candidate:</b> an aging but structurally sound roof with life left to protect.</div></li>
 <li><span class="no"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg></span><div><b>Not a candidate:</b> a roof with structural damage, active failure, or beyond its serviceable life — where replacement is the honest answer.</div></li>
 </ul>
 </div>
 <div class="qcard reveal">
 <div class="nano"></div>
 <div class="inner">
 <div class="big">"If you need a new roof, we'll tell you."</div>
 <p>That promise is the whole brand. An honest score and a clear recommendation — even when it isn't the answer that makes us money.</p>
 <a class="btn btn-g" href="#assess">Check my roof's candidacy
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
 </div>
 </div>
 </div>
` }}
 />
 );
}
