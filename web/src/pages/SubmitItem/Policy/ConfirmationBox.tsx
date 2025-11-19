import React from "react";
import { Checkbox } from "@kleros/ui-components-library";
import { useSubmitItemContext } from "context/SubmitItemContext";

interface IConfirmationBox {}

const ConfirmationBox: React.FC<IConfirmationBox> = ({}) => {
  const { isPolicyRead, setIsPolicyRead } = useSubmitItemContext();

  return (
    <div className="mb-8">
      <Checkbox
        label="I certify that I read and understand the Policy "
        isSelected={isPolicyRead}
        small
        onChange={() => setIsPolicyRead(!isPolicyRead)}
      />
    </div>
  );
};

export default ConfirmationBox;
