export default function WhyElytraShield() {
 // Change 008 (approved): founder / "Why Elytra Shield" section — story, preservation-first
 // conviction, and the inspection experience. Uses the existing qsplit/qcard design language.
 // TODO (owner): add founder name, photo, and license/insurance numbers here when ready —
 // slots are marked below. No facts have been invented in the meantime.
 return (
 <section className="pad" id="why-elytra-shield"
 dangerouslySetInnerHTML={{ __html: `
 <div class="wrap qsplit">
 <div class="reveal">
 <span class="eyebrow">Why Elytra Shield</span>
 <h2 style="margin:16px 0 14px">Preservation-first. By conviction, not convenience.</h2>
 <p class="muted">Elytra Shield exists because of a frustrating pattern: roofs replaced years before they need to be, by an industry that only gets paid when you replace. We built the opposite &mdash; a company that starts with an assessment and a score, not a quote, and that treats &ldquo;you don&rsquo;t need us yet&rdquo; as a perfectly good outcome.</p>
 <p class="muted" style="margin-top:12px">The name is a promise. Elytra are the hardened cases that shield a beetle&rsquo;s wings &mdash; nature&rsquo;s armor for the part that matters most. That&rsquo;s the whole job: a protective layer over what protects your home.</p>
 <!-- TODO(owner): founder name, photo, and license/insurance details go here -->
 </div>
 <div class="qcard reveal">
 <div class="nano"></div>
 <div class="inner">
 <div class="big">The inspection experience</div>
 <ul class="qcheck" style="margin-top:14px">
 <li><span class="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span><div><b>About 30 minutes,</b> photo-documented from the roof, not the driveway.</div></li>
 <li><span class="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span><div><b>A measured score</b> from the factors that actually determine candidacy.</div></li>
 <li><span class="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span><div><b>An honest verdict</b> &mdash; preserve, monitor, or replace &mdash; explained in plain English.</div></li>
 <li><span class="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span><div><b>The report is yours to keep,</b> whatever you decide. No pressure, no obligation.</div></li>
 </ul>
 <a class="btn btn-g" href="/book" style="margin-top:18px">Book my free assessment
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
 </div>
 </div>
 </div>
` }}
 />
 );
}
