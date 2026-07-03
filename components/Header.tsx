import { PHONE, PHONE_TEL } from "@/content/site";

// C3 (approved): on non-home pages the header renders with the existing `solid` style
// (site.js, which toggles it on scroll, loads only on the homepage). No new styles —
// `header.solid` is the same approved appearance the homepage shows after scrolling.
export default function Header({ solid = false }: { solid?: boolean }) {
 const phoneLink = PHONE ? `<a class="nl" href="${PHONE_TEL}">${PHONE}</a>` : "";
 return (
 <header id="hdr" className={solid ? "solid" : undefined}
 dangerouslySetInnerHTML={{ __html: `
 <div class="nav">
 <a class="logo" href="/">
 <img class="mark" src="/assets/elytra-shield-icon.png" alt="Elytra Shield" width="40" height="40">
 <span class="wm">Elytra Shield<small>Roof Preservation</small></span>
 </a>
 <nav class="navlinks">
 <a class="nl" href="/#difference">The Difference</a>
 <a class="nl" href="/#how">How It Works</a>
 <a class="nl" href="/#score">Roof Health Assessment</a>
 <a class="nl" href="/#learn">Learning Center</a>
 ${phoneLink}
 <a class="btn btn-g" href="/book">Schedule Free Assessment</a>
 </nav>
 </div>
` }}
 />
 );
}
