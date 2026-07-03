'use client';
import { useRef } from "react";
import type { StepProps } from "@/types/sales";
import type { RoofPhotoNote } from "@/types/sales";

// P-002 (approved): "Your Roof Today" — the ownership moment. The rep's inspection photos,
// annotated ✓/⚠/✕ live at the kitchen table. Photos are downscaled to keep the session light
// and are stored in the session so they survive slide navigation and reach the saved record.
// Design language: existing s-* classes and status colors only.

const STATUS: { key: RoofPhotoNote["status"]; label: string; color: string }[] = [
  { key: "healthy", label: "✓ Healthy", color: "var(--score)" },
  { key: "watch", label: "⚠ Watch", color: "#E0A12E" },
  { key: "concern", label: "✕ Concern", color: "#C0532E" },
];

function downscale(file: File, maxDim = 900, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image load failed")); };
    img.src = url;
  });
}

export default function StepYourRoofToday({ session, update }: StepProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const photos = session.roofPhotos || [];
  const setPhotos = (next: RoofPhotoNote[]) => update({ roofPhotos: next });

  async function onFiles(list: FileList | null) {
    if (!list || !list.length) return;
    const added: RoofPhotoNote[] = [];
    for (const f of Array.from(list).slice(0, 12 - photos.length)) {
      try { added.push({ dataUrl: await downscale(f), status: "watch" }); } catch { /* skip unreadable */ }
    }
    if (added.length) setPhotos([...photos, ...added]);
  }
  const setStatus = (i: number, status: RoofPhotoNote["status"]) =>
    setPhotos(photos.map((p, n) => (n === i ? { ...p, status } : p)));
  const setLabel = (i: number, label: string) =>
    setPhotos(photos.map((p, n) => (n === i ? { ...p, label } : p)));
  const remove = (i: number) => setPhotos(photos.filter((_, n) => n !== i));

  return (
    <div className="s-wrap">
      <span className="s-eyebrow">Your roof today</span>
      <h2 className="s-h">This is your roof — photographed this visit.</h2>
      <p className="s-lead">Not a stock photo. Not an illustration. What&rsquo;s actually on your roof right now, area by area.</p>

      {photos.length === 0 ? (
        <div className="s-panel" style={{ marginTop: 22, display: "grid", placeItems: "center", minHeight: 220, textAlign: "center" }}>
          <div>
            <p style={{ color: "rgba(234,242,248,.8)", marginBottom: 14 }}>Add the inspection photos taken on this roof.</p>
            <button className="sales-btn solid" onClick={() => fileRef.current?.click()}>Add roof photos</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, marginTop: 22 }}>
            {photos.map((p, i) => {
              const active = STATUS.find((s) => s.key === p.status)!;
              return (
                <div className="s-card" key={i} style={{ padding: 10, borderColor: active.color }}>
                  <div style={{ position: "relative" }}>
                    <img src={p.dataUrl} alt={p.label || `Roof photo ${i + 1}`} style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8, display: "block" }} />
                    <button aria-label="Remove photo" onClick={() => remove(i)} className="sales-btn ghost"
                      style={{ position: "absolute", top: 6, right: 6, padding: "2px 8px", fontSize: ".7rem" }}>✕</button>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    {STATUS.map((s) => (
                      <button key={s.key} className={"s-chip" + (p.status === s.key ? " sel" : "")}
                        style={p.status === s.key ? { borderColor: s.color, color: s.color } : undefined}
                        onClick={() => setStatus(i, s.key)}>{s.label}</button>
                    ))}
                  </div>
                  <input className="s-input" style={{ marginTop: 8, fontSize: ".82rem" }} placeholder="Note (e.g. granule wash, north slope)"
                    value={p.label || ""} onChange={(e) => setLabel(i, e.target.value)} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
            <button className="sales-btn ghost" onClick={() => fileRef.current?.click()} disabled={photos.length >= 12}>+ Add more</button>
            <span style={{ fontSize: ".78rem", color: "rgba(234,242,248,.55)" }}>
              {photos.filter((p) => p.status === "healthy").length} healthy · {photos.filter((p) => p.status === "watch").length} watch · {photos.filter((p) => p.status === "concern").length} concern
            </span>
          </div>
        </>
      )}
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
    </div>
  );
}
