export default function Header() {
 return (
 <header id="hdr"
 dangerouslySetInnerHTML={{ __html: `
 <div class="nav">
 <a class="logo" href="#top">
 <img class="mark" src="assets/nanofrog-mark.png" alt="Nano Frog" width="40" height="40">
 <span class="wm">Nano Frog<small>Roof Preservation</small></span>
 </a>
 <nav class="navlinks">
 <a class="nl" href="#difference">The Difference</a>
 <a class="nl" href="#how">How It Works</a>
 <a class="nl" href="#score">Roof Health Score</a>
 <a class="nl" href="#learn">Learning Center</a>
 <a class="btn btn-g" href="#assess">See If Your Roof Qualifies</a>
 </nav>
 </div>
` }}
 />
 );
}
