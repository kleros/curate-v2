import React from "react";
import styled from "styled-components";
import NavigationButtons from "../NavigationButtons";
import Title from "../Title";
import Info from "./Info";
import ConfirmationBox from "./ConfirmationBox";
import ReadPolicy from "./ReadPolicy";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Policy: React.FC = () => {
  return (
    <Container>
      <Title text="Policy Review" />
      <ReadPolicy />
      <Info />
      <ConfirmationBox />
      <NavigationButtons prevRoute="/submitItem/itemField1" nextRoute="/submitItem/preview" />
    </Container>
  );
};

export default Policy;
