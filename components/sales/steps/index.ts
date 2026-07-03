import type { ComponentType } from "react";
import type { StepProps } from "@/types/sales";
import Step1Connection from "./Step1Connection";
import StepRoofNobody from "./StepRoofNobody";
import StepWhyChoose from "./StepWhyChoose";
import StepRoofShield from "./StepRoofShield";
import Step3WhatIsElytraShield from "./Step3WhatIsElytraShield";
import Step6MembraneDemo from "./Step6MembraneDemo";
import Step2WhyRoofsAge from "./Step2WhyRoofsAge";
import Step5CostOfWaiting from "./Step5CostOfWaiting";
import StepChooseElytraShield from "./StepChooseElytraShield";
import StepPromise from "./StepPromise";
import Step4RoofHealthScore from "./Step4RoofHealthScore";
import Step8Recommendation from "./Step8Recommendation";
import StepOptions from "./StepOptions";
import Step10NextSteps from "./Step10NextSteps";

// Change 009 (approved): diagnosis-first order. The homeowner's roof (score) moves from
// slide 11 to slide 4; company story/persuasion slides follow the findings instead of
// preceding them. Also fixes a logic ordering issue: The Cost of Waiting consumes score
// inputs, which are now captured BEFORE it runs. No slides added or removed.
export const STEPS: { title: string; Component: ComponentType<StepProps> }[] = [
  { title: "Your Home", Component: Step1Connection },
  { title: "The Roof Nobody Thinks About", Component: StepRoofNobody },
  { title: "Why Roofs Age", Component: Step2WhyRoofsAge },
  { title: "Your Roof Health Score", Component: Step4RoofHealthScore },
  { title: "The Cost of Waiting", Component: Step5CostOfWaiting },
  { title: "What Is Elytra Shield", Component: Step3WhatIsElytraShield },
  { title: "Membrane Demonstration", Component: Step6MembraneDemo },
  { title: "Things We Already Protect", Component: StepWhyChoose },
  { title: "Your Roof Is the Shield", Component: StepRoofShield },
  { title: "Why Homeowners Choose Elytra Shield", Component: StepChooseElytraShield },
  { title: "The Elytra Shield Promise", Component: StepPromise },
  { title: "Recommendation", Component: Step8Recommendation },
  { title: "Your Options", Component: StepOptions },
  { title: "Let’s Protect It", Component: Step10NextSteps },
];
