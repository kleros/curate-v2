import React from "react";
import { IFieldInput } from ".";
import { TextField } from "@kleros/ui-components-library";
import { responsiveSize } from "src/styles/responsiveSize";

const TextInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  return (
    <TextField
      aria-label={fieldProp.description}
      value={fieldProp.value ?? ""}
      className="w-[80vw] lg:w-fluid-200-720"
      style={{ marginBottom: responsiveSize(68, 40) }}
      onChange={handleWrite}
      variant="info"
      message={fieldProp.description}
    />
  );
};

export default TextInput;
