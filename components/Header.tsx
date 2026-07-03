import { PHONE, PHONE_TEL } from "@/content/site";

export default function Header() {
 // Changes 001 + 003 (approved): CTA points to the /book page; click-to-call renders
 // when NEXT_PUBLIC_PHONE is configured. Asset/anchor paths made absolute so the header
 // works identically on every route. Visual design unchanged.
 const phoneLink = PHONE ? `<a class="nl" href="${PHONE_TEL}">${PHONE}</a>` : "";
 return (
 <header id="hdr"
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
