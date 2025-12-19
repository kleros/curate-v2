import React from "react";
import { Checkbox } from "@kleros/ui-components-library";
import { useSubmitItemContext } from "context/SubmitItemContext";

interface IConfirmationBox {}

const ConfirmationBox: React.FC<IConfirmationBox> = ({}) => {
  const { isPolicyRead, setIsPolicyRead } = useSubmitItemContext();

  return (
    <Checkbox
      className="mb-8"
      label="I certify that I read and understand the Policy"
      isSelected={isPolicyRead}
      small
      onChange={setIsPolicyRead}
    />
  );
};

export default ConfirmationBox;
