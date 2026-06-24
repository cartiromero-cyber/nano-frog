'use client';
import { useState } from "react";
import { newSession, type SalesSession } from "@/types/sales";
import Step5CostOfWaiting from "@/components/sales/steps/Step5CostOfWaiting";

export default function CalcStandalone() {
  const [session, setSession] = useState<SalesSession>(() => newSession());
  const update = (patch: Partial<SalesSession>) => setSession((s) => ({ ...s, ...patch }));
  return <Step5CostOfWaiting session={session} update={update} goNext={() => {}} goPrev={() => {}} />;
}
