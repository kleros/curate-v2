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
      <NavigationButtons prevRoute="/submit-item/item-field1" nextRoute="/submit-item/preview" />
    </Container>
  );
};

export default Policy;
