import React from "react";
import { IFieldInput } from ".";
import { NumberField } from "@kleros/ui-components-library";
import { responsiveSize } from "src/styles/responsiveSize";
import { cn } from "src/utils";
import { LANDSCAPE_WIDTH_CALC } from "./constants";

const NumberInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const handleChange = (value: number) => {
    handleWrite(value.toString());
  };
  return (
    <NumberField
      className={cn("w-[80vw]", LANDSCAPE_WIDTH_CALC)}
      style={{ marginBottom: responsiveSize(68, 40) }}
      value={Number(fieldProp.value) ?? 0}
      onChange={handleChange}
      variant="info"
      message={fieldProp.description}
    />
  );
};

export default NumberInput;
