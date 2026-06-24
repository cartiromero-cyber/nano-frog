import PassportView from "@/components/sales/PassportView";
import { demoPassport } from "@/lib/sales/passport";
import { lookupPassport } from "@/lib/sales/db";

export const dynamic = "force-dynamic";

export default async function PassportPage({ searchParams }: { searchParams: { id?: string; phone?: string; email?: string; address?: string } }) {
  const by = { id: searchParams.id, phone: searchParams.phone, email: searchParams.email, address: searchParams.address };
  const hasKey = Boolean(by.id || by.phone || by.email || by.address);
  const found = hasKey ? await lookupPassport(by) : null;
  return <PassportView p={found || demoPassport()} />;
}
