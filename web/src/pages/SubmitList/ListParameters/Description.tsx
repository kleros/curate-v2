import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import NavigationButtons from "../NavigationButtons";
import InfoCard from "components/InfoCard";
import Header from "../Header";
import { Field } from "@kleros/ui-components-library";
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

const FieldContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledField = styled(Field)`
  width: 100%;
`;

const StyledInfoCard = styled(InfoCard)`
  width: 100%;
`;

const Description: React.FC = () => {
  const { listMetadata, setListMetadata } = useSubmitListContext();

  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListMetadata({ ...listMetadata, description: event.target.value });
  };
  return (
    <Container>
      <Header text="Description" />
      <FieldContainer>
        <StyledField
          onChange={handleWrite}
          placeholder="eg. A list of public name tags, associated with Ethereum mainnet contract addresses."
          value={listMetadata.description}
        />
        <StyledInfoCard msg="Type a short sentence describing the content of the list. eg. A list of public name tags, associated with Ethereum mainnet contract addresses." />
      </FieldContainer>

      <NavigationButtons prevRoute="/submit-list/title" nextRoute="/submit-list/logo" />
    </Container>
  );
};
export default Description;
