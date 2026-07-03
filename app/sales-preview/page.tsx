import { notFound } from "next/navigation";
import PreviewPresentation from "@/components/sales/PreviewPresentation";

export const dynamic = "force-dynamic";

/**
 * TEMPORARY local-only preview of the sales presentation (owner-approved).
 *
 * Hard gate: in a production build this route is a 404 unless ENABLE_SALES_PREVIEW=true
 * is deliberately set in the environment — it cannot ship publicly by accident.
 * No auth is weakened: /sales, /admin, /rep etc. remain fully middleware-protected;
 * this route renders mock data only and performs zero customer-data API calls.
 */
export default function SalesPreviewPage() {
  const allowed =
    process.env.NODE_ENV !== "production" || process.env.ENABLE_SALES_PREVIEW === "true";
  if (!allowed) notFound();
  return <PreviewPresentation />;
}
