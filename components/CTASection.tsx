export default function CTASection() {
 return (
 <section className="pad fcta" id="assess"
 dangerouslySetInnerHTML={{ __html: `
 <div class="nano"></div>
 <div class="wrap">
 <div class="reveal">
 <span class="eyebrow lt" style="justify-content:center">No obligation · Documented · Honest</span>
 <h2>Know Before You Replace.</h2>
 <p>Schedule your complimentary Elytra Shield Roof Health Assessment. If preservation is right for your roof, we'll show you. If it isn't, we'll tell you that too.</p>
 <div class="cta-row">
 <a class="btn btn-g btn-pulse" href="#">Schedule Free Roof Health Assessment
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
 <a class="btn btn-o" href="#">Talk to Elytra Shield</a>
 </div>
 </div>
 </div>
` }}
 />
 );
}
