import { randomUUID } from "crypto";
import type { SalesSession } from "@/types/sales";

/**
 * Persist a completed presentation session. Mirrors lib/leads.ts: zero-config by default
 * (logs), pluggable to Supabase/Postgres/Airtable via LEAD_STORE. No secrets hardcoded.
 */
export async function saveSession(session: SalesSession & { nextStep?: string }) {
  const record = { id: randomUUID(), kind: "sales-session", createdAt: new Date().toISOString(), session };
  switch (process.env.LEAD_STORE) {
    case "supabase": /* db.from("sales_sessions").insert(...) */ break;
    case "postgres": /* sql`INSERT INTO sales_sessions ...` */ break;
    case "airtable": /* POST to Airtable */ break;
    default: console.log("[SALES_SESSION]", JSON.stringify(record));
  }
  return record;
}
