import type { ComponentType } from "react";
import type { StepProps } from "@/types/sales";
import Step1Connection from "./Step1Connection";
import StepRoofShield from "./StepRoofShield";
import Step2WhyRoofsAge from "./Step2WhyRoofsAge";
import Step5CostOfWaiting from "./Step5CostOfWaiting";
import StepYourRoofToday from "./StepYourRoofToday";
import Step4RoofHealthScore from "./Step4RoofHealthScore";
import StepReplacementVerdict from "./StepReplacementVerdict";
import StepIfNothing from "./StepIfNothing";
import StepWhyChoose from "./StepWhyChoose";
import Step3WhatIsElytraShield from "./Step3WhatIsElytraShield";
import Step6MembraneDemo from "./Step6MembraneDemo";
import Step8Recommendation from "./Step8Recommendation";
import StepInvestment from "./StepInvestment";
import StepReport from "./StepReport";
import Step10NextSteps from "./Step10NextSteps";
import StepPromise from "./StepPromise";

// P-001 (approved): the conversion sequence —
// Awareness → Risk → Cost → Ownership → Assessment → Verdict → Baseline → Opportunity →
// Evidence → Recommendation → Decision → (post-yes) Promise.
//
// Retired from the core flow (components preserved in this directory):
//   StepRoofNobody         — punchline merged into Why Roofs Age
//   StepChooseElytraShield — insurance analogy removed (P-007)
//   StepOptions            — membership tiers move to the completion/passport touchpoint
// StepPromise now closes the deck AFTER the decision as post-yes reassurance.
// The Investment slide (P-004) is intentionally absent — HELD pending pricing decisions.
export const STEPS: { title: string; Component: ComponentType<StepProps> }[] = [
  { title: "Your Home", Component: Step1Connection },
  { title: "Your Roof Is the Shield", Component: StepRoofShield },
  { title: "Why Roofs Age", Component: Step2WhyRoofsAge },
  { title: "The Cost of Waiting", Component: Step5CostOfWaiting },
  { title: "Your Roof Today", Component: StepYourRoofToday },
  { title: "Your Roof Health Score", Component: Step4RoofHealthScore },
  { title: "Is Replacement Necessary Today?", Component: StepReplacementVerdict },
  { title: "If We Do Nothing", Component: StepIfNothing },
  { title: "Things We Already Protect", Component: StepWhyChoose },
  { title: "What Is Elytra Shield", Component: Step3WhatIsElytraShield },
  { title: "Membrane Demonstration", Component: Step6MembraneDemo },
  { title: "Recommendation", Component: Step8Recommendation },
  { title: "The Investment", Component: StepInvestment },
  { title: "Your Roof Health Report™", Component: StepReport },
  { title: "Let’s Protect It", Component: Step10NextSteps },
  { title: "The Elytra Shield Promise", Component: StepPromise },
];
