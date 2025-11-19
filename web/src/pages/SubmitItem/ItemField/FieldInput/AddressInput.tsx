import React, { useState } from "react";
import { IFieldInput } from ".";
import { isAddress } from "viem";
import { TextField } from "@kleros/ui-components-library";
import { responsiveSize } from "~src/styles/responsiveSize";
import { cn } from "~src/utils";
import { LANDSCAPE_WIDTH_CALC } from "./constants";

const AddressInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const [isError, setIsError] = useState(false);
  const handleChange = (value: string) => {
    if (!isAddress(value)) {
      setIsError(true);
      return;
    }
    handleWrite(value);
  };
  return (
    <TextField
      className={cn("w-[80vw]", LANDSCAPE_WIDTH_CALC)}
      style={{ marginBottom: responsiveSize(68, 40) }}
      value={fieldProp.value}
      onChange={handleChange}
      variant={isError ? "error" : "info"}
      message={fieldProp.description}
    />
  );
};

export default AddressInput;
