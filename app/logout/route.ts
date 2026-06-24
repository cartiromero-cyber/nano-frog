import { NextResponse } from "next/server";
import { supabaseAuthServer } from "@/lib/supabase/auth-server";

export const runtime = "nodejs";
export async function GET(req: Request) {
  const auth = supabaseAuthServer();
  if (auth) await auth.auth.signOut();
  return NextResponse.redirect(new URL("/login", req.url));
}
