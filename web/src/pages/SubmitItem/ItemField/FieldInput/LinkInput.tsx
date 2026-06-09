import React, { useState } from "react";
import { IFieldInput } from ".";
import { TextField } from "@kleros/ui-components-library";
import { getSafeNavigationUrl } from "utils/urlValidation";

const LinkInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const [link, setLink] = useState(fieldProp.value ?? "");
  const [isError, setIsError] = useState(false);

  const handleChange = (value: string) => {
    setLink(value);

    if (value === "" || getSafeNavigationUrl(value)) {
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
      value={link}
      className="w-[80vw] lg:w-fluid-200-720 mb-fluid-68-40"
      onChange={handleChange}
      variant={isError ? "error" : "info"}
      message={fieldProp.description}
    />
  );
};

export default LinkInput;
