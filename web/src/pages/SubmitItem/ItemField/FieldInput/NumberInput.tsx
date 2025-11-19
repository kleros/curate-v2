import React from "react";
import { IFieldInput } from ".";
import { NumberField } from "@kleros/ui-components-library";
import { responsiveSize } from "~src/styles/responsiveSize";
import { cn } from "~src/utils";

const landscapeWitdhCalc = "lg:w-[calc(200px+(720-200)*(min(max(100vw,375px),1250px)-375px)/(1250-375))]";

const NumberInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const handleChange = (value: number) => {
    handleWrite(value.toString());
  };
  return (
    <NumberField
      className={cn("w-[80vw]", landscapeWitdhCalc)}
      style={{ marginBottom: responsiveSize(68, 40) }}
      value={Number(fieldProp.value)}
      onChange={handleChange}
      variant="info"
      message={fieldProp.description}
    />
  );
};

export default NumberInput;
