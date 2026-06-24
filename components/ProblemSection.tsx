export default function ProblemSection() {
 return (
 <section className="pad" id="problem"
 dangerouslySetInnerHTML={{ __html: `
 <div class="wrap">
 <div class="shead reveal">
 <span class="eyebrow">The roof dilemma</span>
 <h2>Most roofs get replaced before they have to.</h2>
 <p class="muted">A roof rarely fails all at once. But the moment it looks old, the pressure to replace it — early, and expensively — starts coming from every direction.</p>
 </div>
 <div class="grid4">
 <div class="pcard reveal"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div><h3>Replacement cost</h3><p>A new roof can run into the tens of thousands of dollars.</p></div>
 <div class="pcard reveal"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div><h3>Roof age</h3><p>Once a roof reaches its mid-teens, it starts drawing attention — even if it isn't leaking.</p></div>
 <div class="pcard reveal"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/></svg></div><h3>Insurance pressure</h3><p>Many insurers look closely at older roofs, and roof age may affect coverage.</p></div>
 <div class="pcard reveal"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v9h14v-9"/><path d="M9 21v-6h6v6"/></svg></div><h3>Premature replacement</h3><p>Many roofs are torn off years before they had to be — a cost that may have been avoidable.</p></div>
 </div>
 </div>
` }}
 />
 );
}
