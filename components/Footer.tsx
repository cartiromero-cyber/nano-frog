export default function Footer() {
 return (
 <footer
 dangerouslySetInnerHTML={{ __html: `
 <div class="wrap">
 <div class="fgrid">
 <div>
 <a href="#top"><img src="assets/elytra-shield-logo.png" alt="Elytra Shield — Roof Preservation" style="height:60px;width:auto;display:block"></a>
 <p class="fdesc">Protect what protects your home. Advanced roof preservation, an honest Roof Health Assessment™, and documentation you keep.</p>
 </div>
 <div><h5>Homeowners</h5><a href="#">Roof Preservation</a><a href="#">Is My Roof a Candidate?</a><a href="#">Roof &amp; Insurance</a><a href="#">Cost vs. Replacement</a></div>
 <div><h5>Commercial</h5><a href="#">Roof Asset Management</a><a href="#">Restore vs. Replace</a><a href="#">Request Assessment</a></div>
 <div><h5>Company</h5><a href="#">Learning Center</a><a href="#">The Roof Health Assessment™</a><a href="#">Service Area</a><a href="#assess">Free Assessment</a></div>
 </div>
 <div class="fbot">
 <span>© 2026 Elytra Shield. All rights reserved. Elytra Shield is an independent roof-preservation service and is not affiliated with any shingle or product manufacturer.</span>
 <span>Inspection required. For qualifying roofs. Roof preservation is a maintenance treatment, not a roof replacement or guarantee of outcomes.</span>
 </div>
 </div>
` }}
 />
 );
}
