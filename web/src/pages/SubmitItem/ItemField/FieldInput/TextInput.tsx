import React from "react";
import { IFieldInput } from ".";
import { TextField } from "@kleros/ui-components-library";

const TextInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  return (
    <TextField
      aria-label={fieldProp.description}
      value={fieldProp.value ?? ""}
      className="w-[80vw] lg:w-fluid-200-720 mb-fluid-68-40"
      onChange={handleWrite}
      variant="info"
      message={fieldProp.description}
    />
  );
};

export default TextInput;
