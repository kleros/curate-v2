import React from "react";
import styled from "styled-components";
import { ItemDetailsFragment } from "src/graphql/graphql";
import TextField, { ITextField } from "./TextField";
import AddressField, { IAddressField } from "./AddressField";
import LinkField from "./LinkField";
import ImageField, { IImageField } from "./ImageField";
import FileField, { IFileField } from "./FileField";
import BooleanField, { IBooleanField } from "./BooleanField";
import NumberField, { INumberField } from "./NumberField";
import ChainField, { IChainField } from "./ChainField";
import LongTextField, { ILongTextField } from "./LongTextField";
import { isProductionDeployment } from "src/consts";
import { arbitrum, arbitrumSepolia } from "@reown/appkit/networks";
import { Tooltip } from "@kleros/ui-components-library";
import WarningIcon from "src/assets/svgs/icons/warning-outline.svg";

const Container = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StyledTooltip = styled(Tooltip)`
  height: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StyledWarningIcon = styled(WarningIcon)`
  width: 14px;
  height: 14px;
`;

type ItemDetails = ItemDetailsFragment["props"][number];

export interface IItemField extends ItemDetails {
  detailed?: boolean;
  isUnrecognized?: boolean;
}

const ItemField: React.FC<IItemField> = ({ detailed, type, isUnrecognized = false, ...props }) => {
  let FieldComponent: JSX.Element | null = null;
  switch (type) {
    case "address": {
      const { value } = props as Omit<IAddressField, "chainId">;

      FieldComponent = (
        <AddressField {...{ value }} chainId={isProductionDeployment() ? arbitrum.id : arbitrumSepolia.id} />
      );
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
    case "chain": {
      const { value } = props as IChainField;

      FieldComponent = <ChainField {...{ value }} />;
      break;
    }
    case "longText": {
      const { value, label } = props as ILongTextField;

      FieldComponent = <LongTextField {...{ value, detailed, label }} />;
      break;
    }
    default: {
      const { value, label } = props as ITextField;
      FieldComponent = <TextField {...{ value, detailed, label }} />;
      break;
    }
  }
  return (
    <Container>
      {FieldComponent}
      {isUnrecognized ? (
        <StyledTooltip text="This field is not defined in list's metadata." small>
          <StyledWarningIcon />
        </StyledTooltip>
      ) : null}
    </Container>
  );
};

export default ItemField;
