export default function Footer() {
 return (
 <footer
 dangerouslySetInnerHTML={{ __html: `
 <div class="wrap">
 <div class="fgrid">
 <div>
 <a href="#top"><img src="assets/nanofrog-lockup.png" alt="Nano Frog — Roof Preservation Protection" style="height:52px;width:auto;display:block"></a>
 <p class="fdesc">The alternative to roof replacement. Nanotechnology roof preservation, an honest Roof Health Score™, and documentation you keep.</p>
 </div>
 <div><h5>Homeowners</h5><a href="#">Roof Preservation</a><a href="#">Is My Roof a Candidate?</a><a href="#">Roof &amp; Insurance</a><a href="#">Cost vs. Replacement</a></div>
 <div><h5>Commercial</h5><a href="#">Roof Asset Management</a><a href="#">Restore vs. Replace</a><a href="#">Request Assessment</a></div>
 <div><h5>Company</h5><a href="#">Learning Center</a><a href="#">The Roof Health Score™</a><a href="#">Service Area</a><a href="#assess">Free Assessment</a></div>
 </div>
 <div class="fbot">
 <span>© 2026 Nano Frog Protection. All rights reserved.</span>
 <span>Inspection required. For qualifying roofs. We do not guarantee insurance coverage or outcomes.</span>
 </div>
 </div>
` }}
 />
 );
}
