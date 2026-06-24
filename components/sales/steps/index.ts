import type { ComponentType } from "react";
import type { StepProps } from "@/types/sales";
import Step1Connection from "./Step1Connection";
import Step2WhyRoofsAge from "./Step2WhyRoofsAge";
import StepFutureCost from "./StepFutureCost";
import Step3WhatIsNanoFrog from "./Step3WhatIsNanoFrog";
import Step4RoofHealthScore from "./Step4RoofHealthScore";
import Step5CostOfWaiting from "./Step5CostOfWaiting";
import Step6MembraneDemo from "./Step6MembraneDemo";
import Step7ChemistStory from "./Step7ChemistStory";
import Step8Recommendation from "./Step8Recommendation";
import Step9SavingsReport from "./Step9SavingsReport";
import Step10NextSteps from "./Step10NextSteps";

export const STEPS: { title: string; Component: ComponentType<StepProps> }[] = [
  { title: "Your Home", Component: Step1Connection },
  { title: "Why Roofs Age", Component: Step2WhyRoofsAge },
  { title: "The Cost of Delay", Component: StepFutureCost },
  { title: "What Is Nano Frog", Component: Step3WhatIsNanoFrog },
  { title: "Roof Health Score", Component: Step4RoofHealthScore },
  { title: "The Cost of Waiting", Component: Step5CostOfWaiting },
  { title: "Membrane Demo", Component: Step6MembraneDemo },
  { title: "The Chemist\u2019s Story", Component: Step7ChemistStory },
  { title: "Recommendation", Component: Step8Recommendation },
  { title: "Your Roof Report", Component: Step9SavingsReport },
  { title: "Next Steps", Component: Step10NextSteps },
];
