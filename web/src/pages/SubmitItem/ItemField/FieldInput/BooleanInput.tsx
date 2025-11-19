import React from "react";
import { IFieldInput } from ".";
import { Switch } from "@kleros/ui-components-library";

const BooleanInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const valueAsBool = fieldProp.value === "true";
  const handleChange = () => {
    handleWrite(valueAsBool ? "false" : "true");
  };
  return <Switch name={fieldProp.description} isSelected={valueAsBool} onChange={handleChange} />;
};

export default BooleanInput;
