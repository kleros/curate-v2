import React from "react";
import { AlertMessage } from "@kleros/ui-components-library";

const alertMessage =
  "The item must follow the Policy. Items that do not follow the policy risk" +
  " being challenged and removed. The deposit required is reimbursed if the item is included, and the" +
  " deposit is lost if the item is removed. Make sure you read and understand the policy before proceeding.";

const Info: React.FC = () => {
  return (
    <AlertMessage className="w-[84vw] mb-8 lg:w-fluid-342-618" variant="info" title="Important" msg={alertMessage} />
  );
};

export default Info;
