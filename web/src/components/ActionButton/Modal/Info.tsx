import React from "react";
import { AlertMessage } from "@kleros/ui-components-library";

interface IInfo {
  alertMessage: string;
}

const Info: React.FC<IInfo> = ({ alertMessage }) => {
  return (
    <div className="flex w-full">
      <AlertMessage className="[&_h2]:m-0" variant="info" title="Important" msg={alertMessage} />
    </div>
  );
};

export default Info;
