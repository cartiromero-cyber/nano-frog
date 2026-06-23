import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic"];

/**
 * Photo upload endpoint (optional field on the assessment form).
 * Validates type/size, then hands off to your storage provider. By default it does
 * NOT persist the file (no cloud creds required); wire UPLOAD_PROVIDER in DEPLOYMENT.md
 * (Supabase Storage / S3) to actually store and return a public URL.
 */
export async function POST(req: NextRequest) {
  try {
    if (!(await checkRateLimit(req)))
      return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });

    const form = await req.formData();
    const file = form.get("photo");
    if (!(file instanceof File))
      return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
    if (!ALLOWED.includes(file.type))
      return NextResponse.json({ ok: false, error: "Unsupported file type." }, { status: 415 });
    if (file.size > MAX_BYTES)
      return NextResponse.json({ ok: false, error: "File too large (max 8 MB)." }, { status: 413 });

    // TODO: persist to storage and return the URL. Example (Supabase):
    //   const bytes = Buffer.from(await file.arrayBuffer());
    //   const { data } = await supabase.storage.from("roof-photos").upload(name, bytes);
    //   const url = supabase.storage.from("roof-photos").getPublicUrl(data.path).publicUrl;

    return NextResponse.json({
      ok: true,
      message: "Photo received.",
      // photoUrl: url,  // returned once a storage provider is configured
      meta: { name: file.name, type: file.type, size: file.size },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
