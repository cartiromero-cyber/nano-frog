export default function ElytraShieldDifference() {
 return (
 <section className="pad dark" id="difference"
 dangerouslySetInnerHTML={{ __html: `
 <div class="nano" style="position:absolute;inset:0;opacity:.4"></div>
 <div class="wrap" style="position:relative;z-index:2">
 <div class="shead reveal">
 <span class="eyebrow lt">The Elytra Shield difference</span>
 <h2>We don't start with a quote. We start with the truth about your roof.</h2>
 <p class="muted">A measured score, an honest recommendation, and documentation you keep — whether the answer is preserve or replace.</p>
 </div>
 <div class="diffgrid">
 <div class="dcard reveal"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 12l4-2"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg></div><h3>Roof Health Assessment™</h3><p>A clear, measured read on your roof's condition and preservation candidacy.</p></div>
 <div class="dcard reveal"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div><h3>Honest assessment</h3><p>If preservation isn't right for your roof, we'll tell you — including when replacement is the better call.</p></div>
 <div class="dcard reveal"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="8" r="2"/><circle cx="17" cy="6" r="2"/><circle cx="14" cy="16" r="2"/><path d="M8 8h7M16 8l-2 6"/></svg></div><h3>Advanced preservation treatment</h3><p>A preservation treatment <em>designed to</em> extend usable life for qualifying roofs.</p></div>
 <div class="dcard reveal"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></svg></div><h3>Roof Health Report™</h3><p>A documented record of your roof's condition — useful for your files and your insurer conversations.</p></div>
 </div>
 </div>
` }}
 />
 );
}
