import React, { useState } from "react";
import { IFieldInput } from ".";
import { isAddress } from "viem";
import { TextField } from "@kleros/ui-components-library";
import { responsiveSize } from "~src/styles/responsiveSize";
import { cn } from "~src/utils";

const landscapeWitdhCalc = "lg:w-[calc(200px+(720-200)*(min(max(100vw,375px),1250px)-375px)/(1250-375))]";

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
      className={cn("w-[80vw]", landscapeWitdhCalc)}
      style={{ marginBottom: responsiveSize(68, 40) }}
      value={fieldProp.value}
      onChange={handleChange}
      variant={isError ? "error" : "info"}
      message={fieldProp.description}
    />
  );
};

export default AddressInput;
