import React from "react";
import { IFieldInput } from ".";
import { TextArea } from "@kleros/ui-components-library";

const LongTextInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  return (
    <TextArea
      aria-label={fieldProp.description}
      className="[&_textarea]:w-full custom-scrollbar lg:w-fluid-200-720 mb-fluid-68-40"
      resizeY
      value={fieldProp.value ?? ""}
      onChange={handleWrite}
      variant="info"
      message={fieldProp.description}
    />
  );
};

export default LongTextInput;
