import PassportView from "@/components/sales/PassportView";
import { lookupPassport } from "@/lib/sales/db";

export const dynamic = "force-dynamic";

// H3 (approved): the fabricated demo passport is no longer rendered. Only real records
// are shown; anything else gets a plain not-found message (route is auth-gated by middleware).
export default async function PassportPage({ searchParams }: { searchParams: { id?: string; phone?: string; email?: string; address?: string } }) {
  const by = { id: searchParams.id, phone: searchParams.phone, email: searchParams.email, address: searchParams.address };
  const hasKey = Boolean(by.id || by.phone || by.email || by.address);
  const found = hasKey ? await lookupPassport(by) : null;
  if (!found) {
    return (
      <main style={{ fontFamily: "var(--sans)", padding: "80px 26px", maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--disp)", fontSize: "1.6rem", color: "var(--ink)" }}>No Roof Passport found</h1>
        <p className="muted" style={{ marginTop: 10 }}>
          {hasKey
            ? "No record matches that lookup. Check the passport ID or contact details and try again."
            : "A passport ID or the phone, email, or address on file is required to view a Digital Roof Passport™."}
        </p>
      </main>
    );
  }
  return <PassportView p={found} />;
}
