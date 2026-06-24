'use client';
import { useState } from "react";
import { newSession, type SalesSession } from "@/types/sales";
import Step4RoofHealthScore from "@/components/sales/steps/Step4RoofHealthScore";

export default function AssessStandalone() {
  const [session, setSession] = useState<SalesSession>(() => newSession());
  const update = (patch: Partial<SalesSession>) => setSession((s) => ({ ...s, ...patch }));
  return <Step4RoofHealthScore session={session} update={update} goNext={() => {}} goPrev={() => {}} />;
}
