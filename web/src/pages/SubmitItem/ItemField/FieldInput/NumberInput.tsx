import React from "react";
import { IFieldInput } from ".";
import { NumberField } from "@kleros/ui-components-library";

const NumberInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const handleChange = (value: number) => {
    handleWrite(value.toString());
  };
  return (
    <NumberField
      aria-label={fieldProp.description}
      className="w-[80vw] lg:w-fluid-200-720 mb-fluid-68-40"
      value={Number(fieldProp.value) ?? 0}
      onChange={handleChange}
      variant="info"
      message={fieldProp.description}
    />
  );
};

export default NumberInput;
