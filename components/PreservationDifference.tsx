export default function PreservationDifference() {
 return (
 <section className="pdiff" id="preservation-difference"
 dangerouslySetInnerHTML={{ __html: `
 <div class="wrap">
 <div class="pd-head">
 <span class="eyebrow" style="justify-content:center">Preservation in action</span>
 <h2>See The Difference Preservation Makes</h2>
 <p class="pd-sub">A qualifying roof may still have years of usable life remaining. Elytra Shield's preservation process is designed to help protect shingles from continued aging and environmental exposure.</p>
 </div>
 <div class="pd-stage" id="pdStage">
 <div class="pd-roof pd-pres"><div class="pd-tex"></div><div class="pd-sheen"></div><div class="pd-beads"><i class="pd-bead" style="width:11px;height:11px;left:14%;top:12%;animation-delay:3.26s;animation-duration:6.77s"></i><i class="pd-bead" style="width:15px;height:15px;left:49%;top:26%;animation-delay:3.99s;animation-duration:6.3s"></i><i class="pd-bead" style="width:7px;height:7px;left:32%;top:68%;animation-delay:4.96s;animation-duration:5.82s"></i><i class="pd-bead" style="width:14px;height:14px;left:57%;top:12%;animation-delay:2.82s;animation-duration:7.7s"></i><i class="pd-bead" style="width:12px;height:12px;left:11%;top:36%;animation-delay:4.31s;animation-duration:7.27s"></i><i class="pd-bead" style="width:9px;height:9px;left:83%;top:37%;animation-delay:5.34s;animation-duration:6.59s"></i><i class="pd-bead" style="width:12px;height:12px;left:77%;top:46%;animation-delay:3.63s;animation-duration:6.44s"></i><i class="pd-bead" style="width:8px;height:8px;left:64%;top:32%;animation-delay:3.95s;animation-duration:7.27s"></i><i class="pd-bead" style="width:14px;height:14px;left:90%;top:30%;animation-delay:1.0s;animation-duration:6.04s"></i><i class="pd-bead" style="width:12px;height:12px;left:90%;top:76%;animation-delay:1.08s;animation-duration:5.84s"></i><i class="pd-bead" style="width:8px;height:8px;left:58%;top:14%;animation-delay:3.12s;animation-duration:8.32s"></i></div></div>
 <div class="pd-roof pd-aged"><div class="pd-tex"></div><div class="pd-wash"></div></div>
 <span class="pd-lab pd-lab-aged">Aged</span>
 <span class="pd-lab pd-lab-pres">Preserved</span>
 <div class="pd-handle"><div class="pd-grip" id="pdGrip" role="slider" tabindex="0" aria-label="Drag to compare aged versus preserved roof" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg></div></div>
 </div>
 <p class="pd-hint">Drag to compare</p>
 <div class="pd-cta"><a class="btn btn-g" href="#assess">See If Your Roof Qualifies
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>
 <p class="pd-note">Illustrative visualization. Actual appearance and results vary by roof; preservation suitability is confirmed by an on-site inspection.</p>
 </div>
` }}
 />
 );
}
