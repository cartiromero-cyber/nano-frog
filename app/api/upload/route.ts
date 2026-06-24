import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase/admin";
import { attachUpload, type UploadTarget } from "@/lib/sales/db";
import { getCurrentRep, getScope } from "@/lib/sales/auth";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];
const TARGETS: UploadTarget[] = ["lead", "sales_session", "roof_passport", "assessment"];

// Confirm the target record is within the caller's scope (REP own / MANAGER team / ADMIN all).
async function targetAllowed(db: any, repIds: string[] | null, target: UploadTarget, targetId?: string): Promise<boolean> {
  if (repIds === null) return true; // admin
  if (!targetId) return false;
  const table = target === "lead" ? "leads" : target === "roof_passport" ? "roof_passports" : target === "sales_session" ? "sales_sessions" : "roof_assessments";
  if (table === "roof_assessments") {
    const { data } = await db.from("roof_assessments").select("lead_id").eq("id", targetId).limit(1);
    const lid = data && data[0] && data[0].lead_id;
    if (!lid) return false;
    const { data: l } = await db.from("leads").select("rep_id").eq("id", lid).limit(1);
    return !!(l && l[0] && l[0].rep_id && repIds.includes(l[0].rep_id));
  }
  const { data } = await db.from(table).select("rep_id").eq("id", targetId).limit(1);
  return !!(data && data[0] && data[0].rep_id && repIds.includes(data[0].rep_id));
}

export async function POST(req: NextRequest) {
  try {
    if (!(await checkRateLimit(req)))
      return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });

    const ctx = await getCurrentRep();
    if (!ctx) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const file = form.get("photo") || form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
    if (!ALLOWED.includes(file.type)) return NextResponse.json({ ok: false, error: "Unsupported file type." }, { status: 415 });
    if (file.size > MAX_BYTES) return NextResponse.json({ ok: false, error: "File too large (max 10 MB)." }, { status: 413 });

    const targetRaw = String(form.get("target") || "roof_passport");
    const target = (TARGETS.includes(targetRaw as UploadTarget) ? targetRaw : "roof_passport") as UploadTarget;
    const targetId = (form.get("targetId") as string) || undefined;
    const caption = (form.get("caption") as string) || undefined;
    const uploadedBy = (form.get("uploadedBy") as string) || undefined;

    const db = supabaseAdmin();
    if (!db) {
      // Fallback: validate only, do not persist (no storage configured).
      return NextResponse.json({ ok: true, stored: false, meta: { name: file.name, type: file.type, size: file.size } });
    }

    // Enforce that the file is attached only to a record the caller may access.
    const { repIds } = await getScope(ctx);
    if (!(await targetAllowed(db, repIds, target, targetId))) {
      return NextResponse.json({ ok: false, error: "Not permitted for this record." }, { status: 403 });
    }

    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${target}/${targetId || "unassigned"}/${Date.now()}-${safe}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const up = await db.storage.from(STORAGE_BUCKET).upload(path, bytes, { contentType: file.type, upsert: false });
    if (up.error) throw up.error;
    const { data: pub } = db.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    const id = await attachUpload({ target, targetId, path, url: pub.publicUrl, fileType: file.type, caption, uploadedBy });

    return NextResponse.json({ ok: true, stored: true, id, url: pub.publicUrl, path });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
