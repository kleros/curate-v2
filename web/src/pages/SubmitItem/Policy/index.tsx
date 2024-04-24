import React from "react";
import styled from "styled-components";
import NavigationButtons from "../NavigationButtons";
import Title from "../Title";
import Info from "./Info";
import ConfirmationBox from "./ConfirmationBox";
import ReadPolicy from "./ReadPolicy";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Policy: React.FC = () => {
  const { fieldProps } = useRegistryDetailsContext();

  return (
    <Container>
      <Title text="Policy Review" />
      <ReadPolicy />
      <Info />
      <ConfirmationBox />
      <NavigationButtons prevRoute={`../item-field/${fieldProps?.length - 1 ?? 0}`} nextRoute="../preview" />
    </Container>
  );
};

export default Policy;
