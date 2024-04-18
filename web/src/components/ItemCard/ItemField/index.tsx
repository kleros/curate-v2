import React from "react";
import { ItemDetailsFragment } from "src/graphql/graphql";
import TextField, { ITextField } from "./TextField";
import AddressField, { IAddressField } from "./AddressField";
import LinkField from "./LinkField";
import ImageField, { IImageField } from "./ImageField";
import FileField, { IFileField } from "./FileField";
import BooleanField, { IBooleanField } from "./BooleanField";
import NumberField, { INumberField } from "./NumberField";

type ItemDetails = ItemDetailsFragment["props"][number];

export interface IItemField extends ItemDetails {
  detailed?: boolean;
}

const ItemField: React.FC<IItemField> = ({ detailed, type, ...props }) => {
  let FieldComponent: JSX.Element | null = null;
  switch (type) {
    case "address": {
      const { value } = props as Omit<IAddressField, "chainId">;

      FieldComponent = <AddressField {...{ value }} chainId={421614} />;
      break;
    }
    case "link": {
      const { value } = props as Omit<IAddressField, "chainId">;

      FieldComponent = <LinkField {...{ value }} />;
      break;
    }
    case "image": {
      const { value } = props as IImageField;

      FieldComponent = <ImageField {...{ value, detailed }} />;
      break;
    }
    case "file": {
      const { value, label } = props as IFileField;

      FieldComponent = <FileField {...{ value, label }} />;
      break;
    }
    case "boolean": {
      const { value, label, description } = props as IBooleanField;

      FieldComponent = <BooleanField {...{ value, label, detailed, description }} />;
      break;
    }
    case "number": {
      const { value, label, description } = props as INumberField;

      FieldComponent = <NumberField {...{ value, detailed, label, description }} />;
      break;
    }
    default: {
      const { value, label } = props as ITextField;
      FieldComponent = <TextField {...{ value, detailed, label }} />;
      break;
    }
  }
  return FieldComponent;
};

export default ItemField;
