import React, { useState } from "react";
import { IFieldInput } from ".";
import { TextField } from "@kleros/ui-components-library";
import { cn } from "src/utils";
import { responsiveSize } from "src/styles/responsiveSize";
import { LANDSCAPE_WIDTH_CALC } from "./constants";

const LinkInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const [link, setLink] = useState(fieldProp.value ?? "");
  const [isError, setIsError] = useState(false);

  const handleChange = (value: string) => {
    setLink(value);

    if (value === "" || isValidUrl(value)) {
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
      className={cn("w-[80vw]", LANDSCAPE_WIDTH_CALC)}
      style={{ marginBottom: responsiveSize(68, 40) }}
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
