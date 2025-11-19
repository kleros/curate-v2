import React from "react";
import { AlertMessage } from "@kleros/ui-components-library";
import { cn } from "~src/utils";

const landscapeWitdhCalc = "lg:w-[calc(342px+(618-342)*(min(max(100vw,375px),1250px)-375px)/(1250-375))]";

const alertMessage =
  "The item must follow the Policy. Items that do not follow the policy risk" +
  " being challenged and removed. The deposit required is reimbursed if the item is included, and the" +
  " deposit is lost if the item is removed. Make sure you read and understand the policy before proceeding.";

const Info: React.FC = () => {
  return (
    <div className={cn("flex justify-center w-[84vw] mb-8", landscapeWitdhCalc)}>
      <AlertMessage variant="info" title="Important" msg={alertMessage} />
    </div>
  );
};

export default Info;
