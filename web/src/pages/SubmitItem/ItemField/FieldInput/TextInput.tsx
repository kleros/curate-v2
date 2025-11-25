import React from "react";
import { IFieldInput } from ".";
import { TextField } from "@kleros/ui-components-library";
import { responsiveSize } from "src/styles/responsiveSize";
import { cn } from "src/utils";
import { LANDSCAPE_WIDTH_CALC } from "./constants";

const TextInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const handleChange = (value: string) => {
    handleWrite(value);
  };
  return (
    <TextField
      value={fieldProp.value}
      className={cn("w-[80vw]", LANDSCAPE_WIDTH_CALC)}
      style={{ marginBottom: responsiveSize(68, 40) }}
      onChange={handleChange}
      variant="info"
      message={fieldProp.description}
    />
  );
};

export default TextInput;
