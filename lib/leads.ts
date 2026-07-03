import { randomUUID } from "crypto";
import type { Lead, LeadType, LeadPayload } from "@/types";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Persist a lead. Storage backend is selected with the LEAD_STORE env var.
 *
 * C2 (approved): leads may never exist only in logs.
 * - LEAD_STORE=supabase inserts into the `leads` table (supabase/schema.sql).
 * - If the configured store is unavailable or an insert fails, the error is logged
 *   LOUDLY and the lead JSON is still logged as a last-resort recovery record —
 *   and the caller still sends the email notification, so no lead is silent.
 * - The "log"/default mode now warns on every submission that storage is not durable.
 */
export async function saveLead(type: LeadType, data: LeadPayload): Promise<Lead> {
  const lead: Lead = { id: randomUUID(), type, createdAt: new Date().toISOString(), data };

  switch (process.env.LEAD_STORE) {
    case "supabase": {
      const db = supabaseAdmin();
      if (!db) {
        console.error("[LEAD:ERROR] LEAD_STORE=supabase but SUPABASE env vars are missing — lead NOT stored durably!", JSON.stringify(lead));
        break;
      }
      const d = data as { name?: string; email?: string; phone?: string; address?: string; city?: string };
      const { error } = await db.from("leads").insert({
        id: lead.id,
        name: d.name ?? null,
        email: d.email ?? null,
        phone: d.phone ?? null,
        address: d.address ?? null,
        city: d.city ?? null,
        source: `website-${type}`,
        status: "new",
      });
      if (error) {
        console.error("[LEAD:ERROR] Supabase insert failed — lead NOT stored durably!", error.message, JSON.stringify(lead));
      }
      break;
    }
    case "postgres":
      // import { neon } from "@neondatabase/serverless";
      // const sql = neon(process.env.DATABASE_URL!);
      // await sql`INSERT INTO leads (id, type, created_at, data) VALUES (${lead.id}, ${type}, ${lead.createdAt}, ${JSON.stringify(data)})`;
      console.error("[LEAD:ERROR] LEAD_STORE=postgres is not implemented — lead NOT stored durably!", JSON.stringify(lead));
      break;
    case "airtable": {
      const key = process.env.AIRTABLE_API_KEY, base = process.env.AIRTABLE_BASE_ID, table = process.env.AIRTABLE_TABLE || "Leads";
      if (!key || !base) {
        console.error("[LEAD:ERROR] LEAD_STORE=airtable but AIRTABLE env vars are missing — lead NOT stored durably!", JSON.stringify(lead));
        break;
      }
      try {
        const r = await fetch(`https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ fields: { Type: type, CreatedAt: lead.createdAt, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v != null)) } }),
        });
        if (!r.ok) console.error("[LEAD:ERROR] Airtable insert failed — lead NOT stored durably!", r.status, JSON.stringify(lead));
      } catch (err) {
        console.error("[LEAD:ERROR] Airtable insert failed — lead NOT stored durably!", err, JSON.stringify(lead));
      }
      break;
    }
    default:
      console.warn("[LEAD:WARNING] LEAD_STORE is not configured — this lead exists ONLY in server logs. Set LEAD_STORE=supabase before accepting real traffic.");
      console.log("[LEAD]", JSON.stringify(lead));
  }
  return lead;
}
