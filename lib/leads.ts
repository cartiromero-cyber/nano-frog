import { randomUUID } from "crypto";
import type { Lead, LeadType, LeadPayload } from "@/types";

/**
 * Persist a lead. Storage backend is selected with the LEAD_STORE env var.
 * Default ("log") simply logs to the server console so the app works out of the box.
 * Wire a real database by implementing the matching branch — see DEPLOYMENT.md.
 * No credentials are ever hardcoded; everything comes from environment variables.
 */
export async function saveLead(type: LeadType, data: LeadPayload): Promise<Lead> {
  const lead: Lead = { id: randomUUID(), type, createdAt: new Date().toISOString(), data };

  switch (process.env.LEAD_STORE) {
    case "supabase":
      // import { createClient } from "@supabase/supabase-js";
      // const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      // await db.from("leads").insert({ id: lead.id, type, created_at: lead.createdAt, data });
      break;
    case "postgres":
      // import { neon } from "@neondatabase/serverless";
      // const sql = neon(process.env.DATABASE_URL!);
      // await sql`INSERT INTO leads (id, type, created_at, data) VALUES (${lead.id}, ${type}, ${lead.createdAt}, ${JSON.stringify(data)})`;
      break;
    case "airtable":
      // await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE}`, {
      //   method: "POST",
      //   headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`, "Content-Type": "application/json" },
      //   body: JSON.stringify({ fields: { Type: type, ...data } }),
      // });
      break;
    default:
      // Works with zero configuration. Replace by setting LEAD_STORE.
      console.log("[LEAD]", JSON.stringify(lead));
  }
  return lead;
}
