import React from "react";
import { IFieldInput } from ".";
import { TextArea } from "@kleros/ui-components-library";
import { responsiveSize } from "styles/responsiveSize";
import { cn } from "src/utils";
import { LANDSCAPE_WIDTH_CALC } from "./constants";

const LongTextInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const handleChange = (value: string) => {
    handleWrite(value);
  };
  return (
    <TextArea
      aria-label={fieldProp.description}
      className={cn("[&_textarea]:w-full custom-scrollbar", LANDSCAPE_WIDTH_CALC)}
      style={{ marginBottom: responsiveSize(68, 40) }}
      resizeY
      value={fieldProp.value ?? ""}
      onChange={handleChange}
      variant="info"
      message={fieldProp.description}
    />
  );
};

export default LongTextInput;
