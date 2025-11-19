import React from "react";
import { IFieldInput } from ".";
import { TextArea } from "@kleros/ui-components-library";
import { responsiveSize } from "styles/responsiveSize";
import { cn } from "~src/utils";

const landscapeWitdhCalc = "lg:w-[calc(200px+(720-200)*(min(max(100vw,375px),1250px)-375px)/(1250-375))]";

const LongTextInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const handleChange = (value: string) => {
    handleWrite(value);
  };
  return (
    <TextArea
      className={cn("w-[80vw] h-fit", landscapeWitdhCalc)}
      style={{ marginBottom: responsiveSize(68, 40) }}
      resizeY
      value={fieldProp.value}
      onChange={handleChange}
      variant="info"
      message={fieldProp.description}
    />
  );
};

export default LongTextInput;
