import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import { Card } from "@kleros/ui-components-library";
import NavigationButtons from "../NavigationButtons";
import ListDisplay from "./ListDisplay";
import ItemDisplay from "./ItemDisplay";

const Container = styled.div`
  width: 100%;
  padding: 0px ${responsiveSize(10, 130)};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px dashed ${({ theme }) => theme.primaryBlue};
  background-color: ${({ theme }) => theme.mediumBlue};
  height: auto;
  min-height: 100px;
  margin-bottom: ${responsiveSize(0, 16)};
  padding: ${responsiveSize(24, 48)} ${responsiveSize(24, 32)};
  gap: 32px;
  position: relative;
`;

const Title = styled.h2`
  margin-bottom: 32px;
  width: 84vw;
  text-align: center;
  font-weight: 600;

  ${landscapeStyle(
    () => css`
      width: auto;
    `
  )}
`;
const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;
const Preview: React.FC = () => {
  return (
    <Container>
      <Title>Preview</Title>
      <StyledCard>
        <ListDisplay />
        <ItemDisplay />
        <Overlay />
      </StyledCard>
      <NavigationButtons prevRoute="../policy" />
    </Container>
  );
};

export default Preview;
