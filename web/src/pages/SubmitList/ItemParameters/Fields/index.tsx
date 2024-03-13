import React, { useState } from "react";
import styled, { css } from "styled-components";
import NavigationButtons from "../../NavigationButtons";
import ItemFields from "./ItemFields";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import Header from "../../Header";
import PlusMinusField from "components/PlusMinusField";
import LightButton from "components/LightButton";
import HistoryIcon from "svgs/icons/history.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 84vw;

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(442, 700, 900)};
    `
  )}
`;

const StyledPlusMinusField = styled(PlusMinusField)`
  align-self: start;
`;

const LabelAndButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 10px;
`;
const StyledLabel = styled.label`
  width: 100%;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  .button-svg {
    fill: ${({ theme }) => theme.primaryBlue};
  }
  .button-text {
    color: ${({ theme }) => theme.primaryBlue};
  }
`;

export const FieldTypes = ["Text", "Address", "Image", "Link", "Number", "Boolean", "File"] as const;

export type Field = {
  id: string;
  name: string;
  description: string;
  indexed: boolean;
  type: (typeof FieldTypes)[number];
};

const Fields: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([
    { name: "", description: "", type: "Text", indexed: true, id: "1" },
    { name: "", description: "", type: "Text", indexed: false, id: "1" },
  ]);

  const updateNumberOfFields = (value: number) => {
    let defaultField: Field = { name: "", description: "", id: value.toString(), indexed: false, type: "Text" };

    if (value < fields?.length) return setFields([...fields.splice(0, value)]);
    if (value > fields?.length) return setFields([...fields, defaultField]);
  };

  return (
    <Container>
      <Header text="Item Fields" />
      <LabelAndButtonContainer>
        <StyledLabel>
          Include the fields you want to be displayed on the items on the list. You can add multiple fields by clicking
          on (+). The field order defined here will be used to display the items on the interface. If your item has an
          image, or name add them as the first fields.
        </StyledLabel>
        <ButtonContainer>
          <LightButton text="Reset" Icon={HistoryIcon} />
        </ButtonContainer>
      </LabelAndButtonContainer>
      <ItemFields fields={fields} />
      <StyledPlusMinusField currentValue={fields?.length ?? 2} updateValue={updateNumberOfFields} minValue={2} />
      <NavigationButtons prevRoute="/submitList/deposit" nextRoute="/submitList/itemPreview" />
    </Container>
  );
};
export default Fields;
