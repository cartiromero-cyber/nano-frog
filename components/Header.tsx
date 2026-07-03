export default function Header() {
 return (
 <header id="hdr"
 dangerouslySetInnerHTML={{ __html: `
 <div class="nav">
 <a class="logo" href="#top">
 <img class="mark" src="assets/elytra-shield-icon.png" alt="Elytra Shield" width="40" height="40">
 <span class="wm">Elytra Shield<small>Roof Preservation</small></span>
 </a>
 <nav class="navlinks">
 <a class="nl" href="#difference">The Difference</a>
 <a class="nl" href="#how">How It Works</a>
 <a class="nl" href="#score">Roof Health Assessment</a>
 <a class="nl" href="#learn">Learning Center</a>
 <a class="btn btn-g" href="#assess">Schedule Free Assessment</a>
 </nav>
 </div>
` }}
 />
 );
}
