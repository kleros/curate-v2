import React from "react";
import styled from "styled-components";
import PreviousButton from "./PreviousButton";
import NextButton from "./NextButton";

const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
`;

interface NavigationButtonsProps {
  prevRoute: string;
  nextRoute?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ prevRoute, nextRoute }) => {
  return (
    <Container>
      <PreviousButton prevRoute={prevRoute} />
      <NextButton nextRoute={nextRoute} />
    </Container>
  );
};

export default NavigationButtons;
