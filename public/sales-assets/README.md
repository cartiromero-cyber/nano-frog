# /sales presentation — drop-in assets

Place real, licensed files here with these **exact names** and the matching slide will use them
automatically (a procedural visual renders until the file exists). Nothing else to wire — every slot is already integrated with a loading-safe fallback.

| File | Slide | What it should be | Recommended specs |
|---|---|---|---|
| `home.jpg` | 1 — Your Home | A real modern home with the **roof prominent**, warm/clean | 1600×1000, landscape |
| `shingle-macro.jpg` | 2 / 4 | **Macro** asphalt-shingle surface — visible granules, real texture | 1600×1000, sharp |
| `membrane-demo.mp4` | 7 — Membrane Demo | Cinematic macro transformation (dry → membrane flow → beading) | 1280×720, ~8s, H.264, muted, loopable |
| `membrane-before.jpg` | 7 (fallback) | Dry/faded macro shingle | 1600×1000 |
| `membrane-after.jpg` | 7 (fallback) | Treated macro shingle with water beads | 1600×1000 |
| `lab.jpg` | 8 — Chemist Story | Premium materials-science lab / glassware | 1600×1000 |
| `roof-report-cover.jpg` | 10 — Roof Report | Optional report-cover banner (inspection/record feel) | 1600×500, wide |

**Realism rule:** every roof visual should start from a *real* asphalt-shingle surface. Do not use
hallucinated/AI rooftops. If you generate motion (Higgsfield / Runway / Pika), seed it from a real
macro shingle reference. Prompt suggestions are in `docs/SALES-PRESENTATION-AUDIT.md`.
