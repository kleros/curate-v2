import React from "react";
import { IFieldInput } from ".";
import { TextArea } from "@kleros/ui-components-library";
import { responsiveSize } from "styles/responsiveSize";

const LongTextInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  return (
    <TextArea
      aria-label={fieldProp.description}
      className="[&_textarea]:w-full custom-scrollbar lg:w-fluid-200-720"
      style={{ marginBottom: responsiveSize(68, 40) }}
      resizeY
      value={fieldProp.value ?? ""}
      onChange={handleWrite}
      variant="info"
      message={fieldProp.description}
    />
  );
};

export default LongTextInput;
