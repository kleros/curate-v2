import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import PreviousButton from "./PreviousButton";
import NextButton from "./NextButton";
import SubmitItemButton from "./SubmitItemButton";

const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: ${responsiveSize(32, 24)};
  flex-wrap: wrap;
`;

interface NavigationButtonsProps {
  prevRoute?: string;
  nextRoute?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ prevRoute, nextRoute }) => {
  return (
    <Container>
      {prevRoute && <PreviousButton prevRoute={prevRoute} />}
      {prevRoute === "../policy" ? <SubmitItemButton /> : <NextButton nextRoute={nextRoute} />}
    </Container>
  );
};

export default NavigationButtons;
