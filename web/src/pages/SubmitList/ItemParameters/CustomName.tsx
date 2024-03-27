import React from "react";
import styled, { css } from "styled-components";
import NavigationButtons from "../NavigationButtons";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import Header from "../Header";
import LabeledInput from "components/LabeledInput";
import { useSubmitListContext } from "context/SubmitListContext";

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

const StyledLabel = styled.label`
  width: 100%;
`;

const InputContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
  ${landscapeStyle(
    () => css`
      grid-template-columns: 1fr 1fr;
    `
  )}
`;

const CustomName: React.FC = () => {
  const { listMetadata, setListMetadata } = useSubmitListContext();
  return (
    <Container>
      <Header text="Custom Item Name" />
      <StyledLabel>
        By default, we use the words (item, items) to describe the content of a list. If desired, you can customize it.
        Example: A list of: (Token, Tokens), (Tag, Tags), (Car, Cars), etc.
      </StyledLabel>
      <InputContainer>
        <LabeledInput
          topLeftLabel="Custom item name"
          placeholder="Item"
          value={listMetadata.itemName}
          onChange={(event) => setListMetadata({ ...listMetadata, itemName: event.target.value })}
        />
        <LabeledInput
          topLeftLabel="Plural"
          placeholder="Items"
          value={listMetadata.itemNamePlural}
          onChange={(event) => setListMetadata({ ...listMetadata, itemNamePlural: event.target.value })}
        />
      </InputContainer>
      <NavigationButtons prevRoute="/submitList/itemPreview" nextRoute="/submitList/advanced" />
    </Container>
  );
};
export default CustomName;
