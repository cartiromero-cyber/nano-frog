# /sales Presentation — Deep Product Finish Audit

Scope: the isolated `/sales` iPad presentation and its supporting assets only. Public website,
backend, CRM, admin, and passport logic were not changed.

## 1. What was broken
- **Escaped unicode rendered on screen** — `Let’s`, `—`, `→`, `™`, `·`, `…`
  appeared literally. Cause: these were written in **JSX text** (between tags), where JS escape
  sequences are not processed, so they render as raw characters.
- **Visuals felt like placeholders** — the membrane demo and several roof panels used flat
  repeating-gradient "shingles," which read as illustrative rather than a real roof surface.

## 2. What was fixed (in code)
- **All escaped unicode replaced with real characters** project-wide: 212 sequences across 72 files.
  Zero escapes remain in any `.ts/.tsx/.md/.sql` file. (JSON kept its valid `\u` escapes.)
- **Realistic roof texture** (`.roof-tex`) — a procedural architectural-shingle SVG (staggered
  courses, dimensional shadow bands, brick-tab joints) blended with fractal-noise granules, soft
  lighting, slight blur and contrast for a photographic feel. Now used by the membrane demo and the
  "Why Roofs Age" slide instead of flat gradients.
- **Slide 7 — Membrane Demonstration (centerpiece), rebuilt:** realistic shingle base in perspective
  → green-tinted membrane **flows** across (no glow) → surface **darkens/seals** → realistic
  **water beads** form (radial-gradient droplets with real highlights/shadows) → calm captions cycle
  the phases. **Drop-in `membrane-demo.mp4` auto-plays over the procedural version when present.**
- **Slide 4 — What Is Nano Frog:** replaced the abstract panel with a **realistic cross-section** —
  fiberglass mat → asphalt layer → granule layer (real granule dots) → **Nano Frog membrane** sheen
  at the surface → **water beads on top** → **UV rays deflecting**. Labeled like an inspection diagram.
- **Slide 3 — Cost of Delay:** larger chart, a **shaded gap area** between the two cost lines (the
  cost of waiting is now visually obvious), and a clear **"replacement"** jump marker on the delay line.
- **Slide 2 — Why Roofs Age:** the roof panel now uses the realistic `.roof-tex` surface under each
  aging overlay (UV/moisture/thermal/granule/oxidation).
- **Slide 11 — Next Steps:** added a calm reassurance line and a **"Recommended"** highlight on the
  option that matches the session's result (Schedule Inspection, or Speak With Specialist if Not
  Recommended).

## 3. Visuals that still need external asset generation
Code can only get so photographic. For true "would a homeowner believe this is a real roof?" realism,
drop real files into **`/public/sales-assets/`** (procedural fallback renders until then):
| Asset | Slide | Status |
|---|---|---|
| `membrane-demo.mp4` | 7 | **Wired** — auto-plays when present |
| `shingle-macro.jpg` | 2 / 4 | Recommended (procedural texture is the fallback) |
| `home.jpg` | 1 | Recommended (refined SVG house is the fallback) |
| `membrane-before.jpg` / `membrane-after.jpg` | 7 | Optional stills |
| `lab.jpg` | 8 | Recommended (procedural lab is the fallback) |

## 4. Recommended asset list (shoot or generate)
1. **Macro asphalt-shingle photo** — top-down, raking light, visible granules, slight weathering.
2. **Membrane transformation clip (~8s, 1280×720, muted, loopable)** — same shingle, dry → green
   membrane flows → water beads. Seed from the macro photo above.
3. **Before/after macro stills** of the same shingle.
4. **Modern home photo** with the roof prominent (slide 1).
5. **Premium lab still** — glassware, green fluid, materials-science feel (slide 8).

## 5. Prompt suggestions (Higgsfield / Runway / Pika / Midjourney)
Ground every one in a **real macro shingle reference image** (image-to-video / image-to-image):
- **Membrane flow (Runway/Higgsfield, image-to-video):**
  "Extreme macro of weathered grey asphalt roof shingles, visible mineral granules, soft overcast
  light. A thin clear green-tinted protective liquid slowly flows left to right across the surface,
  the shingle darkens slightly and looks sealed, then small water droplets bead up and sit on top.
  Realistic, documentary, no glow, no sci-fi, no text. 8 seconds, subtle motion, loopable."
- **Water beading (Pika/Runway):** "Macro of a treated asphalt shingle; water droplets bead and
  hold their shape on the surface, slight roll, photorealistic, raking light, no logos."
- **Macro shingle still (Midjourney):** "photorealistic extreme macro of architectural asphalt
  roof shingles, mineral granules, weathered texture, natural daylight, shallow depth of field,
  product-photography quality --ar 16:10"
- **Home (Midjourney):** "clean modern suburban home at golden hour, roof prominent and in focus,
  warm window glow, photoreal, architectural photography --ar 16:10"
- **Lab (Midjourney):** "premium materials-science lab, glassware with green fluid, soft cinematic
  lighting, shallow depth of field, no people, Apple-keynote aesthetic --ar 16:10"
> Realism rule: never accept hallucinated rooftops. If it doesn't look like it started from a real
> shingle, regenerate. Replaceable files live in `/public/sales-assets`.

## 6. Final QA checklist
- [x] No escaped unicode renders anywhere (212 fixed, 0 remain)
- [x] Membrane demo rebuilt as the strongest visual moment + video drop-in
- [x] Realistic shingle texture replaces flat gradients on roof slides
- [x] Cross-section reads like a product diagram (granule/asphalt/membrane/beads/UV)
- [x] Cost-of-Delay gap is visually obvious; replacement jump labeled
- [x] Next Steps has reassurance + recommended highlight
- [x] iPad-first: full-screen, large touch targets, dark premium UI preserved
- [x] Public website untouched (15 homepage components, no internal notes)
- [ ] **Run `npm run build` locally** (sandbox registry is blocked here)
- [ ] Drop real `/public/sales-assets` files for full photographic realism

## Update — real-asset integration pass
Every asset slot is now wired with a loading-safe `useAssetReady()` check (preloads the file; on
success swaps in the real media, on failure keeps the procedural fallback — no broken images, no
errors if files are absent):
| Slide | Asset | Treatment |
|---|---|---|
| 1 | `home.jpg` | Full-cover photo + dark gradient + owner-name caption (cartoon house is fallback) |
| 2 | `shingle-macro.jpg` | Becomes the roof surface behind each aging overlay (procedural texture fallback) |
| 4 | `shingle-macro.jpg` | Faint base behind the cross-section diagram |
| 5 | `shingle-macro.jpg` | Subtle base behind the Roof Health Score gauge |
| 7 | `membrane-demo.mp4` + `shingle-macro.jpg` | Video is primary; macro is the realistic base under the procedural membrane flow |
| 8 | `lab.jpg` | Full-cover photo + gradient (procedural lab is fallback) |
| 10 | `roof-report-cover.jpg` | Optional cover banner atop the report sheet |

Implementation: `components/sales/useAsset.ts` (the hook), `content/sales-assets.ts` (paths),
`.asset-cover` / `.asset-shade` / `.asset-faint` / `.report-cover` in `styles/sales.css`.
Video is loaded via a `<video src>` public path (not bundled). Drop files into
`/public/sales-assets/` and they appear automatically — no code change.
