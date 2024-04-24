import { RegistryDetailsQuery } from "src/graphql/graphql";
import AddressInput from "./AddressInput";
import React from "react";
import LinkInput from "./LinkInput";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import FileInput from "./FileInput";
import ImageInput from "./ImageInput";
import BooleanInput from "./BooleanInput";

type FieldProp = NonNullable<RegistryDetailsQuery["registry"]>["fieldProps"][number] & { value?: string };
export interface IFieldInput {
  fieldProp: FieldProp;
  handleWrite: (value: string) => void;
}

const FieldInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  let FieldComponent: JSX.Element | null = null;
  switch (fieldProp.type) {
    case "address": {
      FieldComponent = <AddressInput {...{ fieldProp, handleWrite }} />;
      break;
    }
    case "link": {
      FieldComponent = <LinkInput {...{ fieldProp, handleWrite }} />;
      break;
    }
    case "text": {
      FieldComponent = <TextInput {...{ fieldProp, handleWrite }} />;
      break;
    }
    case "number": {
      FieldComponent = <NumberInput {...{ fieldProp, handleWrite }} />;
      break;
    }
    case "file": {
      FieldComponent = <FileInput {...{ fieldProp, handleWrite }} />;
      break;
    }
    case "image": {
      FieldComponent = <ImageInput {...{ fieldProp, handleWrite }} />;
      break;
    }
    case "boolean": {
      FieldComponent = <BooleanInput {...{ fieldProp, handleWrite }} />;
      break;
    }
    default: {
      FieldComponent = <TextInput {...{ fieldProp, handleWrite }} />;
      break;
    }
  }
  return FieldComponent;
};

export default FieldInput;
