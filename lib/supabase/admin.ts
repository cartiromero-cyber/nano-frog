import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Service-role client. Bypasses RLS \u2014 SERVER ONLY. Never import this into a client
 * component. Returns null when not configured so callers can fall back gracefully.
 */
export function supabaseAdmin(): SupabaseClient | null {
  if (typeof window !== "undefined") {
    throw new Error("supabaseAdmin() must never run in the browser");
  }
  if (!url || !service) return null;
  return createClient(url, service, { auth: { persistSession: false } });
}

export const supabaseAdminEnabled = Boolean(url && service);
export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "roof-passports";
