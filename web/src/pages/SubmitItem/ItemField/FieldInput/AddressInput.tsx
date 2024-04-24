import React, { useState } from "react";
import { IFieldInput } from ".";
import StyledField from "./StyledField";
import { isAddress } from "viem";

const AddressInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const [isError, setIsError] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAddress(event.target.value)) {
      setIsError(true);
      return;
    }
    handleWrite(event.target.value);
  };
  return (
    <StyledField
      value={fieldProp.value}
      onChange={handleChange}
      variant={isError ? "error" : "info"}
      message={fieldProp.description}
    />
  );
};

export default AddressInput;
