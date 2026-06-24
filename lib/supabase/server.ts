import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Server-side anon client (respects RLS). Use for reads that should obey policies. */
export function supabaseServer() {
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}
