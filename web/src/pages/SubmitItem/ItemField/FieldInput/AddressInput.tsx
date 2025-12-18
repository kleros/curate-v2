import React, { useState } from "react";
import { IFieldInput } from ".";
import { isAddress } from "viem";
import { TextField } from "@kleros/ui-components-library";

const AddressInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const [address, setAddress] = useState(fieldProp.value ?? "");
  const [isError, setIsError] = useState(false);

  const handleChange = (value: string) => {
    setAddress(value);

    if (value === "" || isAddress(value)) {
      setIsError(false);
      handleWrite(value);
    } else {
      setIsError(true);
      handleWrite("");
    }
  };

  return (
    <TextField
      aria-label={fieldProp.description}
      className="w-[80vw] lg:w-fluid-200-720 mb-fluid-68-40"
      value={address}
      onChange={handleChange}
      variant={isError ? "error" : "info"}
      message={fieldProp.description}
    />
  );
};

export default AddressInput;
