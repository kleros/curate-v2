import React from "react";
import styled, { css } from "styled-components";
import NavigationButtons from "../../NavigationButtons";
import ItemFields from "./ItemFields";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import Header from "../../Header";
import PlusMinusField from "components/PlusMinusField";
import LightButton from "components/LightButton";
import HistoryIcon from "svgs/icons/history.svg";
import { ListField, useSubmitListContext } from "context/SubmitListContext";

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

const Fields: React.FC = () => {
  const { listMetadata, setListMetadata } = useSubmitListContext();

  const resetFields = () => {
    setListMetadata({
      ...listMetadata,
      columns: [
        {
          label: "",
          description: "",
          id: 0,
          isIdentifier: false,
          type: "text",
        },
      ],
    });
  };
  const updateNumberOfFields = (value: number) => {
    let defaultField: ListField = {
      label: "",
      description: "",
      id: value - 1,
      isIdentifier: false,
      type: "text",
    };
    const fields = listMetadata.columns;

    if (value < fields?.length) return setListMetadata({ ...listMetadata, columns: [...fields.splice(0, value)] });
    if (value > fields?.length) return setListMetadata({ ...listMetadata, columns: [...fields, defaultField] });
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
          <LightButton text="Reset" Icon={HistoryIcon} onClick={resetFields} />
        </ButtonContainer>
      </LabelAndButtonContainer>
      <ItemFields />
      <StyledPlusMinusField
        currentValue={listMetadata.columns?.length ?? 2}
        updateValue={updateNumberOfFields}
        minValue={1}
      />
      <NavigationButtons prevRoute="/submitList/deposit" nextRoute="/submitList/itemPreview" />
    </Container>
  );
};
export default Fields;
