import React from "react";
import { AlertMessage } from "@kleros/ui-components-library";

interface IInfo {
  alertMessage: string;
}

const Info: React.FC<IInfo> = ({ alertMessage }) => {
  return <AlertMessage className="w-full" variant="info" title="Important" msg={alertMessage} />;
};

export default Info;
