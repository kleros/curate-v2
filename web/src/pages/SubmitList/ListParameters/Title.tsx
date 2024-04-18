import React from "react";
import styled, { css } from "styled-components";
import { Field } from "@kleros/ui-components-library";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import NavigationButtons from "../NavigationButtons";
import Header from "../Header";
import InfoCard from "components/InfoCard";
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

const Title: React.FC = () => {
  const { listMetadata, setListMetadata } = useSubmitListContext();

  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListMetadata({ ...listMetadata, title: event.target.value });
  };
  return (
    <Container>
      <Header text="Name" />
      <FieldContainer>
        <StyledField onChange={handleWrite} placeholder="eg. Address Tags" value={listMetadata.title} />
        <StyledInfoCard msg="Choose a short name for the list." />
      </FieldContainer>
      <NavigationButtons prevRoute="" nextRoute="/submit-list/description" />
    </Container>
  );
};
export default Title;
