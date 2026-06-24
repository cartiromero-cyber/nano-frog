import type { ComponentType } from "react";
import type { StepProps } from "@/types/sales";
import Step1Connection from "./Step1Connection";
import StepRoofNobody from "./StepRoofNobody";
import StepWhyChoose from "./StepWhyChoose";
import StepRoofShield from "./StepRoofShield";
import Step3WhatIsNanoFrog from "./Step3WhatIsNanoFrog";
import Step6MembraneDemo from "./Step6MembraneDemo";
import Step2WhyRoofsAge from "./Step2WhyRoofsAge";
import Step5CostOfWaiting from "./Step5CostOfWaiting";
import StepChooseNanoFrog from "./StepChooseNanoFrog";
import StepPromise from "./StepPromise";
import Step4RoofHealthScore from "./Step4RoofHealthScore";
import Step8Recommendation from "./Step8Recommendation";
import StepOptions from "./StepOptions";
import Step10NextSteps from "./Step10NextSteps";

export const STEPS: { title: string; Component: ComponentType<StepProps> }[] = [
  { title: "Your Home", Component: Step1Connection },
  { title: "The Roof Nobody Thinks About", Component: StepRoofNobody },
  { title: "Things We Already Protect", Component: StepWhyChoose },
  { title: "Your Roof Is the Shield", Component: StepRoofShield },
  { title: "What Is Nano Frog", Component: Step3WhatIsNanoFrog },
  { title: "Membrane Demonstration", Component: Step6MembraneDemo },
  { title: "Why Roofs Age", Component: Step2WhyRoofsAge },
  { title: "The Cost of Waiting", Component: Step5CostOfWaiting },
  { title: "Why Homeowners Choose Nano Frog", Component: StepChooseNanoFrog },
  { title: "The Nano Frog Promise", Component: StepPromise },
  { title: "Your Roof Health Score", Component: Step4RoofHealthScore },
  { title: "Recommendation", Component: Step8Recommendation },
  { title: "Your Options", Component: StepOptions },
  { title: "Let’s Protect It", Component: Step10NextSteps },
];
