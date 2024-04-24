import React, { useState } from "react";
import { IFieldInput } from ".";
import StyledField from "./StyledField";

const LinkInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const [isError, setIsError] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isValidUrl(event.target.value)) {
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

const isValidUrl = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

export default LinkInput;
